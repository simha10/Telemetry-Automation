const fs = require("fs");
const path = require("path");
const readline = require("readline");
const { getAllVideos, moveToProcessed } = require("./fileUtils");
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
  console.log('\n🎯 Telemetry Automation - Interactive Setup\n');
  console.log('='.repeat(60));
  
  // Ask for input folder
  console.log('\n📂 Input Folder Configuration:');
  console.log(`   Current: ${settings.inputFolder}`);
  const useDefaultInput = await askQuestion('   Use this path? (y/n): ');
  
  let inputFolder = settings.inputFolder;
  if (useDefaultInput.toLowerCase() !== 'y') {
    inputFolder = await askQuestion('   Enter input folder path: ');
    // Remove quotes if user copied path with quotes
    inputFolder = inputFolder.replace(/"/g, '');
  }
  
  // Ask for output folder
  console.log('\n📂 Output Folder Configuration:');
  console.log(`   Current: ${settings.outputFolder}`);
  const useDefaultOutput = await askQuestion('   Use this path? (y/n): ');
  
  let outputFolder = settings.outputFolder;
  if (useDefaultOutput.toLowerCase() !== 'y') {
    outputFolder = await askQuestion('   Enter output folder path: ');
    outputFolder = outputFolder.replace(/"/g, '');
  }
  
  // Ask for processed folder
  console.log('\n📂 Processed Videos Folder Configuration:');
  const defaultProcessedFolder = path.join(inputFolder, 'Processed');
  console.log(`   Default: ${defaultProcessedFolder}`);
  const useDefaultProcessed = await askQuestion('   Use this path? (y/n): ');
  
  let processedFolder;
  if (useDefaultProcessed.toLowerCase() !== 'y') {
    processedFolder = await askQuestion('   Enter processed folder path: ');
    processedFolder = processedFolder.replace(/"/g, '');
  } else {
    processedFolder = defaultProcessedFolder;
  }
  
  // Ask for pattern file
  console.log('\n📂 Pattern File Configuration:');
  console.log(`   Current: ${settings.patternFile}`);
  const useDefaultPattern = await askQuestion('   Use this path? (y/n): ');
  
  let patternFile = settings.patternFile;
  if (useDefaultPattern.toLowerCase() !== 'y') {
    patternFile = await askQuestion('   Enter pattern file path: ');
    patternFile = patternFile.replace(/"/g, '');
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('\n✅ Configuration Summary:');
  console.log(`   Input:     ${inputFolder}`);
  console.log(`   Output:    ${outputFolder}`);
  console.log(`   Processed: ${processedFolder}`);
  console.log(`   Pattern:   ${patternFile}`);
  
  // Create processed folder
  if (!fs.existsSync(processedFolder)) {
    fs.mkdirSync(processedFolder, { recursive: true });
    console.log(`\n📁 Created Processed folder: ${processedFolder}`);
  }
  
  // Verify folders exist
  if (!fs.existsSync(inputFolder)) {
    console.log(`\n❌ Input folder does not exist: ${inputFolder}`);
    rl.close();
    return;
  }
  
  if (!fs.existsSync(outputFolder)) {
    console.log(`\n⚠️  Output folder does not exist. Creating...`);
    fs.mkdirSync(outputFolder, { recursive: true });
    console.log(`✅ Created: ${outputFolder}`);
  }
  
  if (!fs.existsSync(patternFile)) {
    console.log(`\n❌ Pattern file does not exist: ${patternFile}`);
    rl.close();
    return;
  }
  
  const proceed = await askQuestion('\n🚀 Start automation? (y/n): ');
  if (proceed.toLowerCase() !== 'y') {
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
    inputFolder,
    outputFolder,
    patternFile
  };
  
  let processedCount = 0;
  let failedCount = 0;
  
  // Process videos one by one
  while (true) {
    const videos = getAllVideos(inputFolder);
    
    if (videos.length === 0) {
      console.log('\n✅ No more videos to process!');
      break;
    }
    
    // Always take the FIRST video
    const videoPath = videos[0];
    const videoName = path.basename(videoPath);
    
    console.log(`\n${'='.repeat(60)}`);
    console.log(`📹 Processing: ${videoName}`);
    console.log(`   (${videos.length} videos remaining)`);
    console.log('='.repeat(60));
    
    try {
      // Process the video
      await automateTelemetry(videoPath, patternFile, runtimeSettings, guiMap);
      
      // Move to Processed folder
      console.log(`\n📦 Moving ${videoName} to Processed folder...`);
      moveToProcessed(inputFolder, processedFolder, videoName);
      console.log(`✅ Moved successfully!`);
      
      processedCount++;
      
    } catch (err) {
      console.log(`\n❌ Error processing ${videoName}: ${err.message}`);
      console.log(`⚠️  Skipping this video...`);
      
      // Move failed video to a "Failed" folder
      const failedFolder = path.join(inputFolder, 'Failed');
      if (!fs.existsSync(failedFolder)) {
        fs.mkdirSync(failedFolder, { recursive: true });
      }
      moveToProcessed(inputFolder, failedFolder, videoName);
      
      failedCount++;
    }
    
    // Small delay before next video
    await new Promise(r => setTimeout(r, 2000));
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('\n🎉 Automation Complete!\n');
  console.log(`   ✅ Successfully processed: ${processedCount} videos`);
  if (failedCount > 0) {
    console.log(`   ❌ Failed: ${failedCount} videos (check Failed folder)`);
  }
  console.log(`\n📁 Results saved to: ${outputFolder}`);
  console.log(`📁 Processed videos moved to: ${processedFolder}`);
  if (failedCount > 0) {
    const failedFolder = path.join(inputFolder, 'Failed');
    console.log(`📁 Failed videos in: ${failedFolder}`);
  }
  console.log('\n' + '='.repeat(60) + '\n');
})();
