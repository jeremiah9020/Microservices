const express = require('express');
const { serviceBridge }  = require('shared')
const router = express.Router();

/* GET home page. */
router.get('/', async function(req, res, next) {
  
  try {
    const response = await serviceBridge('service2', '/')

    if (response.status > 400) throw new Error(response.statusText)

    const text = await response.text();
    res.status(200).send("response from service2: " + JSON.stringify(text));
  }
  catch (error) {
    console.error(error)
    res.status(503).send("Couldn't contact service2");
  }
});

module.exports = router;