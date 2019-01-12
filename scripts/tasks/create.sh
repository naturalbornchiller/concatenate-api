#!/bin/bash

API="http://localhost:4741"
URL_PATH="/tasks"

curl "${API}${URL_PATH}" \
  --include \
  --request POST \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer ${TOKEN}" \
  --data '{
    "task": {
      "name": "'"${NAME}"'",
      "chains": [{
        "'"${DAY_STARTED}"'",
        "'"${DAY_BROKEN}"'",
        "'"${LAST_CONCAT}"'"
      }]
    }
  }'

echo
