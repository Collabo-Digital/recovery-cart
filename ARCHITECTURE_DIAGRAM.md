# WhatsApp Widget - Architecture Diagram

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        SHOPIFY ADMIN                             │
│                                                                   │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  React Admin App (app/routes/app._index.jsx)          │    │
│  │                                                         │    │
│  │  ┌──────────────────────────────────────────────┐     │    │
│  │  │  Widget Settings Form                        │     │    │
│  │  │  • Position Dropdown                         │     │    │
│  │  │  • Phone Number TextField                    │     │    │
│  │  │  • Button Text TextField                     │     │    │
│  │  │  • Color Picker (HSB)                        │     │    │
│  │  │  • Live Preview                              │     │    │
│  │  │  • Save Button                               │     │    │
│  │  └──────────────────────────────────────────────┘     │    │
│  │                         │                              │    │
│  │                         │ Save Action                  │    │
│  │                         ▼                              │    │
│  │  ┌──────────────────────────────────────────────┐     │    │
│  │  │  Action Handler                              │     │    │
│  │  │  • Parse form data                           │     │    │
│  │  │  • Save to MongoDB (Prisma)                  │     │    │
│  │  │  • Save to Shopify Metafield (GraphQL)      │     │    │
│  │  └──────────────────────────────────────────────┘     │    │
│  └────────────────────────────────────────────────────────┘    │
│                         │                                       │
│                         │                                       │
└─────────────────────────┼───────────────────────────────────────┘
                          │
                          │
        ┌─────────────────┴──────────────────┐
        │                                     │
        ▼                                     ▼
┌───────────────────┐              ┌──────────────────────┐
│   MongoDB         │              │  Shopify Metafield   │
│   (via Prisma)    │              │  (via GraphQL API)   │
│                   │              │                      │
│  WidgetSettings   │              │  Namespace:          │
│  • shopDomain     │              │    whatsapp_widget   │
│  • position       │              │  Key: config         │
│  • phoneNumber    │              │  Type: json          │
│  • buttonText     │              │  Value: {...}        │
│  • buttonColor    │              │                      │
└───────────────────┘              └──────────────────────┘
        │                                     │
        │ Used by Admin                       │ Used by Storefront
        │                                     │
        │                                     ▼
        │                          ┌──────────────────────────┐
        │                          │  Liquid Access           │
        │                          │                          │
        │                          │  shop.metafields         │
        │                          │    .whatsapp_widget      │
        │                          │    .config               │
        │                          └──────────────────────────┘
        │                                     │
        │                                     │
        │                                     ▼
        │                          ┌──────────────────────────┐
        │                          │  Theme App Extension     │
        │                          │                          │
        │                          │  Two Implementations:    │
        │                          │                          │
        │                          │  1. Block Version        │
        │                          │     blocks/              │
        │                          │     whatsapp_widget      │
        │                          │     .liquid              │
        │                          │                          │
        │                          │  2. Snippet Version      │
        │                          │     snippets/            │
        │                          │     whatsapp-widget      │
        │                          │     .liquid              │
        │                          └──────────────────────────┘
        │                                     │
        │                                     │
        │                                     ▼
        │                          ┌──────────────────────────┐
        │                          │  Storefront Widget       │
        │                          │                          │
        │                          │  • Reads metafield       │
        │                          │  • Parses JSON config    │
        │                          │  • Converts HSB to RGB   │
        │                          │  • Creates button        │
        │                          │  • Adds event listener   │
        │                          │  • Opens WhatsApp        │
        │                          └──────────────────────────┘
        │                                     │
        │                                     │
        └─────────────────────────────────────┘
```

## Data Flow

### Saving Settings

```
User Fills Form
      │
      ▼
Form Submission (POST)
      │
      ├──────────────────┬─────────────────┐
      │                  │                 │
      ▼                  ▼                 ▼
Parse FormData    Validate Data    Create Settings Object
      │                  │                 │
      └──────────────────┴─────────────────┘
                         │
                         ▼
              ┌──────────────────────┐
              │  Parallel Save       │
              │                      │
              │  ┌────────────────┐ │
              │  │ MongoDB        │ │
              │  │ (Prisma)       │ │
              │  │ upsert()       │ │
              │  └────────────────┘ │
              │          │           │
              │          │           │
              │  ┌────────────────┐ │
              │  │ Shopify        │ │
              │  │ Metafield      │ │
              │  │ GraphQL        │ │
              │  │ metafieldsSet  │ │
              │  └────────────────┘ │
              └──────────────────────┘
                         │
                         ▼
                  Return Success
                         │
                         ▼
                  Show Toast
```

### Loading Settings

```
Page Load
    │
    ▼
Loader Function
    │
    ├─────────────────────┐
    │                     │
    ▼                     ▼
Check MongoDB      If Not Found
(Prisma)           Check Metafield
    │                     │
    ├─────────────────────┘
    │
    ▼
Settings Found?
    │
    ├─── Yes ──→ Return Settings
    │
    └─── No ───→ Return Default Settings
                      │
                      ▼
              Render Form with Data
```

### Storefront Rendering

```
Liquid File Loads
        │
        ▼
Access Metafield
shop.metafields.whatsapp_widget.config
        │
        ▼
Parse JSON
        │
        ▼
Extract Config
• position
• phoneNumber
• buttonText
• buttonColor (HSB)
        │
        ▼
JavaScript Executes
        │
        ├─────────────────┬──────────────────┐
        │                 │                  │
        ▼                 ▼                  ▼
Convert HSB to RGB   Create Button    Add Event Listener
        │                 │                  │
        └─────────────────┴──────────────────┘
                          │
                          ▼
                  Append to Body
                          │
                          ▼
                  Widget Visible
                          │
                          ▼
                  User Clicks
                          │
                          ▼
                  Open WhatsApp
```

## Component Structure

### Admin App

```
app/routes/app._index.jsx
│
├── Imports
│   ├── React hooks (useState, useEffect, useCallback)
│   ├── React Router (useFetcher, useLoaderData)
│   ├── Shopify (useAppBridge, authenticate)
│   ├── Polaris Components
│   └── Prisma client
│
├── loader() - Server Side
│   ├── Authenticate admin
│   ├── Fetch from MongoDB
│   ├── Fallback to Metafield
│   └── Return settings or defaults
│
├── action() - Server Side
│   ├── Authenticate admin
│   ├── Parse form data
│   ├── Save to MongoDB (upsert)
│   ├── Save to Metafield (GraphQL)
│   └── Return success
│
└── WidgetSettings Component - Client Side
    ├── State Management
    │   ├── position
    │   ├── phoneNumber
    │   ├── buttonText
    │   └── buttonColor
    │
    ├── Handlers
    │   ├── handleSubmit()
    │   └── hsbToHex()
    │
    ├── Effects
    │   └── Show toast on success
    │
    └── Render
        ├── Page (title, primary action)
        ├── Layout (two columns)
        │   ├── Main Section
        │   │   ├── Settings Card
        │   │   │   ├── Position Select
        │   │   │   ├── Phone TextField
        │   │   │   ├── Text TextField
        │   │   │   └── Color Picker
        │   │   └── Info Banner
        │   │
        │   └── Sidebar Section
        │       ├── Preview Card
        │       │   ├── Widget Preview
        │       │   └── Color Display
        │       └── Guide Card
        │           └── Setup Instructions
        └── Return JSX
```

### Liquid Widget

```
whatsapp_widget.liquid / whatsapp-widget.liquid
│
├── Liquid Logic
│   ├── Assign metafield to variable
│   ├── Check if not blank
│   ├── Parse JSON
│   └── Extract values
│
├── HTML Structure
│   └── Data container div
│       ├── data-position
│       ├── data-phone
│       ├── data-text
│       └── data-color-* (hue, saturation, brightness)
│
├── CSS Styles
│   ├── Button styles
│   ├── Position classes
│   ├── Hover effects
│   └── Responsive media queries
│
└── JavaScript
    ├── Get config from data attributes
    ├── Convert HSB to RGB
    ├── Create button element
    ├── Set styles and attributes
    ├── Add WhatsApp icon SVG
    ├── Add click handler
    │   └── Open WhatsApp URL
    └── Append to body
```

## Technology Stack

```
┌─────────────────────────────────────────────┐
│              Frontend (Admin)                │
│                                              │
│  React + React Router 7                     │
│  Shopify Polaris Components                 │
│  Shopify App Bridge                         │
└─────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────┐
│              Backend (Admin)                 │
│                                              │
│  Node.js                                    │
│  Shopify Admin GraphQL API                  │
│  Prisma ORM                                 │
└─────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────┐
│              Database                        │
│                                              │
│  MongoDB                                    │
│  Collections:                               │
│  • Session                                  │
│  • Shop                                     │
│  • WidgetSettings                           │
└─────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────┐
│         Shopify Metafields                   │
│                                              │
│  Storage: Shop metafields                   │
│  Access: Liquid, GraphQL                    │
└─────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────┐
│         Storefront (Theme)                   │
│                                              │
│  Liquid Templates                           │
│  JavaScript (Vanilla)                       │
│  CSS (Inline)                               │
│  Theme App Extension                        │
└─────────────────────────────────────────────┘
```

## Security & Performance

### Security
- ✅ Admin authentication required
- ✅ Session-based access control
- ✅ GraphQL mutations with proper scopes
- ✅ Input sanitization
- ✅ No sensitive data in metafields

### Performance
- ✅ No API calls from storefront
- ✅ Metafield cached by Shopify
- ✅ Minimal JavaScript (~2KB)
- ✅ Inline CSS (no external requests)
- ✅ Lazy loading (only when needed)

### Scalability
- ✅ Metafield approach scales infinitely
- ✅ No rate limits on metafield reads
- ✅ Database for admin operations only
- ✅ Stateless widget implementation

## File Organization

```
E:\collabo\recovery-cart\
│
├── app/
│   ├── routes/
│   │   ├── app._index.jsx          ← Admin settings page
│   │   ├── app.jsx                 ← Layout with Polaris
│   │   └── app.additional.jsx      ← Help page
│   │
│   ├── shopify.server.js           ← Authentication
│   └── db.server.js                ← Prisma client
│
├── extensions/
│   └── recovery-cart-extenstion/
│       ├── blocks/
│       │   └── whatsapp_widget.liquid    ← Block version
│       │
│       ├── snippets/
│       │   └── whatsapp-widget.liquid    ← Snippet version
│       │
│       └── locales/
│           └── en.default.json           ← Translations
│
├── prisma/
│   └── schema.prisma               ← Database schema
│
└── Documentation/
    ├── METAFIELD_SETUP.md          ← Technical docs
    ├── WIDGET_USAGE.md             ← User guide
    ├── IMPLEMENTATION_COMPLETE.md  ← Summary
    ├── QUICKSTART_WIDGET.md        ← Quick start
    └── ARCHITECTURE_DIAGRAM.md     ← This file
```

---

**This architecture provides:**
- ✅ Clean separation of concerns
- ✅ Scalable data storage
- ✅ Fast storefront performance
- ✅ Easy maintenance
- ✅ Merchant-friendly configuration
