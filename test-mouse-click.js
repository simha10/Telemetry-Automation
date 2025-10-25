/**
 * Test Mouse Click Functionality
 * This verifies that nut-js can actually click
 */

const { mouse, Button, Point } = require("@nut-tree-fork/nut-js");
const guiMap = require("./config/guiMap.json");

(async () => {
  console.log('\n🖱️  Mouse Click Test\n');
  console.log('This will test if mouse clicking works properly.\n');
  
  console.log('📍 Load Video Button Coordinates:');
  console.log(`   X: ${guiMap["Load video button"].x}`);
  console.log(`   Y: ${guiMap["Load video button"].y}`);
  
  console.log('\n⏳ In 3 seconds, mouse will move to Load Video button...');
  await new Promise(r => setTimeout(r, 3000));
  
  console.log('\n🖱️  Moving mouse...');
  await mouse.move(new Point(guiMap["Load video button"].x, guiMap["Load video button"].y));
  
  console.log('✅ Mouse moved!');
  console.log('\n⏳ Waiting 2 seconds before clicking...');
  await new Promise(r => setTimeout(r, 2000));
  
  console.log('\n🖱️  CLICKING NOW!');
  await mouse.leftClick();
  
  console.log('✅ Click executed!');
  console.log('\n⏳ Clicking again after 1 second...');
  await new Promise(r => setTimeout(r, 1000));
  
  await mouse.leftClick();
  console.log('✅ Second click executed!');
  
  console.log('\n✅ Test Complete!');
  console.log('\nDid you see:');
  console.log('  1. Mouse move to the button?');
  console.log('  2. File dialog open after click?');
  console.log('\nIf YES → Automation should work!');
  console.log('If NO → Check if:');
  console.log('  - Telemetry Overlay is maximized');
  console.log('  - Coordinates are correct');
  console.log('  - You have latest nut-js version\n');
})();
