# Simple Troubleshooting Guide

## Quick Fixes (Try These First!)

### Fix 1: Rebuild Everything
```bash
cd widgets
npm run build
cd ..
npm run dev
```
**This fixes 90% of problems!**

---

## Specific Problems

### 1. Text Not Showing in Preview

**Problem**: You type button text but it doesn't appear in the widget

**Why**: Widget needs valid phone number to show text

**Fix**: 
- Enter a phone number first (e.g., `+1234567890`)
- OR the preview will use default phone number automatically

**What happens now**:
- Preview adds default phone `+1234567890` if empty
- Preview adds default text `Chat with us` if empty
- Widget will ALWAYS show, even with empty fields

---

### 2. Preview is Blank/White

**Problem**: Right side shows blank white screen

**Why**: Widget bundle file is missing

**Fix**:
```bash
cd widgets
npm run build
cd ..
```

**Check if it worked**:
```bash
# Windows
dir public\widgets\recovery-cart-widget.iife.js

# Mac/Linux
ls public/widgets/recovery-cart-widget.iife.js
```

If file exists, restart server:
```bash
npm run dev
```

---

### 3. Changes Don't Update

**Problem**: You change color/text but preview doesn't update

**Steps to fix**:

1. **Open Browser Console** (Press F12)
2. **Look for messages**:
   - ✅ Good: `[Admin] Sending config to iframe`
   - ✅ Good: `[Preview] Message received`
   - ❌ Bad: Red error messages

3. **If you see errors**:
   ```bash
   # Rebuild and restart
   cd widgets
   npm run build
   cd ..
   npm run dev
   ```

4. **If no messages at all**:
   - Refresh the page (F5)
   - Hard refresh (Ctrl+Shift+R)

---

### 4. Widget Doesn't Appear

**Problem**: Preview loads but no widget button shows

**Check Console** (F12):

**If you see**: `RecoveryCartWidget available: false`
```bash
# Widget not loaded, rebuild it
cd widgets
npm run build
cd ..
npm run dev
```

**If you see**: `RecoveryCartWidget.init not available`
```bash
# Widget bundle is broken, rebuild
cd widgets
npm run build
```

**If you see**: `Widget bundle not found`
```bash
# File is missing, build it
cd widgets
npm install  # First time only
npm run build
```

---

### 5. Colors Don't Match

**Problem**: Color picker shows one color, widget shows different color

**Why**: Color conversion issue

**Check**:
1. Open console (F12)
2. Look for: `[Preview] Updating config: {...}`
3. Check `buttonColor` values:
   - `hue`: should be 0-360
   - `saturation`: should be 0-1
   - `brightness`: should be 0-1

**Fix**: Usually fixes itself on next change. If not:
```bash
npm run dev
```

---

### 6. Position Doesn't Change

**Problem**: Widget stays in same position when you change left/right

**Check Console**:
- Look for: `position: "bottom-left"` or `position: "bottom-right"`

**Fix**:
1. Change position dropdown
2. Check console for update message
3. If no message, refresh page

---

### 7. Phone Number Issues

**Problem**: Phone number doesn't update or shows error

**Valid formats**:
- ✅ `+1234567890`
- ✅ `+44 1234 567890`
- ✅ `1234567890`
- ❌ `abc123` (letters not allowed)

**Preview behavior**:
- If empty → uses `+1234567890` automatically
- If invalid → still shows in preview (for testing)
- In production → validates phone number

---

### 8. Server Won't Start

**Problem**: `npm run dev` shows errors

**Common errors**:

**Error**: `Port 3000 already in use`
```bash
# Kill the process and restart
# Windows: Close terminal and open new one
# Mac/Linux: killall node
npm run dev
```

**Error**: `Module not found`
```bash
npm install
npm run dev
```

**Error**: `Cannot find module 'fs'`
- This shouldn't happen, fs is built-in
- Try restarting your terminal/computer

---

## Debug Checklist

Use this to figure out what's wrong:

### Step 1: Check Files Exist
```bash
# Check widget bundle
ls public/widgets/recovery-cart-widget.iife.js

# Should show the file
# If "file not found" → run: cd widgets && npm run build
```

### Step 2: Check Console Messages

**Open browser console** (F12) and look for:

✅ **Good messages**:
```
[Preview] Widget script loaded
[Preview] RecoveryCartWidget available: true
[Admin] Iframe is ready
[Admin] Sending config to iframe
[Preview] Message received
[Preview] Updating config
[Preview] Reinitializing widget
```

❌ **Bad messages** (errors in red):
```
Widget bundle not found
RecoveryCartWidget available: false
Failed to load
```

### Step 3: Visual Check

**What you should see**:
- Left side: Form with settings
- Right side: Purple-blue gradient background
- Right side: White phone mockup
- Right side: Widget button (green by default)

**If you don't see this**:
1. Rebuild widget
2. Restart server
3. Refresh browser

---

## The "Nuclear Option"

If nothing works, do this:

```bash
# 1. Stop the server (Ctrl+C)

# 2. Clean everything
cd widgets
rm -rf node_modules  # Mac/Linux
# OR
rmdir /s node_modules  # Windows

# 3. Reinstall
npm install

# 4. Build
npm run build

# 5. Go back
cd ..

# 6. Start server
npm run dev

# 7. Hard refresh browser (Ctrl+Shift+R)
```

This fixes almost everything!

---

## Understanding Console Messages

### Normal Flow (Everything Working):

```
1. [Preview] Widget script loaded
   ↓ Widget code is injected
   
2. [Preview] RecoveryCartWidget available: true
   ↓ Widget is ready to use
   
3. [Preview] Iframe loaded, notifying parent
   ↓ Preview tells admin it's ready
   
4. [Admin] Message received: {type: 'IFRAME_READY'}
   ↓ Admin receives ready signal
   
5. [Admin] Iframe is ready
   ↓ Admin is ready to send config
   
6. [Admin] Sending config to iframe: {...}
   ↓ Admin sends current settings
   
7. [Preview] Message received: {...}
   ↓ Preview receives settings
   
8. [Preview] Updating config: {...}
   ↓ Preview updates widget config
   
9. [Preview] Reinitializing widget
   ↓ Widget restarts with new settings
   
10. Widget appears! ✨
```

### Error Flow (Something Wrong):

```
1. [Preview] Widget script loaded
   ↓
2. [Preview] RecoveryCartWidget available: false
   ❌ PROBLEM: Widget didn't load
   
   FIX: cd widgets && npm run build
```

OR

```
1. [Admin] Sending config to iframe: {...}
   ↓
2. (no message from preview)
   ❌ PROBLEM: Preview not receiving messages
   
   FIX: Refresh page, check iframe loaded
```

---

## Quick Reference

| Problem | Quick Fix |
|---------|-----------|
| Blank preview | `cd widgets && npm run build` |
| Text not showing | Enter phone number or let preview use default |
| Changes don't update | Refresh page (F5) |
| Widget not appearing | Rebuild: `cd widgets && npm run build` |
| Server error | Restart: Stop (Ctrl+C) then `npm run dev` |
| Colors wrong | Change color again |
| Console errors | Rebuild and restart |

---

## Still Not Working?

1. **Read console messages** - They tell you what's wrong
2. **Check file exists** - `public/widgets/recovery-cart-widget.iife.js`
3. **Try the nuclear option** - Clean reinstall (see above)
4. **Check other docs** - More details in other .md files

---

## Success Indicators

You know it's working when:
- ✅ Gradient background shows
- ✅ Widget button appears
- ✅ Changes update instantly
- ✅ Console shows success messages
- ✅ No red errors in console

**If you see all these, you're good to go!** 🎉
