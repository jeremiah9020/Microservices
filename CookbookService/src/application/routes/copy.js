const express = require('express');
const router = express.Router();

/**
 * Creates a copy of a cookbook with a new owner.
 */
router.post('/', async function(req, res, next) {
  const { id, new_owner } = req.body;

  if (id == null || new_owner == null) {
    return res.status(400).json(`Missing request body parameters`);
  }

  const new_id = undefined;

  // successfully copied the cookbook
  return res.status(200).json({id: new_id});

  // lacking authorization to copy content
  return res.status(403).json({error: 'lacking authorization to copy the cookbook'});

  // could not find the cookbook
  return res.status(404).json({error: 'could not find the cookbook'});
});

module.exports = router;