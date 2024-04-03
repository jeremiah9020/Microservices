const express = require('express');
const router = express.Router();
const sequelize = require('../../database/db');
const { authenticate }= require('shared')

/**
 * Increments a cookbook reference count
 */
router.post('/increment/', authenticate.server, async function(req, res, next) {
  const { id } = req.body;

  if (id == null) {
    return res.status(400).json(`Missing request body parameters`);
  }

  const db = await sequelize;

  try {
    const cookbook = await db.models.cookbook.findByPk(id);

    cookbook.references += 1;
    await cookbook.save();
    
      // successfully retrieved the recipe
    return res.status(200).send();
  } catch (error) {

    // could not find the recipe
    return res.status(404).json({error: 'could not find the recipe'});
  }
});

/**
 * Decrements a cookbook's reference count
 */
router.post('/decrement/', authenticate.server, async function(req, res, next) {
  const { id } = req.body;

  if (id == null) {
    return res.status(400).json(`Missing request body parameters`);
  }

  const db = await sequelize;

  try {
    const cookbook = await db.models.cookbook.findByPk(id);


    cookbook.references -= 1;
    await cookbook.save();

    if (cookbook.references == 0) {
      await cookbook.destroy({include: {model: db.models.section, include: db.models.recipe }})
    }
        
      // successfully retrieved the recipe
    return res.status(200).send();
  } catch (error) {
    // could not find the recipe
    return res.status(404).json({error: 'could not find the recipe'});
  }
});

module.exports = router;
