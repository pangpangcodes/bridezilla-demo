#!/usr/bin/env node

/**
 * Schema Validator Script - Node.js version (no TypeScript compilation needed)
 *
 * Usage: node scripts/validate-schema.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function parseMigration(migrationPath) {
  const content = fs.readFileSync(migrationPath, 'utf-8');
  const changes = new Map();

  // Match DROP COLUMN statements
  const dropRegex = /ALTER\s+TABLE\s+(\w+)\s+DROP\s+COLUMN\s+(?:IF\s+EXISTS\s+)?(\w+)/gi;
  let match;
  while ((match = dropRegex.exec(content)) !== null) {
    const [, table, column] = match;
    const tableChange = changes.get(table) || {
      table,
      droppedColumns: [],
      addedColumns: [],
      renamedColumns: [],
    };
    tableChange.droppedColumns.push(column);
    changes.set(table, tableChange);
  }

  // Match ADD COLUMN statements
  const addRegex = /ALTER\s+TABLE\s+(\w+)\s+ADD\s+COLUMN\s+(?:IF\s+NOT\s+EXISTS\s+)?(\w+)/gi;
  while ((match = addRegex.exec(content)) !== null) {
    const [, table, column] = match;
    const tableChange = changes.get(table) || {
      table,
      droppedColumns: [],
      addedColumns: [],
      renamedColumns: [],
    };
    tableChange.addedColumns.push(column);
    changes.set(table, tableChange);
  }

  // Match RENAME COLUMN statements
  const renameRegex = /ALTER\s+TABLE\s+(\w+)\s+RENAME\s+COLUMN\s+(\w+)\s+TO\s+(\w+)/gi;
  while ((match = renameRegex.exec(content)) !== null) {
    const [, table, fromCol, toCol] = match;
    const tableChange = changes.get(table) || {
      table,
      droppedColumns: [],
      addedColumns: [],
      renamedColumns: [],
    };
    tableChange.renamedColumns.push({ from: fromCol, to: toCol });
    changes.set(table, tableChange);
  }

  return Array.from(changes.values());
}

function findColumnReferences(column, searchPath = 'app/api') {
  try {
    const result = execSync(
      `grep -rn "\\b${column}\\b" ${searchPath} --include="*.ts" --include="*.tsx" || true`,
      { encoding: 'utf-8' }
    );

    if (!result) return [];

    const matches = [];
    const lines = result.trim().split('\n');

    for (const line of lines) {
      if (!line) continue;

      const match = line.match(/^([^:]+):(\d+):(.+)$/);
      if (match) {
        const [, file, lineNum, context] = match;
        matches.push({
          file,
          line: parseInt(lineNum, 10),
          context: context.trim(),
        });
      }
    }

    return matches;
  } catch (error) {
    return [];
  }
}

function validateDroppedColumns(changes) {
  const issues = [];

  for (const change of changes) {
    for (const droppedColumn of change.droppedColumns) {
      const references = findColumnReferences(droppedColumn);

      for (const ref of references) {
        const looksLikeColumnRef =
          ref.context.includes(`'${droppedColumn}'`) ||
          ref.context.includes(`"${droppedColumn}"`) ||
          ref.context.includes(`.${droppedColumn}`) ||
          ref.context.includes(`${droppedColumn}:`) ||
          ref.context.includes(`${droppedColumn},`);

        if (looksLikeColumnRef) {
          let suggestion = `Column '${droppedColumn}' was dropped from ${change.table}.`;

          const renamed = change.renamedColumns.find(r => r.from === droppedColumn);
          if (renamed) {
            suggestion += ` It was renamed to '${renamed.to}'.`;
          } else if (change.addedColumns.length > 0) {
            suggestion += ` Consider using one of the new columns: ${change.addedColumns.join(', ')}`;
          } else {
            suggestion += ' Remove references to this column.';
          }

          issues.push({
            file: ref.file,
            line: ref.line,
            column: droppedColumn,
            issue: 'references_dropped_column',
            suggestion,
          });
        }
      }
    }
  }

  return issues;
}

function validateSchema(migrationDir = 'supabase/migrations') {
  const results = [];

  if (!fs.existsSync(migrationDir)) {
    console.error(`Migration directory not found: ${migrationDir}`);
    return results;
  }

  const migrations = fs
    .readdirSync(migrationDir)
    .filter(f => f.endsWith('.sql'))
    .sort()
    .map(f => path.join(migrationDir, f));

  for (const migrationPath of migrations) {
    const changes = parseMigration(migrationPath);

    if (changes.length === 0) {
      continue;
    }

    const issues = validateDroppedColumns(changes);
    const uniqueFiles = new Set(issues.map(i => i.file));

    results.push({
      migration: migrationPath,
      changes,
      issues,
      summary: {
        totalIssues: issues.length,
        filesAffected: uniqueFiles.size,
      },
    });
  }

  return results;
}

function formatValidationResults(results) {
  let output = '';

  for (const result of results) {
    if (result.issues.length === 0) {
      continue;
    }

    output += `\n⚠️  Schema Validation Warnings:\n\n`;
    output += `Migration: ${result.migration}\n`;

    for (const change of result.changes) {
      if (change.droppedColumns.length > 0) {
        output += `- Dropped columns: ${change.droppedColumns.join(', ')}\n`;
      }
      if (change.addedColumns.length > 0) {
        output += `+ Added columns: ${change.addedColumns.join(', ')}\n`;
      }
      if (change.renamedColumns.length > 0) {
        for (const rename of change.renamedColumns) {
          output += `~ Renamed: ${rename.from} → ${rename.to}\n`;
        }
      }
    }

    output += `\nFiles still referencing dropped columns:\n`;
    for (const issue of result.issues) {
      output += `- ${issue.file}:${issue.line} (${issue.column})\n`;
      output += `  ${issue.suggestion}\n`;
    }

    output += `\nSummary: ${result.summary.totalIssues} issue(s) in ${result.summary.filesAffected} file(s)\n`;
  }

  if (output === '') {
    output = '✅ No schema validation issues found!\n';
  }

  return output;
}

// Run validation
const results = validateSchema();
console.log(formatValidationResults(results));
process.exit(results.some(r => r.issues.length > 0) ? 1 : 0);
