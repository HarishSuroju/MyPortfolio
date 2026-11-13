import { useCallback, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { usePortfolio } from '../contexts/DataContext';

// Lets the admin sidebar ask "is there anything unsaved?" before navigating away.
export const dirtyState = { current: false };

const clone = (value) => JSON.parse(JSON.stringify(value));

/**
 * Editing state for one portfolio section.
 *
 * Edits live in a local draft until the user presses Save, so a half-typed
 * change never reaches the public site. `version` changes on discard so
 * editors can remount their inputs with the restored values.
 */
const useSectionDraft = (key, { fallback = {}, normalize = (v) => v } = {}) => {
    const { data, saveSection } = usePortfolio();

    const initial = useMemo(
        () => normalize(clone(data[key] ?? fallback)),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    );

    const [draft, setDraft] = useState(initial);
    const [baseline, setBaseline] = useState(() => JSON.stringify(initial));
    const [saving, setSaving] = useState(false);
    const [version, setVersion] = useState(0);

    const dirty = JSON.stringify(draft) !== baseline;

    useEffect(() => {
        dirtyState.current = dirty;
        return () => {
            dirtyState.current = false;
        };
    }, [dirty]);

    useEffect(() => {
        if (!dirty) return undefined;
        const warn = (e) => {
            e.preventDefault();
            e.returnValue = '';
        };
        window.addEventListener('beforeunload', warn);
        return () => window.removeEventListener('beforeunload', warn);
    }, [dirty]);

    const save = useCallback(async () => {
        setSaving(true);
        const ok = await saveSection(key, draft);
        setSaving(false);
        if (ok) {
            setBaseline(JSON.stringify(draft));
            toast.success('Saved and live on your site');
        } else {
            toast.error('Could not save to the database. Your edits are still here, so try again.');
        }
        return ok;
    }, [draft, key, saveSection]);

    const discard = useCallback(() => {
        setDraft(JSON.parse(baseline));
        setVersion((v) => v + 1);
    }, [baseline]);

    return { draft, setDraft, dirty, saving, save, discard, version };
};

export default useSectionDraft;
