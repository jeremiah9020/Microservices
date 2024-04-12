const express = require('express');
const router = express.Router();
const { grpc: { user, recipe, cookbook } } = require('shared');

/**
 * Used to get a feed based on a query.
 */
router.get('/', async function(req, res, next) {
  let { type, items, set, query } = req.query;
  items = items || 50;
  set = set || 1;
  
  if (query == null) {
    return res.status(400).json(`Missing request query parameters`);
  }

  let recipes = [];
  let cookbooks = [];
  let users = [];


  try {
    if (type == 'user') {
      users = await user.getFeed(items, set, query) || [];  
    } else {
      users = await user.getFeed(Math.floor(items/4), set, query) || [];
      cookbooks = await cookbook.getFeed(Math.floor(items/4), set, query) || [];  
      recipes = await recipe.getFeed(Math.floor(items/2), set, query) || [];  
    }
  
    // successfully retrieved home feed
    return res.status(200).json({ recipes, cookbooks, users });
  } catch (err) {
    console.log(err)
    return res.status(500).json({ error: 'something went wrong' });
  }
});

module.exports = router;