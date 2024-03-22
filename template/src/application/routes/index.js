const express = require('express');
const { serviceRequest } = require('shared')
const router = express.Router();

/* GET home page. */
router.get('/', async function(req, res, next) {
  res.status(200).send('Template!')
});

module.exports = router;