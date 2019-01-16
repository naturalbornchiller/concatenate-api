#!/bin/sh

API="http://localhost:4741"
URL_PATH="/tasks"
ID=5c3f91d1d9f26d67c03e998f

curl "${API}${URL_PATH}/${ID}" \
  --request GET \
  --header "Authorization: Bearer ${TOKEN}" \
  | json_pp

echo
