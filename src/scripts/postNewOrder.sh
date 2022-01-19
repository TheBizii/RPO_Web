#!/usr/bin/bash

curl \
  -H "Content-Type: application/json" \
  --request POST \
  --data "{\"userID\":\"${1}\",\"items\":[{\"id\":2,\"quantity\":2},{\"id\":3,\"quantity\":1}],\"totalPrice\":\"${2}\"}" \
  "http://127.0.0.1:3000/API/newOrder"
  #"https://bolt.printeepro.com/API/newOrder"
