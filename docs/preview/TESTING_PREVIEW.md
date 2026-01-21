# Testing the Real-Time Preview

## Quick Test Steps

### 1. Ensure Widget is Built
First, make sure the widget bundle is compiled:

```bash
cd widgets
npm run build
cd ..
```

This creates `public/widgets/recovery-cart-widget.iife.js`

### 2. Start Development Server
```bash
npm run dev
```

### 3. Open Browser Console
- Open your browser's Developer Tools (F12)
- Go to the Console tab
- You'll see debug messages from both the admin panel and iframe

### 4. Test Real-Time Updates

#### Test 1: Position Change
1. Change position from "Bottom Right" to "Bottom Left"
2. **Expected**: Widget moves instantly in preview
3. **Console logs**:
   ```
   [Admin] Sending config to iframe: {...}
   [Preview] Message received: {...}
   [Preview] Updating config: {...}
   [Preview] Reinitializing widget
   ```

#### Test 2: Color Change
1. Drag the color picker to a new color
2. **Expected**: Widget color changes instantly
3. **Console**: Same log pattern as above

#### Test 3: Button Text
1. Type in the "Button Text" field
2. **Expected**: Text updates as you type
3. **Console**: Logs for each keystroke

#### Test 4: Phone Number
1. Enter a phone number like "+1234567890"
2. **Expected**: Updates instantly in preview
3. **Console**: Config update logs

#### Test 5: Chat Text
1. Type in the "Chat Text" field
2. **Expected**: Updates instantly
3. **Console**: Config update logs

## Debug Console Messages

### Success Messages (What You Should See):

```
[Preview] Widget script loaded
[Preview] RecoveryCartWidget available: true
[Preview] Iframe loaded, notifying parent
[Admin] Message received: {type: 'IFRAME_READY'}
[Admin] Iframe is ready
[Admin] Sending config to iframe: {position: "bottom-right", ...}
[Preview] Message received: {type: 'WIDGET_CONFIG_UPDATE', config: {...}}
[Preview] Updating config: {position: "bottom-right", ...}
[Preview] Config set: {shop: "preview.myshopify.com", ...}
[Preview] Reinitializing widget
```

### Error Messages (What to Check):

#### If you see: `Widget bundle not found`
**Solution**: Run `cd widgets && npm run build`

#### If you see: `RecoveryCartWidget available: false`
**Solution**: 
1. Check if `public/widgets/recovery-cart-widget.iife.js` exists
2. Rebuild the widget: `cd widgets && npm run build`
3. Restart the dev server

#### If you see: `RecoveryCartWidget.init not available`
**Solution**: The widget bundle is not properly loaded
1. Check the widget build
2. Look for JavaScript errors in the iframe console

#### If changes don't appear:
**Solution**:
1. Check if `[Admin] Sending config to iframe` appears
2. Check if `[Preview] Message received` appears
3. Verify iframe is loaded (check Elements tab)

## Visual Verification

### What You Should See:

1. **Left Side (Admin Panel)**:
   - Form with all settings
   - Color picker
   - Save/Discard buttons

2. **Right Side (Preview)**:
   - Beautiful gradient background (purple to blue)
   - White phone mockup container
   - "Live Widget Preview" header
   - WhatsApp widget button at bottom-right or bottom-left
   - Widget should match your settings exactly

### Widget Appearance:
- **Position**: Bottom-left or bottom-right as selected
- **Color**: Matches the color picker
- **Text**: Shows the button text you entered
- **Style**: Rounded button with WhatsApp icon
- **Animation**: Smooth slide-up animation on load

## Common Issues & Solutions

### Issue 1: Iframe is blank
**Check**:
1. Open browser console
2. Look for errors in the iframe
3. Check if widget bundle exists
4. Verify the route `/widget-preview` loads

**Solution**:
```bash
# Rebuild widget
cd widgets
npm run build

# Restart server
npm run dev
```

### Issue 2: Widget doesn't update
**Check**:
1. Console logs for postMessage
2. Iframe ready state
3. JavaScript errors

**Solution**:
- Refresh the page
- Check console for specific errors
- Verify iframeRef is set

### Issue 3: Widget appears but wrong position
**Check**:
1. Config being sent
2. Widget CSS classes

**Solution**:
- The widget should have class `bottom-right` or `bottom-left`
- Check if config.position is correct in console

### Issue 4: Colors don't match
**Check**:
1. HSB to RGB conversion
2. Config.buttonColor object

**Solution**:
- Check console for the color values
- Verify HSB values: hue (0-360), saturation (0-1), brightness (0-1)

## Performance Check

### Expected Performance:
- **Initial Load**: < 500ms
- **Config Update**: < 100ms
- **Widget Reinit**: < 50ms
- **Total Update Time**: < 150ms

### To Measure:
1. Open Performance tab in DevTools
2. Make a change
3. Check the timeline

## Browser Compatibility

Test in:
- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari

All modern browsers should work.

## Final Checklist

Before considering it complete, verify:

- [ ] Widget bundle is built and exists
- [ ] Dev server is running
- [ ] Iframe loads without errors
- [ ] Console shows success messages
- [ ] Position changes work
- [ ] Color changes work
- [ ] Text changes work
- [ ] Phone number changes work
- [ ] Chat text changes work
- [ ] Widget appears correctly styled
- [ ] No console errors
- [ ] Updates happen instantly (< 100ms)

## Getting Help

If issues persist:

1. **Check the console** - Most issues show clear error messages
2. **Verify the build** - Ensure widget is compiled
3. **Check file paths** - Ensure `public/widgets/recovery-cart-widget.iife.js` exists
4. **Restart server** - Sometimes a fresh start helps
5. **Clear cache** - Browser cache can cause issues

## Success Indicators

You'll know it's working when:
1. ✅ Iframe shows gradient background with phone mockup
2. ✅ Widget appears in the preview
3. ✅ Changes update instantly without saving
4. ✅ Console shows successful message passing
5. ✅ No errors in console
6. ✅ Widget matches your settings exactly

---

**Happy Testing! 🚀**
