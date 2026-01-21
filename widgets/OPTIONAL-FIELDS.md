# Optional Fields in Widget Configuration

## Overview

The WhatsApp widget supports **optional fields** that enhance flexibility without breaking functionality.

## Required Fields ✅

These fields **must** be provided:

| Field | Type | Description |
|-------|------|-------------|
| `phoneNumber` | string | WhatsApp number with country code (7-15 digits) |
| `position` | string | "bottom-left" or "bottom-right" |
| `buttonColor` | object | HSB color {hue, saturation, brightness} |

## Optional Fields ⭕

These fields are **optional** and have smart fallbacks:

### 1. Button Text (`buttonText`)

**Default behavior when empty/missing:**
- Widget displays as **icon-only** (circular button)
- Automatically adjusts CSS to circular shape
- Uses "Chat on WhatsApp" for accessibility labels

**Example:**

```javascript
// With button text
widgetSettings: {
  buttonText: "Chat with us",  // Shows: [🟢 Chat with us]
  // ...
}

// Without button text (icon only)
widgetSettings: {
  buttonText: "",  // Shows: [🟢] (circular)
  // ...
}
```

**CSS Behavior:**
- With text: Pill-shaped button with text + icon
- Without text: Circular button with icon only (48×48px)

### 2. Chat Text (`chatText`)

**Default behavior when empty/missing:**
- WhatsApp opens without pre-filled message
- User can type their own message
- No URL parameter added

**Example:**

```javascript
// With chat text
widgetSettings: {
  chatText: "Hi! I'm interested in your products.",
  // Opens: https://wa.me/1234567890?text=Hi!%20I'm%20interested...
}

// Without chat text
widgetSettings: {
  chatText: "",
  // Opens: https://wa.me/1234567890
}
```

## Complete Configuration Examples

### Full Configuration (All Fields)

```javascript
window.__recovery_cart_config__ = {
  shop: "store.myshopify.com",
  isActive: true,
  widgetSettings: {
    position: "bottom-right",
    phoneNumber: "+1234567890",
    buttonText: "Chat with us on WhatsApp",  // Optional
    buttonColor: {
      hue: 142,
      saturation: 0.77,
      brightness: 0.75
    },
    chatText: "Hi! I need help."  // Optional
  }
};
```

### Minimal Configuration (Required Only)

```javascript
window.__recovery_cart_config__ = {
  shop: "store.myshopify.com",
  isActive: true,
  widgetSettings: {
    position: "bottom-right",
    phoneNumber: "+1234567890",
    buttonText: "",  // Empty = icon only
    buttonColor: {
      hue: 142,
      saturation: 0.77,
      brightness: 0.75
    },
    chatText: ""  // Empty = no pre-filled message
  }
};
```

### Icon-Only Widget

```javascript
window.__recovery_cart_config__ = {
  shop: "store.myshopify.com",
  isActive: true,
  widgetSettings: {
    position: "bottom-right",
    phoneNumber: "+1234567890",
    buttonText: "",  // ← Icon only mode
    buttonColor: {
      hue: 142,
      saturation: 0.77,
      brightness: 0.75
    }
  }
};
```

## Visual Differences

### With Button Text
```
Desktop:  ┌─────────────────────────────┐
          │  🟢  Chat with us           │
          └─────────────────────────────┘

Mobile:   ┌──────────────────┐
          │ 🟢 Chat with us  │
          └──────────────────┘
```

### Without Button Text (Icon Only)
```
Desktop:  ┌──────┐
          │  🟢  │  (48×48px circle)
          └──────┘

Mobile:   ┌─────┐
          │ 🟢  │  (44×44px circle)
          └─────┘
```

## Validation

The widget validates **only required fields**:

```javascript
// ✅ Valid - All required fields present
{
  phoneNumber: "+1234567890",
  position: "bottom-right",
  buttonColor: { hue: 142, saturation: 0.77, brightness: 0.75 }
}

// ✅ Valid - Optional fields empty
{
  phoneNumber: "+1234567890",
  position: "bottom-right",
  buttonColor: { hue: 142, saturation: 0.77, brightness: 0.75 },
  buttonText: "",
  chatText: ""
}

// ❌ Invalid - Missing required field
{
  position: "bottom-right",
  buttonColor: { hue: 142, saturation: 0.77, brightness: 0.75 }
  // Missing phoneNumber!
}
```

## Admin Panel Integration

When saving settings from the admin panel:

```javascript
// If merchant leaves fields empty
const settingsData = {
  position: formData.get("position"),
  phoneNumber: formData.get("phoneNumber"),
  buttonText: formData.get("buttonText") || "",  // ← Empty string if not provided
  buttonColor: JSON.parse(formData.get("buttonColor")),
  chatText: formData.get("chatText") || "",  // ← Empty string if not provided
};
```

## Benefits

✅ **Flexibility** - Merchants can choose icon-only or text+icon
✅ **No Breaking Changes** - Empty fields don't cause errors
✅ **Smart Defaults** - Widget adapts automatically
✅ **Better UX** - Icon-only mode for minimal design
✅ **Accessibility** - Proper labels even without text

## CSS Classes

The widget automatically applies CSS classes:

- `.whatsapp-widget` - Base class (always present)
- `.bottom-left` or `.bottom-right` - Position class
- `.icon-only` - Added when buttonText is empty

```css
/* With text */
.whatsapp-widget { /* pill shape */ }

/* Without text (icon only) */
.whatsapp-widget.icon-only { 
  border-radius: 50%;
  width: 48px;
  height: 48px;
}
```

## Testing

Test both scenarios:

```bash
# Test with text
window.__recovery_cart_config__.widgetSettings.buttonText = "Chat now";

# Test without text (icon only)
window.__recovery_cart_config__.widgetSettings.buttonText = "";

# Reload to see changes
location.reload();
```
