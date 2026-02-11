# Autonomous Development Environment - File Map

## 🗺️ Complete File Structure

```
bridezilla/packages/demo/
│
├── 📝 Documentation (START HERE!)
│   ├── GET_STARTED.md ⭐ ← START HERE! (5-minute quick start)
│   ├── README_AUTONOMOUS.md (Overview with links)
│   ├── AUTONOMOUS_WORKFLOW.md (Complete 600-line guide)
│   ├── AUTONOMOUS_IMPLEMENTATION_SUMMARY.md (Implementation details)
│   ├── DEVELOPMENT.md (Best practices)
│   ├── WORKFLOW_OPTIMIZATION_SUMMARY.md (Original plan)
│   ├── DELIVERY_SUMMARY.md (What was delivered)
│   └── FILE_MAP.md (This file)
│
├── 📁 .github/
│   ├── WORKFLOW_QUICK_REFERENCE.md (Command reference)
│   └── IMPLEMENTATION_CHECKLIST.md (Status & roadmap)
│
├── 🔧 scripts/ (Autonomous System Core)
│   ├── dev-with-watch.js ← Orchestrator (starts everything)
│   ├── dev-watcher.js ← File watcher (monitors changes)
│   └── validate-schema.js ← Schema validator
│
├── 📦 lib/ (Utilities)
│   └── devTools.ts ← Network monitoring (fetch interceptor)
│
├── 🎨 components/ (UI Components)
│   ├── DevToolsLoader.tsx ← Loads dev tools in browser
│   └── ValidationNotifications.tsx ← Toast notifications
│
├── 🏗️ app/
│   └── layout.tsx (Modified) ← Loads DevToolsLoader & Notifications
│
├── ⚙️ package.json (Modified)
│   └── Scripts updated for autonomous workflow
│
└── 🗄️ supabase/
    └── migrations/ (Watched by file watcher)
        ├── 001_planner_tables.sql
        ├── 002_vendor_library.sql
        └── 003_vendor_pricing_structure.sql
```

---

## 📊 File Purpose Matrix

| File | Purpose | Type | Lines | When You Need It |
|------|---------|------|-------|------------------|
| **GET_STARTED.md** | 5-minute quick start | Doc | 250 | First time using |
| **README_AUTONOMOUS.md** | Overview & links | Doc | 400 | Need an overview |
| **AUTONOMOUS_WORKFLOW.md** | Complete guide | Doc | 600 | Deep dive |
| **WORKFLOW_QUICK_REFERENCE.md** | Command reference | Doc | 150 | Quick lookup |
| **dev-with-watch.js** | Starts both processes | Script | 80 | Automatic (npm run dev) |
| **dev-watcher.js** | Monitors file changes | Script | 300 | Automatic (background) |
| **validate-schema.js** | Validates schema | Script | 250 | Automatic (or manual) |
| **devTools.ts** | Network monitoring | Lib | 95 | Automatic (browser) |
| **DevToolsLoader.tsx** | Loads dev tools | Component | 15 | Automatic (layout) |
| **ValidationNotifications.tsx** | Shows errors in UI | Component | 120 | Automatic (layout) |

---

## 🎯 What Each File Does

### Core Autonomous System

#### `scripts/dev-with-watch.js` ⚡
**Role:** Orchestrator
**What it does:**
- Starts Next.js dev server
- Starts file watcher process
- Shows startup banner
- Handles shutdown

**When it runs:** When you type `npm run dev`
**You interact with it:** Never (just start it)

---

#### `scripts/dev-watcher.js` 👀
**Role:** File Monitor
**What it does:**
- Watches `supabase/migrations/*.sql`
- Watches `app/api/**/*.ts(x)`
- Watches `components/**/*.tsx`
- Triggers validations based on file type
- Shows results in console

**When it runs:** Background process (started by dev-with-watch.js)
**You interact with it:** Never (just see output)

---

#### `scripts/validate-schema.js` ✅
**Role:** Schema Validator
**What it does:**
- Parses SQL migration files
- Extracts column changes (DROP, ADD, RENAME)
- Searches API routes for references
- Reports mismatches with line numbers
- Provides fix suggestions

**When it runs:**
- Automatically when migrations change
- Manually: `npm run validate-schema`

**You interact with it:**
- Automatically: No interaction needed
- Manually: Run command to check schema

---

### Browser-Side Components

#### `lib/devTools.ts` 🌐
**Role:** Network Monitor
**What it does:**
- Intercepts `window.fetch()` in browser
- Logs request method, URL, headers, body
- Logs response status and timing
- Highlights errors in red
- Sanitizes auth tokens

**When it runs:** Loaded in browser on page load (dev mode only)
**You interact with it:** Check browser console for logs

---

#### `components/DevToolsLoader.tsx` 🔌
**Role:** Client-Side Loader
**What it does:**
- Loads devTools.ts in browser
- Only runs in development mode
- Ensures window object exists

**When it runs:** On every page load (in layout)
**You interact with it:** Never (automatic)

---

#### `components/ValidationNotifications.tsx` 🔔
**Role:** UI Alert System
**What it does:**
- Shows validation errors as toast notifications
- Color codes by severity (red/yellow/blue)
- Auto-dismisses non-critical issues
- Positioned bottom-right corner

**When it runs:** Always present in browser (dev mode only)
**You interact with it:** Click X to dismiss notifications

---

### Documentation Files

#### `GET_STARTED.md` ⭐
**For:** First-time users
**Contains:**
- TL;DR (npm run dev)
- Quick tests (2 minutes)
- Common questions
- Troubleshooting basics

**Read this:** If you're new or want a quick start

---

#### `AUTONOMOUS_WORKFLOW.md` 📖
**For:** Deep understanding
**Contains:**
- Complete system architecture
- Detailed feature explanations
- Advanced usage
- Full troubleshooting guide
- Comprehensive FAQ

**Read this:** When you want to understand how it works

---

#### `AUTONOMOUS_IMPLEMENTATION_SUMMARY.md` 🏗️
**For:** Technical understanding
**Contains:**
- What was built and why
- Architecture diagrams
- Feature breakdowns
- Example walkthrough
- Performance metrics

**Read this:** To understand implementation details

---

#### `WORKFLOW_QUICK_REFERENCE.md` 📋
**For:** Daily reference
**Contains:**
- Command list
- Console log meanings
- Quick troubleshooting
- Time savings table

**Read this:** When you need quick answers

---

#### `DEVELOPMENT.md` 👨‍💻
**For:** Development best practices
**Contains:**
- Post-migration checklist
- React best practices
- AI output validation tips
- Manual validation commands

**Read this:** For development guidelines

---

#### `WORKFLOW_OPTIMIZATION_SUMMARY.md` 📊
**For:** Understanding the "why"
**Contains:**
- Original problem analysis
- Implementation plan
- Before/after comparison
- Success metrics

**Read this:** To understand why this was built

---

#### `DELIVERY_SUMMARY.md` 🎁
**For:** Project stakeholders
**Contains:**
- What was delivered
- Implementation stats
- Time savings analysis
- Next steps

**Read this:** For project overview

---

#### `IMPLEMENTATION_CHECKLIST.md` ✓
**For:** Tracking progress
**Contains:**
- What's complete
- What's planned
- Future enhancements
- Testing checklist

**Read this:** To see roadmap

---

## 🔍 How Files Work Together

### Startup Flow

```
1. You type: npm run dev
   └─> Runs: scripts/dev-with-watch.js

2. dev-with-watch.js starts:
   ├─> Next.js dev server (npm run dev:next)
   │   └─> Loads: app/layout.tsx
   │       ├─> Loads: components/DevToolsLoader.tsx
   │       │   └─> Imports: lib/devTools.ts (browser)
   │       │       └─> Intercepts fetch() calls
   │       │
   │       └─> Loads: components/ValidationNotifications.tsx
   │           └─> Listens for validation events
   │
   └─> File watcher (node scripts/dev-watcher.js)
       └─> Watches directories:
           ├─> supabase/migrations/
           ├─> app/api/
           └─> components/

3. You save a file:
   └─> dev-watcher.js detects change
       └─> Triggers appropriate validator:
           ├─> If .sql → runs validate-schema.js
           ├─> If api/.ts → checks auth/queries
           └─> If component/.tsx → checks React patterns
```

### Validation Flow

```
File Change Detected
    │
    ├─> Migration file (.sql)
    │   └─> Trigger: scripts/validate-schema.js
    │       ├─> Parse SQL for column changes
    │       ├─> Search API routes for references
    │       └─> Display results in console
    │
    ├─> API route (.ts in app/api)
    │   └─> Trigger: Built-in checks in dev-watcher.js
    │       ├─> Check auth patterns (grep)
    │       ├─> Check SELECT * queries (grep)
    │       └─> Display results in console
    │
    └─> Component (.tsx)
        └─> Trigger: Built-in checks in dev-watcher.js
            ├─> Check for missing keys (grep + parse)
            ├─> Check state patterns (grep)
            └─> Display results in console
```

### Network Monitoring Flow

```
Browser Page Load
    │
    └─> app/layout.tsx loads
        └─> DevToolsLoader.tsx loads
            └─> lib/devTools.ts executes
                └─> Intercepts window.fetch

Fetch Call Made
    │
    └─> devTools.ts intercepts
        ├─> Log request details
        ├─> Call original fetch
        ├─> Wait for response
        ├─> Log response details
        └─> Return response to caller
```

---

## 📂 Directory Breakdown

### `scripts/` - Autonomous System Scripts
**What:** Node.js scripts that run server-side
**When:** Background processes during development
**Files:** 3 (orchestrator, watcher, validator)

### `lib/` - Utility Libraries
**What:** Reusable TypeScript/JavaScript utilities
**When:** Imported by other files
**Files:** 3 (devTools, devWatcher, schemaValidator)

### `components/` - React UI Components
**What:** Client-side React components
**When:** Loaded in browser via layout
**Files:** 2 (DevToolsLoader, ValidationNotifications)

### `.github/` - Project Documentation
**What:** Documentation and reference materials
**When:** Read by developers
**Files:** 2 (quick reference, checklist)

### Root - Main Documentation
**What:** Primary guides and summaries
**When:** Read by developers
**Files:** 7 (GET_STARTED, README, guides, summaries)

---

## 🎨 File Size Overview

| Category | Files | Total Lines | Purpose |
|----------|-------|-------------|---------|
| **Core Scripts** | 3 | ~630 | Autonomous system |
| **Libraries** | 1 | ~95 | Network monitoring |
| **Components** | 2 | ~135 | UI notifications |
| **Documentation** | 9 | ~3000 | Guides & references |
| **Modified** | 2 | ~10 | Integration points |
| **TOTAL** | 17 | ~3870 | Complete system |

---

## 🚀 Quick Navigation

### I want to...

**Get started quickly**
→ Read `GET_STARTED.md`

**Understand how it works**
→ Read `AUTONOMOUS_WORKFLOW.md`

**See implementation details**
→ Read `AUTONOMOUS_IMPLEMENTATION_SUMMARY.md`

**Reference commands**
→ Check `WORKFLOW_QUICK_REFERENCE.md`

**See what's next**
→ Check `IMPLEMENTATION_CHECKLIST.md`

**Understand the code**
→ Read `scripts/dev-watcher.js` (well-commented)

**Customize validations**
→ Edit `scripts/dev-watcher.js`

**Debug an issue**
→ Check `AUTONOMOUS_WORKFLOW.md` troubleshooting

**Understand network monitoring**
→ Read `lib/devTools.ts`

**See project overview**
→ Read `README_AUTONOMOUS.md`

---

## 💡 Pro Tips

1. **Start with GET_STARTED.md** - Don't skip this! It's quick and comprehensive.

2. **Keep WORKFLOW_QUICK_REFERENCE.md handy** - Bookmark it for quick lookups.

3. **Read source code** - `dev-watcher.js` and `devTools.ts` are well-commented.

4. **Check console first** - Most issues show up there with clear messages.

5. **Use the search** - All docs are markdown, easy to search.

---

**Navigation complete!** Now go read `GET_STARTED.md` and start coding! 🚀
