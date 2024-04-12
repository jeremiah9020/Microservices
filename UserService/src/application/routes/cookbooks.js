const express = require('express');
const router = express.Router();
const sequelize = require('../../database/db');
const { authenticate, grpc: { auth: { getRole }, cookbook: cookbookGRPC } } = require('shared');

/**
 * Used to add or remove a cookbook from the cookbooks list.
 */
router.patch('/', authenticate.strictly, async function(req, res, next) {
  const { username, add, remove } = req.body;

  let owner;
  if (req.fromServer) {
    owner = username;
  } else if (username == null || username == req.username) {
    owner = req.username;
  } else {
    owner = username;
    // Check auth

    const role = await grpc.auth.getRole(req.username);
    if (!role.canDeleteCookbooks) {
      // not authorized
      return res.status(403).json({error: 'Lacking authorization to delete user.'});
    }
  }
  
  if (owner == null) {
    return res.status(400).json(`Missing request body parameters`);
  }
  

  const db = await sequelize;

  try {
    const user = await db.models.user.findByPk(owner, {include: [ 
      { model: db.models.cookbook, as: 'cookbooks'},
    ]});

    if (user == null) {
       // could not find the user
      return res.status(404).json({error: 'could not find the user'});
    }
  
    if (remove) {
      for (const toRemove of remove) {
        const cookbook = user.cookbooks.find(x => x.cid == toRemove);
        if (!cookbook) continue;

        try {
          await user.removeCookbook(cookbook);
          await cookbook.destroy();
          await cookbookGRPC.decrement(toRemove);
        } catch (err) {}
      }
    }
  
    if (add) {
      for (const toAdd of add) {
        try {
          const cookbook = await db.models.cookbook.create({ cid: toAdd });
          await user.addCookbook(cookbook)
          await cookbookGRPC.increment(toAdd);
        } catch (err) {}
      }
    }

    // user's cookbooks successfully updated
    return res.status(200).send();
  } catch (err) {
    return res.status(500).send('Something went wrong.');
  }
});

module.exports = router;