const express = require('express');
const router = express.Router();

/**
 * Logs the user out by removing the access token from the cookie storage.
 */
router.post('/', async function(req, res, next) {
  return res.status(200)
    .clearCookie('ACCESSTOKEN', {httpOnly: true, path: '/', sameSite: true, secure: true})
    .send()
});

module.exports = router;