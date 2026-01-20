# WhatsApp Widget - Setup Guide

## Overview
This app provides a clean admin interface for configuring a WhatsApp floating widget using **Shopify Polaris React components**.

## Features Implemented

### Admin Settings Page
- ✅ **Position Dropdown**: Select bottom-left or bottom-right placement
- ✅ **Phone Number Field**: Input WhatsApp number with country code
- ✅ **Button Text Field**: Customize the button label
- ✅ **Color Picker**: Choose widget color using Polaris ColorPicker
- ✅ **Live Preview**: See widget appearance in real-time
- ✅ **Save Button**: Primary action to save settings

## Tech Stack
- **UI Framework**: Shopify Polaris React (`@shopify/polaris`)
- **Routing**: React Router v7
- **Database**: MongoDB with Prisma
- **State Management**: React hooks

## Installation

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Database
```bash
npm run setup
```

This will:
- Generate Prisma client
- Apply database migrations
- Add `widgetSettings` field to Shop model

### 3. Start Development
```bash
npm run dev
```

## File Structure

```
app/routes/
├── app._index.jsx          # Widget settings page (main)
├── app.jsx                 # Layout with navigation
└── app.additional.jsx      # Help page

prisma/
└── schema.prisma           # Database schema with widgetSettings
```

## Component Architecture

### Main Component: `app._index.jsx`

```javascript
// Key sections:
1. Loader - Fetches existing settings from database
2. Action - Saves settings to database
3. Component - Renders Polaris UI with form state
```

### Polaris Components Used

| Component | Purpose |
|-----------|---------|
| `Page` | Main page container with title and primary action |
| `Layout` | Two-column responsive layout |
| `Card` | Content containers |
| `FormLayout` | Form field organization |
| `Select` | Position dropdown |
| `TextField` | Phone number and button text inputs |
| `ColorPicker` | Color selection |
| `BlockStack` | Vertical spacing |
| `Text` | Typography |
| `Banner` | Info messages |
| `Box` | Layout primitives |

## Database Schema

```prisma
model Shop {
  // ... existing fields
  widgetSettings Json? // Widget configuration
}
```

### Settings Structure
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

## Usage

### 1. Access Settings
- Navigate to your app in Shopify admin
- You'll see "Widget Settings" page

### 2. Configure Widget
1. Select position from dropdown
2. Enter WhatsApp phone number (with country code)
3. Customize button text
4. Choose button color using color picker
5. Preview updates in real-time
6. Click "Save" button

### 3. Preview
The right sidebar shows:
- Live preview of widget appearance
- Current color in hex format
- Setup guide
- Info banner

## Code Structure

### State Management
```javascript
const [position, setPosition] = useState(initialSettings.position);
const [phoneNumber, setPhoneNumber] = useState(initialSettings.phoneNumber);
const [buttonText, setButtonText] = useState(initialSettings.buttonText);
const [buttonColor, setButtonColor] = useState(initialSettings.buttonColor);
```

### Form Submission
```javascript
const handleSubmit = useCallback(() => {
  const formData = new FormData();
  formData.append("position", position);
  formData.append("phoneNumber", phoneNumber);
  formData.append("buttonText", buttonText);
  formData.append("buttonColor", JSON.stringify(buttonColor));
  
  fetcher.submit(formData, { method: "POST" });
}, [position, phoneNumber, buttonText, buttonColor, fetcher]);
```

### Color Conversion
```javascript
// HSB to Hex conversion for preview
const hsbToHex = (hsb) => {
  // Converts Polaris ColorPicker HSB format to hex
  // Returns: "#25D366" format
};
```

## Best Practices Followed

### 1. **Clean Code Structure**
- Separated concerns (loader, action, component)
- Descriptive variable names
- Proper component organization

### 2. **Polaris Guidelines**
- Used native Polaris components (no custom styles)
- Followed Polaris layout patterns
- Proper spacing with BlockStack
- Responsive layout with Layout.Section

### 3. **React Best Practices**
- `useCallback` for memoized functions
- `useEffect` for side effects
- Controlled components for form inputs
- Proper dependency arrays

### 4. **Accessibility**
- Semantic HTML through Polaris components
- Proper labels on all inputs
- Help text for guidance
- Keyboard navigation support

### 5. **User Experience**
- Loading states during save
- Success toast notification
- Live preview
- Clear help text
- Responsive design

## Testing

### Manual Testing Checklist
- [ ] Settings page loads without errors
- [ ] Position dropdown shows both options
- [ ] Phone number field accepts input
- [ ] Button text field updates preview
- [ ] Color picker opens and changes color
- [ ] Preview updates in real-time
- [ ] Save button shows loading state
- [ ] Success toast appears after save
- [ ] Settings persist after page reload

### Test Data
```javascript
// Test phone numbers
"+12345678901"  // US format
"+919876543210" // India format
"+447700900123" // UK format

// Test button text
"Chat with us"
"Contact Support"
"WhatsApp Us"
```

## Next Steps

### 1. Create Theme Extension
The admin is complete. Next, build the storefront widget:

```bash
npm run generate extension
```

Choose "Theme app extension" and create:
- Widget JavaScript to fetch settings
- Floating button component
- WhatsApp click handler

### 2. Add Validation
```javascript
// Phone number validation
const validatePhone = (phone) => {
  return /^\+[1-9]\d{1,14}$/.test(phone);
};

// Add to TextField
error={!validatePhone(phoneNumber) ? "Invalid phone format" : undefined}
```

### 3. Enhanced Features
- Multiple phone numbers
- Business hours
- Custom welcome message
- Analytics tracking

## Troubleshooting

### Settings Not Saving
- Check database connection
- Verify Prisma schema is up to date
- Check browser console for errors

### Color Picker Not Working
- Ensure `@shopify/polaris` is installed
- Check for CSS conflicts
- Verify Polaris version compatibility

### Preview Not Updating
- Check React state updates
- Verify color conversion function
- Check for console errors

## Resources

- [Shopify Polaris Components](https://polaris.shopify.com/components)
- [React Router Docs](https://reactrouter.com)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Shopify App Bridge](https://shopify.dev/docs/api/app-bridge)

## Support

For issues or questions:
1. Check this documentation
2. Review Polaris component docs
3. Check browser console for errors
4. Verify database connection

---

**Built with**: Shopify Polaris React + React Router 7 + MongoDB + Prisma
