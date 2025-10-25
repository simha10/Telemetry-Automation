⚙️ Telemetry Automation Environment Setup (Node.js + nut.js)
🧠 Overview

This guide automates GoPro Telemetry Extractor using JavaScript (Node.js) GUI automation.
It performs these steps automatically:

Opens Telemetry Extractor

Uploads the MP4 video

Loads the pattern file

Sets export options to 0

Mutes the video

Saves project (.toproj)

Exports video (.mp4)

🏗️ Project Structure
telemetry-automation/
│
├── package.json
├── config/
│   ├── settings.json
│   └── guiMap.json
│
├── src/
│   ├── index.js
│   ├── telemetryAutomation.js
│   ├── fileUtils.js
│   └── logger.js
│
├── scripts/
│   ├── tracker.js
│   └── testHighlight.js
│
├── input_videos/
│   └── pattern.topattern
├── processed/
├── logs/
└── SETUP.md

🧩 1. Prerequisites
Tool	Purpose	Install Command / Link
Windows 10/11	OS required	—
Node.js v18+	Runtime environment	https://nodejs.org/en/download

npm (latest)	Package manager	npm install -g npm@latest
Git for Windows	Needed for GitHub installs	https://git-scm.com/download/win

Telemetry Extractor	The target GUI app	https://goprotelemetryextractor.com/

VS Code (optional)	Editor	https://code.visualstudio.com/
⚙️ 2. Setup Commands
🪜 Step 1 — Create the project folder
mkdir "E:\Telemetry Automation"
cd "E:\Telemetry Automation"
npm init -y

🪜 Step 2 — Fix npm registry & update npm
npm config set registry https://registry.npmjs.org/
npm install -g npm@latest

🪜 Step 3 — Install Git (if not already)

Download & install → https://git-scm.com/download/win

Then check:

git --version

🪜 Step 4 — Install dependencies
npm install git+https://github.com/nut-tree/nut.js.git#v2.5.0
npm install @nut-tree/plugin-opencv @nut-tree/template-matcher

🪜 Step 5 — Install OpenCV runtime

Download from https://github.com/opencv/opencv/releases

Extract it (e.g., C:\opencv)

Add the folder containing .dll files (like C:\opencv\build\x64\vc15\bin) to your PATH

⚙️ 3. Configuration Files
config/settings.json
{
  "inputFolder": "./input_videos",
  "outputFolder": "./processed",
  "patternFile": "pattern.topattern",
  "appPath": "C:/Program Files/TelemetryExtractor/TelemetryExtractor.exe",
  "delayBetweenActionsMs": 1500
}

config/guiMap.json

Generated automatically when you run the coordinate tracker:

{
  "uploadBtn": { "x": 430, "y": 210 },
  "loadPatternBtn": { "x": 470, "y": 260 },
  "muteCheckbox": { "x": 520, "y": 480 },
  "saveProjectBtn": { "x": 560, "y": 520 },
  "exportVideoBtn": { "x": 600, "y": 550 }
}

🖱️ 4. Coordinate Tracker
scripts/tracker.js
const fs = require("fs");
const path = require("path");
const readline = require("readline");
const { mouse } = require("@nut-tree/nut-js");

const guiMapPath = path.join(__dirname, "../config/guiMap.json");
let guiMap = fs.existsSync(guiMapPath)
  ? JSON.parse(fs.readFileSync(guiMapPath, "utf8"))
  : {};

console.log("🚀 Coordinate Tracker Started!");
console.log("Hover over a button, enter label name, press Enter.\n");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function capture(label) {
  const pos = await mouse.getPosition();
  guiMap[label] = { x: pos.x, y: pos.y };
  fs.writeFileSync(guiMapPath, JSON.stringify(guiMap, null, 2));
  console.log(`✅ Saved [${label}] → X:${pos.x}, Y:${pos.y}`);
}

(async () => {
  while (true) {
    const label = await new Promise((r) => rl.question("🎯 Label: ", r));
    await capture(label);
  }
})();

Run it
node scripts/tracker.js

🧪 5. Test Highlight Script
scripts/testHighlight.js
const { screen, Region } = require("@nut-tree/nut-js");
const fs = require("fs");
const path = require("path");

(async () => {
  const guiMap = JSON.parse(fs.readFileSync(path.join(__dirname, "../config/guiMap.json")));
  console.log("🧪 Testing coordinates...");

  for (const [label, { x, y }] of Object.entries(guiMap)) {
    console.log(`Highlighting [${label}] → (${x},${y})`);
    await screen.highlight(new Region(x, y, 50, 50));
  }

  console.log("✅ Done!");
})();

Run it
node scripts/testHighlight.js

🧾 6. File Utilities
src/fileUtils.js
const fs = require("fs");
const path = require("path");

function getVideoFiles(folder) {
  return fs.readdirSync(folder).filter(f => f.endsWith(".mp4"));
}

function moveToProcessed(input, output, file) {
  const src = path.join(input, file);
  const dest = path.join(output, file);
  fs.renameSync(src, dest);
}

module.exports = { getVideoFiles, moveToProcessed };

📜 7. Logger
src/logger.js
const fs = require("fs");
const path = require("path");
const logFile = path.join(__dirname, "../logs/automation.log");

function log(msg) {
  const time = new Date().toISOString();
  fs.appendFileSync(logFile, `[${time}] ${msg}\n`);
  console.log(msg);
}

module.exports = { log };

🤖 8. Main Automation Script
src/telemetryAutomation.js
const { mouse, keyboard, Button } = require("@nut-tree/nut-js");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const { log } = require("./logger");
const { getVideoFiles, moveToProcessed } = require("./fileUtils");
const settings = require("../config/settings.json");
const guiMap = require("../config/guiMap.json");

mouse.config.autoDelayMs = 200;

async function clickAt(label) {
  const { x, y } = guiMap[label];
  await mouse.move([{ x, y }]);
  await mouse.click(Button.LEFT);
  await new Promise(r => setTimeout(r, settings.delayBetweenActionsMs));
}

async function runAutomation() {
  log("🚀 Starting Telemetry Automation");
  exec(`"${settings.appPath}"`);
  await new Promise(r => setTimeout(r, 5000));

  const videos = getVideoFiles(settings.inputFolder);

  for (const video of videos) {
    const videoPath = path.join(settings.inputFolder, video);
    const patternPath = path.join(settings.inputFolder, settings.patternFile);
    const exportBase = path.join(settings.outputFolder, path.parse(video).name);

    await clickAt("uploadBtn");
    await keyboard.type(videoPath);
    await keyboard.pressKey("enter");

    await clickAt("loadPatternBtn");
    await keyboard.type(patternPath);
    await keyboard.pressKey("enter");

    await clickAt("exportOptionsBtn");
    await keyboard.type("0{Tab}0{Tab}0");
    await clickAt("muteCheckbox");

    await clickAt("saveProjectBtn");
    await keyboard.type(`${exportBase}.toproj`);
    await keyboard.pressKey("enter");

    await clickAt("exportVideoBtn");
    await keyboard.type(`${exportBase}.mp4`);
    await keyboard.pressKey("enter");

    moveToProcessed(settings.inputFolder, settings.outputFolder, video);
    log(`✅ Processed: ${video}`);
  }

  log("🏁 Automation complete!");
}

module.exports = { runAutomation };

🚀 9. Main Launcher
src/index.js
const { runAutomation } = require("./telemetryAutomation");

(async () => {
  await runAutomation();
})();

🧪 10. Run the Automation
Step 1 — Place videos
input_videos/
 ├── race1.mp4
 ├── race2.mp4
 └── pattern.topattern

Step 2 — Run
node src/index.js


You’ll see Telemetry Extractor launch and process videos automatically.
Logs appear under logs/automation.log.

✅ 12. Verification

Check if nut.js is functional:

node -e "const {mouse}=require('@nut-tree/nut-js');(async()=>console.log(await mouse.getPosition()))()"


You should see your current mouse coordinates → success 🎉

🌟 13. Next Steps

Add retry & logging layers

Integrate with n8n for folder-watch triggers

Auto-upload results to Google Drive / S3

Use screenshot matching for more robust automation