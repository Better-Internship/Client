#!/usr/bin/env node

/**
 * Design System Migration Checker
 * Verifies that migration was successful and identifies remaining issues
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Patterns to check for old imports
const OLD_PATTERNS = [
  {
    name: 'Old Button imports',
    pattern: /import\s*{\s*[^}]*Button[^}]*\s*}\s*from\s*['"]@\/components\/(ui|school\/ui)\/button['"];?/g,
    severity: 'error',
    suggestion: 'Replace with: import { Button } from "@/components/design-system";'
  },
  {
    name: 'Old Input imports',
    pattern: /import\s*{\s*[^}]*Input[^}]*\s*}\s*from\s*['"]@\/components\/(ui|school\/ui)\/input['"];?/g,
    severity: 'error',
    suggestion: 'Replace with: import { Input } from "@/components/design-system";'
  },
  {
    name: 'Old Card imports',
    pattern: /import\s*{\s*[^}]*Card[^}]*\s*}\s*from\s*['"]@\/components\/(ui|school\/ui)\/card['"];?/g,
    severity: 'error',
    suggestion: 'Replace with: import { Card, CardHeader, CardContent } from "@/components/design-system";'
  },
  {
    name: 'Buttons without portal props',
    pattern: /<Button(?![^>]*portal=)[^>]*>/g,
    severity: 'warning',
    suggestion: 'Add portal="student|hire|school" prop for proper theming'
  },
  {
    name: 'Focus ring inconsistencies',
    pattern: /focus-visible:ring-1(?!\s+focus-visible:ring-ring)/g,
    severity: 'info',
    suggestion: 'Design system provides consistent focus rings automatically'
  }
];

// Performance patterns to check
const PERFORMANCE_PATTERNS = [
  {
    name: 'Direct component imports (good)',
    pattern: /import\s*{\s*[^}]+\s*}\s*from\s*['"]@\/components\/design-system\/primitives\/[^'"]+['"];?/g,
    severity: 'good',
    suggestion: 'Tree-shakeable import detected'
  },
  {
    name: 'Barrel imports (okay)',
    pattern: /import\s*{\s*[^}]+\s*}\s*from\s*['"]@\/components\/design-system['"];?/g,
    severity: 'info', 
    suggestion: 'Consider direct imports for better tree-shaking'
  }
];

function findFiles(extensions = ['tsx', 'ts'], baseDir = '.') {
  const files = [];
  
  extensions.forEach(ext => {
    try {
      const result = execSync(`find ${baseDir} -name "*.${ext}" -type f | grep -E "(app|components)" | head -100`, { encoding: 'utf8' });
      files.push(...result.trim().split('\n').filter(Boolean));
    } catch (error) {
      // Ignore errors for find command
    }
  });
  
  return [...new Set(files)];
}

function checkFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return { issues: [], performance: [] };
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const issues = [];
  const performance = [];

  // Check for migration issues
  OLD_PATTERNS.forEach(pattern => {
    const matches = [...content.matchAll(pattern.pattern)];
    matches.forEach(match => {
      issues.push({
        ...pattern,
        line: content.substring(0, match.index).split('\n').length,
        match: match[0].trim()
      });
    });
  });

  // Check performance patterns
  PERFORMANCE_PATTERNS.forEach(pattern => {
    const matches = [...content.matchAll(pattern.pattern)];
    matches.forEach(match => {
      performance.push({
        ...pattern,
        line: content.substring(0, match.index).split('\n').length,
        match: match[0].trim()
      });
    });
  });

  return { issues, performance };
}

function generateReport() {
  console.log('🔍 Checking Design System Migration Status\n');

  const files = findFiles(['tsx', 'ts']);
  console.log(`Scanning ${files.length} files...\n`);

  const report = {
    totalFiles: files.length,
    filesWithIssues: 0,
    errors: [],
    warnings: [],
    info: [],
    good: [],
    summary: {
      errors: 0,
      warnings: 0,
      info: 0,
      good: 0
    }
  };

  files.forEach(filePath => {
    const { issues, performance } = checkFile(filePath);
    
    if (issues.length > 0 || performance.length > 0) {
      report.filesWithIssues++;
    }

    [...issues, ...performance].forEach(item => {
      const entry = {
        file: filePath,
        line: item.line,
        message: item.name,
        suggestion: item.suggestion,
        match: item.match
      };

      switch (item.severity) {
        case 'error':
          report.errors.push(entry);
          report.summary.errors++;
          break;
        case 'warning':
          report.warnings.push(entry);
          report.summary.warnings++;
          break;
        case 'info':
          report.info.push(entry);
          report.summary.info++;
          break;
        case 'good':
          report.good.push(entry);
          report.summary.good++;
          break;
      }
    });
  });

  return report;
}

function printReport(report) {
  // Errors
  if (report.errors.length > 0) {
    console.log('❌ ERRORS (Must Fix):');
    report.errors.forEach(item => {
      console.log(`  ${item.file}:${item.line}`);
      console.log(`    Issue: ${item.message}`);
      console.log(`    Found: ${item.match}`);
      console.log(`    Fix: ${item.suggestion}\n`);
    });
  }

  // Warnings
  if (report.warnings.length > 0) {
    console.log('⚠️  WARNINGS (Should Fix):');
    report.warnings.forEach(item => {
      console.log(`  ${item.file}:${item.line}`);
      console.log(`    Issue: ${item.message}`);
      console.log(`    Suggestion: ${item.suggestion}\n`);
    });
  }

  // Info
  if (report.info.length > 0) {
    console.log('ℹ️  INFO (Consider):');
    report.info.forEach(item => {
      console.log(`  ${item.file}:${item.line}`);
      console.log(`    Note: ${item.message}`);
      console.log(`    Suggestion: ${item.suggestion}\n`);
    });
  }

  // Good practices
  if (report.good.length > 0) {
    console.log('✅ GOOD PRACTICES:');
    report.good.slice(0, 5).forEach(item => {
      console.log(`  ${item.file}:${item.line} - ${item.message}`);
    });
    if (report.good.length > 5) {
      console.log(`  ... and ${report.good.length - 5} more\n`);
    } else {
      console.log('');
    }
  }

  // Summary
  console.log('📊 SUMMARY:');
  console.log(`  Files scanned: ${report.totalFiles}`);
  console.log(`  Files with issues: ${report.filesWithIssues}`);
  console.log(`  Errors: ${report.summary.errors}`);
  console.log(`  Warnings: ${report.summary.warnings}`);
  console.log(`  Info: ${report.summary.info}`);
  console.log(`  Good practices: ${report.summary.good}\n`);

  // Migration status
  const migrationComplete = report.summary.errors === 0;
  if (migrationComplete) {
    console.log('🎉 Migration appears to be complete!');
    if (report.summary.warnings > 0) {
      console.log('   Consider addressing warnings for optimal experience.');
    }
  } else {
    console.log('🚨 Migration incomplete - please fix errors before proceeding.');
  }

  console.log('\n💡 Next steps:');
  console.log('  1. Fix any errors shown above');
  console.log('  2. Run `npm run build` to check for TypeScript errors');
  console.log('  3. Test all three portals');
  console.log('  4. Run `npm run design-system:audit` for detailed analysis');
}

function main() {
  const report = generateReport();
  printReport(report);
  
  // Exit with error code if there are errors
  process.exit(report.summary.errors > 0 ? 1 : 0);
}

if (require.main === module) {
  main();
}

module.exports = {
  generateReport,
  printReport,
  checkFile,
  OLD_PATTERNS,
  PERFORMANCE_PATTERNS
};
