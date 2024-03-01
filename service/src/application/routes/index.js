const express = require('express');
const { serviceBridge }  = require('shared')
const router = express.Router();

/* GET home page. */
router.get('/', async function(req, res, next) {
  console.log(serviceBridge);

  let json = {};
;  if (serviceBridge) {
    const response = await serviceBridge('service2', '/')
    json = await response.json();
  }

  res.send("response from service2(?): " + JSON.stringify(json));
});

module.exports = router;