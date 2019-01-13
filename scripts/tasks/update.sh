#!/bin/bash

API="http://localhost:4741"
URL_PATH="/tasks"
TOKEN=2d2ba9025bdfe075ceab6816f6dee498
ID=5c3b628e26cc5a08969de95c

curl "${API}${URL_PATH}/${ID}" \
  --request PATCH \
  --header "Content-Type: application/json" \
--header "Authorization: Bearer ${TOKEN}" \
--data '{
    "task": {
      "name": "'"${NAME}"'",
      "chains": [{
        "lastConcat": "'"${LAST_CONCAT}"'"
      }]
    }
  }' \
| json_pp

echo
