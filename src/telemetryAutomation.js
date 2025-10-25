const { mouse, keyboard, Point, Button } = require("@nut-tree-fork/nut-js");
const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");
const { logMessage } = require("./logger");

// Configure mouse for better reliability
mouse.config.mouseSpeed = 500; // Slower mouse movement for visibility
mouse.config.autoDelayMs = 100; // Small delay between actions

async function automateTelemetry(videoPath, patternPath, settings, guiMap) {
  const videoName = path.basename(videoPath, ".mp4");
  const projectPath = path.join(settings.outputFolder, `${videoName}_output.toproj`);
  const outputVideo = path.join(settings.outputFolder, `${videoName}_output.mp4`);

  try {
    logMessage(settings.logFile, `Starting automation for ${videoName}`);
    console.log(`\n⏳ Starting automation for: ${videoName}`);

    // Step 1: Launch Telemetry Overlay app
    console.log('\n🚀 Step 1: Launching Telemetry Overlay...');
    logMessage(settings.logFile, `Step 1: Launching Telemetry Overlay`);
    exec(`"${settings.exePath}"`);
    
    // Wait for app to fully load
    console.log(`   Waiting ${settings.delays.appLoad}ms for app to load...`);
    await new Promise(r => setTimeout(r, settings.delays.appLoad));
    console.log('   ✅ App should be loaded');

    // Step 2: Click Load Video Button
    console.log('\n📹 Step 2: Clicking Load Video button...');
    console.log(`   Target coordinates: (${guiMap["Load video button"].x}, ${guiMap["Load video button"].y})`);
    logMessage(settings.logFile, `Step 2: Loading video from ${videoPath}...`);
    
    // Move to button
    await mouse.move(new Point(guiMap["Load video button"].x, guiMap["Load video button"].y));
    console.log('   ✅ Mouse moved to button');
    await new Promise(r => setTimeout(r, 1000)); // Wait 1 second
    
    // Click multiple times to ensure it registers
    console.log('   🖱️ Clicking...');
    await mouse.leftClick();
    await new Promise(r => setTimeout(r, 300));
    await mouse.leftClick(); // Double-click for safety
    console.log('   ✅ Clicked Load Video button (double-clicked)');
    
    await new Promise(r => setTimeout(r, settings.delays.stepDelay));
    console.log('   ⏳ Waiting for file dialog to open...');

    // Step 3: Type FULL video path (absolute path) and click Open
    console.log('\n📝 Step 3: Entering video path...');
    console.log(`   Path: ${videoPath}`);
    
    // Clear any existing text first
    await keyboard.pressKey("Control", "A");
    await new Promise(r => setTimeout(r, 100));
    await keyboard.releaseKey("Control", "A");
    await new Promise(r => setTimeout(r, 100));
    
    // Type the complete absolute path
    await keyboard.type(videoPath);
    console.log('   ✅ Typed video path');
    await new Promise(r => setTimeout(r, 800));
    
    // Click Open button
    console.log(`\n   Clicking Open button at (${guiMap["Open button"].x}, ${guiMap["Open button"].y})...`);
    await mouse.move(new Point(guiMap["Open button"].x, guiMap["Open button"].y));
    await new Promise(r => setTimeout(r, 500));
    await mouse.leftClick();
    console.log('   ✅ Clicked Open button');
    
    await new Promise(r => setTimeout(r, settings.delays.stepDelay));

    // Step 4: Click Pattern Button
    logMessage(settings.logFile, `Step 4: Loading pattern from ${patternPath}...`);
    await mouse.move(new Point(guiMap["Pattern Button"].x, guiMap["Pattern Button"].y));
    await mouse.leftClick();
    await new Promise(r => setTimeout(r, settings.delays.stepDelay));

    // Step 5: Click Load Pattern Button
    await mouse.move(new Point(guiMap["Load Pattern Button"].x, guiMap["Load Pattern Button"].y));
    await mouse.leftClick();
    await new Promise(r => setTimeout(r, settings.delays.stepDelay));

    // Step 6: Type full pattern path
    // Clear existing text
    await keyboard.pressKey("Control", "A");
    await new Promise(r => setTimeout(r, 100));
    await keyboard.releaseKey("Control", "A");
    await new Promise(r => setTimeout(r, 100));
    
    // Type pattern path
    await keyboard.type(patternPath);
    await new Promise(r => setTimeout(r, 500));

    // Step 7: Click Load button in modal
    await mouse.move(new Point(guiMap["Load button in Modal"].x, guiMap["Load button in Modal"].y));
    await mouse.leftClick();
    await new Promise(r => setTimeout(r, settings.delays.stepDelay));

    // Step 8: Click Export Button
    logMessage(settings.logFile, `Step 8: Configuring export settings...`);
    await mouse.move(new Point(guiMap["Export Button"].x, guiMap["Export Button"].y));
    await mouse.leftClick();
    await new Promise(r => setTimeout(r, settings.delays.stepDelay));

    // Step 9: Set video quality to 0
    await mouse.move(new Point(guiMap["set video quality to 0 button"].x, guiMap["set video quality to 0 button"].y));
    await mouse.leftClick();
    await keyboard.type("0");
    await new Promise(r => setTimeout(r, 300));

    // Step 10: Set render speed to 0
    await mouse.move(new Point(guiMap["set render speed to zero button"].x, guiMap["set render speed to zero button"].y));
    await mouse.leftClick();
    await keyboard.type("0");
    await new Promise(r => setTimeout(r, 300));

    // Step 11: Turn off "include original audio"
    await mouse.move(new Point(guiMap["turn off include \"include original audio\" button"].x, guiMap["turn off include \"include original audio\" button"].y));
    await mouse.leftClick();
    await new Promise(r => setTimeout(r, settings.delays.stepDelay));

    // Step 12: Click Save Project Button
    logMessage(settings.logFile, `Step 12: Saving project to ${projectPath}...`);
    await mouse.move(new Point(guiMap["Save project button"].x, guiMap["Save project button"].y));
    await mouse.leftClick();
    await new Promise(r => setTimeout(r, settings.delays.stepDelay));

    // Step 13: Type FULL project path and save
    // Clear existing text
    await keyboard.pressKey("Control", "A");
    await new Promise(r => setTimeout(r, 100));
    await keyboard.releaseKey("Control", "A");
    await new Promise(r => setTimeout(r, 100));
    
    // Type full path
    await keyboard.type(projectPath);
    await new Promise(r => setTimeout(r, 800));
    
    // Click save button
    await mouse.move(new Point(guiMap["save .toproj file button"].x, guiMap["save .toproj file button"].y));
    await mouse.leftClick();
    await new Promise(r => setTimeout(r, settings.delays.stepDelay));

    // Step 14: Export final MP4 video
    logMessage(settings.logFile, `Step 14: Exporting video to ${outputVideo}...`);
    
    // Clear and type output video path
    await keyboard.pressKey("Control", "A");
    await new Promise(r => setTimeout(r, 100));
    await keyboard.releaseKey("Control", "A");
    await new Promise(r => setTimeout(r, 100));
    
    await keyboard.type(outputVideo);
    await new Promise(r => setTimeout(r, 800));
    
    // Click final save button
    await mouse.move(new Point(guiMap[".mp4 file save button"].x, guiMap[".mp4 file save button"].y));
    await mouse.leftClick();
    await new Promise(r => setTimeout(r, settings.delays.stepDelay));

    logMessage(settings.logFile, `✅ Completed ${videoName}`);
  } catch (err) {
    logMessage(settings.logFile, `❌ Failed ${videoName}: ${err.message}`);
  }
}

module.exports = { automateTelemetry };

