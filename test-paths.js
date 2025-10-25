/**
 * Test Configuration - Verify Paths
 * This script checks if all configured paths are correct and accessible
 */

const fs = require('fs');
const path = require('path');
const settings = require('./config/settings.json');

console.log('\n🔍 Path Configuration Test\n');
console.log('='.repeat(60));

let allValid = true;

// Test 1: Telemetry Overlay Executable
console.log('\n1️⃣  Telemetry Overlay Executable:');
console.log(`   Path: ${settings.exePath}`);
if (fs.existsSync(settings.exePath)) {
  console.log('   ✅ EXISTS');
} else {
  console.log('   ❌ NOT FOUND');
  console.log('   → Install Telemetry Overlay or update path in config/settings.json');
  allValid = false;
}

// Test 2: Input Folder
console.log('\n2️⃣  Input Folder (where videos are loaded FROM):');
console.log(`   Path: ${settings.inputFolder}`);
if (fs.existsSync(settings.inputFolder)) {
  console.log('   ✅ EXISTS');
  
  // Check for videos
  const videos = fs.readdirSync(settings.inputFolder)
    .filter(f => f.toLowerCase().endsWith('.mp4'));
  
  if (videos.length > 0) {
    console.log(`   ✅ Found ${videos.length} video(s):`);
    videos.forEach(v => {
      const fullPath = path.join(settings.inputFolder, v);
      console.log(`      - ${v}`);
      console.log(`        Full path: ${fullPath}`);
    });
  } else {
    console.log('   ⚠️  No .mp4 videos found');
    console.log('   → Place test videos in this folder');
  }
} else {
  console.log('   ❌ DOES NOT EXIST');
  console.log('   → Creating folder...');
  try {
    fs.mkdirSync(settings.inputFolder, { recursive: true });
    console.log('   ✅ Created successfully');
  } catch (e) {
    console.log(`   ❌ Failed to create: ${e.message}`);
    allValid = false;
  }
}

// Test 3: Output Folder
console.log('\n3️⃣  Output Folder (where processed videos are saved TO):');
console.log(`   Path: ${settings.outputFolder}`);
if (fs.existsSync(settings.outputFolder)) {
  console.log('   ✅ EXISTS');
} else {
  console.log('   ❌ DOES NOT EXIST');
  console.log('   → Creating folder...');
  try {
    fs.mkdirSync(settings.outputFolder, { recursive: true });
    console.log('   ✅ Created successfully');
  } catch (e) {
    console.log(`   ❌ Failed to create: ${e.message}`);
    allValid = false;
  }
}

// Test 4: Pattern File
console.log('\n4️⃣  Pattern File:');
console.log(`   Path: ${settings.patternFile}`);
if (fs.existsSync(settings.patternFile)) {
  console.log('   ✅ EXISTS');
} else {
  console.log('   ⚠️  NOT FOUND');
  console.log('   → Make sure pattern file exists or update path in settings.json');
  console.log('   → Automation will fail if pattern file is missing');
}

// Test 5: Example Paths
console.log('\n5️⃣  Example File Paths (what automation will use):');
const testVideoName = 'test_video.mp4';
const testVideoPath = path.join(settings.inputFolder, testVideoName);
const testProjectPath = path.join(settings.outputFolder, 'test_video_output.toproj');
const testOutputPath = path.join(settings.outputFolder, 'test_video_output.mp4');

console.log('\n   Input video path:');
console.log(`   ${testVideoPath}`);
console.log('\n   Output project path:');
console.log(`   ${testProjectPath}`);
console.log('\n   Output video path:');
console.log(`   ${testOutputPath}`);

// Summary
console.log('\n' + '='.repeat(60));
if (allValid) {
  console.log('\n✅ All paths configured correctly!\n');
  console.log('📋 Next Steps:');
  console.log('   1. Place .mp4 videos in input folder');
  console.log('   2. Ensure pattern file exists');
  console.log('   3. Maximize Telemetry Overlay');
  console.log('   4. Run: npm start\n');
} else {
  console.log('\n⚠️  Some paths need attention. Review above.\n');
}

console.log('💡 Path Format Notes:');
console.log('   - All paths are ABSOLUTE (full paths from C:\\ drive)');
console.log('   - Automation types these exact paths into file dialogs');
console.log('   - No manual browsing required!\n');
