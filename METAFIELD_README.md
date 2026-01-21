# Metafield Implementation - Complete Guide

Your Recovery Cart app uses **app-owned metafields** to store widget configuration data and make it accessible to your theme extension.

---

## 📚 Documentation Overview

| File | Purpose | When to Use |
|------|---------|-------------|
| **[METAFIELDS_GUIDE.md](./METAFIELDS_GUIDE.md)** | Complete implementation guide | Understanding how metafields work |
| **[METAFIELD_QUICK_REFERENCE.md](./METAFIELD_QUICK_REFERENCE.md)** | Quick lookup card | Quick syntax reference |
| **[METAFIELD_VERIFICATION_GUIDE.md](./METAFIELD_VERIFICATION_GUIDE.md)** | Step-by-step testing | Verifying metafield values |
| **[BROWSER_DEBUG.md](./BROWSER_DEBUG.md)** | Console debugging commands | Browser troubleshooting |
| **[test-metafield.graphql](./test-metafield.graphql)** | GraphQL test queries | Testing in GraphiQL |

---

## 🚀 Quick Start (5 Minutes)

### 1. Deploy Metafield Definition

```bash
npm run deploy
```

### 2. Test Write/Read in GraphiQL

```graphql
# Get Shop ID
query { shop { id } }

# Write metafield (replace YOUR_SHOP_ID)
mutation {
  metafieldsSet(metafields: [{
    ownerId: "gid://shopify/Shop/YOUR_SHOP_ID"
    key: "settings"
    value: "{\"position\":\"bottom-right\",\"phoneNumber\":\"+1234567890\",\"buttonText\":\"Chat with us\",\"buttonColor\":{\"hue\":142,\"saturation\":0.77,\"brightness\":0.75}}"
    type: "json"
  }]) {
    metafields { jsonValue }
    userErrors { message }
  }
}

# Verify
query { shop { metafield(key: "settings") { jsonValue } } }
```

### 3. Check Browser Console

1. Open your storefront
2. Press F12 → Console
3. Look for: `🔍 Recovery Cart Metafield Debug`
4. Run: `window.__recovery_cart_config__`

---

## 🎯 Current Implementation

### Configuration (`shopify.app.toml`)

```toml
[shop.metafields.app.settings]
type = "json"
name = "Widget Settings"
description = "Configuration for the recovery cart widget"

  [shop.metafields.app.settings.access]
  admin = "merchant_read_write"
  storefront = "public_read"
```

### Code (`app/utils/metafield.server.js`)

```javascript
const METAFIELD_NAMESPACE = "$app";  // App-owned namespace
const METAFIELD_KEY = "settings";

export async function updateWidgetMetafield(admin, shopId, settings) {
  // Writes to shop.metafields.app.settings
}

export async function getWidgetMetafield(admin) {
  // Reads from shop.metafields.app.settings
}
```

### Theme Extension (`extensions/.../app_config.liquid`)

```liquid
{% assign app_config = shop.metafields.app.settings %}

<script>
  const savedSettings = {{ app_config.value | json }};
  window.__recovery_cart_config__ = {
    shop: {{ shop.permanent_domain | json }},
    widgetSettings: savedSettings || defaultSettings,
    isActive: !!savedSettings
  };
</script>
```

---

## 🔍 Verification Checklist

- [ ] **Definition deployed** (`npm run deploy`)
- [ ] **Metafield written** (via Admin API or app UI)
- [ ] **Admin API read** (returns correct `jsonValue`)
- [ ] **Admin UI visible** (Settings > Custom data > Metafields)
- [ ] **Browser console** (shows saved settings, not defaults)
- [ ] **Widget works** (displays correct settings)

---

## 🛠️ Common Issues & Solutions

### Issue: Metafield is null everywhere

**Symptoms:**
- Admin API returns `null`
- Browser shows "Using defaults"
- Console warning appears

**Solution:**
1. Deploy: `npm run deploy`
2. Write metafield using `metafieldsSet` mutation
3. Verify with read query

### Issue: Metafield exists in Admin API but null in Liquid

**Symptoms:**
- Admin API shows correct value
- Browser shows "Using defaults"
- Console: `metafieldExists: false`

**Solution:**
1. Check `storefront = "public_read"` in TOML
2. Redeploy: `npm run deploy`
3. Wait 30 seconds for cache
4. Hard refresh browser (Ctrl+Shift+R)

### Issue: Old values showing

**Symptoms:**
- Changed settings in app
- Browser shows old values
- Admin API shows new values

**Solution:**
1. Hard refresh: Ctrl+Shift+R / Cmd+Shift+R
2. Clear browser cache
3. Check CDN cache (wait 30-60 seconds)
4. Verify metafield `updatedAt` timestamp

### Issue: userErrors when writing

**Common errors:**

| Error | Solution |
|-------|----------|
| "Value must be valid JSON" | Use `JSON.stringify()` |
| "Owner ID is invalid" | Use correct GID format |
| "Namespace is invalid" | Don't include `namespace` field (auto `$app`) |

---

## 📖 Detailed Guides

### For Implementation Details
→ Read **[METAFIELDS_GUIDE.md](./METAFIELDS_GUIDE.md)**

Topics covered:
- What are metafields?
- Why app-owned metafields?
- Complete code examples
- Data flow diagram
- Access patterns (Admin API, Liquid, Storefront API)

### For Testing & Verification
→ Read **[METAFIELD_VERIFICATION_GUIDE.md](./METAFIELD_VERIFICATION_GUIDE.md)**

Steps covered:
1. Verify definition
2. Write via Admin API
3. Verify via Admin API
4. Verify in Admin UI
5. Verify in storefront
6. Test in app code

### For Quick Syntax Lookup
→ Read **[METAFIELD_QUICK_REFERENCE.md](./METAFIELD_QUICK_REFERENCE.md)**

Quick access to:
- Configuration syntax
- Common operations (CRUD)
- Access methods (GraphQL, Liquid)
- Troubleshooting table
- Best practices

### For Browser Debugging
→ Read **[BROWSER_DEBUG.md](./BROWSER_DEBUG.md)**

Console commands for:
- Inspecting current config
- Testing different values
- Diagnostic reports
- Troubleshooting scenarios

---

## 🎓 Understanding the Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    1. DEFINITION                            │
│  shopify.app.toml → Deploy → Shopify creates definition    │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    2. WRITE VALUE                           │
│  App UI → Action → metafieldsSet → Shopify stores value    │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    3. READ VALUE                            │
│  ├─ Admin API: shop.metafield(key: "settings")            │
│  ├─ Admin UI: Settings > Custom data > Metafields          │
│  └─ Storefront: shop.metafields.app.settings (Liquid)      │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    4. USE IN THEME                          │
│  Liquid → JavaScript → window.__recovery_cart_config__     │
└─────────────────────────────────────────────────────────────┘
```

---

## 💾 Data Structure

### Stored Value (JSON string)

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

### Global Config (JavaScript)

```javascript
window.__recovery_cart_config__ = {
  shop: "your-store.myshopify.com",
  widgetSettings: {
    position: "bottom-right",
    phoneNumber: "+1234567890",
    buttonText: "Chat with us",
    buttonColor: {
      hue: 142,
      saturation: 0.77,
      brightness: 0.75
    }
  },
  isActive: true,
  debug: {
    metafieldExists: true,
    metafieldValue: { /* same as widgetSettings */ },
    usingDefaults: false
  }
}
```

---

## 🔗 Related Resources

### Shopify Documentation
- [Metafields Overview](https://shopify.dev/docs/apps/build/metafields)
- [GraphQL Admin API - Metafields](https://shopify.dev/docs/api/admin-graphql/latest/objects/Metafield)
- [Liquid Metafield Object](https://shopify.dev/docs/api/liquid/objects/metafield)
- [App Configuration](https://shopify.dev/docs/apps/build/app-extensions/configuration)

### Your App Files
- `shopify.app.toml` - Metafield definition
- `app/utils/metafield.server.js` - Read/write functions
- `app/routes/app._index.jsx` - UI and action handler
- `extensions/recovery-cart-extenstion/blocks/app_config.liquid` - Theme integration

---

## 🎯 Next Steps

1. **Deploy your app** to create the metafield definition
2. **Save settings** in your app to write the metafield
3. **Verify in browser** console that values are correct
4. **Test the widget** on your storefront

If you encounter issues, follow the detailed verification guide or use the browser debugging commands.

---

## ✅ Success Indicators

You've successfully implemented metafields when:

✅ Console shows `Using saved settings? true`  
✅ Console shows `metafieldExists: true`  
✅ Console shows correct values in `widgetSettings`  
✅ No warning message about missing metafield  
✅ Widget displays with your configured settings  
✅ Changes in app reflect immediately in storefront (after refresh)  

---

## 🆘 Getting Help

If you're stuck:

1. Check [METAFIELD_VERIFICATION_GUIDE.md](./METAFIELD_VERIFICATION_GUIDE.md) troubleshooting section
2. Run the debug report from [BROWSER_DEBUG.md](./BROWSER_DEBUG.md)
3. Test queries from [test-metafield.graphql](./test-metafield.graphql)
4. Verify against [METAFIELD_QUICK_REFERENCE.md](./METAFIELD_QUICK_REFERENCE.md)

---

**Happy coding! 🚀**
