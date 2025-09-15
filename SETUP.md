# Zid Aura Theme Setup Guide

## Installation

1. **Download or Clone the Theme**
   ```bash
   git clone https://github.com/masindustrys/zid_aura.git
   cd zid_aura
   ```

2. **Upload to Zid Platform**
   - Compress the theme folder into a ZIP file
   - Go to your Zid admin panel
   - Navigate to Themes section
   - Upload the ZIP file
   - Activate the theme

## Initial Configuration

### 1. Theme Settings

Configure the theme through your Zid admin panel:

- **Colors**: Set primary, secondary, and accent colors
- **Typography**: Choose fonts (Inter and Playfair Display are recommended)
- **Layout**: Configure container width, spacing, and layout options
- **Features**: Enable/disable wishlist, compare, quick view, dark mode

### 2. Navigation Setup

Create menu items in your Zid admin:

1. **Main Menu** (handle: `main-menu`)
   - Home
   - Categories (with sub-items for collections)
   - About
   - Contact
   - Sale (special styling applied)

2. **Footer Menu** (handle: `footer`)
   - Privacy Policy
   - Terms of Service
   - Shipping Info
   - Returns Policy
   - FAQ

### 3. Required Pages

Create these pages for optimal functionality:

- **Contact** (handle: `contact`)
- **About** (handle: `about`) 
- **Shipping Policy** (handle: `shipping-policy`)
- **Return Policy** (handle: `return-policy`)
- **Privacy Policy** (handle: `privacy-policy`)
- **Terms of Service** (handle: `terms-of-service`)
- **FAQ** (handle: `faq`)
- **Size Guide** (handle: `size-guide`)

### 4. Collections Setup

Organize your products into collections:

- **Featured** (handle: `featured`) - For homepage showcase
- **Best Sellers** (handle: `bestsellers`) - For popular products
- **Sale** (handle: `sale`) - For discounted items
- **New Arrivals** (handle: `new`) - For latest products

### 5. Product Organization

For optimal theme functionality:

1. **Product Images**: Use high-quality images (minimum 800x800px)
2. **Product Variants**: Set up Color and Size options properly
3. **Product Tags**: Use tags like 'new', 'featured', 'sale' for badges
4. **SEO**: Fill in product descriptions and meta information

## Customization

### Color Scheme

Edit CSS custom properties in `assets/css/theme.css`:

```css
:root {
  --color-primary: #007bff;    /* Main brand color */
  --color-secondary: #6c757d;  /* Supporting color */
  --color-accent: #28a745;     /* Call-to-action color */
  --color-background: #ffffff; /* Main background */
  --color-text: #212529;       /* Primary text color */
}
```

### Typography

The theme uses Google Fonts by default:
- **Primary Font**: Inter (sans-serif)
- **Secondary Font**: Playfair Display (serif)

To change fonts, update the Google Fonts link in `templates/layouts/theme.liquid` and the CSS variables.

### Layout Adjustments

Modify layout settings in CSS:

```css
:root {
  --container-max-width: 1200px;
  --sidebar-width: 300px;
  --header-height: 80px;
}
```

## Language Support

### Arabic (RTL) Setup

The theme includes full RTL support:

1. Set your shop language to Arabic in Zid admin
2. The theme automatically applies RTL styling
3. Arabic translations are included in `locales/ar.json`

### Adding New Languages

1. Create a new language file in `locales/` (e.g., `fr.json`)
2. Copy the structure from `locales/en.json`
3. Translate all text strings
4. Enable the language in your Zid admin

## Performance Optimization

### Image Optimization

1. Use WebP format when possible
2. Implement responsive images
3. Enable lazy loading (built into theme)
4. Optimize file sizes (theme includes image optimization)

### Caching

The theme includes:
- CSS minification
- JavaScript optimization
- Browser caching headers
- CDN-ready assets

## SEO Features

The theme includes comprehensive SEO:

1. **Structured Data**: Automatic JSON-LD markup
2. **Meta Tags**: Open Graph and Twitter Card support
3. **Semantic HTML**: Proper heading hierarchy and landmarks
4. **Site Speed**: Optimized for Core Web Vitals

## Accessibility

The theme is WCAG 2.1 AA compliant:

- Keyboard navigation support
- Screen reader compatibility
- High contrast mode support
- Focus indicators
- ARIA labels and descriptions

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Troubleshooting

### Common Issues

1. **Menu Not Showing**
   - Check if menu handle is `main-menu`
   - Verify menu items are published

2. **Colors Not Applied**
   - Clear browser cache
   - Check CSS custom properties

3. **Images Not Loading**
   - Verify image URLs in admin
   - Check file sizes (max 10MB recommended)

4. **Mobile Layout Issues**
   - Clear mobile cache
   - Test in device's browser (not just responsive mode)

### Getting Help

For support and customization:

1. Check the documentation in this repository
2. Review the code comments for guidance
3. Submit issues on GitHub
4. Contact the theme developer

## Advanced Customization

### Adding Custom Sections

1. Create new files in `sections/`
2. Register in theme settings
3. Add styling in CSS files
4. Include in templates as needed

### Custom JavaScript

Add custom scripts in `assets/js/custom.js`:

```javascript
// Your custom code here
document.addEventListener('theme:ready', function() {
  // Theme is fully loaded
});
```

### Third-party Integrations

The theme supports:
- Google Analytics
- Facebook Pixel
- Custom tracking codes
- Marketing apps
- Review systems

## Updates

To update the theme:

1. Backup your current theme
2. Download the latest version
3. Merge your customizations
4. Test thoroughly before going live
5. Update live site

Always test updates on a staging environment first.

## Contributing

To contribute to the theme:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

Please follow the existing code style and include appropriate documentation.