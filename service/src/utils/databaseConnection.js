const { Sequelize } = require("sequelize");

/**
 * Checks if the database is connected
 * @param {Sequelize} db 
 */
module.exports = async function isDatabaseConnected(db) {
	console.log('Checking database connection');
	try {
		console.log(db)
		await db.authenticate();
		console.log('Database connection OK!');
	} catch (error) {
		console.error('Unable to connect to the database:');
		console.error(error.message);
		process.exit(1);
	}
}