#!/bin/sh

API="http://localhost:4741"
URL_PATH="/tasks"

curl "${API}${URL_PATH}" \
  --request GET \
  --header "Authorization: Bearer ${TOKEN}" \
  | json_pp

echo


# API="http://localhost:4741"
# URL_PATH="/change-password"

# curl "${API}${URL_PATH}/" \
#   --include \
#   --request PATCH \
#   --header "Authorization: Token token=${TOKEN}" \
#   --header "Content-Type: application/json" \
#   --data '{
#     "passwords": {
#       "old": "'"${OLDPW}"'",
#       "new": "'"${NEWPW}"'"
#     }
#   }'

# echo