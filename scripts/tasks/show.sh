#!/bin/sh

API="http://localhost:4741"
URL_PATH="/tasks"
ID=5c4a20c7daff20fa1dcdb7f7

curl "${API}${URL_PATH}/${ID}" \
  --request GET \
  --header "Authorization: Bearer ${TOKEN}" \
  | json_pp

echo
