#!/bin/bash

#------------------------------------------------------------------------------
#- build-static.sh
#- Copies all necessary x0 JavaScript source files and static web assets
#- from /www into the /static directory, preparing it for static deployment.
#-
#- Usage:
#-   bin/build-static.sh [OUTPUT_DIR]
#-
#- OUTPUT_DIR defaults to <repo-root>/static when not specified.
#------------------------------------------------------------------------------

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(dirname "$SCRIPT_DIR")"

WWW_DIR="${REPO_ROOT}/www"
OUTPUT_DIR="${1:-${REPO_ROOT}/static}"

echo "x0 static build"
echo "  source : ${WWW_DIR}"
echo "  output : ${OUTPUT_DIR}"

mkdir -p "${OUTPUT_DIR}"

#- JavaScript source files
echo "  copying JS files ..."
cp -a "${WWW_DIR}"/*.js "${OUTPUT_DIR}/"

#- CSS and font assets (bootstrap, globalstyles, fontawesome)
echo "  copying static assets ..."
cp -ra "${WWW_DIR}/static/." "${OUTPUT_DIR}/static/"

#- Favicon and image assets
echo "  copying image assets ..."
mkdir -p "${OUTPUT_DIR}/image"
cp -ra "${WWW_DIR}/image/." "${OUTPUT_DIR}/image/"

echo "  done."
echo ""
echo "  Place your metadata files in ${OUTPUT_DIR}/data/:"
echo "    object.json   - x0 object definitions"
echo "    skeleton.json - x0 screen skeleton"
echo "    menu.json     - x0 menu definition"
echo "    text-data.json - x0 UI text strings"
