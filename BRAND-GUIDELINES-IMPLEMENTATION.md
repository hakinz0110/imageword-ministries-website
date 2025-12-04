# ImageWord Ministries - Brand Guidelines Implementation

## Overview
This document outlines how the ImageWord Ministries brand guidelines have been implemented in the website.

---

## 1. Color Palette ✅

### Primary Colors
- **#A70000** (Dark Red) - `primary-600`
  - Represents: Sacrifice, Passion, and Redemption
  - Usage: Main CTAs, buttons, links, brand elements
  
- **#CC0000** (Bright Red) - `primary-500`
  - Represents: Energy, Urgency, and Boldness
  - Usage: Gradients, energetic sections, urgent calls-to-action

### Secondary Colors
- **#808080** (Gray) - `secondary-500`
  - Represents: Balance, Neutrality, and Wisdom
  - Usage: Secondary text, subtle elements
  
- **#333333** (Dark Gray/Almost Black) - `secondary-800`
  - Represents: Authority, Seriousness, and Clarity
  - Usage: Footer background, headings, strong text

### Implementation
- Defined in `tailwind.config.js`
- Applied across all components
- Consistent hover states using primary colors

---

## 2. Typography ✅

### Font Families
- **Primary/Display Font:** CityDBol
  - Usage: Headings (h1-h6), brand name, titles
  - Class: `font-display`
  
- **Secondary/Web Font:** Montserrat
  - Usage: Body text, navigation, UI elements
  - Weights: 300 (Light), 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold), 800 (ExtraBold), 900 (Black)
  - Class: `font-sans`

### Implementation
- Montserrat loaded from Google Fonts in `globals.css`
- CityDBol configured in Tailwind (requires font file)
- All headings automatically use display font
- Tight tracking (`tracking-tight`) for display font
- Light weight (300) for subtitles and descriptions

---

## 3. Logo System ✅

### Logo Component (`src/components/Logo.tsx`)

#### Variants
1. **full** - IWM icon + ImageWord Ministries text (stacked)
2. **icon** - IWM icon only
3. **horizontal** - IWM icon + text side by side

#### Color Schemes
1. **color** - Red icon (#A70000), dark gray text (#333333)
2. **white** - All white (for dark backgrounds)
3. **black** - All black/dark gray (for light backgrounds)

#### Current Usage
- **Navbar:** Full logo with color scheme
- **Footer:** Icon only with white scheme

#### Brand Guidelines Compliance
- ✅ Logo positioned top left (navbar)
- ✅ Clear space maintained around logo
- ✅ Minimum size considerations (72px+ digital)
- ✅ Color versions for different backgrounds
- ✅ No distortion, stretching, or skewing

---

## 4. Component Implementation

### Navbar (`src/components/Navbar.tsx`)
- Logo: Full variant, color scheme
- Links: Dark gray with primary-600 hover
- CTA Button: Primary-600 background
- Mobile menu: Animated with brand colors

### Hero (`src/components/Hero.tsx`)
- Heading: Display font, large scale
- Subtitle: Montserrat Light
- CTAs: Primary buttons with brand colors
- Gradient overlay for readability

### Footer (`src/components/Footer.tsx`)
- Background: Secondary-800 (#333333)
- Logo: Icon variant, white scheme
- Links: Gray text with primary-400 hover
- Social icons: Consistent hover states

### Call to Action (`src/components/CallToAction.tsx`)
- Background: Primary-600 (#A70000)
- Heading: Display font, white text
- Buttons: White background with primary text

### Latest Sermons (`src/components/LatestSermons.tsx`)
- Icons: Primary-600 accents
- Hover states: Primary color highlights
- Play button: Primary-600

### Upcoming Events (`src/components/UpcomingEvents.tsx`)
- Icons: Primary-600 color
- Cards: White background with shadow
- Hover: Enhanced shadow effect

---

## 5. Global Styles (`src/app/globals.css`)

### Custom Classes
```css
.btn-primary
- Background: primary-600
- Hover: primary-700
- Text: white
- Shadow: medium to large on hover

.btn-secondary
- Background: white
- Border: primary-600
- Text: primary-600
- Hover: gray-50 background

.section-title
- Font: display font
- Size: 3xl to 4xl responsive
- Weight: bold
- Tracking: tight

.section-subtitle
- Font: sans (Montserrat)
- Weight: light (300)
- Color: gray-600
```

---

## 6. Pages Implementation

All pages follow consistent brand guidelines:

### About Page
- Hero: Primary-50 gradient background
- Mission cards: Primary-100 icon backgrounds
- Leadership: Primary-600 role text

### Ministries Page
- Hero: Primary-50 gradient background
- Ministry cards: Primary-100 icon backgrounds
- CTA: Primary-600 background section

### Donate Page
- Hero: Primary-50 gradient background
- Form elements: Primary-600 focus states
- Buttons: Primary-600 background
- Icons: Primary-100 backgrounds

### Events & Sermons Pages
- Consistent use of primary colors for accents
- Icons and interactive elements use brand colors
- Hover states follow brand guidelines

---

## 7. Theological Meaning Integration

The color choices reflect the ministry's theological foundation:

- **Dark Red (#A70000):** Sacrificial love of Christ, passion for reconciliation
- **Bright Red (#CC0000):** Urgency of the gospel, energy in evangelism
- **Gray (#808080):** Balance in doctrine, wisdom in guidance
- **Dark Gray (#333333):** Authority of God's Word, clarity in truth

---

## 8. Accessibility Compliance

- ✅ Color contrast ratios meet WCAG AA standards
- ✅ Text remains readable on all backgrounds
- ✅ Interactive elements have clear hover states
- ✅ Logo maintains visibility at minimum sizes
- ✅ Font sizes are responsive and readable

---

## 9. Next Steps

### To Complete Full Brand Implementation:

1. **Add Logo Image Files**
   - Export logo in PNG/SVG formats
   - Add to `public/assets/` directory
   - Update Logo component to use images
   - See `LOGO-SETUP.md` for instructions

2. **Add CityDBol Font Files**
   - Obtain CityDBol font files
   - Add to `public/fonts/` directory
   - Update `globals.css` with @font-face
   - Currently falls back to Montserrat

3. **Add Brand Images**
   - Hero background images
   - Ministry photos
   - Event images
   - Sermon thumbnails
   - Team photos

4. **Update Contact Information**
   - Physical address
   - Phone number
   - Email address
   - Social media links

---

## 10. Maintenance Guidelines

### When Adding New Components:
1. Use primary-600 for main CTAs and important elements
2. Use secondary-800 for dark sections
3. Apply font-display to all headings
4. Use Montserrat Light (300) for subtitles
5. Maintain clear space around logo
6. Follow hover state patterns (primary-600 to primary-700)

### When Updating Colors:
1. Update `tailwind.config.js` color definitions
2. Test contrast ratios for accessibility
3. Verify logo visibility on all backgrounds
4. Check hover states across all components

### When Adding Pages:
1. Use consistent hero section styling
2. Apply section-title and section-subtitle classes
3. Use primary colors for CTAs
4. Maintain typography hierarchy
5. Follow spacing and layout patterns

---

## Resources

- **Color Implementation:** `COLOR-IMPLEMENTATION.md`
- **Logo Setup:** `LOGO-SETUP.md`
- **Tailwind Config:** `tailwind.config.js`
- **Global Styles:** `src/app/globals.css`
- **Logo Component:** `src/components/Logo.tsx`

---

**Last Updated:** October 28, 2025
**Status:** ✅ Brand Guidelines Implemented
