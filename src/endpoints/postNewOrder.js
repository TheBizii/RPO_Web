const express = require('express')
const router = express.Router()
const User = require('../modules/orm/models/user')
const OrderedGoods = require('../modules/orm/models/orderedGoods')
const Goods = require('../modules/orm/models/goods')
const Order = require('../modules/orm/models/order')
const Coupon = require('../modules/orm/models/coupon')

router.post('/newOrder', async (req, res) => {
  try {
    res.setHeader('Content-Type', 'application/json')
    if (req.body.userID === undefined || req.body.totalPrice === undefined) {
      throw new Error()
    }
    const user = new User()
    const ret = await user.read(req.body.userID)
    if (ret == null) {
      throw new Error()
    }
    const order = new Order()
    order.setDate(Date.now())
    order.setCustomer(user)
    const coupon = new Coupon()
    coupon.setTitle('10% discount')
    coupon.setDescription('First time customer')
    coupon.setDiscount(10)
    coupon.setDateAdded(Date.now() - 10000)
    coupon.setExpirationDate(Date.now() + 10000)
    coupon.setCode('popust')
    coupon.create()
    let calcSum = 0
    for (const item of req.body.items) {
      const goods = new Goods()
      const tmp = await goods.read(item.id)
      console.log(goods.price)
      console.log(item.quantity)
      if (tmp == null) {
        throw new Error()
      }
      const orderedGoods = new OrderedGoods()
      orderedGoods.setOrder(order)
      orderedGoods.setGoods(goods)
      orderedGoods.setUnitPrice(goods.price)
      orderedGoods.setAmount(item.quantity)
      orderedGoods.setTotalValue(goods.price * item.quantity)
      calcSum += goods.price * item.quantity
      console.log(calcSum)
    }
    if (Math.floor(req.body.totalPrice * 100) / 100 !== Math.floor(calcSum * 100) / 100) {
      throw new Error(`Server thinks ${calcSum}, but device thinks ${req.body.totalPrice}`)
    }
    if (calcSum < 0.001) {
      calcSum = 0
    }
    order.setTotalDiscountPercentage(10)
    order.addCoupon(coupon.ID)
    order.setTotalValue(Math.floor(calcSum * 100) / 100)
    order.setValueWithDiscount(Math.floor(calcSum * 100) / 100 - Math.floor(calcSum * 100) / 1000)
    order.create()
    res.json({
      message: 'OK'
    })
  } catch (err) {
    console.log(err)
    res.json({
      error: 'Something went wrong with newOrder'
    })
  }
})

module.exports = router
