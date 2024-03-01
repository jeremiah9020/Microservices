var express = require('express');
var router = express.Router();
const { DaprClient, HttpMethod } = require('@dapr/dapr');

// const db = require('../../database/db');

/* GET home page. */
router.get('/', async function(req, res, next) {
  console.log(DaprClient);
  console.log(HttpMethod);

  // const daprHost = "127.0.0.1";
  // const daprPort = "3000";
  // const client = new DaprClient({ daprHost, daprPort });
  // const serviceAppId = "service2";
  // const serviceMethod = "/";
  // const response = await client.invoker.invoke(serviceAppId, serviceMethod, HttpMethod.GET);
  res.send("123")
});

module.exports = router;


