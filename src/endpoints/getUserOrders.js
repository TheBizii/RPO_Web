const express = require('express')
const router = express.Router()
const User = require('../modules/orm/models/user')
const Order = require('../modules/orm/models/order')

router.get('/getUserOrders/:id', async (req, res) => {
  try {
    res.setHeader('Content-Type', 'application/json')
    if (req.params.id === undefined) {
      throw new Error()
    }
    const user = new User()
    const response = await user.read(req.params.id)
    if (response == null) {
      throw new Error("User doesn't exists")
    }
    const orders = await Order.readUserOrders(req.params.id)
    res.json({
      message: orders
    })
  } catch (err) {
    res.json({
      error: `Something went wrong with shop/${req.params.id}`
    })
  }
})

module.exports = router
