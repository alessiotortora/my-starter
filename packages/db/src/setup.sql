-- One-time setup after the first `bun db:push`.
-- Run this in the Supabase SQL editor (or via psql as the postgres role).
-- Idempotent: safe to re-run.
--
-- Purpose: lock out the Supabase-exposed anon/authenticated roles from the
-- public schema. Combined with RLS (default-deny policy when no pgPolicy is
-- defined), this closes the PostgREST attack surface. Your backend keeps
-- working because postgres-js connects as the `postgres` role via
-- DATABASE_URL, which bypasses both RLS and these REVOKEs.

REVOKE ALL ON ALL TABLES IN SCHEMA public FROM anon, authenticated;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM anon, authenticated;
REVOKE ALL ON ALL FUNCTIONS IN SCHEMA public FROM anon, authenticated;
REVOKE USAGE ON SCHEMA public FROM anon, authenticated;

-- Prevent future objects created in the public schema from granting to
-- anon/authenticated by default.
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON TABLES FROM anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON SEQUENCES FROM anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON FUNCTIONS FROM anon, authenticated;
