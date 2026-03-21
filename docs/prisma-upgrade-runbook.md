# Prisma Upgrade Runbook (Safe Path)

This runbook is for upgrading `prisma` and `@prisma/client` safely without breaking the current production flow.

Current project state:
- `prisma`: `6.19.2`
- `@prisma/client`: `6.19.2`
- Prisma is currently **legacy** in runtime architecture (main app path is Supabase + RLS/RPC), but packages still exist in repo.

## Goal

1. Keep dependencies secure.
2. Avoid breaking any local scripts, migrations, or seed flows.
3. Validate on staging before production.

## 0) Preconditions

- Confirm clean branch and working tree for upgrade work.
- Ensure staging database is available.
- Keep a DB backup/snapshot before any migration command.

## 1) Create an isolated branch

```bash
git checkout -b chore/prisma-safe-upgrade
```

## 2) Upgrade packages together

Always upgrade both packages together:

```bash
npm install prisma@latest @prisma/client@latest
```

Then regenerate client:

```bash
npm run prisma:generate
```

## 3) Validate Prisma schema and migrations

Format and validate:

```bash
npx prisma format
npx prisma validate
```

Check migration status against staging:

```bash
npx prisma migrate status
```

If status is not healthy, stop and fix before continuing.

## 4) Seed and API sanity (staging only)

Run seed:

```bash
npm run prisma:seed
```

If legacy API is still used in any environment:

```bash
npm run dev:legacy-api
```

Verify:
- `/api/health` responds.
- Auth routes in `server/index.ts` still behave as expected.

## 5) Security and quality checks

```bash
npm audit --omit=dev
npm run build
npm run test:e2e
```

Acceptance:
- Build passes.
- E2E passes.
- Audit results are reduced or unchanged with documented reason.

## 6) Rollback plan

If upgrade causes regression:

1. Reinstall known-good versions:

```bash
npm install prisma@6.19.2 @prisma/client@6.19.2
```

2. Regenerate client:

```bash
npm run prisma:generate
```

3. Re-run:

```bash
npm run build
npm run test:e2e
```

4. If DB migration was applied during test, restore staging snapshot or run a dedicated down migration.

## 7) Production release checklist

- [ ] Staging validated end-to-end
- [ ] Audit reviewed and documented
- [ ] Prisma commands (`generate`, `seed`, `migrate status`) green
- [ ] Build + E2E green
- [ ] Rollback path verified

## Notes specific to this repo

- Main business flow (storefront + checkout) runs through Supabase RPC/RLS, so Prisma upgrade risk is mostly in legacy server tooling.
- Keep `dev:legacy-api` naming to avoid architectural confusion.
