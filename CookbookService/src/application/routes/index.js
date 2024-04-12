const express = require('express');
const router = express.Router();
const { authenticate, serviceRequest, role: {getRoleObject: getRoleObject} } = require('shared');
const { v4: uuidv4 } = require('uuid');
const sequelize = require('../../database/db');

/**
 * Creates a new cookbook
 */
router.post('/', authenticate.strictly, async function(req, res, next) {
  const { title, id, visibility, user } = req.body;

  if (title == null) {
    return res.status(400).json(`Missing request body parameters`);
  }
  const owner = req.username || user;

  if (owner == null) {
    return res.status(400).json(`Missing request body parameters`);
  }

  const db = await sequelize;

  const cookbookId = id ? id : uuidv4(); 

  try {
    const cookbook = await db.models.cookbook.create(
      { 
        id: cookbookId, 
        title, 
        owner, 
        visibility 
      }
    );
  
    const section = await db.models.section.create({});
  
    await cookbook.addSection(section);
  
    await serviceRequest('UserService','/cookbooks', { method: 'patch'}, { username: owner, add: [cookbookId]})
  
    // successfully created the cookbook
    return res.status(200).json({id: cookbookId}); 
  } catch (err) {
    return res.status(500).json({error: 'could not create the cookbook'}); 
  }
 
});

/**
 * Gets a cookbook by id
 */
router.get('/', authenticate.loosely, async function(req, res, next) {
  const { id } = req.query;
  
  if (id == null ) {
    return res.status(400).json(`Missing request query parameters`);
  }

  const db = await sequelize;

  try {
    const cookbook = await db.models.cookbook.findByPk(id, {
      include: [
        { model: db.models.section, include: db.models.recipe},
      ]
    });

    const cookbookIsVisible = cookbook.visibility != 'private';
    const userIsOwner = cookbook.owner == req.username;
    const serverRequest = req.fromServer;
    const userHasRole = async () => {
      if (req.username) {
        const response = await serviceRequest('AuthService', `/role?user=${req.username}`, {method: 'get'});
        const json = await response.json();
        return getRoleObject(json.role).canSeePrivateCookbooks;
      }
      return false;
    }

    if (serverRequest || cookbookIsVisible || userIsOwner || await userHasRole()) {
      const cookbookData = {
        title: cookbook.title,
        owner: cookbook.owner,
        times_copied: cookbook.times_copied,
        references: cookbook.references,
        is_a_copy: cookbook.is_a_copy,
        visibility: cookbook.visibility,
      }

      const sections = []
      for (const section of cookbook.sections) {
        const sectionObj = {
          title: section.title,
          recipes: []
        }

        for (const recipe of section.recipes) {
          const recipeObj = {
            id: recipe.rid,
            version: recipe.version
          }

          sectionObj.recipes.push(recipeObj)
        }

        sections.push(sectionObj)
      }

      cookbookData.sections = sections;

      // successfully retrieved the cookbook data
      return res.status(200).json({ cookbook: cookbookData });

    } else {
      // lacking authorization to view content
      return res.status(403).json({error: 'lacking authorization to view the cookbook'});
    }   
  } catch (err) {
    // could not find the cookbook
    return res.status(404).json({error: 'could not find the cookbook'});
  }
});

/**
 * Updates a cookbook by id
 */
router.patch('/', authenticate.strictly, async function(req, res, next) {
  const { id, visibility, sections } = req.body;

  if (id == null) {
    return res.status(400).json(`Missing request body parameters`);
  }

  const owner = req.username;

  if (!owner) {
    return res.status(500).json(`Currently, the server is not allowed to edit cookbooks`);
  }

  const db = await sequelize;

  try {
    const cookbook = await db.models.cookbook.findByPk(id, {
      include: [
        { model: db.models.section, include: db.models.recipe},
      ]
    });

    if (cookbook == null) throw new Error('Couldn\'t find cookbook');


    if (cookbook.owner == req.username) {
      if (visibility == null && sections == null) {
        return res.status(400).json(`Missing request body parameters`);
      } 
      
      if (visibility != null) {
        cookbook.visibility = visibility
        await cookbook.save();
      }

      if (sections != null) {
        for (const section of cookbook.sections) {
          for (const recipe of section.recipes) {
            await section.removeRecipe(recipe);

            try {
              await serviceRequest('RecipeService', '/reference/decrement', {method: 'post'}, { id: recipe.rid, version: recipe.version });
            } catch (err) {}   

            await recipe.destroy();
          }
          await cookbook.removeSection(section);

          await section.destroy();
        }

        for (const section of sections) {
          const newSection = await db.models.section.create({title: section.title});

          for (const recipe of section.recipes) {
            try {
              await serviceRequest('RecipeService', '/reference/increment', {method: 'post'}, { id: recipe.id, version: recipe.version });
              
              const newRecipe = await db.models.recipe.create({rid: recipe.id, version: recipe.version});                

              await newSection.addRecipe(newRecipe);

            } catch (err) {
            }              
          }

          await cookbook.addSection(newSection);
        }
      }
      
      // successfully updated the cookbook data
      return res.status(200).send();
    } else {
      // lacking authorization to patch content
      return res.status(403).json({error: 'lacking authorization to update the cookbook'});
    }
  } catch (err) {

    console.log(err)
    // could not find the cookbook
    return res.status(404).json({error: 'could not find the cookbook'});
  }
});

module.exports = router;