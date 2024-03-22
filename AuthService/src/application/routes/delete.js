const express = require('express');
const router = express.Router();

/**
 * Used to delete a user's authentication data.
 */
router.post('/', async function(req, res, next) {
  const { id, username, password} = req.body;

  if (id == null || username == null || password == null) {
    return res.status(400).json(`Missing request body parameters`);
  }

  // user's authentication data successfully delete
  return res.status(200).send();

  // could not find the user
  return res.status(404).json({error: 'could not find the user'});

  // lacking authorization to delete content
  return res.status(403).json({error: 'lacking authorization to delete auth data'});
});

module.exports = router;