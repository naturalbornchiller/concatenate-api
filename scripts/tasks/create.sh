#!/bin/bash

API="http://localhost:4741"
URL_PATH="/tasks"
TOKEN=2d2ba9025bdfe075ceab6816f6dee498
NAME="Walk a little"
DAY_STARTED='2005-01-02'

curl "${API}${URL_PATH}/" \
  --request POST \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer ${TOKEN}" \
  --data '{
    "task": {
      "name": "'"${NAME}"'",
      "chains": [{
        "dayStarted": "'"${DAY_STARTED}"'"
      }]
    }
  }' \
  | json_pp

echo
