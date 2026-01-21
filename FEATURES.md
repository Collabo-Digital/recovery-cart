# Widget Features

## Overview
The WhatsApp Recovery Cart widget includes several powerful features to enhance customer communication.

## Core Features

### 1. ✅ Real-Time Preview
- See changes instantly in admin panel
- No need to save or refresh
- Beautiful gradient preview design
- **Docs**: `docs/preview/README.md`

### 2. ✅ Customizable Appearance
- **Position**: Bottom-left or bottom-right
- **Color**: Any color via color picker
- **Button Text**: Customizable call-to-action
- **Chat Text**: Pre-filled message for customers

### 3. ✅ Responsive Design
- Works on desktop, tablet, and mobile
- Icon-only mode on small screens
- Smooth animations
- Touch-friendly

### 4. ✅ Product URL Auto-Detection (NEW!)
- Automatically detects product pages
- Includes product URL in WhatsApp message
- Helps merchants know exactly what customer is asking about
- **Docs**: `docs/PRODUCT_URL_FEATURE.md`

## Feature Details

### Product URL Auto-Detection

**What it does:**
When a customer clicks the WhatsApp button on a product page, the widget automatically includes the product URL in the message.

**Example:**
```
Customer's message: "Hi! I need help with this product"

Actual WhatsApp message:
"Hi! I need help with this product

Product: https://yourstore.com/products/awesome-shirt"
```

**Benefits:**
- ✅ Customers don't need to copy/paste URLs
- ✅ Merchants know exactly which product
- ✅ Faster response times
- ✅ Better customer service

**How it works:**
1. Widget detects if URL contains `/products/`
2. If yes, appends `window.location.href` to message
3. If no, sends only custom message

### Real-Time Preview

**What it does:**
Shows a live preview of the widget in the admin panel. Changes appear instantly as you modify settings.

**Benefits:**
- ✅ See changes before saving
- ✅ No need to check storefront
- ✅ Faster customization
- ✅ Better UX

**How it works:**
1. Admin panel sends config via postMessage
2. Iframe receives and updates widget
3. Widget reinitializes with new settings
4. Preview updates in < 100ms

### Customizable Appearance

**What you can customize:**
- **Position**: Left or right side
- **Color**: Any color (HSB color picker)
- **Button Text**: "Chat with us", "Need help?", etc.
- **Chat Text**: Pre-filled message for customers
- **Phone Number**: Your WhatsApp business number

**How to customize:**
1. Open admin panel
2. Change settings
3. See preview update instantly
4. Click "Save Settings"

### Responsive Design

**Breakpoints:**
- **Desktop** (> 640px): Full button with text
- **Mobile** (< 640px): Smaller button
- **Small Mobile** (< 380px): Icon-only mode

**Features:**
- Touch-friendly (48x48px minimum)
- Smooth animations
- Optimized for mobile
- Accessible (ARIA labels)

## Feature Comparison

| Feature | Free Version | This Widget |
|---------|--------------|-------------|
| WhatsApp Integration | ✅ | ✅ |
| Custom Position | ❌ | ✅ |
| Custom Colors | ❌ | ✅ |
| Custom Text | ❌ | ✅ |
| Real-Time Preview | ❌ | ✅ |
| Product URL Detection | ❌ | ✅ |
| Responsive Design | ⚠️ Basic | ✅ Advanced |
| Admin Panel | ❌ | ✅ |
| Database Storage | ❌ | ✅ |

## Upcoming Features

### Planned
- 🔄 Cart Recovery (send abandoned cart details)
- 🔄 Multi-language support
- 🔄 Custom triggers (exit intent, time delay)
- 🔄 Analytics dashboard
- 🔄 A/B testing

### Under Consideration
- 💭 Product recommendations in chat
- 💭 Order tracking integration
- 💭 Customer segmentation
- 💭 Automated responses

## Feature Requests

Have an idea? We'd love to hear it!

1. Check if it's already planned (see above)
2. Consider if it fits the widget's purpose
3. Think about use cases
4. Submit your request

## Technical Specifications

### Performance
- **Initial Load**: < 500ms
- **Preview Update**: < 100ms
- **Widget Size**: ~16KB (gzipped: ~7KB)
- **Dependencies**: None (self-contained)

### Browser Support
- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari
- ✅ Mobile browsers

### Shopify Compatibility
- ✅ Shopify 2.0 themes
- ✅ Theme App Extensions
- ✅ App Embeds
- ✅ All Shopify plans

## Documentation

### User Guides
- **Quick Start**: `QUICK_REFERENCE.md`
- **Preview Feature**: `docs/preview/PREVIEW_SIMPLE_GUIDE.md`
- **Product URL Feature**: `docs/PRODUCT_URL_FEATURE.md`
- **Troubleshooting**: `docs/preview/TROUBLESHOOTING_SIMPLE.md`

### Developer Guides
- **Code Structure**: `CODE_STRUCTURE.md`
- **Architecture**: `docs/preview/PREVIEW_ARCHITECTURE.md`
- **Refactoring**: `REFACTORING_SUMMARY.md`

## Support

### Getting Help
1. Check documentation (see above)
2. Look at browser console (F12)
3. Read troubleshooting guide
4. Check GitHub issues (if applicable)

### Common Issues
- **Widget not showing**: Check if app embed is enabled
- **Preview blank**: Run `cd widgets && npm run build`
- **Changes not updating**: Refresh browser
- **Product URL not working**: Check if on product page

---

**Enjoy the features!** 🎉
