#!/usr/bin/bash

curl \
  -H "Content-Type: application/json" \
  --request POST \
  --data "{\"email\":\"${1}\",\"password\":\"${2}\"}" \
  "http://127.0.0.1:3000/API/login"
