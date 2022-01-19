const express = require('express')
const nodeGeo = require('node-geocoder')
const router = express.Router()
const params = {
  provider: 'openstreetmap'
}
const PartnerLocation = require('../modules/orm/models/partnerLocation')
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
  res.setHeader('Content-Type', 'application/json')
  if (req.body.lat === undefined && req.body.lng === undefined) {
    res.json({
      error: 'Something went wrong with nearbyShops'
    })
    return
  }
  const branches = await PartnerLocation.readAll()
  const resArr = []
  if (branches.length > 0) {
    for (const branch of branches) {
      let coord = []
      if (branch.getAddress().getCoordinates() === null) {
        coord = await geoCoder.geocode(`${branch.getAddress().getAddress()}, ${branch.getAddress().getPost().getCityName()} ${branch.getAddress().getPost().getCountry().getName()}`)
        branch.getAddress().setCoordinates({ x: coord[0].latitude, y: coord[0].longitude })
        branch.getAddress().update()
      } else {
        coord.push({ latitude: branch.getAddress().getCoordinates().x, longitude: branch.getAddress().getCoordinates().y })
      }
      resArr.push({ image: branch.getPartner().getImage(), lat: coord[0].latitude, lon: coord[0].longitude, dis: Math.floor(measure(coord[0].latitude, coord[0].longitude, req.body.lat, req.body.lng) * 100) / 100, name: branch.getTitle(), id: branch.ID })
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
