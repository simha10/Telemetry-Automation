const fs = require("fs");
const path = require("path");
const settings = require("../config/settings.json");

function getAllVideos(inputFolder) {
  return fs.readdirSync(inputFolder)
    .filter(file => {
      // Skip files that are already processed (have 'processed_' prefix)
      if (file.startsWith("processed_")) {
        return false;
      }
      
      // Only include .mp4 files that are under 2GB
      if (!file.toLowerCase().endsWith(".mp4")) {
        return false;
      }
      
      try {
        const filePath = path.join(inputFolder, file);
        const stats = fs.statSync(filePath);
        const sizeInGB = stats.size / (1024 * 1024 * 1024); // Convert bytes to GB
        const sizeInMB = stats.size / (1024 * 1024); // Convert bytes to MB
        const maxSizeGB = settings.maxFileSizeGB || 2; // Default to 2GB if not set
        console.log(`   📊 Checking ${file}: ${sizeInMB.toFixed(2)} MB (${sizeInGB.toFixed(2)} GB)`);
        console.log(`   ✅ Size validation: ${sizeInGB.toFixed(2)} GB < ${maxSizeGB} GB = ${sizeInGB < maxSizeGB}`);
        return sizeInGB < maxSizeGB; // Only include files under max size
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