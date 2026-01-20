# WhatsApp Widget Build Guide

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Shopify Admin App                        │
│  (React + Polaris)                                          │
│  - Configure widget settings                                │
│  - Save to MongoDB + Metafields                            │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│              Shopify Metafield (JSON)                        │
│  shop.metafields.app.widget_settings                        │
│  {                                                          │
│    position: "bottom-right",                               │
│    phoneNumber: "+1234567890",                             │
│    buttonText: "Chat with us",                             │
│    buttonColor: { hue: 142, saturation: 0.77, ... }       │
│  }                                                         │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│         Theme App Extension (Liquid)                        │
│  app-config.liquid → Sets window.__recovery_cart_config__  │
│  whatsapp-widget.liquid → Loads JS bundle                  │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│         SolidJS Widget (Bundled JavaScript)                 │
│  - Reads window.__recovery_cart_config__                   │
│  - Renders WhatsApp button                                 │
│  - Opens WhatsApp on click                                 │
└─────────────────────────────────────────────────────────────┘
```

## Directory Structure

```
recovery-cart/
├── app/
│   └── routes/
│       └── app._index.jsx              # Admin settings UI
├── extensions/recovery-cart-extenstion/
│   ├── assets/
│   │   └── recovery-cart-widget.iife.js  # Built widget (output)
│   ├── blocks/
│   │   ├── app_config.liquid           # Config loader block
│   │   └── whatsapp_widget.liquid      # Widget block
│   └── snippets/
│       ├── app-config.liquid           # Config loader snippet
│       └── whatsapp-widget.liquid      # Widget snippet
└── widgets/
    ├── src/
    │   ├── WhatsAppWidget.jsx          # Main widget component
    │   ├── WhatsAppWidget.css          # Widget styles
    │   └── index.jsx                   # Entry point
    ├── package.json
    └── vite.config.js                  # Build configuration
```

## Build Process

### 1. Development Workflow

```bash
# Terminal 1: Run admin app
cd recovery-cart
npm run dev

# Terminal 2: Build widget with watch mode
cd widgets
npm install  # First time only
npm run build:watch
```

### 2. Build for Production

```bash
cd widgets
npm run build
```

This creates: `extensions/recovery-cart-extenstion/assets/recovery-cart-widget.iife.js`

### 3. Deploy Extension

```bash
cd ../  # Back to root
npm run deploy
```

## How It Works

### Step 1: Config Exposure (Liquid)

`extensions/recovery-cart-extenstion/blocks/app_config.liquid`:
```liquid
{% assign app_config = shop.metafields.app.widget_settings %}
<script>
  window.__recovery_cart_config__ = {
    shop: {{ shop.permanent_domain | json }},
    widgetSettings: {{ app_config | json }},
    isActive: true
  };
</script>
```

### Step 2: Widget Loading (Liquid)

`extensions/recovery-cart-extenstion/snippets/whatsapp-widget.liquid`:
```liquid
{% if shop.metafields.app.widget_settings %}
  <script src="{{ 'recovery-cart-widget.iife.js' | asset_url }}" defer></script>
{% endif %}
```

### Step 3: Widget Initialization (SolidJS)

`widgets/src/index.jsx`:
```jsx
function initRecoveryCartWidget() {
  // Get config from window
  if (!window.__recovery_cart_config__) {
    console.error('Config not found');
    return;
  }

  // Create container
  const container = document.createElement('div');
  container.id = 'recovery-cart-widget-root';
  document.body.appendChild(container);

  // Render widget
  render(() => <WhatsAppWidget />, container);
}

// Auto-init on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initRecoveryCartWidget);
} else {
  initRecoveryCartWidget();
}
```

### Step 4: Widget Component (SolidJS)

`widgets/src/WhatsAppWidget.jsx`:
```jsx
function WhatsAppWidget() {
  const [config, setConfig] = createSignal(null);
  const [isVisible, setIsVisible] = createSignal(false);

  onMount(() => {
    const appConfig = window.__recovery_cart_config__;
    if (appConfig?.widgetSettings) {
      setConfig(appConfig.widgetSettings);
      if (appConfig.widgetSettings.phoneNumber) {
        setIsVisible(true);
      }
    }
  });

  const handleClick = () => {
    const cfg = config();
    const cleanPhone = cfg.phoneNumber.replace(/[^0-9+]/g, '');
    window.open(`https://wa.me/${cleanPhone}`, '_blank');
  };

  return (
    <Show when={isVisible() && config()}>
      <button onClick={handleClick}>
        {/* WhatsApp icon + text */}
      </button>
    </Show>
  );
}
```

## Vite Configuration

`widgets/vite.config.js`:
```javascript
export default defineConfig({
  plugins: [devtools({ autoname: true }), solidPlugin()],
  build: {
    target: 'esnext',
    lib: {
      entry: path.resolve(__dirname, 'src/index.jsx'),
      name: 'RecoveryCartWidget',
      fileName: (format) => `recovery-cart-widget.${format}.js`,
      formats: ['iife']  // Self-contained bundle
    },
    rollupOptions: {
      output: {
        inlineDynamicImports: true,  // Single file
      }
    },
    outDir: '../extensions/recovery-cart-extenstion/assets',
    emptyOutDir: false,
  },
});
```

**Key Configuration:**
- `formats: ['iife']` - Creates a self-executing bundle
- `inlineDynamicImports: true` - Everything in one file
- `outDir` - Outputs directly to extension assets
- `emptyOutDir: false` - Preserves other extension assets

## Theme Integration

### Option 1: Using Blocks (Recommended)

1. Go to **Online Store > Themes > Customize**
2. Click **Add block** or **Add section**
3. Under **App blocks**, find:
   - **App Config** (required first)
   - **WhatsApp Widget**
4. Save theme

### Option 2: Using Liquid Code

Add to `theme.liquid` before `</body>`:
```liquid
{% render 'app-config' %}
{% render 'whatsapp-widget' %}
```

## Features

### ✅ Reactive Configuration
- Reads config from `window.__recovery_cart_config__`
- Updates automatically when settings change
- No API calls from storefront (fast!)

### ✅ Responsive Design
- Desktop: Full button with icon + text
- Mobile: Compact button
- Very small screens: Icon only

### ✅ Accessibility
- ARIA labels
- Keyboard navigation
- Focus indicators
- Semantic HTML

### ✅ Performance
- Single bundled file (~20KB gzipped)
- Deferred loading (`defer` attribute)
- Optimized Solid.js reactivity
- No external dependencies at runtime

### ✅ Customizable via Admin
- Position (bottom-left/right)
- Phone number
- Button text
- Button color (HSB to RGB conversion)

## Widget Styles

`widgets/src/WhatsAppWidget.css`:
- Fixed positioning
- Smooth animations
- Hover/active states
- Mobile responsive breakpoints
- Accessibility focus styles
- Slide-up animation on mount

## Console Logging

### Success:
```
Recovery Cart Widget: Initialized successfully
```

### Errors:
```
Recovery Cart Widget: Config not found. Make sure app-config block/snippet is added to theme.
```
```
Recovery Cart Widget: Widget is disabled
```
```
WhatsApp widget: No phone number configured
```

## Testing Checklist

### 1. Build Widget
```bash
cd widgets
npm run build
```
Check: `extensions/recovery-cart-extenstion/assets/recovery-cart-widget.iife.js` exists

### 2. Deploy Extension
```bash
cd ../
npm run deploy
```

### 3. Configure Settings
- Open app in Shopify Admin
- Set phone number, text, color, position
- Save

### 4. Add to Theme
- Add **App Config** block
- Add **WhatsApp Widget** block
- Save theme

### 5. Test on Storefront
- Visit store
- Check widget appears
- Check correct position and color
- Click widget → Should open WhatsApp
- Test on mobile

### 6. Browser Console
- Check for "Initialized successfully"
- No errors

## Troubleshooting

### Widget Doesn't Appear

**Check 1:** Is config loaded?
```javascript
// In browser console
console.log(window.__recovery_cart_config__);
```
Should show config object.

**Check 2:** Is bundle loaded?
```javascript
// In browser console
console.log(document.querySelector('script[src*="recovery-cart-widget"]'));
```
Should show script tag.

**Check 3:** Is phone number set?
Widget only shows if `phoneNumber` is configured.

**Check 4:** Are blocks added to theme?
- App Config block (required)
- WhatsApp Widget block

### Bundle Not Building

**Check 1:** Dependencies installed?
```bash
cd widgets
npm install
```

**Check 2:** Vite config correct?
Check `vite.config.js` has correct `outDir`.

**Check 3:** Build errors?
```bash
npm run build
```
Read error messages.

### Widget Looks Wrong

**Check 1:** CSS loaded?
CSS is inlined in the bundle. Check browser dev tools.

**Check 2:** Color conversion working?
Check HSB to RGB function in `WhatsAppWidget.jsx`.

**Check 3:** Position correct?
Check `config().position` matches setting.

## Development Tips

### Hot Reload During Development

```bash
# Terminal 1: Admin app
npm run dev

# Terminal 2: Widget build watch
cd widgets
npm run build:watch

# Terminal 3: Shopify CLI (if needed)
shopify app dev
```

### Testing Config Changes

1. Change settings in admin
2. Save
3. Reload storefront
4. Widget updates automatically

### Debugging Widget

```javascript
// Add to WhatsAppWidget.jsx
onMount(() => {
  console.log('Widget config:', window.__recovery_cart_config__);
  console.log('Widget settings:', config());
});
```

### Custom Styling

Edit `widgets/src/WhatsAppWidget.css`:
```css
.recovery-cart-whatsapp-widget {
  /* Your custom styles */
}
```

Rebuild:
```bash
npm run build
```

## Build Output

### Bundle Size
- **Uncompressed:** ~50-70KB
- **Gzipped:** ~20KB

### Browser Support
- ES2020+ (modern browsers)
- No polyfills needed for target browsers

### What's Included
- SolidJS runtime (~7KB)
- Widget component
- CSS (inlined)
- SVG WhatsApp icon

## Next Steps

1. **Build the widget:**
   ```bash
   cd widgets
   npm install
   npm run build
   ```

2. **Deploy extension:**
   ```bash
   cd ../
   npm run deploy
   ```

3. **Add to theme:**
   - Add App Config block
   - Add WhatsApp Widget block

4. **Configure in admin:**
   - Set phone number
   - Customize appearance

5. **Test on storefront!**

---

**Your widget is now ready to use!** 🎉
