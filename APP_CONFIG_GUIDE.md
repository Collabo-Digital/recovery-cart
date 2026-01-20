# App Configuration Guide

## Overview

This app uses a generic configuration system that stores settings in Shopify metafields and exposes them to the storefront via a `window.appConfig` object.

## How It Works

### 1. Admin Side (React)

When you save settings in the admin panel:
- Settings are saved to **MongoDB** (for admin use)
- Settings are saved to **Shopify Metafield** (for storefront use)

**Metafield Details:**
- **Namespace:** `app_config`
- **Key:** `widget_settings`
- **Type:** `json`

### 2. Storefront Side (Liquid)

The Liquid files expose the configuration to JavaScript via `window.appConfig`:

**Block:** `blocks/app_config.liquid`  
**Snippet:** `snippets/app-config.liquid`

Both do the same thing: Load metafield data into `window.appConfig.widgetSettings`

## Usage

### Adding Config to Theme

**Option A: Using Theme Editor**
1. Go to Online Store > Themes > Customize
2. Add block "App Config"
3. Save

**Option B: Using Code**
```liquid
{% render 'app-config' %}
```

Add this to your `theme.liquid` before `</body>`

### Accessing Config in JavaScript

```javascript
// Wait for config to load
window.addEventListener('appConfigLoaded', function(event) {
  const config = event.detail.widgetSettings;
  
  console.log('Position:', config.position);
  console.log('Phone:', config.phoneNumber);
  console.log('Button Text:', config.buttonText);
  console.log('Button Color:', config.buttonColor);
});

// Or access directly (if already loaded)
if (window.appConfig && window.appConfig.widgetSettings) {
  const config = window.appConfig.widgetSettings;
  // Use config...
}
```

### Config Structure

```javascript
window.appConfig.widgetSettings = {
  position: "bottom-right",        // "bottom-left" or "bottom-right"
  phoneNumber: "+1234567890",      // WhatsApp number
  buttonText: "Chat with us",      // Button label
  buttonColor: {                   // HSB color format
    hue: 142,
    saturation: 0.77,
    brightness: 0.75
  }
}
```

## Example: Building a Widget

```javascript
// Listen for config load
window.addEventListener('appConfigLoaded', function(event) {
  const config = event.detail.widgetSettings;
  
  // Don't render if no phone number
  if (!config.phoneNumber) return;
  
  // Convert HSB to RGB
  function hsbToRgb(h, s, v) {
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
    
    return [
      Math.round((r + m) * 255),
      Math.round((g + m) * 255),
      Math.round((b + m) * 255)
    ];
  }
  
  // Get RGB color
  const [r, g, b] = hsbToRgb(
    config.buttonColor.hue,
    config.buttonColor.saturation,
    config.buttonColor.brightness
  );
  
  // Create button
  const button = document.createElement('a');
  button.style.cssText = `
    position: fixed;
    ${config.position === 'bottom-left' ? 'left: 20px' : 'right: 20px'};
    bottom: 20px;
    width: 60px;
    height: 60px;
    background-color: rgb(${r}, ${g}, ${b});
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    cursor: pointer;
  `;
  
  button.href = `https://wa.me/${config.phoneNumber.replace(/[^0-9+]/g, '')}`;
  button.target = '_blank';
  button.title = config.buttonText;
  
  // Add to page
  document.body.appendChild(button);
});
```

## Benefits

### ✅ Generic & Flexible
- Not tied to specific widget type
- Can add more settings in future
- Single config system for all features

### ✅ Fast Performance
- No API calls from storefront
- Metafield cached by Shopify
- Config loads once per page

### ✅ Developer Friendly
- Simple JavaScript API
- Event-based loading
- Easy to extend

### ✅ Future Proof
- Can add new config keys anytime
- Backward compatible
- No breaking changes

## Adding New Settings

### 1. Update Admin Form
Add new fields to `app/routes/app._index.jsx`

### 2. Update Database Schema
Add fields to `WidgetSettings` model in `prisma/schema.prisma`

### 3. Update Metafield Save
Include new fields in metafield JSON in action function

### 4. Use in JavaScript
Access via `window.appConfig.widgetSettings.yourNewField`

## Example: Adding Business Hours

**Admin Side:**
```javascript
// In app._index.jsx action
const settings = {
  // ... existing fields
  businessHours: {
    enabled: formData.get("businessHoursEnabled") === "true",
    start: formData.get("businessHoursStart"),
    end: formData.get("businessHoursEnd")
  }
};
```

**Storefront Side:**
```javascript
window.addEventListener('appConfigLoaded', function(event) {
  const config = event.detail.widgetSettings;
  
  // Check business hours
  if (config.businessHours && config.businessHours.enabled) {
    const now = new Date();
    const currentHour = now.getHours();
    const start = parseInt(config.businessHours.start);
    const end = parseInt(config.businessHours.end);
    
    if (currentHour < start || currentHour >= end) {
      console.log('Outside business hours');
      return; // Don't show widget
    }
  }
  
  // Show widget...
});
```

## Testing

### Verify Metafield Created

**GraphQL Query:**
```graphql
query {
  shop {
    metafield(namespace: "app_config", key: "widget_settings") {
      id
      namespace
      key
      type
      value
    }
  }
}
```

**Or in Shopify Admin:**
Settings > Custom data > Shops > app_config.widget_settings

### Verify Window Object

**Browser Console:**
```javascript
console.log(window.appConfig);
console.log(window.appConfig.widgetSettings);
```

### Test Event Listener

```javascript
window.addEventListener('appConfigLoaded', function(event) {
  console.log('Config loaded:', event.detail);
});
```

## Troubleshooting

### Config Not Loading?

**Check 1:** Metafield exists
```graphql
query {
  shop {
    metafield(namespace: "app_config", key: "widget_settings") {
      value
    }
  }
}
```

**Check 2:** Block/snippet added to theme
- Verify `{% render 'app-config' %}` is in theme
- Or block is added via theme editor

**Check 3:** JavaScript console
- Check for errors
- Verify `window.appConfig` exists

### Config Not Updating?

**Solution:** Save settings again in admin panel

### Event Not Firing?

**Check:** Listen before config loads
```javascript
// Add listener early (in <head> or top of <body>)
document.addEventListener('DOMContentLoaded', function() {
  window.addEventListener('appConfigLoaded', function(event) {
    console.log('Config:', event.detail);
  });
});
```

## File Structure

```
app/routes/
  └── app._index.jsx              # Admin settings (saves to metafield)

extensions/recovery-cart-extenstion/
  ├── blocks/
  │   └── app_config.liquid       # Block version (exposes to window)
  └── snippets/
      └── app-config.liquid       # Snippet version (exposes to window)

prisma/
  └── schema.prisma               # WidgetSettings model
```

## Summary

1. **Admin saves** → MongoDB + Metafield (`app_config.widget_settings`)
2. **Liquid loads** → Exposes to `window.appConfig.widgetSettings`
3. **JavaScript uses** → Build features with config data
4. **Event fires** → `appConfigLoaded` notifies when ready

---

**This approach gives you maximum flexibility to build any feature using the config data!**
