const express = require('express');
const router = express.Router();
const sequelize = require('../../database/db');
const { authenticate, serviceRequest } = require('shared');

/**
 * Used to delete a user completely, requires reauthentication.
 * 
 * Used only by the server
 */
router.post('/', authenticate.server, async function(req, res, next) {
  const { username } = req.body;

  if (username == null ) {
    return res.status(400).json(`Missing request body parameters`);
  }

  const db = await sequelize;

  const user = await db.models.user.findByPk(username, {include: [
    {model: db.models.recipe, as: 'recipes'},
    {model: db.models.cookbook, as: 'cookbooks'},
  ]});

  if (user == null) {
     // could not find the user
    return res.status(404).json({error: 'could not find the user'});
  }

  console.log(1)

  for (const recipe of user.recipes) {
    const id = recipe.rid
    await user.removeRecipe(recipe);
    await recipe.destroy();

    await serviceRequest('RecipeService','/reference/decrement', {method: 'post'}, { id })  
  }

  for (const cookbook of user.cookbooks) {
    const id = cookbook.cid
    await user.removeCookbook(cookbook);
    await cookbook.destroy();

    await serviceRequest('CookbookService','/reference/decrement', {method: 'post'}, { id })
  }


  await user.destroy({include: {model: db.models.user, as: 'following'}});

  // user's authentication data successfully delete
  return res.status(200).send();
});

module.exports = router;