# 🎯 How to Track Coordinates - Complete Guide

## The Challenge
To automate Telemetry Overlay, we need to capture the exact X,Y coordinates of buttons. But while tracking, you need to see both:
- **Qoder terminal** (to enter button names)
- **Telemetry Overlay** (to hover over buttons)

## 🚀 EASIEST METHOD: Automated Setup

### Step 1: Run the Setup Command
```bash
npm run setup-tracking
```

### Step 2: Follow the On-Screen Instructions
The script will:
1. ✅ Launch Telemetry Overlay for you
2. ⏳ Wait for you to position the window
3. 📝 Give you instructions
4. 🎯 Start the tracker when ready

### Step 3: Track Each Button
When the tracker starts:
1. **Minimize Qoder** (or move it to side/another monitor)
2. **See Telemetry Overlay** clearly
3. **Hover** mouse over a button
4. **Type** the button name in terminal (you can Alt+Tab to terminal)
5. **Press Enter** to save
6. **Repeat** for all 7 buttons

### Step 4: Verify
```bash
npm run test-coords
```

---

## 🔧 MANUAL METHOD: Step by Step

### Option A: Two Monitors
If you have 2 monitors - this is easiest!

**Monitor 1:** Qoder + Terminal  
**Monitor 2:** Telemetry Overlay

```bash
# In terminal
npm run tracker

# Hover over buttons on Monitor 2
# Type names in terminal on Monitor 1
```

---

### Option B: Single Monitor - Alt+Tab Method

**Step 1: Launch Telemetry Overlay**
```powershell
& "C:\Program Files\Telemetry Overlay\Telemetry Overlay.exe"
```

**Step 2: Position it** (maximize or set size)

**Step 3: Start tracker**
```bash
npm run tracker
```

**Step 4: Track workflow:**
1. Hover mouse over button in Telemetry Overlay
2. Press `Alt+Tab` to switch to terminal
3. Type button name (e.g., `loadVideoButton`)
4. Press `Enter`
5. Press `Alt+Tab` back to Telemetry Overlay
6. Hover over next button
7. Repeat!

---

### Option C: Single Monitor - Minimize Qoder

**Step 1: Start Everything**
```bash
# Launch Telemetry Overlay first
& "C:\Program Files\Telemetry Overlay\Telemetry Overlay.exe"

# Then in Qoder terminal
npm run tracker
```

**Step 2: Minimize Qoder**
- Click minimize button on Qoder
- Telemetry Overlay should now be visible

**Step 3: Track with terminal visible**
- You'll see the terminal behind Telemetry Overlay (or use Alt+Tab)
- Hover over button
- Click on terminal, type name, press Enter
- Repeat

---

## 📝 Buttons to Capture

You need to capture these **7 buttons** (in suggested order):

### 1. `loadVideoButton`
The button you click to load/upload a video file

### 2. `patternsButton`
The button or menu to access patterns

### 3. `loadPatternButton`
The option to load a pattern file

### 4. `exportButton`
The export settings or export options button

### 5. `muteToggle`
The checkbox or toggle to mute audio

### 6. `saveProjectButton`
The button to save the project (.toproj file)

### 7. `finalExportButton`
The final button to export the processed video

---

## 💡 Pro Tips

### ✅ For Best Results:
1. **Maximize** Telemetry Overlay (or keep consistent window size)
2. **Center** your mouse on each button
3. **Take your time** - accuracy matters!
4. **Don't move** the app window during tracking
5. **Write down** button locations if unsure

### 🔍 If You Make a Mistake:
- Just run tracker again
- Re-capture the wrong button (same name)
- It will overwrite the old coordinate

### 📊 Check Your Progress:
While in tracker, type:
```
list
```
This shows all saved coordinates!

---

## 🎬 Example Session

```bash
PS E:\Telemetry Automation> npm run setup-tracking

🎯 Telemetry Overlay Coordinate Tracking Setup
============================================================

📋 Instructions:
1. This script will launch Telemetry Overlay
2. Position and maximize/resize the window as needed
3. Press Enter when ready to start tracking
...

➡️  Press Enter to launch Telemetry Overlay... [ENTER]

🚀 Launching Telemetry Overlay...
✅ Telemetry Overlay should now be launching...

# [You minimize Qoder, see Telemetry Overlay]

➡️  Ready to start coordinate tracking? Press Enter... [ENTER]

🎯 Starting Coordinate Tracker...

# [Tracker starts, you hover over first button]

🎯 Label (or 'list'/'exit'): loadVideoButton [ENTER]
✅ Saved [loadVideoButton] → X:430, Y:210

# [Hover over second button]

🎯 Label (or 'list'/'exit'): patternsButton [ENTER]
✅ Saved [patternsButton] → X:180, Y:800

# ... continue for all 7 buttons ...

🎯 Label (or 'list'/'exit'): exit [ENTER]
👋 Exiting...

# Done! Now verify:
PS E:\Telemetry Automation> npm run test-coords
```

---

## 🆘 Troubleshooting

### Q: Can't see Telemetry Overlay while typing?
**A:** Use Alt+Tab to switch between windows, or minimize Qoder

### Q: Mouse coordinates keep changing?
**A:** Make sure Telemetry Overlay window isn't moving. Keep it maximized or fixed size.

### Q: I saved wrong coordinates!
**A:** Run `npm run tracker` again and re-enter the same button name

### Q: How do I know which button is which?
**A:** Look at the Telemetry Overlay interface:
- Load Video: Usually File → Open or a folder icon
- Patterns: Often in a menu or sidebar
- Export: Typically File → Export or settings icon
- Mute: Audio toggle/checkbox
- Save Project: File → Save Project
- Export Final: Final export button

### Q: Can I test coordinates before running automation?
**A:** Yes! Run `npm run test-coords` - it will highlight each saved position

---

## ✅ After Completing Tracking

**1. Verify Coordinates:**
```bash
npm run test-coords
```
You should see highlights over each button position.

**2. Check the config file:**
```bash
type config\guiMap.json
```
Should show all 7 buttons with X,Y values.

**3. Create input/output folders** (if not exists):
```bash
mkdir "E:\Videos\Input"
mkdir "E:\Videos\Output"
```

**4. Ready to automate!**
```bash
npm start
```

---

## 📞 Need Help?

Check these files:
- `scripts/quick-start-guide.md` - Quick reference
- `SETUP_CHECKLIST.md` - Full setup checklist
- `README.md` - Project overview

Or run:
```bash
npm run verify
```
To see what still needs configuration.

---

## 🎉 Quick Command Reference

| Command | Purpose |
|---------|---------|
| `npm run setup-tracking` | **Automated setup** (easiest!) |
| `npm run tracker` | Manual coordinate tracking |
| `npm run test-coords` | Verify saved coordinates |
| `npm run verify` | Check overall setup |
| `npm start` | Run the automation |

---

**You're all set!** The automated setup makes this easy. Just run `npm run setup-tracking` and follow the prompts! 🚀
