# Multi-Video Processing Workflow

## ✅ Complete Automation Flow (Per Video)

The automation now processes **all videos** in the input folder, one at a time, with a **fresh Telemetry Overlay window** for each video.

---

## 🔄 Processing Loop

```
FOR EACH VIDEO IN INPUT FOLDER:
  1. Launch fresh Telemetry Overlay window
  2. Load video
  3. Apply pattern (Recently Used)
  4. Configure export settings
  5. Save .toproj file
  6. Export .mp4 file
  7. Close window (Alt+F4)
  8. Move to NEXT video
```

---

## 📋 Detailed Steps (Per Video)

### **Step 1: Launch Telemetry Overlay**
- ✅ Launch fresh instance
- ⏳ Wait 8000ms for app to load

### **Step 2-3: Load Video**
- Click "Load Video" button
- Type video path in file dialog
- Click "Open"
- Wait for video encoding (size-based)

### **Step 4-6: Apply Pattern**
- Click "Pattern" button
- Click "Recently Used Pattern" button
- Click "Load" in modal

### **Step 7-10: Configure Export**
- Click "Export" button
- Set video quality to `0`
- Set render speed to `0`
- Turn off "include original audio"

### **Step 11-12: Save Project**
- Click "Save Project" button
- Type `.toproj` file path
- Click "Save"

### **Step 13: Export Video**
- Click export button (no path typing needed!)

### **Step 14: Close Window** ← **NEW!**
- Press `Alt+F4` to close Telemetry Overlay
- Wait 2s for window to close
- Ready for next video!

---

## 🎯 Key Features

### **Fresh Window Per Video**
Each video gets its own Telemetry Overlay instance:
- ✅ No leftover state from previous video
- ✅ Clean pattern application
- ✅ Reliable export settings
- ✅ No memory leaks

### **Automatic Video Detection**
```javascript
while (true) {
  const videos = getAllVideos(inputFolder);
  if (videos.length === 0) break;
  
  const videoPath = videos[0]; // Always process first video
  await automateTelemetry(videoPath, ...);
}
```

### **File Naming**
**Input:** `BHANPUR TO MH 517.MP4`

**Output:**
- Project: `BHANPUR TO MH 517.toproj`
- Video: `BHANPUR TO MH 517.mp4`

*(No more `_output` suffix or `.MP4` in filenames!)*

---

## 📊 Console Output Example

```
============================================================
📹 Processing: VIDEO_1.MP4
   (5 videos remaining)
============================================================

⏳ Starting automation for: VIDEO_1

🚀 Step 1: Launching Telemetry Overlay...
   Waiting 8000ms for app to load...
   ✅ App should be loaded

📹 Step 2: Clicking Load Video button...
   ✅ Clicked Load Video button

...

🎥 Step 13: Clicking Export/Save button for .mp4...
   ✅ Started MP4 export!

🚪 Step 14: Closing Telemetry Overlay window...
   ✅ Sent close command (Alt+F4)
   ⏳ Waiting 2s for window to close...
   ✅ Window closed, ready for next video!

✅ Automation completed for VIDEO_1.MP4

============================================================
📹 Processing: VIDEO_2.MP4
   (4 videos remaining)
============================================================
...
```

---

## ⚙️ Settings

### **Timing Configuration** (settings.json)
```json
{
  "delays": {
    "appLoad": 8000,          // Fresh window load time
    "fileDialogOpen": 3000,   // File dialog wait
    "stepDelay": 2000,        // General delays
    "encodingTimePerMB": 500,
    "minEncodingTime": 5000,
    "maxEncodingTime": 120000,
    "encodingCheckInterval": 2000
  }
}
```

---

## 🚀 Usage

### **Run Automation:**
```bash
node src/index.js
```

### **Interactive Prompts:**
1. **Input folder:** Where your `.MP4` files are
2. **Output folder:** Where to save results
3. **Pattern file:** (only needed first time - then uses "Recently Used")

### **What Happens:**
1. Scans input folder for `.mp4`/`.MP4` files
2. Processes each video sequentially
3. Launches fresh Telemetry Overlay per video
4. Closes window after each video
5. Continues until all videos processed

---

## 💡 Important Notes

### **Window State**
- ⚠️ **Keep Telemetry Overlay MAXIMIZED** during coordinate tracking
- ⚠️ Automation expects maximized window for accurate clicks
- ⚠️ Don't resize or minimize during automation

### **Pattern Loading**
- First video: Pattern must be loaded manually once
- Subsequent videos: Uses "Recently Used Pattern" automatically
- No path typing needed after first use!

### **File Management**
- ✅ Source videos remain in input folder
- ✅ Output files saved to output folder
- ✅ Manually move/delete processed videos as needed

---

## 🔧 Troubleshooting

### **Window Not Closing**
- Increase wait time after Alt+F4 (currently 2s)
- Check if Telemetry Overlay has unsaved changes prompt

### **Pattern Not Found**
- Ensure pattern was loaded at least once manually
- Verify "Recently Used Pattern" button coordinates

### **Wrong File Names**
- Check that video extensions are `.mp4` or `.MP4`
- Case-insensitive handling already implemented

---

**Last Updated:** After adding multi-video support with window closing
