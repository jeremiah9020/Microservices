const { grpc: { def: { cookbook: cookbookDef }, user: userGRPC } } = require('shared');
const grpc = require('@grpc/grpc-js')
const sequelize = require('../database/db');
const { Op } = require('sequelize');
const {v4: uuidv4} = require('uuid');

async function create(call, callback) {
    const { username, title } = call.request;
  
    const db = await sequelize;
  
    try {
        const cookbookId = uuidv4(); 
    
        const cookbook = await db.models.cookbook.create(
            { 
                id: cookbookId, 
                title, 
                owner: username,  
            }
        );
        
        const section = await db.models.section.create({});
        
        await cookbook.addSection(section);
        
        await userGRPC.updateCookbooks(username, [cookbookId], [])
        
        return callback(null, {});
    } catch (err) {
        return callback(new Error('Could not create the cookbook'), {});
    }
}

async function getFeed(call, callback) {
    let { items, set, query } = call.request;

    items = items || 50;
    set = set || 1;
  
    const db = await sequelize;
  
    let cookbooks;
    if (query == null) {
      cookbooks = await db.models.cookbook.findAll({
        limit: items, 
        offset: items * (set - 1),
        order: [
          ['references','DESC']
        ]
      });
    } else {
      cookbooks = await db.models.cookbook.findAll({
        where: {
          title: {
            [Op.like]: `%${query.toLowerCase()}%`
          }
        },
        limit: items, 
        offset: items * (set - 1),
        order: [
          ['references','DESC']
        ]
      });
    }
  
    const data = cookbooks.map(x => x.id);
  
    return callback(null, { cookbooks: data});
}

async function decrement(call, callback) {
    const { id } = call.request;

    const db = await sequelize;

    try {
        const cookbook = await db.models.cookbook.findByPk(id);

        cookbook.references -= 1;
        await cookbook.save();
    
        if (cookbook.references == 0) {
            await cookbook.destroy({include: {model: db.models.section, include: db.models.recipe }})
        }

        return callback(null, {});
    } catch (err) {
        return callback('Could not decrement cookbook reference count', {});
    }
}

async function increment(call, callback) {
    const { id } = call.request;

    const db = await sequelize;

    try {
        const cookbook = await db.models.cookbook.findByPk(id);

        cookbook.references += 1;
        await cookbook.save();
        
        return callback(null, {});
    } catch (err) {
        return callback('Could not increment cookbook reference count', {});
    }
}

/**
 * Starts the gRPC server
 * @param {number} port 
 */
function startGRPC(port) {   
    // gRPC server setup
    const grpcServer = new grpc.Server();
    grpcServer.addService(cookbookDef.Cookbook.service, { create, getFeed, increment, decrement });
    grpcServer.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure() , () => {});
}

module.exports = { startGRPC }

