# Quick Start Guide - Coordinate Tracking

## 🎯 Goal
Capture the X,Y coordinates of buttons in Telemetry Overlay for automation.

## 📋 Step-by-Step Process

### Method 1: Automated Setup (Recommended)

```bash
npm run setup-tracking
```

This will:
1. ✅ Launch Telemetry Overlay automatically
2. ✅ Give you instructions
3. ✅ Start the coordinate tracker when you're ready

**Then:**
- Minimize or move Qoder window aside
- Keep Telemetry Overlay visible
- Hover over each button and save coordinates

---

### Method 2: Manual Setup

**Step 1: Launch Telemetry Overlay**
```bash
# In PowerShell or Command Prompt
& "C:\Program Files\Telemetry Overlay\Telemetry Overlay.exe"
```

**Step 2: Position the Window**
- Maximize or resize Telemetry Overlay as needed
- This will be the position used during automation
- **Keep it in the same state throughout tracking**

**Step 3: Minimize Qoder**
- Click minimize on Qoder IDE
- Or move it to another monitor
- You need to see Telemetry Overlay clearly

**Step 4: Start Tracker**
```bash
# In a terminal (can use Windows Terminal or CMD)
cd "e:\Telemetry Automation"
npm run tracker
```

**Step 5: Capture Coordinates**
For each button:
1. Hover mouse over the button
2. Type the button name in terminal
3. Press Enter
4. Move to next button

---

## 🎯 Buttons to Track

Track these buttons in order:

| Button Name | What to Hover Over |
|-------------|-------------------|
| `loadVideoButton` | Button to load/upload video file |
| `patternsButton` | Patterns menu or tab |
| `loadPatternButton` | Load pattern file option |
| `exportButton` | Export settings or options button |
| `muteToggle` | Audio mute checkbox/toggle |
| `saveProjectButton` | Save project file button |
| `finalExportButton` | Final export video button |

---

## 💡 Tips for Accurate Tracking

### ✅ DO:
- Keep Telemetry Overlay in the **same position** throughout
- Hover **precisely** over the center of each button
- Maximize the app window (or keep consistent size)
- Take your time - accuracy is important

### ❌ DON'T:
- Move or resize Telemetry Overlay during tracking
- Rush through the process
- Track coordinates on different screen resolutions
- Close Telemetry Overlay between button captures

---

## 🔧 Tracker Commands

While tracking:
- **Type button name** + Enter → Save coordinate
- **`list`** → Show all saved coordinates
- **`exit`** or Ctrl+C → Quit tracker

---

## ✅ After Tracking

**Verify Your Coordinates:**
```bash
npm run test-coords
```

This will highlight each saved position on screen. Make sure they're correct!

**If coordinates are wrong:**
- Run tracker again
- Just re-capture the incorrect button
- It will overwrite the old coordinate

---

## 🖥️ Multi-Monitor Setup

If you have multiple monitors:
1. Keep Telemetry Overlay on your **primary** monitor
2. Or track on whichever monitor you'll use for automation
3. Coordinates are absolute screen positions

---

## 📊 Example Workflow

```bash
# Terminal 1 (launch app)
& "C:\Program Files\Telemetry Overlay\Telemetry Overlay.exe"

# Wait for app to load, position it

# Terminal 2 (track coordinates) 
cd "e:\Telemetry Automation"
npm run tracker

# Hover over first button
# Type: loadVideoButton [Enter]
# ✅ Saved [loadVideoButton] → X:430, Y:210

# Hover over second button  
# Type: patternsButton [Enter]
# ✅ Saved [patternsButton] → X:180, Y:800

# ... continue for all buttons ...

# Type: exit [Enter]
# Done!

# Verify
npm run test-coords
```

---

## 🆘 Troubleshooting

### "Telemetry Overlay won't launch"
→ Check path is correct: `C:\Program Files\Telemetry Overlay\Telemetry Overlay.exe`
→ Launch manually from Start Menu

### "Can't see Telemetry Overlay"
→ Alt+Tab to switch to it
→ It might be behind other windows

### "Wrong coordinates saved"
→ Run tracker again
→ Type same button name to overwrite

### "How do I see saved coordinates?"
→ Type `list` in the tracker
→ Or check `config/guiMap.json`

---

## 🎉 You're Ready!

Once all coordinates are captured and verified:
```bash
npm start
```

Your automation will begin! 🚀
