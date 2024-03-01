var express = require('express');
var router = express.Router();

const axios = require('axios');
// const db = require('../../database/db');

/* GET home page. */
router.get('/', async function(req, res, next) {

  // Make a request for a user with a given ID
  axios.get('https://service2.happyfield-2bbfce7e.westus.azurecontainerapps.io')
    .then(function (response) {
      // handle success
      console.log(response);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .finally(function () {
      res.send(123);
    });
});

module.exports = router;


