const { Sequelize } = require('sequelize');
const { getProductionDatabase, getLocalDatabase } = require('shared').database;

/**
 * Sets up the database and table definitions
 * @type {Promise<Sequelize>}
 */
const sequelize = new Promise(async (res) => {
    console.log('Getting database')

    const db = await ((process.env.ONLINE) ? getProductionDatabase() : getLocalDatabase());
    
    const Recipe = require('./model/recipe.model')(db);
    const Rating = require('./model/rating.model')(db);
    const Version = require('./model/version.model')(db);
    const Metadata = require('./model/metadata.model')(db);

    Recipe.hasMany(Rating);
    Metadata.hasMany(Version);
    Metadata.hasOne(Recipe, {as: 'latest'});
    Version.hasOne(Recipe);

    res(db);
})



module.exports = sequelize;