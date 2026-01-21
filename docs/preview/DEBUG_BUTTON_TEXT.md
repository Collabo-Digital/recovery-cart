# Debug: Button Text Not Showing

## Quick Test Steps

### 1. Open Browser Console (F12)

### 2. Type in Button Text Field

Type something like: `Hello WhatsApp`

### 3. Check Console Messages

You should see:

```
[Admin] ===== Sending Config =====
[Admin] Position: bottom-right
[Admin] Phone: +1234567890
[Admin] Button Text: Hello WhatsApp
[Admin] Button Text Length: 15
[Admin] Chat Text: ...
[Admin] Full Config: { ... }
[Admin] ===========================
[Admin] ✅ Message sent successfully

[Preview] Message received: {...}
[Preview] Raw config received: {...}
[Preview] Button text value: Hello WhatsApp
[Preview] Phone number value: +1234567890
[Preview] Final button text: Hello WhatsApp
[Preview] Full config set: {...}
[Preview] Removing existing widget
[Preview] Reinitializing widget with config: {...}
[Preview] ✅ Widget created successfully
```

## What to Look For

### ✅ Good Signs:
1. `[Admin] Button Text: Hello WhatsApp` - Shows your text
2. `[Admin] Button Text Length: 15` - Shows text has content
3. `[Preview] Button text value: Hello WhatsApp` - Preview receives it
4. `[Preview] ✅ Widget created successfully` - Widget was created

### ❌ Bad Signs:
1. `[Admin] Button Text: ""` - Empty string (field is empty)
2. `[Admin] Button Text: undefined` - Not set
3. `[Preview] ❌ Widget not created` - Widget failed to create
4. Red error messages

## Common Issues

### Issue 1: Button Text Shows as Empty

**Console shows**: `[Admin] Button Text: ""`

**Why**: The field is actually empty in the admin

**Fix**: Type something in the "Button Text" field

---

### Issue 2: Widget Shows Icon Only (No Text)

**Console shows**: 
```
[Admin] Button Text: Hello WhatsApp
[Preview] Button text value: Hello WhatsApp
[Preview] ✅ Widget created successfully
```

But widget only shows icon...

**Why**: Widget CSS is hiding text or widget validation failed

**Check**:
1. Look at widget HTML in console: `[Preview] Widget HTML: ...`
2. Should contain: `<span class="whatsapp-text">Hello WhatsApp</span>`

**If HTML doesn't contain the span**:
- Widget validation failed
- Check if phone number is valid
- Rebuild widget: `cd widgets && npm run build`

---

### Issue 3: Text Updates But Widget Doesn't Change

**Console shows all good messages but widget doesn't update**

**Fix**:
1. Check if widget is actually being removed and recreated
2. Look for: `[Preview] Removing existing widget`
3. Look for: `[Preview] Reinitializing widget`

If these messages appear but widget doesn't change:
```bash
cd widgets
npm run build
cd ..
npm run dev
```

---

### Issue 4: No Console Messages at All

**Nothing shows when you type**

**Why**: JavaScript error or iframe not loaded

**Fix**:
1. Refresh the page (F5)
2. Check for red error messages in console
3. Restart server: `npm run dev`

---

## Step-by-Step Debug

### Step 1: Clear Console
Click the 🚫 icon in console to clear old messages

### Step 2: Type in Field
Type: `Test Button Text`

### Step 3: Check Admin Messages
Should see:
```
[Admin] ===== Sending Config =====
[Admin] Button Text: Test Button Text
```

**If you DON'T see this**:
- Field is not connected properly
- Refresh page and try again

### Step 4: Check Preview Messages
Should see:
```
[Preview] Button text value: Test Button Text
[Preview] Final button text: Test Button Text
```

**If you DON'T see this**:
- Iframe not receiving messages
- Check: `[Admin] ✅ Message sent successfully`
- If not sent, iframe might not be loaded

### Step 5: Check Widget Creation
Should see:
```
[Preview] ✅ Widget created successfully
[Preview] Widget HTML: <svg...><span class="whatsapp-text">Test Button Text</span>
```

**If HTML doesn't contain your text**:
- Widget validation issue
- Rebuild widget: `cd widgets && npm run build`

### Step 6: Visual Check
Look at the preview on the right side:
- Should see green button
- Should see your text next to WhatsApp icon

**If you see icon only (no text)**:
- Check console for `Widget HTML`
- If HTML has the text but it's not visible, it's a CSS issue
- Rebuild widget: `cd widgets && npm run build`

---

## Quick Fixes

### Fix 1: Rebuild Everything
```bash
cd widgets
npm run build
cd ..
npm run dev
```
Then refresh browser (Ctrl+Shift+R)

### Fix 2: Check Default Values
The preview adds defaults if fields are empty:
- Empty phone → uses `+1234567890`
- Empty text → widget decides (might show icon only)

To always see text, type something in the field!

### Fix 3: Verify Widget Bundle
```bash
# Check if file exists
ls public/widgets/recovery-cart-widget.iife.js

# Should show file size and date
# If not found, rebuild: cd widgets && npm run build
```

---

## Expected Console Output (Full Example)

When you type "Chat Now" in button text field:

```
[Admin] ===== Sending Config =====
[Admin] Position: bottom-right
[Admin] Phone: +1234567890
[Admin] Button Text: Chat Now
[Admin] Button Text Length: 8
[Admin] Chat Text: Hi! I need help.
[Admin] Full Config: {
  "position": "bottom-right",
  "phoneNumber": "+1234567890",
  "buttonText": "Chat Now",
  "buttonColor": {...},
  "chatText": "Hi! I need help."
}
[Admin] ===========================
[Admin] ✅ Message sent successfully

[Preview] Message received: {type: 'WIDGET_CONFIG_UPDATE', config: {...}}
[Preview] Raw config received: {position: 'bottom-right', phoneNumber: '+1234567890', buttonText: 'Chat Now', ...}
[Preview] Button text value: Chat Now
[Preview] Phone number value: +1234567890
[Preview] Final button text: Chat Now
[Preview] Full config set: {
  "shop": "preview.myshopify.com",
  "isActive": true,
  "widgetSettings": {
    "position": "bottom-right",
    "phoneNumber": "+1234567890",
    "buttonText": "Chat Now",
    ...
  }
}
[Preview] Removing existing widget
[Preview] Reinitializing widget with config: {...}
[Preview] ✅ Widget created successfully
[Preview] Widget HTML: <svg class="whatsapp-icon"...></svg><span class="whatsapp-text">Chat Now</span>
```

If you see all of this, **it's working!** ✅

---

## Still Not Working?

1. **Copy the console output** and check against the example above
2. **Look for differences** - what's missing?
3. **Check for red errors** - they tell you what's wrong
4. **Try the nuclear option**:
   ```bash
   cd widgets
   rm -rf node_modules
   npm install
   npm run build
   cd ..
   npm run dev
   ```

---

**The console messages will tell you exactly what's wrong!** 🔍
