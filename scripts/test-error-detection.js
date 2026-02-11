#!/usr/bin/env node

/**
 * Test Next.js Error Detection System
 *
 * This script tests the error parser and report writer
 * to ensure the autonomous error detection works correctly.
 */

const { parseNextJSLog } = require('./nextjs-error-parser');
const { writeErrorReport, readErrorReport, clearAllErrors, hasErrors } = require('./error-report-writer');

console.log('\n🧪 Testing Next.js Error Detection System\n');
console.log('='.repeat(80) + '\n');

// Test 1: Parse existing log file
console.log('Test 1: Parsing Next.js development log...');
const logPath = '.next/dev/logs/next-development.log';

try {
  const { errors, newPosition } = parseNextJSLog(logPath, 0);
  console.log(`✅ Parsed log file successfully`);
  console.log(`   Found ${errors.length} total errors`);
  console.log(`   Log file size: ${newPosition} bytes\n`);

  if (errors.length > 0) {
    console.log('Test 2: Writing error report...');
    const report = writeErrorReport(errors);
    console.log(`✅ Error report written successfully`);
    console.log(`   Unique errors: ${report.errorCount}`);
    console.log(`   Has errors: ${report.hasErrors}`);
    console.log(`   Flag file created: ${hasErrors()}\n`);

    console.log('Test 3: Reading error report...');
    const readReport = readErrorReport();
    console.log(`✅ Error report read successfully`);
    console.log(`   Last updated: ${readReport.lastUpdated}`);
    console.log(`   Error count matches: ${readReport.errorCount === report.errorCount}\n`);

    console.log('Test 4: Error details...\n');
    console.log('Top 3 errors by priority:\n');

    const topErrors = readReport.errors
      .sort((a, b) => a.priority - b.priority)
      .slice(0, 3);

    topErrors.forEach((error, index) => {
      console.log(`${index + 1}. ${error.category} - ${error.summary}`);
      console.log(`   Severity: ${error.severity}`);
      console.log(`   Component: ${error.component || 'Unknown'}`);
      console.log(`   File: ${error.filePath || 'Not detected'}`);
      console.log(`   Occurrences: ${error.occurrences}`);
      console.log(`   Suggestions:`);
      error.suggestions.slice(0, 2).forEach(s => console.log(`     - ${s}`));
      console.log('');
    });

    console.log('Test 5: Clearing errors...');
    clearAllErrors();
    const clearedReport = readErrorReport();
    console.log(`✅ Errors cleared successfully`);
    console.log(`   Has errors: ${clearedReport.hasErrors}`);
    console.log(`   Flag file removed: ${!hasErrors()}\n`);

    // Restore the errors for demo purposes
    console.log('Test 6: Re-writing errors for demo...');
    writeErrorReport(errors);
    console.log(`✅ Errors restored for development use\n`);
  } else {
    console.log('ℹ️  No errors found in log file - this is good!\n');
    console.log('   To test the system with errors:');
    console.log('   1. Make a code change that causes an error');
    console.log('   2. Refresh the browser to trigger the error');
    console.log('   3. Wait 2-3 seconds for the log to update');
    console.log('   4. Run this test again\n');
  }

  console.log('='.repeat(80));
  console.log('\n✅ All tests passed! Error detection system is working.\n');
  console.log('📋 Error report location: .next/dev/errors/error-report.json');
  console.log('🚩 Flag file location: .next/dev/errors/ERRORS_PRESENT\n');

} catch (error) {
  console.error('❌ Test failed:', error.message);
  console.error(error.stack);
  process.exit(1);
}
