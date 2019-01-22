#!/bin/sh

API="http://localhost:4741"
URL_PATH="/tasks"
ID=5c477db803d06dc9571b0770

curl "${API}${URL_PATH}/${ID}" \
  --request GET \
  --header "Authorization: Bearer ${TOKEN}" \
  | json_pp

echo
