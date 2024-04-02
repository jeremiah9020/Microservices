const express = require('express');
const router = express.Router();
const sequelize = require('../../database/db');
const { authenticate } = require('shared');

/**
 * Used to add or remove a recipe from the recipes list.
 * 
 * Usable only by the server
 */
router.patch('/', authenticate.server, async function(req, res, next) {
  const { username, add, remove } = req.body;

  if (username == null) {
    return res.status(400).json(`Missing request body parameters`);
  }

  const db = await sequelize;

  try {
    const user = await db.models.user.findByPk(username, {include: [ 
      { model: db.models.entry, as: 'recipes'},
    ]});

    if (user == null) {
       // could not find the user
      return res.status(404).json({error: 'could not find the user'});
    }
  
    if (remove) {
      for (const toRemove of remove) {
        try {
          const recipe = user.recipe.find(x => x.value == toRemove);
          await user.removeRecipe(recipe);
          await recipe.destroy();
        } catch (err) {}
      }
    }
  
    if (add) {
      for (const toAdd of add) {
        const recipe = await db.models.entry.create({value: toAdd});
        await user.addRecipe(recipe);
      }
    }
  
    // user's recipes successfully updated
    return res.status(200).send();
  } catch (err) {
    return res.status(500).send('Something went wrong.');
  }
});


module.exports = router;