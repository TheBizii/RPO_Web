#!/usr/bin/bash

curl \
  -H "Content-Type: application/json" \
  --request POST \
  --data "{\"storeId\":\"${1}\"}" \
  "http://127.0.0.1:3000/API/storeGoods"
  #"https://bolt.printeepro.com/API/nearbyShops"
