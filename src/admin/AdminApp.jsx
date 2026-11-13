import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Award, Briefcase, Code, Database, ExternalLink, FolderOpen, LogOut, Mail, Menu,
    Settings, Sparkles, User, Wrench, X,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import AdminLogin from './AdminLogin';
import BackupTools from './editors/BackupTools';
import { AboutEditor, ContactEditor, HeroEditor, LeetCodeEditor, SiteEditor } from './editors/ObjectEditors';
import { CertificatesEditor, InternshipsEditor, ProjectsEditor, SkillsEditor } from './editors/ListEditors';
import { dirtyState } from './useSectionDraft';

const SECTIONS = [
    { id: 'site', label: 'Site & Navigation', icon: Settings, Editor: SiteEditor },
    { id: 'hero', label: 'Hero', icon: Sparkles, Editor: HeroEditor },
    { id: 'about', label: 'About', icon: User, Editor: AboutEditor },
    { id: 'skills', label: 'Skills', icon: Wrench, Editor: SkillsEditor },
    { id: 'projects', label: 'Projects', icon: FolderOpen, Editor: ProjectsEditor },
    { id: 'internships', label: 'Internships', icon: Briefcase, Editor: InternshipsEditor },
    { id: 'certificates', label: 'Certificates', icon: Award, Editor: CertificatesEditor },
    { id: 'leetcode', label: 'LeetCode', icon: Code, Editor: LeetCodeEditor },
    { id: 'contact', label: 'Contact & Social', icon: Mail, Editor: ContactEditor },
    { id: 'backup', label: 'Backup & Tools', icon: Database, Editor: BackupTools },
];

const initialSection = () => {
    const fromHash = window.location.hash.replace('#', '');
    return SECTIONS.some((s) => s.id === fromHash) ? fromHash : 'site';
};

const AdminApp = () => {
    const { isAuthenticated, isLoading, logout, user } = useAuth();
    const [active, setActive] = useState(initialSection);
    const [menuOpen, setMenuOpen] = useState(false);

    // Without Supabase there is no login to protect: edits only live in this browser.
    const localMode = !supabase;

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-100" role="status">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-violet-200 border-t-violet-600" />
            </div>
        );
    }

    if (!localMode && !isAuthenticated) return <AdminLogin />;

    const go = (id) => {
        if (id !== active && dirtyState.current && !window.confirm('You have unsaved changes in this section. Leave without saving?')) {
            return;
        }
        setActive(id);
        window.history.replaceState(null, '', `#${id}`);
        setMenuOpen(false);
    };

    const { Editor } = SECTIONS.find((s) => s.id === active);

    const sidebar = (
        <nav className="flex h-full flex-col bg-slate-900 text-slate-200" aria-label="Admin sections">
            <div className="px-5 py-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-violet-300">Portfolio CMS</p>
                <p className="mt-1 truncate text-sm text-slate-400">{localMode ? 'Local mode' : user?.email}</p>
            </div>
            <ul className="flex-1 space-y-1 overflow-y-auto px-3">
                {SECTIONS.map((section) => {
                    const Icon = section.icon;
                    return (
                        <li key={section.id}>
                            <button
                                type="button"
                                onClick={() => go(section.id)}
                                aria-current={active === section.id ? 'page' : undefined}
                                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                                    active === section.id ? 'bg-violet-600 text-white' : 'hover:bg-slate-800'
                                }`}
                            >
                                <Icon size={18} /> {section.label}
                            </button>
                        </li>
                    );
                })}
            </ul>
            <div className="space-y-1 border-t border-slate-800 p-3">
                <Link to="/" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-slate-800">
                    <ExternalLink size={18} /> View site
                </Link>
                {!localMode && (
                    <button type="button" onClick={logout} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-slate-800">
                        <LogOut size={18} /> Sign out
                    </button>
                )}
            </div>
        </nav>
    );

    return (
        <div className="min-h-screen bg-slate-100">
            <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 lg:block">{sidebar}</aside>

            <div className="sticky top-0 z-40 flex items-center justify-between bg-slate-900 px-4 py-3 text-white lg:hidden">
                <span className="text-sm font-semibold">Portfolio CMS</span>
                <button type="button" onClick={() => setMenuOpen((o) => !o)} aria-label="Toggle menu" aria-expanded={menuOpen}>
                    {menuOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
            </div>
            {menuOpen && <div className="fixed inset-x-0 bottom-0 top-[48px] z-40 lg:hidden">{sidebar}</div>}

            <main className="lg:pl-64">
                {localMode && (
                    <div className="bg-amber-100 px-4 py-2 text-center text-sm text-amber-900">
                        Supabase is not configured: changes are saved in this browser only and will not appear for visitors.
                    </div>
                )}
                <div className="mx-auto max-w-3xl px-4 py-8">
                    <Editor key={active} />
                </div>
            </main>
        </div>
    );
};

export default AdminApp;
