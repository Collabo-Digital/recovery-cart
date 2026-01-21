# Preview Feature - Quick Reference Card

## 🚀 Quick Start

```bash
# 1. Build widget
cd widgets && npm run build && cd ..

# 2. Start server
npm run dev

# 3. Open admin panel and test!
```

## ✅ What Should Happen

1. **Iframe loads** with gradient background
2. **Widget appears** in bottom-right/left
3. **Changes update instantly** as you type/select
4. **Console shows** success messages

## 🔍 Console Debug Messages

### Success Pattern:
```
[Preview] Widget script loaded
[Preview] RecoveryCartWidget available: true
[Preview] Iframe loaded, notifying parent
[Admin] Iframe is ready
[Admin] Sending config to iframe: {...}
[Preview] Message received: {...}
[Preview] Updating config: {...}
[Preview] Reinitializing widget
```

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| Widget bundle not found | `cd widgets && npm run build` |
| Iframe blank | Check console, rebuild widget |
| Changes don't update | Check postMessage logs |
| RecoveryCartWidget not available | Rebuild widget, restart server |

## 📁 Key Files

| File | Purpose |
|------|---------|
| `app/routes/widget-preview.jsx` | Iframe route (injects widget) |
| `app/routes/app._index.jsx` | Admin panel (sends config) |
| `public/widgets/recovery-cart-widget.iife.js` | Widget bundle |

## 🔄 How It Works

```
User changes setting
    ↓
React state updates
    ↓
useEffect sends postMessage
    ↓
Iframe receives config
    ↓
Widget reinitializes
    ↓
Preview updates (< 100ms)
```

## 🎯 Test Checklist

- [ ] Position: bottom-left ↔ bottom-right
- [ ] Color: Drag color picker
- [ ] Button text: Type and see update
- [ ] Phone number: Enter number
- [ ] Chat text: Type message
- [ ] Multiple rapid changes

## 📊 Performance

- Initial Load: < 500ms
- Config Update: < 100ms
- Total Update: < 150ms

## 🔧 Common Commands

```bash
# Build widget
cd widgets && npm run build

# Start dev server
npm run dev

# Check if widget exists
ls public/widgets/recovery-cart-widget.iife.js

# View logs
# Open browser console (F12)
```

## 💡 Key Features

✅ **Real-time updates** - No save needed
✅ **Beautiful preview** - Gradient + phone mockup
✅ **Instant feedback** - See changes immediately
✅ **Debug logging** - Easy troubleshooting
✅ **Error handling** - Clear error messages

## 🎨 What You'll See

**Left Side:** Settings form with color picker
**Right Side:** Live preview with gradient background
**Widget:** Floating button matching your settings

## 📝 Documentation

- `TESTING_PREVIEW.md` - Detailed testing guide
- `PREVIEW_IMPLEMENTATION_SUMMARY.md` - Technical details
- `IFRAME_PREVIEW_GUIDE.md` - Architecture guide
- `PREVIEW_QUICK_REFERENCE.md` - This file

## ⚡ Quick Fixes

### Widget not showing?
```bash
cd widgets
npm run build
cd ..
npm run dev
```

### Changes not updating?
1. Check console for errors
2. Verify iframe loaded
3. Check postMessage logs

### Iframe blank?
1. Check if widget bundle exists
2. Look for JavaScript errors
3. Restart dev server

## 🎯 Success Indicators

✅ Gradient background visible
✅ Widget appears in preview
✅ Changes update instantly
✅ No console errors
✅ Console shows success messages

---

**Need help? Check the detailed guides or console logs!**
