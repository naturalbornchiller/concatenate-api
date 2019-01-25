#!/bin/sh

API="http://localhost:4741"
URL_PATH="/tasks"
ID=5c4a54c48ddd1f0256f3d11d

curl "${API}${URL_PATH}/${ID}" \
  --request GET \
  --header "Authorization: Bearer ${TOKEN}" \
  | json_pp

echo
