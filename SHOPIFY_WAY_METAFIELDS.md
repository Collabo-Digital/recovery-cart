# The Shopify Way - App-Owned Metafields

## What Was Fixed

### ❌ Before (Wrong Approach)
```javascript
// Manual namespace
namespace: "app_config"

// Incorrect Shop GID
ownerId: `gid://shopify/Shop/${session.shop.split('.')[0]}`

// No TOML definition
```

### ✅ After (Shopify Way)
```toml
# shopify.app.toml
[shop.metafields.app.widget_settings]
type = "json"
name = "Widget Settings"
access.admin = "merchant_read_write"
access.storefront = "public_read"
```

```javascript
// Real Shop GID from GraphQL
const shopIdResponse = await admin.graphql(`
  query GetShopId { shop { id } }
`);
const shopId = shopIdData.data.shop.id;

// App-owned metafield (namespace omitted → defaults to $app)
{
  ownerId: shopId,
  key: "widget_settings",
  type: "json",
  value: metafieldValue,
  // NO namespace → uses $app automatically
}
```

```liquid
<!-- Liquid reads from app.widget_settings (not app_config) -->
{% assign app_config = shop.metafields.app.widget_settings %}
```

## The Three Steps (Correct Implementation)

### 1. Define in TOML (shopify.app.toml)

```toml
# App-owned metafield for widget settings
[shop.metafields.app.widget_settings]
type = "json"
name = "Widget Settings"
description = "Configuration for the recovery cart widget"
access.admin = "merchant_read_write"
access.storefront = "public_read"
```

**What This Does:**
- Creates app-owned metafield definition
- Namespace: `$app` (in GraphQL) / `app` (in Liquid)
- Key: `widget_settings`
- Type: `json`
- Accessible in Admin and Storefront

### 2. Write via Admin GraphQL (app._index.jsx)

```javascript
// Get real Shop GID
const shopIdResponse = await admin.graphql(`
  query GetShopId {
    shop {
      id
    }
  }
`);
const shopIdData = await shopIdResponse.json();
const shopId = shopIdData.data.shop.id; // e.g., "gid://shopify/Shop/1234567890"

// Write metafield
const mutation = `
  mutation StoreWidgetSettings($metafields: [MetafieldsSetInput!]!) {
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
        ownerId: shopId,              // Real Shop GID ✅
        key: "widget_settings",       // From TOML ✅
        type: "json",
        value: metafieldValue,
        // namespace omitted → $app ✅
      },
    ],
  },
});
```

### 3. Read in Liquid (app_config.liquid)

```liquid
{% comment %}
  App-owned metafield: shop.metafields.app.widget_settings
  Defined in shopify.app.toml as [shop.metafields.app.widget_settings]
{% endcomment %}

{% assign app_config = shop.metafields.app.widget_settings %}

<script>
  window.__recovery_cart_config__ = {
    shop: {{ shop.permanent_domain | json }},
    widgetSettings: {{ app_config | default: '{}' | json }},
    isActive: true
  };
</script>
```

## Why This Is Better

### ✅ App-Owned Metafields
- Defined in TOML
- Versioned with your app
- Auto-installed with app
- Uses reserved `$app` namespace
- No namespace conflicts

### ✅ Correct Shop GID
- Query real Shop GID from GraphQL
- Not a string hack
- Works reliably
- Future-proof

### ✅ Liquid Access
- `shop.metafields.app.widget_settings`
- Clean, predictable path
- Public read access for storefront
- Cached by Shopify

## Namespace Mapping

| Location | Namespace | Key |
|----------|-----------|-----|
| TOML | `app` | `widget_settings` |
| GraphQL Write | `$app` (omitted) | `widget_settings` |
| GraphQL Read | `$app` | `widget_settings` |
| Liquid | `app` | `widget_settings` |

**Key Point:** In `metafieldsSet`, **omit** the `namespace` field for app-owned metafields. It defaults to `$app`.

## Complete Implementation

### shopify.app.toml
```toml
[shop.metafields.app.widget_settings]
type = "json"
name = "Widget Settings"
description = "Configuration for the recovery cart widget"
access.admin = "merchant_read_write"
access.storefront = "public_read"
```

### app/_index.jsx (Loader)
```javascript
export const loader = async ({ request }) => {
  const { session, admin } = await authenticate.admin(request);

  // Get Shop GID
  const shopIdResponse = await admin.graphql(`
    query GetShopId { shop { id } }
  `);
  const shopIdData = await shopIdResponse.json();
  const shopId = shopIdData.data.shop.id;

  // Default settings
  const defaultSettings = {
    position: "bottom-right",
    phoneNumber: "",
    buttonText: "Chat with us",
    buttonColor: { hue: 142, saturation: 0.77, brightness: 0.75 }
  };

  // Fetch from database
  let widgetSettings = await prisma.widgetSettings.findUnique({
    where: { shopDomain: session.shop }
  });

  // Create defaults if not exists
  if (!widgetSettings) {
    widgetSettings = await prisma.widgetSettings.create({
      data: { shopDomain: session.shop, ...defaultSettings }
    });

    // Create metafield
    await admin.graphql(mutation, {
      variables: {
        metafields: [{
          ownerId: shopId,
          key: "widget_settings",
          type: "json",
          value: JSON.stringify(defaultSettings)
        }]
      }
    });
  }

  return { settings: widgetSettings };
};
```

### app/_index.jsx (Action)
```javascript
export const action = async ({ request }) => {
  const { session, admin } = await authenticate.admin(request);
  const formData = await request.formData();

  // Get Shop GID
  const shopIdResponse = await admin.graphql(`
    query GetShopId { shop { id } }
  `);
  const shopIdData = await shopIdResponse.json();
  const shopId = shopIdData.data.shop.id;

  const settings = {
    shopDomain: session.shop,
    position: formData.get("position"),
    phoneNumber: formData.get("phoneNumber"),
    buttonText: formData.get("buttonText"),
    buttonColor: JSON.parse(formData.get("buttonColor"))
  };

  // Save to database
  await prisma.widgetSettings.upsert({
    where: { shopDomain: session.shop },
    update: settings,
    create: settings
  });

  // Save to metafield
  await admin.graphql(mutation, {
    variables: {
      metafields: [{
        ownerId: shopId,
        key: "widget_settings",
        type: "json",
        value: JSON.stringify({
          position: settings.position,
          phoneNumber: settings.phoneNumber,
          buttonText: settings.buttonText,
          buttonColor: settings.buttonColor
        })
      }]
    }
  });

  return { success: true };
};
```

### Liquid (blocks/app_config.liquid)
```liquid
{% assign app_config = shop.metafields.app.widget_settings %}

<script>
  window.__recovery_cart_config__ = {
    shop: {{ shop.permanent_domain | json }},
    widgetSettings: {{ app_config | default: '{}' | json }},
    isActive: true
  };
</script>

{% schema %}
{
  "name": "Recovery Cart",
  "target": "head"
}
{% endschema %}
```

## Testing

### 1. Verify TOML Definition
```bash
# After updating shopify.app.toml, redeploy
npm run deploy
```

### 2. Check Metafield Created
**GraphQL:**
```graphql
query {
  shop {
    metafield(namespace: "$app", key: "widget_settings") {
      id
      namespace
      key
      type
      value
    }
  }
}
```

**Or in Shopify Admin:**
Settings > Custom data > Shops > Look for metafield with namespace `$app:widget_settings`

### 3. Check Storefront
```javascript
console.log(window.__recovery_cart_config__);
// Should show:
// {
//   shop: "your-store.myshopify.com",
//   widgetSettings: { position: "bottom-right", ... },
//   isActive: true
// }
```

## Benefits

### ✅ Future-Proof
- Uses Shopify's recommended patterns
- App-owned metafields in TOML
- Reserved `$app` namespace
- No conflicts with other apps

### ✅ Versioned
- Metafield schema in TOML
- Deployed with app
- Version controlled
- Easy to update

### ✅ Secure
- Proper access controls
- Admin: merchant_read_write
- Storefront: public_read
- No hardcoded namespaces

### ✅ Reliable
- Real Shop GID from GraphQL
- Not string manipulation
- Works with all shop formats
- No edge cases

## Common Issues & Fixes

### Issue: Metafield Not Found

**Cause:** TOML not deployed

**Fix:**
```bash
npm run deploy
```

### Issue: Wrong Namespace

**Symptom:** `shop.metafields.app_config.widget_settings` returns null

**Fix:** Use `shop.metafields.app.widget_settings` (correct namespace)

### Issue: Invalid Shop GID

**Symptom:** GraphQL error on `ownerId`

**Fix:** Query real Shop GID:
```javascript
const shopIdResponse = await admin.graphql(`
  query GetShopId { shop { id } }
`);
const shopId = shopIdData.data.shop.id;
```

### Issue: Metafield Not Public

**Symptom:** Can't read in Liquid

**Fix:** Add to TOML:
```toml
access.storefront = "public_read"
```

## Documentation References

- [Metafields for apps](https://shopify.dev/docs/apps/build-your-app/custom-data/metafields)
- [Theme app extensions & Liquid](https://shopify.dev/docs/apps/build-your-app/develop/app-extensions/theme-app-extensions)
- [Admin GraphQL metafieldsSet](https://shopify.dev/docs/api/admin-graphql/latest/mutations/metafieldsSet)

## Summary of Changes

### Files Modified: 4

**1. shopify.app.toml**
- Added `[shop.metafields.app.widget_settings]` definition
- Set type, name, description, access controls

**2. app/routes/app._index.jsx (Loader)**
- Query real Shop GID via GraphQL
- Use `shopId` as `ownerId`
- Omit `namespace` (defaults to `$app`)
- Use `key: "widget_settings"`

**3. app/routes/app._index.jsx (Action)**
- Same changes as loader
- Query Shop GID
- Use correct `ownerId` and `key`

**4. Liquid Files (both block and snippet)**
- Changed `shop.metafields.app_config.widget_settings`
- To `shop.metafields.app.widget_settings`
- Added `| default: '{}'` fallback
- Added comments explaining app-owned metafield

## Next Steps

1. **Restart app** (if running):
   ```bash
   Ctrl+C
   npm run dev
   ```

2. **Deploy extension** (if metafield definition changed):
   ```bash
   npm run deploy
   ```

3. **Test in admin:**
   - Open app
   - Default settings auto-created
   - Make changes
   - Save bar appears
   - Click Save

4. **Check storefront:**
   ```javascript
   console.log(window.__recovery_cart_config__);
   ```

---

**This is now the official Shopify way!** ✅

Your metafields are:
- ✅ App-owned (TOML-defined)
- ✅ Properly namespaced (`$app`)
- ✅ Using real Shop GID
- ✅ Accessible in Liquid
- ✅ Future-proof and maintainable
