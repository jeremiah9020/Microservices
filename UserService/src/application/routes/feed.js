const express = require('express');
const router = express.Router();
const sequelize = require('../../database/db');
const { authenticate } = require('shared');
const { Op } = require('sequelize');

/**
 * Used to get a feed of users
 */
router.get('/', authenticate.server, async function(req, res, next) {
  let {items, set, query } = req.query;

  items = items || 50;
  set = set || 1;

  const db = await sequelize;

  let users;
  if (query == null) {
    users = await db.models.user.findAll({
      limit: items, 
      offset: items * (set - 1)
    });
  } else {
    users = await db.models.user.findAll({
      where: {
        username: {
          [Op.like]: `%${query.toLowerCase()}%`
        }
      },
      limit: items, 
      offset: items * (set - 1),
    });
  }

  const data = users.map(x => x.id);

  // user's authentication data successfully delete
  return res.status(200).json({users: data});
});

module.exports = router

  