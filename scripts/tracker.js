const fs = require("fs");
const path = require("path");
const readline = require("readline");
const { mouse } = require("@nut-tree-fork/nut-js");

const guiMapPath = path.join(__dirname, "../config/guiMap.json");
let guiMap = fs.existsSync(guiMapPath)
  ? JSON.parse(fs.readFileSync(guiMapPath, "utf8"))
  : {};

console.log("🚀 Coordinate Tracker Started!");
console.log("Hover over a button, enter label name, press Enter.\n");
console.log("Commands:");
console.log("  - Type a label name and press Enter to save current mouse position");
console.log("  - Type 'list' to see all saved coordinates");
console.log("  - Type 'exit' or Ctrl+C to quit\n");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function capture(label) {
  const pos = await mouse.getPosition();
  guiMap[label] = { x: pos.x, y: pos.y };
  fs.writeFileSync(guiMapPath, JSON.stringify(guiMap, null, 2));
  console.log(`✅ Saved [${label}] → X:${pos.x}, Y:${pos.y}\n`);
}

function listCoordinates() {
  console.log("\n📍 Saved Coordinates:");
  Object.entries(guiMap).forEach(([label, { x, y }]) => {
    console.log(`  ${label}: (${x}, ${y})`);
  });
  console.log();
}

(async () => {
  while (true) {
    const label = await new Promise((r) => rl.question("🎯 Label (or 'list'/'exit'): ", r));
    
    if (label.toLowerCase() === "exit") {
      console.log("👋 Exiting...");
      process.exit(0);
    }
    
    if (label.toLowerCase() === "list") {
      listCoordinates();
      continue;
    }
    
    if (label.trim()) {
      await capture(label);
    }
  }
})();
