# Widget Display Modes

## Two Display Modes

The widget automatically switches between two modes based on `buttonText`:

### Mode 1: Text + Icon (Default)
**When:** `buttonText` has content
**Shape:** Pill-shaped button
**Size:** Auto-width based on text

```
Desktop (with text):
┌─────────────────────────────┐
│  🟢  Chat with us           │  ← Pill shape
└─────────────────────────────┘
Padding: 10px 16px
Border-radius: 30px
Width: auto
```

### Mode 2: Icon Only
**When:** `buttonText` is empty or missing
**Shape:** Circular button
**Size:** Fixed 48×48px

```
Desktop (icon only):
┌──────┐
│  🟢  │  ← Circle
└──────┘
Padding: 12px
Border-radius: 50%
Width: 48px × 48px
```

## CSS Classes Applied

### With Text
```html
<button class="whatsapp-widget bottom-right">
  <svg class="whatsapp-icon">...</svg>
  <span class="whatsapp-text">Chat with us</span>
</button>
```

### Without Text (Icon Only)
```html
<button class="whatsapp-widget bottom-right icon-only">
  <svg class="whatsapp-icon">...</svg>
  <!-- No span element rendered -->
</button>
```

## Responsive Behavior

### Desktop (> 640px)

| Mode | Width | Height | Padding | Shape |
|------|-------|--------|---------|-------|
| With Text | Auto | Auto | 10px 16px | Pill |
| Icon Only | 48px | 48px | 12px | Circle |

### Mobile (< 640px)

| Mode | Width | Height | Padding | Shape |
|------|-------|--------|---------|-------|
| With Text | Auto | Auto | 10px 14px | Pill |
| Icon Only | 44px | 44px | 10px | Circle |

### Very Small (< 380px)

**Both modes become icon-only on very small screens**

| Mode | Width | Height | Padding | Shape |
|------|-------|--------|---------|-------|
| Any | 48px | 48px | 12px | Circle |

## Configuration Examples

### Example 1: Full Text Button
```javascript
widgetSettings: {
  buttonText: "Chat with us on WhatsApp",
  // ... other settings
}
```
**Result:** `[🟢 Chat with us on WhatsApp]` (pill shape)

### Example 2: Short Text Button
```javascript
widgetSettings: {
  buttonText: "Chat",
  // ... other settings
}
```
**Result:** `[🟢 Chat]` (pill shape, compact)

### Example 3: Icon Only
```javascript
widgetSettings: {
  buttonText: "",  // Empty
  // ... other settings
}
```
**Result:** `[🟢]` (circular, 48×48px)

### Example 4: Null/Undefined Text
```javascript
widgetSettings: {
  // buttonText not provided
  // ... other settings
}
```
**Result:** `[🟢]` (circular, 48×48px)

## Accessibility

Both modes maintain proper accessibility:

### With Text
```html
<button 
  aria-label="Chat with us"
  title="Chat with us"
>
  <svg aria-hidden="true">...</svg>
  <span>Chat with us</span>
</button>
```

### Icon Only
```html
<button 
  aria-label="Chat on WhatsApp"
  title="Chat on WhatsApp"
>
  <svg aria-hidden="true">...</svg>
</button>
```

## When to Use Each Mode

### Use Text + Icon When:
- ✅ You want clear call-to-action
- ✅ First-time visitors need guidance
- ✅ You have space for text
- ✅ Brand requires explicit messaging

### Use Icon Only When:
- ✅ You want minimal/clean design
- ✅ Limited screen space
- ✅ Users already know what it is
- ✅ Design aesthetic prefers subtle elements

## CSS Breakdown

### Base Styles (Both Modes)
```css
.whatsapp-widget {
  position: fixed;
  bottom: 20px;
  z-index: 999999;
  display: flex;
  align-items: center;
  justify-content: center;
  /* ... */
}
```

### Icon-Only Override
```css
.whatsapp-widget.icon-only {
  padding: 12px;
  border-radius: 50%;  /* Circle */
  width: 48px;
  height: 48px;
  gap: 0;  /* No gap between elements */
}
```

## Testing Both Modes

```javascript
// Test with text
window.__recovery_cart_config__.widgetSettings.buttonText = "Chat now";
location.reload();

// Test icon only
window.__recovery_cart_config__.widgetSettings.buttonText = "";
location.reload();

// Test with different text lengths
window.__recovery_cart_config__.widgetSettings.buttonText = "Help";
location.reload();

window.__recovery_cart_config__.widgetSettings.buttonText = "Chat with us on WhatsApp";
location.reload();
```

## Animation

Both modes use the same slide-up animation:

```css
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

**Duration:** 0.4s ease-out

## Hover Effect

Both modes have the same hover effect:

```css
.whatsapp-widget:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
}
```

**Effect:** Lifts up 3px and scales to 105%
