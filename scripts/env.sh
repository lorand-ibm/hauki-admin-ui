#!/bin/bash

set -e -o pipefail

# Recreate config file
rm -rf ./env-config.js
touch ./env-config.js

# Add assignment
echo "window.ENV = {" >> ./env-config.js

# Each line represents key=value pairs
while read -r line || [[ -n "$line" ]];
do
  # Split env variables by character `=`
  if printf '%s\n' "$line" | grep -q -e '='; then
    varname=$(printf '%s\n' "$line" | sed -e 's/=.*//')
  fi

  if [ "${!varname}" = "" ]; then
    echo "Missing variable ${varname}"
    exit 2;
  fi

  # Read value of the current variable from environment variables
  value=$(printf '%s\n' "${!varname}")

  # Append configuration property to JS file
  echo "  $varname: '$value'," >> ./env-config.js
done < .env

echo "};" >> ./env-config.js
