var express = require('express');
var router = express.Router();

const { models } = require('../db');

/* GET home page. */
router.get('/', async function(req, res, next) {
  const books = await models.book.findAll();
  res.send(books)
});

module.exports = router;
