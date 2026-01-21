# Quick Reference Guide

## 🚀 Getting Started

```bash
# Build widget
cd widgets && npm run build && cd ..

# Start development server
npm run dev
```

## 📁 Key Files

| File | Purpose |
|------|---------|
| `app/routes/app._index.jsx` | Admin settings page |
| `app/components/WidgetPreview.jsx` | Live preview component |
| `app/routes/widget-preview.jsx` | Preview iframe route |
| `app/utils/colorUtils.js` | Color conversion utilities |
| `app/utils/previewTemplate.js` | Preview HTML template |
| `widgets/src/components/WhatsAppButton.jsx` | Widget component |
| `public/widgets/recovery-cart-widget.iife.js` | Built widget bundle |

## 📚 Documentation

| Document | Description |
|----------|-------------|
| `CODE_STRUCTURE.md` | Complete codebase guide |
| `REFACTORING_SUMMARY.md` | What was changed and why |
| `docs/preview/README.md` | Preview feature docs index |
| `docs/preview/PREVIEW_SIMPLE_GUIDE.md` | User guide for preview |
| `docs/preview/TROUBLESHOOTING_SIMPLE.md` | Common issues and fixes |

## 🔧 Common Tasks

### Add a New Setting
1. Update `prisma/schema.prisma`
2. Run `npx prisma migrate dev`
3. Update `app/utils/widgetSettings.server.js`
4. Add form field in `app/routes/app._index.jsx`
5. Update widget in `widgets/src/components/WhatsAppButton.jsx`

### Debug Preview Issues
1. Open browser console (F12)
2. Look for `[Admin]` and `[Preview]` logs
3. Check `docs/preview/TROUBLESHOOTING_SIMPLE.md`

### Rebuild Widget
```bash
cd widgets
npm run build
cd ..
```

### Check for Errors
```bash
# Linter
npm run lint

# TypeScript (if using)
npm run typecheck
```

## 🎯 Component Props

### WidgetPreview
```javascript
<WidgetPreview 
  config={{
    position: 'bottom-right',
    phoneNumber: '+1234567890',
    buttonText: 'Chat with us',
    buttonColor: { hue: 142, saturation: 0.77, brightness: 0.75 },
    chatText: 'Hi!'
  }}
  colorHex="#25d366"
/>
```

## 🔍 Debug Commands

```bash
# Check if widget bundle exists
ls public/widgets/recovery-cart-widget.iife.js

# View recent logs
# Open browser console (F12)

# Clear cache and rebuild
cd widgets && rm -rf node_modules && npm install && npm run build
```

## 📊 Data Flow

```
User Input → React State → WidgetPreview → postMessage → Iframe → Widget Update
```

## ⚡ Quick Fixes

| Problem | Solution |
|---------|----------|
| Preview blank | `cd widgets && npm run build` |
| Changes don't update | Refresh page (F5) |
| Widget not showing | Check console for errors |
| Build fails | `npm install` then `npm run build` |
| Port in use | Kill process and restart |

## 🎨 Color Conversion

```javascript
import { hsbToHex } from '../utils/colorUtils';

const hex = hsbToHex({ 
  hue: 142, 
  saturation: 0.77, 
  brightness: 0.75 
});
// Returns: "#25d366"
```

## 📝 Code Style

- **Components**: PascalCase (`WidgetPreview.jsx`)
- **Utils**: camelCase (`colorUtils.js`)
- **Constants**: UPPER_SNAKE_CASE (`DEFAULT_SETTINGS`)
- **Functions**: camelCase (`hsbToHex`)

## 🔗 Useful Links

- [Shopify Dev Docs](https://shopify.dev)
- [React Router Docs](https://reactrouter.com)
- [Polaris Components](https://polaris.shopify.com)
- [Prisma Docs](https://www.prisma.io/docs)

---

**Need more details?** Check `CODE_STRUCTURE.md` for comprehensive documentation.
