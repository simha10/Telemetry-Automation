# 🛡️ Stuck Detection and Error Recovery Guide

## 🎯 Overview

This system includes **intelligent stuck detection** and **automatic recovery** to handle scenarios where the render process freezes, crashes, or fails to complete.

---

## 🚨 Problem Scenarios Handled

### **1. Export Never Starts**
**Symptom:** Output file never appears  
**Detection:** No file after 10 minutes  
**Recovery:** Kill app, skip to next video

### **2. Render Freezes Mid-Process**
**Symptom:** File size stops growing but render not complete  
**Detection:** No size change for 10 consecutive minutes  
**Recovery:** Kill app, save partial file for review

### **3. Application Crashes**
**Symptom:** File appears but disappears  
**Detection:** File existed but now missing  
**Recovery:** Kill processes, log error

### **4. Render Timeout**
**Symptom:** Render takes longer than 2 hours  
**Detection:** Exceeds maximum timeout  
**Recovery:** Kill app, check if partial file exists

---

## ⚙️ Configuration

### **Stuck Detection Settings:**

```json
{
  "delays": {
    "renderTimeout": 7200000,      // 120 minutes absolute max
    "renderCheckInterval": 60000,  // Check every 1 minute
    "renderStabilityDuration": 60000,  // Normal completion: 1 min stable
    "maxStuckChecks": 10           // Stuck if no change for 10 checks (10 min)
  }
}
```

---

## 🔍 Detection Logic

### **Stuck vs. Normal Completion:**

```
RENDERING (Size Growing):
Check #1: 125 MB    → OK, still rendering
Check #2: 456 MB    → OK, +331 MB
Check #3: 892 MB    → OK, +436 MB
```

```
NORMAL COMPLETION (Size Stable):
Check #4: 1024 MB   → No change (1/1 stable checks needed)
Check #5: 1024 MB   → Still stable, COMPLETE! ✅
```

```
STUCK DETECTION (Size Not Changing):
Check #4: 125 MB    → No change (1/10 stuck threshold)
Check #5: 125 MB    → No change (2/10)
Check #6: 125 MB    → No change (3/10)
...
Check #13: 125 MB   → No change (10/10) 🚨 STUCK!
```

### **Key Difference:**

| Scenario | Size | Checks | Status |
|----------|------|--------|--------|
| **Normal completion** | Large (e.g., 1024 MB) | 1-2 checks | ✅ Complete |
| **Stuck render** | Small (e.g., 125 MB) | 10+ checks | 🚨 Stuck |

**Logic:** If file size hasn't changed for 10 consecutive checks AND it hasn't reached stability duration yet → **Stuck!**

---

## 📊 Scenarios and Recovery

### **Scenario 1: Export Button Didn't Work**

**What Happens:**
```
⏱️  Step 14: Waiting for render to complete...

🎬 Monitoring render completion...
   Output file: VIDEO_001.mp4
   Stuck detection: 10 consecutive checks with no change

   ⏳ Waiting for file to appear... 0m 45s elapsed (Check #1)
   ⏳ Waiting for file to appear... 1m 50s elapsed (Check #2)
   ⏳ Waiting for file to appear... 10m 15s elapsed (Check #10)

   ⚠️  WARNING: File hasn't appeared after 10 minutes
   🔍 Possible issues:
      - Export button wasn't clicked properly
      - Application crashed or froze
      - Incorrect output path

   🛑 Attempting recovery...
```

**Recovery Actions:**
1. Kill all Telemetry Overlay processes
2. Log error
3. Skip to next video
4. Continue batch processing

---

### **Scenario 2: Render Freezes at 125MB**

**What Happens:**
```
   ✅ Output file detected! Monitoring size every 1 minute...

   📊 Check #3 | Size: 125.34 MB | +125.34 MB since last check
   ⏱️  Elapsed: 3m 12s | Still rendering...

   ⏸️  Check #4 | File stable at 125.34 MB
   🔍 No size change detected | Confirming stability: 1.0 minute(s) remaining
   ℹ️  Consecutive stable checks: 1/10 (stuck threshold)

   ⏸️  Check #5 | File stable at 125.34 MB
   ℹ️  Consecutive stable checks: 2/10 (stuck threshold)

   ...

   ⏸️  Check #13 | File stable at 125.34 MB
   ℹ️  Consecutive stable checks: 10/10 (stuck threshold)

   🚨 RENDER APPEARS STUCK!
   📊 File size: 125.34 MB
   ⏱️  No size change for 10 minutes (10 consecutive checks)
   ⚠️  This is longer than normal rendering pause

   🔍 Possible issues:
      - Application froze or crashed
      - Render process hung
      - Insufficient disk space
      - System resources exhausted

   🛑 Attempting recovery...
```

**Recovery Actions:**
1. Detect stuck state (10 consecutive checks with no change)
2. Kill Telemetry Overlay processes
3. Check if output file exists:
   - **If > 0 bytes:** Save as partial render for manual review
   - **If 0 bytes:** Delete empty file
4. Mark video as FAILED
5. Continue to next video

---

### **Scenario 3: Application Crashes Mid-Render**

**What Happens:**
```
   ✅ Output file detected! Monitoring size every 1 minute...

   📊 Check #5 | Size: 456.78 MB | +331.44 MB since last check
   ⏱️  Elapsed: 5m 18s | Still rendering...

   ❌ Output file disappeared during rendering
```

**Recovery Actions:**
1. Immediate detection of file disappearance
2. Kill any remaining processes
3. Log critical error
4. Skip to next video

---

### **Scenario 4: Slow But Successful Render**

**What Happens:**
```
   📊 Check #3 | Size: 125.34 MB | +25.34 MB since last check
   ℹ️  Consecutive stable checks: 0/10 (reset, size changed)

   📊 Check #4 | Size: 145.67 MB | +20.33 MB since last check
   ℹ️  Consecutive stable checks: 0/10 (reset, size changed)

   ... (continues growing slowly) ...

   📊 Check #40 | Size: 1024.56 MB | +15.22 MB since last check
   ℹ️  Consecutive stable checks: 0/10 (reset, size changed)

   ⏸️  Check #41 | File stable at 1024.56 MB
   ℹ️  Consecutive stable checks: 1/10 (stuck threshold)

   ⏸️  Check #42 | File stable at 1024.56 MB
   ✅ File size stable for 1 minute(s)! → COMPLETE!
```

**No Recovery Needed:** System correctly distinguishes slow render from stuck render.

---

## 🎬 Console Output Examples

### **Export Stuck (File Never Appears):**

```bash
⏱️  Step 14: Waiting for render to complete...

🎬 Monitoring render completion...
   Max wait time: 120 minutes
   Stuck detection: 10 consecutive checks with no change

   ⏳ Waiting for file to appear... 10m 15s elapsed (Check #10)

   ⚠️  WARNING: File hasn't appeared after 10 minutes
   
   ⚠️  Render monitoring error: Export stuck: Output file never appeared after 10 minutes

   🛑 RECOVERY MODE ACTIVATED
   ℹ️  The render appears stuck or failed to start

   🛠️  Attempting to recover...
   🔴 Force-killing Telemetry Overlay...

🛑 Killing Telemetry Overlay processes...
   ✅ Processes terminated successfully

   ❌ No output file created - export never started

   ⏩ Skipping to next video...
```

---

### **Render Frozen Mid-Process:**

```bash
   📊 Check #3 | Size: 125.34 MB | +125.34 MB since last check
   ⏱️  Elapsed: 3m 12s | Still rendering...

   ⏸️  Check #4 | File stable at 125.34 MB
   🔍 No size change detected | Confirming stability: 1.0 minute(s) remaining
   ℹ️  Consecutive stable checks: 1/10 (stuck threshold)

   ⏸️  Check #13 | File stable at 125.34 MB
   🔍 No size change for 10 checks | Confirming stability: 1.0 minute(s) remaining

   🚨 RENDER APPEARS STUCK!
   📊 File size: 125.34 MB
   ⏱️  No size change for 10 minutes (10 consecutive checks)

   ⚠️  Render monitoring error: Render stuck: No file size change for 10 minutes

   🛑 RECOVERY MODE ACTIVATED
   🔴 Force-killing Telemetry Overlay...

   📀 Output file exists: 125.34 MB
   ℹ️  File has data - partial render may be salvageable
   ⚠️  Marking this video as FAILED for manual review

   ⏩ Skipping to next video...
```

---

## 🔧 Tuning Stuck Detection

### **More Aggressive (Faster Detection):**

For systems where renders should never pause:

```json
{
  "delays": {
    "maxStuckChecks": 5  // 5 minutes of no change = stuck
  }
}
```

**Use when:** You're confident renders never pause naturally

---

### **More Patient (Slower Detection):**

For complex renders that may pause briefly:

```json
{
  "delays": {
    "maxStuckChecks": 15  // 15 minutes of no change = stuck
  }
}
```

**Use when:** Large files or slow system, renders may pause

---

### **Very Conservative (Maximum Patience):**

For unreliable systems or very large files:

```json
{
  "delays": {
    "maxStuckChecks": 20,          // 20 minutes no change
    "renderCheckInterval": 120000  // Check every 2 minutes
  }
}
```

**Stuck detection:** 40 minutes of no change (20 × 2min)

---

## 📈 Decision Tree

```
File appears?
├─ NO (after 10min) → 🚨 Export stuck → Kill app, skip video
└─ YES
   ├─ Size growing? → ✅ Continue monitoring
   └─ Size stable?
      ├─ Been stable < 1min? → ⏳ Keep monitoring
      ├─ Been stable = 1min? → ✅ Normal completion
      └─ Been stable > 10min (before reaching 1min requirement)?
         └─ 🚨 Stuck! → Kill app, save partial if >0 bytes
```

---

## ✅ Success Indicators

### **Healthy Render:**
```
✅ File appears within 1-2 minutes
✅ Size grows steadily every check
✅ Eventually stabilizes at large size
✅ Completes normally
```

### **Detected & Recovered:**
```
⚠️  File never appears → Detected, app killed
⚠️  Size stuck at small value → Detected, partial saved
⚠️  File disappeared → Detected, error logged
⚠️  Timeout exceeded → Detected, cleanup performed
```

---

## 🛡️ Safety Features

### **1. Non-Destructive Recovery**
- Partial renders > 0 bytes are saved
- Manual review possible
- Original video never touched

### **2. Detailed Logging**
- Every stuck detection logged
- Recovery actions documented
- File sizes recorded

### **3. Batch Processing Continues**
- One failure doesn't stop batch
- Next video starts automatically
- Summary at end shows failures

### **4. Multiple Detection Methods**
```
✅ File never appears (10 min)
✅ File size stuck (10 min)
✅ File disappeared
✅ Absolute timeout (2 hours)
```

---

## 📊 Batch Processing Impact

### **Without Stuck Detection:**
```
Video 1: Success ✅
Video 2: Stuck → Waits 2 hours → Timeout ❌
Video 3: Never processes (waiting for #2)
Video 4-10: Never process
Result: 1 success, batch failed
```

### **With Stuck Detection:**
```
Video 1: Success ✅
Video 2: Stuck → Detected in 10min → Recovered → Skipped ⚠️
Video 3: Success ✅
Video 4: Success ✅
...
Video 10: Success ✅
Result: 9 successes, 1 failure (reviewed later)
```

**Time saved:** 110 minutes on Video 2 alone!

---

## 🎯 Summary

### **Stuck Detection:**
- ✅ File never appears: 10 minutes
- ✅ Size unchanging: 10 consecutive checks
- ✅ File disappears: Immediate
- ✅ Absolute timeout: 120 minutes

### **Recovery Actions:**
- ✅ Kill all processes
- ✅ Save partial renders
- ✅ Log detailed errors
- ✅ Continue to next video

### **Benefits:**
- ✅ Batch processing resilient
- ✅ No manual intervention needed
- ✅ Partial work preserved
- ✅ Clear error reporting

---

**Version:** 2.3.0  
**Last Updated:** 2025-01-27  
**Status:** Production-Ready with Intelligent Error Recovery ✅
