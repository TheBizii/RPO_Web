const express = require('express')
const router = express.Router()
const PartnerLocation = require('../modules/orm/models/partnerLocation')

router.post('/shop', async (req, res) => {
  try {
    res.setHeader('Content-Type', 'application/json')
    if (req.body.id === undefined) {
      throw new Error()
    }
    const shop = new PartnerLocation()
    const response = await shop.read(req.body.id)
    if (response === null) {
      throw new Error()
    }
    res.json({
      message: shop
    })
  } catch (err) {
    res.json({
      error: `Something went wrong with shop/${req.params.id}`
    })
  }
})

module.exports = router
