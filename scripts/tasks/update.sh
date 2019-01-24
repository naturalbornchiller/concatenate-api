#!/bin/bash

API="http://localhost:4741"
URL_PATH="/tasks"
ID=5c4a20c7daff20fa1dcdb7f7

curl "${API}${URL_PATH}/${ID}" \
  --request PATCH \
  --include \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer ${TOKEN}"

echo
