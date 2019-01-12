#!/bin/bash

API="http://localhost:4741"
URL_PATH="/sign-in"
EMAIL="MAIL@MAIL.MAIL"
PASSWORD="MCKENZIE"

curl "${API}${URL_PATH}" \
  --include \
  --request POST \
  --header "Content-Type: application/json" \
  --data '{
    "credentials": {
      "email": "'"${EMAIL}"'",
      "password": "'"${PASSWORD}"'"
    }
  }'

echo
