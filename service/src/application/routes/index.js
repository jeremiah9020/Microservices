var express = require('express');
var router = express.Router();

const axios = require('axios');

/* GET home page. */
router.get('/', async function(req, res, next) {
  // Make a request for a user with a given ID
  const response = await axios.get('https://service2.happyfield-2bbfce7e.westus.azurecontainerapps.io')
  res.send("response from service2: " + JSON.stringify(response.data));
});

module.exports = router;