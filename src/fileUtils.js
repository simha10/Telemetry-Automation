const fs = require("fs");
const path = require("path");

function getAllVideos(inputFolder) {
  return fs.readdirSync(inputFolder)
    .filter(file => file.toLowerCase().endsWith(".mp4"))  // Case-insensitive
    .map(file => path.join(inputFolder, file));
}

function moveToProcessed(sourceFolder, targetFolder, fileName) {
  const sourcePath = path.join(sourceFolder, fileName);
  const targetPath = path.join(targetFolder, fileName);
  
  // Ensure target folder exists
  if (!fs.existsSync(targetFolder)) {
    fs.mkdirSync(targetFolder, { recursive: true });
  }
  
  // Move the file
  fs.renameSync(sourcePath, targetPath);
}

module.exports = { getAllVideos, moveToProcessed };
