# Complete Setup Guide - Recovery Cart WhatsApp Widget

## 📋 Overview

This Shopify app provides a customizable WhatsApp floating widget for storefronts:
- **Admin Panel:** React app for configuration
- **Storefront Widget:** SolidJS widget injected via Theme App Extension
- **Storage:** MongoDB (admin) + Shopify Metafields (storefront)

## 🚀 Quick Setup (3 Steps)

### Step 1: Install & Run Admin App
```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Start development
npm run dev
```

Open app in Shopify Admin when prompted.

### Step 2: Build & Deploy Widget
```bash
# Go to widgets folder
cd widgets

# Install dependencies (first time only)
npm install

# Build widget bundle
npm run build

# Go back to root
cd ../

# Deploy extension
npm run deploy
```

### Step 3: Configure & Test
1. **Configure in Admin:**
   - Open app in Shopify Admin
   - Set phone number, text, color, position
   - Click "Save"

2. **Add to Theme:**
   - Go to **Online Store > Themes > Customize**
   - Add block: **App Config** (required)
   - Add block: **WhatsApp Widget**
   - Save

3. **Test on Storefront:**
   - Visit your store
   - Widget should appear
   - Click to open WhatsApp

## 📁 Project Structure

```
recovery-cart/
├── app/                              # Admin app (React + Shopify Polaris)
│   ├── routes/
│   │   └── app._index.jsx           # Settings UI
│   └── utils/
│       ├── widgetSettings.server.js # Database utilities
│       └── metafield.server.js      # Metafield utilities
│
├── extensions/recovery-cart-extenstion/
│   ├── assets/
│   │   └── recovery-cart-widget.iife.js  # Built widget (auto-generated)
│   ├── blocks/
│   │   ├── app_config.liquid        # Config loader (block)
│   │   └── whatsapp_widget.liquid   # Widget loader (block)
│   └── snippets/
│       ├── app-config.liquid        # Config loader (snippet)
│       └── whatsapp-widget.liquid   # Widget loader (snippet)
│
├── widgets/                          # SolidJS widget source
│   ├── src/
│   │   ├── index.jsx                # Entry point
│   │   ├── WhatsAppWidget.jsx       # Widget component
│   │   └── WhatsAppWidget.css       # Widget styles
│   ├── package.json
│   └── vite.config.js               # Build config
│
└── prisma/
    └── schema.prisma                # Database schema
```

## 🔄 Development Workflow

### Parallel Development (3 Terminals)

```bash
# Terminal 1: Admin app
npm run dev

# Terminal 2: Widget auto-rebuild
cd widgets
npm run build:watch

# Terminal 3: Shopify CLI (if using tunnel)
shopify app dev
```

### Make Changes Flow

**Admin UI Changes:**
1. Edit `app/routes/app._index.jsx`
2. App hot-reloads automatically

**Widget Changes:**
1. Edit `widgets/src/WhatsAppWidget.jsx` or `.css`
2. Widget rebuilds automatically (if using `build:watch`)
3. Reload storefront to see changes

**Settings Changes:**
1. Change settings in admin
2. Click "Save"
3. Reload storefront
4. Widget updates with new config

## 📊 Data Flow

```
┌─────────────────┐
│  Admin Panel    │  User configures widget
│  (React)        │  └─> Saves to MongoDB + Metafield
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Shopify Metafield              │
│  shop.metafields.app.widget_settings │
│  { position, phone, text, color }   │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Liquid (Theme Extension)       │
│  app-config.liquid              │
│  └─> window.__recovery_cart_config__ = {...} │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  SolidJS Widget                 │
│  recovery-cart-widget.iife.js   │
│  └─> Reads config, renders button │
└─────────────────────────────────┘
```

## 🛠️ Commands Reference

### Root Directory

```bash
# Development
npm run dev                    # Start admin app
npm run deploy                 # Deploy extension

# Database
npx prisma generate           # Generate Prisma client
npx prisma studio             # Open database GUI
npx prisma db push            # Push schema changes

# Shopify CLI
shopify app dev               # Dev with tunnel
shopify app deploy            # Deploy app
```

### Widgets Directory

```bash
cd widgets

# Development
npm run dev                   # Dev server (localhost:3000)
npm run build                 # Build once
npm run build:watch           # Build + watch for changes

# Testing
npm run serve                 # Preview built bundle
```

## 🎨 Customization

### Admin UI
Edit `app/routes/app._index.jsx`:
- Add new settings fields
- Change UI layout
- Add validation

### Widget Appearance
Edit `widgets/src/WhatsAppWidget.css`:
- Button styles
- Animations
- Responsive breakpoints

### Widget Behavior
Edit `widgets/src/WhatsAppWidget.jsx`:
- Add features (e.g., message pre-fill)
- Change animations
- Add analytics

## 📚 Documentation

- **[WIDGET_BUILD_GUIDE.md](./WIDGET_BUILD_GUIDE.md)** - Complete widget architecture
- **[SHOPIFY_SAVE_BAR_IMPLEMENTATION.md](./SHOPIFY_SAVE_BAR_IMPLEMENTATION.md)** - Save bar implementation
- **[APP_CONFIG_GUIDE.md](./APP_CONFIG_GUIDE.md)** - Config system explanation
- **[widgets/BUILD.md](./widgets/BUILD.md)** - Widget build instructions

## ✅ Testing Checklist

### Admin Panel
- [ ] Settings load correctly
- [ ] Can change all fields
- [ ] Save bar appears on changes
- [ ] Save works without login redirect
- [ ] Toast notifications show
- [ ] Settings persist after reload

### Database
- [ ] Settings saved to MongoDB
- [ ] Metafield created/updated in Shopify
- [ ] Can query metafield via GraphQL

### Widget Build
- [ ] `npm run build` succeeds
- [ ] Bundle created in `extensions/*/assets/`
- [ ] Bundle size reasonable (~20KB gzipped)

### Storefront
- [ ] App Config block loads
- [ ] Widget script loads
- [ ] Widget appears at correct position
- [ ] Correct color from settings
- [ ] Correct text from settings
- [ ] Click opens WhatsApp
- [ ] Works on mobile
- [ ] No console errors

## 🐛 Troubleshooting

### Save Bar Not Showing
See: [SHOPIFY_SAVE_BAR_IMPLEMENTATION.md](./SHOPIFY_SAVE_BAR_IMPLEMENTATION.md)

### Widget Not Building
```bash
cd widgets
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Widget Not Appearing
1. Check `window.__recovery_cart_config__` in browser console
2. Check bundle loaded: look for script tag in HTML
3. Check phone number is set in admin
4. Check App Config block is added to theme

### Login Redirect on Save
This should be fixed. If it happens:
1. Check `action` function exists in `app._index.jsx`
2. Check Form has `method="post"` and `data-save-bar`
3. See [SHOPIFY_SAVE_BAR_IMPLEMENTATION.md](./SHOPIFY_SAVE_BAR_IMPLEMENTATION.md)

## 🚀 Deployment

### Production Build

```bash
# 1. Build widget
cd widgets
npm run build

# 2. Deploy extension
cd ../
npm run deploy

# 3. Push to Git
git add .
git commit -m "Update widget"
git push

# 4. App will auto-deploy (if connected to hosting)
```

### What Gets Deployed

- **Admin App:** React app (hosted on your server)
- **Extension:** Liquid files + bundled widget (hosted by Shopify)
- **Database:** MongoDB connection (environment variable)

## 📦 Dependencies

### Admin App
- React + React Router 7
- Shopify Polaris
- Shopify App Bridge
- Prisma + MongoDB

### Widget
- SolidJS (runtime bundled)
- No external dependencies

## 🔐 Environment Variables

Required in `.env`:
```bash
SHOPIFY_API_KEY=your_api_key
SHOPIFY_API_SECRET=your_api_secret
DATABASE_URL=your_mongodb_url
SCOPES=write_products,read_metafields,write_metafields
```

## 📈 Performance

### Admin App
- Server-side rendering
- React Router for routing
- Prisma for database queries

### Widget
- **Bundle Size:** ~20KB gzipped
- **Load Time:** < 100ms
- **FCP:** Instant (uses cached metafield)
- **No API calls:** from storefront

## 🎯 Next Features Ideas

- [ ] Multiple widgets (different pages)
- [ ] Schedule (business hours)
- [ ] Custom messages per page
- [ ] Analytics integration
- [ ] A/B testing
- [ ] Multi-language support

## 📞 Support

Check documentation files for detailed guides on specific topics.

---

**You're all set!** 🎉

Build amazing widgets with SolidJS + Shopify! 🚀
