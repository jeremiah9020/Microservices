const express = require('express');
const router = express.Router();
const sequelize = require('../../database/db');
const { authenticate } = require('shared');

/**
 * Used to add or remove a cookbook from the cookbooks list.
 * 
 * Usable only by the server
 */
router.patch('/', authenticate.server, async function(req, res, next) {
  const { username, add, remove } = req.body;

  if (username == null) {
    return res.status(400).json(`Missing request body parameters`);
  }

  const db = await sequelize;

  try {
    const user = await db.models.user.findByPk(username);

    if (user == null) {
       // could not find the user
      return res.status(404).json({error: 'could not find the user'});
    }
  
    if (remove) {
      for (const toRemove of remove) {
        user.removeCookbook(toRemove)
      }
    }
  
    if (add) {
      for (const toAdd of add) {
        user.addCookbook(toAdd)
      }
    }
  
    // user's cookbooks successfully updated
    return res.status(200).send();
  } catch (err) {
    return res.status(500).send('Something went wrong.');
  }
});


module.exports = router;