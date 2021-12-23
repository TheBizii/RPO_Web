const express = require('express')
const crypto = require('crypto')
const router = express.Router()
const Credentials = require('../modules/orm/models/credentials')
const User = require('../modules/orm/models/user')

function returnHash () {
  const val = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPRQRSTUVWXYZ1234567890*?=)(/%$!~\\<>-—'.split('')
  let str = ''
  for (let i = 0; i < 32; i++) {
    str += val[Math.floor(Math.random() * val.length)]
  }
  return str
}

router.post('/register', async function (req, res) {
  try {
    res.setHeader('Content-Type', 'application/json')
    if (req.body.password === undefined || req.body.username === undefined || req.body.firstName === undefined || req.body.lastName === undefined || req.body.phone === undefined || req.body.password.trim().length <= 3) {
      throw new Error()
    }
    const userRes = await User.readByUsername(req.body.username)
    if (userRes !== null) {
      res.json({
        error: 'Username is already taken. Please come with something new'
      })
      return
    }
    const cred = new Credentials()
    cred.setUsername(req.body.username)
    const salt = returnHash()
    cred.setSalt(salt)
    const sha256 = crypto.createHash('sha256')
    const hash = sha256.update(`${req.body.password}${salt}`).digest('hex')
    cred.setPassword(hash.toUpperCase())
    const response = await cred.create()
    if (response == null) {
      throw new Error()
    }
    const user = new User()
    user.addRole(1)
    user.setFirstName(req.body.firstName)
    user.setMiddleName(req.body.middleName || '')
    user.setLastName(req.body.lastName)
    user.setPhone(req.body.phone)
    user.setCredentials(cred)
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
