const express = require('express');
const sequelize = require('../../database/db');
const router = express.Router();
const bcrypt = require('bcrypt');
const { authenticate, role: { getRoleObject } } = require('shared');
const serviceRequest = require('shared/utils/serviceBridge');

/**
 * Used to delete a user's authentication data.
 */
router.post('/', async function(req, res, next) {
  const { username, password } = req.body;

  if (username == null || password == null) {
    return res.status(400).json(`Missing request body parameters`);
  }

  const db = await sequelize;

  try {
    const user = await db.models.auth.findByPk(username);
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({error: 'could not authenticate the user with the given credentials.'});
    }

    await user.destroy();

    await serviceRequest('UserService','/delete',{ method:'post' }, { username })

    // user's authentication data successfully delete
    return res.status(200).send();
  } catch (err) {
    // could not find the user
    return res.status(404).json({error: 'could not find the user'});
  }
});

module.exports = router;