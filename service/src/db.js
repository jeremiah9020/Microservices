const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('service-db', 'RecipesAdmin', 'Romans323!', {
    host: 'recipes-database-server.database.windows.net',
    dialect: 'mssql',
    dialectOptions: {
        encrypt: true
    }
});
  
const modelDefiners = [
	require('./model/book.model'),
	// Add more models here...
];

for (const modelDefiner of modelDefiners) {
	modelDefiner(sequelize);
}

console.log(sequelize.models.book)

module.exports = sequelize;