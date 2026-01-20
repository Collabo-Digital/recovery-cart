# WhatsApp Widget - Quick Usage Guide

## For Merchants

### Step 1: Configure Widget in Admin
1. Open your Shopify admin
2. Go to Apps > Recovery Cart (or your app name)
3. Configure the widget:
   - **Position**: Choose bottom-left or bottom-right
   - **Phone Number**: Enter your WhatsApp number with country code (e.g., `+1234567890`)
   - **Button Text**: Customize the button label (e.g., "Chat with us")
   - **Button Color**: Pick your brand color
4. Click **Save**

### Step 2: Add Widget to Your Store

#### Option A: Using Theme Editor (Easiest)
1. Go to **Online Store > Themes**
2. Click **Customize** on your active theme
3. Navigate to any page
4. Click **Add block** or **Add section**
5. Select **WhatsApp Widget** from the app blocks
6. Save your theme

#### Option B: Using Code (Advanced)
1. Go to **Online Store > Themes**
2. Click **Actions > Edit code**
3. Open `layout/theme.liquid`
4. Add this line before `</body>`:
   ```liquid
   {% render 'whatsapp-widget' %}
   ```
5. Save the file

### Step 3: Test
1. Visit your storefront
2. You should see the WhatsApp button
3. Click it to test the WhatsApp link

## For Developers

### Quick Integration

**In any Liquid file:**
```liquid
{% render 'whatsapp-widget' %}
```

**As a theme block:**
```liquid
{% schema %}
{
  "name": "My Section",
  "blocks": [
    {
      "type": "@app"
    }
  ]
}
{% endschema %}
```

### Accessing Widget Config Directly

```liquid
{% assign widget_config = shop.metafields.whatsapp_widget.config %}
{% if widget_config != blank %}
  {% assign config = widget_config | parse_json %}
  
  <p>Phone: {{ config.phoneNumber }}</p>
  <p>Position: {{ config.position }}</p>
  <p>Text: {{ config.buttonText }}</p>
{% endif %}
```

### Custom Implementation

If you want to build your own widget using the config:

```liquid
{% assign widget_config = shop.metafields.whatsapp_widget.config %}
{% assign config = widget_config | parse_json %}

<a href="https://wa.me/{{ config.phoneNumber | remove: '+' }}" 
   class="my-custom-whatsapp-button"
   target="_blank">
  {{ config.buttonText }}
</a>

<style>
  .my-custom-whatsapp-button {
    /* Your custom styles */
  }
</style>
```

## Features

### What the Widget Does
- ✅ Shows a floating WhatsApp button
- ✅ Positioned based on your settings
- ✅ Uses your brand color
- ✅ Opens WhatsApp with pre-filled message
- ✅ Mobile-friendly and responsive
- ✅ Smooth hover animations

### What You Can Customize
- Position (bottom-left or bottom-right)
- Phone number
- Button text
- Button color
- (More features coming soon!)

## Troubleshooting

### Widget Not Showing?

**Check 1:** Is the phone number set?
- Go to app admin and make sure you entered a phone number

**Check 2:** Is the widget added to your theme?
- Check if you added the block or snippet

**Check 3:** Clear your browser cache
- Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)

### Widget in Wrong Position?

**Solution:** Change position in app admin and save again.

### Wrong Color?

**Solution:** Update color in app admin and save again.

### WhatsApp Not Opening?

**Check:** Make sure phone number includes country code (e.g., `+1` for US)

## Examples

### US Phone Number
```
+12345678901
```

### UK Phone Number
```
+447700900123
```

### India Phone Number
```
+919876543210
```

## Support

Need help?
1. Check this guide
2. Contact app support
3. Check Shopify theme documentation

---

**Tip**: Test the widget on mobile devices too! It's fully responsive.
