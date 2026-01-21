# Widget Code Structure

Clean, modular organization for easy understanding and maintenance.

## Folder Structure

```
widgets/
├── src/
│   ├── components/              # UI Components
│   │   ├── WhatsAppButton.jsx   # Main widget component
│   │   └── WhatsAppButton.css   # Widget styles
│   │
│   ├── utils/                   # Utility Functions
│   │   ├── validation.js        # Config validation logic
│   │   └── helpers.js           # Phone, color, URL helpers
│   │
│   ├── config/                  # Configuration
│   │   └── defaults.js          # Default values & constants
│   │
│   └── index.jsx                # Entry point & initialization
│
├── public/widgets/              # Build output
│   └── recovery-cart-widget.iife.js
│
├── package.json
├── vite.config.js
└── README.md
```

## File Purposes

### Components (`src/components/`)
**WhatsAppButton.jsx** - The main widget component
- Reads config from window object
- Validates configuration
- Handles click events
- Renders the button

**WhatsAppButton.css** - Button styles
- Positioning (bottom-left/right)
- Hover effects
- Mobile responsive
- Accessibility

### Utils (`src/utils/`)
**validation.js** - Validates all inputs
- `validatePhone()` - Phone number validation
- `validateText()` - Button text validation
- `validatePosition()` - Position validation
- `validateColor()` - Color (HSB) validation
- `validateConfig()` - Complete config validation

**helpers.js** - Helper functions
- `sanitizePhone()` - Clean phone number
- `hsbToRgb()` - Color conversion
- `buildWhatsAppUrl()` - URL construction
- `log()` - Safe logging (dev/prod aware)

### Config (`src/config/`)
**defaults.js** - Default configuration
- `DEFAULT_CONFIG` - Fallback values
- `WIDGET_NAMESPACE` - Window variable name

### Entry Point
**index.jsx** - Widget initialization
- Checks for config
- Creates container
- Renders widget
- Handles dev mode

## Data Flow

```
1. Shopify Admin Panel
   ↓ saves to
2. Metafield (JSON)
   ↓ loaded by Liquid
3. window.__recovery_cart_config__
   ↓ read by
4. index.jsx (init)
   ↓ passes to
5. WhatsAppButton.jsx
   ↓ validates with
6. validation.js
   ↓ if valid
7. Renders widget
```

## Key Concepts

### Modular Design
Each file has ONE clear purpose:
- Components = UI
- Utils = Logic
- Config = Constants

### Simple Validation
```javascript
// utils/validation.js
export const validatePhone = (phone) => {
  // Returns: { valid: boolean, error: string }
};
```

### Easy Configuration
```javascript
// config/defaults.js
export const DEFAULT_CONFIG = {
  position: 'bottom-right',
  buttonText: 'Chat on WhatsApp',
  // ...
};
```

### Safe Helpers
```javascript
// utils/helpers.js
export const sanitizePhone = (phone) => {
  // Removes dangerous characters
};
```

## How to Extend

### Add New Validation
Edit `src/utils/validation.js`:
```javascript
export const validateNewField = (value) => {
  if (!value) {
    return { valid: false, error: 'Field required' };
  }
  return { valid: true };
};
```

### Add New Helper
Edit `src/utils/helpers.js`:
```javascript
export const newHelper = (input) => {
  // Do something
  return output;
};
```

### Add New Default
Edit `src/config/defaults.js`:
```javascript
export const DEFAULT_CONFIG = {
  // ... existing
  newField: 'default value',
};
```

### Update Component
Edit `src/components/WhatsAppButton.jsx`:
```javascript
// Import new functions
import { newHelper } from '../utils/helpers';

// Use in component
const result = newHelper(config().field);
```

## Building

```bash
# Development
npm run dev

# Production
npm run build
```

## Testing Locally

1. Start dev server: `npm run dev`
2. Open: `http://localhost:3000`
3. Widget uses demo config automatically
4. Check console for logs

## Integration

Add to Shopify theme:

```liquid
<script>
  window.__recovery_cart_config__ = {
    shop: {{ shop.permanent_domain | json }},
    isActive: true,
    widgetSettings: {{ shop.metafields.app.settings.value | json }}
  };
</script>
<script src="{{ 'recovery-cart-widget.iife.js' | asset_url }}" defer></script>
```

## Benefits of This Structure

✅ **Easy to understand** - One file = One purpose
✅ **Easy to test** - Functions are isolated
✅ **Easy to extend** - Add files without breaking existing
✅ **Easy to maintain** - Know exactly where to look
✅ **Easy to debug** - Clear separation of concerns
