# Simple Preview Guide - Easy to Understand

## What This Does

Shows a **live preview** of your WhatsApp widget. When you change settings in the admin panel, you see the changes **instantly** in the preview - no need to save or refresh!

## Quick Setup

### Step 1: Build the Widget
```bash
cd widgets
npm run build
cd ..
```

This creates the widget file that will be shown in the preview.

### Step 2: Start the Server
```bash
npm run dev
```

### Step 3: Open Admin Panel
Open your app in Shopify admin and you'll see:
- **Left side**: Settings form
- **Right side**: Live preview

## How It Works (Simple Explanation)

```
┌─────────────────────────────────────────────────────────────┐
│                     Admin Panel                              │
│                                                               │
│  ┌──────────────────┐         ┌─────────────────────────┐  │
│  │   Settings       │         │   Live Preview          │  │
│  │                  │         │                         │  │
│  │  Position: ▼     │────────▶│   [Shows widget here]   │  │
│  │  Color: 🎨       │         │                         │  │
│  │  Text: ___       │         │   Updates instantly!    │  │
│  │  Phone: ___      │         │                         │  │
│  └──────────────────┘         └─────────────────────────┘  │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### What Happens:
1. You type or change something
2. Admin panel sends the new settings to the preview
3. Preview updates the widget immediately
4. You see the change in less than 0.1 seconds!

## What Updates in Real-Time

✅ **Position** - Left or Right
✅ **Color** - Any color you pick
✅ **Button Text** - What the button says
✅ **Phone Number** - WhatsApp number
✅ **Chat Text** - Pre-filled message

## Testing It

### Test 1: Change Color
1. Click the color picker
2. Drag to a new color
3. **Watch**: Widget color changes instantly!

### Test 2: Change Position
1. Select "Bottom Left" or "Bottom Right"
2. **Watch**: Widget moves to new position!

### Test 3: Change Text
1. Type in "Button Text" field
2. **Watch**: Widget text updates as you type!

### Test 4: Change Phone Number
1. Enter a phone number
2. **Watch**: Widget updates!

## How to Check If It's Working

### Open Browser Console (Press F12)

You should see these messages:

```
✅ [Preview] Widget script loaded
✅ [Preview] RecoveryCartWidget available: true
✅ [Preview] Iframe loaded, notifying parent
✅ [Admin] Iframe is ready
✅ [Admin] Sending config to iframe: {...}
✅ [Preview] Message received: {...}
✅ [Preview] Updating config: {...}
✅ [Preview] Reinitializing widget
```

If you see these messages, **it's working!**

## Common Problems & Easy Fixes

### Problem 1: Preview is blank
**Why**: Widget file not built
**Fix**:
```bash
cd widgets
npm run build
cd ..
npm run dev
```

### Problem 2: Changes don't show
**Why**: Browser console will show the error
**Fix**: 
1. Press F12 to open console
2. Look for red error messages
3. Usually means you need to rebuild the widget

### Problem 3: Widget doesn't appear
**Why**: Widget bundle missing
**Fix**:
```bash
cd widgets
npm run build
```

## File Structure (Simple)

```
recovery-cart/
│
├── app/routes/
│   ├── app._index.jsx          ← Admin panel (left side)
│   └── widget-preview.jsx      ← Preview iframe (right side)
│
├── public/widgets/
│   └── recovery-cart-widget.iife.js  ← Widget bundle (must exist!)
│
└── widgets/
    └── (source code)           ← Build this to create the bundle
```

## Technical Details (Simple)

### How Admin Talks to Preview:

```javascript
// Admin Panel sends message:
"Hey Preview, here's the new config!"

// Preview receives and responds:
"Got it! Updating widget now..."

// Widget updates:
"Done! New settings applied!"
```

### The Real Code:

**Admin Panel** (`app._index.jsx`):
```javascript
// When settings change, send to preview
iframeRef.current.contentWindow.postMessage({
  type: 'WIDGET_CONFIG_UPDATE',
  config: { position, phoneNumber, buttonText, buttonColor, chatText }
}, '*');
```

**Preview** (`widget-preview.jsx`):
```javascript
// Listen for updates
window.addEventListener('message', function(event) {
  if (event.data.type === 'WIDGET_CONFIG_UPDATE') {
    // Update config
    window.__recovery_cart_config__ = {
      shop: 'preview.myshopify.com',
      isActive: true,
      widgetSettings: event.data.config
    };
    
    // Restart widget with new config
    RecoveryCartWidget.init();
  }
});
```

## Default Values for Preview

The preview automatically adds default values if fields are empty:

- **Phone Number**: If empty → uses `+1234567890`
- **Button Text**: If empty → uses `Chat with us`

This ensures the widget always shows in the preview, even if you haven't filled in all fields yet.

## Success Checklist

Before you consider it working, check:

- [ ] Widget bundle exists (`public/widgets/recovery-cart-widget.iife.js`)
- [ ] Dev server is running (`npm run dev`)
- [ ] Admin panel loads without errors
- [ ] Preview shows gradient background
- [ ] Widget appears in preview
- [ ] Changing color updates instantly
- [ ] Changing position updates instantly
- [ ] Changing text updates instantly
- [ ] Console shows success messages (no red errors)

## Performance

- **Initial Load**: Less than 0.5 seconds
- **Update Speed**: Less than 0.1 seconds
- **Feels**: Instant!

## Key Files Explained

### 1. `app/routes/widget-preview.jsx`
**What it does**: Creates the preview iframe
**How**: 
- Reads the widget bundle file
- Injects it into an HTML page
- Listens for config updates
- Updates the widget when settings change

### 2. `app/routes/app._index.jsx`
**What it does**: Admin panel with settings form
**How**:
- Shows form fields for settings
- Sends updates to preview iframe
- Listens for iframe ready signal

### 3. `public/widgets/recovery-cart-widget.iife.js`
**What it does**: The actual widget code
**How**: Built from source code in `widgets/` folder

## Tips

1. **Always build first**: Run `cd widgets && npm run build` before testing
2. **Check console**: Press F12 to see what's happening
3. **Restart if stuck**: Stop server (Ctrl+C) and run `npm run dev` again
4. **Clear cache**: If changes don't show, try hard refresh (Ctrl+Shift+R)

## Summary

This preview feature lets you see your widget changes **instantly** without:
- ❌ Saving
- ❌ Refreshing
- ❌ Going to your live store
- ❌ Waiting

Just change settings and **watch it update!** ✨

---

**Need Help?**
1. Check browser console (F12)
2. Look for red error messages
3. Make sure widget is built
4. Restart the server

**Still stuck?** Check the other documentation files for more details.
