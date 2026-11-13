-- ============================================
-- Portfolio Website — Supabase Database Schema
-- ============================================
-- Run this SQL in your Supabase project's SQL Editor
-- (Dashboard → SQL Editor → New Query → Paste & Run)

-- 1. Create the portfolio_sections table
--    Each row stores one section of the portfolio as JSONB.
CREATE TABLE IF NOT EXISTS portfolio_sections (
    id          SERIAL PRIMARY KEY,
    section_key TEXT UNIQUE NOT NULL,
    data        JSONB NOT NULL,
    updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable Row Level Security
ALTER TABLE portfolio_sections ENABLE ROW LEVEL SECURITY;

-- 3. Public read access — anyone can view the portfolio
CREATE POLICY "Allow public read"
    ON portfolio_sections
    FOR SELECT
    USING (true);

-- 4. Admin-only write access.
--    IMPORTANT: replace the UUID below with YOUR user id
--    (Dashboard -> Authentication -> Users -> copy the "User UID").
--    Restricting to auth.role() = 'authenticated' is NOT enough: if sign-ups
--    are enabled, anyone can register and would be allowed to edit your site.
--    The placeholder is deliberately not a valid UUID, so this script fails
--    loudly until you replace it.
CREATE POLICY "Admin insert"
    ON portfolio_sections
    FOR INSERT
    WITH CHECK ((SELECT auth.uid()) = 'REPLACE-WITH-YOUR-ADMIN-USER-UUID'::uuid);

CREATE POLICY "Admin update"
    ON portfolio_sections
    FOR UPDATE
    USING ((SELECT auth.uid()) = 'REPLACE-WITH-YOUR-ADMIN-USER-UUID'::uuid)
    WITH CHECK ((SELECT auth.uid()) = 'REPLACE-WITH-YOUR-ADMIN-USER-UUID'::uuid);

CREATE POLICY "Admin delete"
    ON portfolio_sections
    FOR DELETE
    USING ((SELECT auth.uid()) = 'REPLACE-WITH-YOUR-ADMIN-USER-UUID'::uuid);

-- 5. Auto-update the updated_at timestamp on row changes
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON portfolio_sections
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- ============================================
-- SETUP INSTRUCTIONS
-- ============================================
-- After running this SQL:
--
-- 1. Go to Authentication → Users in your Supabase dashboard
-- 2. Click "Add User" → "Create New User"
-- 3. Enter your admin email and password
-- 4. Set these environment variables in your .env file:
--      VITE_SUPABASE_URL=https://your-project.supabase.co
--      VITE_SUPABASE_ANON_KEY=your-anon-key
-- 5. Deploy or restart your dev server
--    (Also: Authentication -> Providers -> Email -> turn OFF "Allow new users
--     to sign up", since this site only ever needs your single admin account.)
-- 6. Log in with the admin credentials you created
-- 7. Use the CMS Dashboard → Settings → "Initialize Database"
--    to push default data to the database
