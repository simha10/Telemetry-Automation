# ⚡ Quick Start - Full Screen Coordinate Tracking

## 🎯 One Command to Start Everything

```bash
npm run setup-tracking
```

---

## 📋 The Alt+Tab Workflow

### 1️⃣ Launch & Maximize
- Script launches Telemetry Overlay
- Press **Windows+Up** to maximize (full screen)
- Verify it fills entire screen

### 2️⃣ Start Tracking
- Press Enter when prompted
- Tracker starts

### 3️⃣ Track Each Button (Repeat 7 times)

```
┌─────────────────────────────────────────┐
│  Step 1: Hover over button             │
│  (In Telemetry Overlay - maximized)    │
│                                         │
│         🖱️ [Button Here]                │
│                                         │
└─────────────────────────────────────────┘
                    ↓
            Press Alt+Tab
                    ↓
┌─────────────────────────────────────────┐
│  Step 2: Type button name in terminal  │
│                                         │
│  🎯 Label: loadVideoButton [Enter]     │
│  ✅ Saved [loadVideoButton] → X:430    │
│                                         │
└─────────────────────────────────────────┘
                    ↓
            Press Alt+Tab
                    ↓
         Back to Telemetry Overlay
              Next button!
```

---

## 🎯 7 Buttons to Track

Just type these names (one at a time):

1. **`loadVideoButton`**
2. **`patternsButton`**
3. **`loadPatternButton`**
4. **`exportButton`**
5. **`muteToggle`**
6. **`saveProjectButton`**
7. **`finalExportButton`**

Type **`exit`** when done!

---

## ✅ Verify Coordinates

```bash
npm run test-coords
```

Yellow highlights should appear over each button.

---

## 🚀 Run Automation

```bash
# 1. Maximize Telemetry Overlay (Windows+Up)
# 2. Run automation:
npm start
```

---

## ⌨️ Key Shortcuts

- **`Alt+Tab`** - Switch windows
- **`Windows+Up`** - Maximize window
- **`Ctrl+C`** - Stop tracker

---

## 🆘 If Something Goes Wrong

**Wrong coordinates?**
```bash
npm run tracker  # Run again, overwrite wrong ones
```

**Want to see what's saved?**
```bash
type config\guiMap.json
```

**Check overall setup?**
```bash
npm run verify
```

---

## 💡 Remember

👉 **Maximize during tracking = Maximize during automation**

That's it! Full screen = perfect coordinates! 🎯
