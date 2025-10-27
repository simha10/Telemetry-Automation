const fs = require("fs");
const path = require("path");

function getAllVideos(inputFolder) {
  return fs.readdirSync(inputFolder)
    .filter(file => file.toLowerCase().endsWith(".mp4"))  // Case-insensitive
    .map(file => path.join(inputFolder, file));
}

module.exports = { getAllVideos };
