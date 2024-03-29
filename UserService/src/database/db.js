const { Sequelize } = require('sequelize');
const { getProductionDatabase, getLocalDatabase } = require('shared').database;

/**
 * Sets up the database and table definitions
 * @type {Promise<Sequelize>}
 */
const sequelize = new Promise(async (res) => {
    console.log('Getting database')

    const db = await ((process.env.ONLINE) ? getProductionDatabase() : getLocalDatabase());

    const Cookbook = require('./model/cookbook.model')(db);
    const Recipe = require('./model/recipe.model')(db);
    const User = require('./model/user.model')(db);

    User.hasMany(User, { as: 'following' });
    User.hasMany(Recipe, { as: 'recipes' });
    User.hasMany(Cookbook, { as: 'cookbooks' });

    res(db);
})

module.exports = sequelize;