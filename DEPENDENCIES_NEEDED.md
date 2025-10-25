# Required Dependencies for Landing Page

## Quick Install Command

Run this single command to install all required dependencies:

```bash
npm install @radix-ui/react-slot@^1.1.1 class-variance-authority@^0.7.1 @radix-ui/react-dialog@^1.1.4 tailwindcss-animate@^1.0.7
```

## Dependency Breakdown

### New Dependencies to Install:
1. **@radix-ui/react-slot** (^1.1.1)
   - Used by: Button component
   - Purpose: Allows button to render as child component

2. **class-variance-authority** (^0.7.1)
   - Used by: Button component
   - Purpose: Type-safe CSS variant management

3. **@radix-ui/react-dialog** (^1.1.4)
   - Used by: Sheet component (mobile menu)
   - Purpose: Accessible dialog/modal primitives

4. **tailwindcss-animate** (^1.0.7)
   - Used by: All animated components
   - Purpose: Pre-configured Tailwind animations

### Already Installed (No Action Needed):
- ✅ clsx (2.1.1)
- ✅ framer-motion (12.23.24)
- ✅ lucide-react (0.546.0)
- ✅ next (16.0.0)
- ✅ react (19.2.0)
- ✅ react-dom (19.2.0)
- ✅ tailwind-merge (3.3.1)
- ✅ tailwindcss (4.x)

## Configuration Updates Required

### 1. Tailwind Config (`tailwind.config.ts`)

Add to your tailwind config:

```typescript
export default {
  plugins: [require("tailwindcss-animate")],
  theme: {
    extend: {
      animation: {
        'flip': 'flip 6s infinite steps(2, end)',
        'rotate': 'rotate 3s linear infinite both',
        'image-glow': 'image-glow 4100ms 600ms ease-out forwards',
      },
      keyframes: {
        flip: {
          to: { transform: 'rotate(360deg)' },
        },
        rotate: {
          to: { transform: 'rotate(90deg)' },
        },
        'image-glow': {
          '0%': { opacity: '0' },
          '10%': { opacity: '0.7' },
          '100%': { opacity: '0.4' },
        },
      },
    },
  },
};
```

### 2. Path Aliases (`tsconfig.json`)

Ensure you have:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### 3. CSS (`app/globals.css`)

Add if needed:

```css
@layer utilities {
  .mask-gradient {
    mask-image: linear-gradient(white, transparent 50%);
  }
}
```

## Assets Required

Create/copy these images to `public/images/`:
- dashboard.png
- feature-one.svg through feature-five.svg
- integration.svg

## Summary

**Total new packages to install:** 4

**Configuration files to update:** 2-3

**Assets to create/copy:** 7 images

---

For detailed setup instructions, see `LANDING_PAGE_SETUP.md`.

