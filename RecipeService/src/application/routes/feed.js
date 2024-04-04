const express = require('express');
const router = express.Router();
const sequelize = require('../../database/db');
const { authenticate } = require('shared');
const { Op } = require('sequelize');

/**
 * Used to get a feed of recipes
 */
router.get('/', authenticate.server, async function(req, res, next) {
  let {items, set, query } = req.query;

  items = items || 50;
  set = set || 1;

  const db = await sequelize;

  let recipes;
  if (query == null) {
    recipes = await db.models.metadata.findAll({
      include: {
        model: db.models.version,
        as: 'latest',
        include: db.models.recipe
      },
      where: {
        '$latest.recipe.visibility$': 'public'
      },
      limit: items, 
      offset: items * (set - 1),
      order: [
        ['references','DESC']
      ]
    });
  } else {
    recipes = await db.models.metadata.findAll({
      include: {
        model: db.models.version,
        as: 'latest',
        include: db.models.recipe         
      },
      where: {
        '$latest.recipe.visibility$': 'public',
        '$latest.recipe.data$': {
          [Op.like]: `%${query.toLowerCase()}%`
        }
      },
      limit: items, 
      offset: items * (set - 1),
      order: [
        ['references','DESC']
      ]
    });
  }
  

  const data = recipes.map(x => x.id);

  // user's authentication data successfully delete
  return res.status(200).json({recipes: data});
});

module.exports = router

  