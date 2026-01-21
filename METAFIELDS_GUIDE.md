# Metafields Implementation Guide

## Overview

This app uses **app-owned metafields** to store widget configuration data. This guide explains how metafields work in your Recovery Cart app and follows Shopify's official [metafields documentation](https://shopify.dev/docs/apps/build/metafields).

---

## What Are Metafields?

Metafields extend Shopify's built-in data models (products, customers, orders, shop) by allowing you to add custom data. Each metafield has:

- **Identifier**: Combination of namespace and key (e.g., `$app.settings`)
- **Value**: The data being stored (JSON in our case)
- **Type**: Defines the kind of value (we use `json`)

---

## Why App-Owned Metafields?

According to Shopify's documentation, there are different metafield ownership types:

### 1. **App-Owned Metafields** ✅ (What We Use)
- **Namespace**: `$app` (in GraphQL) or `app` (in TOML)
- **Purpose**: App-managed configuration and internal logic
- **Access**: Viewable in Shopify Admin (but controlled by your app)
- **Best for**: App settings, feature flags, internal state

### 2. **Merchant-Owned Metafields**
- **Namespace**: Any custom namespace (e.g., `custom`, `specs`)
- **Purpose**: Data shared across all apps
- **Access**: Editable by merchants and all installed apps
- **Best for**: Product specifications, warranty info, shared data

### 3. **App-Data Metafields**
- **Namespace**: Not required (tied to AppInstallation)
- **Purpose**: Completely hidden per-installation data
- **Access**: Only your app, completely hidden from admin
- **Best for**: Private configuration, feature tiers

---

## Our Implementation

### Configuration in `shopify.app.toml`

```toml
[shop.metafields.app.settings]
type = "json"
name = "Widget Settings"
description = "Configuration for the recovery cart widget"

  [shop.metafields.app.settings.access]
  admin = "merchant_read_write"        # Merchants can view/edit in Admin
  storefront = "public_read"           # Accessible via Storefront API & Liquid
```

**What this creates:**
- A metafield definition on the SHOP resource
- Namespace: `app` (TOML) = `$app` (GraphQL)
- Key: `settings`
- Type: `json`

### Code Implementation

#### File: `app/utils/metafield.server.js`

```javascript
// Namespace constants
const METAFIELD_NAMESPACE = "$app";      // GraphQL syntax
const METAFIELD_KEY = "settings";

// Creating/Updating metafield
export async function updateWidgetMetafield(admin, shopId, settings) {
  const metafieldValue = JSON.stringify({
    position: settings.position,
    phoneNumber: settings.phoneNumber,
    buttonText: settings.buttonText,
    buttonColor: settings.buttonColor,
  });

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

  const response = await admin.graphql(mutation, {
    variables: {
      metafields: [
        {
          ownerId: shopId,
          namespace: METAFIELD_NAMESPACE,  // "$app"
          key: METAFIELD_KEY,               // "settings"
          type: "json",
          value: metafieldValue,
        },
      ],
    },
  });

  const result = await response.json();

  if (result.data?.metafieldsSet?.userErrors?.length > 0) {
    throw new Error(`Metafield update failed: ${errors}`);
  }

  return result;
}

// Reading metafield
export async function getWidgetMetafield(admin) {
  const query = `
    query GetWidgetSettings {
      shop {
        metafield(namespace: "$app", key: "settings") {
          id
          value
        }
      }
    }
  `;

  const response = await admin.graphql(query);
  const data = await response.json();
  
  return JSON.parse(data.data?.shop?.metafield?.value || "{}");
}
```

---

## Data Flow

```
User saves settings in Admin UI
         ↓
app/_index.jsx (action)
         ↓
updateWidgetSettings() → Database
         ↓
updateWidgetMetafield() → Shopify Metafield
         ↓
Settings accessible via:
  - GraphQL Admin API
  - Storefront API
  - Liquid templates
```

---

## Accessing Metafields

### 1. GraphQL Admin API

```graphql
query GetWidgetSettings {
  shop {
    metafield(namespace: "$app", key: "settings") {
      id
      namespace
      key
      value
      type
    }
  }
}
```

### 2. Storefront API (Liquid Templates)

```liquid
{% assign widget_settings = shop.metafields.app.settings %}

{% if widget_settings %}
  {% assign config = widget_settings | parse_json %}
  
  <div class="whatsapp-widget" 
       style="background-color: {{ config.buttonColor }}">
    {{ config.buttonText }}
  </div>
{% endif %}
```

### 3. Storefront API (GraphQL)

```graphql
query GetShopSettings {
  shop {
    metafield(namespace: "app--YOUR_APP_ID", key: "settings") {
      value
    }
  }
}
```

**Note**: In Storefront API, the namespace becomes `app--YOUR_APP_ID` automatically.

---

## Deployment Steps

### 1. Deploy the Metafield Definition

```bash
npm run deploy
# or
shopify app deploy
```

This creates the metafield definition in Shopify based on your `shopify.app.toml`.

### 2. The Definition is Created Automatically

When you deploy, Shopify:
- Creates the metafield definition
- Sets up the schema validation
- Configures access permissions
- Makes it available in the Admin

### 3. First-Time Value Creation

The actual metafield value is created when:
- User saves settings for the first time (via `metafieldsSet` mutation)
- Or programmatically in your loader when default settings are created

---

## Benefits of This Approach

### ✅ **Dual Storage Strategy**
- **Database**: Fast queries, complex filtering, relationships
- **Metafield**: Accessible to themes, other apps, Storefront API

### ✅ **Theme Integration**
Your theme can access settings without API calls:

```liquid
{% assign settings = shop.metafields.app.settings | parse_json %}
```

### ✅ **Admin Visibility**
Merchants can view (and edit, if needed) settings in Shopify Admin under "Settings > Custom data > Metafields"

### ✅ **API Access**
Other apps or custom storefronts can read your configuration via Storefront API

---

## Common Patterns

### Pattern 1: Update Both DB and Metafield

```javascript
// In your action handler
export const action = async ({ request }) => {
  const { session, admin } = await authenticate.admin(request);
  const formData = await request.formData();

  const settingsData = {
    position: formData.get("position"),
    phoneNumber: formData.get("phoneNumber"),
    buttonText: formData.get("buttonText"),
    buttonColor: JSON.parse(formData.get("buttonColor")),
  };

  // 1. Update database (for app queries)
  const updatedSettings = await updateWidgetSettings(
    session.shop,
    settingsData
  );

  // 2. Update metafield (for theme/storefront access)
  const shopId = await getShopId(admin);
  await updateWidgetMetafield(admin, shopId, settingsData);

  return { success: true };
};
```

### Pattern 2: Read from Metafield (Theme Extension)

```javascript
// In theme extension
const settingsMetafield = await admin.graphql(`
  query {
    shop {
      metafield(namespace: "$app", key: "settings") {
        value
      }
    }
  }
`);

const settings = JSON.parse(settingsMetafield.data.shop.metafield.value);
```

---

## Troubleshooting

### Issue: Metafield not updating

**Check:**
1. Did you deploy the metafield definition? (`npm run deploy`)
2. Is the namespace correct? (`$app` in GraphQL, `app` in TOML)
3. Do you have the right scopes in `shopify.app.toml`?
4. Check for `userErrors` in the GraphQL response

### Issue: Metafield not accessible in Liquid

**Check:**
1. Is `storefront: "public_read"` set in `shopify.app.toml`?
2. Did you redeploy after changing access settings?
3. Use correct syntax: `shop.metafields.app.settings`

### Issue: Permission errors

**Check:**
1. Your app needs appropriate scopes (already configured in your app)
2. Merchant must have permissions to edit metafields in Admin

---

## Alternative: App-Data Metafields

If you want settings **completely hidden** from the Shopify Admin:

```javascript
// Use AppInstallation instead of Shop
const response = await admin.graphql(`
  query {
    currentAppInstallation {
      id
    }
  }
`);

const appInstallationId = response.data.currentAppInstallation.id;

// Create app-data metafield (no $app namespace needed)
await admin.graphql(`
  mutation {
    metafieldsSet(metafields: [{
      namespace: "private_config",
      key: "settings",
      type: "json",
      value: "${JSON.stringify(settings)}",
      ownerId: "${appInstallationId}"
    }]) {
      metafields { id }
      userErrors { message }
    }
  }
`);
```

**When to use:**
- Feature tier configurations
- Internal app state
- Data that should never be visible to merchants

---

## Resources

- [Shopify Metafields Documentation](https://shopify.dev/docs/apps/build/metafields)
- [GraphQL Admin API - Metafields](https://shopify.dev/docs/api/admin-graphql/latest/objects/Metafield)
- [App Configuration Guide](https://shopify.dev/docs/apps/build/app-extensions/configuration)

---

## Summary

Your app now correctly uses **app-owned metafields** to store widget configuration:

✅ Defined in `shopify.app.toml` with `app` namespace  
✅ Created/updated via GraphQL with `$app` namespace  
✅ Accessible in Shopify Admin (merchant_read_write)  
✅ Accessible in themes via Liquid  
✅ Accessible via Storefront API  
✅ Synchronized with database for optimal performance  

This implementation follows Shopify best practices and provides maximum flexibility for your app and theme integrations.
