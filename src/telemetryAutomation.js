const { mouse, keyboard, Point, Button } = require("@nut-tree-fork/nut-js");
const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");
const { log: logMessage } = require("./logger");
const { waitForRenderComplete, killTelemetryProcesses } = require("./renderMonitor");

/**
 * Calculates estimated encoding time based on video file size
 * @param {string} videoPath - Path to the video file
 * @param {object} settings - Settings object with encoding time parameters
 * @returns {number} Estimated time in milliseconds
 */
function calculateEncodingTime(videoPath, settings) {
  try {
    const stats = fs.statSync(videoPath);
    const fileSizeInMB = stats.size / (1024 * 1024);
    
    // Get configurable parameters or use defaults
    const timePerMB = settings.delays.encodingTimePerMB || 500;
    const minTime = settings.delays.minEncodingTime || 5000;
    const maxTime = settings.delays.maxEncodingTime || 120000;
    
    // Calculate: timePerMB * file size, clamped between min and max
    const estimatedTime = Math.min(Math.max(fileSizeInMB * timePerMB, minTime), maxTime);
    
    console.log(`   📊 Video size: ${fileSizeInMB.toFixed(2)} MB`);
    console.log(`   ⏱️  Estimated encoding time: ${(estimatedTime / 1000).toFixed(1)}s`);
    
    return estimatedTime;
  } catch (err) {
    console.log(`   ⚠️  Could not determine file size, using default wait time`);
    return settings.delays.minEncodingTime || 10000;
  }
}

/**
 * Waits for encoding to complete with progress updates
 * @param {number} estimatedTime - Estimated time in milliseconds
 * @param {number} checkInterval - How often to check (default 2000ms)
 */
async function waitForEncoding(estimatedTime, checkInterval = 2000) {
  const startTime = Date.now();
  let elapsed = 0;
  
  console.log(`\n⏳ Waiting for video encoding/optimization...`);
  
  while (elapsed < estimatedTime) {
    await new Promise(r => setTimeout(r, checkInterval));
    elapsed = Date.now() - startTime;
    
    const progress = Math.min((elapsed / estimatedTime) * 100, 100);
    const remainingTime = Math.max(0, (estimatedTime - elapsed) / 1000);
    
    process.stdout.write(`\r   Progress: ${progress.toFixed(0)}% | Remaining: ~${remainingTime.toFixed(0)}s   `);
  }
  
  console.log(`\n   ✅ Encoding should be complete!\n`);
}

// Configure mouse for better reliability
mouse.config.mouseSpeed = 500; // Slower mouse movement for visibility
mouse.config.autoDelayMs = 100; // Small delay between actions

async function automateTelemetry(videoPath, patternPath, settings, guiMap) {
  // Remove file extension (case-insensitive for .mp4 or .MP4)
  const videoName = path.basename(videoPath).replace(/\.mp4$/i, '');
  const projectPath = path.join(settings.outputFolder, `${videoName}.toproj`);
  const outputVideo = path.join(settings.outputFolder, `${videoName}.mp4`);

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
    
    // Wait for file dialog to open (configurable delay)
    const fileDialogDelay = settings.delays.fileDialogOpen || 3000;
    console.log(`   ⏳ Waiting ${fileDialogDelay}ms for file dialog to open...`);
    await new Promise(r => setTimeout(r, fileDialogDelay));

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
    
    // Step 3.5: Wait for video encoding/optimization based on file size
    console.log('\n🔄 Step 3.5: Waiting for video encoding...');
    logMessage(settings.logFile, `Waiting for video encoding/optimization...`);
    
    const encodingTime = calculateEncodingTime(videoPath, settings);
    const checkInterval = settings.delays.encodingCheckInterval || 2000;
    await waitForEncoding(encodingTime, checkInterval);
    
    // Add a small buffer after encoding
    console.log('   ⏳ Adding 2s buffer for UI to stabilize...');
    await new Promise(r => setTimeout(r, 2000));

    // Step 4: Click Pattern Button
    console.log('\n🎨 Step 4: Clicking Pattern button...');
    console.log(`   Target coordinates: (${guiMap["Pattern Button"].x}, ${guiMap["Pattern Button"].y})`);
    logMessage(settings.logFile, `Step 4: Loading recently used pattern...`);
    
    await mouse.move(new Point(guiMap["Pattern Button"].x, guiMap["Pattern Button"].y));
    console.log('   ✅ Mouse moved to Pattern button');
    await new Promise(r => setTimeout(r, 500));
    
    await mouse.leftClick();
    console.log('   ✅ Clicked Pattern button');
    
    // Wait for pattern menu/dialog to open
    console.log(`   ⏳ Waiting ${settings.delays.stepDelay}ms for pattern menu...`);
    await new Promise(r => setTimeout(r, settings.delays.stepDelay));

    // Step 5: Click Recently Used Pattern Button
    console.log('\n📂 Step 5: Clicking Recently Used Pattern button...');
    console.log(`   Target coordinates: (${guiMap["Recently used pattern button"].x}, ${guiMap["Recently used pattern button"].y})`);
    
    await mouse.move(new Point(guiMap["Recently used pattern button"].x, guiMap["Recently used pattern button"].y));
    console.log('   ✅ Mouse moved to Recently Used Pattern button');
    await new Promise(r => setTimeout(r, 500));
    
    await mouse.leftClick();
    console.log('   ✅ Clicked Recently Used Pattern button');
    
    // Wait for modal to open
    console.log(`   ⏳ Waiting ${settings.delays.stepDelay}ms for modal to open...`);
    await new Promise(r => setTimeout(r, settings.delays.stepDelay));

    // Step 6: Click Load button in modal
    console.log('\n✔️ Step 6: Clicking Load button in modal...');
    console.log(`   Target coordinates: (${guiMap["Load button in Modal"].x}, ${guiMap["Load button in Modal"].y})`);
    
    await mouse.move(new Point(guiMap["Load button in Modal"].x, guiMap["Load button in Modal"].y));
    console.log('   ✅ Mouse moved to Load button');
    await new Promise(r => setTimeout(r, 500));
    
    await mouse.leftClick();
    console.log('   ✅ Clicked Load button');
    console.log(`   ⏳ Waiting ${settings.delays.stepDelay}ms for pattern to load...`);
    await new Promise(r => setTimeout(r, settings.delays.stepDelay));

    // Step 7: Click Export Button
    console.log('\n📤 Step 7: Clicking Export button...');
    console.log(`   Target coordinates: (${guiMap["Export Button"].x}, ${guiMap["Export Button"].y})`);
    logMessage(settings.logFile, `Step 7: Configuring export settings...`);
    
    await mouse.move(new Point(guiMap["Export Button"].x, guiMap["Export Button"].y));
    console.log('   ✅ Mouse moved to Export button');
    await new Promise(r => setTimeout(r, 500));
    
    await mouse.leftClick();
    console.log('   ✅ Clicked Export button');
    console.log(`   ⏳ Waiting ${settings.delays.stepDelay}ms for export panel...`);
    await new Promise(r => setTimeout(r, settings.delays.stepDelay));

    // Step 8: Set video quality to 0
    console.log('\n🎬 Step 8: Setting video quality to 0...');
    console.log(`   Target coordinates: (${guiMap["set video quality to 0 button"].x}, ${guiMap["set video quality to 0 button"].y})`);
    
    await mouse.move(new Point(guiMap["set video quality to 0 button"].x, guiMap["set video quality to 0 button"].y));
    console.log('   ✅ Mouse moved to quality field');
    await new Promise(r => setTimeout(r, 300));
    
    await mouse.leftClick();
    await keyboard.type("0");
    console.log('   ✅ Set video quality to 0');
    await new Promise(r => setTimeout(r, 300));

    // Step 9: Set render speed to 0
    console.log('\n⚡ Step 9: Setting render speed to 0...');
    console.log(`   Target coordinates: (${guiMap["set render speed to zero button"].x}, ${guiMap["set render speed to zero button"].y})`);
    
    await mouse.move(new Point(guiMap["set render speed to zero button"].x, guiMap["set render speed to zero button"].y));
    console.log('   ✅ Mouse moved to render speed field');
    await new Promise(r => setTimeout(r, 300));
    
    await mouse.leftClick();
    await keyboard.type("0");
    console.log('   ✅ Set render speed to 0');
    await new Promise(r => setTimeout(r, 300));

    // Step 10: Turn off "include original audio"
    console.log('\n🔇 Step 10: Turning off "include original audio"...');
    console.log(`   Target coordinates: (${guiMap["turn off include \"include original audio\" button"].x}, ${guiMap["turn off include \"include original audio\" button"].y})`);
    
    await mouse.move(new Point(guiMap["turn off include \"include original audio\" button"].x, guiMap["turn off include \"include original audio\" button"].y));
    console.log('   ✅ Mouse moved to audio toggle');
    await new Promise(r => setTimeout(r, 300));
    
    await mouse.leftClick();
    console.log('   ✅ Toggled audio off');
    console.log(`   ⏳ Waiting ${settings.delays.stepDelay}ms...`);
    await new Promise(r => setTimeout(r, settings.delays.stepDelay));

    // Step 11: Click Save Project Button
    console.log('\n💾 Step 11: Clicking Save Project button...');
    console.log(`   Target coordinates: (${guiMap["Save project button"].x}, ${guiMap["Save project button"].y})`);
    logMessage(settings.logFile, `Step 11: Saving project as .toproj...`);
    
    await mouse.move(new Point(guiMap["Save project button"].x, guiMap["Save project button"].y));
    console.log('   ✅ Mouse moved to Save Project button');
    await new Promise(r => setTimeout(r, 500));
    
    await mouse.leftClick();
    console.log('   ✅ Clicked Save Project button');
    
    // Wait for save dialog to open
    const saveDialogDelay = settings.delays.fileDialogOpen || 3000;
    console.log(`   ⏳ Waiting ${saveDialogDelay}ms for save dialog...`);
    await new Promise(r => setTimeout(r, saveDialogDelay));

    // Step 12: Type project file path (.toproj)
    console.log('\n📝 Step 12: Entering project file path...');
    console.log(`   Path: ${projectPath}`);
    
    // Clear existing text
    await keyboard.pressKey("Control", "A");
    await new Promise(r => setTimeout(r, 100));
    await keyboard.releaseKey("Control", "A");
    await new Promise(r => setTimeout(r, 100));
    
    // Type full path
    await keyboard.type(projectPath);
    console.log('   ✅ Typed project path');
    await new Promise(r => setTimeout(r, 800));
    
    // Click save button for .toproj
    console.log('\n💾 Step 12b: Clicking Save button for .toproj...');
    console.log(`   Target coordinates: (${guiMap["save .toproj file button"].x}, ${guiMap["save .toproj file button"].y})`);
    
    await mouse.move(new Point(guiMap["save .toproj file button"].x, guiMap["save .toproj file button"].y));
    console.log('   ✅ Mouse moved to Save button');
    await new Promise(r => setTimeout(r, 500));
    
    await mouse.leftClick();
    console.log('   ✅ Saved .toproj file');
    
    // Wait for .mp4 save dialog to open
    const mp4DialogDelay = settings.delays.fileDialogOpen || 3000;
    console.log(`   ⏳ Waiting ${mp4DialogDelay}ms for .mp4 save dialog to open...`);
    await new Promise(r => setTimeout(r, mp4DialogDelay));

    // Step 13: Click button to set path for .mp4 file
    console.log('\n📁 Step 13: Clicking path field for .mp4 file...');
    console.log(`   Target coordinates: (${guiMap["button to set path to save .mp4 file"].x}, ${guiMap["button to set path to save .mp4 file"].y})`);
    logMessage(settings.logFile, `Step 13: Setting output path for .mp4 file...`);
    
    await mouse.move(new Point(guiMap["button to set path to save .mp4 file"].x, guiMap["button to set path to save .mp4 file"].y));
    console.log('   ✅ Mouse moved to path field');
    await new Promise(r => setTimeout(r, 500));
    
    await mouse.leftClick();
    console.log('   ✅ Clicked path field');
    await new Promise(r => setTimeout(r, 800));

    // Step 13b: Type output video path (.mp4)
    console.log('\n📝 Step 13b: Entering output video path...');
    console.log(`   Path: ${outputVideo}`);
    
    // Clear existing text
    await keyboard.pressKey("Control", "A");
    await new Promise(r => setTimeout(r, 100));
    await keyboard.releaseKey("Control", "A");
    await new Promise(r => setTimeout(r, 100));
    
    // Type full output path
    await keyboard.type(outputVideo);
    console.log('   ✅ Typed output video path');
    await new Promise(r => setTimeout(r, 800));

    // Step 13c: Click Save button for .mp4 path
    console.log('\n💾 Step 13c: Clicking Save button for .mp4 path...');
    console.log(`   Target coordinates: (${guiMap["save button for saving .mp4 path"].x}, ${guiMap["save button for saving .mp4 path"].y})`);
    
    await mouse.move(new Point(guiMap["save button for saving .mp4 path"].x, guiMap["save button for saving .mp4 path"].y));
    console.log('   ✅ Mouse moved to Save button');
    await new Promise(r => setTimeout(r, 500));
    
    await mouse.leftClick();
    console.log('   ✅ Saved .mp4 path');
    console.log(`   ⏳ Waiting ${settings.delays.stepDelay}ms...`);
    await new Promise(r => setTimeout(r, settings.delays.stepDelay));

    // Step 13d: Click Export button to save .mp4 video file
    console.log('\n🎥 Step 13d: Clicking Export button to save .mp4 video...');
    console.log(`   Target coordinates: (${guiMap["export button to save .mp4 video file "].x}, ${guiMap["export button to save .mp4 video file "].y})`);
    logMessage(settings.logFile, `Step 13d: Starting MP4 export...`);
    
    await mouse.move(new Point(guiMap["export button to save .mp4 video file "].x, guiMap["export button to save .mp4 video file "].y));
    console.log('   ✅ Mouse moved to Export button');
    await new Promise(r => setTimeout(r, 500));
    
    await mouse.leftClick();
    console.log('   ✅ Started MP4 export!');
    console.log(`   ⏳ Waiting ${settings.delays.stepDelay}ms for export to begin...`);
    await new Promise(r => setTimeout(r, settings.delays.stepDelay));

    // Step 14: Wait for render to complete (NEW - File monitoring with stuck detection)
    console.log('\n⏱️  Step 14: Waiting for render to complete...');
    logMessage(settings.logFile, `Step 14: Monitoring render completion for ${videoName}...`);
    
    try {
      await waitForRenderComplete(outputVideo, {
        timeout: settings.delays.renderTimeout || 7200000,
        checkInterval: settings.delays.renderCheckInterval || 60000,
        stabilityDuration: settings.delays.renderStabilityDuration || 60000,
        postRenderWait: settings.delays.postRenderMetadataWait || 300000,
        maxStuckChecks: settings.delays.maxStuckChecks || 10
      });
      console.log('   ✅ Render confirmed complete!');
      logMessage(settings.logFile, `Render completed successfully: ${outputVideo}`);
    } catch (err) {
      // Render stuck or timed out
      console.log(`\n   ⚠️  Render monitoring error: ${err.message}`);
      logMessage(settings.logFile, `Render error: ${err.message}`);
      
      if (err.message.includes('stuck') || err.message.includes('never appeared')) {
        console.log(`\n   🛑 RECOVERY MODE ACTIVATED`);
        console.log(`   ℹ️  The render appears stuck or failed to start`);
        console.log(`\n   🛠️  Attempting to recover...`);
        
        // Force kill the application
        console.log(`   🔴 Force-killing Telemetry Overlay...`);
        await killTelemetryProcesses();
        await new Promise(r => setTimeout(r, 2000));
        
        // Check if output file exists and has any size
        if (fs.existsSync(outputVideo)) {
          const stats = fs.statSync(outputVideo);
          const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
          
          console.log(`\n   💾 Output file exists: ${sizeMB} MB`);
          
          if (stats.size > 0) {
            console.log(`   ℹ️  File has data - partial render may be salvageable`);
            console.log(`   ⚠️  Marking this video as FAILED for manual review`);
            logMessage(settings.logFile, `Partial render saved (${sizeMB} MB): ${outputVideo}`);
          } else {
            console.log(`   ❌ File is 0 bytes - render completely failed`);
            console.log(`   🗑️  Removing empty file...`);
            fs.unlinkSync(outputVideo);
            logMessage(settings.logFile, `Render failed completely, file removed: ${videoName}`);
          }
        } else {
          console.log(`\n   ❌ No output file created - export never started`);
          logMessage(settings.logFile, `Export failed to start: ${videoName}`);
        }
        
        console.log(`\n   ⏩ Skipping to next video...\n`);
        throw new Error(`Render stuck or failed for ${videoName}`);
      } else {
        // Other errors (timeout, etc)
        console.log('   ℹ️  Continuing with cleanup...');
      }
    }

    // Step 15: Close Telemetry Overlay window (IMPROVED - Process kill)
    console.log('\n🚪 Step 15: Closing Telemetry Overlay window...');
    logMessage(settings.logFile, `Step 15: Closing application for next video...`);
    
    // Try Alt+F4 first (graceful close)
    await keyboard.pressKey("Alt", "F4");
    await new Promise(r => setTimeout(r, 100));
    await keyboard.releaseKey("Alt", "F4");
    console.log('   ✅ Sent close command (Alt+F4)');
    
    // Wait for graceful close
    console.log('   ⏳ Waiting 3s for window to close...');
    await new Promise(r => setTimeout(r, 3000));
    
    // Force kill any remaining processes
    await killTelemetryProcesses();
    
    console.log('   ✅ Application fully closed, ready for next video!');

    logMessage(settings.logFile, `✅ Completed ${videoName}`);
  } catch (err) {
    logMessage(settings.logFile, `❌ Failed ${videoName}: ${err.message}`);
    
    // Ensure cleanup even on error
    console.log('\n⚠️  Error occurred, ensuring cleanup...');
    await killTelemetryProcesses();
    
    throw err; // Re-throw to be caught by index.js
  }
}

module.exports = { automateTelemetry };

