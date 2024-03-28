const express = require('express');
const router = express.Router();
const sequelize = require('../../database/db');
const { authenticate } = require('shared');

async function updateFollowingList(user, add, remove) {
  const following = JSON.parse(user.following);

  const db = await sequelize;


  if (remove) {
    for (const toRemove of remove) {
      try {
        await db.transaction(async (t) => {
          const removedUser = await db.models.user.findByPk(toRemove, { transaction: t });
          await removedUser.update({followers: user.followers - 1}, {transaction: t})
        });
      } catch (err) {}
     
      const index = following.indexOf(toRemove);
      following.splice(index, 1);
    }
  }

  if (add) {
    for (const toAdd of add) {
      try {
        await db.transaction(async (t) => {
          const addedUser = await db.models.user.findByPk(toAdd, { transaction: t });
          await addedUser.update({followers: user.followers + 1}, {transaction: t})
        });

        following.push(toAdd);
      } catch (err) {}
    }
  }

  return await user.update({following: JSON.stringify(following)});
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