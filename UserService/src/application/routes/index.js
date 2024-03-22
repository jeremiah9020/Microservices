const express = require('express');
const router = express.Router();
const sequelize = require('../../database/db');
const { authenticate, role: {getRoleObject} } = require('shared');


/**
 * Used to create a user
 * 
 * Only usable by servers
 */
router.post('/', authenticate.server, async function(req, res, next) {
  const { username } = req.body;
  
  if (username == null ) {
    return res.status(400).json(`Missing request query parameters`);
  }

  const db = await sequelize;

  const data = JSON.stringify({ description: ""})

  try {
    // TODO: create a default cookbook

    await db.models.user.create({ username, data})
    return res.status(200).send();
  } catch (err) {
    // could not find the user
    return res.status(500).json({error: 'could not create the user, maybe its already taken?'});
  } 
});

/**
 * Used to get a user’s data.
 */
router.get('/', async function(req, res, next) {
  const { username } = req.query;
  
  if (username == null ) {
    return res.status(400).json(`Missing request query parameters`);
  }

  const db = await sequelize;

  try {
    const user = await db.models.user.findByPk(username);

    const recipes = JSON.parse(user.recipes);
    const cookbooks = JSON.parse(user.cookbooks);
    const following = JSON.parse(user.following);
    const followers = user.followers;
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
  const { username, data } = req.body;

  if (data == null) {
    return res.status(400).json(`Missing request body parameters`);
  }

  const db = await sequelize;

  try {
    const serverRequest = req.fromServer && username;
    
    if (req.fromServer) {
      if (username) {
        const user = await db.models.user.findByPk(username);
        user.data = JSON.stringify(data);
        await user.save();
  
        // successfully saved the user data
        return res.status(200).send();
      } else {

        // lacking authorization to update content
        return res.status(400).json(`Missing request body parameters`);
      }
    } else {
      const user = await db.models.user.findByPk(req.username);
      user.data = JSON.stringify(data);
      await user.save();

      // successfully saved the user data
      return res.status(200).send();
    }
  } catch (err) {
    // could not find the user
    return res.status(404).json({error: 'could not find the user'});
  } 
});

module.exports = router;