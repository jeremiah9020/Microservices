const express = require('express');
const router = express.Router();
const sequelize = require('../../database/db');
const { authenticate } = require('shared');

async function updateFollowingList(user, add, remove) {
  const db = await sequelize;

  if (remove) {
    for (const toRemove of remove) {
      try {
        const userToRemove = await db.models.user.findByPk(toRemove);
        await user.removeFollowing(userToRemove);
      } catch (err) {}
    }
  }

  if (add) {
    for (const toAdd of add) {
      try {
        const userToAdd = await db.models.user.findByPk(toAdd);
        await user.addFollowing(userToAdd);
      } catch (err) {}
    }
  }
}


/**
 * Used to add or remove a user from the following list.
 */
router.patch('/', authenticate.strictly, async function(req, res, next) {
  const { username, add, remove } = req.body;
  
  const db = await sequelize;

  try {    
    if (req.fromServer) {
      if (username) {
        const user = await db.models.user.findByPk(username);
        await updateFollowingList(user, add, remove)

        // successfully updated the user's following list
        return res.status(200).send();
      } else {

        // missing username parameter
        return res.status(400).json(`Missing request body parameters`);
      }
    } else {
      const user = await db.models.user.findByPk(req.username);
      await updateFollowingList(user, add, remove)

      // successfully saved the user data
      return res.status(200).send();
    }
  } catch (err) {
    // could not find the user
    return res.status(404).json({error: 'could not find the user'});
  } 
});


module.exports = router;