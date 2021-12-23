const express = require('express')
const router = express.Router()
const User = require('../modules/orm/models/user')
const crypto = require('crypto')

router.post('/login', async function (req, res) {
  try {
    res.setHeader('Content-Type', 'application/json')
    if (req.body.username === undefined && req.body.password === undefined && req.body.password.length !== 64) {
      throw new Error()
    }
    const sha256 = crypto.createHash('sha256')
    const user = await User.readByUsername(req.body.username)
    const hash = sha256.update(`${req.body.password}${user.credentials.salt}`).digest('hex')
    if (user.credentials.password === hash.toUpperCase()) {
      res.json({
        message: 'OK'
      })
    } else {
      throw new Error()
    }
  } catch (err) {
    res.json({
      error: 'Something went wrong with login'
    })
  }
})

module.exports = router
