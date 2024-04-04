const express = require('express');
const router = express.Router();
const sequelize = require('../../database/db');
const { authenticate } = require('shared');
const { Op } = require('sequelize');

/**
 * Used to get a feed of cookbooks
 */
router.get('/', authenticate.server, async function(req, res, next) {
  let {items, set, query } = req.query;

  items = items || 50;
  set = set || 1;

  const db = await sequelize;

  let cookbooks;
  if (query == null) {
    cookbooks = await db.models.cookbook.findAll({
      limit: items, 
      offset: items * (set - 1),
      order: [
        ['references','DESC']
      ]
    });
  } else {
    cookbooks = await db.models.cookbook.findAll({
      where: {
        title: {
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

  const data = cookbooks.map(x => x.id);

  // user's authentication data successfully delete
  return res.status(200).json({cookbooks: data});
});

module.exports = router

  