## Phase 1 Manual Test Checklist (Admin vs Non-Admin)

Use this checklist right after applying migrations on staging.

### 1) Pre-setup
- Ensure `up.sql` has run successfully.
- Ensure at least one admin in `public.user_roles`.
- Create two test accounts:
  - `admin@test.local` (role: `admin`)
  - `user@test.local` (role: `customer` or no admin role)

### 2) Public / non-authenticated checks
- Open store pages:
  - `/`
  - `/products`
  - `/products/:id`
- Expected:
  - Active products visible.
  - No access to dashboard data.

### 3) Non-admin authenticated checks
- Login as non-admin user.
- Try dashboard access (`/dashboard`).
- Expected:
  - UI may open route, but sensitive DB actions must fail by RLS.
- In app flows, ensure user cannot:
  - Create/update/delete products
  - Read all customers
  - Read all orders

### 4) Admin checks
- Login as admin user.
- Validate dashboard tabs:
  - Products: list + add/edit/archive/delete
  - Orders: read + delete
  - Customers: read
  - Settings: update delivery price
- Expected:
  - All allowed admin operations succeed.

### 5) Checkout integrity checks
- Add items to cart and place order from storefront.
- Expected:
  - Order created through `create_order_secure`.
  - Prices are derived from DB, not client payload.
  - Stock decreases correctly.
- Tampering test:
  - Manipulate frontend values (DevTools/local state) before submit.
  - Expected: final order amount still server-calculated.

### 6) Regression checks (UX critical fixes)
- Mobile menu:
  - "تسجيل الدخول" button should navigate to `/login`.
- Header:
  - "حسابي" should navigate to `/login`.
- Contact:
  - "افتح بخرائط جوجل" opens maps in a new tab.
- Product detail:
  - Shows loading state before fallback "المنتج غير موجود".

### 7) Exit criteria
- All security SQL checks pass.
- Non-admin cannot access sensitive data/actions.
- Admin operations work.
- Checkout flow works with server-side pricing.
