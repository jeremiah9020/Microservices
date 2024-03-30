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
    const Section = require('./model/section.model')(db);
    const Recipe = require('./model/recipe.model')(db);

    Cookbook.hasMany(Section);
    Section.hasMany(Recipe);

    res(db);
})



module.exports = sequelize;