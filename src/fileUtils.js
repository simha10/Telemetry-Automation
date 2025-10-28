const fs = require("fs");
const path = require("path");

function getAllVideos(inputFolder) {
  return fs.readdirSync(inputFolder)
    .filter(file => {
      // Only include .mp4 files that are under 1GB
      if (!file.toLowerCase().endsWith(".mp4")) {
        return false;
      }
      
      try {
        const filePath = path.join(inputFolder, file);
        const stats = fs.statSync(filePath);
        const sizeInGB = stats.size / (1024 * 1024 * 1024);
        return sizeInGB < 1; // Only include files under 1GB
      } catch (err) {
        console.log(`⚠️  Could not determine size for ${file}, skipping`);
        return false;
      }
    })
    .map(file => path.join(inputFolder, file));
}

function markVideoAsProcessed(inputFolder, videoName) {
  try {
    const originalPath = path.join(inputFolder, videoName);
    // Add "processed_" prefix instead of ".processed" suffix
    const processedName = videoName.startsWith('processed_') ? videoName : `processed_${videoName}`;
    const processedPath = path.join(inputFolder, processedName);
    
    if (fs.existsSync(originalPath)) {
      fs.renameSync(originalPath, processedPath);
      console.log(`   ✅ Renamed ${videoName} to ${processedName}`);
    }
  } catch (err) {
    console.log(`   ⚠️  Could not rename ${videoName}: ${err.message}`);
  }
}

module.exports = { getAllVideos, markVideoAsProcessed };