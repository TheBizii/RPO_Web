const express = require('express')
const router = express.Router()
const db = require('../modules/db')

router.post('/register', async function (req, res) {
  res.setHeader('Content-Type', 'application/json')
  if (req.body.role === undefined && req.body.role === 2 && req.body.role < 1 && req.body.role > 4 &&
    req.body.user === undefined &&
    req.body.password === undefined && req.body.email === undefined && req.body.password === undefined) {
    res.json({
      error: 'Something went wrong with register'
    })
    return
  }
  const queryResult = await db.createNewUserAndCredentials(req.body.email, req.body.password)
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
