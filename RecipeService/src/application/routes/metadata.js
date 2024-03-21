const express = require('express');
const router = express.Router();
const sequelize = require('../../database/db');

/**
 * Used to get a recipe’s metadata.
 */
router.get('/', async function(req, res, next) {
  const { id } = req.query;
  
  if (id == null) {
    return res.status(400).json(`Missing request query parameters`);
  }

  const db = await sequelize;

  try {
    const recipeMetadata = await db.models.recipeMetadata.findByPk(id)

    const metadata = {
      owner: recipeMetadata.owner,
      versions: JSON.parse(recipeMetadata.versions),
      latest: recipeMetadata.latest
    }
  
    // successfully retrieved the recipe metadata
    return res.status(200).json({ metadata });

    // TODO lacking authorization to view content
    return res.status(403).json({error: 'lacking authorization to view the recipe metadata'});
  } catch (error) {
    // could not find the recipe
    return res.status(404).json({error: 'could not find the recipe'});
  }
});

module.exports = router;