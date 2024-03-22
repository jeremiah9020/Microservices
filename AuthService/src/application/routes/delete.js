const express = require('express');
const sequelize = require('../../database/db');
const router = express.Router();
const bcrypt = require('bcrypt');
const { authenticate } = require('shared');

/**
 * Used to delete a user's authentication data.
 */
router.post('/', authenticate.server, async function(req, res, next) {
  const { username } = req.body;

  if (username == null ) {
    return res.status(400).json(`Missing request body parameters`);
  }

  const db = await sequelize;

  const user = await db.models.auth.findByPk(username);

  if (user == null) {
     // could not find the user
    return res.status(404).json({error: 'could not find the user'});
  }

  await user.destroy();

  // user's authentication data successfully delete
  return res.status(200).send();
});

module.exports = router;