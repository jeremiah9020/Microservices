const express = require('express');
const router = express.Router();
const { serviceRequest, authenticate } = require('shared');

/**
 * Used to get a user’s home feed, or a generic one if no user is logged in. Works in batches.
 */
router.get('/', authenticate.loosely, async function(req, res, next) {
  let { items, set } = req.query;
  
  items = items || 50;
  set = set || 1;

  if (items == null || set == null ) {
    return res.status(400).json(`Missing request query parameters`);
  }

  try {

    const recipeResponse = await serviceRequest('RecipeService',`/feed?items=${items}&set=${set}`,{method:'get'});
    const { recipes } = await recipeResponse.json()
  
    // successfully retrieved home feed
    return res.status(200).json({ recipes });
  } catch (err) {
    return res.status(500).json({ error: 'something went wrong' });
  }
});

module.exports = router;