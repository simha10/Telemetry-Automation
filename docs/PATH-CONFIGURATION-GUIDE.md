00# 📁 Path Configuration Guide - No Manual Browsing!

## ✅ **Problem Solved!**

You correctly identified that manual file browsing would break automation. We've fixed this by **hardcoding absolute paths** that the automation types directly into file dialogs.

---

## 🎯 **How It Works Now:**

### **Old Problem (Manual Browsing):**
```
1. Click "Load Video" ❌
2. File dialog opens
3. YOU manually browse to video folder ❌
4. YOU click on video file ❌
5. YOU click Open ❌
```
**Result:** Can't automate - requires manual interaction!

### **New Solution (Absolute Paths):**
```
1. Click "Load Video" ✅ (automated)
2. File dialog opens ✅
3. Script types: E:\Videos\Input\video.mp4 ✅ (automated)
4. Script clicks Open button ✅ (automated)
5. Done! ✅ (fully automated)
```
**Result:** Completely automated - no manual steps!

---

## 📂 **Your Configured Paths:**

### **1. Input Folder** (where videos come FROM)
```
E:\Videos\Input
```
**What automation does:**
- Scans this folder for .mp4 files
- Gets list of all videos
- Types FULL PATH for each video into file dialog
- Example: `E:\Videos\Input\myvideo.mp4`

### **2. Output Folder** (where results go TO)
```
E:\Videos\Output
```
**What automation does:**
- Creates output filenames automatically
- Saves `.toproj` project files here
- Saves final `.mp4` videos here
- Example: `E:\Videos\Output\myvideo_output.mp4`

### **3. Pattern File** (telemetry pattern)
```
E:\Patterns\default.pattern
```
**What automation does:**
- Types this exact path when loading pattern
- No browsing needed!

---

## 🔧 **How to Change Paths:**

Edit `config/settings.json`:

```json
{
  "exePath": "C:\\Program Files\\Telemetry Overlay\\Telemetry Overlay.exe",
  "inputFolder": "YOUR\\INPUT\\PATH\\HERE",
  "outputFolder": "YOUR\\OUTPUT\\PATH\\HERE",
  "patternFile": "YOUR\\PATTERN\\FILE\\PATH.topattern",
  ...
}
```

**Important:** Use double backslashes `\\` in JSON!

---

## 📝 **Example Workflow:**

### **Setup:**
```
E:\Videos\Input\
  ├── race1.mp4
  ├── race2.mp4
  └── race3.mp4

E:\Patterns\
  └── default.pattern
```

### **Run Automation:**
```bash
npm start
```

### **What Happens:**

**For race1.mp4:**
1. Loads video from: `E:\Videos\Input\race1.mp4`
2. Loads pattern from: `E:\Patterns\default.pattern`
3. Saves project to: `E:\Videos\Output\race1_output.toproj`
4. Saves video to: `E:\Videos\Output\race1_output.mp4`

**For race2.mp4:**
1. Loads video from: `E:\Videos\Input\race2.mp4`
2. Saves to: `E:\Videos\Output\race2_output.toproj`
3. Saves to: `E:\Videos\Output\race2_output.mp4`

**For race3.mp4:**
1. Loads video from: `E:\Videos\Input\race3.mp4`
2. Saves to: `E:\Videos\Output\race3_output.toproj`
3. Saves to: `E:\Videos\Output\race3_output.mp4`

**Result:**
```
E:\Videos\Output\
  ├── race1_output.toproj
  ├── race1_output.mp4
  ├── race2_output.toproj
  ├── race2_output.mp4
  ├── race3_output.toproj
  └── race3_output.mp4
```

---

## 💡 **Code Implementation:**

### **In telemetryAutomation.js:**

```javascript
// Build full paths
const videoName = path.basename(videoPath, ".mp4");
const projectPath = path.join(settings.outputFolder, `${videoName}_output.toproj`);
const outputVideo = path.join(settings.outputFolder, `${videoName}_output.mp4`);

// Load video - types FULL path
await keyboard.type(videoPath);  // e.g., "E:\Videos\Input\race1.mp4"
await mouse.click(openButton);

// Load pattern - types FULL path
await keyboard.type(patternPath);  // e.g., "E:\Patterns\default.pattern"
await mouse.click(loadButton);

// Save project - types FULL path
await keyboard.type(projectPath);  // e.g., "E:\Videos\Output\race1_output.toproj"
await mouse.click(saveButton);

// Export video - types FULL path
await keyboard.type(outputVideo);  // e.g., "E:\Videos\Output\race1_output.mp4"
await mouse.click(exportButton);
```

---

## ✅ **Path Verification:**

Run this before automation:
```bash
npm run test-paths
```

**Checks:**
- ✅ Input folder exists
- ✅ Output folder exists
- ✅ Videos found in input folder
- ✅ Pattern file exists
- ✅ Telemetry Overlay installed
- ✅ Shows example paths automation will use

---

## 🆘 **Troubleshooting:**

### **"File not found" errors:**
→ Check paths in `settings.json` are correct
→ Use double backslashes: `C:\\Path\\To\\File`
→ Run `npm run test-paths` to verify

### **"Path too long" errors:**
→ Move folders closer to root (e.g., `C:\\Videos\\`)
→ Shorter paths = fewer issues

### **"Access denied" errors:**
→ Ensure you have write permission to output folder
→ Don't use system folders (like Program Files)

---

## 🎯 **Key Points:**

1. **✅ All paths are ABSOLUTE** - Full paths from drive root
2. **✅ No manual browsing needed** - Automation types paths
3. **✅ Batch processing supported** - Handles multiple videos
4. **✅ Output naming automatic** - Adds `_output` suffix
5. **✅ Fully automated** - Set paths once, run many times

---

## 🚀 **Ready to Run:**

1. **Place videos** in `E:\Videos\Input\`
2. **Verify pattern** exists at configured path
3. **Run test:** `npm run test-paths`
4. **Maximize** Telemetry Overlay
5. **Run automation:** `npm start`

**That's it!** No manual file selection needed! 🎉
