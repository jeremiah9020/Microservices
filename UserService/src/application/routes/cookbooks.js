const express = require('express');
const router = express.Router();
const sequelize = require('../../database/db');
const { authenticate } = require('shared');

/**
 * Used to add or remove a cookbook from the cookbooks list.
 */
router.patch('/', authenticate.server, async function(req, res, next) {
  const { username, add, remove } = req.body;

  const owner = req.username || username;

  if (owner == null) {
    return res.status(400).json(`Missing request body parameters`);
  }

  const db = await sequelize;

  try {
    const user = await db.models.user.findByPk(owner, {include: [ 
      { model: db.models.entry, as: 'cookbooks'},
    ]});

    if (user == null) {
       // could not find the user
      return res.status(404).json({error: 'could not find the user'});
    }
  
    if (remove) {
      for (const toRemove of remove) {
        try {
          const cookbook = user.cookbooks.find(x => x.value == toRemove);

          // TODO: if the user owns the recipe, this should fail!

          await user.removeCookbook(cookbook);
          await cookbook.destroy();
        } catch (err) {}
      }
    }
  
    if (add) {
      for (const toAdd of add) {
        const cookbook = await db.models.entry.create({value: toAdd});
        await user.addCookbook(cookbook)
      }
    }

    // user's cookbooks successfully updated
    return res.status(200).send();
  } catch (err) {
    return res.status(500).send('Something went wrong.');
  }
});

module.exports = router;