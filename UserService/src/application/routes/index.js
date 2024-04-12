const express = require('express');
const router = express.Router();
const sequelize = require('../../database/db');
const { authenticate } = require('shared');

/**
 * Used to get a user’s data.
 */
router.get('/', authenticate.loosely, async function(req, res, next) {
  const { username } = req.query;
  
  if (username == null && !req.username ) {
    return res.status(400).json(`Missing request query parameters`);
  }

  const db = await sequelize;

  try {
    const user = await db.models.user.findByPk(username || req.username, {
      include: [
        { model: db.models.user, as: 'following' },
        { model: db.models.recipe, as: 'recipes'},
        { model: db.models.cookbook, as: 'cookbooks'}
      ]
    });

    const followers = await db.models.user.count({
      include: [
        {
          model: db.models.user, 
          as: 'following', 
          where: { username: username || req.username }
        }
      ]
    });

    const recipes = user.recipes.map(x => x.rid);
    const cookbooks = user.cookbooks.map(x => x.cid);
    const following = user.following.map(x => x.username);
    const data = JSON.parse(user.data);

    // successfully retrieved the user data
    return res.status(200).json({ user: {recipes, cookbooks, followers, following, data}});
  } catch (err) {
    // could not find the user
    return res.status(404).json({error: 'could not find the user'});
  } 
});

/**
 * Used to update a user’s data.
 */
router.patch('/', authenticate.strictly, async function(req, res, next) {
  const { data } = req.body;

  if (data == null) {
    return res.status(400).json(`Missing request body parameters`);
  }

  const db = await sequelize;

  try {    
    const user = await db.models.user.findByPk(req.username);
    user.data = JSON.stringify(data);
    await user.save();

    // successfully saved the user data
    return res.status(200).send();
  } catch (err) {
    // could not find the user
    return res.status(404).json({error: 'could not find the user'});
  } 
});

module.exports = router;