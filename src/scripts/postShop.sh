#!/usr/bin/bash

curl \
  -H "Content-Type: application/json" \
  --request POST \
  --data "{\"id\":${1}}" \
  "http://127.0.0.1:3000/API/shop"
  #"https://bolt.printeepro.com/API/login"
