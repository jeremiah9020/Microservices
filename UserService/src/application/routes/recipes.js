const express = require('express');
const router = express.Router();
const sequelize = require('../../database/db');
const { authenticate, grpc: { auth: { getRole }, recipe: recipeGRPC} } = require('shared');

/**
 * Used to add or remove a recipe from the recipes list.
 */
router.patch('/', authenticate.strictly, async function(req, res, next) {
  const { username, add, remove } = req.body;


  let owner;
  if (username == null || username == req.username) {
    owner = req.username;
  } else {
    owner = username;

    const role = await getRole(req.username);
    if (!role.canDeleteCookbooks) {
      // not authorized
      return res.status(403).json({error: 'Lacking authorization to delete user.'});
    }
  }

  if (owner == null) {
    return res.status(400).json(`Missing request body parameters`);
  }

  const db = await sequelize;

  try {
    const user = await db.models.user.findByPk(owner, {include: [ 
      { model: db.models.recipe, as: 'recipes'},
    ]});

    if (user == null) {
       // could not find the user
      return res.status(404).json({error: 'could not find the user'});
    }
  
    if (remove) {
      for (const toRemove of remove) {
        try {
          const recipe = user.recipe.find(x => x.rid == toRemove);

          await user.removeRecipe(recipe);
          await recipe.destroy();

          await recipeGRPC.decrement(toRemove);
        } catch (err) {}
      }
    }
  
    if (add) {
      for (const toAdd of add) {
        const recipe = await db.models.recipe.create({ rid: toAdd });
        await user.addRecipe(recipe);

        await recipeGRPC.increment(toAdd);
      }
    }
  
    // user's recipes successfully updated
    return res.status(200).send();
  } catch (err) {
    console.log(err)
    return res.status(500).send('Something went wrong.');
  }
});


module.exports = router;