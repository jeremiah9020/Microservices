const express = require('express');
const sequelize = require('../../database/db');
const router = express.Router();
const bcrypt = require('bcrypt');
const { authenticate, serviceRequest, grpc } = require('shared');

/**
 * Used to delete a user's authentication data.
 */
router.post('/', authenticate.strictly, async function(req, res, next) {
  const { username, password } = req.body;

  if (username == null) {
    return res.status(400).json(`Missing request body parameters`);
  }

  const db = await sequelize;

  const user = await db.models.auth.findByPk(username);
  if (user == null) {
    // could not find the user
    return res.status(404).json({error: 'could not find the user'});
  }

  if (req.username && req.username != username) {
    const role = await grpc.auth.getRole(req.username);
    if (!role.canDeleteUsers) {
      // not authorized
      return res.status(403).json({error: 'Lacking authorization to delete user.'});
    }
  } else {
    if (password == null) {
      return res.status(400).json(`Missing request body parameters`);
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({error: 'could not authenticate the user with the given credentials.'});
    }
  }

  await user.destroy();
  await serviceRequest('UserService','/delete',{ method:'post' }, { username });

  // user's authentication data successfully delete
  return res.status(200).send();
});

module.exports = router;