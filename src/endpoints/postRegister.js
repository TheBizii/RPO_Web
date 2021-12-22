const express = require('express')
const crypto = require('crypto')
const router = express.Router()
const Credentials = require('../modules/orm/models/credentials')
const User = require('../modules/orm/models/user')

function returnHash () {
  const abc = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPRQRSTUVWXYZ1234567890*?=)(/%$!~\\<>-—'.split('')
  let token = ''
  for (let i = 0; i < 32; i++) {
    token += abc[Math.floor(Math.random() * abc.length)]
  }
  return token
}

router.post('/register', async function (req, res) {
  try {
    res.setHeader('Content-Type', 'application/json')
    if (req.body.user === undefined || req.body.user.password === undefined || req.body.user.username === undefined) {
      throw new Error()
    }
    const userRes = await User.readByUsername(req.body.user.username)
    if (userRes !== null) {
      res.json({
        error: 'Username is already taken. Please come with something new'
      })
      return
    }
    const cred = new Credentials()
    cred.setUsername(req.body.user.username)
    const salt = returnHash()
    cred.setSalt(salt)
    const sha256 = crypto.createHash('sha256')
    const hash = sha256.update(`${req.body.user.password}${salt}`).digest('hex')
    cred.setPassword(hash.toUpperCase())
    const response = await cred.create()
    if (response == null) {
      throw new Error()
    }
    const user = new User()
    user.setFirstName(req.body.user.firstName || '')
    user.setMiddleName(req.body.user.middleName || '')
    user.setLastName(req.body.user.lastName || '')
    user.setPhone(req.body.user.phone || '')
    user.setCredentials(cred || '')
    await user.create()
    res.json({
      message: 'OK'
    })
  } catch (err) {
    res.json({
      error: 'Something went wrong with register'
    })
  }
})

module.exports = router
