# Quick Reference - App Config System

## Metafield Details

```
Namespace: app_config
Key: widget_settings
Type: json
Location: Shop metafield
```

## Files

### Admin
```
app/routes/app._index.jsx
```
Saves to MongoDB + Metafield

### Storefront
```
blocks/app_config.liquid
snippets/app-config.liquid
```
Exposes config to `window.appConfig.widgetSettings`

## Usage

### Add to Theme

**Theme Editor:**
```
Add block → "App Config"
```

**Code:**
```liquid
{% render 'app-config' %}
```

### Access in JavaScript

**Event Listener (Recommended):**
```javascript
window.addEventListener('appConfigLoaded', function(event) {
  const config = event.detail.widgetSettings;
  // Use config...
});
```

**Direct Access:**
```javascript
if (window.appConfig && window.appConfig.widgetSettings) {
  const config = window.appConfig.widgetSettings;
  // Use config...
}
```

## Config Structure

```javascript
{
  position: "bottom-right",      // or "bottom-left"
  phoneNumber: "+1234567890",    // WhatsApp number
  buttonText: "Chat with us",    // Button label
  buttonColor: {                 // HSB format
    hue: 142,
    saturation: 0.77,
    brightness: 0.75
  }
}
```

## HSB to RGB Conversion

```javascript
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

// Usage
const { hue, saturation, brightness } = config.buttonColor;
const [r, g, b] = hsbToRgb(hue, saturation, brightness);
const color = `rgb(${r}, ${g}, ${b})`;
```

## Example Widget

```javascript
window.addEventListener('appConfigLoaded', function(event) {
  const config = event.detail.widgetSettings;
  
  if (!config.phoneNumber) return;
  
  // Convert color
  const { hue, saturation, brightness } = config.buttonColor;
  const [r, g, b] = hsbToRgb(hue, saturation, brightness);
  
  // Create button
  const button = document.createElement('a');
  button.href = `https://wa.me/${config.phoneNumber.replace(/[^0-9+]/g, '')}`;
  button.target = '_blank';
  button.textContent = config.buttonText;
  button.style.cssText = `
    position: fixed;
    ${config.position === 'bottom-left' ? 'left: 20px' : 'right: 20px'};
    bottom: 20px;
    background: rgb(${r}, ${g}, ${b});
    color: white;
    padding: 15px 25px;
    border-radius: 50px;
    text-decoration: none;
    z-index: 9999;
  `;
  
  document.body.appendChild(button);
});
```

## Commands

```bash
# Development
npm run dev

# Deploy extension
npm run deploy

# Setup database
npm run setup

# Prisma studio
npx prisma studio
```

## Verify Setup

### Check Metafield (GraphQL)
```graphql
query {
  shop {
    metafield(namespace: "app_config", key: "widget_settings") {
      value
    }
  }
}
```

### Check Window Object (Browser Console)
```javascript
console.log(window.appConfig);
console.log(window.appConfig.widgetSettings);
```

### Test Event (Browser Console)
```javascript
window.addEventListener('appConfigLoaded', function(e) {
  console.log('Config loaded:', e.detail);
});
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Config not loading | Check metafield exists, verify snippet/block added |
| Config not updating | Save settings again in admin |
| Event not firing | Add listener before config loads |
| Wrong color | Re-save settings, check HSB to RGB conversion |

## Documentation

- **[APP_CONFIG_GUIDE.md](./APP_CONFIG_GUIDE.md)** - Complete guide
- **[CHANGES_SUMMARY.md](./CHANGES_SUMMARY.md)** - What changed
- **[QUICK_REFERENCE.md](./QUICK_REFERENCE.md)** - This file

---

**Quick Start:** Save settings in admin → Add snippet to theme → Access via `window.appConfig.widgetSettings`
