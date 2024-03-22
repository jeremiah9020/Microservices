const express = require('express');
const router = express.Router();
const sequelize = require('../../database/db');
const { v4: uuidv4 } = require('uuid');
const { authenticate } = require('shared');
const { serviceBridge } = require('shared');
const { getRoleObject } = require('shared/utils/roles');

function getRecipeId(recipeMetadata, version) {
  // If the version id is given, use it! Otherwise, use the latest tag
  let recipeId = recipeMetadata.latest;
  if (version != null) {
    const recipeVersions = JSON.parse(recipeMetadata.versions);

    if (!recipeVersions.hasOwnProperty(version)) {
      throw new Error();
    }

    recipeId = recipeVersions[version];
  }
  return recipeId
}

/**
 * Gets a recipe by id
 */
router.get('/', authenticate.loosely, async function(req, res, next) {
  const { id, version } = req.query;
  
  if (id == null ) {
    return res.status(400).json(`Missing request query parameters`);
  }

  const db = await sequelize;

  try {
    const recipeMetadata = await db.models.recipeMetadata.findByPk(id);

    const recipeId = getRecipeId(recipeMetadata, version);

    const recipeData = await db.models.recipe.findByPk(recipeId);

    const recipeIsVisible = recipeData.visibility != 'private';
    const userIsOwner = recipeMetadata.owner == req.username;
    const serverRequest = req.fromServer;
    const userHasRole = async () => {
      if (req.username) {
        const request = await serviceBridge('AuthService', `/role?user=${req.username}`, {method: 'get'});
        const response = await request.json();
        return getRoleObject(response.role).canSeePrivatePosts;
      }
      return false;
    }

    if (serverRequest || recipeIsVisible || userIsOwner || userHasRole()) {
      const ratings = JSON.parse(recipeData.ratings)
      const data = JSON.parse(recipeData.data)
      const average = ratings.length ? ratings.reduce((a, b) => a + b) / ratings.length : 0;

      const recipe = {
        owner: recipeMetadata.owner,
        visibility: recipeData.visibility,
        references: recipeData.references,
        rating: average,
        data
      }
    
      // successfully retrieved the recipe
      return res.status(200).json({ recipe });
    }

    // lacking authorization to view content
    return res.status(403).json({error: 'lacking authorization to view the recipe'});    
  } catch (error) {
    // could not find the recipe
    return res.status(404).json({error: 'could not find the recipe'});
  }
});

/**
 * creates a new recipe
 */
router.post('/', authenticate.strictly, async function(req, res, next) {
  const { id, tag, visibility, data } = req.body;

  if (data == null || data.title == null || data.text == null) {
    return res.status(400).json(`Missing request body parameters`);
  }

  const owner = req.username;

  if (!owner) {
    return res.status(500).json(`Currently, the server is not allowed to create recipes`);
  }

  // TODO: send an update request to the USER service telling it a new recipes is created.

  const db = await sequelize;

  let metadataId = id ? id : uuidv4(); 

  const recipeId = uuidv4();
  const recipeTag = (tag == null) ? 'original' : tag;
  const versions = JSON.stringify({[recipeTag]: recipeId});
  const latest = recipeId;
  const recipeData = JSON.stringify(data);

  try {
    await db.models.recipeMetadata.create({ id: metadataId, owner, versions, latest});
    await db.models.recipe.create({ id: recipeId, data: recipeData, visibility });

    // successfully created the recipe
    return res.status(200).json({id: metadataId});

    
  } catch (err) {
    return res.status(500).json({error: 'Something went wrong when creating your recipe. If you gave a recipe id, it might already be taken!'});
  }
});

/**
 * Used to edit an existing recipe, will create a new version if data field is included.
 */
router.patch('/', authenticate.strictly, async function(req, res, next) {
  const { id, version, tag, visibility, data } = req.body;

  if (id == null) {
    return res.status(400).json(`Missing request body parameters`);
  }

  const db = await sequelize;

  try {
    const recipeMetadata = await db.models.recipeMetadata.findByPk(id);
    if (recipeMetadata == null) throw new Error(); 

    const userIsOwner = recipeMetadata.owner == req.username
    const serverRequest = req.fromServer

    if (userIsOwner || serverRequest) {
      if (data == null) {
        const recipeId = getRecipeId(recipeMetadata, version)
        const recipe = await db.models.recipe.findByPk(recipeId);
        if (visibility != null) {
          recipe.visibility = visibility
          await recipe.save();
          return res.status(200).json({ version: version || 'latest' });
        }
      } else {
        const recipeId = uuidv4();
        const recipeData = JSON.stringify(data);
      
        try {
          const recipeVersions = JSON.parse(recipeMetadata.versions);
          const recipeTag = (tag == null) ? uuidv4() : tag;
  
          if (recipeVersions.hasOwnProperty(recipeTag)) return res.status(500).json({error: 'Something went wrong creating a new recipe. The tag was already in use!'});
  
          if (visibility == 'public' || visibility == null) {
            recipeMetadata.latest = recipeId;
          } 
          recipeVersions[recipeTag] = recipeId;
          recipeMetadata.versions = JSON.stringify(recipeVersions);
  
          await db.models.recipe.create({ id: recipeId, data: recipeData, visibility });
          await recipeMetadata.save();
  
          // successfully updated the recipe
          return res.status(200).json({version: recipeTag});
        } catch (err) {
          return res.status(500).json({error: 'Something went wrong creating a new recipe.'});
        }
      }
    }

    // lacking authorization to update content
    return res.status(403).json({error: 'lacking authorization to update the recipe'});
  } catch (err) {
    // could not find the recipe
    return res.status(404).json({error: 'could not find the recipe'});
  }
});

/**
 * TODO: Used to delete a recipe or a recipe version.
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