#!/usr/bin/env node

/**
 * Development File Watcher - Autonomous Validation System (Node.js)
 *
 * Monitors file changes and automatically triggers validations.
 * Runs alongside Next.js dev server.
 */

const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');
const { parseNextJSLog } = require('./nextjs-error-parser');
const { writeErrorReport, clearAllErrors } = require('./error-report-writer');

class DevWatcher {
  constructor() {
    this.watchers = new Map();
    this.validationQueue = new Set();
    this.isValidating = false;
    this.lastValidation = new Map();
    this.debounceMs = 1000;
    this.lastChangeTime = new Map();
    this.lastLogPosition = 0; // Track log file read position

    this.setupWatchers();
    console.log('\n🔍 Dev Watcher started - monitoring for changes...\n');
  }

  setupWatchers() {
    // Watch migration files
    this.watchDirectory('supabase/migrations', (filename) => {
      if (filename?.endsWith('.sql')) {
        console.log(`\n📝 Migration change detected: ${filename}`);
        this.scheduleValidation('schema', filename);
      }
    });

    // Watch API route files
    this.watchDirectory('app/api', (filename) => {
      if (filename?.match(/\.(ts|tsx)$/)) {
        console.log(`\n🔌 API route change detected: ${filename}`);
        this.scheduleValidation('api', filename);
      }
    });

    // Watch component files
    this.watchDirectory('components', (filename) => {
      if (filename?.match(/\.(tsx)$/)) {
        console.log(`\n⚛️  Component change detected: ${filename}`);
        this.scheduleValidation('component', filename);
      }
    });

    // Watch app directory for page components
    this.watchDirectory('app', (filename) => {
      if (filename?.match(/\.(tsx)$/) && !filename.includes('api')) {
        console.log(`\n⚛️  Page component change detected: ${filename}`);
        this.scheduleValidation('component', filename);
      }
    });

    // Watch Next.js development log for errors
    this.watchFile('.next/dev/logs/next-development.log', (filename) => {
      console.log(`\n📋 Next.js log updated`);
      this.scheduleValidation('nextjs', filename);
    });
  }

  watchDirectory(dir, callback) {
    try {
      if (!fs.existsSync(dir)) {
        console.warn(`⚠️  Directory not found: ${dir}`);
        return;
      }

      const watcher = fs.watch(dir, { recursive: true }, (eventType, filename) => {
        if (eventType === 'change' || eventType === 'rename') {
          // Debounce file system events (they can fire multiple times)
          const now = Date.now();
          const lastChange = this.lastChangeTime.get(filename) || 0;
          if (now - lastChange < 500) return;

          this.lastChangeTime.set(filename, now);
          callback(filename);
        }
      });

      this.watchers.set(dir, watcher);
    } catch (error) {
      console.warn(`⚠️  Could not watch ${dir}:`, error.message);
    }
  }

  watchFile(filePath, callback) {
    try {
      // Wait for file to exist (Next.js creates it after first start)
      const checkInterval = setInterval(() => {
        if (fs.existsSync(filePath)) {
          clearInterval(checkInterval);

          const watcher = fs.watch(filePath, (eventType) => {
            if (eventType === 'change') {
              const now = Date.now();
              const lastChange = this.lastChangeTime.get(filePath) || 0;
              if (now - lastChange < 500) return;

              this.lastChangeTime.set(filePath, now);
              callback(filePath);
            }
          });

          this.watchers.set(filePath, watcher);
          console.log(`✅ Watching Next.js log file: ${filePath}`);
        }
      }, 1000);

      // Stop checking after 30 seconds
      setTimeout(() => {
        clearInterval(checkInterval);
        if (!fs.existsSync(filePath)) {
          console.warn(`⚠️  Next.js log file not found after 30s: ${filePath}`);
        }
      }, 30000);
    } catch (error) {
      console.warn(`⚠️  Could not watch ${filePath}:`, error.message);
    }
  }

  scheduleValidation(type, filename) {
    this.validationQueue.add(type);

    // Use faster debounce for Next.js errors (we want quick feedback)
    const debounceTime = type === 'nextjs' ? 500 : this.debounceMs;

    // Debounce: wait for changes to settle before validating
    setTimeout(() => {
      if (this.validationQueue.has(type)) {
        this.runValidation(type);
        this.validationQueue.delete(type);
      }
    }, debounceTime);
  }

  async runValidation(type) {
    if (this.isValidating) return;

    // Rate limit: use shorter rate limit for Next.js errors (3s vs 5s)
    const rateLimit = type === 'nextjs' ? 3000 : 5000;
    const lastRun = this.lastValidation.get(type) || 0;
    if (Date.now() - lastRun < rateLimit) {
      return;
    }

    this.isValidating = true;
    this.lastValidation.set(type, Date.now());

    try {
      let results = [];

      switch (type) {
        case 'schema':
          results = await this.validateSchema();
          break;
        case 'api':
          results = await this.validateAPI();
          break;
        case 'component':
          results = await this.validateComponents();
          break;
        case 'nextjs':
          results = await this.validateNextJS();
          break;
      }

      this.displayResults(results);
    } catch (error) {
      console.error('❌ Validation failed:', error.message);
    } finally {
      this.isValidating = false;
    }
  }

  async validateSchema() {
    console.log('\n🔍 Running automatic schema validation...\n');

    try {
      execSync('node scripts/validate-schema.js', {
        encoding: 'utf-8',
        stdio: 'inherit',
      });

      return [{
        type: 'success',
        severity: 'info',
        message: '✅ Schema validation passed - no issues found!',
      }];
    } catch (error) {
      return [{
        type: 'schema',
        severity: 'error',
        message: '⚠️  Schema validation found issues',
        details: ['Check the output above for specific files and line numbers'],
        suggestions: [
          'Fix the referenced files to use new column names',
          'Update your API routes to match the current schema',
        ],
      }];
    }
  }

  async validateAPI() {
    console.log('\n🔍 Checking API routes for common issues...\n');

    const results = [];

    try {
      // Check for common auth issues
      const authIssues = this.checkAuthPatterns();
      if (authIssues.length > 0) {
        results.push({
          type: 'api',
          severity: 'warning',
          message: '⚠️  Potential auth issues detected',
          details: authIssues,
          suggestions: [
            'Verify all endpoints use correct auth token source',
            'Check: sessionStorage.getItem("planner_auth")',
          ],
        });
      }

      // Check for database query patterns
      const queryIssues = this.checkQueryPatterns();
      if (queryIssues.length > 0) {
        results.push({
          type: 'api',
          severity: 'warning',
          message: '⚠️  Potential database query issues',
          details: queryIssues,
          suggestions: [
            'Verify column names match current schema',
            'Consider using explicit column lists instead of SELECT *',
          ],
        });
      }

      if (results.length === 0) {
        results.push({
          type: 'success',
          severity: 'info',
          message: '✅ API route checks passed',
        });
      }
    } catch (error) {
      results.push({
        type: 'api',
        severity: 'error',
        message: '❌ API validation failed',
        details: [error.message],
      });
    }

    return results;
  }

  checkAuthPatterns() {
    const issues = [];

    try {
      const incorrectTokens = execSync(
        `grep -r "JSON.parse.*session.*timestamp" app/api --include="*.ts" --include="*.tsx" 2>/dev/null || true`,
        { encoding: 'utf-8' }
      );

      if (incorrectTokens.trim()) {
        const files = incorrectTokens.trim().split('\n').map(line => {
          const match = line.match(/^([^:]+):/);
          return match ? match[1] : line;
        });
        const uniqueFiles = [...new Set(files)];
        issues.push(`Found potential incorrect auth token usage in: ${uniqueFiles.join(', ')}`);
        issues.push('Expected: sessionStorage.getItem("planner_auth")');
      }
    } catch (error) {
      // grep errors are okay
    }

    return issues;
  }

  checkQueryPatterns() {
    const issues = [];

    try {
      const selectStar = execSync(
        `grep -rn "select.*\\*" app/api --include="*.ts" --include="*.tsx" 2>/dev/null || true`,
        { encoding: 'utf-8' }
      );

      if (selectStar.trim()) {
        const lines = selectStar.trim().split('\n');
        const count = lines.length;
        if (count > 0) {
          issues.push(`Found ${count} SELECT * queries - consider explicit column lists`);
          issues.push('Reason: SELECT * queries break when schema changes');
          // Show first few examples
          const examples = lines.slice(0, 3).map(line => {
            const match = line.match(/^([^:]+):(\d+):/);
            return match ? `  ${match[1]}:${match[2]}` : '';
          }).filter(Boolean);
          if (examples.length > 0) {
            issues.push('Examples:');
            issues.push(...examples);
          }
        }
      }
    } catch (error) {
      // grep errors are okay
    }

    return issues;
  }

  async validateComponents() {
    console.log('\n🔍 Checking React components for best practices...\n');

    const results = [];

    try {
      const missingKeys = this.checkMissingKeys();
      if (missingKeys.length > 0) {
        results.push({
          type: 'component',
          severity: 'warning',
          message: '⚠️  Potential missing keys in mapped arrays',
          details: missingKeys.slice(0, 5), // Limit to first 5
          suggestions: [
            'Add key prop: key={`${item.id}-${index}`}',
            'Keys should be unique and stable (not just index)',
          ],
        });
      }

      if (results.length === 0) {
        results.push({
          type: 'success',
          severity: 'info',
          message: '✅ Component checks passed',
        });
      }
    } catch (error) {
      results.push({
        type: 'component',
        severity: 'error',
        message: '❌ Component validation failed',
        details: [error.message],
      });
    }

    return results;
  }

  async validateNextJS() {
    console.log('\n🔍 Checking Next.js development logs...\n');

    const logPath = '.next/dev/logs/next-development.log';

    try {
      const { errors, newPosition } = parseNextJSLog(logPath, this.lastLogPosition);

      this.lastLogPosition = newPosition;

      if (errors.length === 0) {
        // Clear error report when no errors found
        clearAllErrors();

        return [{
          type: 'success',
          severity: 'info',
          message: '✅ No Next.js errors detected'
        }];
      }

      // Write error report for Claude to read
      writeErrorReport(errors);

      // Format for terminal display
      const results = errors.map(error => {
        const details = [];

        // Add file location
        if (error.filePath) {
          const location = error.filePath + (error.lineNumber ? `:${error.lineNumber}` : '');
          details.push(`📍 ${location}`);
        }

        // Add error message
        details.push(`💬 ${error.message}`);

        return {
          type: 'nextjs',
          severity: error.severity.toLowerCase(),
          message: `${error.category}: ${error.summary}`,
          details,
          suggestions: error.suggestions.slice(0, 2) // Show top 2 suggestions
        };
      });

      return results;

    } catch (error) {
      return [{
        type: 'nextjs',
        severity: 'error',
        message: '❌ Failed to parse Next.js logs',
        details: [error.message]
      }];
    }
  }

  checkMissingKeys() {
    const issues = [];

    try {
      // Find .map patterns and check next line for key prop
      const result = execSync(
        `grep -A 1 -n "\\.map(" components/**/*.tsx app/**/*.tsx 2>/dev/null | grep -v "^--$" || true`,
        { encoding: 'utf-8' }
      );

      if (result.trim()) {
        const lines = result.trim().split('\n');
        for (let i = 0; i < lines.length - 1; i += 2) {
          const line = lines[i];
          const nextLine = lines[i + 1];

          if (line.includes('.map(') && nextLine) {
            // Check if next line has key prop or looks like JSX
            if (nextLine.includes('<') && !nextLine.includes('key=')) {
              const match = line.match(/^([^:]+):(\d+):/);
              if (match) {
                const [, file, lineNum] = match;
                issues.push(`${file}:${lineNum} - .map() likely missing key prop`);
              }
            }
          }
        }
      }
    } catch (error) {
      // grep errors are okay
    }

    return issues;
  }

  displayResults(results) {
    console.log('\n' + '='.repeat(80));

    for (const result of results) {
      switch (result.severity) {
        case 'error':
          console.log(`\n❌ ${result.message}`);
          break;
        case 'warning':
          console.log(`\n⚠️  ${result.message}`);
          break;
        case 'info':
          console.log(`\n${result.message}`);
          break;
      }

      if (result.details && result.details.length > 0) {
        console.log('\nDetails:');
        result.details.forEach(detail => console.log(`  - ${detail}`));
      }

      if (result.suggestions && result.suggestions.length > 0) {
        console.log('\n💡 Suggestions:');
        result.suggestions.forEach(suggestion => console.log(`  ${suggestion}`));
      }
    }

    console.log('\n' + '='.repeat(80) + '\n');
  }

  stop() {
    console.log('\n🛑 Stopping dev watcher...\n');
    this.watchers.forEach(watcher => watcher.close());
    this.watchers.clear();
  }
}

// Start watcher
const watcher = new DevWatcher();

// Handle graceful shutdown
process.on('SIGINT', () => {
  watcher.stop();
  process.exit(0);
});

process.on('SIGTERM', () => {
  watcher.stop();
  process.exit(0);
});

// Keep process alive
process.stdin.resume();
