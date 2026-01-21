# Iframe Preview Implementation Guide

## Overview
This guide explains how the real-time iframe preview has been implemented in the admin panel to show live updates of the WhatsApp widget as settings are changed.

## Architecture

### 1. Preview Route (`app/routes/widget-preview.jsx`)
- **Purpose**: Serves the HTML page that will be loaded inside the iframe
- **Features**:
  - Beautiful gradient background with a mobile phone mockup
  - Loads the widget bundle (`recovery-cart-widget.iife.js`)
  - Listens for configuration updates via `postMessage`
  - Automatically reinitializes the widget when config changes

### 2. Admin Panel Updates (`app/routes/app._index.jsx`)

#### New Imports
```javascript
import { useState, useEffect, useRef } from "react";
```
- Added `useRef` to reference the iframe element

#### New State Variables
```javascript
const iframeRef = useRef(null);
const [iframeReady, setIframeReady] = useState(false);
```
- `iframeRef`: Reference to the iframe DOM element
- `iframeReady`: Tracks when the iframe has loaded and is ready to receive messages

#### Real-Time Communication
Two `useEffect` hooks handle the communication:

**1. Send Updates to Iframe**
```javascript
useEffect(() => {
  if (iframeReady && iframeRef.current) {
    const config = {
      position,
      phoneNumber,
      buttonText,
      buttonColor,
      chatText,
    };
    
    iframeRef.current.contentWindow.postMessage(
      {
        type: 'WIDGET_CONFIG_UPDATE',
        config,
      },
      '*'
    );
  }
}, [position, phoneNumber, buttonText, buttonColor, chatText, iframeReady]);
```
- Triggers whenever any setting changes
- Sends the current configuration to the iframe via `postMessage`

**2. Listen for Iframe Ready**
```javascript
useEffect(() => {
  const handleMessage = (event) => {
    if (event.data && event.data.type === 'IFRAME_READY') {
      setIframeReady(true);
    }
  };

  window.addEventListener('message', handleMessage);
  return () => window.removeEventListener('message', handleMessage);
}, []);
```
- Listens for the iframe to signal it's ready
- Sets `iframeReady` to true, enabling config updates

#### Updated Preview Section
```javascript
<iframe
  ref={iframeRef}
  src="/widget-preview"
  style={{
    width: '100%',
    height: '100%',
    border: 'none',
    display: 'block'
  }}
  title="Widget Preview"
/>
```
- Replaced the simple preview box with a full iframe
- 600px height for a realistic mobile phone preview
- Loads the `/widget-preview` route

## How It Works

### Flow Diagram
```
Admin Panel (app._index.jsx)
    |
    | 1. User changes setting (e.g., button color)
    |
    v
State Update (useState)
    |
    | 2. useEffect detects change
    |
    v
postMessage to Iframe
    |
    | 3. Message sent with new config
    |
    v
Iframe (widget-preview.jsx)
    |
    | 4. Receives message
    |
    v
Update Global Config
    |
    | 5. window.__recovery_cart_config__ = newConfig
    |
    v
Remove Old Widget
    |
    | 6. document.getElementById('recovery-cart-widget').remove()
    |
    v
Reinitialize Widget
    |
    | 7. RecoveryCartWidget.init()
    |
    v
Widget Renders with New Settings
```

### Message Protocol

**From Admin to Iframe:**
```javascript
{
  type: 'WIDGET_CONFIG_UPDATE',
  config: {
    position: 'bottom-right',
    phoneNumber: '+1234567890',
    buttonText: 'Chat with us',
    buttonColor: { hue: 142, saturation: 0.77, brightness: 0.75 },
    chatText: 'Hi! I need help.'
  }
}
```

**From Iframe to Admin:**
```javascript
{
  type: 'IFRAME_READY'
}
```

## Features

### 1. Real-Time Updates
- Changes appear instantly in the preview
- No need to save or refresh
- Works for all settings:
  - Position (bottom-left/bottom-right)
  - Phone number
  - Button text
  - Button color
  - Chat text

### 2. Beautiful Preview
- Gradient background (purple to blue)
- Mobile phone mockup design
- Realistic widget rendering
- Smooth animations

### 3. User Experience
- "Live Preview" heading
- Real-time color hex code display
- "Changes update in real-time" indicator
- Maintains existing setup guide and banner

## Technical Details

### Security Considerations
```javascript
// In production, you should verify the origin:
if (event.origin !== 'https://your-app-url.com') return;
```
Currently using `'*'` for development convenience, but should be restricted in production.

### Widget Reinitialization
The preview handles widget updates by:
1. Removing the existing widget DOM element
2. Updating the global config object
3. Calling the widget's `init()` function again
4. The widget recreates itself with new settings

### Iframe Sandbox
The iframe is not sandboxed, allowing:
- JavaScript execution
- Access to parent via `postMessage`
- Full widget functionality

## Files Modified/Created

### Created:
1. `app/routes/widget-preview.jsx` - Preview route serving HTML
2. `public/widget-preview.html` - Static HTML (backup, not used)
3. `IFRAME_PREVIEW_GUIDE.md` - This documentation

### Modified:
1. `app/routes/app._index.jsx` - Admin panel with iframe integration

## Testing

### Test Scenarios:
1. **Position Change**: Switch between bottom-left and bottom-right
2. **Color Change**: Drag the color picker, watch instant updates
3. **Text Change**: Type in button text or chat text fields
4. **Phone Number**: Enter a phone number and verify
5. **Multiple Changes**: Change multiple settings rapidly

### Expected Behavior:
- All changes should appear instantly in the preview
- Widget should maintain its position and styling
- No console errors
- Smooth transitions

## Troubleshooting

### Issue: Iframe doesn't load
- Check if `/widget-preview` route is accessible
- Verify the widget bundle is built and available at `/widgets/recovery-cart-widget.iife.js`

### Issue: Changes don't update
- Check browser console for postMessage errors
- Verify `iframeReady` state is true
- Check if iframe reference is valid

### Issue: Widget doesn't appear
- Verify the widget bundle is correctly built
- Check if `RecoveryCartWidget.init()` is available
- Look for JavaScript errors in the iframe console

## Future Enhancements

1. **Multiple Device Previews**: Show desktop, tablet, and mobile views
2. **Dark Mode Preview**: Toggle between light and dark backgrounds
3. **Interactive Preview**: Click the widget in preview to test functionality
4. **Screenshot Feature**: Capture preview as an image
5. **Comparison View**: Show before/after side by side

## Conclusion

The iframe preview provides merchants with instant visual feedback as they customize their WhatsApp widget, improving the user experience and reducing the need for trial-and-error on the live storefront.
