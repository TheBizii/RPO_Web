const express = require('express')
const router = express.Router()
const PartnerLocation = require('../modules/orm/models/partnerLocation')
const Goods = require('../modules/orm/models/goods')

router.post('/storeGoods', async function (req, res) {
  try {
    res.setHeader('Content-Type', 'application/json')
    if (req.body.storeId === undefined) {
      throw new Error()
    }
	let store = new PartnerLocation();
    await store.read(req.body.storeId)
	const unfilteredGoods = await Goods.readAll();
	const filteredGoods = unfilteredGoods.filter(goods => store.getGoods().includes(goods.getID()))
	res.json({
		goods: filteredGoods
  	})
  } catch (err) {
    res.json({
      error: 'Something went wrong with retrieving store goods for storeId=' + req.body.storeId
    })
	console.log(err);
  }
})

module.exports = router
