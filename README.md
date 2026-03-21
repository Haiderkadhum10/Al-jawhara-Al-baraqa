
# موقع شركة الجوهرة البراقة

This is a code bundle for موقع شركة الجوهرة البراقة. The original project is available at [Figma source](https://www.figma.com/design/KTysUQWribhhj1Hkvy4jij/%D9%85%D9%88%D9%82%D8%B9-%D8%B4%D8%B1%D9%83%D8%A9-%D8%A7%D9%84%D8%AC%D9%88%D9%87%D8%B1%D8%A9-%D8%A7%D9%84%D8%A8%D8%B1%D8%A7%D9%82%D8%A9).

## Running the code

- Run `npm i` to install dependencies.
- Run `npm run dev` to start the frontend.

## Architecture (Current)

- Primary runtime path: **Frontend + Supabase**.
- Security model: **RLS policies + RPC** in Supabase.
- The `server/index.ts` API is now **legacy** and not part of the default runtime path.

## Security migrations

Apply database migrations from `db/migrations` in this order:

1. `20260321_phase1_security_up.sql`
2. `20260321_phase1_security_verify.sql`
3. `20260321_phase1_security_smoke_tests.sql`
4. `20260321_legacy_indexes_up.sql`
5. `20260321_deduplicate_customers_up.sql`

If rollback is needed:

6. `20260321_phase1_security_rollback.sql`

## Dependency maintenance

- Prisma safe-upgrade procedure: `docs/prisma-upgrade-runbook.md`

## SQL source of truth

- Canonical executable SQL: `db/migrations/*`
- Root SQL files are archived snapshots/references only:
  - `database_schema.sql`
  - `secure_checkout_rpc.sql`
  - `indexes.sql`
  - `deduplicate_customers.sql`
  