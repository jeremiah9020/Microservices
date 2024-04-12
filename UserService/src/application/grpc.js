const { grpc: { def: { user: userDef } }, serviceRequest } = require('shared');
const grpc = require('@grpc/grpc-js')
const sequelize = require('../database/db');
const { Op } = require('sequelize');

async function updateCookbooks(call, callback) {
    const { username, add, remove } = call.request;   
  
    const db = await sequelize;
  
    // Get the user
    const user = await db.models.user.findByPk(username, {include: [ 
        { model: db.models.cookbook, as: 'cookbooks'},
    ]});
      
    if (user == null) {
        // could not find the user
        return callback('Could not find the user', {});
    }
    
    if (remove) {
        for (const toRemove of remove) {
            const cookbook = user.cookbooks.find(x => x.cid == toRemove);
            if (!cookbook) continue
    
            try {
                await user.removeCookbook(cookbook);
                await cookbook.destroy();
        
                await serviceRequest('CookbookService','/reference/decrement', {method: 'post'}, {
                    id: toRemove,
                })        
            } catch (err) {}
        }
    }
    
      
    if (add) {
        for (const toAdd of add) {
            try {
                const cookbook = await db.models.cookbook.create({ cid: toAdd });
                await user.addCookbook(cookbook)
        
                await serviceRequest('CookbookService','/reference/increment', {method: 'post'}, {
                    id: toAdd,
                })
            } catch (err) {}
        } 
    }
        
    return callback(null, {});
}

async function updateRecipes(call, callback) {
    const { username, add, remove } = call.request;   
  
    const db = await sequelize;
  
    // Get the user
    const user = await db.models.user.findByPk(username, {include: [ 
        { model: db.models.cookbook, as: 'cookbooks'},
    ]});
      
    if (user == null) {
        // could not find the user
        return callback('Could not find the user', {});
    }
    
   
    if (remove) {
        for (const toRemove of remove) {
            const cookbook = user.cookbooks.find(x => x.cid == toRemove);
            if (!cookbook) continue
    
            try {
                await user.removeCookbook(cookbook);
                await cookbook.destroy();
        
                await serviceRequest('RecipeService','/reference/decrement', {method: 'post'}, {
                    id: toRemove,
                })        
            } catch (err) {}
        }
    }
    
      
    if (add) {
        for (const toAdd of add) {
            try {
                const cookbook = await db.models.cookbook.create({ cid: toAdd });
                await user.addCookbook(cookbook)
        
                await serviceRequest('RecipeService','/reference/increment', {method: 'post'}, {
                    id: toAdd,
                })
            } catch (err) {}
        } 
    }
        
    return callback(null, {});
}

async function deleteUser(call, callback) {
    const { username } = call.request;
  
    const db = await sequelize;
  
    const user = await db.models.user.findByPk(username, {include: [
      {model: db.models.recipe, as: 'recipes'},
      {model: db.models.cookbook, as: 'cookbooks'},
    ]});
  
    if (user == null) {
        return callback('Could not find the user', {});
    }
  
    for (const recipe of user.recipes) {
      const id = recipe.rid
      await user.removeRecipe(recipe);
      await recipe.destroy();
  
      await serviceRequest('RecipeService','/reference/decrement', {method: 'post'}, { id })  
    }
  
    for (const cookbook of user.cookbooks) {
      const id = cookbook.cid
      await user.removeCookbook(cookbook);
      await cookbook.destroy();
  
      await serviceRequest('CookbookService','/reference/decrement', {method: 'post'}, { id })
    }
  
    await user.destroy({include: {model: db.models.user, as: 'following'}});

    return callback(null, {});
}

async function create(call, callback) {
    const { username } = call.request;

    const db = await sequelize;

    const data = JSON.stringify({ description: ""})

    try {
        await db.models.user.create({ username, data })

        await serviceRequest('CookbookService', '/', {method: 'post'}, { title: 'Default Cookbook', user: username });

        return callback(null, {});
    } catch (err) {
        return callback('Could not create the user', {});
    }     
}

async function getFeed(call, callback) {
    let { items, set, query } = call.request;

    items = items || 50;
    set = set || 1;
  
    const db = await sequelize;
  
    let users;
    if (query == null) {
      users = await db.models.user.findAll({
        limit: items, 
        offset: items * (set - 1)
      });
    } else {
      users = await db.models.user.findAll({
        where: {
          username: {
            [Op.like]: `%${query.toLowerCase()}%`
          }
        },
        limit: items, 
        offset: items * (set - 1),
      });
    }
  
    const data = users.map(x => x.username);

    return callback(null, { users: data });
}

/**
 * Starts the gRPC server
 * @param {number} port 
 */
function startGRPC(port) {   
    // gRPC server setup
    const grpcServer = new grpc.Server();
    grpcServer.addService(userDef.User.service, { updateCookbooks, updateRecipes, delete: deleteUser, create, getFeed });
    grpcServer.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure() , () => {});
}

module.exports = { startGRPC }

