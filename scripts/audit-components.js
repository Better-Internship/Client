#!/usr/bin/env node

/**
 * Design System Component Audit
 * Provides detailed analysis of component usage and optimization opportunities
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function analyzeComponentUsage() {
  console.log('🔍 Auditing Design System Component Usage\n');

  const componentUsage = {
    designSystem: {},
    oldUI: {},
    patterns: {},
    portals: {
      student: { components: 0, designSystemComponents: 0 },
      hire: { components: 0, designSystemComponents: 0 },
      school: { components: 0, designSystemComponents: 0 }
    },
    bundleImpact: {
      duplicateComponents: [],
      unusedComponents: [],
      heavyImports: []
    }
  };

  // Find all component files
  const files = findAllFiles(['tsx', 'ts'], ['app', 'components']);
  
  console.log(`Analyzing ${files.length} files...\n`);

  files.forEach(filePath => {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Analyze design system usage
    analyzeDesignSystemUsage(content, filePath, componentUsage);
    
    // Analyze old UI usage
    analyzeOldUIUsage(content, filePath, componentUsage);
    
    // Analyze portal-specific usage
    analyzePortalUsage(content, filePath, componentUsage);
    
    // Check for bundle impact
    analyzeBundleImpact(content, filePath, componentUsage);
  });

  return componentUsage;
}

function findAllFiles(extensions, directories) {
  const files = [];
  
  directories.forEach(dir => {
    if (!fs.existsSync(dir)) return;
    
    extensions.forEach(ext => {
      try {
        const result = execSync(`find ${dir} -name "*.${ext}" -type f`, { encoding: 'utf8' });
        files.push(...result.trim().split('\n').filter(Boolean));
      } catch (error) {
        // Ignore errors
      }
    });
  });
  
  return [...new Set(files)];
}

function analyzeDesignSystemUsage(content, filePath, usage) {
  // Design system imports
  const dsImports = content.match(/import\s*{\s*([^}]+)\s*}\s*from\s*['"]@\/components\/design-system[^'"]*['"];?/g);
  
  if (dsImports) {
    dsImports.forEach(importStatement => {
      const components = importStatement.match(/{\s*([^}]+)\s*}/)?.[1]
        .split(',')
        .map(c => c.trim())
        .filter(Boolean);
      
      components?.forEach(component => {
        if (!usage.designSystem[component]) {
          usage.designSystem[component] = [];
        }
        usage.designSystem[component].push(filePath);
      });
    });
  }

  // Pattern usage
  const patternImports = content.match(/import\s*{\s*([^}]+)\s*}\s*from\s*['"]@\/components\/design-system\/patterns[^'"]*['"];?/g);
  
  if (patternImports) {
    patternImports.forEach(importStatement => {
      const components = importStatement.match(/{\s*([^}]+)\s*}/)?.[1]
        .split(',')
        .map(c => c.trim())
        .filter(Boolean);
      
      components?.forEach(component => {
        if (!usage.patterns[component]) {
          usage.patterns[component] = [];
        }
        usage.patterns[component].push(filePath);
      });
    });
  }
}

function analyzeOldUIUsage(content, filePath, usage) {
  // Old UI imports
  const oldImports = content.match(/import\s*{\s*([^}]+)\s*}\s*from\s*['"]@\/components\/(ui|school\/ui)\/[^'"]*['"];?/g);
  
  if (oldImports) {
    oldImports.forEach(importStatement => {
      const components = importStatement.match(/{\s*([^}]+)\s*}/)?.[1]
        .split(',')
        .map(c => c.trim())
        .filter(Boolean);
      
      components?.forEach(component => {
        if (!usage.oldUI[component]) {
          usage.oldUI[component] = [];
        }
        usage.oldUI[component].push(filePath);
      });
    });
  }
}

function analyzePortalUsage(content, filePath, usage) {
  // Determine portal from file path
  let portal = null;
  if (filePath.includes('/student/')) portal = 'student';
  else if (filePath.includes('/hire/')) portal = 'hire';
  else if (filePath.includes('/school/')) portal = 'school';
  
  if (!portal) return;

  // Count total components
  const componentUsages = content.match(/<[A-Z][a-zA-Z]*[^>]*>/g);
  if (componentUsages) {
    usage.portals[portal].components += componentUsages.length;
  }

  // Count design system components
  const dsComponentUsages = content.match(/<(Button|Input|Card|SearchBar|DataTable)[^>]*>/g);
  if (dsComponentUsages) {
    usage.portals[portal].designSystemComponents += dsComponentUsages.length;
  }
}

function analyzeBundleImpact(content, filePath, usage) {
  // Check for barrel imports (could impact bundle size)
  const barrelImports = content.match(/import\s*{\s*[^}]+\s*}\s*from\s*['"]@\/components\/design-system['"];?/g);
  if (barrelImports && barrelImports.length > 0) {
    usage.bundleImpact.heavyImports.push({
      file: filePath,
      imports: barrelImports.length,
      suggestion: 'Consider direct imports for better tree-shaking'
    });
  }

  // Check for duplicate component definitions
  const componentDefinitions = content.match(/^(export\s+)?(const|function)\s+[A-Z][a-zA-Z]*\s*=/gm);
  if (componentDefinitions && componentDefinitions.length > 3) {
    usage.bundleImpact.duplicateComponents.push({
      file: filePath,
      components: componentDefinitions.length,
      suggestion: 'Consider breaking down into smaller files'
    });
  }
}

function generateOptimizationReport(usage) {
  console.log('📊 COMPONENT USAGE ANALYSIS\n');

  // Design System Adoption
  console.log('🎯 Design System Adoption:');
  const totalDSComponents = Object.keys(usage.designSystem).length;
  const totalOldComponents = Object.keys(usage.oldUI).length;
  const adoptionRate = totalDSComponents / (totalDSComponents + totalOldComponents) * 100;
  
  console.log(`  Adoption Rate: ${adoptionRate.toFixed(1)}%`);
  console.log(`  Design System Components: ${totalDSComponents}`);
  console.log(`  Legacy Components: ${totalOldComponents}\n`);

  // Most Used Components
  console.log('🏆 Most Used Design System Components:');
  const sortedDS = Object.entries(usage.designSystem)
    .sort(([,a], [,b]) => b.length - a.length)
    .slice(0, 5);
  
  sortedDS.forEach(([component, files]) => {
    console.log(`  ${component}: ${files.length} files`);
  });
  console.log('');

  // Pattern Usage
  console.log('🧩 Pattern Component Usage:');
  if (Object.keys(usage.patterns).length === 0) {
    console.log('  No pattern components found - consider using SearchBar, DataTable, etc.\n');
  } else {
    Object.entries(usage.patterns).forEach(([pattern, files]) => {
      console.log(`  ${pattern}: ${files.length} files`);
    });
    console.log('');
  }

  // Portal Analysis
  console.log('🌐 Portal Analysis:');
  Object.entries(usage.portals).forEach(([portal, stats]) => {
    const dsAdoption = stats.components > 0 ? (stats.designSystemComponents / stats.components * 100) : 0;
    console.log(`  ${portal.charAt(0).toUpperCase() + portal.slice(1)} Portal:`);
    console.log(`    Total Components: ${stats.components}`);
    console.log(`    Design System Components: ${stats.designSystemComponents}`);
    console.log(`    Adoption Rate: ${dsAdoption.toFixed(1)}%`);
  });
  console.log('');

  // Bundle Impact
  console.log('📦 Bundle Impact Analysis:');
  
  if (usage.bundleImpact.heavyImports.length > 0) {
    console.log('  ⚠️  Heavy Imports (consider optimization):');
    usage.bundleImpact.heavyImports.slice(0, 5).forEach(item => {
      console.log(`    ${item.file}: ${item.imports} barrel imports`);
      console.log(`      💡 ${item.suggestion}`);
    });
    console.log('');
  }

  if (usage.bundleImpact.duplicateComponents.length > 0) {
    console.log('  📁 Large Component Files:');
    usage.bundleImpact.duplicateComponents.slice(0, 5).forEach(item => {
      console.log(`    ${item.file}: ${item.components} components`);
      console.log(`      💡 ${item.suggestion}`);
    });
    console.log('');
  }

  // Legacy Components Still in Use
  if (Object.keys(usage.oldUI).length > 0) {
    console.log('🚨 Legacy Components Still in Use:');
    Object.entries(usage.oldUI).forEach(([component, files]) => {
      console.log(`  ${component}: ${files.length} files`);
      if (files.length <= 3) {
        files.forEach(file => console.log(`    - ${file}`));
      } else {
        files.slice(0, 3).forEach(file => console.log(`    - ${file}`));
        console.log(`    ... and ${files.length - 3} more`);
      }
    });
    console.log('');
  }

  // Recommendations
  console.log('💡 OPTIMIZATION RECOMMENDATIONS:\n');

  if (adoptionRate < 80) {
    console.log('1. 🎯 Increase Design System Adoption:');
    console.log('   - Current adoption rate is low');
    console.log('   - Run migration script: npm run migrate:design-system');
    console.log('   - Focus on high-usage components first\n');
  }

  if (Object.keys(usage.patterns).length === 0) {
    console.log('2. 🧩 Utilize Pattern Components:');
    console.log('   - Consider using SearchBar for search interfaces');
    console.log('   - Use DataTable for data display');
    console.log('   - Leverage PortalLayout for consistent layouts\n');
  }

  if (usage.bundleImpact.heavyImports.length > 5) {
    console.log('3. 📦 Optimize Bundle Size:');
    console.log('   - Use direct imports instead of barrel imports');
    console.log('   - Example: import { Button } from "@/components/design-system/primitives/Button"');
    console.log('   - This improves tree-shaking and reduces bundle size\n');
  }

  // Portal-specific recommendations
  Object.entries(usage.portals).forEach(([portal, stats]) => {
    const dsAdoption = stats.components > 0 ? (stats.designSystemComponents / stats.components * 100) : 0;
    if (dsAdoption < 60 && stats.components > 10) {
      console.log(`4. 🌐 ${portal.charAt(0).toUpperCase() + portal.slice(1)} Portal Needs Attention:`);
      console.log(`   - Only ${dsAdoption.toFixed(1)}% design system adoption`);
      console.log(`   - Focus migration efforts on this portal`);
      console.log(`   - Add portal="${portal}" props to components\n`);
    }
  });

  console.log('🎯 Next Steps:');
  console.log('1. Address legacy component usage');
  console.log('2. Add portal props where missing');
  console.log('3. Optimize heavy imports');
  console.log('4. Consider using pattern components');
  console.log('5. Run npm run build to check bundle impact');
}

function calculateMetrics(usage) {
  const metrics = {
    totalFiles: 0,
    designSystemFiles: 0,
    legacyFiles: 0,
    adoptionRate: 0,
    bundleOptimization: 0,
    portalConsistency: 0
  };

  // Calculate files using design system
  metrics.designSystemFiles = Object.values(usage.designSystem)
    .flat()
    .filter((file, index, array) => array.indexOf(file) === index)
    .length;

  // Calculate files using legacy components
  metrics.legacyFiles = Object.values(usage.oldUI)
    .flat()
    .filter((file, index, array) => array.indexOf(file) === index)
    .length;

  metrics.totalFiles = metrics.designSystemFiles + metrics.legacyFiles;
  metrics.adoptionRate = metrics.totalFiles > 0 ? (metrics.designSystemFiles / metrics.totalFiles * 100) : 0;

  // Calculate bundle optimization score
  const heavyImports = usage.bundleImpact.heavyImports.length;
  metrics.bundleOptimization = Math.max(0, 100 - (heavyImports * 10));

  // Calculate portal consistency
  const portalRates = Object.values(usage.portals).map(portal => {
    return portal.components > 0 ? (portal.designSystemComponents / portal.components * 100) : 100;
  });
  metrics.portalConsistency = portalRates.reduce((sum, rate) => sum + rate, 0) / portalRates.length;

  return metrics;
}

function main() {
  const usage = analyzeComponentUsage();
  generateOptimizationReport(usage);
  
  const metrics = calculateMetrics(usage);
  
  console.log('\n📈 OVERALL HEALTH SCORE:');
  console.log(`  Adoption Rate: ${metrics.adoptionRate.toFixed(1)}%`);
  console.log(`  Bundle Optimization: ${metrics.bundleOptimization.toFixed(1)}%`);
  console.log(`  Portal Consistency: ${metrics.portalConsistency.toFixed(1)}%`);
  
  const overallScore = (metrics.adoptionRate + metrics.bundleOptimization + metrics.portalConsistency) / 3;
  console.log(`  Overall Score: ${overallScore.toFixed(1)}%`);
  
  if (overallScore >= 90) {
    console.log('  🏆 Excellent! Design system is well adopted.');
  } else if (overallScore >= 75) {
    console.log('  ✅ Good! Minor optimizations recommended.');
  } else if (overallScore >= 60) {
    console.log('  ⚠️  Fair. Significant improvements needed.');
  } else {
    console.log('  🚨 Poor. Major migration work required.');
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  analyzeComponentUsage,
  generateOptimizationReport,
  calculateMetrics
};
