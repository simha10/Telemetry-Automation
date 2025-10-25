const fs = require("fs");
const path = require("path");

const logFile = path.join(__dirname, "../logs/automation.log");

function log(msg) {
  const time = new Date().toISOString();
  fs.appendFileSync(logFile, `[${time}] ${msg}\n`);
  console.log(msg);
}

module.exports = { log };
