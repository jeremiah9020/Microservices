const express = require('express');
const router = express.Router();
const { serviceRequest } = require('shared');

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
      const userResponse = await serviceRequest('UserService',`/feed?items=${items}&set=${set}&query=${query}`,{method:'get'});
  
      users = (await userResponse.json()).users
    } else {
      const userResponse = await serviceRequest('UserService',`/feed?items=${Math.floor(items/4)}&set=${set}&query=${query}`,{method:'get'});
      const cookbookResponse = await serviceRequest('CookbookService',`/feed?items=${Math.floor(items/4)}&set=${set}&query=${query}`,{method:'get'});
      const recipeResponse = await serviceRequest('RecipeService',`/feed?items=${Math.floor(items/2)}&set=${set}&query=${query}`,{method:'get'});
  
      users = (await userResponse.json()).users
      cookbooks = (await cookbookResponse.json()).cookbooks
      recipes = (await recipeResponse.json()).recipes
    }
  
    // successfully retrieved home feed
    return res.status(200).json({ recipes, cookbooks, users });
  } catch (err) {
    return res.status(500).json({ error: 'something went wrong' });
  }
});

module.exports = router;