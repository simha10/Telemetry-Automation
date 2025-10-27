# Telemetry Overlay Video Automation

🎥 **Automated batch processing of videos with Telemetry Overlay patterns**

This project automates the process of applying telemetry patterns to multiple videos using the Telemetry Overlay desktop application through GUI automation.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [How It Works](#how-it-works)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Automation Workflow](#automation-workflow)
- [File Structure](#file-structure)
- [Troubleshooting](#troubleshooting)
- [Future Enhancements](#future-enhancements)
- [Technical Details](#technical-details)

---

## 🎯 Overview

This automation tool processes multiple video files through Telemetry Overlay, applying predefined patterns and exporting them with custom settings. It eliminates the need for manual, repetitive GUI interactions when processing large batches of videos.

### **What It Does:**
- ✅ Launches Telemetry Overlay for each video
- ✅ Loads video files automatically
- ✅ Applies recently used pattern
- ✅ Configures export settings (quality, speed, audio)
- ✅ Saves project files (.toproj)
- ✅ Exports final videos (.mp4)
- ✅ Closes application and moves to next video
- ✅ Tracks processed videos to avoid reprocessing

---

## ✨ Features

### **Current Functionalities:**

#### **1. Batch Video Processing**
- Processes all `.mp4` or `.MP4` files in a specified folder
- Case-insensitive file extension handling
- Sequential processing with fresh application instance per video

#### **2. Smart Tracking System**
- Creates `.processed_videos.json` to track completed videos
- Prevents reprocessing of already-handled videos
- Safe for rendering - doesn't move or rename source files
- Resume capability - can stop and restart without losing progress

#### **3. Intelligent Wait Times**
- **Dynamic encoding wait**: Calculates wait time based on video file size (500ms per MB)
- **Configurable delays**: All timing parameters adjustable in `settings.json`
- **Progress indicators**: Real-time progress during encoding wait

#### **4. Interactive Setup**
- Prompts for input/output folder paths
- Pattern file path configuration
- Default values with override option
- Path validation before execution

#### **5. Automated GUI Workflow**
1. Launch Telemetry Overlay
2. Load video via file path typing
3. Apply recently used pattern (no manual path entry)
4. Configure export settings:
   - Video quality: 0
   - Render speed: 0
   - Audio: Off
5. Save .toproj project file
6. Set output path for .mp4 file
7. Export video
8. Close application window (Alt+F4)

#### **6. Error Handling**
- Try-catch blocks for each video
- Failed videos marked in tracking file
- Continues to next video on error
- Detailed error logging

#### **7. Console Logging**
- Step-by-step progress updates
- Coordinate display for each click
- Visual progress indicators (emojis)
- Summary statistics at completion

---

## 🔧 How It Works

### **Technology Stack:**
- **Node.js**: Runtime environment
- **@nut-tree-fork/nut-js**: Desktop automation (mouse/keyboard control)
- **fs-extra**: File system operations
- **winston**: Structured logging

### **Automation Method:**
- **Coordinate-based GUI automation**: Clicks specific screen coordinates
- **Keyboard simulation**: Types file paths and settings
- **Window management**: Launches and closes application instances

### **Key Concept:**
The automation simulates human interaction with the Telemetry Overlay GUI by:
1. Moving the mouse to predefined coordinates
2. Clicking buttons
3. Typing text into input fields
4. Waiting for UI responses

---

## 📦 Installation

### **Prerequisites:**
- Node.js (v14 or higher)
- Telemetry Overlay installed at: `C:\Program Files\TelemetryOverlay\TelemetryOverlay.exe`
- Windows OS (coordinate-based automation is OS-specific)

### **Setup:**

```bash
# 1. Navigate to project directory
cd "E:\Telemetry Automation"

# 2. Install dependencies
npm install

# 3. Verify installation
node verify-setup.js
```

---

## ⚙️ Configuration

### **1. Settings File** (`config/settings.json`)

```json
{
  "exePath": "C:\\Program Files\\Telemetry Overlay\\Telemetry Overlay.exe",
  "inputFolder": "E:\\MALL_1-10-2025 output1",
  "outputFolder": "E:\\MALL_1-10-2025 output1\\output",
  "patternFile": "E:\\pattern.toptrn",
  "logFile": "logs/automation.log",
  "delays": {
    "appLoad": 8000,              // Time to wait for app launch
    "fileDialogOpen": 3000,       // Time to wait for file dialogs
    "stepDelay": 2000,            // General delay between steps
    "encodingTimePerMB": 500,     // Encoding time calculation
    "minEncodingTime": 5000,      // Minimum encoding wait
    "maxEncodingTime": 120000,    // Maximum encoding wait (2 min)
    "encodingCheckInterval": 2000 // Progress check interval
  }
}
```

### **2. GUI Map File** (`config/guiMap.json`)

Contains screen coordinates for all GUI elements:

```json
{
  "Load video button": { "x": 954, "y": 548 },
  "Open button": { "x": 1088, "y": 489 },
  "Pattern Button": { "x": 69, "y": 927 },
  "Recently used pattern button": { "x": 233, "y": 957 },
  "Export Button": { "x": 671, "y": 43 },
  "Save project button": { "x": 1769, "y": 42 },
  "save .toproj file button": { "x": 1088, "y": 489 },
  "button to set path to save .mp4 file": { "x": 1641, "y": 828 },
  "save button for saving .mp4 path": { "x": 1088, "y": 489 },
  "export button to save .mp4 video file": { "x": 1624, "y": 891 }
}
```

⚠️ **Important:** These coordinates are specific to your screen resolution and window size. Telemetry Overlay must be **maximized** and in the same state as during coordinate tracking.

### **3. Tracking Coordinates**

To update button coordinates:

```bash
# Run the tracker tool
node scripts/tracker.js

# Click on GUI elements to record coordinates
# Updates guiMap.json automatically
```

---

## 🚀 Usage

### **Basic Usage:**

```bash
# Run the automation
node src/index.js
```

### **Interactive Prompts:**

1. **Input Folder**: Where your `.mp4` videos are located
2. **Output Folder**: Where to save processed files
3. **Pattern File**: Path to your `.toptrn` pattern file (only needed once)

### **Example Session:**

```
🎯 Telemetry Automation - Interactive Setup

============================================================

📂 Input Folder Configuration:
   Current: E:\MALL_1-10-2025 output1
   Use this path? (y/n): y

📂 Output Folder Configuration:
   Current: E:\MALL_1-10-2025 output1\output
   Use this path? (y/n): y

📂 Pattern File Configuration:
   Current: E:\pattern.toptrn
   Use this path? (y/n): y

============================================================

✅ Configuration Summary:
   Input:   E:\MALL_1-10-2025 output1
   Output:  E:\MALL_1-10-2025 output1\output
   Pattern: E:\pattern.toptrn

🚀 Start automation? (y/n): y

============================================================

🎬 Starting Automation...

============================================================
📹 Processing: VIDEO_001.MP4
   (20 unprocessed videos remaining)
============================================================
```

---

## 📊 Automation Workflow

### **Complete Step-by-Step Process:**

```
┌─────────────────────────────────────────────┐
│  FOR EACH VIDEO IN INPUT FOLDER:           │
└─────────────────────────────────────────────┘
          ↓
    ┌─────────────────────┐
    │ Step 1: Launch App  │ (8s wait)
    └─────────────────────┘
          ↓
    ┌─────────────────────┐
    │ Step 2: Load Video  │
    │  - Click button     │
    │  - Type path        │
    │  - Click Open       │
    └─────────────────────┘
          ↓
    ┌─────────────────────┐
    │ Step 3: Wait Encode │ (size-based)
    └─────────────────────┘
          ↓
    ┌─────────────────────┐
    │ Step 4-6: Pattern   │
    │  - Click Pattern    │
    │  - Recently Used    │
    │  - Load             │
    └─────────────────────┘
          ↓
    ┌─────────────────────┐
    │ Step 7-10: Export   │
    │  - Click Export     │
    │  - Quality: 0       │
    │  - Speed: 0         │
    │  - Audio: Off       │
    └─────────────────────┘
          ↓
    ┌─────────────────────┐
    │ Step 11-12: Project │
    │  - Save .toproj     │
    └─────────────────────┘
          ↓
    ┌─────────────────────┐
    │ Step 13: MP4 Export │
    │  - Set path         │
    │  - Save path        │
    │  - Click Export     │
    └─────────────────────┘
          ↓
    ┌─────────────────────┐
    │ Step 14: Close App  │ (Alt+F4)
    └─────────────────────┘
          ↓
    ┌─────────────────────┐
    │ Update Tracking     │
    └─────────────────────┘
          ↓
    [Next Video] ←──────┘
```

---

## 📁 File Structure

```
E:\Telemetry Automation\
├── config/
│   ├── settings.json           # Configuration settings
│   ├── guiMap.json            # GUI element coordinates
│   └── calibration.txt        # Calibration notes
├── src/
│   ├── index.js               # Main automation script
│   ├── telemetryAutomation.js # Core automation logic
│   ├── fileUtils.js           # File handling utilities
│   └── logger.js              # Logging utilities
├── scripts/
│   ├── tracker.js             # Coordinate tracking tool
│   ├── testHighlight.js       # Visual coordinate tester
│   └── setup-tracking.js      # Tracking setup helper
├── logs/
│   └── automation.log         # Automation logs
├── package.json               # Node.js dependencies
└── README.md                  # This file

Input Folder Structure:
E:\MALL_1-10-2025 output1\
├── VIDEO_001.MP4              # Source videos
├── VIDEO_002.MP4
├── VIDEO_003.MP4
└── .processed_videos.json     # Tracking file

Output Folder Structure:
E:\MALL_1-10-2025 output1\output\
├── VIDEO_001.toproj           # Project files
├── VIDEO_001.mp4              # Rendered videos
├── VIDEO_002.toproj
└── VIDEO_002.mp4
```

---

## 🔍 Troubleshooting

### **Common Issues:**

#### **1. Coordinates Not Working**
**Problem:** Mouse clicks wrong locations

**Solutions:**
- Ensure Telemetry Overlay is **maximized** (same as during tracking)
- Re-track coordinates using `node scripts/tracker.js`
- Verify screen resolution matches tracking session
- Check if UI layout changed after app update

#### **2. Same Video Processing Repeatedly**
**Problem:** Automation doesn't move to next video

**Solution:**
- Check if `.processed_videos.json` is being updated
- Verify write permissions in input folder
- Check console for tracking file errors

#### **3. Application Not Launching**
**Problem:** Telemetry Overlay doesn't start

**Solutions:**
- Verify `exePath` in `settings.json`
- Check if app is already running (close it first)
- Increase `appLoad` delay in settings

#### **4. File Dialog Timeout**
**Problem:** Automation fails at file selection

**Solutions:**
- Increase `fileDialogOpen` delay (currently 3000ms)
- Check if file paths are correct
- Ensure no popup dialogs are blocking

#### **5. Encoding Wait Issues**
**Problem:** Automation continues before encoding completes

**Solutions:**
- Adjust `encodingTimePerMB` (increase for slower systems)
- Increase `maxEncodingTime`
- Check video file sizes

### **Reset Automation:**

```bash
# Delete tracking file to reprocess all videos
cd "E:\MALL_1-10-2025 output1"
del .processed_videos.json
```

---

## 🚀 Future Enhancements

### **Planned Features:**

#### **1. Smart Rendering Detection** 🔥
- Monitor output folder for completed files
- Detect when rendering finishes
- Automatic file organization post-render
- **Status:** Feasible - requires file watcher

#### **2. Parallel Processing** ⚡
- Process multiple videos simultaneously
- Launch multiple Telemetry Overlay instances
- Manage resource allocation
- **Status:** Possible but complex - needs instance management

#### **3. Pattern Selection** 🎨
- Support multiple pattern files
- Pattern selection per video
- Pattern library management
- **Status:** Easy - add pattern parameter to workflow

#### **4. Custom Export Presets** ⚙️
- Save/load export configurations
- Per-project settings
- Batch apply different settings
- **Status:** Easy - extend settings.json

#### **5. GUI Dashboard** 📊
- Web-based control panel
- Real-time progress monitoring
- Queue management
- **Status:** Moderate - requires Express.js + React

#### **6. Error Recovery** 🛡️
- Automatic retry on failure
- Screenshot capture on error
- Crash detection and restart
- **Status:** Moderate - needs error classification

#### **7. Cloud Integration** ☁️
- Upload/download from cloud storage
- Distributed processing
- Remote monitoring
- **Status:** Advanced - requires cloud services

#### **8. Video Preview** 👁️
- Preview before processing
- Thumbnail generation
- Quality comparison
- **Status:** Moderate - needs video processing libs

#### **9. Scheduling** ⏰
- Time-based automation
- Off-peak processing
- Batch scheduling
- **Status:** Easy - add cron-like scheduler

#### **10. Notification System** 📧
- Email on completion
- SMS/Telegram alerts
- Progress notifications
- **Status:** Easy - integrate notification APIs

---

## 🛠️ Potential Integrations

### **What Can Be Integrated:**

#### **1. File Management**
- **Dropbox/Google Drive**: Auto-upload processed videos
- **FTP/SFTP**: Transfer to remote servers
- **Cloud Storage**: S3, Azure Blob Storage
- **Implementation**: Use respective SDKs

#### **2. Video Processing**
- **FFmpeg**: Pre-process videos (resize, format conversion)
- **HandBrake**: Compression before/after
- **OpenCV**: Frame analysis, quality check
- **Implementation**: Exec FFmpeg commands

#### **3. Monitoring & Analytics**
- **Prometheus**: Metrics collection
- **Grafana**: Visualization dashboards
- **ELK Stack**: Log aggregation
- **Implementation**: Export metrics to time-series DB

#### **4. Communication**
- **Slack**: Progress notifications
- **Discord**: Bot integration
- **Email**: SendGrid/Nodemailer
- **Implementation**: Webhook/API calls

#### **5. Database**
- **MongoDB**: Store processing history
- **PostgreSQL**: Relational data storage
- **Redis**: Queue management
- **Implementation**: ORM/direct driver

#### **6. Queue Systems**
- **RabbitMQ**: Job queuing
- **Bull**: Redis-based queue
- **Kafka**: Event streaming
- **Implementation**: Job queue libraries

---

## 📝 Technical Details

### **Dependencies:**

```json
{
  "@nut-tree-fork/nut-js": "^4.2.6",  // GUI automation
  "fs-extra": "^11.1.1",              // File operations
  "winston": "^3.8.2"                 // Logging
}
```

### **System Requirements:**
- **OS**: Windows 10/11
- **RAM**: 4GB minimum (8GB recommended for large videos)
- **Disk**: Space for original + processed videos
- **CPU**: Multi-core recommended for faster encoding

### **Performance:**
- **Processing Time**: ~2-5 minutes per video (depending on size)
- **Encoding Wait**: 500ms per MB (configurable)
- **Memory Usage**: ~200MB per instance

### **Limitations:**
- **Single monitor**: Coordinates are absolute screen positions
- **Window state**: App must be maximized
- **Sequential only**: One video at a time per instance
- **Windows only**: Coordinate system is OS-specific

---

## 📚 Additional Resources

### **Helper Scripts:**

```bash
# Coordinate tracking
node scripts/tracker.js

# Test coordinates visually
node scripts/testHighlight.js

# Verify setup
node verify-setup.js

# Test mouse clicks
node test-mouse-click.js
```

### **Configuration Files:**

- **settings.json**: Timing and path configuration
- **guiMap.json**: GUI element coordinates
- **.processed_videos.json**: Processing history

---

## 🤝 Contributing

To improve the automation:

1. **Update Coordinates**: Use tracker.js if UI changes
2. **Adjust Timings**: Modify delays in settings.json
3. **Add Features**: Extend telemetryAutomation.js
4. **Report Issues**: Document errors with screenshots

---

## 📄 License

Internal tool for video processing automation.

---

## 👨‍💻 Support

For issues or questions:
1. Check troubleshooting section
2. Review console output
3. Check `logs/automation.log`
4. Verify configuration files

---

**Last Updated**: 2025-01-27  
**Version**: 1.0.0  
**Status**: Production Ready ✅
