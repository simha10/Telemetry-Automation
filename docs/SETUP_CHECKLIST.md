# Telemetry Automation - Setup Checklist

## Current Status: ✅ READY FOR CONFIGURATION

All technical dependencies are installed. Follow this checklist to complete setup.

---

## ✅ Completed Steps

- [x] Node.js dependencies installed
- [x] Project structure created
- [x] Configuration templates created
- [x] Helper scripts created
- [x] Core automation code implemented
- [x] nut-js GUI automation verified working
- [x] Logging system ready
- [x] Test framework configured

---

## 📋 Next Steps (To Do)

### Step 1: Install Telemetry Overlay Application
- [ ] Download from official website
- [ ] Install on your system
- [ ] Note the installation path
- [ ] Test launch manually

### Step 2: Configure Paths
- [ ] Edit `config/settings.json`
- [ ] Update `exePath` with Telemetry Overlay path
- [ ] Set `inputFolder` path (where your MP4 videos are)
- [ ] Set `outputFolder` path (where processed videos go)
- [ ] Set `patternFile` path (your .topattern file)

**Example:**
```json
{
  "exePath": "C:\\Program Files\\TelemetryOverlay\\TelemetryOverlay.exe",
  "inputFolder": "E:\\Videos\\Input",
  "outputFolder": "E:\\Videos\\Output",
  "patternFile": "E:\\Patterns\\default.pattern"
}
```

### Step 3: Create Required Folders
Run these commands or create manually:
- [ ] `mkdir logs`
- [ ] `mkdir "E:\Videos\Input"` (or your chosen path)
- [ ] `mkdir "E:\Videos\Output"` (or your chosen path)

### Step 4: Calibrate GUI Coordinates
- [ ] Launch Telemetry Overlay
- [ ] Run: `node scripts/tracker.js`
- [ ] For each button, hover mouse and save coordinates:
  - [ ] `loadVideoButton` - Video upload button
  - [ ] `patternsButton` - Patterns menu
  - [ ] `loadPatternButton` - Load pattern option
  - [ ] `exportButton` - Export settings
  - [ ] `muteToggle` - Mute checkbox
  - [ ] `saveProjectButton` - Save project
  - [ ] `finalExportButton` - Final export

**Tips:**
- Keep app in same state (maximized/windowed) during tracking
- Note current screen resolution
- Be precise with mouse positioning

### Step 5: Verify Coordinates
- [ ] Run: `node scripts/testHighlight.js`
- [ ] Verify all highlights appear over correct buttons
- [ ] Recalibrate if any are incorrect

### Step 6: Prepare Test Video
- [ ] Place a test `.mp4` video in your input folder
- [ ] Ensure you have a `.topattern` file ready

### Step 7: Test Run
- [ ] Run: `npm start`
- [ ] Watch automation execute
- [ ] Do NOT touch mouse during execution
- [ ] Check logs: `type logs\automation.log`
- [ ] Verify output video created

---

## 🎯 When You're Ready to Run

```bash
# 1. Start the automation
npm start

# 2. Monitor in real-time
# Watch the app window - automation will control it

# 3. Check results
type logs\automation.log
dir "E:\Videos\Output"
```

---

## 🔧 Adjustment & Tuning

If automation runs too fast/slow:
- Edit `config/settings.json`
- Adjust `delays.appLoad` (time for app to launch)
- Adjust `delays.stepDelay` (time between actions)

**Slower system?** Increase delays:
```json
"delays": {
  "appLoad": 5000,
  "stepDelay": 2000
}
```

**Faster system?** Decrease delays:
```json
"delays": {
  "appLoad": 2000,
  "stepDelay": 500
}
```

---

## 📊 What Gets Created

For each `video.mp4` in input folder:
- `video_output.toproj` - Project file
- `video_output.mp4` - Processed video
- Log entries in `logs/automation.log`

---

## ⚠️ Common Issues

### Automation clicks wrong spots
→ Run `node scripts/tracker.js` again to recalibrate

### App doesn't launch
→ Check `exePath` in settings.json

### No videos processed
→ Ensure `.mp4` files exist in `inputFolder`

### Timing errors
→ Increase delay values in `settings.json`

---

## 🚀 You're All Set!

The technical setup is complete. Just follow the checklist above to:
1. Install Telemetry Overlay
2. Configure your paths
3. Calibrate coordinates
4. Run your first automation

**Need help?** Check `README.md` and `Setup.md` for detailed guides.
