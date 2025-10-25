# 🎯 Full Screen Coordinate Tracking Guide

## Why Full Screen?
✅ **Most accurate coordinates**  
✅ **Consistent positioning** - always maximized  
✅ **Easy to reproduce** - just maximize again during automation  
✅ **Professional approach** - industry standard  

---

## 🚀 Step-by-Step Process

### Step 1: Launch Setup
```bash
npm run setup-tracking
```

### Step 2: Maximize Telemetry Overlay

When Telemetry Overlay opens:

**Option A: Keyboard Shortcut (Fastest)**
```
Windows Key + Up Arrow
```

**Option B: Mouse**
- Click the maximize button (square icon in top-right)

**Verify:** Telemetry Overlay should fill your entire screen

### Step 3: Start Tracking

Press Enter when prompted, tracker will start.

### Step 4: Track Each Button (Alt+Tab Method)

**For each of the 7 buttons:**

1. **🖱️ Hover** - Move mouse over button in Telemetry Overlay (maximized)
2. **⌨️ Alt+Tab** - Switch to terminal window
3. **✍️ Type** - Enter button name (e.g., `loadVideoButton`)
4. **↵ Enter** - Save the coordinate
5. **⌨️ Alt+Tab** - Switch back to Telemetry Overlay
6. **🔁 Repeat** for next button

---

## 📝 The 7 Buttons to Track

Track in this order for best workflow:

### 1. `loadVideoButton`
**What:** Button to load/upload video file  
**Where:** Usually File menu or toolbar icon  
**Hover:** Center of the button

### 2. `patternsButton`
**What:** Button to access patterns menu  
**Where:** Menu bar or sidebar  
**Hover:** Center of the button

### 3. `loadPatternButton`
**What:** Load pattern file option  
**Where:** Inside patterns menu or dialog  
**Hover:** Center of the option

### 4. `exportButton`
**What:** Export settings button  
**Where:** Toolbar or File menu  
**Hover:** Center of the button

### 5. `muteToggle`
**What:** Audio mute checkbox/toggle  
**Where:** Audio settings or toolbar  
**Hover:** Center of checkbox

### 6. `saveProjectButton`
**What:** Save project file button  
**Where:** File menu or toolbar  
**Hover:** Center of the button

### 7. `finalExportButton`
**What:** Final video export button  
**Where:** File menu or export dialog  
**Hover:** Center of the button

---

## 💡 Pro Tips for Accuracy

### ✅ DO:
- **Maximize** Telemetry Overlay (full screen)
- **Hover precisely** in center of each button
- **Wait** for mouse to be steady before Alt+Tab
- **Take your time** - accuracy > speed
- **Keep maximized** throughout entire tracking session

### ❌ DON'T:
- Un-maximize or resize during tracking
- Rush through buttons
- Hover near edge of buttons
- Move the window
- Click buttons (just hover!)

---

## 🎬 Example Tracking Session

```bash
PS E:\Telemetry Automation> npm run setup-tracking

🎯 Telemetry Overlay Coordinate Tracking Setup
============================================================

➡️  Press Enter to launch Telemetry Overlay... [PRESS ENTER]

🚀 Launching Telemetry Overlay...

# [Telemetry Overlay opens]
# [You press Windows+Up to maximize it]
# [Verify it's full screen]

➡️  Ready to start coordinate tracking? Press Enter... [PRESS ENTER]

🎯 Starting Coordinate Tracker...

📝 Buttons to track (in suggested order):
   1. loadVideoButton       - Button to load/upload video
   2. patternsButton         - Patterns menu button
   ...

💡 How to use the tracker with Alt+Tab:
   1. Hover mouse over a button in Telemetry Overlay (maximized)
   2. Press Alt+Tab to switch to this terminal
   3. Type the button name
   4. Press Enter to save
   5. Press Alt+Tab to go back to Telemetry Overlay
   6. Hover over next button and repeat

Starting tracker in 3 seconds...

🚀 Coordinate Tracker Started!

🎯 Label (or 'list'/'exit'): 

# [You Alt+Tab to Telemetry Overlay]
# [Hover over first button - "Load Video"]
# [Alt+Tab back to terminal]
# [Type: loadVideoButton]

🎯 Label (or 'list'/'exit'): loadVideoButton [ENTER]
✅ Saved [loadVideoButton] → X:430, Y:210

🎯 Label (or 'list'/'exit'): 

# [Alt+Tab back to Telemetry]
# [Hover over "Patterns" button]
# [Alt+Tab to terminal]
# [Type: patternsButton]

🎯 Label (or 'list'/'exit'): patternsButton [ENTER]
✅ Saved [patternsButton] → X:180, Y:800

# ... continue for all 7 buttons ...

🎯 Label (or 'list'/'exit'): finalExportButton [ENTER]
✅ Saved [finalExportButton] → X:700, Y:150

🎯 Label (or 'list'/'exit'): exit [ENTER]
👋 Exiting...
```

---

## ⌨️ Keyboard Shortcuts Reference

| Shortcut | Action |
|----------|--------|
| `Alt+Tab` | Switch between windows |
| `Windows+Up` | Maximize current window |
| `Windows+Down` | Un-maximize/minimize window |
| `Alt+F4` | Close current window |

---

## ✅ After Tracking - Verification

### Step 1: Keep Telemetry Maximized
Don't close or resize it yet!

### Step 2: Test Coordinates
```bash
npm run test-coords
```

You should see yellow highlights flash over each button position.

### Step 3: Check Results
```bash
type config\guiMap.json
```

Should show all 7 buttons with coordinates:
```json
{
  "loadVideoButton": { "x": 430, "y": 210 },
  "patternsButton": { "x": 180, "y": 800 },
  "loadPatternButton": { "x": 220, "y": 820 },
  "exportButton": { "x": 400, "y": 150 },
  "muteToggle": { "x": 600, "y": 500 },
  "saveProjectButton": { "x": 650, "y": 150 },
  "finalExportButton": { "x": 700, "y": 150 }
}
```

---

## 🚀 Running Automation Later

When you're ready to run automation:

### Step 1: Launch Telemetry Overlay
```bash
& "C:\Program Files\Telemetry Overlay\Telemetry Overlay.exe"
```

### Step 2: Maximize It
```
Windows Key + Up Arrow
```
**Critical:** Must be maximized just like during tracking!

### Step 3: Run Automation
```bash
npm start
```

### Step 4: Don't Touch Anything
- Don't move mouse
- Don't press keys
- Let automation run
- Watch it work! 🎉

---

## 🆘 Troubleshooting

### Q: Alt+Tab doesn't switch to terminal?
**A:** Make sure terminal window is open. Try clicking taskbar if needed.

### Q: I accidentally clicked a button while hovering?
**A:** No problem! Just track that coordinate. Clicking won't affect coordinate capture.

### Q: Wrong coordinates saved?
**A:** Run tracker again, type same button name to overwrite.

### Q: Test highlights are in wrong positions?
**A:** 
- Make sure Telemetry Overlay is maximized
- Check if screen resolution changed
- Re-run tracker if needed

### Q: Can I take a break during tracking?
**A:** Yes! Just keep Telemetry Overlay maximized. Resume when ready.

---

## 📊 Checklist

Before starting:
- [ ] Telemetry Overlay is installed
- [ ] You know where each button is located
- [ ] Terminal window is open with tracker ready

During tracking:
- [ ] Telemetry Overlay is MAXIMIZED (full screen)
- [ ] Using Alt+Tab to switch windows
- [ ] Hovering precisely in center of buttons
- [ ] Saving each coordinate before moving to next

After tracking:
- [ ] All 7 buttons captured
- [ ] Ran `npm run test-coords` to verify
- [ ] Highlights appear in correct positions
- [ ] Config file shows all coordinates

Before automation:
- [ ] Telemetry Overlay MAXIMIZED (same as tracking)
- [ ] Input videos in input folder
- [ ] Pattern file exists
- [ ] Ready to run `npm start`

---

## 🎉 Quick Command Reference

| Command | Purpose |
|---------|---------|
| `npm run setup-tracking` | Launch & setup coordinate tracking |
| `npm run tracker` | Just the tracker (manual) |
| `npm run test-coords` | Verify saved coordinates |
| `npm run verify` | Check overall setup status |
| `npm start` | Run the automation |

---

## 🎯 Remember:

**The Golden Rule:**  
👉 **Maximize during tracking = Maximize during automation**

Full screen coordinates are the most accurate and easiest to reproduce. Just maximize Telemetry Overlay every time, and your coordinates will work perfectly! 🚀

---

**Ready to start?**
```bash
npm run setup-tracking
```

Then maximize Telemetry Overlay and follow the Alt+Tab workflow above! 💪
