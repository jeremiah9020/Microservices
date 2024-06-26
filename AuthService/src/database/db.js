const { Sequelize } = require('sequelize');
const { getProductionDatabase, getLocalDatabase } = require('shared').database;

/**
 * Sets up the database and table definitions
 * @type {Promise<Sequelize>}
 */
const sequelize = new Promise(async (res) => {
    console.log('Getting database')

    const db = await ((process.env.ONLINE) ? getProductionDatabase() : getLocalDatabase());

    const modelDefiners = [
        require('./model/auth.model'),
        // Add more models here...
    ];

    for (const modelDefiner of modelDefiners) {
        modelDefiner(db);
    }

    res(db);
})

module.exports = sequelize;