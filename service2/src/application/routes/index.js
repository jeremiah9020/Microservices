var express = require('express');
var router = express.Router();

const db = require('../../database/db');

/* GET home page. */
router.get('/', async function(req, res, next) {
  const model = (await db).models.book;
  const books = await model.findAll();
  res.send(books)
});

module.exports = router;
