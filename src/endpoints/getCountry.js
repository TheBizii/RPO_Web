const express = require('express')
const router = express.Router()
const db = require('../modules/db')

router.get('/country', async function (req, res) {
  res.setHeader('Content-Type', 'application/json')
  const queryResult = await db.getAllCountries()
  res.json({
    country: queryResult
  })
})
module.exports = router
