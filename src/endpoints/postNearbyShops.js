const express = require('express')
const nodeGeo = require('node-geocoder')
const db = require('../modules/db')
const router = express.Router()
const params = {
  provider: 'openstreetmap'
}
const geoCoder = nodeGeo(params)

// <a href="https://my-location.org/?lat=46.5554&lng=15.6465" target="_blank">(46.5554,15.6465)</a>
router.post('/nearbyShops', async function (req, res) {
  res.setHeader('Content-Type', 'application/json')
  if (req.body.lat === undefined && req.body.lng === undefined) {
    res.json({
      error: 'Something went wrong with nearbyShops'
    })
    return
  }
  const queryResult = await db.getAllShops()
  if (queryResult != null) {
    const result = JSON.parse(queryResult)
    const keys = Object.keys(result)
    const resArr = []
    for (let i = 0; i < keys.length; i++) {
      const retObj = await geoCoder.geocode(result[keys[i]].address)
      console.log(result[keys[i]])
      resArr.push({ lat: retObj[0].latitude, lon: retObj[0].longitude, dis: Math.abs(retObj[0].latitude - req.body.lat) + Math.abs(retObj[0].longitude - req.body.lng), name: result[keys[i]].title })
    }
    res.json({
      shops: resArr
    })
  } else {
    res.json({
      error: 'Something went wrong with nearbyShops'
    })
  }
})

module.exports = router
