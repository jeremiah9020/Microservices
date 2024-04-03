const express = require('express');
const router = express.Router();
const sequelize = require('../../database/db');
const { authenticate }= require('shared')

/**
 * Increments a recipes reference count
 */
router.post('/increment/', authenticate.server, async function(req, res, next) {
  const { id } = req.body;

  if (id == null) {
    return res.status(400).json(`Missing request body parameters`);
  }

  const db = await sequelize;

  try {
    const recipeMetadata = await db.models.metadata.findByPk(id);

    recipeMetadata.references += 1;
    await recipeMetadata.save();
    
      // successfully retrieved the recipe
    return res.status(200).send();
  } catch (error) {

    // could not find the recipe
    return res.status(404).json({error: 'could not find the recipe'});
  }
});

/**
 * Decrements a recipes reference count
 */
router.post('/decrement/', authenticate.server, async function(req, res, next) {
  const { id } = req.body;

  if (id == null) {
    return res.status(400).json(`Missing request body parameters`);
  }

  const db = await sequelize;

  try {
    const recipeMetadata = await db.models.metadata.findByPk(id);

    recipeMetadata.references -= 1;
    await recipeMetadata.save();

    if (recipeMetadata.references == 0) {
      await recipeMetadata.destroy({include: {model: db.models.version, include: { model: db.models.recipe, include: db.models.rating}}})
    }
        
      // successfully retrieved the recipe
    return res.status(200).send();
  } catch (error) {
    // could not find the recipe
    return res.status(404).json({error: 'could not find the recipe'});
  }
});

module.exports = router;
