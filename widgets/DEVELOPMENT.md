# Widget Development Guide

## 🚀 Quick Start

### Run Development Server
```bash
npm run dev
```

Opens http://localhost:3000 with live widget preview.

## 📋 Demo Configuration

### Current Demo Config

The widget uses this config when running standalone:

```javascript
// src/index.jsx
const DEMO_CONFIG = {
  shop: 'demo-store.myshopify.com',
  isActive: true,
  widgetSettings: {
    position: 'bottom-right',
    phoneNumber: '+1234567890',
    buttonText: 'Chat with us on WhatsApp',
    buttonColor: {
      hue: 142,
      saturation: 0.77,
      brightness: 0.75
    }
  }
};
```

### Customize Demo Config

**1. Change Position:**
```javascript
widgetSettings: {
  position: 'bottom-left',  // or 'bottom-right'
  // ...
}
```

**2. Change Phone Number:**
```javascript
widgetSettings: {
  phoneNumber: '+919876543210',  // Your WhatsApp number
  // ...
}
```

**3. Change Button Text:**
```javascript
widgetSettings: {
  buttonText: 'Contact Support',  // Any text
  // ...
}
```

**4. Change Color:**

**Green (WhatsApp default):**
```javascript
buttonColor: {
  hue: 142,
  saturation: 0.77,
  brightness: 0.75
}
```

**Blue:**
```javascript
buttonColor: {
  hue: 210,
  saturation: 0.8,
  brightness: 0.7
}
```

**Red:**
```javascript
buttonColor: {
  hue: 0,
  saturation: 0.85,
  brightness: 0.75
}
```

**Purple:**
```javascript
buttonColor: {
  hue: 280,
  saturation: 0.7,
  brightness: 0.8
}
```

**Orange:**
```javascript
buttonColor: {
  hue: 30,
  saturation: 0.9,
  brightness: 0.85
}
```

## 🎨 Color System (HSB)

The widget uses **HSB** (Hue, Saturation, Brightness) color format, same as Shopify Polaris ColorPicker.

### HSB Values:
- **Hue:** 0-360 (color wheel position)
  - Red: 0
  - Orange: 30
  - Yellow: 60
  - Green: 120
  - Cyan: 180
  - Blue: 240
  - Purple: 280
  - Magenta: 300

- **Saturation:** 0-1 (color intensity)
  - 0 = gray
  - 1 = full color

- **Brightness:** 0-1 (lightness)
  - 0 = black
  - 1 = bright

### Color Conversion

The widget automatically converts HSB → RGB:

```javascript
// In WhatsAppWidget.jsx
const hsbToRgb = (hsb) => {
  const { hue, saturation, brightness } = hsb;
  // ... conversion logic
  return { r, g, b };
};
```

## 🔧 Development Workflow

### 1. Start Dev Server
```bash
npm run dev
```

### 2. Make Changes
Edit files in `src/`:
- `WhatsAppWidget.jsx` - Component logic
- `WhatsAppWidget.css` - Styles
- `index.jsx` - Demo config & initialization

### 3. See Changes Live
- Vite hot-reloads automatically
- Check browser console for logs
- Widget updates in real-time

### 4. Test Different Configs
Edit `DEMO_CONFIG` in `src/index.jsx` to test:
- Different positions
- Different colors
- Different text
- Different phone numbers

### 5. Build for Production
```bash
npm run build
```

Creates bundle in `../extensions/recovery-cart-extenstion/assets/`

## 🧪 Testing Scenarios

### Test 1: Widget Appears
- ✅ Widget visible in bottom-right/left
- ✅ Correct color
- ✅ Correct text
- ✅ WhatsApp icon shows

### Test 2: Click Behavior
- ✅ Click opens WhatsApp
- ✅ Correct phone number in URL
- ✅ Opens in new tab

### Test 3: Responsive Design
- ✅ Desktop: Full button with icon + text
- ✅ Tablet: Compact button
- ✅ Mobile: Small button
- ✅ Very small: Icon only

**Test with browser DevTools:**
```
Desktop:  1920x1080
Tablet:   768x1024
Mobile:   375x667
Small:    360x640
```

### Test 4: Animations
- ✅ Slide-up animation on load
- ✅ Hover effect (lift + shadow)
- ✅ Click effect (press down)

### Test 5: Accessibility
- ✅ Keyboard navigation (Tab key)
- ✅ Focus indicator visible
- ✅ ARIA label present
- ✅ Screen reader friendly

### Test 6: Config Loading
**Without Shopify (Dev):**
```javascript
// Should log:
"Recovery Cart Widget: Config not found. Using demo config for development."
"Recovery Cart Widget: Initialized successfully"
```

**With Shopify (Production):**
```javascript
// Should log:
"Recovery Cart Widget: Initialized successfully"
// No warning about demo config
```

## 🐛 Debugging

### Check Config
```javascript
// In browser console
console.log(window.__recovery_cart_config__);
```

**Expected output (dev mode):**
```javascript
{
  shop: 'demo-store.myshopify.com',
  isActive: true,
  widgetSettings: {
    position: 'bottom-right',
    phoneNumber: '+1234567890',
    buttonText: 'Chat with us on WhatsApp',
    buttonColor: { hue: 142, saturation: 0.77, brightness: 0.75 }
  }
}
```

### Check Widget Element
```javascript
// In browser console
const widget = document.querySelector('.recovery-cart-whatsapp-widget');
console.log(widget);
console.log(widget.style);
```

### Check Logs
Look for these in console:
- ✅ `Recovery Cart Widget: Initialized successfully`
- ✅ `Config: { ... }`
- ⚠️ `Using demo config for development` (dev mode)
- ❌ `Config not found` (missing config)
- ❌ `No phone number configured` (empty phone)

## 📱 Mobile Testing

### Using Browser DevTools
1. Open DevTools (F12)
2. Click device toolbar icon (Ctrl+Shift+M)
3. Select device:
   - iPhone 12 Pro
   - Galaxy S21
   - iPad Air
4. Check responsive behavior

### Real Device Testing
1. Get your local IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
2. Access: `http://YOUR_IP:3000`
3. Test on actual phone/tablet

## 🎯 Common Customizations

### Change Icon
Replace SVG in `WhatsAppWidget.jsx`:
```jsx
<svg class="whatsapp-icon" viewBox="0 0 24 24">
  {/* Replace with your icon path */}
</svg>
```

### Add Animation
Edit `WhatsAppWidget.css`:
```css
@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.recovery-cart-whatsapp-widget {
  animation: pulse 2s infinite;
}
```

### Add Pre-filled Message
Modify `handleClick` in `WhatsAppWidget.jsx`:
```javascript
const handleClick = () => {
  const cfg = config();
  if (!cfg || !cfg.phoneNumber) return;
  
  const cleanPhone = cfg.phoneNumber.replace(/[^0-9+]/g, '');
  const message = encodeURIComponent('Hi! I need help with...');
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${message}`;
  
  window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
};
```

### Change Position Dynamically
Add to demo page:
```javascript
window.updateWidgetPosition = (pos) => {
  window.__recovery_cart_config__.widgetSettings.position = pos;
  location.reload();
};
```

## 📦 Build Output

### Development Build
```bash
npm run dev
```
- **Source maps:** Yes
- **Minification:** No
- **Size:** ~100KB (uncompressed)

### Production Build
```bash
npm run build
```
- **Source maps:** No
- **Minification:** Yes
- **Size:** ~50-70KB uncompressed, ~20KB gzipped

## 🚀 Deployment

After building:

1. **Build widget:**
   ```bash
   npm run build
   ```

2. **Check output:**
   ```bash
   ls -lh ../extensions/recovery-cart-extenstion/assets/recovery-cart-widget.iife.js
   ```

3. **Deploy extension:**
   ```bash
   cd ../
   npm run deploy
   ```

## 💡 Tips

- **Fast iteration:** Use `npm run dev` and edit `DEMO_CONFIG`
- **Test all positions:** Change position in demo config
- **Test all colors:** Try different HSB values
- **Test mobile early:** Use responsive mode
- **Check console:** Always watch for errors
- **Test WhatsApp link:** Click and verify number

---

**Happy developing!** 🎉

Need help? Check the main documentation:
- [WIDGET_BUILD_GUIDE.md](../WIDGET_BUILD_GUIDE.md)
- [COMPLETE_SETUP_GUIDE.md](../COMPLETE_SETUP_GUIDE.md)
