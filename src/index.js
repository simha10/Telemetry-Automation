const fs = require("fs");
const path = require("path");
const readline = require("readline");
const { getAllVideos } = require("./fileUtils");
const { automateTelemetry } = require("./telemetryAutomation");

const settings = require("../config/settings.json");
const guiMap = require("../config/guiMap.json");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

(async () => {
  console.log('\n🎯 Telemetry Automation - Direct Path Input\n');
  console.log('='.repeat(60));
  
  // Ask for input folder directly
  console.log('\n📂 Input Folder Configuration:');
  const inputFolder = await askQuestion(`   Enter input folder path (or press Enter for default: ${settings.inputFolder}): `);
  const finalInputFolder = inputFolder.trim() !== '' ? inputFolder.trim().replace(/"/g, '') : settings.inputFolder;
  
  // Ask for output folder directly
  console.log('\n📂 Output Folder Configuration:');
  const outputFolder = await askQuestion(`   Enter output folder path (or press Enter for default: ${settings.outputFolder}): `);
  const finalOutputFolder = outputFolder.trim() !== '' ? outputFolder.trim().replace(/"/g, '') : settings.outputFolder;
  
  console.log('\n' + '='.repeat(60));
  console.log('\n✅ Configuration Summary:');
  console.log(`   Input:     ${finalInputFolder}`);
  console.log(`   Output:    ${finalOutputFolder}`);
  
  // Verify folders exist
  if (!fs.existsSync(finalInputFolder)) {
    console.log(`\n❌ Input folder does not exist: ${finalInputFolder}`);
    rl.close();
    return;
  }
  
  if (!fs.existsSync(finalOutputFolder)) {
    console.log(`\n⚠️  Output folder does not exist. Creating...`);
    fs.mkdirSync(finalOutputFolder, { recursive: true });
    console.log(`✅ Created: ${finalOutputFolder}`);
  }
  
  const proceed = await askQuestion('\n🚀 Start automation? (y/n): ');
  if (proceed.toLowerCase() !== 'y' && proceed.toLowerCase() !== 'yes') {
    console.log('\n❌ Automation cancelled.');
    rl.close();
    return;
  }
  
  rl.close();
  
  console.log('\n' + '='.repeat(60));
  console.log('\n🎬 Starting Automation...\n');
  
  // Update settings with user inputs
  const runtimeSettings = {
    ...settings,
    inputFolder: finalInputFolder,
    outputFolder: finalOutputFolder
  };
  
  let processedCount = 0;
  let failedCount = 0;
  
  // Load or create processed videos tracking file
  const processedTrackingFile = path.join(finalInputFolder, '.processed_videos.json');
  let processedVideos = [];
  
  if (fs.existsSync(processedTrackingFile)) {
    try {
      processedVideos = JSON.parse(fs.readFileSync(processedTrackingFile, 'utf8'));
      console.log(`📝 Loaded tracking file: ${processedVideos.length} videos already processed`);
    } catch (err) {
      console.log(`⚠️  Could not read tracking file, starting fresh`);
      processedVideos = [];
    }
  }
  
  // Process videos one by one
  while (true) {
    const allVideos = getAllVideos(finalInputFolder);
    
    // Filter out already processed videos
    const videos = allVideos.filter(videoPath => {
      const videoName = path.basename(videoPath);
      return !processedVideos.includes(videoName);
    });
    
    if (videos.length === 0) {
      console.log('\n✅ No more videos to process!');
      if (allVideos.length > processedVideos.length) {
        console.log(`   (${allVideos.length - processedVideos.length} videos were already processed)`);
      }
      break;
    }
    
    // Always take the FIRST unprocessed video
    const videoPath = videos[0];
    const videoName = path.basename(videoPath);
    
    console.log(`\n${'='.repeat(60)}`);
    console.log(`📹 Processing: ${videoName}`);
    console.log(`   (${videos.length} unprocessed videos remaining)`);
    console.log('='.repeat(60));
    
    try {
      // Process the video
      await automateTelemetry(videoPath, null, runtimeSettings, guiMap);
      
      console.log(`\n✅ Automation completed for ${videoName}`);
      console.log(`   🎥 Rendering in progress... Output will be saved to: ${finalOutputFolder}`);
      console.log(`   💾 Original video remains in input folder for rendering`);
      
      // Add to processed list ONLY for successfully processed videos
      processedVideos.push(videoName);
      fs.writeFileSync(processedTrackingFile, JSON.stringify(processedVideos, null, 2));
      console.log(`   ✅ Marked as processed in tracking file`);
      
      processedCount++;
      
    } catch (err) {
      console.log(`\n❌ Error processing ${videoName}: ${err.message}`);
      console.log(`⚠️  Moving to next video...`);
      
      // Do NOT add to processed list for failed videos - they can be retried
      console.log(`   ⚠️  Video failed - will be retried in next run`);
      
      failedCount++;
    }
    
    // Small delay before next video
    await new Promise(r => setTimeout(r, 2000));
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('\n🎉 Automation Complete!\n');
  console.log(`   ✅ Successfully processed: ${processedCount} videos`);
  if (failedCount > 0) {
    console.log(`   ❌ Failed: ${failedCount} videos`);
  }
  console.log(`\n📁 Results will be saved to: ${finalOutputFolder}`);
  console.log(`📁 Source videos remain in: ${finalInputFolder}`);
  console.log(`\n📝 Tracking file: ${processedTrackingFile}`);
  console.log(`   (Delete this file to reprocess all videos)`);
  console.log('\n' + '='.repeat(60) + '\n');
})();
