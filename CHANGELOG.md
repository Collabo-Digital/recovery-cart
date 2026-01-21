# Changelog

## [Latest] - 2026-01-21

### ✨ Added
- **Product URL Auto-Detection**: Widget now automatically includes product page URL in WhatsApp messages
  - Detects when on Shopify product pages (`/products/` in URL)
  - Appends product URL to chat message
  - Provides context to merchants about which product customer is asking about
  - See `docs/PRODUCT_URL_FEATURE.md` for details

- **CSS Namespacing**: All widget styles now prefixed with `.recovery-cart` class
  - Prevents CSS conflicts with host website styles
  - Ensures consistent widget appearance across all sites
  - Complete style isolation
  - See `docs/CSS_NAMESPACING.md` for details

### 🔧 Improved
- **Code Organization**: Refactored codebase for better maintainability
  - Created `app/components/WidgetPreview.jsx` component
  - Created `app/utils/colorUtils.js` utility
  - Created `app/utils/previewTemplate.js` template generator
  - Reduced main admin page from 345 to 251 lines
  - Reduced preview route from 195 to 30 lines

### 📚 Documentation
- **Organized Documentation**: Moved all preview docs to `docs/preview/` folder
- **Added Comprehensive Guides**:
  - `CODE_STRUCTURE.md` - Complete codebase guide
  - `REFACTORING_SUMMARY.md` - Refactoring details
  - `QUICK_REFERENCE.md` - Quick reference card
  - `FEATURES.md` - Feature overview
  - `docs/PRODUCT_URL_FEATURE.md` - Product URL feature guide
  - `CHANGELOG.md` - This file

### 🗑️ Removed
- Deleted unused `public/widget-preview.html`
- Removed duplicate HTML code
- Cleaned up debug logs (kept essential ones)

### 📁 File Structure
```
New Files:
- app/components/WidgetPreview.jsx
- app/utils/colorUtils.js
- app/utils/previewTemplate.js
- docs/preview/ (folder with 9 docs)
- docs/PRODUCT_URL_FEATURE.md
- CODE_STRUCTURE.md
- REFACTORING_SUMMARY.md
- QUICK_REFERENCE.md
- FEATURES.md
- CHANGELOG.md

Modified Files:
- app/routes/app._index.jsx (simplified)
- app/routes/widget-preview.jsx (simplified)
- widgets/src/utils/helpers.js (added product URL detection)

Deleted Files:
- public/widget-preview.html
```

## Previous Changes

### Initial Release
- Real-time widget preview in admin panel
- Customizable position (left/right)
- Customizable colors
- Customizable button text
- Customizable chat text
- Phone number configuration
- Database storage (Prisma)
- Shopify metafield integration
- Theme app extension
- Responsive design
- Mobile optimization

---

## Version History

### v1.1.0 (Latest)
- Product URL auto-detection
- Code refactoring
- Documentation organization

### v1.0.0 (Initial)
- Core widget functionality
- Admin panel
- Real-time preview
- Customization options

---

## Upgrade Guide

### From v1.0.0 to v1.1.0

**No breaking changes!** Just rebuild the widget:

```bash
cd widgets
npm run build
cd ..
```

**New Features Available:**
- Product URLs automatically included on product pages
- Better organized codebase
- Comprehensive documentation

**What Stays the Same:**
- All existing functionality
- Database schema
- API endpoints
- User settings

---

## Future Roadmap

### v1.2.0 (Planned)
- Cart recovery features
- Analytics dashboard
- Multi-language support

### v1.3.0 (Planned)
- Custom triggers (exit intent, time delay)
- A/B testing
- Advanced customization

### v2.0.0 (Future)
- Product recommendations
- Order tracking
- Customer segmentation
- Automated responses

---

## Breaking Changes

### v1.1.0
- None

### v1.0.0
- Initial release

---

## Migration Notes

### v1.0.0 → v1.1.0

**Steps:**
1. Pull latest code
2. Run `cd widgets && npm run build`
3. Restart dev server: `npm run dev`
4. Test on product pages

**No database migrations needed**
**No configuration changes needed**

---

## Bug Fixes

### v1.1.0
- Fixed iframe preview loading issues
- Improved postMessage reliability
- Better error handling in preview

### v1.0.0
- Initial stable release

---

## Performance Improvements

### v1.1.0
- Modular code structure (better tree-shaking)
- Reduced code duplication
- Cleaner component hierarchy

### v1.0.0
- Optimized widget bundle size (~16KB)
- Fast preview updates (< 100ms)
- Minimal dependencies

---

## Security Updates

### v1.1.0
- No security changes

### v1.0.0
- Secure postMessage implementation
- Input validation
- Sanitized phone numbers

---

## Deprecations

### v1.1.0
- None

### v1.0.0
- None

---

## Known Issues

### v1.1.0
- None reported

### v1.0.0
- None reported

---

## Contributors

- AKK - Initial development and refactoring

---

## License

Proprietary - All rights reserved

---

**Last Updated**: 2026-01-21
