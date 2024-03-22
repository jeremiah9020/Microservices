const express = require('express');
const router = express.Router();
const sequelize = require('../../database/db');
const { role: { getRoleObject }, authenticate } = require('shared');


/**
 * Gets a user's role data.
 */
router.get('/', authenticate.strictly, async function(req, res, next) {
  const { user } = req.query;
  
  if (user == null ) {
    return res.status(400).json(`Missing request query parameters`);
  }

  const db = await sequelize;

  const userByEmail = await db.models.auth.findOne({ where: { email: user }});
  const userByUsername = await db.models.auth.findByPk(user);
  const viewingUser = await db.models.auth.findByPk(req.username);

  if (userByEmail == null && userByUsername == null) {
    return res.status(404).json({error: 'could not find the user'});
  }

  const foundUser = userByUsername || userByEmail;

  if (foundUser.username != req.username) {
    const viewerRole = getRoleObject(viewingUser.role);
    if (!viewerRole.canSeeRoles) {
      // lacking authorization to view content
      return res.status(403).json({error: 'lacking authorization to view the recipe'});
    }
  }
  
  const role = foundUser.role;

  // successfully retrieved user's role data
  return res.status(200).json({ role });
});

/**
 * Updates the user's role data.
 */
router.put('/', authenticate.strictly, async function(req, res, next) {
  const { user, role } = req.body;

  if (user == null || role == null) {
    return res.status(400).json(`Missing request body parameters`);
  }

  const db = await sequelize;

  const editingUser = await db.models.auth.findByPk(req.username);

  if (editingUser) {
    const roles = getRoleObject(editingUser.role);

    if (roles.canAdjustRoles) {
      const userByEmail = await db.models.auth.findOne({ where: { email: user }});
      const userByUsername = await db.models.auth.findByPk(user);

      if (userByEmail == null && userByUsername == null) {
        return res.status(404).json({error: 'could not find the user'});
      }
    
      const foundUser = userByUsername || userByEmail;

      await foundUser.update({ role });

      // successfully updated user's role data
      return res.status(200).send();
    }    
  }

  // lacking authorization to set content
  return res.status(403).json({error: 'lacking authorization to set role data'});
});

module.exports = router;