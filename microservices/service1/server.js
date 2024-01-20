const express = require('express')
const axios = require('axios')

const app = express()

const port = 3000;


app.get('/', async (req, res) => {
  axios.get('http://service2:3001/').then(async (response) => {  
    res.send(`Hello from service 1! Got this response from service 2: "${response.data}"`)
  })
 
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})