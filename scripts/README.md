# Development Scripts

This directory contains automation scripts for the autonomous development environment.

---

## Scripts Overview

### Development Server

#### `dev-with-watch.js`
**Purpose:** Main development server launcher

**Usage:**
```bash
npm run dev
```

**What it does:**
1. Starts Next.js dev server (`npm run dev:next`)
2. Starts file watcher after 2 second delay
3. Displays banner with active features
4. Handles graceful shutdown on Ctrl+C

**Features Enabled:**
- Network monitoring (automatic in browser)
- File watching (validates changes automatically)
- Schema validation (runs when migrations change)
- API checking (validates routes when they change)
- Component checking (validates React best practices)
- Next.js error detection (catches hydration & DOM issues)

---

### File Watching & Validation

#### `dev-watcher.js`
**Purpose:** Monitors file changes and triggers automatic validations

**Usage:**
```bash
npm run dev:watch-only
```

**Watches:**
- `supabase/migrations/*.sql` → Triggers schema validation
- `app/api/**/*.{ts,tsx}` → Triggers API validation
- `components/**/*.tsx` → Triggers component validation
- `app/**/*.tsx` → Triggers component validation (excludes API)
- `.next/dev/logs/next-development.log` → Triggers Next.js error detection

**Validation Types:**
1. **Schema** - Checks database schema consistency
2. **API** - Checks auth patterns and query patterns
3. **Component** - Checks for missing keys, best practices
4. **Next.js** - Detects hydration, DOM, compilation, runtime errors

**Configuration:**
- Debounce: 1000ms for files, 500ms for Next.js logs
- Rate limit: 5 seconds for files, 3 seconds for Next.js
- File change detection: 500ms debounce

---

### Next.js Error Detection

#### `nextjs-error-parser.js`
**Purpose:** Parses Next.js development logs and extracts structured error data

**Key Functions:**
```javascript
parseNextJSLog(logPath, sincePosition)
  → returns { errors: Array<ParsedError>, newPosition: number }

categorizeError(message, stackTrace)
  → returns ParsedError | null

generateSuggestions(category, message, component, filePath)
  → returns Array<string>
```

**Error Categories:**
- `HYDRATION` (Critical, Priority 1) - Server/client mismatch
- `DOM_NESTING` (Critical, Priority 2) - Invalid HTML structure
- `COMPILATION` (Blocking, Priority 3) - Module not found, syntax errors
- `RUNTIME` (High, Priority 4) - Runtime exceptions
- `WARNING` (Low, Priority 5) - Non-blocking warnings

**Features:**
- Parses log format: `[HH:MM:SS.mmm] Browser ERROR message`
- Extracts component names from React stack traces
- Identifies file paths and line numbers
- Generates actionable fix suggestions
- Deduplicates errors by signature

#### `error-report-writer.js`
**Purpose:** Writes and manages structured error reports

**Key Functions:**
```javascript
writeErrorReport(newErrors)
  → returns UpdatedReport

clearErrorsForFile(filePath)
  → returns UpdatedReport

clearAllErrors()
  → returns EmptyReport

readErrorReport()
  → returns CurrentReport

hasErrors()
  → returns boolean
```

**Output Files:**
- `.next/dev/errors/error-report.json` - Structured error data
- `.next/dev/errors/ERRORS_PRESENT` - Flag file (exists when errors > 0)
- `.next/dev/errors/.gitignore` - Prevents committing error reports

**Features:**
- Deduplicates errors by ID
- Tracks error history (firstSeen, lastSeen, occurrences)
- Creates/removes flag file automatically
- Handles concurrent access safely
- Sorts errors by priority

---

### Schema Validation

#### `validate-schema.js`
**Purpose:** Validates database schema consistency across codebase

**Usage:**
```bash
npm run validate-schema
```

**Checks:**
- Migration files match current schema
- API routes use correct column names
- No references to deprecated columns

**Output:**
- ✅ Success: No issues found
- ❌ Errors: Lists files and line numbers with issues

---

### Testing

#### `test-error-detection.js`
**Purpose:** Tests Next.js error detection system end-to-end

**Usage:**
```bash
npm run test-errors
```

**Tests:**
1. Parse Next.js development log
2. Write error report
3. Read error report
4. Display error details
5. Clear errors
6. Restore errors

**Output:**
- Summary of errors found
- Top 3 errors by priority
- Validation that all components work correctly

---

## Integration with npm Scripts

### Development
```bash
npm run dev              # Start Next.js + watcher (recommended)
npm run dev:next         # Start only Next.js
npm run dev:watch-only   # Start only watcher
```

### Validation
```bash
npm run validate-schema  # Check schema consistency
npm run test-errors      # Test error detection
```

### Production
```bash
npm run build            # Build for production
npm run start            # Start production server
```

---

## Error Report Format

### Location
```
.next/dev/errors/error-report.json
```

### Structure
```json
{
  "lastUpdated": "ISO 8601 timestamp",
  "hasErrors": true,
  "errorCount": 2,
  "errors": [
    {
      "id": "CATEGORY-Component-hash",
      "category": "HYDRATION | DOM_NESTING | COMPILATION | RUNTIME | WARNING",
      "severity": "CRITICAL | BLOCKING | HIGH | LOW",
      "priority": 1-5,
      "summary": "Human-readable summary",
      "message": "Full error message",
      "component": "ComponentName",
      "filePath": "path/to/file.tsx",
      "lineNumber": 123,
      "suggestions": ["Fix suggestion 1", "Fix suggestion 2"],
      "firstSeen": "ISO 8601 timestamp",
      "lastSeen": "ISO 8601 timestamp",
      "occurrences": 3,
      "timestamp": "HH:MM:SS.mmm",
      "source": "Browser | Server",
      "stackTrace": ["line 1", "line 2"]
    }
  ]
}
```

---

## Claude Integration

### Workflow

When Claude writes or edits code:

1. **Files saved** → dev-watcher detects change
2. **Validation triggered** → Runs appropriate validator
3. **Results displayed** → Terminal shows validation output
4. **Claude checks** → Reads `.next/dev/errors/error-report.json`
5. **Errors found?**
   - YES → Fix errors, wait 5s, check again
   - NO → Declare "Done, ready to test!"

### Required Check Before "Done"

```javascript
// Claude must read this file before declaring work complete
const report = readFile('.next/dev/errors/error-report.json');

if (report.hasErrors === true) {
  // Fix each error in report.errors array
  // Then check again until hasErrors === false
}
```

---

## File Watching Behaviour

### Directories Watched
- `supabase/migrations` (recursive)
- `app/api` (recursive)
- `components` (recursive)
- `app` (recursive, excludes api)

### Files Watched
- `.next/dev/logs/next-development.log` (single file)

### Debouncing
- File system events: 500ms
- Validation scheduling: 1000ms (files), 500ms (Next.js)
- Rate limiting: 5000ms (files), 3000ms (Next.js)

### Why These Settings?

**Fast Refresh Compatibility:**
- 500ms debounce prevents duplicate events
- 1000ms validation delay waits for Fast Refresh
- 5000ms rate limit prevents validation spam

**Quick Error Feedback:**
- 500ms debounce for Next.js logs (faster than files)
- 3000ms rate limit (shorter than 5s) for errors
- Goal: < 1 second from error occurrence to detection

---

## Troubleshooting

### Watcher Not Detecting Changes

**Check:**
1. Is watcher running? Look for "Dev Watcher started" message
2. Are you editing files in watched directories?
3. Is Next.js dev server running? (log file won't exist without it)

**Debug:**
```bash
# Run watcher separately to see output
npm run dev:watch-only
```

### Error Detection Not Working

**Check:**
1. Does `.next/dev/logs/next-development.log` exist?
2. Are errors appearing in browser console?
3. Wait 2-3 seconds after error for detection

**Debug:**
```bash
# Test error detection manually
npm run test-errors

# Check log file exists
ls -la .next/dev/logs/

# Read error report
cat .next/dev/errors/error-report.json | jq
```

### Validation Running Too Frequently

**Cause:** Multiple rapid file saves trigger repeated validations

**Solution:** Rate limiting prevents this - max once per 5s (files) or 3s (Next.js)

### Validation Not Running

**Cause:** Rate limiting may be blocking validation if changes are too frequent

**Solution:** Wait 5 seconds, then save file again to trigger validation

---

## Performance

### Measured Metrics
- File change detection: < 500ms
- Validation scheduling: < 1000ms
- Error parsing: < 20ms per 100 log lines
- Memory usage: < 5 MB
- CPU usage: < 1% when idle

### Optimization Strategies
- Incremental log parsing (tracks last read position)
- Debouncing file system events
- Rate limiting validations
- Efficient error deduplication

---

## Future Improvements

**Potential enhancements (not yet implemented):**
- Parallel validation execution
- Configurable validation rules
- Custom validation scripts
- Error trend analytics
- Integration with CI/CD
- Browser extension for error display

---

## Documentation

For complete documentation, see:
- `/docs/AUTONOMOUS_NEXTJS_ERRORS.md` - Full error detection guide
- `/docs/IMPLEMENTATION_SUMMARY.md` - Implementation details
- This file - Scripts reference

---

## Contributing

When adding new scripts:
1. Follow naming convention: `kebab-case.js`
2. Add shebang: `#!/usr/bin/env node`
3. Include JSDoc comments
4. Add to this README
5. Add npm script to `package.json`
6. Make executable: `chmod +x scripts/your-script.js`
