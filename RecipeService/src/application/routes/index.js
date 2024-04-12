const express = require('express');
const router = express.Router();
const sequelize = require('../../database/db');
const { v4: uuidv4 } = require('uuid');
const { authenticate, serviceRequest, grpc } = require('shared');

function getRecipe(recipeMetadata, version) {
  // If the version id is given, use it! Otherwise, use the latest tag
  let recipe = recipeMetadata.latest.recipe;
  if (version != null) {
    const recipeVersions = recipeMetadata.versions;


    const recipeVersion = recipeVersions.find(x => x.name == version);

    if (!recipeVersion) {
      throw new Error();
    }

    recipe = recipeVersion.recipe;
  }
  return recipe
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
    const recipeMetadata = await db.models.metadata.findByPk(id, {
      include: [
        db.models.version, 
        { model: db.models.version, as: 'latest', include: [ 
          { model: db.models.recipe, include: db.models.rating }
        ]},
        { model: db.models.version, include: [ 
          { model: db.models.recipe, include: db.models.rating }
        ]}
      ]
    });

    const recipe = getRecipe(recipeMetadata, version);

    const recipeIsVisible = recipe.visibility != 'private';
    const userIsOwner = recipeMetadata.owner == req.username;
    const serverRequest = req.fromServer;
    const userHasRole = async () => {
      if (req.username) {
        const role = await grpc.auth.getRole(req.username);
        return role.canSeePrivatePosts;
      }
      return false;
    }

    if (serverRequest || recipeIsVisible || userIsOwner || await userHasRole()) {
      const data = JSON.parse(recipe.data)
      const average = recipe.ratings.length ? recipe.ratings.reduce((a, b) => a.rating + b.rating) / recipe.ratings.length : 0;

      const recipeData = {
        owner: recipeMetadata.owner,
        visibility: recipe.visibility,
        rating: average,
        data
      }
    
      // successfully retrieved the recipe
      return res.status(200).json({ recipe: recipeData });
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

  const db = await sequelize;

  try {
    const metadataId = id ? id : uuidv4(); 
    const recipeTag = (tag == null) ? 'original' : tag;
    const recipeData = JSON.stringify(data);
  
    const recipe = await db.models.recipe.create({ data: recipeData, visibility });
    const version = await db.models.version.create({ name: recipeTag });
    const metadata = await db.models.metadata.create({ id: metadataId, owner });
  
    await metadata.addVersion(version);
    await metadata.setLatest(version);
    await version.setRecipe(recipe);
  
    await serviceRequest('UserService','/recipes', { method: 'patch'}, { username: req.username, add: [metadataId]})
  
    // successfully created the recipe
    return res.status(200).json({id: metadataId}); 
  } catch (err) {
    // successfully created the recipe
    return res.status(500).json({error: 'Could not create the recipe'}); 
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
    const recipeMetadata = await db.models.metadata.findByPk(id, {
      include: [
        db.models.version, 
        { model: db.models.version, as: 'latest', include: db.models.recipe },
        { model: db.models.version, include: db.models.recipe }
      ]
    });

    if (recipeMetadata == null) throw new Error(); 

    const userIsOwner = recipeMetadata.owner == req.username
    const serverRequest = req.fromServer

    if (userIsOwner || serverRequest) {
      if (data == null) {
        const recipe = getRecipe(recipeMetadata, version)
        if (visibility != null) {
          recipe.visibility = visibility
          await recipe.save();
          return res.status(200).json({ version: version || 'latest' });
        } else {
          return res.status(400).json(`Missing request body parameters`);
        }
      } else {
        if (data.title == null || data.text == null) {
          return res.status(400).json(`Missing request body parameters`);
        }

        const recipeData = JSON.stringify(data);
      
        try {
          const recipeVersions = recipeMetadata.versions;
          const recipeTag = (tag == null) ? uuidv4() : tag;
  
          if (recipeVersions.some(x => x.name == recipeTag)) return res.status(500).json({error: 'Something went wrong creating a new recipe. The tag was already in use!'});
  
  
          const recipe = await db.models.recipe.create({ data: recipeData, visibility });
          const version = await db.models.version.create({ name: recipeTag });
      
          await recipeMetadata.addVersion(version);
          await version.setRecipe(recipe);

          if (visibility == 'public' || visibility == null) {
            recipeMetadata.setLatest(version);
          } 

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

module.exports = router;