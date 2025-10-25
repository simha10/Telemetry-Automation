/**
 * Setup and Launch Coordinate Tracking
 * This script helps you prepare for coordinate tracking by:
 * 1. Launching Telemetry Overlay
 * 2. Giving you time to position the window
 * 3. Starting the coordinate tracker
 */

const { exec } = require('child_process');
const readline = require('readline');
const path = require('path');

// Telemetry Overlay path
const TELEMETRY_APP = "C:\\Program Files\\Telemetry Overlay\\Telemetry Overlay.exe";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('\n🎯 Telemetry Overlay Coordinate Tracking Setup\n');
console.log('='.repeat(60));

console.log('\n📋 Instructions:');
console.log('1. This script will launch Telemetry Overlay');
console.log('2. MAXIMIZE Telemetry Overlay to full screen');
console.log('3. Use Alt+Tab to switch between Telemetry and terminal');
console.log('4. Hover over button → Alt+Tab → Type name → Enter → Repeat');
console.log('5. Full screen gives most accurate coordinates!\n');

console.log('⚠️  Important:');
console.log('   - MAXIMIZE Telemetry Overlay for best accuracy');
console.log('   - Use Alt+Tab to switch between windows');
console.log('   - Keep it maximized throughout tracking');
console.log('   - Later, maximize it again before running automation\n');

console.log('='.repeat(60));

// Step 1: Ask user to confirm
rl.question('\n➡️  Press Enter to launch Telemetry Overlay...', () => {
  console.log('\n🚀 Launching Telemetry Overlay...\n');
  
  try {
    // Launch Telemetry Overlay
    exec(`"${TELEMETRY_APP}"`, (error) => {
      if (error) {
        console.log(`⚠️  Note: ${error.message}`);
        console.log('   If the app is already running, that\'s fine!\n');
      }
    });
    
    console.log('✅ Telemetry Overlay should now be launching...\n');
    console.log('📍 Please:');
    console.log('   1. Wait for the app to fully load');
    console.log('   2. Click on Telemetry Overlay window');
    console.log('   3. Press Windows+Up Arrow (or maximize button) to MAXIMIZE');
    console.log('   4. Verify it\'s full screen\n');
    console.log('💡 Pro Tip:');
    console.log('   - Full screen = most accurate coordinates');
    console.log('   - Use Alt+Tab to switch between Telemetry and terminal');
    console.log('   - Don\'t un-maximize during tracking!\n');
    
    // Step 2: Wait for user to position window
    setTimeout(() => {
      rl.question('➡️  Ready to start coordinate tracking? Press Enter...', () => {
        console.log('\n🎯 Starting Coordinate Tracker...\n');
        console.log('='.repeat(60));
        console.log('\n📝 Buttons to track (in suggested order):\n');
        console.log('   1. loadVideoButton       - Button to load/upload video');
        console.log('   2. patternsButton         - Patterns menu button');
        console.log('   3. loadPatternButton      - Load pattern option');
        console.log('   4. exportButton           - Export/settings button');
        console.log('   5. muteToggle             - Audio mute checkbox');
        console.log('   6. saveProjectButton      - Save project button');
        console.log('   7. finalExportButton      - Final export video button\n');
        console.log('='.repeat(60));
        console.log('\n💡 How to use the tracker with Alt+Tab:\n');
        console.log('   1. Hover mouse over a button in Telemetry Overlay (maximized)');
        console.log('   2. Press Alt+Tab to switch to this terminal');
        console.log('   3. Type the button name (e.g., "loadVideoButton")');
        console.log('   4. Press Enter to save');
        console.log('   5. Press Alt+Tab to go back to Telemetry Overlay');
        console.log('   6. Hover over next button and repeat\n');
        console.log('   📝 Commands: "list" to view saved | "exit" to quit\n');
        console.log('='.repeat(60));
        console.log('\nStarting tracker in 3 seconds...\n');
        
        rl.close();
        
        // Give user time to read, then start tracker
        setTimeout(() => {
          require('./tracker.js');
        }, 3000);
      });
    }, 2000);
    
  } catch (error) {
    console.error('❌ Error launching Telemetry Overlay:', error.message);
    console.log('\nPlease check:');
    console.log('   - Is the path correct?');
    console.log('   - Is Telemetry Overlay installed?');
    console.log(`   - Path: ${TELEMETRY_APP}\n`);
    rl.close();
  }
});
