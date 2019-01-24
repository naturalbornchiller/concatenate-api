#!/bin/sh

API="http://localhost:4741"
URL_PATH="/tasks"
ID=5c4a0b8fdde925f311841fc9

curl "${API}${URL_PATH}/${ID}" \
  --request GET \
  --header "Authorization: Bearer ${TOKEN}" \
  | json_pp

echo
