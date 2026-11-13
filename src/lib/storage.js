import { supabase } from './supabase';
import { validateImageFile } from '../utils/dataManager';

export const MEDIA_BUCKET = 'portfolio-media';
const MAX_DIMENSION = 1600;

// Downscale and convert to WebP in the browser so uploads stay small and fast.
// GIFs are kept as-is to preserve animation.
const prepare = async (file) => {
    if (file.type === 'image/gif') return { blob: file, ext: 'gif' };

    try {
        const bitmap = await createImageBitmap(file);
        const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(bitmap.width * scale);
        canvas.height = Math.round(bitmap.height * scale);
        canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height);
        bitmap.close?.();

        const webp = await new Promise((resolve) => canvas.toBlob(resolve, 'image/webp', 0.85));
        if (webp && webp.type === 'image/webp' && webp.size < file.size) {
            return { blob: webp, ext: 'webp' };
        }
    } catch {
        // fall through to the original file
    }
    const ext = (file.name.split('.').pop() || 'png').toLowerCase();
    return { blob: file, ext };
};

/**
 * Upload an image to Supabase Storage and return its public URL.
 * Throws a readable Error on failure (including "bucket not set up yet").
 */
export const uploadImage = async (file, folder = 'misc') => {
    validateImageFile(file);

    if (!supabase) {
        throw new Error('Supabase is not configured, so images cannot be uploaded.');
    }

    const { blob, ext } = await prepare(file);
    const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    const { error } = await supabase.storage.from(MEDIA_BUCKET).upload(path, blob, {
        contentType: blob.type || file.type,
        cacheControl: '31536000',
    });

    if (error) {
        if (/bucket not found/i.test(error.message)) {
            throw new Error('Storage bucket missing. Run supabase-storage.sql in the Supabase SQL Editor.');
        }
        if (/row-level security|not authorized|unauthorized/i.test(error.message)) {
            throw new Error('Not allowed to upload. Check that you are logged in as the admin user and that supabase-storage.sql used your user ID.');
        }
        throw new Error(`Upload failed: ${error.message}`);
    }

    return supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path).data.publicUrl;
};

export const countDataUrls = (value) =>
    (JSON.stringify(value).match(/data:image\//g) || []).length;

/**
 * Walk any JSON value and replace embedded base64 images with Storage URLs.
 * Returns { data, count }. Used to migrate content saved before Storage existed.
 */
export const migrateDataUrls = async (value, onProgress) => {
    if (!supabase) throw new Error('Supabase is not configured.');

    let done = 0;
    const total = countDataUrls(value);

    const walk = async (node) => {
        if (typeof node === 'string' && node.startsWith('data:image/')) {
            const blob = await (await fetch(node)).blob();
            const ext = blob.type.split('/')[1] || 'png';
            const file = new File([blob], `migrated.${ext}`, { type: blob.type });
            const url = await uploadImage(file, 'migrated');
            done += 1;
            onProgress?.(done, total);
            return url;
        }
        if (Array.isArray(node)) {
            const out = [];
            for (const item of node) out.push(await walk(item));
            return out;
        }
        if (node && typeof node === 'object') {
            const out = {};
            for (const [k, v] of Object.entries(node)) out[k] = await walk(v);
            return out;
        }
        return node;
    };

    const data = await walk(value);
    return { data, count: done };
};
