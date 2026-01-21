# WhatsApp Widget

Simple, modular WhatsApp widget for Shopify stores.

## Structure

```
src/
├── components/          # UI components
│   ├── WhatsAppButton.jsx
│   └── WhatsAppButton.css
├── utils/              # Helper functions
│   ├── validation.js   # Config validation
│   └── helpers.js      # Phone, color, URL utils
├── config/             # Configuration
│   └── defaults.js     # Default values
└── index.jsx           # Entry point
```

## Development

```bash
npm install
npm run dev     # Run at localhost:3000
```

## Build

```bash
npm run build   # Output: ../public/widgets/recovery-cart-widget.iife.js
```

## Usage

The widget reads from `window.__recovery_cart_config__`:

```javascript
window.__recovery_cart_config__ = {
  shop: "store.myshopify.com",
  isActive: true,
  widgetSettings: {
    position: "bottom-right",      // or "bottom-left"
    phoneNumber: "+1234567890",    // with country code
    buttonText: "Chat with us",
    buttonColor: {
      hue: 142,        // 0-360
      saturation: 0.77, // 0-1
      brightness: 0.75  // 0-1
    },
    chatText: "Hello!" // optional
  }
};
```

## Validation

- **Phone**: 7-15 digits
- **Text**: 1-100 characters
- **Position**: "bottom-left" or "bottom-right"
- **Color**: HSB format (ranges above)

## Files

- `components/WhatsAppButton.jsx` - Main widget component
- `utils/validation.js` - Input validation
- `utils/helpers.js` - Phone/color/URL helpers
- `config/defaults.js` - Default configuration
- `index.jsx` - Initialization
