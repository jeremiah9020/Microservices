const express = require('express');
const router = express.Router();
const sequelize = require('../../database/db');
const { authenticate } = require('shared');

/**
 * Used to add or remove a recipe from the recipes list.
 */
router.patch('/', authenticate.server, async function(req, res, next) {
  const { username, add, remove } = req.body;

  if (username == null) {
    return res.status(400).json(`Missing request body parameters`);
  }

  const db = await sequelize;

  const user = await db.models.user.findByPk(username);

  if (user == null) {
     // could not find the user
    return res.status(404).json({error: 'could not find the user'});
  }

  const recipes = JSON.parse(user.recipes);

  if (remove) {
    for (const toRemove of remove) {
      const index = recipes.indexOf(toRemove);
      recipes.splice(index, 1);
    }
  }

  if (add) {
    for (const toAdd of add) {
      recipes.push(toAdd);
    }
  }

  await user.update({recipes: JSON.stringify(recipes)});

  // user's authentication data successfully delete
  return res.status(200).send();
});


module.exports = router;