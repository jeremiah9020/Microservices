const { Sequelize } = require("sequelize");

/**
 * Checks if the database is connected
 * @param {Sequelize} db 
 */
async function isDatabaseConnected(db) {
	console.log('Checking database connection');
	try {
		await db.authenticate();
		console.log('Database connection OK!');
	} catch (error) {
		console.error('Unable to connect to the database:');
		console.error(error.message);
		process.exit(1);
	}
}


async function getProductionDatabase() {
    console.log('Getting production database');

    const secretsClient = await require('shared').secretsClient;
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

module.exports = { isDatabaseConnected, getProductionDatabase, getLocalDatabase }