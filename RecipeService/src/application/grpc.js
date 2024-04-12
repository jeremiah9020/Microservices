const { grpc: { def: { recipe: recipeDef } } } = require('shared');
const grpc = require('@grpc/grpc-js')
const sequelize = require('../database/db');
const { Op } = require('sequelize');

async function getFeed(call, callback) {
    let {items, set, query } = call.request;

    items = items || 50;
    set = set || 1;
  
    const db = await sequelize;
  
    let recipes;
    if (query == null) {
      recipes = await db.models.metadata.findAll({
        include: {
          model: db.models.version,
          as: 'latest',
          include: db.models.recipe
        },
        where: {
          '$latest.recipe.visibility$': 'public'
        },
        limit: items, 
        offset: items * (set - 1),
        order: [
          ['references','DESC']
        ]
      });
    } else {
      recipes = await db.models.metadata.findAll({
        include: {
          model: db.models.version,
          as: 'latest',
          include: db.models.recipe         
        },
        where: {
          '$latest.recipe.visibility$': 'public',
          '$latest.recipe.data$': {
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
    
    const data = recipes.map(x => x.id);

    return callback(null, { recipes: data });
}

async function decrement(call, callback) {
    const { id } = call.request;

    const db = await sequelize;
    
    try {
        const recipeMetadata = await db.models.metadata.findByPk(id);
    
        recipeMetadata.references -= 1;
        await recipeMetadata.save();
    
        if (recipeMetadata.references == 0) {
            await recipeMetadata.destroy({include: {model: db.models.version, include: { model: db.models.recipe, include: db.models.rating}}})
        }
            
        return callback(null, {});
      } catch (error) {
        return callback('Could not remove reference count from recipe.', {});
      }
}

async function increment(call, callback) {
    const { id } = call.request;

    const db = await sequelize;
  
    try {
        const recipeMetadata = await db.models.metadata.findByPk(id);
    
        recipeMetadata.references += 1;
        await recipeMetadata.save();
      
        return callback(null, {});
    } catch (error) {  
        return callback('Could not add reference count to recipe.', {});
    }
}

/**
 * Starts the gRPC server
 * @param {number} port 
 */
function startGRPC(port) {   
    // gRPC server setup
    const grpcServer = new grpc.Server();
    grpcServer.addService(recipeDef.Recipe.service, { increment, decrement, getFeed });
    grpcServer.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure() , () => {});
}

module.exports = { startGRPC }

