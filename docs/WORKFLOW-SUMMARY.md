# Telemetry Automation Workflow Summary

## ✅ Updated Automation Flow

### **Simplified Changes:**
1. ✅ **Removed file moving** - Videos stay in input folder after processing
2. ✅ **Use "Recently Used Pattern"** - No more typing pattern path manually!
3. ✅ **Two save dialogs** - Type paths for both `.toproj` and `.mp4` files

---

## 📋 Complete Step-by-Step Workflow

### **Step 1-3: Load Video**
1. Launch Telemetry Overlay app (8s load time)
2. Click "Load Video" button
3. Type full video path in file dialog → Click "Open"
4. Wait for video encoding (based on file size)

### **Step 4-6: Load Pattern (NEW SIMPLIFIED!)**
4. Click "Pattern" button
5. Click "Recently Used Pattern" button ← **FASTER!**
6. Click "Load" button in modal ← **NO TYPING!**

### **Step 7-10: Configure Export**
7. Click "Export" button
8. Set video quality to `0`
9. Set render speed to `0`
10. Turn off "include original audio"

### **Step 11-12: Save Project (.toproj)**
11. Click "Save Project" button
12. **Type full path** for `.toproj` file → Click "Save"

### **Step 13: Export Video (.mp4)**
13. **Type full path** for `.mp4` file → Click "Save"

---

## 🎯 Key Benefits

### **Pattern Loading:**
- ❌ **Old:** Pattern Button → Load Pattern → Wait for dialog → Type path → Click Open
- ✅ **New:** Pattern Button → Recently Used Pattern → Click Load
- ⏱️ **Time saved:** ~5-10 seconds per video!

### **File Management:**
- ✅ Videos remain in input folder
- ✅ No automatic moving to "Processed" or "Failed" folders
- ✅ You manually manage files as needed

### **Debugging:**
- ✅ Detailed console logs at each step
- ✅ Shows mouse coordinates before each click
- ✅ Progress indicators (⏳, ✅) for visibility
- ✅ Wait times displayed for transparency

---

## 🔧 Button Coordinates (guiMap.json)

```json
{
  "Load video button": { "x": 954, "y": 548 },
  "Open button": { "x": 1048, "y": 464 },
  "Pattern Button": { "x": 69, "y": 927 },
  "Recently used pattern button": { "x": 233, "y": 957 },
  "Load button in Modal": { "x": 1056, "y": 613 },
  "Export Button": { "x": 671, "y": 43 },
  "set video quality to 0 button": { "x": 1402, "y": 480 },
  "set render speed to zero button": { "x": 1403, "y": 559 },
  "turn off include \"include original audio\" button": { "x": 1402, "y": 711 },
  "Save project button": { "x": 1769, "y": 42 },
  "save .toproj file button": { "x": 1470, "y": 470 },
  ".mp4 file save button": { "x": 1629, "y": 889 }
}
```

---

## 🚀 Running the Automation

```bash
node src/index.js
```

### **Interactive Setup Prompts:**
1. Input folder path (where videos are)
2. Output folder path (where to save results)
3. Pattern file path (for first-time setup only!)

### **What Happens:**
- Processes videos one by one
- Shows detailed progress in console
- Uses recently used pattern (no path typing!)
- Saves both `.toproj` and `.mp4` files with custom names
- Videos remain in input folder

---

## ⚙️ Configuration (settings.json)

```json
{
  "delays": {
    "appLoad": 8000,           // App startup time
    "fileDialogOpen": 3000,    // File dialog open time
    "stepDelay": 2000,         // General step delay
    "encodingTimePerMB": 500,  // Encoding calculation
    "minEncodingTime": 5000,
    "maxEncodingTime": 120000,
    "encodingCheckInterval": 2000
  }
}
```

---

## 💡 Tips

1. **First Run:** Load your pattern file manually once, then it appears in "Recently Used"
2. **Maximized Window:** Keep Telemetry Overlay maximized (same as during tracking)
3. **Watch Console:** Detailed logs show exactly where automation is
4. **Adjust Delays:** If steps fail, increase `stepDelay` or `fileDialogOpen` in settings.json
5. **File Paths:** Type complete absolute paths in save dialogs (e.g., `E:\output\video_output.mp4`)

---

**Last Updated:** After pattern workflow simplification
