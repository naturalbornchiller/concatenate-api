#!/bin/sh

API="http://localhost:4741"
URL_PATH="/tasks"
# TOKEN=ad410895f4171779f1b30bd4991b66a6
ID=5c3b682cb8a8490adf6bdea5

curl "${API}${URL_PATH}/${ID}" \
  --request GET \
  --header "Authorization: Bearer ${TOKEN}" \
  | json_pp

echo
