import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Download, ImageDown, RefreshCw, Upload } from 'lucide-react';
import { usePortfolio } from '../../contexts/DataContext';
import { initializeDatabase, resetPortfolioData, savePortfolioData } from '../../utils/dataManager';
import { countDataUrls, migrateDataUrls } from '../../lib/storage';
import { supabase } from '../../lib/supabase';
import { Card } from '../ui';

const reloadSoon = () => setTimeout(() => window.location.reload(), 700);

const ActionButton = ({ icon, children, tone = 'slate', ...rest }) => {
    const Icon = icon;
    const tones = {
        slate: 'bg-slate-900 text-white hover:bg-slate-700',
        red: 'bg-red-600 text-white hover:bg-red-700',
    };
    return (
        <button
            type="button"
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium disabled:opacity-60 ${tones[tone]}`}
            {...rest}
        >
            <Icon size={16} />
            {children}
        </button>
    );
};

const BackupTools = () => {
    const { data, replaceAll } = usePortfolio();
    const [busy, setBusy] = useState(false);
    const [progress, setProgress] = useState('');
    const embedded = countDataUrls(data);

    const exportData = () => {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `portfolio-backup-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
        toast.success('Backup downloaded');
    };

    const importData = (event) => {
        const file = event.target.files?.[0];
        event.target.value = '';
        if (!file) return;
        if (!window.confirm('Importing replaces ALL current content with the file. Download a backup first if unsure. Continue?')) return;

        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const parsed = JSON.parse(e.target.result);
                const ok = await savePortfolioData(parsed);
                if (!ok) {
                    toast.error('Import failed: the database rejected the data. Nothing was changed online.');
                    return;
                }
                replaceAll(parsed);
                toast.success('Imported. Reloading...');
                reloadSoon();
            } catch (error) {
                toast.error(error instanceof SyntaxError ? 'That file is not valid JSON.' : error.message);
            }
        };
        reader.readAsText(file);
    };

    const migrateImages = async () => {
        if (!window.confirm(`Move ${embedded} embedded image(s) to Supabase Storage? Content is saved automatically.`)) return;
        setBusy(true);
        try {
            const { data: migrated, count } = await migrateDataUrls(data, (done, total) => setProgress(`Uploading ${done} of ${total}...`));
            const ok = await savePortfolioData(migrated);
            if (!ok) throw new Error('Images uploaded but saving the updated content failed. Run this again.');
            replaceAll(migrated);
            toast.success(`Moved ${count} image(s) to Storage. Reloading...`);
            reloadSoon();
        } catch (error) {
            toast.error(error.message);
        } finally {
            setBusy(false);
            setProgress('');
        }
    };

    const resetAll = async () => {
        if (!window.confirm('Reset EVERYTHING to the built-in defaults? This overwrites your live content.')) return;
        setBusy(true);
        const { data: defaults, saved } = await resetPortfolioData();
        setBusy(false);
        if (!saved) {
            toast.error('Reset failed in the database. Nothing was changed online.');
            return;
        }
        replaceAll(defaults);
        toast.success('Reset to defaults. Reloading...');
        reloadSoon();
    };

    const seedDatabase = async () => {
        if (!window.confirm('Write the built-in defaults to the database? This overwrites existing rows.')) return;
        try {
            await initializeDatabase();
            toast.success('Database initialised with defaults.');
        } catch (error) {
            toast.error(`Failed: ${error.message}`);
        }
    };

    return (
        <div className="space-y-5 pb-10">
            <header>
                <h1 className="text-2xl font-bold text-slate-900">Backup & Tools</h1>
                <p className="mt-1 text-sm text-slate-600">Safety nets and one-off maintenance.</p>
            </header>

            <Card title="Backup">
                <p className="text-sm text-slate-600">Download everything as a JSON file, or restore from one.</p>
                <div className="flex flex-wrap gap-2">
                    <ActionButton icon={Download} onClick={exportData}>Download backup</ActionButton>
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
                        <Upload size={16} /> Restore from file
                        <input type="file" accept="application/json,.json" className="hidden" onChange={importData} />
                    </label>
                </div>
            </Card>

            <Card title="Images">
                <p className="text-sm text-slate-600">
                    {embedded > 0
                        ? `${embedded} image(s) are stored inside your content as base64. Moving them to Storage makes the site faster and avoids storage limits.`
                        : 'All images are stored as normal files. Nothing to migrate.'}
                </p>
                {embedded > 0 && (
                    <div className="flex flex-wrap items-center gap-3">
                        <ActionButton icon={ImageDown} onClick={migrateImages} disabled={busy || !supabase}>
                            Move images to Storage
                        </ActionButton>
                        {progress && <span className="text-sm text-slate-500">{progress}</span>}
                        {!supabase && <span className="text-sm text-amber-700">Needs Supabase to be configured.</span>}
                    </div>
                )}
            </Card>

            <Card title="Danger zone">
                <p className="text-sm text-slate-600">These overwrite your live content with the built-in sample data.</p>
                <div className="flex flex-wrap gap-2">
                    <ActionButton icon={RefreshCw} tone="red" onClick={resetAll} disabled={busy}>Reset all to defaults</ActionButton>
                    {supabase && <ActionButton icon={RefreshCw} tone="red" onClick={seedDatabase} disabled={busy}>Seed database with defaults</ActionButton>}
                </div>
            </Card>
        </div>
    );
};

export default BackupTools;
