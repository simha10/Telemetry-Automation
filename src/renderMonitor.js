const fs = require("fs");
const path = require("path");
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);
const settings = require("../config/settings.json");

/**
 * Checks if a video file has a valid duration
 * @param {string} videoPath - Path to the video file
 * @returns {Promise<number|null>} - Duration in seconds or null if invalid
 */
async function getVideoDuration(videoPath) {
  try {
    // Ensure the file exists before trying to check its duration
    if (!fs.existsSync(videoPath)) {
      console.log(`   ⚠️  Video file does not exist: ${videoPath}`);
      return null;
    }
    
    // Use ffprobe to get video information with better error handling
    const command = `ffprobe -v quiet -show_entries format=duration -of csv=p=0 "${videoPath}"`;
    console.log(`   🛠️  Executing: ${command}`);
    
    const { stdout, stderr } = await execPromise(command);
    const duration = parseFloat(stdout.trim());
    
    // If duration is a valid number and greater than 0
    if (!isNaN(duration) && duration > 0) {
      console.log(`   ✅ Video duration: ${duration.toFixed(2)} seconds`);
      return duration;
    } else {
      console.log(`   ⚠️  Invalid duration value: ${stdout.trim()}`);
      return null;
    }
  } catch (error) {
    console.log(`   ⚠️  Could not check video duration: ${error.message}`);
    console.log(`   🛠️  Stderr: ${error.stderr || 'No stderr'}`);
    return null;
  }
}

/**
 * Waits for a file to appear and its size to stabilize
 * This ensures the render is actually complete before proceeding
 * 
 * @param {string} outputPath - Full path to the expected output file
 * @param {object} options - Configuration options
 * @param {number} options.timeout - Maximum time to wait (default: 120 minutes)
 * @param {number} options.checkInterval - How often to check file size (default: 60000ms / 1 minute)
 * @param {number} options.stabilityDuration - How long size must be stable (default: 60000ms / 1 minute)
 * @param {number} options.postRenderWait - Post-completion metadata wait (default: 90000ms / 1.5 minutes)
 * @param {number} options.maxStuckChecks - Max consecutive checks with no change before declaring stuck (default: 10)
 * @returns {Promise<{success: boolean, duration: number|null}>}
 */
async function waitForRenderComplete(outputPath, options = {}) {
  const {
    timeout = 7200000,           // 120 minutes max wait (2 hours)
    checkInterval = 60000,       // Check every 1 minute
    stabilityDuration = 60000,   // Must be stable for 1 minute
    postRenderWait = 90000,     // 1.5 minutes post-completion for metadata
    maxStuckChecks = 10          // 10 minutes of no change = stuck
  } = options;

  console.log('\n🎬 Monitoring render completion...');
  console.log(`   Output file: ${path.basename(outputPath)}`);
  console.log(`   Max wait time: ${(timeout / 60000).toFixed(0)} minutes`);
  console.log(`   Check interval: Every ${checkInterval / 60000} minute(s)`);
  console.log(`   Stability requirement: ${stabilityDuration / 60000} minute(s) of no size changes`);
  console.log(`   Post-render metadata wait: ${postRenderWait / 60000} minutes`);
  console.log(`   Stuck detection: ${maxStuckChecks} consecutive checks with no change\n`);

  const startTime = Date.now();
  let lastSize = -1;
  let stableFor = 0;
  let fileFirstAppeared = false;
  let lastProgress = 0;
  let checksPerformed = 0;
  let lastCheckTime = startTime;
  let consecutiveNoChangeChecks = 0;
  let renderingStarted = false;

  return new Promise((resolve, reject) => {
    const checkInterval_id = setInterval(() => {
      const elapsed = Date.now() - startTime;
      checksPerformed++;

      // Check if timeout reached
      if (elapsed > timeout) {
        clearInterval(checkInterval_id);
        reject(new Error(`⏰ Render timeout: File did not stabilize within ${timeout / 60000} minutes`));
        return;
      }

      // Check if file exists
      if (!fs.existsSync(outputPath)) {
        if (fileFirstAppeared) {
          // File existed but now doesn't - something went wrong
          clearInterval(checkInterval_id);
          reject(new Error('❌ Output file disappeared during rendering'));
          return;
        }
        
        // File doesn't exist yet - still waiting
        const waitMinutes = Math.floor(elapsed / 60000);
        const waitSeconds = Math.floor((elapsed % 60000) / 1000);
        console.log(`   ⏳ Waiting for file to appear... ${waitMinutes}m ${waitSeconds}s elapsed (Check #${checksPerformed})`);
        
        // Check if export hasn't started for too long (more than 10 minutes)
        if (elapsed > 600000 && !fileFirstAppeared) {
          clearInterval(checkInterval_id);
          console.log(`\n   ⚠️  WARNING: File hasn't appeared after 10 minutes`);
          console.log(`   🔍 Possible issues:`);
          console.log(`      - Export button wasn't clicked properly`);
          console.log(`      - Application crashed or froze`);
          console.log(`      - Incorrect output path`);
          console.log(`\n   🛑 Attempting recovery...\n`);
          reject(new Error('Export stuck: Output file never appeared after 10 minutes'));
        }
        return;
      }

      // File exists - mark that we've seen it
      if (!fileFirstAppeared) {
        fileFirstAppeared = true;
        renderingStarted = true;
        console.log(`\n   ✅ Output file detected! Monitoring size every 1 minute...\n`);
        lastCheckTime = Date.now();
      }

      // Get current file size
      const stats = fs.statSync(outputPath);
      const currentSize = stats.size;
      const currentSizeMB = (currentSize / (1024 * 1024)).toFixed(2);
      const currentSizeGB = (currentSize / (1024 * 1024 * 1024)).toFixed(3);
      const timeSinceLastCheck = (Date.now() - lastCheckTime) / 1000;

      // Check if size changed from previous check
      if (currentSize !== lastSize) {
        // Size changed - reset stuck counter and stability counter
        consecutiveNoChangeChecks = 0;
        const sizeDifference = currentSize - lastSize;
        const sizeDifferenceMB = (sizeDifference / (1024 * 1024)).toFixed(2);
        
        // Display size with appropriate unit
        if (currentSize > 1024 * 1024 * 1024) {
          console.log(`   📊 Check #${checksPerformed} | Size: ${currentSizeGB} GB (${currentSizeMB} MB) | +${sizeDifferenceMB} MB since last check`);
        } else {
          console.log(`   📊 Check #${checksPerformed} | Size: ${currentSizeMB} MB | +${sizeDifferenceMB} MB since last check`);
        }
        console.log(`   ⏱️  Elapsed: ${Math.floor(elapsed / 60000)}m ${Math.floor((elapsed % 60000) / 1000)}s | Still rendering...\n`);
        
        lastSize = currentSize;
        stableFor = 0;
        lastCheckTime = Date.now();
      } else {
        // Size hasn't changed - increment both counters
        consecutiveNoChangeChecks++;
        stableFor += checkInterval;
        
        // Check if render is stuck (no change for too many consecutive checks)
        if (renderingStarted && consecutiveNoChangeChecks >= maxStuckChecks && stableFor < stabilityDuration) {
          clearInterval(checkInterval_id);
          
          const stuckDuration = (maxStuckChecks * checkInterval) / 60000;
          
          if (currentSize > 1024 * 1024 * 1024) {
            console.log(`\n   🚨 RENDER APPEARS STUCK!`);
            console.log(`   📊 File size: ${currentSizeGB} GB (${currentSizeMB} MB)`);
          } else {
            console.log(`\n   🚨 RENDER APPEARS STUCK!`);
            console.log(`   📊 File size: ${currentSizeMB} MB`);
          }
          
          console.log(`   ⏱️  No size change for ${stuckDuration.toFixed(0)} minutes (${consecutiveNoChangeChecks} consecutive checks)`);
          console.log(`   ⚠️  This is longer than normal rendering pause`);
          console.log(`\n   🔍 Possible issues:`);
          console.log(`      - Application froze or crashed`);
          console.log(`      - Render process hung`);
          console.log(`      - Insufficient disk space`);
          console.log(`      - System resources exhausted`);
          console.log(`\n   🛑 Attempting recovery...\n`);
          
          reject(new Error(`Render stuck: No file size change for ${stuckDuration.toFixed(0)} minutes`));
          return;
        }
        
        const remainingStability = Math.max(0, (stabilityDuration - stableFor) / 60000);
        
        // Show appropriate size unit
        if (currentSize > 1024 * 1024 * 1024) {
          console.log(`   ⏸️  Check #${checksPerformed} | File stable at ${currentSizeGB} GB (${currentSizeMB} MB)`);
        } else {
          console.log(`   ⏸️  Check #${checksPerformed} | File stable at ${currentSizeMB} MB`);
        }
        
        // Additional validation: Check if file size is reasonable for a video
        if (currentSize > 0 && currentSize < 1024 * 1024) { // Less than 1MB
          console.log(`   ⚠️  Warning: File size is unusually small for a video (${currentSizeMB} MB)`);
        } else if (currentSize > settings.maxFileSizeGB * 1024 * 1024 * 1024) { // Greater than max size
          console.log(`   ⚠️  Warning: File size exceeds ${settings.maxFileSizeGB}GB limit (${currentSizeGB} GB)`);
        }
        
        if (consecutiveNoChangeChecks < maxStuckChecks) {
          console.log(`   🔍 No size change detected | Confirming stability: ${remainingStability.toFixed(1)} minute(s) remaining`);
          console.log(`   ℹ️  Consecutive stable checks: ${consecutiveNoChangeChecks}/${maxStuckChecks} (stuck threshold)\n`);
        } else {
          console.log(`   🔍 No size change for ${consecutiveNoChangeChecks} checks | Confirming stability: ${remainingStability.toFixed(1)} minute(s) remaining\n`);
        }

        // Check if we've been stable long enough (normal completion)
        if (stableFor >= stabilityDuration) {
          clearInterval(checkInterval_id);
          
          // Final size report
          console.log(`   ✅ File size stable for ${stabilityDuration / 60000} minute(s)!`);
          if (currentSize > 1024 * 1024 * 1024) {
            console.log(`   📦 Final render size: ${currentSizeGB} GB (${currentSizeMB} MB)`);
          } else {
            console.log(`   📦 Final render size: ${currentSizeMB} MB`);
          }
          console.log(`   ⏱️  Total render time: ${Math.floor(elapsed / 60000)}m ${Math.floor((elapsed % 60000) / 1000)}s`);
          
          // Validate final file size
          if (currentSize > settings.maxFileSizeGB * 1024 * 1024 * 1024) { // Greater than max size
            console.log(`   ⚠️  Final file size exceeds ${settings.maxFileSizeGB}GB limit (${currentSizeGB} GB)`);
            console.log(`   ❌ Video processing failed due to oversized output`);
            resolve({ success: false, duration: null });
            return;
          } else if (currentSize > 0 && currentSize < 1024 * 1024) { // Less than 1MB
            console.log(`   ⚠️  Final file size is unusually small for a video (${currentSizeMB} MB)`);
            console.log(`   ❌ Video processing likely failed due to small output size`);
            resolve({ success: false, duration: null });
            return;
          }
          
          // NOW WAIT 3 MINUTES FOR METADATA FINALIZATION AND CHECK DURATION
          console.log(`\n   🔧 Waiting ${postRenderWait / 60000} minutes for metadata finalization and duration check...`);
          console.log(`   ℹ️  During this time, we'll check if the video has a valid duration\n`);
          
          setTimeout(async () => {
            // Check video duration to confirm successful render
            console.log(`\n   🔍 Checking video duration during metadata finalization...`);
            const duration = await getVideoDuration(outputPath);
            
            if (duration !== null) {
              const formattedDuration = formatDuration(duration);
              console.log(`   ✅ Video duration verified: ${formattedDuration}! Render successful.`);
              console.log(`   🎉 Video is ready: ${path.basename(outputPath)}\n`);
              resolve({ success: true, duration: duration });
            } else {
              console.log(`   ⚠️  Video duration check failed or video is incomplete.`);
              console.log(`   ℹ️  Will not mark as processed and continue to next video...\n`);
              resolve({ success: false, duration: null });
            }
          }, postRenderWait);
        }
      }
    }, checkInterval);

    // Handle cleanup on process termination
    process.on('SIGINT', () => {
      clearInterval(checkInterval_id);
      reject(new Error('Process interrupted by user'));
    });
  });
}

/**
 * Format duration in seconds to HH:MM:SS format
 * @param {number} seconds - Duration in seconds
 * @returns {string} Formatted duration
 */
function formatDuration(seconds) {
  if (seconds === null) return 'Unknown';
  
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  } else {
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
}

/**
 * Forcefully kills all Telemetry Overlay processes
 * More reliable than Alt+F4 for ensuring cleanup
 */
async function killTelemetryProcesses() {
  const { exec } = require("child_process");
  
  return new Promise((resolve) => {
    console.log('\n🛑 Killing Telemetry Overlay processes...');
    
    exec('taskkill /IM TelemetryOverlay.exe /F', (err, stdout, stderr) => {
      if (err) {
        // Process might not be running - that's okay
        if (err.message.includes('not found')) {
          console.log('   ℹ️  No processes found (already closed)');
        } else {
          console.log(`   ⚠️  taskkill warning: ${err.message}`);
        }
      } else {
        console.log('   ✅ Processes terminated successfully');
      }
      
      // Wait a bit for processes to fully terminate
      setTimeout(resolve, 2000);
    });
  });
}

module.exports = {
  waitForRenderComplete,
  killTelemetryProcesses,
  getVideoDuration,
  formatDuration
};