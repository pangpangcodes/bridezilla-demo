#!/bin/bash

# Script to normalize all existing vendor tags
# Usage:
#   ./scripts/normalize-tags.sh --dry-run    # Preview changes
#   ./scripts/normalize-tags.sh              # Apply changes

set -e

# Check if --dry-run flag is passed
DRY_RUN="false"
if [[ "$1" == "--dry-run" ]]; then
  DRY_RUN="true"
  echo "🔍 DRY RUN MODE - No changes will be made"
  echo ""
fi

# Get auth token from sessionStorage (you'll need to paste this manually)
echo "📋 To run this script, you need your planner auth token."
echo "   1. Open http://localhost:3000/planner in your browser"
echo "   2. Open DevTools Console (Cmd+Option+J on Mac)"
echo "   3. Run: sessionStorage.getItem('planner_auth')"
echo "   4. Copy the token (without quotes)"
echo ""
read -p "Paste your auth token: " TOKEN

if [[ -z "$TOKEN" ]]; then
  echo "❌ No token provided. Exiting."
  exit 1
fi

echo ""
echo "🔄 Normalizing tags..."
echo ""

# Call the API
RESPONSE=$(curl -s -X POST http://localhost:3000/api/planner/vendor-library/normalize-tags \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"dry_run\": $DRY_RUN}")

# Check if request was successful
if echo "$RESPONSE" | grep -q '"success":true'; then
  echo "$RESPONSE" | jq '.data'

  CHANGED=$(echo "$RESPONSE" | jq -r '.data.changed')
  UNCHANGED=$(echo "$RESPONSE" | jq -r '.data.unchanged')

  echo ""
  echo "========================================================================"
  echo "✅ $UNCHANGED vendor(s) already had normalized tags"
  echo "🔧 $CHANGED vendor(s) $(if [[ "$DRY_RUN" == "true" ]]; then echo "would be"; else echo "were"; fi) updated"
  echo "========================================================================"

  if [[ "$DRY_RUN" == "true" ]] && [[ "$CHANGED" -gt 0 ]]; then
    echo ""
    echo "💡 This was a dry run. Run without --dry-run to apply changes:"
    echo "   ./scripts/normalize-tags.sh"
  elif [[ "$CHANGED" -gt 0 ]]; then
    echo ""
    echo "✅ All tags have been normalized!"
  fi
else
  echo "❌ Error normalizing tags:"
  echo "$RESPONSE" | jq '.'
  exit 1
fi
