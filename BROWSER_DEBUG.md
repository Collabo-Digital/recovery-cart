# Browser Console Debugging Guide

Quick commands to debug your Recovery Cart widget in the browser console.

---

## 🔍 Quick Inspection Commands

### 1. Check if metafield config exists

```javascript
window.__recovery_cart_config__
```

**Expected output:**
```javascript
{
  shop: "your-store.myshopify.com",
  widgetSettings: {
    position: "bottom-right",
    phoneNumber: "+1234567890",
    buttonText: "Chat with us",
    buttonColor: { hue: 142, saturation: 0.77, brightness: 0.75 }
  },
  isActive: true,
  debug: {
    metafieldExists: true,
    metafieldValue: { ... },
    usingDefaults: false
  }
}
```

---

### 2. Check if using saved or default settings

```javascript
console.log("Using saved settings:", window.__recovery_cart_config__.isActive);
console.log("Using defaults:", window.__recovery_cart_config__.debug.usingDefaults);
```

---

### 3. View current widget settings

```javascript
console.table(window.__recovery_cart_config__.widgetSettings);
```

**Output:**
```
┌──────────────┬────────────────────┐
│   (index)    │      Values        │
├──────────────┼────────────────────┤
│   position   │  'bottom-right'    │
│ phoneNumber  │  '+1234567890'     │
│  buttonText  │  'Chat with us'    │
│ buttonColor  │  { hue: 142, ... } │
└──────────────┴────────────────────┘
```

---

### 4. Check raw metafield value

```javascript
console.log("Raw metafield:", window.__recovery_cart_config__.debug.metafieldValue);
```

---

### 5. Pretty print entire config

```javascript
console.log(JSON.stringify(window.__recovery_cart_config__, null, 2));
```

---

## 🛠️ Testing Commands

### Test if widget script loaded

```javascript
console.log("Widget script loaded:", typeof window.RecoveryCartWidget);
```

---

### Force reload widget (if available)

```javascript
if (window.RecoveryCartWidget && window.RecoveryCartWidget.init) {
  window.RecoveryCartWidget.init(window.__recovery_cart_config__);
  console.log("Widget reinitialized");
}
```

---

### Simulate different settings (temporary, for testing)

```javascript
// Test with different position
window.__recovery_cart_config__.widgetSettings.position = "bottom-left";
console.log("Position changed to:", window.__recovery_cart_config__.widgetSettings.position);

// Test with different phone number
window.__recovery_cart_config__.widgetSettings.phoneNumber = "+9999999999";
console.log("Phone changed to:", window.__recovery_cart_config__.widgetSettings.phoneNumber);

// Reload widget if possible
if (window.RecoveryCartWidget?.init) {
  window.RecoveryCartWidget.init(window.__recovery_cart_config__);
}
```

---

## 🔎 Diagnostic Commands

### Check for console warnings

Look for this warning message:
```
⚠️ No metafield found at shop.metafields.app.settings
```

If you see it, the metafield is not accessible. Follow the verification guide.

---

### Check Liquid variables (view source)

Right-click page > "View Page Source" > Search for:

```html
<script>
  (function() {
    console.group('🔍 Recovery Cart Metafield Debug');
```

You'll see the raw Liquid output:

```javascript
const savedSettings = {
  "position": "bottom-right",
  "phoneNumber": "+1234567890",
  "buttonText": "Chat with us",
  "buttonColor": { "hue": 142, "saturation": 0.77, "brightness": 0.75 }
};
```

Or if metafield is missing:

```javascript
const savedSettings = null;
```

---

## 📊 Full Debug Report

Copy and paste this into console for a complete report:

```javascript
console.group("📊 Recovery Cart Full Debug Report");

console.log("1. Config exists:", !!window.__recovery_cart_config__);

if (window.__recovery_cart_config__) {
  console.log("2. Shop:", window.__recovery_cart_config__.shop);
  console.log("3. Is Active:", window.__recovery_cart_config__.isActive);
  console.log("4. Metafield exists:", window.__recovery_cart_config__.debug.metafieldExists);
  console.log("5. Using defaults:", window.__recovery_cart_config__.debug.usingDefaults);
  
  console.group("6. Widget Settings:");
  console.table(window.__recovery_cart_config__.widgetSettings);
  console.groupEnd();
  
  console.log("7. Raw metafield value:", window.__recovery_cart_config__.debug.metafieldValue);
} else {
  console.error("❌ Config not found! Widget may not be loaded.");
}

console.log("8. Widget script loaded:", typeof window.RecoveryCartWidget !== 'undefined');

console.groupEnd();
```

**Expected output:**
```
📊 Recovery Cart Full Debug Report
  1. Config exists: true
  2. Shop: "your-store.myshopify.com"
  3. Is Active: true
  4. Metafield exists: true
  5. Using defaults: false
  6. Widget Settings:
    ┌──────────────┬────────────────────┐
    │   (index)    │      Values        │
    ├──────────────┼────────────────────┤
    │   position   │  'bottom-right'    │
    │ phoneNumber  │  '+1234567890'     │
    │  buttonText  │  'Chat with us'    │
    │ buttonColor  │  { hue: 142, ... } │
    └──────────────┴────────────────────┘
  7. Raw metafield value: { position: "bottom-right", ... }
  8. Widget script loaded: true
```

---

## 🚨 Troubleshooting Output

### If config is missing:

```
❌ Config not found! Widget may not be loaded.
```

**Fix:**
1. Check if app embed is enabled in Theme Editor
2. Verify Liquid file is in correct location
3. Check for JavaScript errors in console

---

### If using defaults:

```
5. Using defaults: true
```

**Fix:**
1. Metafield not written yet - save settings in your app
2. Metafield namespace/key mismatch - check TOML vs Liquid
3. Storefront access not enabled - check `storefront = "public_read"` in TOML

---

### If metafield doesn't exist:

```
4. Metafield exists: false
```

**Fix:**
1. Deploy: `npm run deploy`
2. Write metafield via Admin API (see METAFIELD_VERIFICATION_GUIDE.md)
3. Verify metafield in Admin UI (Settings > Custom data)

---

## 💡 Quick Tips

### Clear cache and reload

```javascript
// Force clear cache
if ('caches' in window) {
  caches.keys().then(names => {
    names.forEach(name => caches.delete(name));
    console.log("Cache cleared");
  });
}

// Then hard reload: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)
```

---

### Monitor config changes

```javascript
// Watch for config changes
let lastConfig = JSON.stringify(window.__recovery_cart_config__);

setInterval(() => {
  const currentConfig = JSON.stringify(window.__recovery_cart_config__);
  if (currentConfig !== lastConfig) {
    console.log("Config changed!", window.__recovery_cart_config__);
    lastConfig = currentConfig;
  }
}, 1000);
```

---

### Export config for debugging

```javascript
// Copy config to clipboard
copy(JSON.stringify(window.__recovery_cart_config__, null, 2));
console.log("Config copied to clipboard!");
```

---

## 📱 Mobile Debugging

For mobile devices, use remote debugging:

### Chrome (Android)
1. chrome://inspect
2. Select your device
3. Inspect page
4. Run commands in console

### Safari (iOS)
1. Settings > Safari > Advanced > Web Inspector
2. Safari > Develop > [Your Device]
3. Select page
4. Run commands in console

---

## 🎯 Common Scenarios

### Scenario 1: Settings saved but not showing

```javascript
// Check if settings are current
const config = window.__recovery_cart_config__;

console.log("Is active:", config.isActive);
console.log("Metafield value:", config.debug.metafieldValue);

// If metafieldValue is old:
// 1. Hard refresh (Ctrl+Shift+R)
// 2. Check if metafield updated in Admin API
// 3. Wait 30 seconds for CDN cache
```

---

### Scenario 2: Widget not appearing

```javascript
// Check all requirements
console.log("1. Config loaded:", !!window.__recovery_cart_config__);
console.log("2. Widget script loaded:", !!window.RecoveryCartWidget);
console.log("3. Phone number set:", window.__recovery_cart_config__?.widgetSettings?.phoneNumber);

// If widget script not loaded:
// 1. Check network tab for script URL
// 2. Verify script src in Liquid file
// 3. Check for CORS errors
```

---

### Scenario 3: Testing different colors

```javascript
// Test color conversion (if widget supports it)
function hsbToHex(hsb) {
  const { hue, saturation, brightness } = hsb;
  const h = hue, s = saturation, v = brightness;
  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;
  
  let r, g, b;
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  
  const toHex = (val) => Math.round((val + m) * 255).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

const color = window.__recovery_cart_config__.widgetSettings.buttonColor;
console.log("Button color hex:", hsbToHex(color));
```

---

## 📚 Related Files

- [Metafield Verification Guide](./METAFIELD_VERIFICATION_GUIDE.md) - Complete testing steps
- [Metafields Guide](./METAFIELDS_GUIDE.md) - Implementation details
- [Quick Reference](./METAFIELD_QUICK_REFERENCE.md) - Quick lookup
