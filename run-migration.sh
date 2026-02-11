#!/bin/bash
source .env.local

# Try to execute SQL via Supabase REST API
curl -X POST "${NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/exec" \
  -H "apikey: ${SUPABASE_SERVICE_ROLE_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_SERVICE_ROLE_KEY}" \
  -H "Content-Type: application/json" \
  -d '{"sql": "SELECT 1"}' 

