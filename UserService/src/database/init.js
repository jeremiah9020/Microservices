const {Sequelize} = require('sequelize');
/**
 * 
 * @param {Sequelize} db 
 */
module.exports = async (db) => {   
    console.log('Attempting to sync models')
    try {
        await db.models.user.sync({ force: !process.env.ONLINE })
        await db.models.recipe.sync({ force: !process.env.ONLINE })
        await db.models.cookbook.sync({ force: !process.env.ONLINE })
        await db.models.follow.sync({ force: !process.env.ONLINE })
        console.log('Models successfully synced');
    } catch (error) {
        console.error('Unable to sync the models:');
        console.error(error.message);
        process.exit(1);
    }
}