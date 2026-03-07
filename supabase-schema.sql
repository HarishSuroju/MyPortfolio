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

-- 4. Authenticated write access — only logged-in admin can modify
CREATE POLICY "Allow authenticated insert"
    ON portfolio_sections
    FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update"
    ON portfolio_sections
    FOR UPDATE
    USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated delete"
    ON portfolio_sections
    FOR DELETE
    USING (auth.role() = 'authenticated');

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
-- 6. Log in with the admin credentials you created
-- 7. Use the CMS Dashboard → Settings → "Initialize Database"
--    to push default data to the database
