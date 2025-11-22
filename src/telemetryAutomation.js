const { mouse, keyboard, Point, Button } = require("@nut-tree-fork/nut-js");
const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");
const { log } = require("./logger");
const { waitForRenderComplete, killTelemetryProcesses, getVideoDuration } = require("./renderMonitor");
const { markVideoAsProcessed } = require("./fileUtils");
const settingsConfig = require("../config/settings.json");

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
    
    // Show size validation information
    const fileSizeInGB = fileSizeInMB / 1024;
    const maxSizeGB = settingsConfig.maxFileSizeGB || 2; // Default to 2GB if not set
    console.log(`   📊 Video size: ${fileSizeInMB.toFixed(2)} MB (${fileSizeInGB.toFixed(2)} GB)`);
    console.log(`   ✅ Size validation: ${fileSizeInGB.toFixed(2)} GB < ${maxSizeGB} GB = ${fileSizeInGB < maxSizeGB}`);
    
    // Get configurable parameters or use defaults
    const timePerMB = settings.delays.encodingTimePerMB || 500;
    const minTime = settings.delays.minEncodingTime || 5000;
    const maxTime = settings.delays.maxEncodingTime || 120000;
    
    // Calculate: timePerMB * file size, clamped between min and max
    const estimatedTime = Math.min(Math.max(fileSizeInMB * timePerMB, minTime), maxTime);
    
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

/**
 * Enhanced application closure with new buttons
 * @param {object} guiMap - GUI coordinates map
 */
async function closeTelemetryEnhanced(guiMap) {
  console.log('\n🚪 Enhanced Telemetry Overlay closure...');
  
  // Click the window close button (top-right corner)
  console.log(`   Clicking Close Button at (${guiMap["Close Button"].x}, ${guiMap["Close Button"].y})...`);
  await mouse.move(new Point(guiMap["Close Button"].x, guiMap["Close Button"].y));
  await new Promise(r => setTimeout(r, 500));
  await mouse.leftClick();
  console.log('   ✅ Clicked window Close Button');
  
  // Wait a moment for any confirmation dialog
  await new Promise(r => setTimeout(r, 1000));
  
  // Click the application close confirmation button
  console.log(`   Clicking Close App Button at (${guiMap["Close App Button"].x}, ${guiMap["Close App Button"].y})...`);
  await mouse.move(new Point(guiMap["Close App Button"].x, guiMap["Close App Button"].y));
  await new Promise(r => setTimeout(r, 500));
  await mouse.leftClick();
  console.log('   ✅ Clicked Close App Button');
  
  // Wait for graceful close
  console.log('   ⏳ Waiting 3s for window to close...');
  await new Promise(r => setTimeout(r, 3000));
  
  // Force kill any remaining processes
  await killTelemetryProcesses();
}

/**
 * Delete all files in the Telemetry Overlay cache folder
 */
async function clearTelemetryCache() {
  // Updated cache path as per user's requirement
  const cachePath = "C:\\Users\\HP\\Documents\\telemetry-overlay\\cache";
  
  try {
    if (fs.existsSync(cachePath)) {
      console.log(`\n🗑️  Clearing Telemetry Overlay cache: ${cachePath}`);
      
      const files = fs.readdirSync(cachePath);
      let deletedCount = 0;
      
      for (const file of files) {
        try {
          const filePath = path.join(cachePath, file);
          fs.unlinkSync(filePath);
          deletedCount++;
        } catch (err) {
          console.log(`   ⚠️  Could not delete cache file: ${file}`);
        }
      }
      
      console.log(`   ✅ Deleted ${deletedCount} cache files`);
    } else {
      console.log(`\nℹ️  Cache folder does not exist: ${cachePath}`);
    }
  } catch (err) {
    console.log(`\n⚠️  Error clearing cache: ${err.message}`);
  }
}

/**
 * Calculate compression percentage between original and processed video
 * @param {number} originalSize - Size of original video in bytes
 * @param {number} processedSize - Size of processed video in bytes
 * @returns {number} Compression percentage
 */
function calculateCompressionPercentage(originalSize, processedSize) {
  if (originalSize <= 0) return 0;
  const compression = ((originalSize - processedSize) / originalSize) * 100;
  return Math.max(0, compression); // Ensure non-negative value
}

// Configure mouse for better reliability
mouse.config.mouseSpeed = 500; // Slower mouse movement for visibility
mouse.config.autoDelayMs = 100; // Small delay between actions

async function automateTelemetry(videoPath, patternPath, settings, guiMap) {
  // Remove file extension (case-insensitive for .mp4 or .MP4)
  const videoName = path.basename(videoPath).replace(/\.mp4$/i, '');
  // Fix potential double underscore issues in the video name
  const cleanVideoName = videoName.replace(/__*/g, '_');
  const projectPath = path.join(settings.outputFolder, `${cleanVideoName}.toproj`);
  const outputVideo = path.join(settings.outputFolder, `${cleanVideoName}.mp4`);

  try {
    log(`Starting automation for ${cleanVideoName}`);
    console.log(`\n⏳ Starting automation for: ${cleanVideoName}`);

    // Step 0: Clear cache BEFORE starting processing (as per user's requirement)
    console.log('\n🧹 Step 0: Clearing cache before starting processing...');
    await clearTelemetryCache();

    // Step 1: Check original video duration and size before processing
    console.log('\n🔍 Step 1: Analyzing original video...');
    let originalDuration = null;
    let originalSize = 0;
    
    try {
      const stats = fs.statSync(videoPath);
      originalSize = stats.size;
      const sizeInMB = originalSize / (1024 * 1024);
      const sizeInGB = sizeInMB / 1024;
      
      // Show size validation information
      const maxSizeGB = settingsConfig.maxFileSizeGB || 2; // Default to 2GB if not set
      console.log(`   📊 Original video size: ${sizeInMB.toFixed(2)} MB (${sizeInGB.toFixed(2)} GB)`);
      console.log(`   ✅ Size validation: ${sizeInGB.toFixed(2)} GB < ${maxSizeGB} GB = ${sizeInGB < maxSizeGB}`);
      
      originalDuration = await getVideoDuration(videoPath);
      if (originalDuration !== null) {
        console.log(`   ⏱️  Original video duration: ${Math.floor(originalDuration / 60)}:${Math.floor(originalDuration % 60).toString().padStart(2, '0')}`);
      } else {
        console.log(`   ⏱️  Original video duration: Unknown`);
      }
    } catch (err) {
      console.log(`   ⚠️  Could not analyze original video: ${err.message}`);
    }

    // Step 2: Launch Telemetry Overlay app
    console.log('\n🚀 Step 2: Launching Telemetry Overlay...');
    log(`Step 2: Launching Telemetry Overlay`);
    exec(`"${settings.exePath}"`);
    
    // Wait for app to fully load
    console.log(`   Waiting ${settings.delays.appLoad}ms for app to load...`);
    await new Promise(r => setTimeout(r, settings.delays.appLoad));
    console.log('   ✅ App should be loaded');

    // Step 3: Click Load Video Button
    console.log('\n📹 Step 3: Clicking Load Video button...');
    console.log(`   Target coordinates: (${guiMap["Load video button"].x}, ${guiMap["Load video button"].y})`);
    log(`Step 3: Loading video from ${videoPath}...`);
    
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

    // Step 4: Type FULL video path (absolute path) and click Open
    console.log('\n📝 Step 4: Entering video path...');
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
    
    // Step 4.5: Wait for video encoding/optimization based on file size
    console.log('\n🔄 Step 4.5: Waiting for video encoding...');
    log(`Waiting for video encoding/optimization...`);
    
    const encodingTime = calculateEncodingTime(videoPath, settings);
    const checkInterval = settings.delays.encodingCheckInterval || 2000;
    await waitForEncoding(encodingTime, checkInterval);
    
    // Add a small buffer after encoding
    console.log('   ⏳ Adding 2s buffer for UI to stabilize...');
    await new Promise(r => setTimeout(r, 2000));

    // Step 5: Click Pattern Button
    console.log('\n🎨 Step 5: Clicking Pattern button...');
    console.log(`   Target coordinates: (${guiMap["Pattern Button"].x}, ${guiMap["Pattern Button"].y})`);
    log(`Step 5: Loading recently used pattern...`);
    
    await mouse.move(new Point(guiMap["Pattern Button"].x, guiMap["Pattern Button"].y));
    console.log('   ✅ Mouse moved to Pattern button');
    await new Promise(r => setTimeout(r, 500));
    
    await mouse.leftClick();
    console.log('   ✅ Clicked Pattern button');
    
    // Wait for pattern menu/dialog to open
    console.log(`   ⏳ Waiting ${settings.delays.stepDelay}ms for pattern menu...`);
    await new Promise(r => setTimeout(r, settings.delays.stepDelay));

    // Step 6: Click Recently Used Pattern Button
    console.log('\n📂 Step 6: Clicking Recently Used Pattern button...');
    console.log(`   Target coordinates: (${guiMap["Recently used pattern button"].x}, ${guiMap["Recently used pattern button"].y})`);
    
    await mouse.move(new Point(guiMap["Recently used pattern button"].x, guiMap["Recently used pattern button"].y));
    console.log('   ✅ Mouse moved to Recently Used Pattern button');
    await new Promise(r => setTimeout(r, 500));
    
    await mouse.leftClick();
    console.log('   ✅ Clicked Recently Used Pattern button');
    
    // Wait for modal to open
    console.log(`   ⏳ Waiting ${settings.delays.stepDelay}ms for modal to open...`);
    await new Promise(r => setTimeout(r, settings.delays.stepDelay));

    // Step 7: Click Load button in modal
    console.log('\n✔️ Step 7: Clicking Load button in modal...');
    console.log(`   Target coordinates: (${guiMap["Load button in Modal"].x}, ${guiMap["Load button in Modal"].y})`);
    
    await mouse.move(new Point(guiMap["Load button in Modal"].x, guiMap["Load button in Modal"].y));
    console.log('   ✅ Mouse moved to Load button');
    await new Promise(r => setTimeout(r, 500));
    
    await mouse.leftClick();
    console.log('   ✅ Clicked Load button');
    console.log(`   ⏳ Waiting ${settings.delays.stepDelay}ms for pattern to load...`);
    await new Promise(r => setTimeout(r, settings.delays.stepDelay));

    // Step 8: Click Export Button
    console.log('\n📤 Step 8: Clicking Export button...');
    console.log(`   Target coordinates: (${guiMap["Export Button"].x}, ${guiMap["Export Button"].y})`);
    log(`Step 8: Configuring export settings...`);
    
    await mouse.move(new Point(guiMap["Export Button"].x, guiMap["Export Button"].y));
    console.log('   ✅ Mouse moved to Export button');
    await new Promise(r => setTimeout(r, 500));
    
    await mouse.leftClick();
    console.log('   ✅ Clicked Export button');
    console.log(`   ⏳ Waiting ${settings.delays.stepDelay}ms for export panel...`);
    await new Promise(r => setTimeout(r, settings.delays.stepDelay));

    // Step 9: Set video quality to 0
    console.log('\n🎬 Step 9: Setting video quality to 0...');
    console.log(`   Target coordinates: (${guiMap["set video quality to 0 button"].x}, ${guiMap["set video quality to 0 button"].y})`);
    
    await mouse.move(new Point(guiMap["set video quality to 0 button"].x, guiMap["set video quality to 0 button"].y));
    console.log('   ✅ Mouse moved to quality field');
    await new Promise(r => setTimeout(r, 300));
    
    await mouse.leftClick();
    await keyboard.type("0");
    console.log('   ✅ Set video quality to 0');
    await new Promise(r => setTimeout(r, 300));

    // Step 10: Set render speed to 0
    console.log('\n⚡ Step 10: Setting render speed to 0...');
    console.log(`   Target coordinates: (${guiMap["set render speed to zero button"].x}, ${guiMap["set render speed to zero button"].y})`);
    
    await mouse.move(new Point(guiMap["set render speed to zero button"].x, guiMap["set render speed to zero button"].y));
    console.log('   ✅ Mouse moved to render speed field');
    await new Promise(r => setTimeout(r, 300));
    
    await mouse.leftClick();
    await keyboard.type("0");
    console.log('   ✅ Set render speed to 0');
    await new Promise(r => setTimeout(r, 300));

    // Step 11: Turn off "include original audio"
    console.log('\n🔇 Step 11: Turning off "include original audio"...');
    console.log(`   Target coordinates: (${guiMap["turn off include \"include original audio\" button"].x}, ${guiMap["turn off include \"include original audio\" button"].y})`);
    
    await mouse.move(new Point(guiMap["turn off include \"include original audio\" button"].x, guiMap["turn off include \"include original audio\" button"].y));
    console.log('   ✅ Mouse moved to audio toggle');
    await new Promise(r => setTimeout(r, 300));
    
    await mouse.leftClick();
    console.log('   ✅ Toggled audio off');
    console.log(`   ⏳ Waiting ${settings.delays.stepDelay}ms...`);
    await new Promise(r => setTimeout(r, settings.delays.stepDelay));

    // Step 12: Click Save Project Button
    console.log('\n💾 Step 12: Clicking Save Project button...');
    console.log(`   Target coordinates: (${guiMap["Save project button"].x}, ${guiMap["Save project button"].y})`);
    log(`Step 12: Saving project as .toproj...`);
    
    await mouse.move(new Point(guiMap["Save project button"].x, guiMap["Save project button"].y));
    console.log('   ✅ Mouse moved to Save Project button');
    await new Promise(r => setTimeout(r, 500));
    
    await mouse.leftClick();
    console.log('   ✅ Clicked Save Project button');
    
    // Wait for save dialog to open
    const saveDialogDelay = settings.delays.fileDialogOpen || 3000;
    console.log(`   ⏳ Waiting ${saveDialogDelay}ms for save dialog...`);
    await new Promise(r => setTimeout(r, saveDialogDelay));

    // Step 13: Type project file path (.toproj)
    console.log('\n📝 Step 13: Entering project file path...');
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
    console.log('\n💾 Step 13b: Clicking Save button for .toproj...');
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

    // Step 14: Click button to set path for .mp4 file
    console.log('\n📁 Step 14: Clicking path field for .mp4 file...');
    console.log(`   Target coordinates: (${guiMap["button to set path to save .mp4 file"].x}, ${guiMap["button to set path to save .mp4 file"].y})`);
    log(`Step 14: Setting output path for .mp4 file...`);
    
    await mouse.move(new Point(guiMap["button to set path to save .mp4 file"].x, guiMap["button to set path to save .mp4 file"].y));
    console.log('   ✅ Mouse moved to path field');
    await new Promise(r => setTimeout(r, 500));
    
    await mouse.leftClick();
    console.log('   ✅ Clicked path field');
    await new Promise(r => setTimeout(r, 800));

    // Step 14b: Type output video path (.mp4)
    console.log('\n📝 Step 14b: Entering output video path...');
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

    // Step 14c: Click Save button for .mp4 path
    console.log('\n💾 Step 14c: Clicking Save button for .mp4 path...');
    console.log(`   Target coordinates: (${guiMap["save button for saving .mp4 path"].x}, ${guiMap["save button for saving .mp4 path"].y})`);
    
    await mouse.move(new Point(guiMap["save button for saving .mp4 path"].x, guiMap["save button for saving .mp4 path"].y));
    console.log('   ✅ Mouse moved to Save button');
    await new Promise(r => setTimeout(r, 500));
    
    await mouse.leftClick();
    console.log('   ✅ Saved .mp4 path');
    console.log(`   ⏳ Waiting ${settings.delays.stepDelay}ms...`);
    await new Promise(r => setTimeout(r, settings.delays.stepDelay));

    // Step 14d: Click Export button to save .mp4 video file
    console.log('\n🎥 Step 14d: Clicking Export button to save .mp4 video...');
    console.log(`   Target coordinates: (${guiMap["export button to save .mp4 video file "].x}, ${guiMap["export button to save .mp4 video file "].y})`);
    log(`Step 14d: Starting MP4 export...`);
    
    await mouse.move(new Point(guiMap["export button to save .mp4 video file "].x, guiMap["export button to save .mp4 video file "].y));
    console.log('   ✅ Mouse moved to Export button');
    await new Promise(r => setTimeout(r, 500));
    
    await mouse.leftClick();
    console.log('   ✅ Started MP4 export!');
    console.log(`   ⏳ Waiting ${settings.delays.stepDelay}ms for export to begin...`);
    await new Promise(r => setTimeout(r, settings.delays.stepDelay));

    // Step 15: Wait for render to complete (NEW - File monitoring with stuck detection)
    console.log('\n⏱️  Step 15: Waiting for render to complete...');
    log(`Step 15: Monitoring render completion for ${cleanVideoName}...`);
    
    let renderResult = { success: false, duration: null };
    
    try {
      renderResult = await waitForRenderComplete(outputVideo, {
        timeout: settings.delays.renderTimeout || 7200000,
        checkInterval: settings.delays.renderCheckInterval || 60000,
        stabilityDuration: settings.delays.renderStabilityDuration || 60000,
        postRenderWait: settings.delays.postRenderMetadataWait || 180000,
        maxStuckChecks: settings.delays.maxStuckChecks || 10
      });
      
      if (renderResult.success) {
        console.log('   ✅ Render confirmed complete with valid duration!');
        log(`Render completed successfully: ${outputVideo}`);
      } else {
        console.log('   ⚠️  Render completed but duration check failed!');
        log(`Render completed but verification failed: ${outputVideo}`);
      }
    } catch (err) {
      // Render stuck or timed out
      console.log(`\n   ⚠️  Render monitoring error: ${err.message}`);
      log(`Render error: ${err.message}`);
      
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
            console.log(`   ⚠️  Will not mark as processed for manual review`);
            log(`Partial render saved (${sizeMB} MB): ${outputVideo}`);
          } else {
            console.log(`   ❌ File is 0 bytes - render completely failed`);
            console.log(`   🗑️  Removing empty file...`);
            fs.unlinkSync(outputVideo);
            log(`Render failed completely, file removed: ${cleanVideoName}`);
          }
        } else {
          console.log(`\n   ❌ No output file created - export never started`);
          log(`Export failed to start: ${cleanVideoName}`);
        }
      } else {
        // Other errors (timeout, etc)
        console.log('   ℹ️  Continuing with cleanup...');
      }
    }

    // Step 16: Verify processed video duration matches original
    console.log('\n🔍 Step 16: Verifying processed video...');
    let processedDuration = null;
    let processedSize = 0;
    let durationMatch = false;
    let sizeValidationPassed = false;
    
    if (fs.existsSync(outputVideo)) {
      try {
        const stats = fs.statSync(outputVideo);
        processedSize = stats.size;
        const sizeInMB = processedSize / (1024 * 1024);
        const sizeInGB = sizeInMB / 1024;
        const maxSizeGB = settingsConfig.maxFileSizeGB || 2; // Default to 2GB if not set
        
        console.log(`   📊 Processed video size: ${sizeInMB.toFixed(2)} MB (${sizeInGB.toFixed(2)} GB)`);
        console.log(`   ✅ Size validation: ${sizeInGB.toFixed(2)} GB < ${maxSizeGB} GB = ${sizeInGB < maxSizeGB}`);
        
        // Validate that the processed file is under max size
        sizeValidationPassed = sizeInGB < maxSizeGB;
        
        processedDuration = await getVideoDuration(outputVideo);
        if (processedDuration !== null) {
          console.log(`   ⏱️  Processed video duration: ${Math.floor(processedDuration / 60)}:${Math.floor(processedDuration % 60).toString().padStart(2, '0')}`);
        } else {
          console.log(`   ⏱️  Processed video duration: Unknown`);
        }
        
        // Check if durations match (allowing for small differences due to processing)
        if (originalDuration !== null && processedDuration !== null) {
          const durationDifference = Math.abs(originalDuration - processedDuration);
          durationMatch = durationDifference < 2; // Allow up to 2 seconds difference
          
          if (durationMatch) {
            console.log(`   ✅ Video durations match! Difference: ${durationDifference.toFixed(1)} seconds`);
          } else {
            console.log(`   ❌ Video durations don't match! Difference: ${durationDifference.toFixed(1)} seconds`);
          }
        } else {
          console.log(`   ⚠️  Could not verify duration match due to missing duration data`);
        }
        
        // Show compression percentage
        if (originalSize > 0 && processedSize > 0) {
          const compressionPercentage = ((originalSize - processedSize) / originalSize) * 100;
          console.log(`   📉 Compression: ${compressionPercentage.toFixed(1)}%`);
        }
      } catch (err) {
        console.log(`   ⚠️  Could not analyze processed video: ${err.message}`);
      }
    } else {
      console.log(`   ❌ Processed video file not found: ${outputVideo}`);
    }

    // NEW: Enhanced application closure and cache cleanup
    console.log('\n🧹 Step 17: Enhanced application closure and cache cleanup...');
    
    // Close Telemetry Overlay with new buttons
    await closeTelemetryEnhanced(guiMap);
    
    // Clear cache folder
    await clearTelemetryCache();
    
    // ONLY mark video as processed if render was successful AND durations match AND size is valid
    const processingSuccessful = renderResult.success && durationMatch && sizeValidationPassed;
    if (processingSuccessful) {
      const originalVideoName = path.basename(videoPath);
      markVideoAsProcessed(settings.inputFolder, originalVideoName);
      console.log('   ✅ Video marked as processed!');
      log(`✅ Successfully completed ${cleanVideoName}`);
    } else if (renderResult.success && durationMatch) {
      console.log('   ⚠️  Render successful and duration matched but size validation failed - will retry in next run');
      log(`⚠️  Render successful and duration matched but size validation failed for ${cleanVideoName}`);
    } else if (renderResult.success) {
      console.log('   ⚠️  Render successful but duration mismatch - will retry in next run');
      log(`⚠️  Render successful but duration mismatch for ${cleanVideoName}`);
    } else {
      console.log('   ⚠️  Render failed - will retry in next run');
      log(`⚠️  Render failed for ${cleanVideoName}`);
    }
    
    console.log('   ✅ Application closed and cache cleared!');

    // Only log completion if actually successful
    if (processingSuccessful) {
      log(`✅ Completed ${cleanVideoName}`);
    } else {
      log(`⚠️  Incomplete processing for ${cleanVideoName}`);
    }
  } catch (err) {
    log(`❌ Failed ${cleanVideoName}: ${err.message}`);
    
    // Ensure cleanup even on error
    console.log('\n⚠️  Error occurred, ensuring cleanup...');
    await killTelemetryProcesses();
    
    // Clear cache folder even on error
    await clearTelemetryCache();
    
    throw err; // Re-throw to be caught by index.js
  }
}

module.exports = { automateTelemetry };