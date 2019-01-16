#!/bin/sh

API="http://localhost:4741"
URL_PATH="/tasks"
# TOKEN=ad410895f4171779f1b30bd4991b66a6
ID=5c3ca5d7335a022cc94b0a58

curl "${API}${URL_PATH}/${ID}" \
  --request GET \
  --header "Authorization: Bearer ${TOKEN}" \
  | json_pp

echo
