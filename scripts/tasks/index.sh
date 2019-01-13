#!/bin/sh

API="http://localhost:4741"
URL_PATH="/tasks"
TOKEN=2d2ba9025bdfe075ceab6816f6dee498

curl "${API}${URL_PATH}" \
  --request GET \
  --header "Authorization: Bearer ${TOKEN}" \
  | json_pp

echo
