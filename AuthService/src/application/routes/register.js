const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sequelize = require('../../database/db');
const { env, serviceRequest } = require('shared');

/**
 * Registers a new user and returns the access token, also calling a set-cookie to store said access token.
 */
router.post('/', async function(req, res, next) {
  const { email, username, password} = req.body;

  if (email == null || username == null || password == null) {
    return res.status(400).json(`Missing request body parameters`);
  }

  const db = await sequelize;

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  try {
    const newUser = await db.models.auth.create({ username, email, password: hashedPassword});
    
    const access_token = jwt.sign({ username }, env.SECRET_KEY, {
      expiresIn: '7d',
    });

    try {
      await serviceRequest('UserService', `/`, {method: 'post'}, { username: username });
    } catch (err) {
      await newUser.destroy();
      throw new Error('Failed to register user with userservice')
    }

    // user successfully registered
    return res.status(201)
      .cookie('ACCESSTOKEN', access_token, {httpOnly: true, path: '/', sameSite: true})
      .json({ access_token })
  } catch (err) {
    // username or email is already in use.
    return res.status(409).json({error: 'username or email already in use'});
  }   
});

module.exports = router;