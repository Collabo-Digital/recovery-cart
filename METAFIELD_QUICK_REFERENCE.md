# Metafield Quick Reference Card

## 🎯 Quick Facts

| Aspect | Value |
|--------|-------|
| **Type** | App-Owned Metafield |
| **Owner Resource** | Shop |
| **Namespace (TOML)** | `app` |
| **Namespace (GraphQL)** | `$app` |
| **Key** | `settings` |
| **Data Type** | `json` |
| **Purpose** | Store widget configuration (position, phone, button text, colors) |

---

## 📝 Configuration Files

### `shopify.app.toml`
```toml
[shop.metafields.app.settings]
type = "json"
name = "Widget Settings"
description = "Configuration for the recovery cart widget"

  [shop.metafields.app.settings.access]
  admin = "merchant_read_write"
  storefront = "public_read"
```

### `app/utils/metafield.server.js`
```javascript
const METAFIELD_NAMESPACE = "$app";  // GraphQL: $app, TOML: app
const METAFIELD_KEY = "settings";
```

---

## 🔄 Common Operations

### 1. **Update Metafield**
```javascript
import { getShopId, updateWidgetMetafield } from "../utils/metafield.server";

const shopId = await getShopId(admin);
await updateWidgetMetafield(admin, shopId, {
  position: "bottom-right",
  phoneNumber: "+1234567890",
  buttonText: "Chat with us",
  buttonColor: { hue: 142, saturation: 0.77, brightness: 0.75 }
});
```

### 2. **Read Metafield**
```javascript
import { getWidgetMetafield } from "../utils/metafield.server";

const settings = await getWidgetMetafield(admin);
// Returns: { position, phoneNumber, buttonText, buttonColor }
```

### 3. **Delete Metafield**
```javascript
import { getShopId, deleteWidgetMetafield } from "../utils/metafield.server";

const shopId = await getShopId(admin);
await deleteWidgetMetafield(admin, shopId);
```

---

## 🌐 Access Methods

### Admin API (GraphQL)
```graphql
query {
  shop {
    metafield(namespace: "$app", key: "settings") {
      value
    }
  }
}
```

### Storefront API (Liquid)
```liquid
{% assign widget_settings = shop.metafields.app.settings %}
{% assign config = widget_settings | parse_json %}

<div style="background: {{ config.buttonColor }}">
  {{ config.buttonText }}
</div>
```

### Storefront API (GraphQL)
```graphql
query {
  shop {
    metafield(namespace: "app--YOUR_APP_ID", key: "settings") {
      value
    }
  }
}
```

---

## 🚀 Deployment

```bash
# Deploy metafield definition to Shopify
npm run deploy

# Or using Shopify CLI
shopify app deploy
```

---

## ✅ Data Stored

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

---

## 🔐 Permissions

| Location | Access Level |
|----------|-------------|
| **Shopify Admin** | Read & Write (merchants can edit) |
| **Storefront API** | Public Read (themes can access) |
| **Your App** | Full Control (create, read, update, delete) |

---

## 🛠️ Troubleshooting

| Issue | Solution |
|-------|----------|
| Metafield not creating | Run `npm run deploy` to deploy definition |
| Wrong namespace error | Use `$app` in GraphQL, `app` in TOML |
| Not accessible in theme | Check `storefront: "public_read"` in TOML |
| Permission denied | Verify scopes in `shopify.app.toml` |

---

## 📚 Key Differences

### TOML vs GraphQL Syntax
```
TOML:     shop.metafields.app.settings
GraphQL:  shop.metafield(namespace: "$app", key: "settings")
Liquid:   shop.metafields.app.settings
```

### App-Owned vs Merchant-Owned
```
App-Owned:      namespace = "$app"     (you control)
Merchant-Owned: namespace = "custom"   (anyone can edit)
```

---

## 💡 Best Practices

✅ **DO:**
- Use `$app` namespace for app configuration
- Store as JSON for complex data structures
- Keep database and metafield in sync
- Deploy definition before using

❌ **DON'T:**
- Use custom namespaces for app-only data
- Store sensitive credentials (use env vars)
- Forget to handle `userErrors` in responses
- Skip error handling

---

## 📖 Resources

- [Full Guide](./METAFIELDS_GUIDE.md)
- [Shopify Docs](https://shopify.dev/docs/apps/build/metafields)
- [GraphQL API](https://shopify.dev/docs/api/admin-graphql/latest/objects/Metafield)
