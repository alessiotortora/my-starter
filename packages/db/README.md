# @repo/db

Drizzle schema + client factory for the starter.

## First-time setup

After configuring `DATABASE_URL` in `.env`:

```bash
bun db:push          # Syncs schema (tables, indexes, RLS) to Supabase
```

Then run `src/setup.sql` **once** in the Supabase SQL editor (or via psql). It revokes public-schema privileges from the `anon` and `authenticated` roles — belt-and-suspenders alongside RLS. Safe to re-run.

## Day-to-day

```bash
bun db:push          # Push schema changes during dev
bun db:studio        # Drizzle Studio
bun db:generate      # Generate migration files (for later, when you want history)
bun db:migrate       # Apply migration files
```

## Row-Level Security

Every `pgTable` in `src/schema/` chains `.enableRLS()`. With no `pgPolicy` defined, Postgres applies a default-deny. The backend bypasses this because `DATABASE_URL` uses the `postgres` role (Supabase direct / pooler with DB password). If you ever expose the Supabase anon key to the browser, add explicit `pgPolicy` rules per table.
