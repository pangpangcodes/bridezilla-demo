/**
 * Error Report Writer
 *
 * Writes structured JSON error reports for Next.js development errors
 * Maintains error history and creates flag files for error presence
 */

const fs = require('fs');
const path = require('path');

const ERROR_DIR = '.next/dev/errors';
const REPORT_PATH = path.join(ERROR_DIR, 'error-report.json');
const FLAG_PATH = path.join(ERROR_DIR, 'ERRORS_PRESENT');
const GITIGNORE_PATH = path.join(ERROR_DIR, '.gitignore');

/**
 * Initialize error reporting directory and gitignore
 */
function initializeErrorDir() {
  if (!fs.existsSync(ERROR_DIR)) {
    fs.mkdirSync(ERROR_DIR, { recursive: true });
  }

  // Create .gitignore to exclude error reports from git
  if (!fs.existsSync(GITIGNORE_PATH)) {
    fs.writeFileSync(GITIGNORE_PATH, '# Ignore error reports\n*.json\nERRORS_PRESENT\n');
  }
}

/**
 * Read existing error report
 *
 * @returns {Object} Existing error report or empty structure
 */
function readErrorReport() {
  if (!fs.existsSync(REPORT_PATH)) {
    return {
      lastUpdated: new Date().toISOString(),
      hasErrors: false,
      errorCount: 0,
      errors: []
    };
  }

  try {
    const content = fs.readFileSync(REPORT_PATH, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    console.error('Error reading error report:', error);
    return {
      lastUpdated: new Date().toISOString(),
      hasErrors: false,
      errorCount: 0,
      errors: []
    };
  }
}

/**
 * Write error report to file
 *
 * @param {Array<Object>} newErrors - New errors to add/update in report
 * @returns {Object} Updated error report
 */
function writeErrorReport(newErrors) {
  initializeErrorDir();

  // Read existing report
  const report = readErrorReport();
  const now = new Date().toISOString();

  // Create error map for efficient lookup
  const errorMap = new Map();
  report.errors.forEach(err => errorMap.set(err.id, err));

  // Process new errors
  newErrors.forEach(newError => {
    const existing = errorMap.get(newError.id);

    if (existing) {
      // Update existing error
      existing.occurrences += 1;
      existing.lastSeen = now;
      // Keep original firstSeen
      // Update message if it has changed
      if (newError.message !== existing.message) {
        existing.message = newError.message;
      }
      // Update suggestions if they've changed
      if (JSON.stringify(newError.suggestions) !== JSON.stringify(existing.suggestions)) {
        existing.suggestions = newError.suggestions;
      }
    } else {
      // Add new error
      errorMap.set(newError.id, {
        ...newError,
        firstSeen: now,
        lastSeen: now,
        occurrences: 1
      });
    }
  });

  // Convert map back to array and sort by priority
  const errors = Array.from(errorMap.values())
    .sort((a, b) => a.priority - b.priority);

  // Update report
  const updatedReport = {
    lastUpdated: now,
    hasErrors: errors.length > 0,
    errorCount: errors.length,
    errors
  };

  // Write report to file
  try {
    fs.writeFileSync(
      REPORT_PATH,
      JSON.stringify(updatedReport, null, 2),
      'utf8'
    );
  } catch (error) {
    console.error('Error writing error report:', error);
  }

  // Manage flag file
  if (updatedReport.hasErrors) {
    createFlagFile();
  } else {
    removeFlagFile();
  }

  return updatedReport;
}

/**
 * Clear errors for a specific file
 *
 * @param {string} filePath - File path to clear errors for
 * @returns {Object} Updated error report
 */
function clearErrorsForFile(filePath) {
  const report = readErrorReport();

  // Remove errors matching the file path
  const errors = report.errors.filter(err => err.filePath !== filePath);

  const updatedReport = {
    lastUpdated: new Date().toISOString(),
    hasErrors: errors.length > 0,
    errorCount: errors.length,
    errors
  };

  // Write updated report
  try {
    fs.writeFileSync(
      REPORT_PATH,
      JSON.stringify(updatedReport, null, 2),
      'utf8'
    );
  } catch (error) {
    console.error('Error writing error report:', error);
  }

  // Manage flag file
  if (updatedReport.hasErrors) {
    createFlagFile();
  } else {
    removeFlagFile();
  }

  return updatedReport;
}

/**
 * Clear all errors from report
 *
 * @returns {Object} Empty error report
 */
function clearAllErrors() {
  const emptyReport = {
    lastUpdated: new Date().toISOString(),
    hasErrors: false,
    errorCount: 0,
    errors: []
  };

  try {
    fs.writeFileSync(
      REPORT_PATH,
      JSON.stringify(emptyReport, null, 2),
      'utf8'
    );
  } catch (error) {
    console.error('Error writing error report:', error);
  }

  removeFlagFile();

  return emptyReport;
}

/**
 * Create flag file to indicate errors are present
 */
function createFlagFile() {
  try {
    if (!fs.existsSync(FLAG_PATH)) {
      fs.writeFileSync(
        FLAG_PATH,
        `Errors detected at ${new Date().toISOString()}\nSee error-report.json for details\n`,
        'utf8'
      );
    }
  } catch (error) {
    console.error('Error creating flag file:', error);
  }
}

/**
 * Remove flag file when no errors present
 */
function removeFlagFile() {
  try {
    if (fs.existsSync(FLAG_PATH)) {
      fs.unlinkSync(FLAG_PATH);
    }
  } catch (error) {
    console.error('Error removing flag file:', error);
  }
}

/**
 * Check if errors are present
 *
 * @returns {boolean} True if errors exist
 */
function hasErrors() {
  return fs.existsSync(FLAG_PATH);
}

module.exports = {
  writeErrorReport,
  clearErrorsForFile,
  clearAllErrors,
  readErrorReport,
  hasErrors,
  ERROR_DIR,
  REPORT_PATH,
  FLAG_PATH
};
