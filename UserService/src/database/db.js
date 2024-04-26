const { Sequelize } = require('sequelize');
const { getProductionDatabase, getLocalDatabase } = require('shared').database;

/**
 * Sets up the database and table definitions
 * @type {Promise<Sequelize>}
 */
const sequelize = new Promise(async (res) => {
    console.log('Getting database')

    const db = await ((process.env.ONLINE) ? getProductionDatabase() : getLocalDatabase());

    const User = require('./model/user.model')(db);
    const Cookbook = require('./model/cookbook.model')(db);
    const Recipe = require('./model/recipe.model')(db);
    
    db.define('follow', {});
    User.belongsToMany(User, { as: 'followers', through: db.models.follow, foreignKey: 'userId' });
    User.belongsToMany(User, { as: 'following', through: db.models.follow, foreignKey: 'followerId' });
    User.hasMany(Recipe, { as: 'recipes' });
    User.hasMany(Cookbook, { as: 'cookbooks' });

    res(db);
})

module.exports = sequelize;