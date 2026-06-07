# Plus2 Pharmacy — Demo App Plan

A production-feel, mobile-first pharmacy e-commerce demo inspired by Dis-Chem, built for a 30-min investor presentation. Fully client-side, no backend.

## Brand & Design System
- Name: **Plus2 Pharmacy** — tagline "Your Health, Our Priority"
- Colors via `src/styles.css` tokens (oklch):
  - `--primary` Dis-Chem green `#00853F`
  - `--accent` orange `#F26522` (sale badges, CTAs)
  - Neutrals: white, light grey surface, deep grey text
  - Success/warn/info tokens for stock states
- Font: Inter (loaded via `<link>` in `__root.tsx`, registered in `@theme`)
- Logo: SVG green cross/pill + "Plus2 Pharmacy" wordmark (inline component)
- Tailwind v4 tokens, semantic classes only — no hardcoded hex in components

## Routes (TanStack Start, file-based)
```
src/routes/
  __root.tsx          shell, fonts, Navbar, Footer, CartDrawer, Toaster, DemoBadge
  index.tsx           Home
  category.$slug.tsx  Product listing (filters, sort)
  product.$id.tsx     Product detail
  cart.tsx            Cart
  checkout.tsx        Multi-step checkout (state machine)
  account.tsx         Account dashboard (tabbed)
  services.tsx        Pharmacy services + store locator
```
Each route gets unique `head()` metadata (title, description, og:*).

## Global State (Zustand)
`src/store/shop.ts` — single store:
- `products` (seeded ~20 SA products, see list below)
- `cart: {id, qty}[]`, `wishlist: id[]`
- `addToCart`, `removeFromCart`, `updateQty`, `toggleWishlist`, `clearCart`
- `promoCode`, `appliedDiscount`
- Persist to `localStorage`

## Components (`src/components/`)
- `layout/Navbar.tsx` — sticky, logo, search (live filter via URL search param), wishlist, cart-count badge with bump animation; category strip below
- `layout/Footer.tsx` — links, payment icons (Visa/MC/PayFast/PayGate/Mobicred SVGs), app badges, socials
- `layout/MobileBottomNav.tsx` — Home/Categories/Cart/Account (mobile only)
- `layout/DemoBadge.tsx` — floating "Demo Mode" pill bottom-right
- `home/HeroCarousel.tsx` — embla, 3 gradient slides, auto-advance 5s
- `home/CategoryGrid.tsx` — 8 categories w/ emoji + colored bg, horizontal scroll on mobile
- `home/FlashDeals.tsx` — countdown timer + horizontal product row
- `home/BrandsStrip.tsx`, `home/BlogTeasers.tsx`, `home/TopSellers.tsx`
- `product/ProductCard.tsx` — image, SAVE % badge, name, brand, rating, price (strike + discount), Add-to-Cart, wishlist heart
- `product/ProductGallery.tsx` — main + thumbs, swipeable
- `product/QuantityStepper.tsx`, `product/StockBadge.tsx`, `product/RatingStars.tsx`
- `listing/FilterSidebar.tsx` — desktop sidebar / mobile Sheet: brand checkboxes, price slider, rating, in-stock, on-promo
- `listing/SortDropdown.tsx`
- `cart/CartDrawer.tsx` — slide-out Sheet from navbar cart icon
- `checkout/StepIndicator.tsx`, `checkout/DeliveryForm.tsx`, `checkout/PaymentForm.tsx`, `checkout/ReviewStep.tsx`, `checkout/Confirmation.tsx`
- `account/BenefitCard.tsx` — green gradient loyalty card, points + tier

## Data (`src/data/`)
- `products.ts` — 20 hardcoded SA products with realistic fields: id, name, brand, category, price, originalPrice?, savePct?, rating, reviewCount, stock ("in"|"low"|"out"), image (Unsplash URL or colored-bg emoji fallback), shortDesc, longDesc, ingredients, howToUse, isPrescription
- `categories.ts` — 8 categories with emoji + color
- `brands.ts`, `blogPosts.ts` (3), `heroSlides.ts` (3)

Products list matches the 20 in the brief (Panado, Allergex, Bioplus, Vitaforce, Dove, Neutrogena, Huggies, Lennon, USN, Himalaya, Johnson's, Natio, Rennies, Oral-B, Nurofen, Herbalife, Pampers, Bio-Oil, Caltrate, Dettol).

## Interactions
- Add-to-Cart → sonner toast "✅ Added to cart" + animated badge bump
- Wishlist toggle → toast + filled heart
- Search in navbar → navigates to `/category/all?q=...`, live-filters
- Filters/sort fully functional via URL search params + Zustand
- Checkout: react-hook-form per step with basic Zod validation; "Place Order" clears cart, generates order #, navigates to Confirmation
- Promo code: hardcoded `PLUS10` → 10% off
- Free delivery auto-applies over R500

## Responsive Strategy
- Mobile-first; verified at 375px and 1280px+
- Product grid: 2 / 3 / 4 cols
- Filter sidebar → bottom Sheet on mobile
- Cart: full page on mobile, drawer from navbar on desktop
- Mobile bottom nav fixed; hidden md+

## Out of Scope
No backend, no real payment, no auth, no real map (placeholder image with city dropdown), no Lovable Cloud.

---

## Technical Notes
- Stack: TanStack Start v1 + React 19 + Tailwind v4 + shadcn (existing) + Zustand + sonner + embla + react-hook-form + zod + lucide-react + framer-motion (for badge bump / hover scale)
- Install: `bun add zustand framer-motion react-hook-form zod`
- Images: Unsplash hotlinks per product; fallback to colored div + emoji if needed
- All colors via CSS tokens in `src/styles.css` under `@theme inline`
- Delete the blank-page placeholder in `src/routes/index.tsx`
- Add `notFoundComponent` + `errorComponent` on root and data routes
