const express = require('express')
const router = express.Router()
const nodeGeo = require('node-geocoder');
const params = {
  provider: 'openstreetmap'
}
// const db = require('../modules/db')

// <a href="https://my-location.org/?lat=46.5554&lng=15.6465" target="_blank">(46.5554,15.6465)</a>
router.post('/nearbyShops', async function (req, res) {
  res.setHeader('Content-Type', 'application/json')
  if (req.body.lat === undefined && req.body.lng === undefined) {
    res.json({
      error: 'Something went wrong with location'
    })
    return
  }
  // const queryResult = await db.confirmLoginInformation(req.body.email, req.body.password)
  // if (queryResult != null) {
  const geoCoder = nodeGeo(params)
  geoCoder.geocode('Luray Caverns')
    .then((res)=> {
      console.log(res);
    })
    .catch((err)=> {
      console.log(err);
    });
  res.json({
    message: 'OK'
  })
  // } else {
  //  res.json({
  //    error: 'Something went wrong with login'
  //  })
  // }
})

module.exports = router
