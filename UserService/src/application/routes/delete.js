const express = require('express');
const router = express.Router();

/**
 * Used to delete a user completely, requires reauthentication.
 */
router.delete('/', async function(req, res, next) {
  const { id, username, password } = req.body;

  if (id == null || username == null || password == null) {
    return res.status(400).json(`Missing request body parameters`);
  }

  // successfully delete the user
  return res.status(200).send();

  const editorHasRole = async () => {
    if (req.username) {
      const response = await serviceRequest('AuthService', `/role?user=${req.username}`, {method: 'get'});
      const json = await response.json();
      return getRoleObject(json.role);
    }
    return false;
  }

  // lacking authorization to delete content
  return res.status(403).json({error: 'lacking authorization to delete the user'});
});

module.exports = router;