var express = require('express');
const { client } = require('../secret');

var router = express.Router();

/* GET users listing. */
router.get('/', async function(req, res, next) {

  const secret = await client.getSecret('DB-USERNAME');

  
  res.send({"name": secret.name, "value": secret.value});
});

module.exports = router;
