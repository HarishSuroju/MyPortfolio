-- ============================================
-- Image storage for the portfolio CMS
-- ============================================
-- Run this once in the Supabase SQL Editor.
--
-- 1. Copy your admin "User UID" from Authentication -> Users.
-- 2. Replace all four REPLACE-WITH-YOUR-ADMIN-USER-UUID values below
--    (the placeholder is not a valid UUID, so the script fails loudly until
--    you do).
--
-- The bucket is public so visitors can load images by URL; only your admin
-- user can upload, replace or delete files.

INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-media', 'portfolio-media', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Admin select media"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'portfolio-media'
           AND (SELECT auth.uid()) = 'REPLACE-WITH-YOUR-ADMIN-USER-UUID'::uuid);

CREATE POLICY "Admin upload media"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'portfolio-media'
                AND (SELECT auth.uid()) = 'REPLACE-WITH-YOUR-ADMIN-USER-UUID'::uuid);

CREATE POLICY "Admin update media"
    ON storage.objects FOR UPDATE
    USING (bucket_id = 'portfolio-media'
           AND (SELECT auth.uid()) = 'REPLACE-WITH-YOUR-ADMIN-USER-UUID'::uuid)
    WITH CHECK (bucket_id = 'portfolio-media'
                AND (SELECT auth.uid()) = 'REPLACE-WITH-YOUR-ADMIN-USER-UUID'::uuid);

CREATE POLICY "Admin delete media"
    ON storage.objects FOR DELETE
    USING (bucket_id = 'portfolio-media'
           AND (SELECT auth.uid()) = 'REPLACE-WITH-YOUR-ADMIN-USER-UUID'::uuid);
