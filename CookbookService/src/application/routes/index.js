const express = require('express');
const router = express.Router();
const { authenticate, serviceRequest, role: {getRoleObject: getRoleObject} } = require('shared');
const { v4: uuidv4 } = require('uuid');
const sequelize = require('../../database/db');

/**
 * Creates a new cookbook
 */
router.post('/', authenticate.strictly, async function(req, res, next) {
  const { title, id, visibility } = req.body;

  if (title == null) {
    return res.status(400).json(`Missing request body parameters`);
  }
  const owner = req.username;

  if (!owner) {
    return res.status(500).json(`Currently, the server is not allowed to create cookbooks`);
  }

  const db = await sequelize;

  const cookbookId = id ? id : uuidv4(); 


  const transaction = await db.transaction();
  try {
    const cookbook = await db.models.cookbook.create(
      { 
        id: cookbookId, 
        title, 
        owner, 
        visibility 
      }, { transaction }
    );

    const section = await db.models.section.create({}, { transaction });

    await cookbook.addSection(section);

    await serviceRequest('UserService','/cookbooks', { method: 'patch'}, { username: req.username, add: [cookbookId]})

    await transaction.commit();
  
    // successfully created the recipe
    return res.status(200).json({id: cookbookId}); 
  }
  catch (err) {
    await transaction.rollback();
    return res.status(500).json({error: 'Something went wrong when creating your cookbook.'});
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
            id: recipe.id,
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
        const transaction = await db.transaction();
        try {
          for (const section of cookbook.sections) {
            for (const recipe of section.recipes) {
              await section.removeRecipe(recipe, { transaction });

              // TODO: I think right here we may be holding on to old recipes and sections, they may need to be deleted, not sure tho!
              // TODO: here I should decrement the reference count on the recipes in RecipeService
            }
            await cookbook.removeSection(section, { transaction });
          }

          for (const section of sections) {
            const newSection = await db.models.section.create({title: section.title}, { transaction });

            for (const recipe of section.recipes) {
              const newRecipe = await db.models.recipe.create({id: recipe.id, version: recipe.version}, { transaction });

              await newSection.addRecipe(newRecipe, { transaction });

              // TODO: here I should increment the reference count on the recipes in RecipeService. When doing so, I might want to validate each recipe individually, only adding those that exist.
              
            }

            await cookbook.addSection(newSection, { transaction });
          }

          await transaction.commit();
        }
        catch (err) {
          await transaction.rollback();
          return res.status(500).json({error: 'Something went wrong when creating your cookbook.'});
        }

         // successfully updated the cookbook data
         return res.status(200).send();
      }
    } else {
      // lacking authorization to patch content
      return res.status(403).json({error: 'lacking authorization to update the cookbook'});
    }
  } catch (err) {
    // could not find the cookbook
    return res.status(404).json({error: 'could not find the cookbook'});
  }
});

// TODO:

/**
 * Deletes a cookbook by id
 */
router.delete('/', async function(req, res, next) {
  const { id } = req.query;
  
  if (id == null ) {
    return res.status(400).json(`Missing request query parameters`);
  }

  // successfully deleted the cookbook
  return res.status(200).send();

  // lacking authorization to delete content
  return res.status(403).json({error: 'lacking authorization to delete the cookbook'});

  // could not find the cookbook
  return res.status(404).json({error: 'could not find the cookbook'});
});

module.exports = router;