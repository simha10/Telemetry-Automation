/**
 * Debug Automation - Step-by-Step Manual Test
 * This script runs automation with prompts at each step
 */

const { mouse, keyboard, Point, Button } = require("@nut-tree-fork/nut-js");
const { exec } = require("child_process");
const readline = require("readline");
const guiMap = require("./config/guiMap.json");
const settings = require("./config/settings.json");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askToContinue(message) {
  return new Promise(resolve => {
    rl.question(`\n${message} (Press Enter to continue, 'q' to quit): `, answer => {
      if (answer.toLowerCase() === 'q') {
        rl.close();
        process.exit(0);
      }
      resolve();
    });
  });
}

(async () => {
  console.log('\n🔍 DEBUG MODE - Step-by-Step Automation Test\n');
  console.log('This will execute automation slowly with pauses at each step.');
  console.log('Watch the screen to verify each action works correctly.\n');
  
  await askToContinue('Ready to start?');
  
  // Step 1: Launch app
  console.log('\n📌 Step 1: Launching Telemetry Overlay...');
  console.log(`   Command: "${settings.exePath}"`);
  exec(`"${settings.exePath}"`);
  console.log('   ⏳ Waiting 5 seconds for app to load...');
  await new Promise(r => setTimeout(r, 5000));
  
  await askToContinue('✅ Is Telemetry Overlay open and MAXIMIZED?');
  
  // Step 2: Show where we'll click for Load Video
  console.log('\n📌 Step 2: Load Video Button');
  console.log(`   Coordinates: (${guiMap["Load video button"].x}, ${guiMap["Load video button"].y})`);
  console.log('   Moving mouse to this position...');
  
  await mouse.move(new Point(guiMap["Load video button"].x, guiMap["Load video button"].y));
  await new Promise(r => setTimeout(r, 1000));
  
  await askToContinue('✅ Is mouse over the "Load Video" button?');
  
  console.log('   Clicking...');
  await mouse.click(Button.LEFT);
  await new Promise(r => setTimeout(r, 2000));
  
  await askToContinue('✅ Did file dialog open?');
  
  // Step 3: Type video path
  console.log('\n📌 Step 3: Type Video Path');
  console.log('   Clearing existing text with Ctrl+A...');
  await keyboard.pressKey("Control", "A");
  await new Promise(r => setTimeout(r, 100));
  await keyboard.releaseKey("Control", "A");
  await new Promise(r => setTimeout(r, 500));
  
  const testPath = "E:\\\\MALL_1-10-2025 output1\\\\BHANPUR TO MH 517_output.MP4";
  console.log(`   Typing path: ${testPath}`);
  await keyboard.type(testPath);
  await new Promise(r => setTimeout(r, 1000));
  
  await askToContinue('✅ Is the path typed correctly in the file dialog?');
  
  // Step 4: Click Open button
  console.log('\n📌 Step 4: Open Button');
  console.log(`   Coordinates: (${guiMap["Open button"].x}, ${guiMap["Open button"].y})`);
  console.log('   Moving mouse to Open button...');
  
  await mouse.move(new Point(guiMap["Open button"].x, guiMap["Open button"].y));
  await new Promise(r => setTimeout(r, 1000));
  
  await askToContinue('✅ Is mouse over the "Open" button?');
  
  console.log('   Clicking...');
  await mouse.click(Button.LEFT);
  await new Promise(r => setTimeout(r, 2000));
  
  await askToContinue('✅ Did video load in Telemetry Overlay?');
  
  // Step 5: Pattern button
  console.log('\n📌 Step 5: Pattern Button');
  console.log(`   Coordinates: (${guiMap["Pattern Button"].x}, ${guiMap["Pattern Button"].y})`);
  console.log('   Moving mouse...');
  
  await mouse.move(new Point(guiMap["Pattern Button"].x, guiMap["Pattern Button"].y));
  await new Promise(r => setTimeout(r, 1000));
  
  await askToContinue('✅ Is mouse over the "Pattern" button?');
  
  console.log('   Clicking...');
  await mouse.click(Button.LEFT);
  await new Promise(r => setTimeout(r, 2000));
  
  await askToContinue('✅ Did pattern menu/dialog open?');
  
  console.log('\n✅ DEBUG TEST COMPLETE!');
  console.log('\nResults:');
  console.log('   If all steps worked correctly, coordinates are good!');
  console.log('   If any step failed, you need to:');
  console.log('   1. Make sure Telemetry Overlay is MAXIMIZED');
  console.log('   2. Re-track coordinates with: npm run tracker');
  console.log('   3. Ensure same screen resolution as during tracking\n');
  
  rl.close();
})();
