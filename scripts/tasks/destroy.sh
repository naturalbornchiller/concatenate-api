#!/bin/bash

API="http://localhost:4741"
URL_PATH="/tasks"
TOKEN=ad410895f4171779f1b30bd4991b66a6
ID=5c3b9e0c29811017832bf6ad

curl "${API}${URL_PATH}/${ID}" \
  --include \
  --request DELETE \
  --header "Authorization: Bearer ${TOKEN}"

echo
