## Phase 1 Security Migrations

Execution order:

1. `20260321_phase1_security_up.sql`
2. `20260321_phase1_security_verify.sql`
3. `20260321_phase1_security_smoke_tests.sql`
4. `20260321_legacy_indexes_up.sql` (if indexes not already present)
5. `20260321_deduplicate_customers_up.sql` (run once on staging then production)

Emergency revert:

6. `20260321_phase1_security_rollback.sql`

Notes:
- Apply on staging first.
- Ensure at least one admin user exists in `public.user_roles` after migration.
- Frontend checkout now depends on `public.create_order_secure(...)`.
- Use `phase1-manual-test-checklist.md` for app-level validation (admin/non-admin).
- Root SQL files (`database_schema.sql`, `secure_checkout_rpc.sql`, `indexes.sql`, `deduplicate_customers.sql`) are archived references only.
