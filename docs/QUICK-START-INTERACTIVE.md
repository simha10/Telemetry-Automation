# 🚀 Quick Start - Interactive Mode

## ✅ **Run Automation:**

```bash
npm start
```

---

## 📋 **Interactive Prompts:**

### **1. Input Folder** (where videos come FROM)
```
📂 Input Folder Configuration:
   Current: E:\Videos\Input
   Use this path? (y/n): 
```

**Options:**
- Type `y` → Use default path
- Type `n` → Enter custom path (e.g., `D:\MyVideos`)

---

### **2. Output Folder** (where results go TO)
```
📂 Output Folder Configuration:
   Current: E:\Videos\Output
   Use this path? (y/n): 
```

**Options:**
- Type `y` → Use default path
- Type `n` → Enter custom path (e.g., `D:\Finished`)

---

### **3. Processed Folder** (where original videos are MOVED after processing)
```
📂 Processed Videos Folder Configuration:
   Default: E:\Videos\Input\Processed
   Use this path? (y/n): 
```

**Options:**
- Type `y` → Videos moved to `Input\Processed\`
- Type `n` → Enter custom path (e.g., `D:\Archive`)

**Why separate folder?**
- Keeps input folder clean
- Only unprocessed videos remain in input folder
- Easy to track what's done
- Can archive or backup processed videos separately

---

### **4. Pattern File**
```
📂 Pattern File Configuration:
   Current: E:\Patterns\default.pattern
   Use this path? (y/n): 
```

**Options:**
- Type `y` → Use default pattern
- Type `n` → Enter different pattern file path

---

### **5. Confirmation**
```
✅ Configuration Summary:
   Input:     E:\Videos\Input
   Output:    E:\Videos\Output
   Processed: D:\VideoArchive
   Pattern:   E:\Patterns\default.pattern

🚀 Start automation? (y/n): 
```

**Options:**
- Type `y` → Start processing!
- Type `n` → Cancel and exit

---

## 🎬 **What Happens:**

### **Folder Organization:**

**BEFORE:**
```
E:\Videos\Input\
  ├── video1.mp4
  ├── video2.mp4
  └── video3.mp4

D:\VideoArchive\
  (empty)

E:\Videos\Output\
  (empty)
```

**DURING (after video1):**
```
E:\Videos\Input\
  ├── video2.mp4    ← Only unprocessed remain
  └── video3.mp4

D:\VideoArchive\
  └── video1.mp4    ← Original moved here

E:\Videos\Output\
  ├── video1_output.toproj
  └── video1_output.mp4
```

**AFTER ALL:**
```
E:\Videos\Input\
  (empty - all processed!)

D:\VideoArchive\
  ├── video1.mp4
  ├── video2.mp4
  └── video3.mp4

E:\Videos\Output\
  ├── video1_output.toproj
  ├── video1_output.mp4
  ├── video2_output.toproj
  ├── video2_output.mp4
  ├── video3_output.toproj
  └── video3_output.mp4
```

---

## 💡 **Tips:**

### **Use Separate Processed Folder for:**
- **Archiving:** Move processed originals to external drive
- **Organization:** Keep different projects separate
- **Backup:** Easy to backup just processed videos
- **Cleanup:** Delete originals after verifying outputs

### **Example Setups:**

**Setup 1: Keep everything together**
```
Input:     E:\Videos\Input
Output:    E:\Videos\Output
Processed: E:\Videos\Input\Processed    ← Default
```

**Setup 2: Separate archive drive**
```
Input:     C:\ToProcess
Output:    C:\Finished
Processed: D:\Archive                    ← External drive
```

**Setup 3: Project-based**
```
Input:     E:\Projects\Race2024\Raw
Output:    E:\Projects\Race2024\Final
Processed: E:\Projects\Race2024\Archive
```

---

## 🔄 **Resume Automation:**

If automation stops (crash, power loss, etc.):

1. **Run again:** `npm start`
2. **Same settings:** Use same paths
3. **Continues:** Only processes videos still in input folder
4. **Safe:** Already processed videos are in Processed folder

---

## ⚠️ **Important:**

### **Before Running:**
1. ✅ Telemetry Overlay is MAXIMIZED
2. ✅ Pattern file exists
3. ✅ Input folder has videos
4. ✅ Don't touch mouse/keyboard during processing

### **During Running:**
- 🚫 Don't add/remove videos from input folder
- 🚫 Don't move mouse
- 🚫 Don't minimize Telemetry Overlay
- ✅ Let it run completely

---

## 📊 **Example Session:**

```bash
PS E:\Telemetry Automation> npm start

🎯 Telemetry Automation - Interactive Setup
============================================================

📂 Input Folder Configuration:
   Current: E:\Videos\Input
   Use this path? (y/n): y

📂 Output Folder Configuration:
   Current: E:\Videos\Output
   Use this path? (y/n): y

📂 Processed Videos Folder Configuration:
   Default: E:\Videos\Input\Processed
   Use this path? (y/n): n
   Enter processed folder path: D:\VideoArchive

📂 Pattern File Configuration:
   Current: E:\Patterns\default.pattern
   Use this path? (y/n): y

============================================================

✅ Configuration Summary:
   Input:     E:\Videos\Input
   Output:    E:\Videos\Output
   Processed: D:\VideoArchive
   Pattern:   E:\Patterns\default.pattern

🚀 Start automation? (y/n): y

============================================================

🎬 Starting Automation...

============================================================
📹 Processing: race_001.mp4
   (5 videos remaining)
============================================================

✅ Completed race_001

📦 Moving race_001.mp4 to Processed folder...
✅ Moved successfully!

============================================================
📹 Processing: race_002.mp4
   (4 videos remaining)
============================================================

...

============================================================

🎉 Automation Complete!

   ✅ Successfully processed: 5 videos

📁 Results saved to: E:\Videos\Output
📁 Processed videos moved to: D:\VideoArchive

============================================================
```

---

## 🎯 **That's It!**

**Three simple steps:**
1. Run `npm start`
2. Answer 4 questions (or just press `y` for defaults)
3. Let it run!

**Results:**
- ✅ Processed videos → Output folder
- ✅ Original videos → Processed folder
- ✅ Clean input folder for next batch
