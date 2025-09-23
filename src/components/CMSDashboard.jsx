import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getPortfolioData, savePortfolioData, resetPortfolioData } from '../utils/dataManager';
import { Download, Upload, RefreshCw, Save, Database, BarChart3, FileText, Image, Settings } from 'lucide-react';
import toast from 'react-hot-toast';

const CMSDashboard = ({ isOpen, onClose }) => {
    const [portfolioData, setPortfolioData] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [exportData, setExportData] = useState('');
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (isOpen && isAuthenticated) {
            const data = getPortfolioData();
            setPortfolioData(data);
            setExportData(JSON.stringify(data, null, 2));
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
        reader.onload = (e) => {
            try {
                const importedData = JSON.parse(e.target.result);
                savePortfolioData(importedData);
                setPortfolioData(importedData);
                toast.success('Portfolio data imported successfully!');
                window.location.reload(); // Refresh to show new data
            } catch (error) {
                toast.error('Invalid JSON file. Please check the format.');
            }
        };
        reader.readAsText(file);
    };

    const handleResetData = () => {
        if (window.confirm('Are you sure? This will reset all your portfolio data to defaults.')) {
            const defaultData = resetPortfolioData();
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
                ...(portfolioData.projects?.map(p => p.image) || []),
                ...(portfolioData.certificates?.map(c => c.image) || [])
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-violet-600 to-purple-600 text-white p-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-bold">Portfolio CMS Dashboard</h2>
                            <p className="text-violet-100">Manage your portfolio content and settings</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-white hover:text-gray-200 text-2xl font-bold"
                        >
                            ×
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200">
                    <div className="flex space-x-0">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center space-x-2 px-6 py-3 border-b-2 transition-colors ${
                                        activeTab === tab.id
                                            ? 'border-violet-500 text-violet-600 bg-violet-50'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                    }`}
                                >
                                    <Icon size={20} />
                                    <span>{tab.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 max-h-[60vh] overflow-y-auto">
                    {activeTab === 'overview' && (
                        <div className="space-y-6">
                            <h3 className="text-xl font-bold text-gray-900">Portfolio Statistics</h3>
                            
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                <div className="bg-blue-50 p-4 rounded-lg text-center">
                                    <div className="text-2xl font-bold text-blue-600">{stats.skills}</div>
                                    <div className="text-sm text-blue-600">Skills</div>
                                </div>
                                <div className="bg-green-50 p-4 rounded-lg text-center">
                                    <div className="text-2xl font-bold text-green-600">{stats.projects}</div>
                                    <div className="text-sm text-green-600">Projects</div>
                                </div>
                                <div className="bg-purple-50 p-4 rounded-lg text-center">
                                    <div className="text-2xl font-bold text-purple-600">{stats.internships}</div>
                                    <div className="text-sm text-purple-600">Internships</div>
                                </div>
                                <div className="bg-yellow-50 p-4 rounded-lg text-center">
                                    <div className="text-2xl font-bold text-yellow-600">{stats.certificates}</div>
                                    <div className="text-sm text-yellow-600">Certificates</div>
                                </div>
                                <div className="bg-red-50 p-4 rounded-lg text-center">
                                    <div className="text-2xl font-bold text-red-600">{stats.totalImages}</div>
                                    <div className="text-sm text-red-600">Images</div>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="font-semibold text-gray-900 mb-2">Quick Actions</h4>
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        onClick={handleExportData}
                                        className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                                    >
                                        <Download size={16} />
                                        <span>Export Data</span>
                                    </button>
                                    <label className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded cursor-pointer">
                                        <Upload size={16} />
                                        <span>Import Data</span>
                                        <input
                                            type="file"
                                            accept=".json"
                                            onChange={handleImportData}
                                            className="hidden"
                                        />
                                    </label>
                                    <button
                                        onClick={handleResetData}
                                        className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                                    >
                                        <RefreshCw size={16} />
                                        <span>Reset to Defaults</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'data' && (
                        <div className="space-y-4">
                            <h3 className="text-xl font-bold text-gray-900">Raw Data Editor</h3>
                            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                                <p className="text-yellow-800 text-sm">
                                    ⚠️ Advanced users only! Direct editing of JSON data. Make sure to validate your JSON before saving.
                                </p>
                            </div>
                            <textarea
                                value={exportData}
                                onChange={(e) => setExportData(e.target.value)}
                                className="w-full h-64 p-3 border border-gray-300 rounded font-mono text-sm"
                                placeholder="Portfolio JSON data will appear here..."
                            />
                            <button
                                onClick={() => {
                                    try {
                                        const parsedData = JSON.parse(exportData);
                                        savePortfolioData(parsedData);
                                        setPortfolioData(parsedData);
                                        toast.success('Data updated successfully!');
                                        window.location.reload();
                                    } catch (error) {
                                        toast.error('Invalid JSON format!');
                                    }
                                }}
                                className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                            >
                                <Save size={16} />
                                <span>Save Changes</span>
                            </button>
                        </div>
                    )}

                    {activeTab === 'export' && (
                        <div className="space-y-6">
                            <h3 className="text-xl font-bold text-gray-900">Import & Export</h3>
                            
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="border border-gray-200 p-4 rounded-lg">
                                    <h4 className="font-semibold text-gray-900 mb-3">Export Portfolio Data</h4>
                                    <p className="text-gray-600 text-sm mb-4">
                                        Download your portfolio data as a JSON file for backup or transfer.
                                    </p>
                                    <button
                                        onClick={handleExportData}
                                        className="w-full flex items-center justify-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                                    >
                                        <Download size={16} />
                                        <span>Export Data</span>
                                    </button>
                                </div>

                                <div className="border border-gray-200 p-4 rounded-lg">
                                    <h4 className="font-semibold text-gray-900 mb-3">Import Portfolio Data</h4>
                                    <p className="text-gray-600 text-sm mb-4">
                                        Upload a JSON file to replace your current portfolio data.
                                    </p>
                                    <label className="w-full flex items-center justify-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded cursor-pointer">
                                        <Upload size={16} />
                                        <span>Import Data</span>
                                        <input
                                            type="file"
                                            accept=".json"
                                            onChange={handleImportData}
                                            className="hidden"
                                        />
                                    </label>
                                </div>
                            </div>

                            <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                                <h4 className="font-semibold text-red-800 mb-2">Reset to Defaults</h4>
                                <p className="text-red-700 text-sm mb-3">
                                    This will permanently delete all your current data and restore the original portfolio content.
                                </p>
                                <button
                                    onClick={handleResetData}
                                    className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                                >
                                    <RefreshCw size={16} />
                                    <span>Reset to Defaults</span>
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'settings' && (
                        <div className="space-y-6">
                            <h3 className="text-xl font-bold text-gray-900">CMS Settings</h3>
                            
                            <div className="space-y-4">
                                <div className="border border-gray-200 p-4 rounded-lg">
                                    <h4 className="font-semibold text-gray-900 mb-2">Storage Information</h4>
                                    <p className="text-gray-600 text-sm mb-2">
                                        Data is currently stored in your browser's localStorage.
                                    </p>
                                    <p className="text-gray-500 text-xs">
                                        Data size: ~{new TextEncoder().encode(JSON.stringify(portfolioData)).length} bytes
                                    </p>
                                </div>

                                <div className="border border-gray-200 p-4 rounded-lg">
                                    <h4 className="font-semibold text-gray-900 mb-2">Admin Credentials</h4>
                                    <p className="text-gray-600 text-sm">
                                        Email: admin@portfolio.com<br/>
                                        Password: admin123
                                    </p>
                                </div>

                                <div className="border border-gray-200 p-4 rounded-lg">
                                    <h4 className="font-semibold text-gray-900 mb-2">CMS Features</h4>
                                    <ul className="text-gray-600 text-sm space-y-1">
                                        <li>✅ Real-time content editing</li>
                                        <li>✅ Image upload and management</li>
                                        <li>✅ Data import/export</li>
                                        <li>✅ Responsive design</li>
                                        <li>✅ Auto-save functionality</li>
                                        <li>✅ Guest-friendly display</li>
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