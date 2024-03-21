const express = require('express');
const { serviceBridge }  = require('shared')
const router = express.Router();

/**
 * Gets a recipe by id
 */
router.get('/', async function(req, res, next) {
  const { id, version } = req.query;
  
  if (id == null ) {
    return res.status(400).json(`Missing request query parameters`);
  }

  const recipe = undefined;

  // successfully retrieved the recipe
  return res.status(200).json({ recipe });

  // lacking authorization to view content
  return res.status(403).json({error: 'lacking authorization to view the recipe'});

  // could not find the recipe
  return res.status(404).json({error: 'could not find the recipe'});
});

/**
 * creates a new recipe
 */
router.post('/', async function(req, res, next) {
  const { owner, version, visibility, data } = req.body;

  if (owner == null ) {
    return res.status(400).json(`Missing request body parameters`);
  }

  // successfully created the recipe
  return res.status(200).send();

  // lacking authorization to create content
  return res.status(403).json({error: 'lacking authorization to create the recipe'});
});

/**
 * Used to edit an existing recipe, will create a new version if data field is included.
 */
router.patch('/', async function(req, res, next) {
  const { id, version, visibility, data } = req.body;

  if (id == null) {
    return res.status(400).json(`Missing request body parameters`);
  }

  const versionId = undefined;

  // successfully updated the recipe
  return res.status(200).json({version: versionId});

  // lacking authorization to update content
  return res.status(403).json({error: 'lacking authorization to update the recipe'});

  // could not find the recipe
  return res.status(404).json({error: 'could not find the recipe'});
});

/**
 * Used to delete a recipe or a recipe version.
 */
router.delete('/', async function(req, res, next) {
  const { id, version } = req.query;
  
  if (id == null) {
    return res.status(400).json(`Missing request query parameters`);
  }

  // successfully deleted the recipe
  return res.status(200).send()

  // lacking authorization to delete content
  return res.status(403).json({error: 'lacking authorization to delete the recipe'});

  // could not find the recipe
  return res.status(404).json({error: 'could not find the recipe'});
});

module.exports = router;