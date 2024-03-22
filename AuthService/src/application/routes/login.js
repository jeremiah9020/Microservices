const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sequelize = require('../../database/db');
const { env } = require('shared');

/**
 * Logs in an existing user and returns the access token, also calling a set-cookie to store said access token.
 */
router.post('/', async function(req, res, next) {
  const { user, password } = req.body;

  if (user == null || password == null) {
    return res.status(400).json(`Missing request body parameters`);
  }

  const db = await sequelize;

  const userByEmail = await db.models.auth.findOne({ where: { email: user }});
  const userByUsername = await db.models.auth.findOne({ where: { username: user }});

  if (userByEmail == null && userByUsername == null) {
      return res.status(404).json({error: 'could not find the user with the given credentials.'});
  }

  const foundUser = userByUsername || userByEmail;

  const passwordMatch = await bcrypt.compare(password, foundUser.password);
  if (!passwordMatch) {
    return res.status(401).json({error: 'could not authenticate the user with the given credentials.'});
  }

  const access_token = jwt.sign({ username: foundUser.username }, env.SECRET_KEY, {
    expiresIn: '7d',
  });

  // user successfully registered
  return res.status(201)
    .cookie('ACCESSTOKEN', access_token, {httpOnly: true, path: '/', sameSite: true})
    .json({ access_token })  
});

module.exports = router;