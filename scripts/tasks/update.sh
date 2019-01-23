#!/bin/bash

API="http://localhost:4741"
URL_PATH="/tasks"
ID=5c4895277b3633db170f9dc1

curl "${API}${URL_PATH}/${ID}" \
  --request PATCH \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer ${TOKEN}" \
  | json_pp

echo
