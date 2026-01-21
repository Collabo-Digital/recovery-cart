# Metafield Verification Guide

This guide walks you through the complete process of verifying that your metafield values are being written and read correctly.

---

## 📋 Quick Verification Checklist

- [ ] Metafield defined in `shopify.app.toml`
- [ ] App deployed (`npm run deploy`)
- [ ] Metafield written via Admin API
- [ ] Metafield verified in Admin API
- [ ] Metafield accessible in storefront
- [ ] Console logs show correct values

---

## Step 1: Verify Metafield Definition

### Check `shopify.app.toml`

Your metafield should be defined as:

```toml
[shop.metafields.app.settings]
type = "json"
name = "Widget Settings"
description = "Configuration for the recovery cart widget (position, phone, button text, colors)"

  [shop.metafields.app.settings.access]
  admin = "merchant_read_write"
  storefront = "public_read"
```

**Key points:**
- Owner type: `SHOP`
- Namespace: `app` (in TOML) = `$app` (in GraphQL)
- Key: `settings`
- Type: `json`
- Storefront access: `public_read` (required for Liquid access)

### Deploy the Definition

```bash
npm run deploy
# or
shopify app deploy
```

**Expected output:**
```
✔ Deploying your app...
✔ Metafield definitions updated
✔ Deployment complete
```

---

## Step 2: Write Metafield Values via Admin API

### Get Shop ID First

In your app's GraphiQL explorer or code:

```graphql
query GetShopId {
  shop {
    id
    name
    myshopifyDomain
  }
}
```

**Response:**
```json
{
  "data": {
    "shop": {
      "id": "gid://shopify/Shop/12345678",
      "name": "Your Store",
      "myshopifyDomain": "your-store.myshopify.com"
    }
  }
}
```

Save the `id` value (e.g., `gid://shopify/Shop/12345678`).

### Write the Metafield

```graphql
mutation WriteWidgetSettings($metafields: [MetafieldsSetInput!]!) {
  metafieldsSet(metafields: $metafields) {
    metafields {
      id
      key
      namespace
      type
      value
      jsonValue
      owner {
        ... on Shop {
          id
          name
        }
      }
    }
    userErrors {
      field
      message
      code
    }
  }
}
```

**Variables:**
```json
{
  "metafields": [
    {
      "ownerId": "gid://shopify/Shop/12345678",
      "key": "settings",
      "value": "{\"position\":\"bottom-right\",\"phoneNumber\":\"+1234567890\",\"buttonText\":\"Chat with us\",\"buttonColor\":{\"hue\":142,\"saturation\":0.77,\"brightness\":0.75}}",
      "type": "json"
    }
  ]
}
```

**Important notes:**
- `ownerId` is the Shop GID you got in step 1
- `key` is `settings` (NOT `$app` - namespace is implied for app-owned)
- `value` must be a **JSON string** (use `JSON.stringify()` in code)
- No `namespace` field needed (defaults to `$app` for app-owned)

**Expected successful response:**
```json
{
  "data": {
    "metafieldsSet": {
      "metafields": [
        {
          "id": "gid://shopify/Metafield/123456789",
          "key": "settings",
          "namespace": "app",
          "type": "json",
          "value": "{\"position\":\"bottom-right\",\"phoneNumber\":\"+1234567890\",\"buttonText\":\"Chat with us\",\"buttonColor\":{\"hue\":142,\"saturation\":0.77,\"brightness\":0.75}}",
          "jsonValue": {
            "position": "bottom-right",
            "phoneNumber": "+1234567890",
            "buttonText": "Chat with us",
            "buttonColor": {
              "hue": 142,
              "saturation": 0.77,
              "brightness": 0.75
            }
          },
          "owner": {
            "id": "gid://shopify/Shop/12345678",
            "name": "Your Store"
          }
        }
      ],
      "userErrors": []
    }
  }
}
```

**If you see `userErrors`:**
```json
{
  "userErrors": [
    {
      "field": ["metafields", "0", "namespace"],
      "message": "Namespace is invalid",
      "code": "INVALID"
    }
  ]
}
```

Common fixes:
- Don't include `namespace` field in the mutation variables
- Make sure `value` is a valid JSON string
- Verify `ownerId` is correct Shop GID

---

## Step 3: Verify via Admin API (Read Back)

Before checking the storefront, confirm the metafield is readable via Admin API:

```graphql
query ReadWidgetSettings {
  shop {
    id
    name
    settings: metafield(key: "settings") {
      id
      key
      namespace
      type
      value
      jsonValue
      createdAt
      updatedAt
    }
  }
}
```

**Expected response:**
```json
{
  "data": {
    "shop": {
      "id": "gid://shopify/Shop/12345678",
      "name": "Your Store",
      "settings": {
        "id": "gid://shopify/Metafield/123456789",
        "key": "settings",
        "namespace": "app",
        "type": "json",
        "value": "{\"position\":\"bottom-right\",\"phoneNumber\":\"+1234567890\",\"buttonText\":\"Chat with us\",\"buttonColor\":{\"hue\":142,\"saturation\":0.77,\"brightness\":0.75}}",
        "jsonValue": {
          "position": "bottom-right",
          "phoneNumber": "+1234567890",
          "buttonText": "Chat with us",
          "buttonColor": {
            "hue": 142,
            "saturation": 0.77,
            "brightness": 0.75
          }
        },
        "createdAt": "2024-01-20T10:30:00Z",
        "updatedAt": "2024-01-20T10:30:00Z"
      }
    }
  }
}
```

**If `settings` is `null`:**
- The metafield doesn't exist yet
- Go back to Step 2 and write it
- Check that you deployed the definition in Step 1

---

## Step 4: Verify in Shopify Admin UI

1. Go to Shopify Admin
2. Navigate to: **Settings > Custom data > Metafields**
3. Click on **Shop** (or **Shops** depending on your admin version)
4. Look for **Widget Settings** (the `name` from your TOML)

You should see:
- **Name:** Widget Settings
- **Namespace:** app
- **Key:** settings
- **Type:** JSON
- **Value:** (the JSON object you wrote)

If you don't see it:
- Make sure you deployed (`npm run deploy`)
- Make sure you wrote the metafield (Step 2)
- Wait a few seconds and refresh

---

## Step 5: Verify in Storefront (Browser Console)

### 5.1 Access Your Storefront

1. Open your store's homepage (or any page where the app embed is enabled)
2. Open **DevTools** (F12 or Right-click > Inspect)
3. Go to the **Console** tab

### 5.2 Check Console Logs

You should see a group of logs titled:

```
🔍 Recovery Cart Metafield Debug
```

Expand it to see:

```
1. Raw metafield object: {
     "type": "json",
     "value": "{\"position\":\"bottom-right\",\"phoneNumber\":\"+1234567890\",\"buttonText\":\"Chat with us\",\"buttonColor\":{\"hue\":142,\"saturation\":0.77,\"brightness\":0.75}}"
   }
2. Metafield value (parsed): {
     "position": "bottom-right",
     "phoneNumber": "+1234567890",
     "buttonText": "Chat with us",
     "buttonColor": { "hue": 142, "saturation": 0.77, "brightness": 0.75 }
   }
3. Metafield type: "json"
4. Shop domain: "your-store.myshopify.com"
5. Parsed savedSettings: { ... } (same as #2)
6. Final settings (saved or default): { ... }
7. Using saved settings? true
8. Global config created: {
     "shop": "your-store.myshopify.com",
     "widgetSettings": { ... },
     "isActive": true,
     "debug": { ... }
   }
```

### 5.3 Inspect the Global Config

In the console, type:

```javascript
window.__recovery_cart_config__
```

You should see:

```javascript
{
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
    metafieldValue: { ... },
    usingDefaults: false
  }
}
```

### 5.4 Warning Messages

**If metafield is NOT found**, you'll see:

```
⚠️ No metafield found at shop.metafields.app.settings
Expected namespace: "app" (app-owned)
Expected key: "settings"
Using default settings instead.

To fix:
1. Ensure metafield is defined in shopify.app.toml
2. Deploy: npm run deploy
3. Save settings in your app admin
```

And the console will show:

```
5. Parsed savedSettings: null
6. Final settings (saved or default): { /* default values */ }
7. Using saved settings? false
```

---

## Step 6: Test in Your App Code

### In your app's action handler

```javascript
// app/routes/app._index.jsx (action function)
export const action = async ({ request }) => {
  const { session, admin } = await authenticate.admin(request);
  const formData = await request.formData();

  const settingsData = {
    position: formData.get("position"),
    phoneNumber: formData.get("phoneNumber"),
    buttonText: formData.get("buttonText"),
    buttonColor: JSON.parse(formData.get("buttonColor")),
  };

  // Update database
  const updatedSettings = await updateWidgetSettings(
    session.shop,
    settingsData
  );

  // Update metafield
  try {
    const shopId = await getShopId(admin);
    await updateWidgetMetafield(admin, shopId, settingsData);
    
    // ✅ Success - metafield updated
    console.log("✅ Metafield updated:", settingsData);
  } catch (metafieldError) {
    console.error("❌ Metafield error:", metafieldError);
    
    // Return partial success
    return {
      success: true,
      warning: "Settings saved but metafield update failed",
      settings: updatedSettings,
    };
  }

  return {
    success: true,
    message: "Settings saved successfully",
    settings: updatedSettings,
  };
};
```

---

## 🔍 Troubleshooting

### Problem: Metafield is null in Admin API

**Symptoms:**
```graphql
query {
  shop {
    settings: metafield(key: "settings") {
      value
    }
  }
}
# Returns: { "settings": null }
```

**Solutions:**
1. Deploy the definition: `npm run deploy`
2. Write the metafield using `metafieldsSet` mutation
3. Check for `userErrors` in the write response

### Problem: Metafield is null in Liquid

**Symptoms:**
```liquid
{% assign app_config = shop.metafields.app.settings %}
{# app_config is empty #}
```

**Solutions:**
1. Check `shopify.app.toml` has `storefront = "public_read"`
2. Redeploy: `npm run deploy`
3. Verify metafield exists via Admin API (Step 3)
4. Clear theme cache: Shopify Admin > Themes > Actions > Edit code > Save

### Problem: Console shows "Using default settings"

**Symptoms:**
```
7. Using saved settings? false
```

**Solutions:**
1. Verify metafield exists in Admin API (Step 3)
2. Check namespace is correct (`app`, not `recovery_cart`)
3. Ensure `storefront = "public_read"` in TOML
4. Redeploy and wait 30 seconds

### Problem: Value is wrong/old

**Symptoms:**
- Console shows old values
- Changes in app don't reflect in storefront

**Solutions:**
1. Save settings again in your app
2. Check server logs for metafield update errors
3. Query Admin API to verify current value (Step 3)
4. Hard refresh browser (Ctrl+Shift+R / Cmd+Shift+R)
5. Clear browser cache

### Problem: userErrors when writing

**Common errors:**

```json
{
  "field": ["metafields", "0", "value"],
  "message": "Value must be valid JSON",
  "code": "INVALID"
}
```

**Solution:** Use `JSON.stringify()` to ensure valid JSON string

```json
{
  "field": ["metafields", "0", "ownerId"],
  "message": "Owner ID is invalid",
  "code": "INVALID"
}
```

**Solution:** Use correct Shop GID format: `gid://shopify/Shop/12345678`

---

## 📝 Summary: The Complete Flow

```
1. Define in shopify.app.toml
   [shop.metafields.app.settings]
   type = "json"
   access.storefront = "public_read"

2. Deploy
   npm run deploy

3. Write via Admin API
   mutation { metafieldsSet(...) }

4. Verify via Admin API
   query { shop { metafield(...) } }

5. Access in Liquid
   {% assign config = shop.metafields.app.settings %}
   {{ config.value | json }}

6. Inspect in Browser
   console.log(window.__recovery_cart_config__)
```

---

## 🎯 Quick Test Script

Run this in your app's GraphiQL to test the full cycle:

```graphql
# 1. Get Shop ID
query GetShop {
  shop {
    id
    name
  }
}

# 2. Write metafield (use Shop ID from step 1)
mutation WriteSettings {
  metafieldsSet(metafields: [{
    ownerId: "gid://shopify/Shop/YOUR_SHOP_ID_HERE"
    key: "settings"
    value: "{\"position\":\"bottom-left\",\"phoneNumber\":\"+9999999999\",\"buttonText\":\"TEST VALUE\",\"buttonColor\":{\"hue\":200,\"saturation\":0.8,\"brightness\":0.8}}"
    type: "json"
  }]) {
    metafields {
      id
      jsonValue
    }
    userErrors {
      message
    }
  }
}

# 3. Read it back
query ReadSettings {
  shop {
    settings: metafield(key: "settings") {
      jsonValue
    }
  }
}

# 4. Then check your storefront console for "TEST VALUE"
```

---

## 📚 Related Documentation

- [Metafields Guide](./METAFIELDS_GUIDE.md) - Complete implementation guide
- [Quick Reference](./METAFIELD_QUICK_REFERENCE.md) - Quick lookup card
- [Shopify Metafields Docs](https://shopify.dev/docs/apps/build/metafields)
- [Liquid Metafield Object](https://shopify.dev/docs/api/liquid/objects/metafield)
