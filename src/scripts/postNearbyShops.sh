#!/usr/bin/bash

curl \
  -H "Content-Type: application/json" \
  --request POST \
  --data "{\"lat\":\"${1}\",\"lng\":\"${2}\"}" \
  "http://127.0.0.1:3000/API/nearbyShops"
  #"https://bolt.printeepro.com/API/nearbyShops"
