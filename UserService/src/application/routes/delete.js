const express = require('express');
const router = express.Router();
const sequelize = require('../../database/db');
const { authenticate } = require('shared');

/**
 * Used to delete a user completely, requires reauthentication.
 * 
 * Used only by the server
 */
router.post('/', authenticate.server, async function(req, res, next) {
  const { username } = req.body;

  if (username == null ) {
    return res.status(400).json(`Missing request body parameters`);
  }

  const db = await sequelize;

  const user = await db.models.user.findByPk(username);

  if (user == null) {
     // could not find the user
    return res.status(404).json({error: 'could not find the user'});
  }

  // TODO: do everything necessary before deleted (ie, remove followers, delete cookbooks and recipes, delete and saved content)

  await user.destroy();

  // user's authentication data successfully delete
  return res.status(200).send();
});

module.exports = router;