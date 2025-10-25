# Smart Encoding Wait Feature

## Overview
The automation now intelligently waits for Telemetry Overlay to complete video encoding/metadata optimization before proceeding to the Pattern button.

## How It Works

### 1. **File Size Detection**
- Automatically detects the input video file size
- Calculates estimated encoding time based on file size

### 2. **Dynamic Wait Time**
The wait time is calculated using this formula:
```
estimatedTime = fileSize (MB) × encodingTimePerMB
```
- Clamped between `minEncodingTime` and `maxEncodingTime`

### 3. **Progress Monitoring**
- Shows real-time progress updates
- Displays remaining time
- Updates every 2 seconds (configurable)

## Configuration (settings.json)

```json
"delays": {
  "encodingTimePerMB": 500,      // Milliseconds per MB
  "minEncodingTime": 5000,       // Minimum wait: 5 seconds
  "maxEncodingTime": 120000,     // Maximum wait: 2 minutes
  "encodingCheckInterval": 2000  // Progress update interval
}
```

### Tuning Parameters

#### `encodingTimePerMB` (default: 500ms)
- **Faster PC**: Reduce to `300-400`
- **Slower PC**: Increase to `700-1000`
- **SSD**: Use lower values
- **HDD**: Use higher values

#### `minEncodingTime` (default: 5000ms)
- Minimum wait even for tiny files
- Ensures UI has time to stabilize

#### `maxEncodingTime` (default: 120000ms)
- Safety cap to prevent infinite waiting
- Adjust based on your largest video files

#### `encodingCheckInterval` (default: 2000ms)
- How often progress updates
- Lower = more frequent updates (more verbose)

## Example Calculations

| File Size | Time Per MB | Estimated Wait |
|-----------|-------------|----------------|
| 10 MB     | 500ms       | 5 seconds      |
| 50 MB     | 500ms       | 25 seconds     |
| 100 MB    | 500ms       | 50 seconds     |
| 200 MB    | 500ms       | 100 seconds    |
| 300 MB    | 500ms       | 120 seconds (capped) |

## Console Output Example

```
🔄 Step 3.5: Waiting for video encoding...
   📊 Video size: 45.32 MB
   ⏱️  Estimated encoding time: 22.7s

⏳ Waiting for video encoding/optimization...
   Progress: 45% | Remaining: ~12s   
   Progress: 90% | Remaining: ~2s    
   ✅ Encoding should be complete!

   ⏳ Adding 2s buffer for UI to stabilize...
```

## Fine-Tuning Guide

### Step 1: Test with Known Files
1. Run automation with a known file size
2. Manually time how long encoding actually takes
3. Calculate: `actualTime / fileSize = timePerMB`

### Step 2: Adjust Settings
```json
// Example: 100MB file took 35 seconds
// 35000ms / 100MB = 350ms per MB
"encodingTimePerMB": 350
```

### Step 3: Test Edge Cases
- Very small files (< 10MB)
- Very large files (> 200MB)
- Adjust min/max if needed

## Troubleshooting

### "Pattern button clicked too early"
**Solution**: Increase `encodingTimePerMB`
```json
"encodingTimePerMB": 700  // Was 500
```

### "Waiting too long unnecessarily"
**Solution**: Decrease `encodingTimePerMB`
```json
"encodingTimePerMB": 300  // Was 500
```

### "Large files timeout"
**Solution**: Increase `maxEncodingTime`
```json
"maxEncodingTime": 180000  // 3 minutes instead of 2
```

## Technical Details

The system:
1. Reads video file size using `fs.statSync()`
2. Calculates estimated time: `size × timePerMB`
3. Enters polling loop with progress updates
4. Waits until estimated time elapses
5. Adds 2-second buffer for UI stabilization
6. Proceeds to click Pattern button

This ensures reliable automation regardless of video file size!
