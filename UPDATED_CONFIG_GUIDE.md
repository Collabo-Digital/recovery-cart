# Updated App Config Guide

## Changes Made

The config is now exposed using a simpler, more reliable pattern that matches proven working examples.

## New Implementation

### Block/Snippet Code

```liquid
{% assign app_config = shop.metafields.app_config.widget_settings %}

<script>
  window.__recovery_cart_config__ = {
    shop: {{ shop.permanent_domain | json }},
    widgetSettings: {{ app_config | json }},
    isActive: true
  };
</script>
```

### Key Differences from Before

**Before (Not Working):**
```javascript
// Used IIFE and event system
window.appConfig = window.appConfig || {};
window.appConfig.widgetSettings = {{ app_config }};
window.dispatchEvent(new CustomEvent('appConfigLoaded', ...));
```

**Now (Working):**
```javascript
// Simple direct assignment with json filter
window.__recovery_cart_config__ = {
  shop: {{ shop.permanent_domain | json }},
  widgetSettings: {{ app_config | json }},
  isActive: true
};
```

## Why This Works Better

### ✅ JSON Filter
- `{{ app_config | json }}` - Properly serializes the metafield data
- Prevents syntax errors in JavaScript
- Ensures valid JSON output

### ✅ Simple Assignment
- No IIFE wrapper needed
- No event system complexity
- Loads synchronously

### ✅ Additional Context
- Includes `shop.permanent_domain` for shop identification
- `isActive` flag for feature toggling
- Clean, predictable structure

## Usage

### Add to Theme

**Option A: Block (Theme Editor)**
1. Go to Online Store > Themes > Customize
2. Add "Recovery Cart" block
3. Block targets `<head>` automatically

**Option B: Snippet (Code)**
```liquid
{% render 'app-config' %}
```

Add to `theme.liquid` in `<head>` section

### Access in JavaScript

**Simple Direct Access:**
```javascript
// No event listener needed!
const config = window.__recovery_cart_config__;

console.log('Shop:', config.shop);
console.log('Settings:', config.widgetSettings);
console.log('Active:', config.isActive);
```

**Wait for DOM Ready (Recommended):**
```javascript
document.addEventListener('DOMContentLoaded', function() {
  const config = window.__recovery_cart_config__;
  
  if (!config || !config.widgetSettings) {
    console.log('Config not loaded');
    return;
  }
  
  // Use config
  const settings = config.widgetSettings;
  console.log('Position:', settings.position);
  console.log('Phone:', settings.phoneNumber);
  console.log('Button Text:', settings.buttonText);
  console.log('Button Color:', settings.buttonColor);
});
```

## Config Structure

```javascript
window.__recovery_cart_config__ = {
  shop: "your-store.myshopify.com",  // Shop domain
  isActive: true,                     // Feature flag
  widgetSettings: {                   // Your settings
    position: "bottom-right",
    phoneNumber: "+1234567890",
    buttonText: "Chat with us",
    buttonColor: {
      hue: 142,
      saturation: 0.77,
      brightness: 0.75
    }
  }
}
```

## Example: Build WhatsApp Widget

```javascript
document.addEventListener('DOMContentLoaded', function() {
  const config = window.__recovery_cart_config__;
  
  if (!config || !config.isActive || !config.widgetSettings) {
    return;
  }
  
  const settings = config.widgetSettings;
  
  // Don't show if no phone number
  if (!settings.phoneNumber) return;
  
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
  
  // Get color
  const { hue, saturation, brightness } = settings.buttonColor;
  const [r, g, b] = hsbToRgb(hue, saturation, brightness);
  
  // Create button
  const button = document.createElement('a');
  button.href = `https://wa.me/${settings.phoneNumber.replace(/[^0-9+]/g, '')}`;
  button.target = '_blank';
  button.textContent = settings.buttonText;
  button.style.cssText = `
    position: fixed;
    ${settings.position === 'bottom-left' ? 'left: 20px' : 'right: 20px'};
    bottom: 20px;
    width: 60px;
    height: 60px;
    background: rgb(${r}, ${g}, ${b});
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    text-decoration: none;
    font-size: 24px;
    z-index: 9999;
  `;
  button.innerHTML = '💬';
  
  document.body.appendChild(button);
});
```

## Schema Details

```json
{
  "name": "Recovery Cart",
  "target": "head"
}
```

**Key Points:**
- `target: "head"` - Loads in `<head>` section
- No settings needed - config comes from metafield
- Simple, clean schema

## Troubleshooting

### Config Not Defined?

**Check 1:** Block/snippet added to theme
```javascript
console.log(window.__recovery_cart_config__);
```

**Check 2:** Metafield exists
```graphql
query {
  shop {
    metafield(namespace: "app_config", key: "widget_settings") {
      value
    }
  }
}
```

**Check 3:** JSON filter working
- View page source
- Look for `window.__recovery_cart_config__`
- Should see valid JSON

### Config is Null?

**Cause:** Metafield is empty or not created yet

**Solution:** Save settings in admin panel first

### Syntax Error?

**Cause:** Missing `| json` filter

**Fix:** Always use `{{ variable | json }}` for objects

## Benefits

### ✅ Proven Pattern
- Based on working example
- Used by successful apps
- Battle-tested approach

### ✅ Simpler Code
- No IIFE wrapper
- No event system
- Direct assignment

### ✅ Better Error Handling
- JSON filter prevents syntax errors
- Clear structure
- Easy to debug

### ✅ More Context
- Shop domain included
- Feature flag for toggling
- Clean namespace

## Testing

### 1. Check Config Exists
```javascript
console.log(window.__recovery_cart_config__);
```

### 2. Check Structure
```javascript
const config = window.__recovery_cart_config__;
console.log('Shop:', config.shop);
console.log('Active:', config.isActive);
console.log('Settings:', config.widgetSettings);
```

### 3. Test Settings
```javascript
const settings = window.__recovery_cart_config__.widgetSettings;
console.log('Position:', settings.position);
console.log('Phone:', settings.phoneNumber);
console.log('Text:', settings.buttonText);
console.log('Color:', settings.buttonColor);
```

## Next Steps

1. **Deploy extension:**
   ```bash
   npm run deploy
   ```

2. **Add block to theme:**
   - Theme editor > Add "Recovery Cart" block
   - Or add `{% render 'app-config' %}` in `<head>`

3. **Save settings in admin:**
   - Configure widget settings
   - Click Save

4. **Build your widget:**
   - Access `window.__recovery_cart_config__`
   - Use `widgetSettings` to build UI

---

**This approach is simpler, more reliable, and follows proven patterns!** 🎉
