# WhatsApp Widget for Shopify

A customizable WhatsApp floating widget for Shopify stores with admin configuration panel.

## Features

✅ **Admin Configuration Panel**
- Visual settings interface using Shopify Polaris
- Position selector (bottom-left/right)
- Phone number input
- Custom button text
- Color picker with live preview

✅ **Storefront Widget**
- Floating WhatsApp button
- Customizable appearance
- Mobile responsive
- Smooth animations
- Accessible (ARIA labels)

✅ **Metafield Integration**
- Settings stored in Shopify metafields
- No API calls from storefront
- Fast and cached by Shopify
- Easy Liquid access

✅ **Flexible Implementation**
- Theme block (drag & drop)
- Liquid snippet (code)
- Works with any theme

## Quick Start

### 1. Configure Settings
```
Open app in Shopify admin → Configure widget → Save
```

### 2. Deploy Extension
```bash
npm run deploy
```

### 3. Add to Theme
**Option A:** Theme editor → Add block → WhatsApp Widget  
**Option B:** Add `{% render 'whatsapp-widget' %}` to theme

### 4. Done!
Visit your storefront to see the widget.

## Documentation

- **[QUICKSTART_WIDGET.md](./QUICKSTART_WIDGET.md)** - Get started in 5 minutes
- **[WIDGET_USAGE.md](./WIDGET_USAGE.md)** - User guide for merchants
- **[METAFIELD_SETUP.md](./METAFIELD_SETUP.md)** - Technical implementation
- **[IMPLEMENTATION_COMPLETE.md](./IMPLEMENTATION_COMPLETE.md)** - Full summary
- **[ARCHITECTURE_DIAGRAM.md](./ARCHITECTURE_DIAGRAM.md)** - System architecture

## Tech Stack

**Admin:**
- React + React Router 7
- Shopify Polaris Components
- Shopify Admin GraphQL API
- Prisma + MongoDB

**Storefront:**
- Liquid templates
- Vanilla JavaScript
- Shopify Metafields
- Theme App Extension

## File Structure

```
app/routes/
  └── app._index.jsx              # Admin settings page

extensions/recovery-cart-extenstion/
  ├── blocks/
  │   └── whatsapp_widget.liquid  # Block version
  └── snippets/
      └── whatsapp-widget.liquid  # Snippet version

prisma/
  └── schema.prisma               # WidgetSettings model
```

## How It Works

1. **Admin configures** widget in React app
2. **Settings saved** to MongoDB + Shopify metafields
3. **Liquid reads** metafield: `shop.metafields.whatsapp_widget.config`
4. **Widget renders** on storefront with custom settings

## Metafield Details

**Namespace:** `whatsapp_widget`  
**Key:** `config`  
**Type:** `json`

**Structure:**
```json
{
  "position": "bottom-right",
  "phoneNumber": "+1234567890",
  "buttonText": "Chat with us",
  "buttonColor": {
    "hue": 142,
    "saturation": 0.77,
    "brightness": 0.75
  }
}
```

## Usage Examples

### In Liquid
```liquid
{% render 'whatsapp-widget' %}
```

### Access Config
```liquid
{% assign config = shop.metafields.whatsapp_widget.config | parse_json %}
{{ config.phoneNumber }}
```

### As Block
Add via theme editor → App blocks → WhatsApp Widget

## Commands

```bash
# Development
npm run dev

# Deploy extension
npm run deploy

# Setup database
npm run setup

# Generate Prisma client
npx prisma generate
```

## Testing

### Admin Panel
- [ ] Configure all settings
- [ ] Save successfully
- [ ] Settings persist

### Metafield
- [ ] Created in Shopify
- [ ] Accessible via GraphQL
- [ ] Updates when settings change

### Storefront
- [ ] Widget appears
- [ ] Correct position and color
- [ ] Opens WhatsApp
- [ ] Mobile responsive

## Troubleshooting

**Widget not showing?**
1. Check phone number is set
2. Verify snippet/block is added
3. Clear browser cache

**Wrong color?**
1. Re-save settings in admin
2. Check HSB to RGB conversion

**Metafield not created?**
1. Check GraphQL response
2. Verify admin API permissions

## Support

Check documentation:
1. [QUICKSTART_WIDGET.md](./QUICKSTART_WIDGET.md)
2. [WIDGET_USAGE.md](./WIDGET_USAGE.md)
3. [METAFIELD_SETUP.md](./METAFIELD_SETUP.md)

## License

MIT

## Credits

Built with:
- Shopify Polaris
- React Router 7
- Prisma
- MongoDB

---

**Ready to deploy!** 🚀

See [QUICKSTART_WIDGET.md](./QUICKSTART_WIDGET.md) to get started.
