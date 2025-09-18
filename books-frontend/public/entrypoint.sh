#!/usr/bin/env sh
set -e

# Ensure output dir exists (adjust path to your server’s web root)
: "${WEB_ROOT:=/usr/share/nginx/html}"

# Generate runtime-config.js from template using envsubst
if command -v envsubst >/dev/null 2>&1; then
  envsubst < "${WEB_ROOT}/runtime-config.js.template" > "${WEB_ROOT}/runtime-config.js"
else
  # Fallback using sed for the single var
  IS_AZURE_VAL="${IS_AZURE:-false}"
  sed "s|\${IS_AZURE:-false}|${IS_AZURE_VAL}|g" "${WEB_ROOT}/runtime-config.js.template" > "${WEB_ROOT}/runtime-config.js"
fi

exec "$@"