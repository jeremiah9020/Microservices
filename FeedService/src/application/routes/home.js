const express = require('express');
const router = express.Router();
const { serviceRequest, authenticate, grpc: {recipe} } = require('shared');

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
    const recipes = await recipe.getFeed(items, set) || [];  
  
    // successfully retrieved home feed
    return res.status(200).json({ recipes });
  } catch (err) {
    console.log(err)
    return res.status(500).json({ error: 'something went wrong' });
  }
});

module.exports = router;