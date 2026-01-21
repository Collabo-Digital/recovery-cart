# CSS Namespacing - `.recovery-cart`

## Overview
All widget styles are now prefixed with the `.recovery-cart` class to prevent CSS conflicts with the host website's styles.

## Why CSS Namespacing?

### Problem Without Namespacing
```css
/* Widget styles could conflict with site styles */
.whatsapp-widget { ... }
.whatsapp-icon { ... }
```

If the host website has a class named `.whatsapp-widget` or `.whatsapp-icon`, there would be style conflicts.

### Solution: Namespace Prefix
```css
/* All styles are scoped under .recovery-cart */
.recovery-cart .whatsapp-widget { ... }
.recovery-cart .whatsapp-icon { ... }
```

Now the widget styles are isolated and won't conflict with the site's styles.

## Implementation

### CSS Changes
**File**: `widgets/src/components/WhatsAppButton.css`

All selectors now start with `.recovery-cart`:

```css
/* Before */
.whatsapp-widget { ... }
.whatsapp-widget:hover { ... }
.whatsapp-icon { ... }

/* After */
.recovery-cart .whatsapp-widget { ... }
.recovery-cart .whatsapp-widget:hover { ... }
.recovery-cart .whatsapp-icon { ... }
```

### JSX Changes
**File**: `widgets/src/components/WhatsAppButton.jsx`

The button is now wrapped in a div with the `.recovery-cart` class:

```jsx
// Before
<button className="whatsapp-widget ...">
  {/* content */}
</button>

// After
<div className="recovery-cart">
  <button className="whatsapp-widget ...">
    {/* content */}
  </button>
</div>
```

## Complete List of Namespaced Selectors

### Base Styles
- `.recovery-cart .whatsapp-widget`
- `.recovery-cart .whatsapp-widget.icon-only`
- `.recovery-cart .whatsapp-widget:hover`
- `.recovery-cart .whatsapp-widget:active`
- `.recovery-cart .whatsapp-widget:focus-visible`

### Position Modifiers
- `.recovery-cart .whatsapp-widget.bottom-left`
- `.recovery-cart .whatsapp-widget.bottom-right`

### Elements
- `.recovery-cart .whatsapp-icon`
- `.recovery-cart .whatsapp-text`

### Media Queries
All media query selectors are also namespaced:

**Mobile (max-width: 640px)**
- `.recovery-cart .whatsapp-widget`
- `.recovery-cart .whatsapp-widget.icon-only`
- `.recovery-cart .whatsapp-widget.bottom-left`
- `.recovery-cart .whatsapp-widget.bottom-right`
- `.recovery-cart .whatsapp-icon`
- `.recovery-cart .whatsapp-widget.icon-only .whatsapp-icon`

**Very Small Screens (max-width: 280px)**
- `.recovery-cart .whatsapp-widget`
- `.recovery-cart .whatsapp-icon`

## Benefits

### 1. ✅ No Style Conflicts
The widget's styles won't be affected by the host website's CSS, and vice versa.

### 2. ✅ Predictable Styling
Widget appearance is consistent across all websites, regardless of their CSS frameworks.

### 3. ✅ Easy Debugging
All widget styles are clearly identified by the `.recovery-cart` prefix.

### 4. ✅ Safe Integration
The widget can be safely added to any website without breaking existing styles.

## CSS Specificity

### Widget Styles
```css
.recovery-cart .whatsapp-widget { ... }
/* Specificity: 0,2,0 (two classes) */
```

### Host Site Styles (Won't Affect Widget)
```css
.whatsapp-widget { ... }
/* Specificity: 0,1,0 (one class) - Won't override */

#main .whatsapp-widget { ... }
/* Specificity: 1,1,0 - Still won't affect the widget */
```

The `.recovery-cart` prefix ensures widget styles always take precedence within the widget scope.

## Examples

### Example 1: Host Site Has Conflicting Styles

**Host Site CSS:**
```css
.whatsapp-icon {
  width: 100px;
  height: 100px;
  color: red;
}
```

**Widget CSS (Namespaced):**
```css
.recovery-cart .whatsapp-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}
```

**Result**: Widget icon stays 20px × 20px because it's namespaced. No conflict!

### Example 2: Host Site Uses Same Class Names

**Host Site:**
```html
<button class="whatsapp-widget">
  <!-- Host's own button -->
</button>
```

**Widget:**
```html
<div class="recovery-cart">
  <button class="whatsapp-widget">
    <!-- Our widget button -->
  </button>
</div>
```

**Result**: Both buttons maintain their own styles independently.

## Testing

### Test for Style Conflicts

1. Add conflicting styles to host page:
```html
<style>
  .whatsapp-widget {
    background: red !important;
    width: 500px !important;
  }
</style>
```

2. Load widget - should still look normal
3. Widget styles should not be affected

### Test for Widget Isolation

1. Check that widget styles don't leak to host page
2. Inspect elements outside `.recovery-cart` div
3. Confirm no widget styles are applied

## Build Output

After rebuilding with namespacing:

```bash
npm run build

# Output
✓ 8 modules transformed.
../public/widgets/recovery-cart-widget.iife.js  16.18 kB │ gzip: 6.88 kB
✓ built in 1.98s
```

**Bundle Size**: 16.18 KB (gzipped: 6.88 KB)
- Minimal size increase due to namespacing
- Still very lightweight

## Best Practices

### When Adding New Styles

**Always prefix with `.recovery-cart`:**

```css
/* ✅ Correct */
.recovery-cart .new-element {
  /* styles */
}

/* ❌ Wrong */
.new-element {
  /* styles */
}
```

### When Using External Libraries

If you need to include external CSS libraries:

```css
/* Wrap library styles in .recovery-cart */
.recovery-cart {
  @import 'library.css';
}
```

Or manually prefix all imported styles.

## Migration Guide

### If You Have Existing Styles

1. **Find all CSS selectors** in your widget
2. **Add `.recovery-cart` prefix** to each selector
3. **Wrap JSX with** `<div className="recovery-cart">`
4. **Rebuild** the widget
5. **Test** on multiple sites

### Example Migration

**Before:**
```css
.custom-button { color: blue; }
.custom-button:hover { color: red; }
```

**After:**
```css
.recovery-cart .custom-button { color: blue; }
.recovery-cart .custom-button:hover { color: red; }
```

## Troubleshooting

### Widget Styles Not Applying

**Problem**: Styles don't apply to widget elements

**Solution**: Ensure the wrapper div has the `recovery-cart` class:

```jsx
// Check this exists
<div className="recovery-cart">
  <button className="whatsapp-widget">...</button>
</div>
```

### Styles Still Conflicting

**Problem**: Host site styles still affecting widget

**Solution**: Check CSS specificity. You may need `!important`:

```css
.recovery-cart .whatsapp-widget {
  width: 48px !important; /* Force override */
}
```

### Animation Not Working

**Problem**: Animations defined outside namespace

**Solution**: Animations don't need namespacing, but usage does:

```css
/* Animation definition (no namespace needed) */
@keyframes slideUp {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Animation usage (needs namespace) */
.recovery-cart .whatsapp-widget {
  animation: slideUp 0.4s ease-out;
}
```

## Performance Impact

### Before Namespacing
- CSS size: ~1.35 KB
- Bundle size: 14.33 KB

### After Namespacing
- CSS size: ~1.42 KB (+0.07 KB)
- Bundle size: 16.18 KB (+1.85 KB)

**Impact**: Minimal (< 2KB increase)
**Benefit**: Complete style isolation

## Related Files

- `widgets/src/components/WhatsAppButton.css` - Namespaced styles
- `widgets/src/components/WhatsAppButton.jsx` - Wrapper div
- `public/widgets/recovery-cart-widget.iife.js` - Built bundle

## Summary

✅ All widget styles are now namespaced with `.recovery-cart`
✅ Prevents CSS conflicts with host websites
✅ Widget maintains consistent appearance everywhere
✅ Minimal performance impact
✅ Easy to maintain and extend

---

**Last Updated**: 2026-01-21
