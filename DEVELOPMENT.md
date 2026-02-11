# Bridezilla Demo - Development Guide

## Automated Validation & Error Detection

This project includes automated tools to catch common errors before manual testing.

---

## Schema Validation (After Database Migrations)

### The Problem It Solves

When you modify database schemas (add/drop/rename columns), API endpoints may still reference old column names, causing runtime errors like:

```
PGRST204: Column 'estimated_cost' does not exist
```

### How to Use

**After creating or running a migration:**

```bash
npm run validate-schema
```

**What it does:**
- Parses all `.sql` migration files in `supabase/migrations/`
- Extracts dropped, added, and renamed columns
- Searches API routes for references to dropped columns
- Reports mismatches with fix suggestions

**Example output:**

```
⚠️  Schema Validation Warnings:

Migration: supabase/migrations/003_vendor_pricing_structure.sql
- Dropped columns: vendor_currency, estimated_cost, default_note
+ Added columns: pricing, description

Files still referencing dropped columns:
- app/api/planner/vendor-library/route.ts:128 (estimated_cost)
  Column 'estimated_cost' was dropped from planner_vendor_library. Consider using one of the new columns: pricing, description
- app/api/planner/vendor-library/route.ts:137 (default_note)
  Column 'default_note' was dropped from planner_vendor_library. Consider using one of the new columns: pricing, description

Summary: 2 issue(s) in 1 file(s)
```

### Post-Migration Checklist

1. ✅ Create migration: `supabase/migrations/00X_description.sql`
2. ✅ Apply migration to database
3. ✅ Run validation: `npm run validate-schema`
4. ✅ Fix any reported issues
5. ✅ Update TypeScript types if needed
6. ✅ Test affected API endpoints
7. ✅ Test frontend components that use changed fields

---

## Network Request Monitoring (Development Mode)

### The Problem It Solves

Silent network failures and authentication errors can be hard to debug when you have to manually open the Network tab.

### How It Works

**Automatically active in development mode** - no setup needed!

When you run `npm run dev`, all `fetch()` requests are automatically logged with:
- Request method, URL, headers (auth tokens sanitized)
- Request body (parsed JSON)
- Response status and timing
- Error details for failed requests

**Console output examples:**

```
🔧 Dev Tools Loaded - Network monitoring active

🌐 POST /api/planner/vendor-library
  { headers: { Authorization: "Bearer [abc123...]" }, body: { vendor_name: "Test", ... } }
✅ 201 /api/planner/vendor-library (45ms)

🌐 GET /api/planner/vendor-library
  { headers: { Authorization: "Bearer [abc123...]" } }
❌ 401 Unauthorized /api/planner/vendor-library (23ms)
Error details: { message: "Invalid auth token" }
```

### Benefits

- Catch auth token mismatches immediately
- See timing for slow requests
- Identify failed requests without opening DevTools
- Sanitized auth headers for safe console sharing

---

## React Component Best Practices

### Keys for Mapped Arrays

**Problem:** Missing or incorrect `key` props cause React to reuse components incorrectly, showing stale data.

**Bad:**
```tsx
{vendors.map((vendor, idx) => (
  <VendorCard vendor={vendor} />
))}
```

**Good:**
```tsx
{vendors.map((vendor, idx) => (
  <VendorCard
    key={`vendor-${idx}-${vendor.id}`}
    vendor={vendor}
  />
))}
```

**Key composition rules:**
- Include unique identifier (ID, name, etc.)
- Include index to handle duplicates
- Use stable values (not timestamps that change)

---

## AI Output Validation

### The Problem It Solves

AI-generated JSON can have escaping issues (literal `\n` instead of `\\n`) causing parse errors:

```
JSON parse error: Bad control character in string literal
```

### How to Fix

When prompting AI for JSON output, be explicit about escaping:

**Bad prompt:**
```
Parse this vendor data and return JSON
```

**Good prompt:**
```
Parse this vendor data and return JSON.

IMPORTANT: Escape all special characters in strings:
- Newlines must be \\n (double backslash)
- Quotes must be \\"
- Backslashes must be \\\\

Example:
{
  "pricing": "PACKAGE ONE - €500\\nPACKAGE TWO - €800"
}
```

### Validation Helper (Future)

Consider adding Zod schema validation for AI responses:

```typescript
import { z } from 'zod';

const VendorSchema = z.object({
  vendor_name: z.string(),
  pricing: z.string(),
  description: z.string().optional(),
});

// In your API route
const parsed = VendorSchema.parse(aiResponse);
```

---

## Workflow Summary

### Before This System (Manual Testing Loop)
1. Write code
2. Run dev server
3. Test in browser
4. Find error (401, PGRST204, etc.)
5. Debug in DevTools
6. Fix code
7. Repeat steps 2-6

**Time:** 30-45 minutes per issue cycle

### With Automated Validation
1. Write code
2. Run `npm run validate-schema` (if migration changed)
3. Fix any reported issues
4. Run dev server
5. Check console for network logs
6. Test once → success

**Time:** 5-10 minutes, most issues caught before manual testing

---

## Future Enhancements

### Request Flow Tracer Agent
- Trace authentication tokens from frontend → backend
- Validate request payloads match API expectations
- Simulate full request lifecycle

### Pre-Commit Hooks
- Automatically run schema validation before commits with migrations
- Block commits if mismatches found

### Component State Validator
- Lint rule to check for missing/incorrect `key` props
- Validate keys use unique identifiers

---

## Troubleshooting

### Schema validator not finding issues

**Check:**
- Migration files in `supabase/migrations/` are formatted correctly
- API routes are in `app/api/` (searches this directory by default)
- Column names are spelled exactly as in SQL

### Network monitoring not showing

**Check:**
- Running in development mode (`npm run dev`, not `npm run build`)
- Browser console is open
- `DevToolsLoader` component is imported in `app/layout.tsx`

### False positives from schema validator

**Common cases:**
- Column name appears in comments (safe to ignore)
- Column name is part of variable name (e.g., `const vendor_currency_code`)
- Column name in test files (consider excluding from search)

To reduce false positives, the validator only flags references that look like actual column usage:
- String literals: `'column_name'` or `"column_name"`
- Object properties: `.column_name`
- Object keys: `column_name:`
- Array items: `column_name,`

---

## Quick Reference

```bash
# Validate schema after migrations
npm run validate-schema

# Run dev server with network monitoring
npm run dev

# Run tests (if added)
npm test

# Lint code
npm run lint

# Build for production
npm run build
```

---

## Questions?

- Schema validation issues: Check `scripts/validate-schema.js`
- Network monitoring config: Check `lib/devTools.ts`
- This guide: `DEVELOPMENT.md`
