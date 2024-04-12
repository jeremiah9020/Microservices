const express = require('express');
const router = express.Router();
const sequelize = require('../../database/db');
const { v4: uuidv4 } = require('uuid');
const { authenticate, grpc: { user: { updateCookbooks }} } = require('shared');

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

  try {
    const original = await db.models.cookbook.findOne({ where: { id }, include: {model: db.models.section, include: db.models.recipe }});

    if (original.visibility == 'private') {
      // Recipe is private
      return res.status(403).json({error: 'Lacking authorization to copy cookbook'});  
    }

      original.times_copied += 1;
      await original.save()

      const cookbookId = uuidv4();
      const cookbook = await db.models.cookbook.create({ id: cookbookId, title: original.title, owner, is_a_copy: true })

      for (const section of original.sections) {
        const newSection = await db.models.section.create({title: section.title});

        for (const recipe of section.recipes) {
          const newRecipe = await db.models.section.create({rid: recipe.rid, version: recipe.version});
          await newSection.addRecipe(newRecipe);
        }

        await cookbook.addSection(newSection);
      }

      await updateCookbooks(owner, [cookbookId], [])
    
      // successfully created the recipe
      return res.status(200).json({id: cookbookId});  
  
  } catch (err) {
    return res.status(500).json({error: 'Something went wrong when creating your cookbook.'});
  }
});

module.exports = router;