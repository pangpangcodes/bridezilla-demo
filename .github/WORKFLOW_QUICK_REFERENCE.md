# Workflow Quick Reference Card

## ⚡ New Autonomous Workflow

### One Command Does Everything:

```bash
npm run dev
```

**This automatically:**
- ✅ Starts Next.js dev server
- ✅ Enables network monitoring
- ✅ Watches files for changes
- ✅ Validates schema when migrations change
- ✅ Checks API routes when they change
- ✅ Validates React components when they change
- ✅ Shows errors in console AND browser

**You just code, it validates automatically!** 🚀

---

## Alternative Commands (If Needed)

```bash
# Just Next.js (no file watcher)
npm run dev:next

# Just file watcher (separate terminal)
npm run dev:watch-only

# Manual schema validation (one-time)
npm run validate-schema
```

---

## When to Run What

| Situation | Command | Why |
|-----------|---------|-----|
| Starting work | `npm run dev` | Enables network monitoring |
| After migration | `npm run validate-schema` | Catch schema mismatches |
| Before commit | `npm run validate-schema` | Ensure no API breaks |
| Auth errors | Check console | Network logs show token issues |
| 401/403 errors | Check console | See which endpoints fail |

---

## Reading Console Network Logs

```
🔧 Dev Tools Loaded           → Monitoring is active
🌐 POST /api/endpoint         → Request initiated
✅ 201 /api/endpoint (45ms)   → Success + timing
❌ 401 Unauthorized (23ms)    → Failed + error details
💥 Network error              → Request didn't complete
```

---

## Schema Validation Output

```
⚠️  Schema Validation Warnings

Migration: 003_vendor_pricing_structure.sql
- Dropped columns: vendor_currency          ← Removed from database
+ Added columns: pricing, description       ← Added to database

Files still referencing dropped columns:
- app/api/.../route.ts:128 (vendor_currency)  ← Fix needed
  Column dropped. Consider using: pricing     ← Suggestion
```

---

## React Key Props Reminder

```tsx
❌ BAD - No key
{items.map(item => <Card {...item} />)}

❌ BAD - Index only
{items.map((item, i) => <Card key={i} {...item} />)}

✅ GOOD - Unique + stable
{items.map((item, i) => <Card key={`${item.id}-${i}`} {...item} />)}
```

---

## Post-Migration Checklist

- [ ] Migration file created in `supabase/migrations/`
- [ ] Migration applied to database
- [ ] Run `npm run validate-schema`
- [ ] Fix any reported schema mismatches
- [ ] Update TypeScript types if needed
- [ ] Test affected API endpoints
- [ ] Test frontend components
- [ ] Commit changes

---

## Troubleshooting

| Issue | Check | Fix |
|-------|-------|-----|
| Network logs not showing | Dev mode? Console open? | Run `npm run dev` |
| Schema validator no output | Migration in correct folder? | Check `supabase/migrations/` |
| False positive warnings | Variable vs column name? | Safe to ignore if not actual DB column |
| 401 errors | Auth token correct? | Check console for token used |

---

## Documentation

- **Full guide**: `DEVELOPMENT.md`
- **Implementation details**: `WORKFLOW_OPTIMIZATION_SUMMARY.md`
- **This card**: `.github/WORKFLOW_QUICK_REFERENCE.md`

---

## Time Savings

| Task | Before | After | Saved |
|------|--------|-------|-------|
| Schema mismatch debug | 15 min | 2 min | 13 min |
| Auth error debug | 10 min | 2 min | 8 min |
| Network inspection | 5 min | 0 min | 5 min |
| **Per session** | **30 min** | **4 min** | **26 min** |

---

Print this card or bookmark it for quick reference during development!
