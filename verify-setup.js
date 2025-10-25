/**
 * Setup Verification Script
 * Checks if all components are properly configured
 */

const fs = require('fs');
const path = require('path');

console.log('\n🔍 Telemetry Automation - Setup Verification\n');
console.log('='.repeat(50));

let allGood = true;

// Check 1: Dependencies
console.log('\n1️⃣  Checking Dependencies...');
try {
  require('@nut-tree-fork/nut-js');
  console.log('   ✅ @nut-tree-fork/nut-js');
} catch (e) {
  console.log('   ❌ @nut-tree-fork/nut-js - MISSING');
  allGood = false;
}

try {
  require('fs-extra');
  console.log('   ✅ fs-extra');
} catch (e) {
  console.log('   ❌ fs-extra - MISSING');
  allGood = false;
}

try {
  require('winston');
  console.log('   ✅ winston');
} catch (e) {
  console.log('   ❌ winston - MISSING');
  allGood = false;
}

try {
  require('dotenv');
  console.log('   ✅ dotenv');
} catch (e) {
  console.log('   ❌ dotenv - MISSING');
  allGood = false;
}

// Check 2: Project Structure
console.log('\n2️⃣  Checking Project Structure...');
const requiredDirs = ['config', 'src', 'scripts'];
const requiredFiles = [
  'config/settings.json',
  'config/guiMap.json',
  'src/index.js',
  'src/telemetryAutomation.js',
  'src/fileUtils.js',
  'src/logger.js',
  'scripts/tracker.js',
  'scripts/testHighlight.js',
  'package.json'
];

requiredDirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    console.log(`   ✅ ${dir}/`);
  } else {
    console.log(`   ❌ ${dir}/ - MISSING`);
    allGood = false;
  }
});

requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`   ✅ ${file}`);
  } else {
    console.log(`   ⚠️  ${file} - MISSING (may need configuration)`);
    if (!file.includes('guiMap')) allGood = false;
  }
});

// Check 3: Configuration
console.log('\n3️⃣  Checking Configuration...');
try {
  const settings = require('./config/settings.json');
  console.log('   ✅ settings.json readable');
  
  // Check required fields
  const requiredFields = ['exePath', 'inputFolder', 'outputFolder', 'patternFile', 'logFile', 'delays'];
  requiredFields.forEach(field => {
    if (settings[field]) {
      console.log(`   ✅ ${field} configured`);
    } else {
      console.log(`   ⚠️  ${field} - NOT SET`);
    }
  });
  
  // Check if paths exist
  if (settings.exePath && !fs.existsSync(settings.exePath)) {
    console.log(`   ⚠️  exePath does not exist: ${settings.exePath}`);
    console.log('      → You need to install Telemetry Overlay');
  }
  
  if (settings.inputFolder && !fs.existsSync(settings.inputFolder)) {
    console.log(`   ⚠️  inputFolder does not exist: ${settings.inputFolder}`);
    console.log('      → Create this folder or update the path');
  }
  
  if (settings.outputFolder && !fs.existsSync(settings.outputFolder)) {
    console.log(`   ⚠️  outputFolder does not exist: ${settings.outputFolder}`);
    console.log('      → Create this folder or update the path');
  }
  
} catch (e) {
  console.log('   ❌ settings.json has issues:', e.message);
  allGood = false;
}

// Check 4: GUI Map
console.log('\n4️⃣  Checking GUI Coordinates...');
try {
  const guiMap = require('./config/guiMap.json');
  const requiredButtons = [
    'loadVideoButton',
    'patternsButton',
    'loadPatternButton',
    'exportButton',
    'muteToggle',
    'saveProjectButton',
    'finalExportButton'
  ];
  
  let coordsConfigured = 0;
  requiredButtons.forEach(button => {
    if (guiMap[button] && guiMap[button].x && guiMap[button].y) {
      console.log(`   ✅ ${button}: (${guiMap[button].x}, ${guiMap[button].y})`);
      coordsConfigured++;
    } else {
      console.log(`   ⚠️  ${button} - NOT CONFIGURED`);
    }
  });
  
  if (coordsConfigured === 0) {
    console.log('\n   ⚠️  No coordinates configured!');
    console.log('      → Run: node scripts/tracker.js');
  } else if (coordsConfigured < requiredButtons.length) {
    console.log(`\n   ⚠️  Only ${coordsConfigured}/${requiredButtons.length} coordinates set`);
    console.log('      → Run: node scripts/tracker.js to complete');
  }
} catch (e) {
  console.log('   ⚠️  guiMap.json has issues:', e.message);
}

// Check 5: Logs directory
console.log('\n5️⃣  Checking Logs Directory...');
if (fs.existsSync('logs')) {
  console.log('   ✅ logs/ directory exists');
} else {
  console.log('   ⚠️  logs/ directory missing');
  console.log('      → Creating it now...');
  try {
    fs.mkdirSync('logs');
    console.log('      ✅ Created logs/ directory');
  } catch (e) {
    console.log('      ❌ Failed to create:', e.message);
  }
}

// Final Summary
console.log('\n' + '='.repeat(50));
if (allGood) {
  console.log('\n✅ All critical components are installed!\n');
  console.log('Next steps:');
  console.log('  1. Install Telemetry Overlay application');
  console.log('  2. Update paths in config/settings.json');
  console.log('  3. Run: node scripts/tracker.js (to set coordinates)');
  console.log('  4. Run: npm start (to begin automation)\n');
  console.log('📖 See SETUP_CHECKLIST.md for detailed guide\n');
} else {
  console.log('\n⚠️  Some issues need attention. Review above.\n');
  console.log('Run: npm install (to fix dependency issues)\n');
}
