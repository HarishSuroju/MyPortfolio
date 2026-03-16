import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getPortfolioData, savePortfolioData, resetPortfolioData, initializeDatabase } from '../utils/dataManager';
import { supabase } from '../lib/supabase';
import { Download, Upload, RefreshCw, Save, Database, BarChart3, FileText, Settings } from 'lucide-react';
import toast from 'react-hot-toast';

const CMSDashboard = ({ isOpen, onClose }) => {
    const [portfolioData, setPortfolioData] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [exportData, setExportData] = useState('');
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (isOpen && isAuthenticated) {
            const loadData = async () => {
                const data = await getPortfolioData();
                setPortfolioData(data);
                setExportData(JSON.stringify(data, null, 2));
            };
            loadData();
        }
    }, [isOpen, isAuthenticated]);

    if (!isOpen || !isAuthenticated) return null;

    const handleExportData = () => {
        const dataStr = JSON.stringify(portfolioData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `portfolio-data-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
        toast.success('Portfolio data exported successfully!');
    };

    const handleImportData = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const importedData = JSON.parse(e.target.result);
                await savePortfolioData(importedData);
                setPortfolioData(importedData);
                toast.success('Portfolio data imported successfully!');
                window.location.reload();
            } catch {
                toast.error('Invalid JSON file. Please check the format.');
            }
        };
        reader.readAsText(file);
    };

    const handleResetData = async () => {
        if (window.confirm('Are you sure? This will reset all your portfolio data to defaults.')) {
            const defaultData = await resetPortfolioData();
            setPortfolioData(defaultData);
            toast.success('Portfolio data reset to defaults!');
            window.location.reload();
        }
    };

    const getDataStats = () => {
        if (!portfolioData) return {};
        return {
            skills: portfolioData.skills?.length || 0,
            projects: portfolioData.projects?.length || 0,
            internships: portfolioData.internships?.length || 0,
            certificates: portfolioData.certificates?.length || 0,
            totalImages: [
                portfolioData.hero?.profileImage,
                portfolioData.hero?.backgroundImage,
                portfolioData.about?.profileImage,
                ...(portfolioData.projects?.map((p) => p.image) || []),
                ...(portfolioData.certificates?.map((c) => c.image) || [])
            ].filter(Boolean).length
        };
    };

    const stats = getDataStats();

    const tabs = [
        { id: 'overview', label: 'Overview', icon: BarChart3 },
        { id: 'data', label: 'Data Manager', icon: Database },
        { id: 'export', label: 'Import/Export', icon: FileText },
        { id: 'settings', label: 'Settings', icon: Settings }
    ];

    return (
        <div className="fixed inset-0 flex items-start sm:items-center justify-center z-50 p-0 sm:p-4" style={{ background: 'rgba(5,5,16,0.9)', backdropFilter: 'blur(8px)' }}>
            <div className="w-full h-full sm:h-auto sm:rounded-lg sm:max-w-4xl sm:max-h-[90vh] overflow-hidden flex flex-col"
                style={{ background: 'var(--space-deep)', border: '1px solid rgba(96,165,250,0.25)', boxShadow: '0 0 50px rgba(96,165,250,0.1)' }}>
                <div className="p-4 sm:p-6" style={{ background: 'linear-gradient(135deg, rgba(96,165,250,0.2), rgba(167,139,250,0.15))', borderBottom: '1px solid rgba(96,165,250,0.2)' }}>
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h2 className="text-xl sm:text-2xl font-bold cosmic-text">⚙️ CMS Command Center</h2>
                            <p className="text-sm sm:text-base" style={{ color: 'var(--text-secondary)' }}>Manage your portfolio content and settings</p>
                        </div>
                        <button onClick={onClose}
                            className="text-xl sm:text-2xl font-bold leading-none transition-all"
                            style={{ color: 'var(--text-secondary)' }}
                            onMouseEnter={e => e.currentTarget.style.color = 'var(--neon-pink)'}
                            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
                            aria-label="Close dashboard">✕</button>
                    </div>
                </div>

                <div className="overflow-x-auto" style={{ borderBottom: '1px solid rgba(96,165,250,0.15)' }}>
                    <div className="flex min-w-max">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                                    className="flex items-center space-x-2 px-4 sm:px-6 py-3 border-b-2 transition-all whitespace-nowrap"
                                    style={activeTab === tab.id
                                        ? { borderColor: 'var(--neon-blue)', color: 'var(--neon-blue)', background: 'rgba(96,165,250,0.08)' }
                                        : { borderColor: 'transparent', color: 'var(--text-secondary)', background: 'transparent' }
                                    }
                                >
                                    <Icon size={18} />
                                    <span className="text-sm sm:text-base">{tab.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="p-4 sm:p-6 overflow-y-auto">
                    {activeTab === 'overview' && (
                        <div className="space-y-6">
                            <h3 className="text-lg sm:text-xl font-bold cosmic-text">Portfolio Statistics</h3>

                            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
                                <div className="space-card p-4 rounded-lg text-center">
                                    <div className="text-2xl font-bold" style={{ color: 'var(--neon-blue)' }}>{stats.skills}</div>
                                    <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Skills</div>
                                </div>
                                <div className="space-card p-4 rounded-lg text-center">
                                    <div className="text-2xl font-bold" style={{ color: 'var(--neon-green)' }}>{stats.projects}</div>
                                    <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Projects</div>
                                </div>
                                <div className="space-card p-4 rounded-lg text-center">
                                    <div className="text-2xl font-bold" style={{ color: 'var(--neon-purple)' }}>{stats.internships}</div>
                                    <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Internships</div>
                                </div>
                                <div className="space-card p-4 rounded-lg text-center">
                                    <div className="text-2xl font-bold" style={{ color: '#fbbf24' }}>{stats.certificates}</div>
                                    <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Certificates</div>
                                </div>
                                <div className="space-card p-4 rounded-lg text-center col-span-2 lg:col-span-1">
                                    <div className="text-2xl font-bold" style={{ color: 'var(--neon-pink)' }}>{stats.totalImages}</div>
                                    <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Images</div>
                                </div>
                            </div>

                            <div className="space-card p-4 rounded-lg">
                                <h4 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Quick Actions</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                    <button onClick={handleExportData}
                                        className="flex items-center justify-center space-x-2 px-4 py-2 rounded transition-all"
                                        style={{ background: 'rgba(96,165,250,0.15)', border: '1px solid var(--neon-blue)', color: 'var(--neon-blue)' }}>
                                        <Download size={16} />
                                        <span>Export Data</span>
                                    </button>
                                    <label className="flex items-center justify-center space-x-2 px-4 py-2 rounded cursor-pointer transition-all"
                                        style={{ background: 'rgba(52,211,153,0.15)', border: '1px solid var(--neon-green)', color: 'var(--neon-green)' }}>
                                        <Upload size={16} />
                                        <span>Import Data</span>
                                        <input type="file" accept=".json" onChange={handleImportData} className="hidden" />
                                    </label>
                                    <button onClick={handleResetData}
                                        className="flex items-center justify-center space-x-2 px-4 py-2 rounded transition-all"
                                        style={{ background: 'rgba(248,113,113,0.15)', border: '1px solid var(--neon-pink)', color: 'var(--neon-pink)' }}>
                                        <RefreshCw size={16} />
                                        <span>Reset to Defaults</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'data' && (
                        <div className="space-y-4">
                            <h3 className="text-lg sm:text-xl font-bold cosmic-text">Raw Data Editor</h3>
                            <div className="p-4 rounded-lg" style={{ background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.3)' }}>
                                <p className="text-sm" style={{ color: '#fbbf24' }}>
                                    ⚠️ Advanced users only. Direct editing of JSON data. Make sure to validate your JSON before saving.
                                </p>
                            </div>
                            <textarea
                                value={exportData}
                                onChange={(e) => setExportData(e.target.value)}
                                className="w-full h-64 p-3 rounded font-mono text-sm"
                                style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(96,165,250,0.2)', color: 'var(--neon-green)', outline: 'none' }}
                                placeholder="Portfolio JSON data will appear here..."
                            />
                            <button
                                onClick={async () => {
                                    try {
                                        const parsedData = JSON.parse(exportData);
                                        await savePortfolioData(parsedData);
                                        setPortfolioData(parsedData);
                                        toast.success('Data updated successfully!');
                                        window.location.reload();
                                    } catch {
                                        toast.error('Invalid JSON format!');
                                    }
                                }}
                                className="flex items-center space-x-2 px-4 py-2 rounded transition-all"
                                style={{ background: 'rgba(52,211,153,0.15)', border: '1px solid var(--neon-green)', color: 'var(--neon-green)' }}
                            >
                                <Save size={16} />
                                <span>Save Changes</span>
                            </button>
                        </div>
                    )}

                    {activeTab === 'export' && (
                        <div className="space-y-6">
                            <h3 className="text-lg sm:text-xl font-bold cosmic-text">Import and Export</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-card p-4 rounded-lg">
                                    <h4 className="font-semibold mb-3" style={{ color: 'var(--neon-blue)' }}>Export Portfolio Data</h4>
                                    <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                                        Download your portfolio data as a JSON file for backup or transfer.
                                    </p>
                                    <button onClick={handleExportData}
                                        className="w-full flex items-center justify-center space-x-2 px-4 py-2 rounded transition-all"
                                        style={{ background: 'rgba(96,165,250,0.15)', border: '1px solid var(--neon-blue)', color: 'var(--neon-blue)' }}>
                                        <Download size={16} />
                                        <span>Export Data</span>
                                    </button>
                                </div>

                                <div className="space-card p-4 rounded-lg">
                                    <h4 className="font-semibold mb-3" style={{ color: 'var(--neon-green)' }}>Import Portfolio Data</h4>
                                    <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                                        Upload a JSON file to replace your current portfolio data.
                                    </p>
                                    <label className="w-full flex items-center justify-center space-x-2 px-4 py-2 rounded cursor-pointer transition-all"
                                        style={{ background: 'rgba(52,211,153,0.15)', border: '1px solid var(--neon-green)', color: 'var(--neon-green)' }}>
                                        <Upload size={16} />
                                        <span>Import Data</span>
                                        <input type="file" accept=".json" onChange={handleImportData} className="hidden" />
                                    </label>
                                </div>
                            </div>

                            <div className="p-4 rounded-lg" style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)' }}>
                                <h4 className="font-semibold mb-2" style={{ color: 'var(--neon-pink)' }}>⚠️ Reset to Defaults</h4>
                                <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
                                    This will permanently delete all your current data and restore the original portfolio content.
                                </p>
                                <button onClick={handleResetData}
                                    className="flex items-center space-x-2 px-4 py-2 rounded transition-all"
                                    style={{ background: 'rgba(248,113,113,0.15)', border: '1px solid var(--neon-pink)', color: 'var(--neon-pink)' }}>
                                    <RefreshCw size={16} />
                                    <span>Reset to Defaults</span>
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'settings' && (
                        <div className="space-y-6">
                            <h3 className="text-lg sm:text-xl font-bold cosmic-text">CMS Settings</h3>

                            <div className="space-y-4">
                                <div className="space-card p-4 rounded-lg">
                                    <h4 className="font-semibold mb-2" style={{ color: 'var(--neon-blue)' }}>🛰️ Database Status</h4>
                                    <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
                                        {supabase
                                            ? 'Supabase connected. Data is persisted in the database.'
                                            : 'Supabase not configured. Data is stored in browser localStorage only.'}
                                    </p>
                                    {supabase && (
                                        <button
                                            onClick={async () => {
                                                try {
                                                    await initializeDatabase();
                                                    toast.success('Database initialized with default data!');
                                                } catch (error) {
                                                    toast.error('Failed to initialize: ' + error.message);
                                                }
                                            }}
                                            className="flex items-center space-x-2 px-4 py-2 rounded mt-2 transition-all"
                                            style={{ background: 'rgba(52,211,153,0.15)', border: '1px solid var(--neon-green)', color: 'var(--neon-green)' }}
                                        >
                                            <Database size={16} />
                                            <span>Initialize Database with Defaults</span>
                                        </button>
                                    )}
                                </div>

                                <div className="space-card p-4 rounded-lg">
                                    <h4 className="font-semibold mb-2" style={{ color: 'var(--neon-purple)' }}>💾 Storage Information</h4>
                                    <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
                                        Local cache size: ~{new TextEncoder().encode(JSON.stringify(portfolioData)).length} bytes
                                    </p>
                                </div>

                                <div className="space-card p-4 rounded-lg">
                                    <h4 className="font-semibold mb-2" style={{ color: 'var(--neon-blue)' }}>✦ CMS Features</h4>
                                    <ul className="text-sm space-y-1" style={{ color: 'var(--text-secondary)' }}>
                                        <li>✦ Real-time content editing</li>
                                        <li>✦ Image upload and management</li>
                                        <li>✦ Data import/export</li>
                                        <li>✦ Responsive design</li>
                                        <li>✦ Auto-save functionality</li>
                                        <li>✦ Guest-friendly display</li>
                                        <li>✦ Supabase database persistence</li>
                                        <li>✦ Supabase authentication</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CMSDashboard;
