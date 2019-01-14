#!/bin/bash

API="http://localhost:4741"
URL_PATH="/tasks"
# TOKEN=ad410895f4171779f1b30bd4991b66a6
NAME="Walk a little"
DAY_STARTED='2005-01-02'

curl "${API}${URL_PATH}/" \
  --request POST \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer ${TOKEN}" \
  --data '{
    "task": {
      "name": "'"${NAME}"'"
    }
  }' \
  | json_pp

echo
