#!/bin/bash

API="http://localhost:4741"
URL_PATH="/tasks"
TOKEN=2d2ba9025bdfe075ceab6816f6dee498
NAME="Meditate"
# DAY_STARTED='1901-01-23'

curl "${API}${URL_PATH}/" \
  --include \
  --request POST \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer ${TOKEN}" \
  --data '{
    "task": {
      "name": "'"${NAME}"'",
      "chains": [{}]
    }
  }'

echo
