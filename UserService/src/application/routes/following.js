const express = require('express');
const router = express.Router();

/**
 * Used to add or remove a user from the following list.
 */
router.patch('/', async function(req, res, next) {
  const { id, add, remove } = req.body;

  if (id == null) {
    return res.status(400).json(`Missing request body parameters`);
  }

  // successfully updated the user's following list
  return res.status(200).send();

  // lacking authorization to update content
  return res.status(403).json({error: 'lacking authorization to update the user\'s following list'});

  // could not find the user
  return res.status(404).json({error: 'could not find the user'});
});


module.exports = router;