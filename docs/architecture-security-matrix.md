# Architecture & Permissions Matrix

## Data Flow (Current)

1. User interacts with frontend pages/components.
2. Frontend uses Supabase client from `src/lib/supabase.ts`.
3. Reads:
   - `products` (active for public, all for admin via policy)
   - dashboard views/services (admin-only by RLS)
4. Writes:
   - checkout uses `public.create_order_secure(...)` RPC only
   - admin dashboard writes are allowed only for users with `user_roles.role = 'admin'`

## Auth & Authorization

- Authentication: Supabase Auth session.
- Route-level protection:
  - `/dashboard` requires authenticated + admin role.
- Data-level protection:
  - RLS policies enforce access regardless of frontend route logic.

## Permissions Matrix

| Resource | Public (anon) | Authenticated (non-admin) | Admin |
|---|---|---|---|
| `products` | Read `status='active'` | Read `status='active'` | Full CRUD |
| `customers` | No access | No access | Full CRUD |
| `orders` | No access | Own orders read only (if linked) | Full CRUD |
| `order_items` | No access | Own order items read only | Full CRUD |
| `store_settings` | Read | Read | Update |
| `user_roles` | No access | No access | Full CRUD |
| `create_order_secure` RPC | Execute | Execute | Execute |

## Logging & PII Policy

- Use `logger` from `src/lib/logger.ts` for application logs.
- Sensitive fields are redacted automatically in context keys:
  - `email`, `phone`, `password`, `token`, `address`, `fullName`, `full_name`.
- Avoid logging raw request/response payloads containing customer data.

## Runtime Monitoring

- Global listeners in `src/main.tsx`:
  - `window.onerror`
  - `window.unhandledrejection`
- Both events are routed to `logger.error(...)`.
