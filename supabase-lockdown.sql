-- ============================================
-- Lock down an EXISTING database to a single admin
-- ============================================
-- Use this if you already ran supabase-schema.sql with the old
-- "authenticated" write policies. Run it in the Supabase SQL Editor.
--
-- 1. Copy your admin "User UID" from Authentication -> Users.
-- 2. Replace all three REPLACE-WITH-YOUR-ADMIN-USER-UUID values below.
-- 3. Also disable public sign-ups: Authentication -> Providers -> Email ->
--    turn OFF "Allow new users to sign up".

DROP POLICY IF EXISTS "Allow authenticated insert" ON portfolio_sections;
DROP POLICY IF EXISTS "Allow authenticated update" ON portfolio_sections;
DROP POLICY IF EXISTS "Allow authenticated delete" ON portfolio_sections;

CREATE POLICY "Admin insert"
    ON portfolio_sections FOR INSERT
    WITH CHECK ((SELECT auth.uid()) = 'REPLACE-WITH-YOUR-ADMIN-USER-UUID'::uuid);

CREATE POLICY "Admin update"
    ON portfolio_sections FOR UPDATE
    USING ((SELECT auth.uid()) = 'REPLACE-WITH-YOUR-ADMIN-USER-UUID'::uuid)
    WITH CHECK ((SELECT auth.uid()) = 'REPLACE-WITH-YOUR-ADMIN-USER-UUID'::uuid);

CREATE POLICY "Admin delete"
    ON portfolio_sections FOR DELETE
    USING ((SELECT auth.uid()) = 'REPLACE-WITH-YOUR-ADMIN-USER-UUID'::uuid);
