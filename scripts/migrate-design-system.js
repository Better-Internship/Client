#!/usr/bin/env node

/**
 * Design System Migration Script
 * Automates the migration from duplicate UI components to the unified design system
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Migration configurations
const MIGRATIONS = [
  {
    name: 'Update Button imports',
    pattern: /import\s*{\s*Button\s*}\s*from\s*['"]@\/components\/(ui|school\/ui)\/button['"];?/g,
    replacement: `import { Button } from '@/components/design-system';`,
    files: ['**/*.tsx', '**/*.ts'],
  },
  {
    name: 'Update Input imports',
    pattern: /import\s*{\s*Input\s*}\s*from\s*['"]@\/components\/(ui|school\/ui)\/input['"];?/g,
    replacement: `import { Input } from '@/components/design-system';`,
    files: ['**/*.tsx', '**/*.ts'],
  },
  {
    name: 'Update Card imports',
    pattern: /import\s*{\s*(Card[^}]*)\s*}\s*from\s*['"]@\/components\/(ui|school\/ui)\/card['"];?/g,
    replacement: `import { $1 } from '@/components/design-system';`,
    files: ['**/*.tsx', '**/*.ts'],
  },
  {
    name: 'Add portal props to Buttons in student portal',
    pattern: /<Button(?!\s+portal=)/g,
    replacement: '<Button portal="student"',
    files: ['app/student/**/*.tsx', 'components/student/**/*.tsx'],
  },
  {
    name: 'Add portal props to Buttons in hire portal',
    pattern: /<Button(?!\s+portal=)/g,
    replacement: '<Button portal="hire"',
    files: ['app/hire/**/*.tsx', 'components/hire/**/*.tsx'],
  },
  {
    name: 'Add portal props to Buttons in school portal',
    pattern: /<Button(?!\s+portal=)/g,
    replacement: '<Button portal="school"',
    files: ['app/school/**/*.tsx', 'components/school/**/*.tsx'],
  },
];

// Utility functions
function findFiles(patterns, baseDir = '.') {
  const files = [];
  
  patterns.forEach(pattern => {
    try {
      const result = execSync(`find ${baseDir} -name "${pattern}" -type f`, { encoding: 'utf8' });
      files.push(...result.trim().split('\n').filter(Boolean));
    } catch (error) {
      console.warn(`Warning: Could not find files matching ${pattern}`);
    }
  });
  
  return [...new Set(files)]; // Remove duplicates
}

function processFile(filePath, migrations) {
  if (!fs.existsSync(filePath)) {
    return false;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  migrations.forEach(migration => {
    const before = content;
    content = content.replace(migration.pattern, migration.replacement);
    
    if (content !== before) {
      modified = true;
      console.log(`  ✓ Applied: ${migration.name}`);
    }
  });

  if (modified) {
    fs.writeFileSync(filePath, content);
    return true;
  }

  return false;
}

function createBackup() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupDir = `./backup-${timestamp}`;
  
  console.log(`Creating backup at ${backupDir}...`);
  
  try {
    execSync(`cp -r ./components ./app ${backupDir}/`, { stdio: 'inherit' });
    console.log('✓ Backup created successfully');
    return backupDir;
  } catch (error) {
    console.error('Failed to create backup:', error.message);
    process.exit(1);
  }
}

function runMigration() {
  console.log('🚀 Starting Design System Migration\n');

  // Create backup
  const backupDir = createBackup();
  console.log('');

  let totalFilesProcessed = 0;
  let totalFilesModified = 0;

  MIGRATIONS.forEach((migration, index) => {
    console.log(`[${index + 1}/${MIGRATIONS.length}] ${migration.name}`);
    
    const files = findFiles(migration.files);
    console.log(`  Found ${files.length} files to process`);

    let filesModified = 0;
    
    files.forEach(filePath => {
      const modified = processFile(filePath, [migration]);
      if (modified) {
        filesModified++;
      }
    });

    console.log(`  Modified ${filesModified} files\n`);
    totalFilesProcessed += files.length;
    totalFilesModified += filesModified;
  });

  // Summary
  console.log('📊 Migration Summary:');
  console.log(`  Total files processed: ${totalFilesProcessed}`);
  console.log(`  Total files modified: ${totalFilesModified}`);
  console.log(`  Backup location: ${backupDir}`);
  console.log('');

  // Next steps
  console.log('🎯 Next Steps:');
  console.log('  1. Review the changes made to your files');
  console.log('  2. Test your application in all three portals');
  console.log('  3. Run `npm run build` to check for TypeScript errors');
  console.log('  4. Run your test suite');
  console.log('  5. If everything works, you can delete the backup folder');
  console.log('');

  // Cleanup recommendations
  console.log('🧹 Cleanup Recommendations:');
  console.log('  1. Remove duplicate components:');
  console.log('     - components/school/ui/ (after verifying migration)');
  console.log('  2. Update Storybook stories to use new components');
  console.log('  3. Update unit tests to import from design-system');
  console.log('');

  console.log('✅ Migration completed successfully!');
}

// Check if running as main script
if (require.main === module) {
  runMigration();
}

module.exports = {
  runMigration,
  MIGRATIONS,
  findFiles,
  processFile,
  createBackup,
};
