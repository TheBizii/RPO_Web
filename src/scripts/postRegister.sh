#!/usr/bin/bash

curl \
  -H "Content-Type: application/json" \
  --request POST \
  --data "{\"username\":\"${1}\",\"password\":\"${2}\",\"firstName\":\"${3}\",\"middleName\":\"${4}\",\"lastName\":\"${5}\",\"phone\":\"${6}\"}" \
  "http://127.0.0.1:3000/API/register"
  #"https://bolt.printeepro.com/API/register"
