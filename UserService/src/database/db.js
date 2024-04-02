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
    const Entry = require('./model/entry.model')(db);

    User.hasMany(User, { as: 'following' });
    User.hasMany(Entry, { as: 'recipes' });
    User.hasMany(Entry, { as: 'cookbooks' });

    res(db);
})

module.exports = sequelize;