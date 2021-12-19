const express = require('express')
const router = express.Router()
const db = require('../modules/db')
const crypto = require('crypto')

router.post('/login', async function (req, res) {
  res.setHeader('Content-Type', 'application/json')
  if (req.body.username === undefined && req.body.password === undefined && req.body.password.length !== 64) {
    res.json({
      error: 'Something went wrong with login'
    })
    return
  }
  const sha256 = crypto.createHash('sha256')
  const salt = await db.getSaltForLogin(req.body.username)
  const hash = sha256.update(`${req.body.password}${JSON.parse(salt)[0].salt}`).digest('hex')
  const queryResult = await db.confirmLoginInformation(req.body.username, hash.toUpperCase())
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
