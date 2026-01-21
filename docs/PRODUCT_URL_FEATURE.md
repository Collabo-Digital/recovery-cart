# Product URL Feature

## Overview
The widget now automatically includes the product page URL in WhatsApp messages when clicked from a product page.

## How It Works

### Automatic Detection
The widget automatically detects if it's on a Shopify product page by checking if the URL contains `/products/`.

### Message Format

#### On Product Pages

**With Custom Message:**
```
Your custom message here

Product: https://yourstore.com/products/product-name
```

**Without Custom Message:**
```
I'm interested in this product: https://yourstore.com/products/product-name
```

#### On Other Pages
Only sends the custom message (if provided), without the product URL.

## Examples

### Example 1: Product Page with Custom Message
**Settings:**
- Chat Text: "Hi! I need help with this product"
- Current Page: `https://store.com/products/awesome-shirt`

**WhatsApp Message:**
```
Hi! I need help with this product

Product: https://store.com/products/awesome-shirt
```

### Example 2: Product Page without Custom Message
**Settings:**
- Chat Text: (empty)
- Current Page: `https://store.com/products/awesome-shirt`

**WhatsApp Message:**
```
I'm interested in this product: https://store.com/products/awesome-shirt
```

### Example 3: Homepage with Custom Message
**Settings:**
- Chat Text: "Hi! I have a question"
- Current Page: `https://store.com/`

**WhatsApp Message:**
```
Hi! I have a question
```
(No product URL added)

## Technical Implementation

### File Modified
`widgets/src/utils/helpers.js`

### Key Functions

#### `isProductPage()`
```javascript
const isProductPage = () => {
  const path = window.location.pathname;
  return path.includes('/products/');
};
```

Checks if the current URL path contains `/products/`, which is the standard Shopify product page pattern.

#### `buildWhatsAppUrl()` (Updated)
```javascript
export const buildWhatsAppUrl = (phone, message = '') => {
  let url = `https://wa.me/${phone}`;
  let messageText = '';
  
  // Add custom message
  if (message && message.trim()) {
    messageText = message.trim();
  }
  
  // Add product URL if on product page
  if (isProductPage()) {
    const productUrl = window.location.href;
    if (messageText) {
      messageText += `\n\nProduct: ${productUrl}`;
    } else {
      messageText = `I'm interested in this product: ${productUrl}`;
    }
  }
  
  // Encode and add to URL
  if (messageText) {
    url += `?text=${encodeURIComponent(messageText)}`;
  }
  
  return url;
};
```

## Benefits

### For Customers
- ✅ Don't need to copy/paste product URLs
- ✅ Context is automatically included
- ✅ Faster communication

### For Merchants
- ✅ Know exactly which product customer is asking about
- ✅ Faster response time
- ✅ Better customer service
- ✅ Track which products generate inquiries

### For Support Teams
- ✅ Immediate product context
- ✅ No need to ask "which product?"
- ✅ Can check stock/details immediately
- ✅ More efficient conversations

## URL Detection Patterns

The widget detects product pages by checking for `/products/` in the URL path.

### Supported Patterns
- ✅ `https://store.com/products/product-name`
- ✅ `https://store.com/collections/category/products/product-name`
- ✅ `https://store.myshopify.com/products/product-name`
- ✅ Any URL with `/products/` in the path

### Not Detected (Non-Product Pages)
- ❌ `https://store.com/` (homepage)
- ❌ `https://store.com/collections/category` (collection page)
- ❌ `https://store.com/pages/about` (static page)
- ❌ `https://store.com/cart` (cart page)

## Testing

### Test on Product Page
1. Go to any product page on your store
2. Click the WhatsApp widget
3. Check the WhatsApp message
4. Should include product URL

### Test on Homepage
1. Go to your store homepage
2. Click the WhatsApp widget
3. Check the WhatsApp message
4. Should NOT include any URL

### Test with Different Messages
1. Set custom chat text in admin
2. Test on product page
3. Verify custom text + product URL
4. Clear chat text
5. Test again - should show default message with URL

## Customization

### Change Default Message
Edit `widgets/src/utils/helpers.js`:

```javascript
// Change this line:
messageText = `I'm interested in this product: ${productUrl}`;

// To your preferred message:
messageText = `Can you tell me more about: ${productUrl}`;
```

### Change URL Format
```javascript
// Current format:
messageText += `\n\nProduct: ${productUrl}`;

// Alternative formats:
messageText += `\n\nLink: ${productUrl}`;
messageText += `\n\n${productUrl}`;
messageText += `\n\nCheck it out: ${productUrl}`;
```

### Add Additional Info
```javascript
if (isProductPage()) {
  const productUrl = window.location.href;
  const productTitle = document.querySelector('h1')?.textContent || 'Product';
  
  messageText += `\n\nProduct: ${productTitle}\nLink: ${productUrl}`;
}
```

## Troubleshooting

### Product URL Not Showing

**Check 1: Are you on a product page?**
- URL must contain `/products/`
- Test on actual product page, not collection

**Check 2: Is widget built?**
```bash
cd widgets
npm run build
```

**Check 3: Check console**
- Open browser console (F12)
- Look for errors
- Check if `isProductPage()` returns true

### Wrong URL Being Sent

**Issue**: Sending wrong product URL

**Solution**: The widget uses `window.location.href` which gets the current page URL. Make sure you're testing on the correct page.

### URL Not Encoded Properly

**Issue**: Special characters in URL causing problems

**Solution**: The URL is automatically encoded using `encodeURIComponent()`. If issues persist, check for special characters in the URL.

## Performance Impact

- ✅ **Minimal**: Only adds one URL check
- ✅ **Fast**: `includes()` check is very fast
- ✅ **No API calls**: Everything is client-side
- ✅ **No delays**: Instant execution

## Privacy & Security

- ✅ Only sends the public product URL
- ✅ No customer data included
- ✅ No tracking added
- ✅ Standard WhatsApp URL format

## Future Enhancements

Possible improvements:
1. **Product Title**: Include product name in message
2. **Variant Info**: Add selected variant details
3. **Price**: Include product price
4. **Custom Fields**: Add metafield data
5. **Multi-language**: Translate default message

## Rebuild After Changes

After modifying the code:

```bash
cd widgets
npm run build
cd ..
npm run dev
```

Then test on your store's product pages.

---

**Questions?** Check the browser console for debug logs or test on different page types.
