# Contextual Save Bar Implementation

## What Changed

### ✅ Auto-Create Default Settings
When the app loads for the first time, it now automatically creates:
1. Default settings in MongoDB
2. Default metafield in Shopify

This means `widgetSettings` will **never be null** - it will always have default values!

### ✅ Contextual Save Bar
Replaced the old "Save" button with Shopify's **Contextual Save Bar**:
- Appears automatically when you make changes
- Shows "Save" and "Discard" buttons
- Follows Shopify's modern UX patterns
- Not deprecated (future-proof)

## How It Works

### 1. Loader (Auto-Create Defaults)

```javascript
export const loader = async ({ request }) => {
  const { session, admin } = await authenticate.admin(request);
  
  const defaultSettings = {
    position: "bottom-right",
    phoneNumber: "",
    buttonText: "Chat with us",
    buttonColor: { hue: 142, saturation: 0.77, brightness: 0.75 }
  };
  
  let widgetSettings = await prisma.widgetSettings.findUnique({
    where: { shopDomain: session.shop }
  });
  
  // If no settings exist, create them!
  if (!widgetSettings) {
    widgetSettings = await prisma.widgetSettings.create({
      data: { shopDomain: session.shop, ...defaultSettings }
    });
    
    // Also create metafield
    await admin.graphql(mutation, { variables: { ... } });
  }
  
  return { settings: widgetSettings };
};
```

### 2. Contextual Save Bar Logic

```javascript
// Track if form has changes
const isDirty = 
  position !== initialSettings.position ||
  phoneNumber !== initialSettings.phoneNumber ||
  buttonText !== initialSettings.buttonText ||
  JSON.stringify(buttonColor) !== JSON.stringify(initialSettings.buttonColor);

// Show save bar when dirty
useEffect(() => {
  if (isDirty) {
    shopify.saveBar.show('widget-settings-save-bar');
  } else {
    shopify.saveBar.hide('widget-settings-save-bar');
  }
}, [isDirty, shopify]);

// Subscribe to save bar actions
useEffect(() => {
  const unsubscribe = shopify.saveBar.subscribe('widget-settings-save-bar', {
    onSave: handleSave,
    onDiscard: handleDiscard,
  });
  
  return () => {
    unsubscribe();
    shopify.saveBar.hide('widget-settings-save-bar');
  };
}, [shopify, handleSave, handleDiscard]);
```

## User Experience

### Before
1. Load app → `widgetSettings: null`
2. Configure settings
3. Click "Save" button
4. Settings saved

### After
1. Load app → **Default settings created automatically**
2. `widgetSettings` has default values immediately
3. Change any field → **Save bar appears**
4. Click "Save" or "Discard" in the save bar
5. Settings saved / changes discarded

## Features

### ✅ Save Bar Shows When:
- Position changes
- Phone number changes
- Button text changes
- Button color changes

### ✅ Save Bar Actions:
- **Save**: Submits form and saves to DB + metafield
- **Discard**: Reverts all changes to original values

### ✅ After Save:
- Success toast appears
- Save bar hides automatically
- Page stays on settings (no reload)

## Benefits

### 1. No More Null Values
```javascript
// Before (could be null)
window.__recovery_cart_config__ = {
  widgetSettings: null // ❌
}

// After (always has defaults)
window.__recovery_cart_config__ = {
  widgetSettings: {
    position: "bottom-right",
    phoneNumber: "",
    buttonText: "Chat with us",
    buttonColor: { ... }
  } // ✅
}
```

### 2. Better UX
- Save bar only appears when needed
- Clear indication of unsaved changes
- Easy to discard changes
- Follows Shopify design patterns

### 3. Future-Proof
- Not using deprecated APIs
- Modern App Bridge pattern
- Consistent with Shopify admin

## Testing

### 1. First Load
```
1. Open app for first time
2. Check browser console:
   window.__recovery_cart_config__.widgetSettings
3. Should see default settings (not null!)
```

### 2. Make Changes
```
1. Change position to "bottom-left"
2. Save bar appears at bottom
3. Click "Discard" → reverts to "bottom-right"
4. Change again → save bar appears
5. Click "Save" → toast appears, save bar hides
```

### 3. Verify Persistence
```
1. Make changes and save
2. Reload page
3. Changes should persist
4. Check storefront:
   window.__recovery_cart_config__.widgetSettings
5. Should show updated values
```

## Code Structure

### State Management
```javascript
const [position, setPosition] = useState(initialSettings.position);
const [phoneNumber, setPhoneNumber] = useState(initialSettings.phoneNumber);
const [buttonText, setButtonText] = useState(initialSettings.buttonText);
const [buttonColor, setButtonColor] = useState(initialSettings.buttonColor);
```

### Change Detection
```javascript
const isDirty = 
  position !== initialSettings.position ||
  phoneNumber !== initialSettings.phoneNumber ||
  buttonText !== initialSettings.buttonText ||
  JSON.stringify(buttonColor) !== JSON.stringify(initialSettings.buttonColor);
```

### Save Handler
```javascript
const handleSave = useCallback(() => {
  const formData = new FormData();
  formData.append("position", position);
  formData.append("phoneNumber", phoneNumber);
  formData.append("buttonText", buttonText);
  formData.append("buttonColor", JSON.stringify(buttonColor));
  
  fetcher.submit(formData, { method: "POST" });
}, [position, phoneNumber, buttonText, buttonColor, fetcher]);
```

### Discard Handler
```javascript
const handleDiscard = useCallback(() => {
  setPosition(initialSettings.position);
  setPhoneNumber(initialSettings.phoneNumber);
  setButtonText(initialSettings.buttonText);
  setButtonColor(initialSettings.buttonColor);
}, [initialSettings]);
```

## Troubleshooting

### Save Bar Not Appearing?

**Check:**
1. Are you making changes to the form?
2. Check console for errors
3. Verify `isDirty` is `true` when you make changes

**Debug:**
```javascript
console.log('Is Dirty:', isDirty);
console.log('Current:', { position, phoneNumber, buttonText, buttonColor });
console.log('Original:', initialSettings);
```

### Save Bar Won't Hide?

**Check:**
1. Is save successful? (check toast)
2. Check console for errors
3. Verify `fetcher.data?.success` is `true`

**Fix:**
```javascript
// Manually hide save bar
shopify.saveBar.hide('widget-settings-save-bar');
```

### Changes Not Saving?

**Check:**
1. Network tab - is POST request being sent?
2. Check response - is it successful?
3. Verify metafield is being updated

**Debug:**
```javascript
console.log('Fetcher state:', fetcher.state);
console.log('Fetcher data:', fetcher.data);
```

## Migration Notes

### If You Have Existing Settings

The loader will **not** overwrite existing settings. It only creates defaults if:
- No database record exists
- No metafield exists

### If You Had Null Metafield

After this update:
1. Reload the admin app
2. Default settings will be created
3. Metafield will be populated
4. Storefront will show defaults immediately

## Next Steps

1. **Test the save bar:**
   - Make changes
   - Verify save bar appears
   - Test Save and Discard

2. **Check storefront:**
   - Reload storefront
   - Check `window.__recovery_cart_config__`
   - Should have default values (not null)

3. **Build your widget:**
   - Config is now always available
   - No need to check for null
   - Use `widgetSettings` directly

---

**Now you have a professional, Shopify-standard settings page!** 🎉
