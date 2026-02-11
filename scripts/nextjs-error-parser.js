/**
 * Next.js Development Log Parser
 *
 * Parses .next/dev/logs/next-development.log to extract and categorize errors
 * Provides structured error data with actionable suggestions
 */

const fs = require('fs');
const path = require('path');

/**
 * Error categories with severity levels
 */
const ERROR_CATEGORIES = {
  HYDRATION: { severity: 'CRITICAL', priority: 1 },
  DOM_NESTING: { severity: 'CRITICAL', priority: 2 },
  COMPILATION: { severity: 'BLOCKING', priority: 3 },
  RUNTIME: { severity: 'HIGH', priority: 4 },
  WARNING: { severity: 'LOW', priority: 5 }
};

/**
 * Parse Next.js development log and extract errors
 *
 * @param {string} logPath - Path to next-development.log
 * @param {number} sincePosition - Byte position to start reading from
 * @returns {Object} { errors: Array<ParsedError>, newPosition: number }
 */
function parseNextJSLog(logPath, sincePosition = 0) {
  try {
    // Check if log file exists
    if (!fs.existsSync(logPath)) {
      return { errors: [], newPosition: 0 };
    }

    const stats = fs.statSync(logPath);

    // If file hasn't grown, no new content to parse
    if (stats.size <= sincePosition) {
      return { errors: [], newPosition: sincePosition };
    }

    // Read only new content since last position
    const fd = fs.openSync(logPath, 'r');
    const buffer = Buffer.alloc(stats.size - sincePosition);
    fs.readSync(fd, buffer, 0, buffer.length, sincePosition);
    fs.closeSync(fd);

    const newContent = buffer.toString('utf8');
    const lines = newContent.split('\n');

    const errors = [];
    let currentError = null;
    let stackTrace = [];

    for (const line of lines) {
      if (!line.trim()) continue;

      // Parse log line format: [HH:MM:SS.mmm] Browser ERROR message
      const logMatch = line.match(/^\[(\d{2}:\d{2}:\d{2}\.\d{3})\]\s+(Browser|Server)\s+(ERROR|WARN|LOG)\s+(.+)$/);

      if (logMatch) {
        const [, timestamp, source, level, message] = logMatch;

        // Save previous error if exists
        if (currentError && level === 'ERROR') {
          const categorized = categorizeError(currentError.message, stackTrace);
          if (categorized) {
            errors.push({
              ...categorized,
              timestamp: currentError.timestamp,
              source: currentError.source,
              stackTrace: stackTrace.slice()
            });
          }
          stackTrace = [];
        }

        // Start new error
        if (level === 'ERROR') {
          currentError = { timestamp, source, message };
        }
      } else if (currentError) {
        // Accumulate stack trace lines
        stackTrace.push(line.trim());
      }
    }

    // Process last error
    if (currentError) {
      const categorized = categorizeError(currentError.message, stackTrace);
      if (categorized) {
        errors.push({
          ...categorized,
          timestamp: currentError.timestamp,
          source: currentError.source,
          stackTrace: stackTrace.slice()
        });
      }
    }

    return {
      errors,
      newPosition: stats.size
    };

  } catch (error) {
    console.error('Error parsing Next.js log:', error);
    return { errors: [], newPosition: sincePosition };
  }
}

/**
 * Categorize error and extract metadata
 *
 * @param {string} message - Error message
 * @param {Array<string>} stackTrace - Stack trace lines
 * @returns {Object|null} Categorized error or null if not an error
 */
function categorizeError(message, stackTrace) {
  // Skip non-error messages
  if (!message || message.includes('[Fast Refresh]') || message.includes('Compiled')) {
    return null;
  }

  let category = 'RUNTIME';
  let component = null;
  let filePath = null;
  let lineNumber = null;

  // Detect hydration errors
  if (message.toLowerCase().includes('hydration') ||
      message.includes('did not match') ||
      message.includes('server-rendered HTML')) {
    category = 'HYDRATION';
  }

  // Detect DOM nesting errors
  if (message.includes('cannot be a child of') ||
      message.includes('cannot appear as a child of') ||
      message.includes('validateDOMNesting')) {
    category = 'DOM_NESTING';
  }

  // Detect compilation errors
  if (message.includes('Compiled with errors') ||
      message.includes('Module not found') ||
      message.includes('Cannot find module') ||
      message.includes('SyntaxError')) {
    category = 'COMPILATION';
  }

  // Detect warnings
  if (message.includes('Warning:') || message.includes('WARN')) {
    category = 'WARNING';
  }

  // Extract component name from stack trace or message
  const componentMatch = message.match(/components\/([^/]+)\/([^.]+)\.tsx/) ||
                        stackTrace.join('\n').match(/components\/([^/]+)\/([^.]+)\.tsx/);
  if (componentMatch) {
    component = componentMatch[2];
    filePath = `components/${componentMatch[1]}/${componentMatch[2]}.tsx`;
  }

  // If no file path found, try to extract component from React stack trace
  if (!component && stackTrace.length > 0) {
    // Look for React component names in stack trace (e.g., <VendorLibraryCard>)
    for (const line of stackTrace) {
      const reactComponentMatch = line.match(/<([A-Z][a-zA-Z]+)[\s>]/);
      if (reactComponentMatch) {
        component = reactComponentMatch[1];
        // Try to infer file path from component name
        filePath = `components/${component}.tsx`;
        break;
      }
    }
  }

  // Extract file path from message
  const fileMatch = message.match(/(?:at|in)\s+(.+\.tsx?)(?::(\d+))?/) ||
                   stackTrace.join('\n').match(/(?:at|in)\s+(.+\.tsx?)(?::(\d+))?/);
  if (fileMatch) {
    filePath = filePath || fileMatch[1];
    lineNumber = fileMatch[2] ? parseInt(fileMatch[2], 10) : null;
  }

  // Generate error summary
  const summary = generateSummary(category, component, message);

  // Generate suggestions
  const suggestions = generateSuggestions(category, message, component, filePath);

  const { severity, priority } = ERROR_CATEGORIES[category];

  return {
    id: generateErrorId(category, component, message),
    category,
    severity,
    priority,
    summary,
    message: cleanMessage(message),
    component,
    filePath,
    lineNumber,
    suggestions,
    firstSeen: new Date().toISOString(),
    occurrences: 1
  };
}

/**
 * Generate unique error ID for deduplication
 */
function generateErrorId(category, component, message) {
  const base = `${category}-${component || 'unknown'}-${message.substring(0, 50)}`;
  // Create simple hash from base string
  let hash = 0;
  for (let i = 0; i < base.length; i++) {
    const char = base.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return `${category}-${component || 'unknown'}-${Math.abs(hash)}`;
}

/**
 * Generate human-readable error summary
 */
function generateSummary(category, component, message) {
  const componentText = component ? ` in ${component}` : '';

  switch (category) {
    case 'HYDRATION':
      return `Hydration error${componentText}`;
    case 'DOM_NESTING':
      return `Invalid DOM nesting${componentText}`;
    case 'COMPILATION':
      return `Compilation error${componentText}`;
    case 'RUNTIME':
      return `Runtime error${componentText}`;
    case 'WARNING':
      return `Warning${componentText}`;
    default:
      return `Error${componentText}`;
  }
}

/**
 * Clean error message by removing noise
 */
function cleanMessage(message) {
  return message
    .replace(/^\[.*?\]\s*/, '') // Remove timestamp prefix
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
}

/**
 * Generate actionable fix suggestions based on error type
 */
function generateSuggestions(category, message, component, filePath) {
  const suggestions = [];

  switch (category) {
    case 'HYDRATION':
      suggestions.push('Check for mismatched HTML structure between server and client');
      suggestions.push('Ensure conditional rendering is consistent');
      if (message.includes('cannot be a child')) {
        suggestions.push('Remove div wrapper or use proper HTML structure');
      }
      if (component) {
        suggestions.push(`Review ${component} component for server/client differences`);
      }
      if (message.includes('suppressHydrationWarning')) {
        suggestions.push('Consider using suppressHydrationWarning only as last resort');
      }
      break;

    case 'DOM_NESTING':
      if (message.includes('<div>') && message.includes('<tbody>')) {
        suggestions.push('Remove <div> wrapper inside <tbody>');
        suggestions.push('Use <tr> and <td> for table content');
      }
      if (message.includes('<p>') && message.includes('<div>')) {
        suggestions.push('Replace <p> with <div> or move nested content outside');
      }
      suggestions.push('Check HTML5 nesting rules for the elements involved');
      if (filePath) {
        suggestions.push(`Check ${filePath} for invalid HTML structure`);
      }
      break;

    case 'COMPILATION':
      if (message.includes('Module not found') || message.includes('Cannot find module')) {
        const moduleMatch = message.match(/['"]([^'"]+)['"]/);
        if (moduleMatch) {
          suggestions.push(`Install missing module: npm install ${moduleMatch[1]}`);
        }
        suggestions.push('Check import path spelling and case sensitivity');
      }
      if (message.includes('SyntaxError')) {
        suggestions.push('Fix syntax error in the file');
        suggestions.push('Check for missing brackets, quotes, or semicolons');
      }
      if (filePath) {
        suggestions.push(`Review ${filePath} for compilation issues`);
      }
      break;

    case 'RUNTIME':
      suggestions.push('Check browser console for full error details');
      if (message.includes('undefined')) {
        suggestions.push('Add null/undefined checks before accessing properties');
      }
      if (message.includes('is not a function')) {
        suggestions.push('Verify the function exists and is imported correctly');
      }
      if (filePath) {
        suggestions.push(`Debug ${filePath} for runtime errors`);
      }
      break;

    case 'WARNING':
      suggestions.push('Review warning and fix if needed');
      if (message.includes('key')) {
        suggestions.push('Add unique key prop to list items');
      }
      break;
  }

  return suggestions;
}

module.exports = {
  parseNextJSLog,
  categorizeError,
  ERROR_CATEGORIES
};
