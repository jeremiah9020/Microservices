const express = require('express');
const router = express.Router();
const sequelize = require('../../database/db');
const { authenticate } = require('shared')

/**
 * Changes a rating by recipe id
 */
router.post('/', authenticate.strictly, async function(req, res, next) {
    const { id, rating } = req.body;
    
    if (id == null || rating == null) {
      return res.status(400).json(`Missing request query parameters`);
    }

    if (req.fromServer ) {
        return res.status(500).json(`Servers cannot change ratings`);
    }
  
    const db = await sequelize;
  
    try {
        const recipeMetadata = await db.models.metadata.findByPk(id, {
            include: [
                { model: db.models.version, as: 'latest', include: [ 
                    { model: db.models.recipe, include: db.models.rating }
                ]},
            ]
        });
   
        const recipe = recipeMetadata.latest.recipe;
        const oldRating = recipe.ratings.find(x => x.owner == req.username);

        if (!oldRating) {
            const newRating = await db.models.rating.create({ owner: req.username, rating: rating });
            await recipe.addRating(newRating);
        } else {
            oldRating.rating = rating;
            await oldRating.save();
        }
    
        return res.status(200).send();
    } catch (error) {
  
      // could not find the recipe
      return res.status(404).json({error: 'could not find the recipe'});
    }
});


module.exports = router;