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
  
    const recipeMetadata = await db.models.metadata.findByPk(id, {
      include: [
          db.models.version, 
          { model: db.models.version, as: 'latest'},
          { model: db.models.version, include: db.models.recipe }
        ]
      } 
    );

    const versions = []
    for (const version of recipeMetadata.versions) {
      versions.push(version.name);
    }

    const metadata = {
      owner: recipeMetadata.owner,
      versions: versions,
      latest: recipeMetadata.latest.name
    }
  
    // successfully retrieved the recipe metadata
    return res.status(200).json({ metadata });
  } catch (error) {
    // could not find the recipe
    return res.status(404).json({error: 'could not find the recipe'});
  }
});

module.exports = router;