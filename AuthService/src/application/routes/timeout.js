const express = require('express');
const router = express.Router();
const sequelize = require('../../database/db');
const { role: { getRoleObject }, authenticate } = require('shared');

/**
 * Gets a user's timeout value
 */
router.get('/', async function(req, res, next) {
  const { username } = req.query;
  
  if (username == null ) {
    return res.status(400).json(`Missing request query parameters`);
  }

  const db = await sequelize;

  try {
    const user = await db.models.auth.findByPk(username);

    // successfully retrieved user's timeout
    return res.status(200).json({ timeout_until: user.timeout_until });

  } catch (err) {

    // could not find the user
    return res.status(404).json({error: 'could not find the user'});
  }
});

/**
 * Updates a user's timeout value
 */
router.put('/', authenticate.strictly, async function(req, res, next) {
  const { username, timeout_until } = req.body;

  if (username == null || timeout_until == null) {
    return res.status(400).json(`Missing request body parameters`);
  }

  const db = await sequelize;

  const fromServer = req.fromServer;
  
  const hasRole = async () => {
    const editingUser = await db.models.auth.findOne({ where: { username: req.username }});
    return editingUser && getRoleObject(editingUser.role).canSuspendUsers;
  } 

  if (fromServer || await hasRole()) {
    console.log("fromserver: ", fromServer)
    console.log("hasRole: ", hasRole())

    const user = await db.models.auth.findOne({ where: { username }});

    if (user == null) {
      return res.status(404).json({error: 'could not find the user'});
    }

    await user.update({ timeout_until });

    // successfully updated user's role data
    return res.status(200).send();
  }

  // lacking authorization to set content
  return res.status(403).json({error: 'lacking authorization to set timeout data'}); 
});

module.exports = router;