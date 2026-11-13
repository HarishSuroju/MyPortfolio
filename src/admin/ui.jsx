import React, { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { ArrowDown, ArrowUp, ChevronDown, ImagePlus, Loader2, Plus, Save, Trash2, Undo2 } from 'lucide-react';
import { uploadImage } from '../lib/storage';

const inputClass =
    'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-200';

export const Field = ({ label, hint, children }) => (
    <label className="block">
        <span className="mb-1 block text-sm font-medium text-slate-700">{label}</span>
        {children}
        {hint && <span className="mt-1 block text-xs text-slate-500">{hint}</span>}
    </label>
);

export const TextInput = ({ label, hint, value, onChange, ...rest }) => (
    <Field label={label} hint={hint}>
        <input className={inputClass} value={value ?? ''} onChange={(e) => onChange(e.target.value)} {...rest} />
    </Field>
);

export const TextArea = ({ label, hint, value, onChange, rows = 4, ...rest }) => (
    <Field label={label} hint={hint}>
        <textarea className={`${inputClass} resize-y`} rows={rows} value={value ?? ''} onChange={(e) => onChange(e.target.value)} {...rest} />
    </Field>
);

export const Toggle = ({ label, checked, onChange }) => (
    <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-slate-700">
        <input
            type="checkbox"
            checked={Boolean(checked)}
            onChange={(e) => onChange(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 accent-violet-600"
        />
        {label}
    </label>
);

export const Range = ({ label, value, onChange }) => (
    <Field label={`${label}: ${value}%`}>
        <input
            type="range"
            min="0"
            max="100"
            value={value ?? 50}
            onChange={(e) => onChange(parseInt(e.target.value, 10))}
            className="w-full accent-violet-600"
        />
    </Field>
);

// Comma-separated list <-> string[]. Keeps its own text so typing "a, " works.
export const TagInput = ({ label, hint, value = [], onChange }) => {
    const [text, setText] = useState(value.join(', '));
    return (
        <Field label={label} hint={hint ?? 'Separate with commas'}>
            <input
                className={inputClass}
                value={text}
                onChange={(e) => {
                    setText(e.target.value);
                    onChange(e.target.value.split(',').map((t) => t.trim()).filter(Boolean));
                }}
            />
        </Field>
    );
};

// One item per line <-> string[].
export const LinesInput = ({ label, hint, value = [], onChange, rows = 4, placeholder }) => {
    const [text, setText] = useState(value.join('\n'));
    return (
        <Field label={label} hint={hint ?? 'One per line'}>
            <textarea
                className={`${inputClass} resize-y`}
                rows={rows}
                placeholder={placeholder}
                value={text}
                onChange={(e) => {
                    setText(e.target.value);
                    onChange(e.target.value.split('\n').map((t) => t.trim()).filter(Boolean));
                }}
            />
        </Field>
    );
};

export const ImageInput = ({ label, value, onChange, folder = 'misc', hint }) => {
    const [uploading, setUploading] = useState(false);
    const fileRef = useRef(null);

    const handleFile = async (file) => {
        if (!file) return;
        setUploading(true);
        try {
            const url = await uploadImage(file, folder);
            onChange(url);
            toast.success('Image uploaded');
        } catch (error) {
            toast.error(error.message);
        } finally {
            setUploading(false);
            if (fileRef.current) fileRef.current.value = '';
        }
    };

    return (
        <Field label={label} hint={hint}>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                <div className="flex h-24 w-36 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-dashed border-slate-300 bg-slate-50">
                    {value ? (
                        <img src={value} alt="" className="h-full w-full object-cover" />
                    ) : (
                        <ImagePlus size={24} className="text-slate-400" />
                    )}
                </div>
                <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap gap-2">
                        <button
                            type="button"
                            onClick={() => fileRef.current?.click()}
                            disabled={uploading}
                            className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-60"
                        >
                            {uploading ? <Loader2 size={16} className="animate-spin" /> : <ImagePlus size={16} />}
                            {uploading ? 'Uploading...' : value ? 'Replace image' : 'Upload image'}
                        </button>
                        {value && (
                            <button
                                type="button"
                                onClick={() => onChange('')}
                                className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
                            >
                                Remove
                            </button>
                        )}
                    </div>
                    <input
                        className={inputClass}
                        value={value?.startsWith('data:') ? '(embedded image, see Backup & Tools to migrate)' : value ?? ''}
                        readOnly={value?.startsWith('data:')}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder="...or paste an image URL"
                    />
                    <input
                        ref={fileRef}
                        type="file"
                        accept="image/png,image/jpeg,image/webp,image/gif"
                        className="hidden"
                        onChange={(e) => handleFile(e.target.files?.[0])}
                    />
                </div>
            </div>
        </Field>
    );
};

/**
 * Page wrapper for one section editor: title, content, and a sticky save bar
 * that appears whenever there are unsaved edits.
 */
export const EditorShell = ({ title, description, draft, children }) => (
    <div className="pb-28">
        <header className="mb-6">
            <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
            {description && <p className="mt-1 text-sm text-slate-600">{description}</p>}
        </header>
        <div key={draft.version} className="space-y-5">
            {children}
        </div>

        <div
            className={`fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 backdrop-blur transition-transform duration-200 lg:left-64 ${
                draft.dirty ? 'translate-y-0' : 'translate-y-full'
            }`}
            role="region"
            aria-label="Unsaved changes"
        >
            <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3">
                <p className="text-sm font-medium text-amber-700">You have unsaved changes</p>
                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={draft.discard}
                        disabled={draft.saving}
                        className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 disabled:opacity-60"
                    >
                        <Undo2 size={16} /> Discard
                    </button>
                    <button
                        type="button"
                        onClick={draft.save}
                        disabled={draft.saving}
                        className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-60"
                    >
                        {draft.saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                        {draft.saving ? 'Saving...' : 'Save changes'}
                    </button>
                </div>
            </div>
        </div>
    </div>
);

export const Card = ({ title, children }) => (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        {title && <h2 className="mb-4 text-base font-semibold text-slate-900">{title}</h2>}
        <div className="space-y-4">{children}</div>
    </section>
);

/**
 * Editable, reorderable list. `children(item, patch, index)` renders the fields
 * for one item; `patch(partial)` merges changes into that item.
 */
export const ListEditor = ({ items, onChange, newItem, itemTitle, itemSubtitle, addLabel = 'Add item', emptyText = 'Nothing here yet.', children }) => {
    const [open, setOpen] = useState(() => new Set());

    const toggle = (id) =>
        setOpen((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });

    const update = (index, patch) =>
        onChange(items.map((item, i) => (i === index ? { ...item, ...patch } : item)));

    const move = (index, delta) => {
        const target = index + delta;
        if (target < 0 || target >= items.length) return;
        const next = [...items];
        [next[index], next[target]] = [next[target], next[index]];
        onChange(next);
    };

    const remove = (index) => {
        if (window.confirm(`Delete "${itemTitle(items[index]) || 'this item'}"? This applies when you press Save.`)) {
            onChange(items.filter((_, i) => i !== index));
        }
    };

    const add = () => {
        const item = newItem();
        onChange([...items, item]);
        setOpen((prev) => new Set(prev).add(item.id));
    };

    return (
        <div className="space-y-3">
            {items.length === 0 && (
                <p className="rounded-lg border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">{emptyText}</p>
            )}

            {items.map((item, index) => {
                const isOpen = open.has(item.id);
                return (
                    <div key={item.id} className="rounded-xl border border-slate-200 bg-white shadow-sm">
                        <div className="flex items-center gap-2 p-3">
                            <button
                                type="button"
                                onClick={() => toggle(item.id)}
                                aria-expanded={isOpen}
                                className="flex min-w-0 flex-1 items-center gap-2 text-left"
                            >
                                <ChevronDown size={18} className={`shrink-0 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                                <span className="min-w-0">
                                    <span className="block truncate text-sm font-semibold text-slate-900">{itemTitle(item) || 'Untitled'}</span>
                                    {itemSubtitle && <span className="block truncate text-xs text-slate-500">{itemSubtitle(item)}</span>}
                                </span>
                            </button>
                            <div className="flex shrink-0 gap-1">
                                <button type="button" onClick={() => move(index, -1)} disabled={index === 0} aria-label="Move up" className="rounded p-1.5 text-slate-500 hover:bg-slate-100 disabled:opacity-30">
                                    <ArrowUp size={16} />
                                </button>
                                <button type="button" onClick={() => move(index, 1)} disabled={index === items.length - 1} aria-label="Move down" className="rounded p-1.5 text-slate-500 hover:bg-slate-100 disabled:opacity-30">
                                    <ArrowDown size={16} />
                                </button>
                                <button type="button" onClick={() => remove(index)} aria-label="Delete" className="rounded p-1.5 text-red-500 hover:bg-red-50">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                        {isOpen && (
                            <div className="space-y-4 border-t border-slate-100 p-4">
                                {children(item, (patch) => update(index, patch), index)}
                            </div>
                        )}
                    </div>
                );
            })}

            <button
                type="button"
                onClick={add}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
                <Plus size={16} /> {addLabel}
            </button>
        </div>
    );
};
