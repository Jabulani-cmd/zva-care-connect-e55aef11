# Plus2 Pharmacy — Full Demo Mode Build Plan

This is a very large scope. Before I start coding, I want to align on approach so we don't burn hours on the wrong direction.

## What you're asking for (scope summary)

1. **Demo accounts** — 5 customers + 6 staff with full profiles, addresses, health profiles, medical aid, order history, prescriptions, wishlists.
2. **Seeded data** — 15 orders, 6 prescriptions, 4 drivers, 20 inventory items with stock levels, sales charts (hourly + 7-day + category), 12 expenses.
3. **Payment workflows** — Simulated card (incl. 4242/4000 demo cards), PayFast modal, EFT with copy-to-clipboard, Cash on Delivery, full Rx payment flow, animated order confirmation.
4. **Staff portal (NEW — doesn't exist yet)** — `/staff/login` plus 6 role-specific dashboards (Super Admin, Pharmacist, Store Manager, Dispatcher, Cashier, Inventory Clerk), each with KPIs, charts, queues, kanban boards, modals, POs, expense approvals.
5. **Demo login panels** on both customer and staff login.
6. **Demo Scenarios floating help button** with 5 walkthrough scripts.

## Reality check

The existing app has a customer storefront (cart, checkout, prescriptions, track, account) but **no staff portal at all**. Building 6 role-based dashboards with kanban boards, prescription review modals, PO creation, POS, expense approvals, and inter-account real-time state sync is roughly equivalent to building a second full app on top of the existing one.

A realistic honest estimate: this is **15–25+ hours of focused work** across ~40 new files. Doing it in one shot in a single response will almost certainly produce something that compiles but has broken flows, mismatched data, and missed checklist items — the opposite of what you need for an investor demo.

## Recommended approach — phased delivery

I'd like to split this into ~5 phases, each shippable and testable on its own. After each phase you can demo what's done and we course-correct before the next.

**Phase 1 — Foundation (data + accounts)**
- Central `src/data/demo.ts` with all 5 customers, 6 staff, 15 orders, 6 prescriptions, 4 drivers, 20 inventory items, sales/expenses data.
- New `useDemoStore` Zustand store as single source of truth so customer + staff views stay in sync.
- Update `useAuth` to support staff roles + demo login.
- Demo login panel on `/auth` (customer) with one-click cards.

**Phase 2 — Customer payment workflow**
- Replace existing checkout payment step with the 4-method simulator (Card with 4242/4000 logic, PayFast modal, EFT with copy buttons, COD).
- Animated order confirmation page with checkmark, tracker, receipt download.
- Wire Rx payment notification flow.

**Phase 3 — Staff portal shell + auth**
- New routes: `/staff/login`, `/staff` layout with role-based nav, role-routing on login.
- Staff demo login panel.
- Shared KPI/Chart/Card components.

**Phase 4 — Role dashboards (split into 2 sub-passes)**
- 4a: Super Admin + Store Manager + Cashier (read-heavy + simple actions).
- 4b: Pharmacist (Rx review modal), Dispatcher (kanban + driver assign), Inventory Clerk (PO flow). These are the interactive ones.

**Phase 5 — Polish**
- Demo Scenarios floating help panel.
- Excel/PDF/Print exports on reports.
- Final QA pass against your checklist at 375px + 1280px.

## Technical notes
- Everything stays client-side (Zustand + localStorage). No backend changes.
- Currency stays USD/ZIG only — already enforced.
- All "real-time" updates are local state mutations that propagate via Zustand subscribers.
- Simulated PDFs use `jspdf`, Excel uses `xlsx` (will add as deps in the phase that needs them).
- Prescription "script image" will be an SVG mockup, not a generated image, to keep it fast.

## What I need from you

1. **Confirm phased delivery is OK** — or tell me to power through it all in one go (with the quality caveat above).
2. **Confirm Phase 1 should start now** — if yes, I'll begin immediately after your approval.
3. **Anything to cut?** The 5 demo scenarios + 6 staff roles is a lot. If your investor demo only really needs Admin + Pharmacist + Dispatcher, we save ~30% of the work.
