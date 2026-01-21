# Metafield Setup - Quick Action Steps

Based on your console output, the metafield is not yet populated. Follow these steps:

---

## Current Status ✅

From your browser console:
```
1. Raw metafield object: null
2. Metafield value (parsed): null
7. Using saved settings? false
⚠️ No metafield found at shop.metafields.app.settings
```

**This is expected!** The metafield hasn't been created yet.

---

## Solution: 2 Simple Options

### Option 1: Use Your App UI (Easiest) ⭐

1. **Open your Shopify admin** and access your Recovery Cart app
2. **Go to the widget settings page** (app._index.jsx route)
3. **Fill in the settings:**
   - Position: Bottom Right or Bottom Left
   - Phone Number: Your WhatsApp number (e.g., `+1234567890`)
   - Button Text: `Chat with us`
   - Button Color: Choose a color
4. **Click "Save Settings"**

This will automatically:
- Save to database ✓
- Create the metafield ✓
- Populate with your settings ✓

Then refresh your storefront and check the console - you should see:
```
7. Using saved settings? true
```

---

### Option 2: Use GraphQL Admin API (Advanced)

If you prefer to test via GraphQL directly:

#### Step 1: Get Your Shop ID

Run this in your app's GraphiQL (Admin API):

```graphql
query GetShopId {
  shop {
    id
    myshopifyDomain
  }
}
```

**Expected response:**
```json
{
  "data": {
    "shop": {
      "id": "gid://shopify/Shop/YOUR_SHOP_ID_HERE",
      "myshopifyDomain": "athul-kumar.myshopify.com"
    }
  }
}
```

Copy the Shop ID (e.g., `gid://shopify/Shop/12345678`)

---

#### Step 2: Write the Metafield

Run this mutation (replace `YOUR_SHOP_ID_HERE` with the ID from Step 1):

```graphql
mutation WriteWidgetSettings {
  metafieldsSet(metafields: [{
    ownerId: "gid://shopify/Shop/YOUR_SHOP_ID_HERE"
    key: "settings"
    value: "{\"position\":\"bottom-right\",\"phoneNumber\":\"+1234567890\",\"buttonText\":\"Chat with us\",\"buttonColor\":{\"hue\":142,\"saturation\":0.77,\"brightness\":0.75}}"
    type: "json"
  }]) {
    metafields {
      id
      namespace
      key
      jsonValue
    }
    userErrors {
      field
      message
    }
  }
}
```

**Expected response:**
```json
{
  "data": {
    "metafieldsSet": {
      "metafields": [
        {
          "id": "gid://shopify/Metafield/123456789",
          "namespace": "app",
          "key": "settings",
          "jsonValue": {
            "position": "bottom-right",
            "phoneNumber": "+1234567890",
            "buttonText": "Chat with us",
            "buttonColor": {
              "hue": 142,
              "saturation": 0.77,
              "brightness": 0.75
            }
          }
        }
      ],
      "userErrors": []
    }
  }
}
```

✅ If you see `userErrors: []`, it worked!

---

#### Step 3: Verify in Browser

1. Go to your storefront
2. Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
3. Open console (F12)
4. Look for the debug output

**You should now see:**
```
1. Raw metafield object: {type: "json", value: "..."}
2. Metafield value (parsed): {position: "bottom-right", phoneNumber: "+1234567890", ...}
7. Using saved settings? true  ← Changed from false!
```

---

## Verification

### ✅ Success Indicators

You'll know it's working when you see:

1. **In Console:**
   ```
   7. Using saved settings? true
   isActive: true
   metafieldExists: true
   usingDefaults: false
   ```

2. **No Warning Message** (the ⚠️ message should disappear)

3. **Your Settings Show:**
   ```
   widgetSettings: {
     position: "bottom-right",
     phoneNumber: "+1234567890",  ← Your actual phone
     buttonText: "Chat with us",
     buttonColor: { ... }
   }
   ```

---

## Why Choose Option 1?

**Recommended:** Use Option 1 (App UI) because it:
- Updates both database and metafield ✓
- Validates your form inputs ✓
- Shows success/error messages ✓
- Tests your complete workflow ✓
- No need to manually format JSON strings ✓

**Option 2** is useful for:
- Direct testing
- Debugging
- Automation/scripts
- When app UI has issues

---

## Quick Troubleshooting

### If Option 1 doesn't work:

Check your terminal/server logs for errors when you click "Save Settings"

Common issues:
- GraphQL API permissions
- Database connection
- Shop ID retrieval

Fix: Check `app/routes/app._index.jsx` action function logs

---

### If Option 2 doesn't work:

Check for `userErrors` in the mutation response:

```json
{
  "userErrors": [
    {
      "field": ["metafields", "0", "value"],
      "message": "Value must be valid JSON"
    }
  ]
}
```

Fix: Ensure the `value` is a properly escaped JSON string

---

## Next Steps After Setup

Once your metafield is populated:

1. ✅ **Test the widget** on your storefront
2. ✅ **Verify in Shopify Admin**: Settings > Custom data > Metafields > Shop
3. ✅ **Try changing settings** in your app and see them update
4. ✅ **Check the widget** displays your phone number and custom text

---

## Additional Resources

- [Complete Guide](./METAFIELD_README.md) - Full documentation
- [Verification Guide](./METAFIELD_VERIFICATION_GUIDE.md) - Detailed testing steps
- [Browser Debug](./BROWSER_DEBUG.md) - Console commands
- [Test Queries](./test-metafield.graphql) - GraphQL examples

---

## Current Shop Info

From your console output:
- **Shop Domain:** `athul-kumar.myshopify.com`
- **Metafield Status:** Not created yet
- **Using Defaults:** Yes (temporary until you save settings)

---

**Ready to go!** Choose Option 1 or Option 2 above and your metafield will be populated. 🚀
