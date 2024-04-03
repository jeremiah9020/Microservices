const express = require('express');
const router = express.Router();
const sequelize = require('../../database/db');
const { v4: uuidv4 } = require('uuid');
const { authenticate, serviceRequest } = require('shared');

/**
 * Creates a copy of a cookbook with a new owner.
 */
router.post('/', authenticate.strictly, async function(req, res, next) {
  const { id, new_owner } = req.body;

  if (id == null) {
    return res.status(400).json(`Missing request body parameters`);
  }

  const owner = req.username || new_owner;

  const db = await sequelize;

  const transaction = await db.transaction();
  try {
    const original = await db.models.cookbook.findOne({ where: { id }, include: {model: db.models.section, include: db.models.recipe }});

    if (original.visibility != 'private') {
      await original.increment('times_copied',{ transaction });

      const cookbookId = uuidv4();
      const cookbook = await db.models.cookbook.create({ id: cookbookId, title: original.title, owner, is_a_copy: true }, { transaction })

      for (const section of original.sections) {
        const newSection = await db.models.section.create({title: section.title}, { transaction });

        for (const recipe of section.recipes) {
          const newRecipe = await db.models.section.create({rid: recipe.rid, version: recipe.version}, { transaction });
          await newSection.addRecipe(newRecipe);
        }

        await cookbook.addSection(newSection);
      }

      await transaction.commit();

      await serviceRequest('UserService','/cookbooks', { method: 'patch'}, { username: owner, add: [cookbookId]})
    
      // successfully created the recipe
      return res.status(200).json({id: cookbookId});  
    } else 

    // successfully created the recipe
    return res.status(403).json({error: 'Lacking authorization to copy cookbook'});  

     
  } catch (err) {
    await transaction.rollback();
    return res.status(500).json({error: 'Something went wrong when creating your cookbook.'});
  }
});

module.exports = router;