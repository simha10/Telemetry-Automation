# Telemetry Automation

Automated video processing tool using Telemetry Overlay application with GUI automation.

## Project Status ✅

All dependencies installed and configured. Ready to proceed with implementation.

## What's Working

- ✅ All npm dependencies installed (`@nut-tree-fork/nut-js`, `fs-extra`, `winston`, `dotenv`, `jest`)
- ✅ Project structure created
- ✅ Configuration files ready
- ✅ Helper scripts for coordinate tracking
- ✅ Core automation framework implemented

## Quick Start

### 1. Configure Settings

Edit `config/settings.json` with your actual paths:

```json
{
  "exePath": "C:\\Program Files\\TelemetryOverlay\\TelemetryOverlay.exe",
  "inputFolder": "E:\\Videos\\Input",
  "outputFolder": "E:\\Videos\\Output",
  "patternFile": "E:\\Patterns\\default.pattern",
  "logFile": "logs/automation.log",
  "delays": {
    "appLoad": 3000,
    "stepDelay": 1000
  }
}
```

### 2. Calibrate GUI Coordinates

The automation requires exact pixel coordinates of buttons in the Telemetry Overlay app:

```bash
# Run the coordinate tracker
node scripts/tracker.js
```

**Steps:**
1. Launch Telemetry Overlay app
2. Hover your mouse over each button
3. Type a label name in the tracker console
4. Press Enter to save coordinates
5. Repeat for all buttons

**Required coordinates:**
- `loadVideoButton`
- `patternsButton`
- `loadPatternButton`
- `exportButton`
- `muteToggle`
- `saveProjectButton`
- `finalExportButton`

### 3. Test Coordinates

Verify all coordinates are correct:

```bash
node scripts/testHighlight.js
```

This will highlight each saved coordinate on screen.

### 4. Prepare Folders

Create the required directories:

```bash
mkdir logs
mkdir "E:\Videos\Input"
mkdir "E:\Videos\Output"
mkdir "E:\Patterns"
```

### 5. Run Automation

```bash
npm start
```

## Project Structure

```
e:\Telemetry Automation\
├── config/
│   ├── settings.json       # Main configuration
│   └── guiMap.json         # GUI button coordinates
├── scripts/
│   ├── tracker.js          # Coordinate tracking tool
│   └── testHighlight.js    # Coordinate verification tool
├── src/
│   ├── index.js            # Main entry point
│   ├── telemetryAutomation.js  # Core automation logic
│   ├── fileUtils.js        # File operations
│   └── logger.js           # Logging utility
├── logs/                   # Automation logs
├── package.json
├── jest.config.js         # Test configuration
├── .env.example           # Environment template
├── .gitignore
└── Setup.md               # Detailed setup guide
```

## How It Works

1. **Scans** `inputFolder` for `.mp4` videos
2. **Launches** Telemetry Overlay application
3. For each video:
   - Loads the video file
   - Applies the pattern file
   - Configures export settings (0,0,0)
   - Mutes audio
   - Saves project as `.toproj`
   - Exports processed video
4. **Logs** all operations to `logs/automation.log`

## Important Notes

⚠️ **During Automation:**
- Do NOT move your mouse
- Keep Telemetry Overlay window in focus
- Ensure app is in consistent state (maximized/windowed)

⚠️ **Before Running:**
- Install Telemetry Overlay application
- Calibrate GUI coordinates for your screen resolution
- Test coordinates with `testHighlight.js`
- Place input videos in the designated folder

## Troubleshooting

### Issue: Clicks in wrong positions
**Solution:** Recalibrate coordinates using `tracker.js`

### Issue: Timing errors
**Solution:** Increase delay values in `settings.json`

### Issue: App doesn't launch
**Solution:** Verify `exePath` points to correct executable

### Issue: No videos found
**Solution:** Check `inputFolder` path and ensure `.mp4` files exist

## Next Steps

1. **Install Telemetry Overlay** (if not already installed)
2. **Configure settings.json** with your actual paths
3. **Run coordinate tracker** to capture button positions
4. **Test coordinates** to verify accuracy
5. **Place test video** in input folder
6. **Run automation** and monitor logs

## Dependencies

- **@nut-tree-fork/nut-js** (v4.2.6) - GUI automation
- **fs-extra** - Enhanced file operations
- **winston** - Logging framework
- **dotenv** - Environment configuration
- **jest** - Testing framework

## Development

### Run Tests
```bash
npm test
```

### View Logs
```bash
type logs\automation.log
```

## License

ISC
