#!/bin/sh

API="http://localhost:4741"
URL_PATH="/tasks"
TOKEN=ad410895f4171779f1b30bd4991b66a6

curl "${API}${URL_PATH}" \
  --request GET \
  --header "Authorization: Bearer ${TOKEN}" \
  | json_pp

echo
