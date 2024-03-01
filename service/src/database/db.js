const { Sequelize } = require('sequelize');

/**
 * Sets up the database and table definitions
 * @type {Promise<Sequelize>}
 */
const sequelize = new Promise(async (res) => {
    console.log('Getting database')

    const db = await ((process.env.ONLINE) ? getProductionDatabase() : getLocalDatabase());

    const modelDefiners = [
        require('./model/book.model'),
        // Add more models here...
    ];

    for (const modelDefiner of modelDefiners) {
        modelDefiner(db);
    }

    res(db);
})

async function getProductionDatabase() {
    console.log('Getting production database');

    const secretsClient = require('../utils/secretsClient');
    const db_username = await secretsClient.getSecret('DB-USERNAME')
    const db_password = await secretsClient.getSecret('DB-PASSWORD')
    const db_host = await secretsClient.getSecret('DB-HOST')

    return new Sequelize(
        process.env.DB, 
        db_username.value, 
        db_password.value, 
        {
            logging:false,
            host:db_host.value,
            dialect: 'mssql',
            dialectOptions: {
                encrypt: true
            }
        }
    );
}

async function getLocalDatabase() {
    console.log('Getting local database');

    return new Sequelize('sqlite::memory:',{
        logging: false
    });
}


module.exports = sequelize;