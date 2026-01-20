# Widget Build Instructions

## Quick Start

### 1. Install Dependencies (First Time Only)
```bash
npm install
```

### 2. Development Mode (Live Preview)
```bash
npm run dev
```

Opens http://localhost:3000 with the widget demo page.
- ✅ Uses demo config (no Shopify connection needed)
- ✅ Hot reload on changes
- ✅ Perfect for widget development

### 3. Build Widget for Production
```bash
npm run build
```

This creates: `../extensions/recovery-cart-extenstion/assets/recovery-cart-widget.iife.js`

### 4. Development with Auto-Rebuild
```bash
npm run build:watch
```

Watches for changes and rebuilds automatically.

## Demo Configuration

The widget includes a fallback demo config for development:

**Location:** `src/index.jsx`

```javascript
const DEMO_CONFIG = {
  shop: 'demo-store.myshopify.com',
  isActive: true,
  widgetSettings: {
    position: 'bottom-right',          // or 'bottom-left'
    phoneNumber: '+1234567890',        // Your WhatsApp number
    buttonText: 'Chat with us on WhatsApp',
    buttonColor: {
      hue: 142,           // 0-360 (green = 120-150)
      saturation: 0.77,   // 0-1
      brightness: 0.75    // 0-1
    }
  }
};
```

**Customize for Testing:**
1. Edit `DEMO_CONFIG` in `src/index.jsx`
2. Save (hot reload in dev mode)
3. Or rebuild if using production build

**Color Examples:**
- **Green:** `{ hue: 142, saturation: 0.77, brightness: 0.75 }`
- **Blue:** `{ hue: 210, saturation: 0.8, brightness: 0.7 }`
- **Red:** `{ hue: 0, saturation: 0.85, brightness: 0.75 }`
- **Purple:** `{ hue: 280, saturation: 0.7, brightness: 0.8 }`

## What Gets Built

- **Input:** `src/index.jsx` (SolidJS widget)
- **Output:** `../extensions/recovery-cart-extenstion/assets/recovery-cart-widget.iife.js`
- **Format:** IIFE (Immediately Invoked Function Expression) - self-contained bundle
- **Size:** ~20KB gzipped

**Demo vs Production:**
- **Development (`npm run dev`):** Uses `DEMO_CONFIG` if no Shopify config found
- **Production (on Shopify):** Uses config from `window.__recovery_cart_config__` (set by Liquid)

## Build Configuration

See `vite.config.js`:
- Bundles SolidJS + Widget code
- Outputs single file (IIFE format)
- Directly to extension assets folder
- Optimized for production

## After Building

### Deploy the Extension
```bash
cd ../
npm run deploy
```

### Add to Theme
1. Go to **Online Store > Themes > Customize**
2. Add **App Config** block (required)
3. Add **WhatsApp Widget** block
4. Save

## Widget Structure

```
src/
├── index.jsx              # Entry point, initializes widget
├── WhatsAppWidget.jsx     # Main widget component
└── WhatsAppWidget.css     # Widget styles
```

## How It Works

1. **Config Exposure:** Liquid sets `window.__recovery_cart_config__`
2. **Bundle Loads:** `<script src="recovery-cart-widget.iife.js">`
3. **Auto-Init:** Widget checks config and renders
4. **Reactive:** Uses SolidJS for efficient updates

## Testing

### Check Build Output
```bash
ls -lh ../extensions/recovery-cart-extenstion/assets/recovery-cart-widget.iife.js
```

### Test on Storefront
1. Visit your store
2. Open browser console (F12)
3. Should see: "Recovery Cart Widget: Initialized successfully"
4. Widget appears at configured position

## Troubleshooting

### Build Fails
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Widget Not Showing
1. Check bundle exists in assets folder
2. Check console for errors
3. Verify App Config block is added
4. Verify phone number is set in admin

### Want to Customize?

Edit files in `src/`:
- `WhatsAppWidget.jsx` - Component logic
- `WhatsAppWidget.css` - Styles

Then rebuild:
```bash
npm run build
```

---

**Happy building!** 🚀
