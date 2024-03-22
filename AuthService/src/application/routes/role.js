const express = require('express');
const router = express.Router();

/**
 * Gets a user's role data.
 */
router.get('/', async function(req, res, next) {
  const { user } = req.query;
  
  if (user == null ) {
    return res.status(400).json(`Missing request query parameters`);
  }

  const role = undefined;

  // successfully retrieved user's role data
  return res.status(200).json({ role });

  // lacking authorization to view content
  return res.status(403).json({error: 'lacking authorization to view role data'});

  // could not find the user
  return res.status(404).json({error: 'could not find the user'});
});

/**
 * Gets the user's role data.
 */
router.put('/', async function(req, res, next) {
  const { user, role } = req.body;

  if (user == null || role == null) {
    return res.status(400).json(`Missing request body parameters`);
  }

  const access_token = undefined;

  // successfully updated user's role data
  return res.status(200).send();

  // lacking authorization to set content
  return res.status(403).json({error: 'lacking authorization to set role data'});

  // could not find the user
  return res.status(404).json({error: 'could not find the user'});
});

module.exports = router;