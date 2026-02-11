# Autonomous Next.js Error Detection System

**Status:** ✅ Active
**Last Updated:** February 9, 2026

---

## Overview

The autonomous error detection system monitors Next.js development logs in real-time and automatically detects hydration errors, DOM nesting issues, compilation errors, and runtime problems. Errors are captured, categorised, and made available for Claude to review and fix before declaring work complete.

---

## How It Works

### 1. Error Source

All Next.js errors are logged to:
```
.next/dev/logs/next-development.log
```

This includes:
- Browser console errors (hydration, DOM nesting, runtime)
- Server compilation errors
- Build warnings

### 2. Automatic Detection

`scripts/dev-watcher.js` monitors the log file and:
1. Detects changes to the log file
2. Parses new log entries using `scripts/nextjs-error-parser.js`
3. Categorises errors by type and severity
4. Writes structured error report to `.next/dev/errors/error-report.json`
5. Creates flag file `.next/dev/errors/ERRORS_PRESENT` when errors exist

### 3. Error Categories

| Category | Severity | Description |
|----------|----------|-------------|
| **HYDRATION** | CRITICAL | Server/client HTML mismatch |
| **DOM_NESTING** | CRITICAL | Invalid HTML structure (e.g., div in tbody) |
| **COMPILATION** | BLOCKING | Module not found, syntax errors |
| **RUNTIME** | HIGH | Runtime exceptions |
| **WARNING** | LOW | Non-blocking warnings |

---

## Claude's Workflow

### When Writing/Editing Code

After using `Write` or `Edit` tools, Claude should:

1. **Wait for validation** (5 seconds for recompilation)
2. **Check for errors automatically** (dev-watcher displays results in terminal)
3. **Read error report** if errors detected:
   ```
   Read: .next/dev/errors/error-report.json
   ```

### Before Declaring "Done"

**MANDATORY CHECK:**

```
1. Read: .next/dev/errors/error-report.json
2. Check: hasErrors === true?

   If YES:
     - Read error details from errors array
     - Identify root cause from filePath and suggestions
     - Edit the file to fix the issue
     - Wait 5 seconds for recompilation
     - Re-check error-report.json
     - Repeat until hasErrors === false

   If NO:
     - Declare: "Done, ready to test!"
```

**Never declare work complete if hasErrors === true.**

---

## Error Report Format

### Structure

```json
{
  "lastUpdated": "2026-02-09T14:20:33.526Z",
  "hasErrors": true,
  "errorCount": 2,
  "errors": [
    {
      "id": "HYDRATION-ValidationNotifications-1739104530",
      "category": "HYDRATION",
      "severity": "CRITICAL",
      "priority": 1,
      "summary": "Hydration error in ValidationNotifications",
      "message": "In HTML, <div> cannot be a child of <tbody>",
      "component": "ValidationNotifications",
      "filePath": "components/ValidationNotifications.tsx",
      "lineNumber": 51,
      "suggestions": [
        "Remove <div> wrapper inside <tbody>",
        "Use <tr> and <td> for table content",
        "Check HTML5 nesting rules for the elements involved"
      ],
      "firstSeen": "2026-02-09T09:15:25.560Z",
      "lastSeen": "2026-02-09T09:15:30.123Z",
      "occurrences": 3
    }
  ]
}
```

### Key Fields

- **hasErrors**: Boolean - Quick check if any errors exist
- **errorCount**: Number - Total number of unique errors
- **errors**: Array - Detailed error information

### Error Object Fields

- **id**: Unique identifier for deduplication
- **category**: Error type (HYDRATION, DOM_NESTING, etc.)
- **severity**: CRITICAL, BLOCKING, HIGH, LOW
- **summary**: Human-readable error summary
- **message**: Full error message
- **component**: React component name (if detected)
- **filePath**: File path to the problematic code
- **lineNumber**: Line number (if available)
- **suggestions**: Array of actionable fix suggestions
- **firstSeen**: Timestamp when error first appeared
- **lastSeen**: Timestamp of most recent occurrence
- **occurrences**: Number of times error occurred

---

## Common Errors and Fixes

### 1. Hydration: `<div>` in `<tbody>`

**Error:**
```
In HTML, <div> cannot be a child of <tbody>
```

**Fix:**
```tsx
// BEFORE (WRONG)
<tbody>
  <div>
    <VendorLibraryCard vendor={vendor} />
  </div>
</tbody>

// AFTER (CORRECT)
<tbody>
  <VendorLibraryCard vendor={vendor} />
</tbody>
```

**OR** if card needs to be a row:
```tsx
// VendorLibraryCard should render <tr>
function VendorLibraryCard({ vendor }) {
  return (
    <tr>
      <td colSpan={5}>
        {/* Card content */}
      </td>
    </tr>
  );
}
```

### 2. DOM Nesting: `<p>` with block elements

**Error:**
```
<div> cannot appear as a child of <p>
```

**Fix:**
```tsx
// BEFORE (WRONG)
<p>
  <div>Content</div>
</p>

// AFTER (CORRECT)
<div>
  <div>Content</div>
</div>
```

### 3. Hydration: Conditional Rendering Mismatch

**Error:**
```
Text content does not match server-rendered HTML
```

**Fix:**
```tsx
// BEFORE (WRONG)
<div>{typeof window !== 'undefined' ? clientValue : serverValue}</div>

// AFTER (CORRECT)
const [mounted, setMounted] = useState(false);

useEffect(() => {
  setMounted(true);
}, []);

<div suppressHydrationWarning>
  {mounted ? clientValue : serverValue}
</div>
```

---

## Performance Characteristics

- **Detection latency:** < 1 second
- **Log parsing:** < 20ms for 100 lines
- **Memory overhead:** < 5 MB
- **CPU usage:** < 1% when idle

---

## Files and Locations

### Source Files
- `scripts/nextjs-error-parser.js` - Log parsing and error categorisation
- `scripts/error-report-writer.js` - JSON report generation
- `scripts/dev-watcher.js` - File watching and validation orchestration

### Runtime Files (Auto-generated)
- `.next/dev/logs/next-development.log` - Next.js error log (source)
- `.next/dev/errors/error-report.json` - Structured error data (read this!)
- `.next/dev/errors/ERRORS_PRESENT` - Flag file (exists when errors > 0)
- `.next/dev/errors/.gitignore` - Don't commit error reports

---

## Troubleshooting

### No Errors Detected But Page Shows Errors

**Cause:** Log file may not contain recent errors yet.

**Solution:**
1. Refresh the browser to trigger error
2. Wait 2-3 seconds for log to update
3. Check error-report.json again

### False Positives

**Cause:** Parser may misinterpret warning messages as errors.

**Solution:**
1. Check error.severity field
2. Ignore LOW severity warnings if not relevant
3. Focus on CRITICAL and BLOCKING errors first

### Error Persists After Fix

**Cause:** Browser cache or Fast Refresh not picking up changes.

**Solution:**
1. Hard refresh browser (Cmd+Shift+R)
2. Wait 5 seconds for recompilation
3. Check error-report.json again
4. If still present, verify fix was applied correctly

---

## Integration with package.json Scripts

The dev-watcher runs automatically when you start the development server:

```bash
npm run dev
# Starts both Next.js and dev-watcher
```

To run dev-watcher separately:

```bash
npm run dev:watch
# Runs only the watcher (requires Next.js running separately)
```

---

## Success Metrics

✅ **Working correctly when:**
- Errors appear in error-report.json within 1 second of occurrence
- Errors include file path and line number (when available)
- Suggestions are actionable and specific
- Errors clear from report when fixed
- False positive rate < 5%

❌ **Not working if:**
- Errors not detected after 5+ seconds
- error-report.json missing or empty when errors present
- File paths incorrect or missing
- Errors don't clear after fixing

---

## Example: End-to-End Flow

1. **Claude creates component with hydration error:**
   ```tsx
   // ValidationNotifications.tsx
   <tbody>
     <div> {/* WRONG: div in tbody */}
       <tr>...</tr>
     </div>
   </tbody>
   ```

2. **dev-watcher detects error automatically:**
   ```
   📋 Next.js log updated

   🔍 Checking Next.js development logs...

   ❌ DOM_NESTING: Invalid DOM nesting in ValidationNotifications

   Details:
     - 📍 components/ValidationNotifications.tsx:51
     - 💬 In HTML, <div> cannot be a child of <tbody>

   💡 Suggestions:
     Remove <div> wrapper inside <tbody>
     Use <tr> and <td> for table content
   ```

3. **Claude reads error report:**
   ```
   Read: .next/dev/errors/error-report.json
   → hasErrors: true
   → errorCount: 1
   → Error: DOM_NESTING in components/ValidationNotifications.tsx:51
   ```

4. **Claude fixes the issue:**
   ```tsx
   // ValidationNotifications.tsx
   <tbody>
     <tr>...</tr> {/* CORRECT: removed div wrapper */}
   </tbody>
   ```

5. **Error clears automatically:**
   ```
   ✅ No Next.js errors detected
   ```

6. **Claude declares done:**
   ```
   "Done, ready to test! All errors fixed."
   ```

---

## Future Enhancements

**Not yet implemented (out of scope):**
- Browser-based error dashboard UI
- AI-powered fix generation (use Claude API for exact code fixes)
- Error analytics and trends
- Git integration (block commits when errors present)
- Slack/email notifications for persistent errors

---

## Questions or Issues?

If the error detection system isn't working as expected:

1. Check that dev-watcher is running (should start with `npm run dev`)
2. Verify `.next/dev/logs/next-development.log` exists and is being written to
3. Check terminal output for validation results
4. Read error-report.json manually to verify errors are being captured

The system is designed to be autonomous - no manual configuration needed.
