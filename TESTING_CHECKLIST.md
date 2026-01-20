# WhatsApp Widget - Testing Checklist

## Pre-Deployment Testing

### ✅ Admin Panel Tests

#### Settings Page Load
- [ ] Page loads without errors
- [ ] All Polaris styles load correctly
- [ ] Form fields are visible and styled

#### Position Dropdown
- [ ] Dropdown opens when clicked
- [ ] Shows "Bottom Right" option
- [ ] Shows "Bottom Left" option
- [ ] Selected value displays correctly

#### Phone Number Field
- [ ] Field accepts input
- [ ] Can enter international format (+1234567890)
- [ ] Can paste phone numbers
- [ ] Field value persists

#### Button Text Field
- [ ] Field accepts input
- [ ] Default value is "Chat with us"
- [ ] Can change text
- [ ] Field value persists

#### Color Picker
- [ ] Color picker opens when clicked
- [ ] Can select different colors
- [ ] HSB values update
- [ ] Color preview updates
- [ ] Picker closes properly

#### Live Preview
- [ ] Preview shows widget button
- [ ] Preview updates when color changes
- [ ] Shows hex color code
- [ ] Preview matches selected settings

#### Save Functionality
- [ ] Save button is visible
- [ ] Button shows "Save" text
- [ ] Button shows loading state when saving
- [ ] Success toast appears after save
- [ ] Toast message is "Settings saved successfully"

#### Data Persistence
- [ ] Reload page after saving
- [ ] Settings are still there
- [ ] All fields show saved values
- [ ] Color picker shows saved color

### ✅ Backend Tests

#### Database (MongoDB)
- [ ] WidgetSettings collection exists
- [ ] Document created for shop
- [ ] All fields saved correctly
- [ ] Updates work (upsert)
- [ ] shopDomain is correct

**Verify with:**
```bash
npx prisma studio
```

#### Metafield Creation
- [ ] Metafield created in Shopify
- [ ] Namespace is "whatsapp_widget"
- [ ] Key is "config"
- [ ] Type is "json"
- [ ] Value contains all settings

**Verify with GraphQL:**
```graphql
query {
  shop {
    metafield(namespace: "whatsapp_widget", key: "config") {
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
Settings > Custom data > Shops > whatsapp_widget.config

#### GraphQL Mutations
- [ ] metafieldsSet mutation succeeds
- [ ] No userErrors in response
- [ ] Metafield ID returned
- [ ] Value is properly JSON stringified

#### GraphQL Queries
- [ ] Can read metafield via GraphQL
- [ ] Value is valid JSON
- [ ] All fields present in JSON

### ✅ Extension Tests

#### Deployment
- [ ] Run `npm run deploy`
- [ ] Deployment succeeds
- [ ] No build errors
- [ ] Extension appears in Shopify admin

#### Block File
- [ ] File exists: `blocks/whatsapp_widget.liquid`
- [ ] No Liquid syntax errors
- [ ] Schema is valid JSON
- [ ] Block name is "WhatsApp Widget"

#### Snippet File
- [ ] File exists: `snippets/whatsapp-widget.liquid`
- [ ] No Liquid syntax errors
- [ ] Can be rendered with `{% render %}`

#### Liquid Logic
- [ ] Metafield access works
- [ ] JSON parsing works
- [ ] Default values work
- [ ] Conditional rendering works (only if phone set)

## Post-Deployment Testing

### ✅ Theme Editor Tests

#### Adding Block
- [ ] Open theme editor
- [ ] Can find "WhatsApp Widget" in blocks
- [ ] Block can be added to page
- [ ] Block appears in editor
- [ ] Can save theme with block

#### Block Settings
- [ ] Block has settings panel
- [ ] Settings show app info
- [ ] Instructions are clear

### ✅ Storefront Tests

#### Widget Appearance
- [ ] Widget appears on storefront
- [ ] Button is visible
- [ ] Button is in correct position (bottom-left/right)
- [ ] Button color matches admin settings
- [ ] WhatsApp icon is visible
- [ ] Button is circular (60px × 60px)

#### Widget Styling
- [ ] Box shadow is visible
- [ ] Border radius is 50% (circular)
- [ ] Z-index is high (appears on top)
- [ ] Fixed positioning works
- [ ] Button doesn't overlap content

#### Widget Interactions
- [ ] Hover effect works (scale 1.1)
- [ ] Box shadow increases on hover
- [ ] Cursor changes to pointer
- [ ] Smooth transitions (0.3s ease)

#### WhatsApp Functionality
- [ ] Click opens WhatsApp
- [ ] Opens in new tab
- [ ] Correct phone number in URL
- [ ] Pre-filled message appears
- [ ] Works on desktop
- [ ] Works on mobile

#### Mobile Responsiveness
- [ ] Widget appears on mobile
- [ ] Button size adjusts (50px × 50px)
- [ ] Icon size adjusts (28px × 28px)
- [ ] Position works correctly
- [ ] Touch events work
- [ ] No layout issues

#### Cross-Browser Testing
- [ ] Works in Chrome
- [ ] Works in Firefox
- [ ] Works in Safari
- [ ] Works in Edge
- [ ] Works in mobile browsers

### ✅ Configuration Update Tests

#### Change Position
- [ ] Change to "bottom-left" in admin
- [ ] Save settings
- [ ] Reload storefront
- [ ] Widget moves to bottom-left
- [ ] Position persists

#### Change Phone Number
- [ ] Change phone in admin
- [ ] Save settings
- [ ] Reload storefront
- [ ] Click widget
- [ ] New phone number in WhatsApp URL

#### Change Button Text
- [ ] Change text in admin
- [ ] Save settings
- [ ] Reload storefront
- [ ] Hover over button
- [ ] Tooltip shows new text
- [ ] ARIA label updated

#### Change Color
- [ ] Pick new color in admin
- [ ] Save settings
- [ ] Reload storefront
- [ ] Button shows new color
- [ ] HSB to RGB conversion correct

### ✅ Edge Cases

#### No Phone Number
- [ ] Remove phone number in admin
- [ ] Save settings
- [ ] Reload storefront
- [ ] Widget doesn't appear (correct behavior)

#### Empty Settings
- [ ] Delete metafield (via GraphQL)
- [ ] Reload storefront
- [ ] Widget doesn't appear (correct behavior)

#### Invalid Phone Format
- [ ] Enter invalid phone (e.g., "abc")
- [ ] Save settings
- [ ] Widget appears but WhatsApp link may not work
- [ ] Consider adding validation

#### Special Characters
- [ ] Enter phone with spaces/dashes
- [ ] Save settings
- [ ] JavaScript cleans phone number
- [ ] WhatsApp link works

#### Long Button Text
- [ ] Enter very long button text (50+ chars)
- [ ] Save settings
- [ ] Check tooltip/ARIA label
- [ ] Text doesn't break layout

### ✅ Performance Tests

#### Load Time
- [ ] Widget loads quickly (<100ms)
- [ ] No visible flash/flicker
- [ ] No layout shift

#### JavaScript Execution
- [ ] Script runs without errors
- [ ] No console errors
- [ ] No console warnings
- [ ] Efficient execution

#### Network Requests
- [ ] No additional API calls
- [ ] Metafield cached by Shopify
- [ ] No external dependencies

#### Multiple Pages
- [ ] Widget appears on all pages
- [ ] No duplicate instances
- [ ] Consistent behavior across pages

### ✅ Accessibility Tests

#### Screen Readers
- [ ] Button has aria-label
- [ ] Label matches button text
- [ ] Screen reader announces button
- [ ] Link purpose is clear

#### Keyboard Navigation
- [ ] Can tab to button
- [ ] Focus indicator visible
- [ ] Enter/Space activates button
- [ ] Focus order is logical

#### Color Contrast
- [ ] Icon visible against background
- [ ] Sufficient contrast ratio
- [ ] Works with different colors

### ✅ Security Tests

#### XSS Prevention
- [ ] Phone number sanitized
- [ ] Button text escaped
- [ ] No script injection possible

#### Data Privacy
- [ ] No sensitive data in metafield
- [ ] Phone number is public (expected)
- [ ] No user tracking

## Regression Testing

After any code changes, re-test:
- [ ] Admin settings save
- [ ] Metafield updates
- [ ] Widget appears on storefront
- [ ] WhatsApp link works
- [ ] Mobile responsive

## Documentation Review

- [ ] All documentation files created
- [ ] Instructions are clear
- [ ] Code examples work
- [ ] Links are correct
- [ ] No typos

## Final Checklist

Before considering complete:
- [ ] All admin tests pass
- [ ] All backend tests pass
- [ ] All extension tests pass
- [ ] All storefront tests pass
- [ ] All edge cases handled
- [ ] Performance is good
- [ ] Accessibility is good
- [ ] Security is good
- [ ] Documentation is complete
- [ ] Ready for production

## Test Data

### Valid Phone Numbers
```
+12345678901     # US
+447700900123    # UK
+919876543210    # India
+61412345678     # Australia
+81312345678     # Japan
```

### Test Colors
```
Green:  hue: 142, saturation: 0.77, brightness: 0.75
Blue:   hue: 210, saturation: 0.80, brightness: 0.70
Red:    hue: 0,   saturation: 0.85, brightness: 0.75
Orange: hue: 30,  saturation: 0.90, brightness: 0.80
```

### Test Button Text
```
"Chat with us"
"Contact Support"
"WhatsApp Us"
"Need Help?"
"Talk to Sales"
```

## Automated Testing (Future)

Consider adding:
- [ ] Unit tests for admin components
- [ ] Integration tests for GraphQL
- [ ] E2E tests for storefront
- [ ] Visual regression tests
- [ ] Performance benchmarks

---

## Notes

- Test in development store first
- Use real WhatsApp number for testing
- Test on actual mobile devices
- Check multiple browsers
- Verify with different themes

**Status**: Ready for testing ✅
