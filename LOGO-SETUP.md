# ImageWord Ministries Logo Setup

## Brand Guidelines Summary

Based on the official brand guidelines:
- **Logo Placement:** Top left or center of page, digital screen, or promotional material
- **Clear Space:** Maintain clear space around logo (equivalent to outermost guidelines)
- **Minimum Size:** 
  - Print: Never smaller than 1 inch (25.4 mm) in width
  - Digital: Never smaller than 72 pixels in width
- **Color Usage:**
  - Full-Color Version: Use on light backgrounds (preferred)
  - Black-and-White Version: For grayscale or when color printing is unavailable
  - Logo on Colored Backgrounds: Use white or light version for contrast
- **Incorrect Usage:** Do not distort, stretch, skew, change colors, add shadows, or rotate

## Current Implementation

The logo is implemented using text-based styling following brand guidelines:
- **IWM** icon in brand red (#A70000) using display font
- **ImageWord Ministries** text in dark gray (#333333)
- Three color schemes: color, white, black

## Logo Component

A flexible `Logo` component at `src/components/Logo.tsx` with variants and color schemes:

### Variants
1. **full** (default) - IWM icon + ImageWord Ministries text (stacked)
2. **icon** - IWM icon only
3. **horizontal** - IWM icon + text side by side

### Color Schemes
1. **color** (default) - Red icon, dark gray text
2. **white** - All white (for dark backgrounds)
3. **black** - All black/dark gray (for light backgrounds)

### Usage Examples
```tsx
import Logo from '@/components/Logo'

// Full logo with color
<Logo variant="full" colorScheme="color" />

// Icon only in white
<Logo variant="icon" colorScheme="white" />

// Horizontal layout
<Logo variant="horizontal" colorScheme="color" />

// With custom className
<Logo variant="full" colorScheme="white" className="scale-110" />
```

## Adding the Actual Logo Image

To replace the text-based logo with the actual logo image:

### Step 1: Add Logo Files
Save your logo files to the `public/assets/` directory:
- `public/assets/logo-full.png` - Full logo (IWM + text)
- `public/assets/logo-icon.png` - Icon only (IWM)
- `public/assets/logo-white.png` - White version for dark backgrounds

### Step 2: Update Logo Component
Replace the content in `src/components/Logo.tsx` with:

```tsx
import Link from 'next/link'
import Image from 'next/image'

interface LogoProps {
  variant?: 'full' | 'icon' | 'text'
  className?: string
}

export default function Logo({ variant = 'full', className = '' }: LogoProps) {
  if (variant === 'icon') {
    return (
      <Link href="/" className={`flex items-center ${className}`}>
        <Image 
          src="/assets/logo-icon.png" 
          alt="ImageWord Ministries" 
          width={50} 
          height={50}
          priority
        />
      </Link>
    )
  }

  if (variant === 'text') {
    return (
      <Link href="/" className={`flex items-center ${className}`}>
        <span className="font-display font-bold text-secondary-800 tracking-tight">
          <span className="text-primary-600">Image</span>Word Ministries
        </span>
      </Link>
    )
  }

  // Full logo with image
  return (
    <Link href="/" className={`flex items-center ${className}`}>
      <Image 
        src="/assets/logo-full.png" 
        alt="ImageWord Ministries" 
        width={200} 
        height={60}
        priority
      />
    </Link>
  )
}
```

### Step 3: Adjust Sizes
Modify the `width` and `height` values based on your actual logo dimensions.

## Current Locations

The Logo component is currently used in:
- **Navbar** (`src/components/Navbar.tsx`) - Full variant
- **Footer** (`src/components/Footer.tsx`) - Text variant

## Brand Colors Reference
- Primary Red: #A70000 (Dark Red)
- Bright Red: #CC0000
- Dark Gray: #333333
- Gray: #808080
