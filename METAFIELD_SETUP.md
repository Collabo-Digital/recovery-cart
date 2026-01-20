# WhatsApp Widget - Metafield Setup Guide

## Overview
The widget configuration is now stored in Shopify **shop metafields**, making it accessible from the storefront (Liquid files) without needing API calls.

## How It Works

### 1. Admin Side (React App)
When you save widget settings in the admin:
- Settings are saved to MongoDB (via Prisma)
- Settings are **also** saved to Shopify shop metafields
- Metafield namespace: `whatsapp_widget`
- Metafield key: `config`
- Metafield type: `json`

### 2. Storefront Side (Liquid)
The Liquid files can directly access the metafield:
```liquid
{% assign widget_config = shop.metafields.whatsapp_widget.config %}
{% assign config = widget_config | parse_json %}
```

## Metafield Structure

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

## Usage in Theme

### Option 1: Using the Block (Recommended)

The block file `blocks/whatsapp_widget.liquid` can be added to any theme section:

1. In the Shopify theme editor
2. Add a new block
3. Select "WhatsApp Widget"
4. The widget will automatically appear based on your settings

### Option 2: Using the Snippet

Include the snippet in your theme layout file (e.g., `theme.liquid`):

```liquid
{% render 'whatsapp-widget' %}
```

Add this just before the closing `</body>` tag in your theme's layout file.

## Files Created

### Extension Files
```
extensions/recovery-cart-extenstion/
├── blocks/
│   └── whatsapp_widget.liquid        # Block version
└── snippets/
    └── whatsapp-widget.liquid        # Snippet version
```

### Admin Files Modified
```
app/routes/
└── app._index.jsx                    # Updated to save to metafields
```

## Testing

### 1. Save Settings
1. Open your app admin
2. Configure widget settings
3. Click "Save"
4. Settings are now in metafields

### 2. Verify Metafield
You can verify the metafield was created:

**Using GraphQL Admin API:**
```graphql
query {
  shop {
    metafield(namespace: "whatsapp_widget", key: "config") {
      value
      type
    }
  }
}
```

**Using Shopify Admin:**
1. Go to Settings > Custom data > Shops
2. Look for `whatsapp_widget.config`

### 3. Test on Storefront
1. Add the block or snippet to your theme
2. Visit your storefront
3. The WhatsApp button should appear

## Features

### Widget Behavior
- ✅ Floating button positioned based on settings
- ✅ Custom color from color picker
- ✅ Custom button text
- ✅ Opens WhatsApp with pre-filled message
- ✅ Responsive design (mobile-friendly)
- ✅ Hover animations
- ✅ Only shows if phone number is configured

### Customization
The widget reads all settings from the metafield:
- **Position**: `bottom-left` or `bottom-right`
- **Phone Number**: Full international format (e.g., `+1234567890`)
- **Button Text**: Custom text for accessibility
- **Button Color**: HSB color converted to RGB

## Code Explanation

### Admin Side (app._index.jsx)

**Saving to Metafield:**
```javascript
const mutation = `
  mutation CreateMetafield($metafields: [MetafieldsSetInput!]!) {
    metafieldsSet(metafields: $metafields) {
      metafields {
        id
        namespace
        key
        value
      }
      userErrors {
        field
        message
      }
    }
  }
`;

await admin.graphql(mutation, {
  variables: {
    metafields: [
      {
        namespace: "whatsapp_widget",
        key: "config",
        type: "json",
        value: metafieldValue,
        ownerId: `gid://shopify/Shop/${session.shop.split('.')[0]}`,
      },
    ],
  },
});
```

**Reading from Metafield:**
```javascript
const query = `
  query {
    shop {
      metafield(namespace: "whatsapp_widget", key: "config") {
        value
      }
    }
  }
`;

const response = await admin.graphql(query);
const data = await response.json();
```

### Storefront Side (Liquid)

**Accessing Metafield:**
```liquid
{% assign widget_config = shop.metafields.whatsapp_widget.config %}
{% if widget_config != blank %}
  {% assign config = widget_config | parse_json %}
  
  <!-- Use config.position, config.phoneNumber, etc. -->
{% endif %}
```

**Color Conversion (HSB to RGB):**
```javascript
function hsbToRgb(h, s, v) {
  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;
  // ... conversion logic
  return [r, g, b];
}
```

## Advantages of Metafield Approach

### ✅ Performance
- No API calls from storefront
- Data is cached by Shopify
- Instant access in Liquid

### ✅ Simplicity
- Direct access via `shop.metafields`
- No authentication needed
- Works in any theme file

### ✅ Reliability
- Data persists with shop
- Survives app reinstalls
- Standard Shopify feature

### ✅ Flexibility
- Can be accessed in any Liquid file
- Can be used in sections, blocks, snippets
- Can be customized per theme

## Troubleshooting

### Widget Not Appearing

**Check 1: Metafield Exists**
```graphql
query {
  shop {
    metafield(namespace: "whatsapp_widget", key: "config") {
      value
    }
  }
}
```

**Check 2: Phone Number Set**
The widget won't show if phone number is empty.

**Check 3: Snippet/Block Added**
Make sure you've added the block or included the snippet.

### Widget Not Updating

**Solution:** Save settings again from admin panel. The metafield will be updated.

### Wrong Color

**Check:** HSB to RGB conversion in JavaScript. The color picker uses HSB format, which is converted to RGB for CSS.

## Next Steps

### 1. Deploy Extension
```bash
npm run deploy
```

### 2. Test in Development Store
1. Install app in development store
2. Configure widget settings
3. Add block/snippet to theme
4. Test on storefront

### 3. Add More Features
- Custom welcome message
- Multiple phone numbers
- Business hours
- Analytics tracking
- A/B testing

## Resources

- [Shopify Metafields Documentation](https://shopify.dev/docs/apps/custom-data/metafields)
- [GraphQL Admin API - Metafields](https://shopify.dev/docs/api/admin-graphql/latest/mutations/metafieldsSet)
- [Liquid - Accessing Metafields](https://shopify.dev/docs/api/liquid/objects/metafield)
- [Theme App Extensions](https://shopify.dev/docs/apps/online-store/theme-app-extensions)

## Support

For issues:
1. Check metafield exists in Shopify admin
2. Verify phone number is set
3. Check browser console for JavaScript errors
4. Ensure extension is deployed and enabled

---

**Built with**: Shopify Metafields + GraphQL Admin API + Liquid + Theme App Extensions
