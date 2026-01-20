# Recovery Cart WhatsApp Widget

SolidJS widget for displaying a customizable WhatsApp floating button on Shopify storefronts.

## 🚀 Quick Start

### Development Mode
```bash
npm install
npm run dev
```
Opens http://localhost:3000 with widget demo.

### Build for Production
```bash
npm run build
```
Creates: `../extensions/recovery-cart-extenstion/assets/recovery-cart-widget.iife.js`

## 📁 Files

- **`src/index.jsx`** - Entry point with demo config
- **`src/WhatsAppWidget.jsx`** - Widget component
- **`src/WhatsAppWidget.css`** - Widget styles
- **`index.html`** - Development demo page
- **`vite.config.js`** - Build configuration

## 🎨 Demo Configuration

The widget includes demo data for standalone development:

```javascript
const DEMO_CONFIG = {
  shop: 'demo-store.myshopify.com',
  isActive: true,
  widgetSettings: {
    position: 'bottom-right',
    phoneNumber: '+1234567890',
    buttonText: 'Chat with us on WhatsApp',
    buttonColor: {
      hue: 142,        // 0-360
      saturation: 0.77, // 0-1
      brightness: 0.75  // 0-1
    }
  }
};
```

### Customize Demo Config

Edit `DEMO_CONFIG` in `src/index.jsx`:

**Position:**
- `'bottom-right'` (default)
- `'bottom-left'`

**Colors (HSB):**
- Green: `{ hue: 142, saturation: 0.77, brightness: 0.75 }`
- Blue: `{ hue: 210, saturation: 0.8, brightness: 0.7 }`
- Red: `{ hue: 0, saturation: 0.85, brightness: 0.75 }`
- Purple: `{ hue: 280, saturation: 0.7, brightness: 0.8 }`

## 🛠️ Development

```bash
# Start dev server with hot reload
npm run dev

# Build once
npm run build

# Build and watch for changes
npm run build:watch

# Preview built bundle
npm run serve
```

## 🔧 How It Works

### Development Mode (`npm run dev`)
1. Uses `DEMO_CONFIG` from `src/index.jsx`
2. Widget appears with demo settings
3. No Shopify connection needed
4. Perfect for widget development

### Production Mode (on Shopify)
1. Liquid sets `window.__recovery_cart_config__`
2. Widget reads config from window
3. Falls back to `DEMO_CONFIG` if missing
4. Renders based on actual shop settings

## 📊 Build Output

- **Format:** IIFE (self-contained bundle)
- **Output:** `recovery-cart-widget.iife.js`
- **Size:** ~50-70KB uncompressed, ~20KB gzipped
- **Includes:** SolidJS runtime + Widget + CSS

## ✨ Features

- ✅ Reactive configuration
- ✅ Responsive design (desktop → mobile → icon-only)
- ✅ Smooth animations
- ✅ HSB to RGB color conversion
- ✅ Accessibility (ARIA, keyboard nav)
- ✅ Position control (left/right)
- ✅ Demo mode for development

## 🧪 Testing

### In Development
```bash
npm run dev
```
1. Open http://localhost:3000
2. Widget appears in bottom-right
3. Click to test WhatsApp link
4. Check browser console for logs

### Expected Console Logs

**Development mode:**
```
Recovery Cart Widget: Config not found. Using demo config for development.
Recovery Cart Widget: Initialized successfully
Config: { shop: 'demo-store.myshopify.com', ... }
```

**Production (on Shopify):**
```
Recovery Cart Widget: Initialized successfully
Config: { shop: 'your-store.myshopify.com', ... }
```

## 📖 Documentation

- **[BUILD.md](./BUILD.md)** - Build instructions
- **[DEVELOPMENT.md](./DEVELOPMENT.md)** - Development guide with demo config details
- **[../WIDGET_BUILD_GUIDE.md](../WIDGET_BUILD_GUIDE.md)** - Complete architecture
- **[../COMPLETE_SETUP_GUIDE.md](../COMPLETE_SETUP_GUIDE.md)** - Full project setup

## 🚀 Deployment

1. **Build widget:**
   ```bash
   npm run build
   ```

2. **Deploy extension:**
   ```bash
   cd ../
   npm run deploy
   ```

3. **Add to theme:**
   - Add "App Config" block
   - Add "WhatsApp Widget" block

## 💡 Tips

- Use `npm run dev` for fast iteration
- Edit `DEMO_CONFIG` to test different settings
- Check browser console for debug info
- Test responsive behavior with DevTools
- Build before deploying to Shopify

## 🐛 Troubleshooting

**Widget not showing in dev?**
- Check console for errors
- Verify `npm run dev` is running
- Check http://localhost:3000

**Want to change demo settings?**
- Edit `DEMO_CONFIG` in `src/index.jsx`
- Save and hot reload applies

**Build fails?**
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

**Built with SolidJS + Vite** 🚀
