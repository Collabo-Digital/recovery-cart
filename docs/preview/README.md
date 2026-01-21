# Widget Preview Documentation

## Overview
This folder contains all documentation for the real-time widget preview feature.

## Quick Start
👉 **Start here**: [PREVIEW_SIMPLE_GUIDE.md](./PREVIEW_SIMPLE_GUIDE.md)

## Documentation Files

### For Users
- **[PREVIEW_SIMPLE_GUIDE.md](./PREVIEW_SIMPLE_GUIDE.md)** - Simple explanation of how the preview works
- **[QUICK_START_PREVIEW.md](./QUICK_START_PREVIEW.md)** - Quick setup guide
- **[TROUBLESHOOTING_SIMPLE.md](./TROUBLESHOOTING_SIMPLE.md)** - Common problems and solutions
- **[DEBUG_BUTTON_TEXT.md](./DEBUG_BUTTON_TEXT.md)** - Debugging button text issues

### For Developers
- **[PREVIEW_ARCHITECTURE.md](./PREVIEW_ARCHITECTURE.md)** - System architecture and diagrams
- **[PREVIEW_IMPLEMENTATION_SUMMARY.md](./PREVIEW_IMPLEMENTATION_SUMMARY.md)** - Technical implementation details
- **[TESTING_PREVIEW.md](./TESTING_PREVIEW.md)** - Detailed testing guide

### Quick Reference
- **[PREVIEW_QUICK_REFERENCE.md](./PREVIEW_QUICK_REFERENCE.md)** - Quick reference card
- **[IFRAME_PREVIEW_GUIDE.md](./IFRAME_PREVIEW_GUIDE.md)** - Iframe implementation guide

## Quick Setup

```bash
# 1. Build widget
cd widgets && npm run build && cd ..

# 2. Start server
npm run dev

# 3. Open admin panel and test!
```

## How It Works

The preview feature uses an iframe to show a live preview of the WhatsApp widget. When you change settings in the admin panel, the changes appear instantly in the preview.

```
Admin Panel → postMessage → Iframe → Widget Updates → Visual Change
```

## File Structure

```
app/
├── components/
│   └── WidgetPreview.jsx          ← Preview component
├── routes/
│   ├── app._index.jsx              ← Admin panel
│   └── widget-preview.jsx          ← Preview route
└── utils/
    ├── colorUtils.js               ← Color conversion
    └── previewTemplate.js          ← HTML template
```

## Need Help?

1. Check [TROUBLESHOOTING_SIMPLE.md](./TROUBLESHOOTING_SIMPLE.md) for common issues
2. Read [PREVIEW_SIMPLE_GUIDE.md](./PREVIEW_SIMPLE_GUIDE.md) for basic understanding
3. Check browser console (F12) for error messages
