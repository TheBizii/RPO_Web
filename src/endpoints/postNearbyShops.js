const express = require('express')
const nodeGeo = require('node-geocoder')
const db = require('../modules/db')
const router = express.Router()
const params = {
  provider: 'openstreetmap'
}
// const Post = require('./modules/orm/models/post')
const geoCoder = nodeGeo(params)

function measure (lat1, lon1, lat2, lon2) {
  const cLat = lat2 * Math.PI / 180 - lat1 * Math.PI / 180
  const cLon = lon2 * Math.PI / 180 - lon1 * Math.PI / 180
  const a = Math.sin(cLat / 2) * Math.sin(cLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(cLon / 2) * Math.sin(cLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const d = 6378.137 * c
  return d * 1000
}
// <a href="https://my-location.org/?lat=46.5554&lng=15.6465" target="_blank">(46.5554,15.6465)</a>
router.post('/nearbyShops', async function (req, res) {
  // const posts = await Post.readAll()
  // res.send(posts)
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
      let coord = []
      if (result[keys[i]].coordinate === null) {
        coord = await geoCoder.geocode(`${result[keys[i]].address}, ${result[keys[i]].city} ${result[keys[i].country]}`)
        db.updateCoordinates(result[keys[i]].id, coord[0].latitude, coord[0].longitude)
      } else {
        coord.push({ latitude: result[keys[i]].coordinate.x, longitude: result[keys[i]].coordinate.y })
      }
      resArr.push({ lat: coord[0].latitude, lon: coord[0].longitude, dis: Math.floor(measure(coord[0].latitude, coord[0].longitude, req.body.lat, req.body.lng) * 100) / 100, name: result[keys[i]].title })
    }
    resArr.sort((a, b) => a.dis - b.dis)
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
