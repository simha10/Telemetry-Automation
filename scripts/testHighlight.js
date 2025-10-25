const { screen, Region } = require("@nut-tree-fork/nut-js");
const fs = require("fs");
const path = require("path");

(async () => {
  const guiMapPath = path.join(__dirname, "../config/guiMap.json");
  
  if (!fs.existsSync(guiMapPath)) {
    console.log("❌ guiMap.json not found. Run tracker.js first to create coordinates.");
    process.exit(1);
  }

  const guiMap = JSON.parse(fs.readFileSync(guiMapPath, "utf8"));
  console.log("🧪 Testing coordinates...\n");

  for (const [label, { x, y }] of Object.entries(guiMap)) {
    console.log(`Highlighting [${label}] → (${x}, ${y})`);
    try {
      await screen.highlight(new Region(x - 25, y - 25, 50, 50));
      await new Promise(r => setTimeout(r, 1000));
    } catch (err) {
      console.log(`⚠️  Could not highlight ${label}: ${err.message}`);
    }
  }

  console.log("\n✅ Done!");
})();
