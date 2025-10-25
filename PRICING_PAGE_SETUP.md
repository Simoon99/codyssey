# Pricing Page Setup Guide

The pricing page has been successfully copied to your project! Follow these steps to get it working.

## Files Copied

```
app/(marketing)/pricing/page.tsx    - Main pricing page component
constants/plans.ts                  - Pricing plans and constants
```

## What's Included

### Pricing Page Features:

1. **Individual View**
   - 12 AI Helpers with detailed pricing cards
   - Click to select different helpers
   - Shows benefits, power-ups, and pre-built agents for each helper
   - Price: $39/month per individual helper

2. **Bundle View (Celio X)**
   - All-in-one package for all 12+ helpers
   - Shows what's included with the bundle
   - Features overview
   - Benefits checklist
   - Pricing: $97/month

3. **Modal Pricing**
   - Switch between billing periods
   - Different pricing tiers (monthly, quarterly, yearly)
   - Animated slide-up modal
   - Discount display

4. **Special Features**
   - Countdown timer banner (sticky at top)
   - Summer sale with 60% OFF
   - Floating CTA button at bottom
   - Trust badges and money-back guarantee
   - Smooth animations and transitions

## Installation Steps

### 1. Create the Marketing Folder Structure

If you don't already have it, create:
```bash
mkdir -p app/(marketing)/pricing
```

The pricing page is already in `app/(marketing)/pricing/page.tsx`

### 2. Update the Pricing Constants

The `constants/plans.ts` file contains the pricing data. Customize the HELPERS array with your own helpers:

```typescript
const HELPERS: Helper[] = [
  {
    id: 'marketing',
    name: 'Your Helper Name',
    emoji: '🎯',
    role: 'Your Role',
    description: 'Your description',
    color: 'from-blue-500 to-cyan-500',
    icon: YourIcon,
    price: 39,
    benefits: ['Benefit 1', 'Benefit 2'],
  },
];
```

### 3. Pricing Tiers

Update pricing in BUNDLE_PRICING_TIERS and INDIVIDUAL_PRICING_TIERS arrays:

```typescript
const BUNDLE_PRICING_TIERS: PricingTier[] = [
  {
    id: 'yearly',
    name: 'Pay Yearly',
    originalPrice: 97,
    discountedPrice: 15.60,
    billingPeriod: '/month',
    description: 'Billed annually',
  },
];
```

## Customization Guide

### Change Countdown Timer

Find `CountdownTimer` function and modify initial values:
```typescript
const [timeLeft, setTimeLeft] = useState({
  hours: 2,
  minutes: 6,
  seconds: 19
});
```

### Change Banner Text

```typescript
<span className="font-semibold text-base">Summer Sale: 60% OFF</span>
```

### Change Button Colors

Update CTA button colors from green:
```typescript
className="bg-gradient-to-r from-green-600 to-green-500"
```

### Update Links

Replace all `#` with real links:
```typescript
link: "/checkout"
```

## Icons Used

All icons from `lucide-react`:
- TrendingUp, Briefcase, DollarSign, BarChart, Users, Mail, Code, ShoppingCart, PenTool, MessageSquare, Lightbulb, X, Check, Zap, Globe, Brain, Shield, Clock, Star, Bot

## Component Structure

1. **Sticky Banner** - Countdown timer and sale announcement
2. **Main Content** - View toggle and pricing cards
3. **Floating CTA** - Always visible at bottom
4. **Modal** - Pricing options slide-up

## Performance

- Client-side only (`"use client"`)
- All data is local (no API calls)
- Optimized Framer Motion animations
- Full responsive design

## Testing Checklist

- [ ] Page loads without errors
- [ ] Individual helper view works
- [ ] Bundle view works
- [ ] Helper selection works
- [ ] Modal opens/closes
- [ ] Pricing tier selection works
- [ ] Countdown timer works
- [ ] Mobile responsive
- [ ] All links work
- [ ] No console errors

## Troubleshooting

**Icons not showing?**
- Install: `npm install lucide-react`

**Modal not appearing?**
- Check AnimatePresence from framer-motion is imported
- Verify showPricingModal state logic

**Animations not working?**
- Install: `npm install framer-motion`
- Check tailwind.config.ts has animations configured

**Styling looks off?**
- Clear cache: `rm -rf .next`
- Rebuild: `npm run build`

## Next Steps

1. Customize HELPERS array with your products
2. Update pricing tiers
3. Change banner text and colors
4. Update links to point to your checkout
5. Test on mobile and desktop
6. Connect to payment provider (Stripe, Lemonsqueezy, etc.)

---

**The pricing page is ready to use! Customize the content to match your product.**
