const express = require('express');
const { serviceBridge }  = require('shared')
const router = express.Router();

/**
 * Used to get a recipe’s metadata.
 */
router.get('/', async function(req, res, next) {
  const { id } = req.query;
  
  if (id == null) {
    return res.status(400).json(`Missing request query parameters`);
  }

  const metadata = undefined;

  // successfully retrieved the recipe metadata
  return res.status(200).json({ metadata })

  // lacking authorization to view content
  return res.status(403).json({error: 'lacking authorization to view the recipe metadata'});

  // could not find the recipe
  return res.status(404).json({error: 'could not find the recipe'});
});

module.exports = router;