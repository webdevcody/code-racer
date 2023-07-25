#!/bin/bash

# Check if .env file exists
if [ ! -f .env ]; then
  echo "Error: .env file not found."
  exit 1
fi

# Read each line from .env file and set secrets using flyctl
while IFS= read -r line || [[ -n "$line" ]]; do
  # Ignore empty lines and comments (lines starting with #)
  if [[ "$line" =~ ^[[:space:]]*# || -z "$line" ]]; then
    continue
  fi

  # Check if the line has double quotes
  if echo "$line" | grep -q -E '^[[:space:]]*[^=]+="[^"]*"$'; then
    # Extract key-value pairs with quotes
    KEY=$(echo "$line" | grep -o -E '^[[:space:]]*[^=]+' | xargs)
    VALUE=$(echo "$line" | grep -o -E '"[^"]*"' | sed 's/"//g')
  else
    # If no quotes are found, extract key-value pairs without quotes
    KEY=$(echo "$line" | cut -d '=' -f 1)
    VALUE=$(echo "$line" | cut -d '=' -f 2-)
  fi

  # Log the name of the variable being set as a secret
  echo "Setting secret for: $KEY"

  # Set secrets using flyctl
  flyctl secrets set "$KEY"="$VALUE"
done < .env

echo "Secrets setup completed!"

