const express = require('express')
const router = express.Router()
const Country = require('../modules/orm/models/country')

router.get('/country', async function (req, res) {
  res.setHeader('Content-Type', 'application/json')
  const queryResult = await Country.readAll()
  res.json({
    country: queryResult
  })
})
module.exports = router
