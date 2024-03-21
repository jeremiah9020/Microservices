const {Sequelize} = require('sequelize');
/**
 * 
 * @param {Sequelize} db 
 */
module.exports = async (db) => {   
    console.log('Attempting to sync models')
    try {
        await db.models.recipe.sync({ force: !process.env.ONLINE })
        await db.models.recipeMetadata.sync({ force: !process.env.ONLINE })
        console.log('Models successfully synced');
        
        if  (!process.env.ONLINE) {
            console.log('Attempting to create a recipe');
            try {
                const id = 'reserved';
                const owner = 'admin';
                const versions = JSON.stringify([id]);
                const latest = id;
                const data = JSON.stringify({title: 'TestRecipe', text:'1: cook it\n2: eat it'})

                await db.models.recipeMetadata.create({ id, owner, versions, latest });
                await db.models.recipe.create({ id, owner, data });

                console.log('Recipe successfully created');
            } catch (error) {
                console.error('Unable to create the recipe:');
                console.error(error.message);
                process.exit(1);
            }
        }
    } catch (error) {
        console.error('Unable to sync the models:');
        console.error(error.message);
        process.exit(1);
    }
}