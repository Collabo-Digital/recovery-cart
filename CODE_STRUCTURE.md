# Code Structure Guide

## Overview
This document explains the codebase structure and how different parts work together.

## Directory Structure

```
recovery-cart/
│
├── app/                              # Main application code
│   ├── components/                   # Reusable React components
│   │   └── WidgetPreview.jsx        # Live preview component
│   │
│   ├── routes/                       # Page routes
│   │   ├── app._index.jsx           # Admin settings page
│   │   └── widget-preview.jsx       # Preview iframe route
│   │
│   ├── utils/                        # Utility functions
│   │   ├── colorUtils.js            # Color conversion (HSB to Hex)
│   │   ├── previewTemplate.js       # Preview HTML template
│   │   ├── metafield.server.js      # Shopify metafield operations
│   │   └── widgetSettings.server.js # Widget settings database
│   │
│   ├── shopify.server.js            # Shopify authentication
│   └── root.jsx                      # App root component
│
├── widgets/                          # Widget source code
│   ├── src/
│   │   ├── components/
│   │   │   ├── WhatsAppButton.jsx   # Main widget component
│   │   │   └── WhatsAppButton.css   # Widget styles
│   │   ├── config/
│   │   │   └── defaults.js          # Default configuration
│   │   ├── utils/
│   │   │   ├── helpers.js           # Helper functions
│   │   │   └── validation.js        # Config validation
│   │   └── index.js                 # Widget entry point
│   │
│   ├── vite.config.js               # Build configuration
│   └── package.json                 # Widget dependencies
│
├── public/                           # Static files
│   └── widgets/
│       └── recovery-cart-widget.iife.js  # Built widget bundle
│
├── extensions/                       # Shopify theme extension
│   └── recovery-cart-extension/
│       └── blocks/
│           └── app_config.liquid    # Theme integration
│
├── docs/                             # Documentation
│   └── preview/                      # Preview feature docs
│       ├── README.md                 # Documentation index
│       ├── PREVIEW_SIMPLE_GUIDE.md  # User guide
│       └── ...                       # Other docs
│
└── prisma/                           # Database
    └── schema.prisma                 # Database schema
```

## Key Components

### 1. Admin Panel (`app/routes/app._index.jsx`)
**Purpose**: Settings interface for merchants

**What it does**:
- Shows form fields for widget configuration
- Sends real-time updates to preview
- Saves settings to database and Shopify metafields

**Key features**:
- Position selector (left/right)
- Phone number input
- Button text input
- Color picker
- Chat text input
- Live preview integration

### 2. Widget Preview (`app/components/WidgetPreview.jsx`)
**Purpose**: Shows live preview of widget

**What it does**:
- Renders iframe with widget
- Sends config updates via postMessage
- Displays current color in hex

**Props**:
- `config` - Widget configuration object
- `colorHex` - Current color in hex format

### 3. Preview Route (`app/routes/widget-preview.jsx`)
**Purpose**: Serves the preview iframe

**What it does**:
- Reads widget bundle from filesystem
- Injects bundle into HTML template
- Returns complete HTML page

**Flow**:
1. Read `public/widgets/recovery-cart-widget.iife.js`
2. Generate HTML with `generatePreviewHTML()`
3. Return as HTTP response

### 4. Preview Template (`app/utils/previewTemplate.js`)
**Purpose**: Generates preview HTML

**What it does**:
- Creates HTML structure
- Injects widget script
- Sets up postMessage listener
- Handles widget reinitialization

**Features**:
- Beautiful gradient background
- Phone mockup design
- Automatic default values
- Error handling

### 5. Color Utils (`app/utils/colorUtils.js`)
**Purpose**: Color conversion utilities

**Functions**:
- `hsbToHex(hsb)` - Converts HSB to hex color

**Why**: Polaris ColorPicker uses HSB, but we need hex for display

### 6. Widget Component (`widgets/src/components/WhatsAppButton.jsx`)
**Purpose**: The actual WhatsApp widget

**What it does**:
- Reads config from `window.__recovery_cart_config__`
- Renders floating button
- Opens WhatsApp on click
- Validates configuration
- Automatically includes product URL on product pages

**Features**:
- Responsive design
- Icon-only mode for small screens
- Smooth animations
- Position control (left/right)
- **Auto-detects product pages** and includes URL in message

## Data Flow

### Settings Update Flow

```
1. User changes setting in admin
   ↓
2. React state updates (useState)
   ↓
3. useEffect detects change
   ↓
4. WidgetPreview component receives new config
   ↓
5. WidgetPreview sends postMessage to iframe
   ↓
6. Iframe receives message
   ↓
7. Iframe updates window.__recovery_cart_config__
   ↓
8. Iframe removes old widget
   ↓
9. Iframe calls RecoveryCartWidget.init()
   ↓
10. Widget renders with new settings
```

### Save Flow

```
1. User clicks "Save Settings"
   ↓
2. handleSubmit() creates FormData
   ↓
3. submit() calls action function
   ↓
4. action() saves to database (Prisma)
   ↓
5. action() updates Shopify metafield
   ↓
6. Success toast shown to user
```

## Communication Protocol

### postMessage Events

**From Admin to Iframe:**
```javascript
{
  type: 'WIDGET_CONFIG_UPDATE',
  config: {
    position: 'bottom-right',
    phoneNumber: '+1234567890',
    buttonText: 'Chat with us',
    buttonColor: { hue: 142, saturation: 0.77, brightness: 0.75 },
    chatText: 'Hi!'
  }
}
```

**From Iframe to Admin:**
```javascript
{
  type: 'IFRAME_READY'
}
```

## Build Process

### Widget Build

```bash
cd widgets
npm run build
```

**What happens**:
1. Vite reads `src/index.js`
2. Bundles all components and dependencies
3. Outputs to `public/widgets/recovery-cart-widget.iife.js`
4. Creates minified, self-contained bundle

### App Build

```bash
npm run build
```

**What happens**:
1. React Router builds app
2. Compiles routes and components
3. Outputs to `build/` directory
4. Ready for deployment

## Key Concepts

### 1. Modular Components
Each component has a single responsibility:
- `WidgetPreview` - Shows preview
- `colorUtils` - Handles colors
- `previewTemplate` - Generates HTML

### 2. Separation of Concerns
- **UI Layer**: React components
- **Business Logic**: Utils and helpers
- **Data Layer**: Prisma and metafields
- **Widget**: Separate build process

### 3. Real-Time Updates
- No page refresh needed
- Changes appear instantly
- Uses browser postMessage API
- Efficient widget reinitialization

### 4. Error Handling
- Try-catch blocks for file operations
- Fallback error messages
- Console logging for debugging
- User-friendly error toasts

## Adding New Features

### Add a New Setting

1. **Update Database Schema** (`prisma/schema.prisma`)
   ```prisma
   model WidgetSettings {
     // ... existing fields
     newSetting String @default("default")
   }
   ```

2. **Update Default Settings** (`app/utils/widgetSettings.server.js`)
   ```javascript
   export const DEFAULT_SETTINGS = {
     // ... existing
     newSetting: "default"
   };
   ```

3. **Add Form Field** (`app/routes/app._index.jsx`)
   ```jsx
   const [newSetting, setNewSetting] = useState(initialSettings.newSetting);
   
   <TextField
     label="New Setting"
     value={newSetting}
     onChange={setNewSetting}
   />
   ```

4. **Update Config Object**
   ```javascript
   const previewConfig = {
     // ... existing
     newSetting,
   };
   ```

5. **Update Widget** (`widgets/src/components/WhatsAppButton.jsx`)
   ```javascript
   const cfg = config();
   const myNewSetting = cfg.newSetting;
   // Use it in render
   ```

6. **Run Migrations**
   ```bash
   npx prisma migrate dev --name add_new_setting
   ```

## Best Practices

### 1. Component Design
- Keep components small and focused
- Use props for configuration
- Extract reusable logic to utils
- Add JSDoc comments

### 2. State Management
- Use useState for local state
- Use useEffect for side effects
- Keep state close to where it's used
- Avoid prop drilling

### 3. Error Handling
- Always use try-catch for async operations
- Log errors to console
- Show user-friendly messages
- Provide recovery options

### 4. Performance
- Minimize re-renders
- Use useCallback for event handlers
- Debounce rapid updates if needed
- Keep bundle size small

### 5. Code Style
- Use clear, descriptive names
- Add comments for complex logic
- Keep functions short
- Follow existing patterns

## Testing

### Manual Testing
1. Build widget: `cd widgets && npm run build`
2. Start server: `npm run dev`
3. Open admin panel
4. Test each setting
5. Check console for errors

### What to Test
- [ ] Position changes (left/right)
- [ ] Color changes
- [ ] Text changes
- [ ] Phone number changes
- [ ] Save functionality
- [ ] Preview updates
- [ ] Error handling

## Debugging

### Enable Debug Logs
Console logs are already in place:
- `[Admin]` prefix for admin panel logs
- `[Preview]` prefix for iframe logs

### Common Issues
1. **Widget not showing**: Check if bundle exists
2. **Changes not updating**: Check console for postMessage errors
3. **Save failing**: Check database connection
4. **Build errors**: Check widget dependencies

## Resources

- **Preview Docs**: `docs/preview/README.md`
- **Shopify Docs**: https://shopify.dev
- **React Router**: https://reactrouter.com
- **Polaris**: https://polaris.shopify.com

---

**Questions?** Check the documentation in `docs/preview/` or open browser console (F12) for debug logs.
