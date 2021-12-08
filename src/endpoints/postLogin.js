const express = require('express')
const router = express.Router()
const db = require('../modules/db')

router.post('/login', async function (req, res) {
  res.setHeader('Content-Type', 'application/json')
  if (req.body.email === undefined) {
    res.json({
      error: 'Something went wrong with login'
    })
    return
  }
  if (req.body.password === undefined) {
    res.json({
      error: 'Something went wrong with login'
    })
    return
  }
  const queryResult = await db.confirmLoginInformation(req.body.email, req.body.password)
  if (queryResult != null) {
    res.json({
      message: 'OK'
    })
  } else {
    res.json({
      error: 'Something went wrong with login'
    })
  }
})

module.exports = router
