# Database Setup Guide

## Quick Setup (2 steps)

### Step 1: Create Tables
Run the SQL in Supabase Dashboard:

```bash
npm run db:setup
```

This will:
1. Open `setup-database.sql` (the SQL you need to run)
2. Open Supabase SQL Editor in your browser

**In Supabase Dashboard:**
1. Copy all the SQL from `setup-database.sql`
2. Paste it into the SQL Editor
3. Click "RUN"

### Step 2: Populate Data
Once tables are created, run:

```bash
npm run db:populate
```

This will insert:
- ~10 vendor records from MOCK_VENDORS
- 4 sample RSVP records

## What Gets Created

### Tables

#### `vendors`
- Vendor details (name, type, contact info)
- Pricing (EUR and CAD)
- Contract status
- Payments (JSONB array)
- Notes

#### `rsvps`
- Guest details (name, email, phone)
- RSVP response (attending, number_of_guests)
- Guest list (JSONB array)
- Dietary requirements
- Song requests

### Sample Data

**Vendors**: All vendors from `lib/mock-data.ts` MOCK_VENDORS array
**RSVPs**: 4 sample guests (Alice & Bob, Carol, David & Emma, Frank & Grace)

## Troubleshooting

### "Could not find the table" error
- Tables don't exist yet
- Run Step 1 first

### Tables already exist
- The SQL uses `CREATE TABLE IF NOT EXISTS`
- Safe to run multiple times
- Populate script clears existing data first

### Need to reset data
Just run `npm run db:populate` again - it clears and repopulates.
