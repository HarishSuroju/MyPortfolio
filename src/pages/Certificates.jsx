import React, { useState, useEffect } from 'react';
import { getPortfolioData, updatePortfolioSection, handleImageUpload, validateImageFile, resetCertificates } from '../utils/dataManager';
import { useAuth } from '../contexts/AuthContext';
import { Plus, X, Edit, Save, Award, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

const Certificates = () => {
    const [certificatesData, setCertificatesData] = useState([]);
    const [isAddingCertificate, setIsAddingCertificate] = useState(false);
    const [selectedCertificate, setSelectedCertificate] = useState(null);
    const [newCertificate, setNewCertificate] = useState({
        title: '',
        issuer: '',
        date: '',
        image: '',
        description: '',
        credentialUrl: ''
    });
    const [editIndex, setEditIndex] = useState(null);
    const [editCertificate, setEditCertificate] = useState({ title: '', issuer: '', date: '', image: '', description: '', credentialUrl: '' });
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        const loadData = async () => {
            const data = await getPortfolioData();
            setCertificatesData(data.certificates || []);
        };
        loadData();
    }, []);

    const updateCertificatesData = async (updatedCertificates) => {
        setCertificatesData(updatedCertificates);
        await updatePortfolioSection('certificates', updatedCertificates);
    };

    const resetToAllCertificates = async () => {
        const updatedData = await resetCertificates();
        setCertificatesData(updatedData.certificates);
        toast.success('All certificates restored!');
    };

    const addCertificate = () => {
        if (newCertificate.title.trim() && newCertificate.issuer.trim()) {
            const certificate = {
                ...newCertificate,
                id: Date.now()
            };
            const updatedCertificates = [...certificatesData, certificate];
            updateCertificatesData(updatedCertificates);
            setNewCertificate({
                title: '',
                issuer: '',
                date: '',
                image: '',
                description: '',
                credentialUrl: ''
            });
            setIsAddingCertificate(false);
            toast.success('Certificate added successfully!');
        } else {
            toast.error('Please fill in title and issuer');
        }
    };

    const removeCertificate = (index) => {
        const updatedCertificates = certificatesData.filter((_, i) => i !== index);
        updateCertificatesData(updatedCertificates);
        toast.success('Certificate removed successfully!');
    };

    const updateCertificate = (index, updatedCertificate) => {
        const updatedCertificates = [...certificatesData];
        updatedCertificates[index] = updatedCertificate;
        updateCertificatesData(updatedCertificates);
        toast.success('Certificate updated successfully!');
    };

    const handleImageChange = async (file, setImageFunction) => {
        if (!file) return;
        try {
            validateImageFile(file);
            const imageDataUrl = await handleImageUpload(file);
            setImageFunction(imageDataUrl);
        } catch (error) {
            toast.error(error.message);
        }
    };

    const startEditCertificate = (index) => {
        setEditIndex(index);
        setEditCertificate({ ...certificatesData[index] });
    };

    const cancelEditCertificate = () => {
        setEditIndex(null);
        setEditCertificate({ title: '', issuer: '', date: '', image: '', description: '', credentialUrl: '' });
    };

    const saveEditCertificate = () => {
        if (editCertificate.title.trim() && editCertificate.issuer.trim()) {
            const updatedCertificates = [...certificatesData];
            updatedCertificates[editIndex] = { ...editCertificate };
            updateCertificatesData(updatedCertificates);
            setEditIndex(null);
            setEditCertificate({ title: '', issuer: '', date: '', image: '', description: '', credentialUrl: '' });
            toast.success('Certificate updated successfully!');
        } else {
            toast.error('Please fill in title and issuer');
        }
    };

    return (
        <section id="certificates" className="section py-20 px-6" style={{ background: 'var(--space-bg)' }}>
            <div className="container mx-auto">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-12">
                    <div>
                        <h2 className="text-3xl font-bold cosmic-text">Space Badges</h2>
                        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)', letterSpacing: '0.1em' }}>— CERTIFICATES —</p>
                    </div>
                    <div className="flex space-x-2 self-center sm:self-auto">
                        {isAuthenticated && (
                            <>
                                <button onClick={resetToAllCertificates}
                                    className="px-4 py-2 rounded text-sm transition-all"
                                    style={{ background: 'rgba(96,165,250,0.1)', border: '1px solid rgba(96,165,250,0.3)', color: 'var(--neon-blue)' }}
                                    title="Restore All Certificates">Reset All</button>
                                <button onClick={() => setIsAddingCertificate(true)}
                                    className="p-2 rounded-full transition-all"
                                    style={{ background: 'rgba(167,139,250,0.15)', border: '1px solid rgba(167,139,250,0.4)', color: 'var(--neon-purple)' }}
                                    title="Add Certificate"><Plus size={20} /></button>
                            </>
                        )}
                    </div>
                </div>

                {isAddingCertificate && (
                    <div className="mb-8 p-6 space-card rounded-lg shadow-lg">
                        <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--neon-purple)' }}>🏅 Claim New Badge</h3>
                        <div className="space-y-4">
                            <input type="text" placeholder="Certificate title" value={newCertificate.title}
                                onChange={(e) => setNewCertificate({ ...newCertificate, title: e.target.value })}
                                className="w-full p-2 rounded text-sm"
                                style={{ background: 'rgba(167,139,250,0.08)', border: '1px solid rgba(167,139,250,0.3)', color: 'var(--text-primary)' }}
                            />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input type="text" placeholder="Issuing organization" value={newCertificate.issuer}
                                    onChange={(e) => setNewCertificate({ ...newCertificate, issuer: e.target.value })}
                                    className="p-2 rounded text-sm"
                                    style={{ background: 'rgba(167,139,250,0.08)', border: '1px solid rgba(167,139,250,0.3)', color: 'var(--text-primary)' }}
                                />
                                <input type="text" placeholder="Date (e.g., 2023)" value={newCertificate.date}
                                    onChange={(e) => setNewCertificate({ ...newCertificate, date: e.target.value })}
                                    className="p-2 rounded text-sm"
                                    style={{ background: 'rgba(167,139,250,0.08)', border: '1px solid rgba(167,139,250,0.3)', color: 'var(--text-primary)' }}
                                />
                            </div>
                            <textarea placeholder="Description" value={newCertificate.description}
                                onChange={(e) => setNewCertificate({ ...newCertificate, description: e.target.value })}
                                rows={3} className="w-full p-2 rounded resize-none text-sm"
                                style={{ background: 'rgba(167,139,250,0.08)', border: '1px solid rgba(167,139,250,0.3)', color: 'var(--text-primary)' }}
                            />
                            <div>
                                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Certificate Image</label>
                                <input type="file" accept="image/*"
                                    onChange={(e) => handleImageChange(e.target.files[0], (img) => setNewCertificate({ ...newCertificate, image: img }))}
                                    className="w-full p-2 rounded text-sm"
                                    style={{ background: 'rgba(167,139,250,0.05)', border: '1px solid rgba(167,139,250,0.2)', color: 'var(--text-secondary)' }}
                                />
                                {newCertificate.image && <img src={newCertificate.image} alt="Preview" className="mt-2 w-32 h-20 object-cover rounded" style={{ border: '1px solid rgba(167,139,250,0.3)' }} />}
                            </div>
                            <input type="url" placeholder="Credential URL (optional)" value={newCertificate.credentialUrl}
                                onChange={(e) => setNewCertificate({ ...newCertificate, credentialUrl: e.target.value })}
                                className="w-full p-2 rounded text-sm"
                                style={{ background: 'rgba(167,139,250,0.08)', border: '1px solid rgba(167,139,250,0.3)', color: 'var(--text-primary)' }}
                            />
                        </div>
                        <div className="flex space-x-2 mt-4">
                            <button onClick={addCertificate} className="px-4 py-2 rounded text-sm"
                                style={{ background: 'rgba(52,211,153,0.15)', border: '1px solid rgba(52,211,153,0.4)', color: 'var(--neon-green)' }}>Claim Badge</button>
                            <button onClick={() => setIsAddingCertificate(false)} className="px-4 py-2 rounded text-sm"
                                style={{ background: 'rgba(148,163,184,0.1)', border: '1px solid rgba(148,163,184,0.25)', color: 'var(--text-secondary)' }}>Cancel</button>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {certificatesData.map((certificate, index) => (
                        <div key={certificate.id || index}
                            className="space-card rounded-xl p-4 relative group transition-all duration-300"
                            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 25px rgba(167,139,250,0.2)'}
                            onMouseLeave={e => e.currentTarget.style.boxShadow = ''}
                        >
                            {isAuthenticated && editIndex !== index && (
                                <div className="absolute top-2 right-2 flex space-x-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity z-10">
                                    <button onClick={() => removeCertificate(index)} className="p-1 rounded" title="Remove certificate"
                                        style={{ background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.4)', color: '#f87171' }}><X size={14} /></button>
                                    <button onClick={() => startEditCertificate(index)} className="p-1 rounded" title="Edit certificate"
                                        style={{ background: 'rgba(96,165,250,0.2)', border: '1px solid rgba(96,165,250,0.4)', color: 'var(--neon-blue)' }}><Edit size={14} /></button>
                                </div>
                            )}
                            {editIndex === index ? (
                                <div>
                                    <input type="text" placeholder="Certificate title" value={editCertificate.title}
                                        onChange={e => setEditCertificate({ ...editCertificate, title: e.target.value })}
                                        className="w-full p-2 rounded mb-2 text-sm"
                                        style={{ background: 'rgba(167,139,250,0.08)', border: '1px solid rgba(167,139,250,0.3)', color: 'var(--text-primary)' }}
                                    />
                                    <input type="text" placeholder="Issuing organization" value={editCertificate.issuer}
                                        onChange={e => setEditCertificate({ ...editCertificate, issuer: e.target.value })}
                                        className="w-full p-2 rounded mb-2 text-sm"
                                        style={{ background: 'rgba(167,139,250,0.08)', border: '1px solid rgba(167,139,250,0.3)', color: 'var(--text-primary)' }}
                                    />
                                    <input type="text" placeholder="Date (e.g., 2023)" value={editCertificate.date}
                                        onChange={e => setEditCertificate({ ...editCertificate, date: e.target.value })}
                                        className="w-full p-2 rounded mb-2 text-sm"
                                        style={{ background: 'rgba(167,139,250,0.08)', border: '1px solid rgba(167,139,250,0.3)', color: 'var(--text-primary)' }}
                                    />
                                    <textarea placeholder="Description" value={editCertificate.description}
                                        onChange={e => setEditCertificate({ ...editCertificate, description: e.target.value })}
                                        rows={3} className="w-full p-2 rounded mb-2 resize-none text-sm"
                                        style={{ background: 'rgba(167,139,250,0.08)', border: '1px solid rgba(167,139,250,0.3)', color: 'var(--text-primary)' }}
                                    />
                                    <div className="mb-2">
                                        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Certificate Image</label>
                                        <input type="file" accept="image/*"
                                            onChange={e => { const f = e.target.files[0]; if (f) { const r = new FileReader(); r.onload = ev => setEditCertificate(cert => ({ ...cert, image: ev.target.result })); r.readAsDataURL(f); } }}
                                            className="w-full p-2 rounded text-sm"
                                            style={{ background: 'rgba(167,139,250,0.05)', border: '1px solid rgba(167,139,250,0.2)', color: 'var(--text-secondary)' }}
                                        />
                                        {editCertificate.image && <img src={editCertificate.image} alt="Preview" className="mt-2 w-32 h-20 object-cover rounded" />}
                                    </div>
                                    <input type="url" placeholder="Credential URL (optional)" value={editCertificate.credentialUrl}
                                        onChange={e => setEditCertificate({ ...editCertificate, credentialUrl: e.target.value })}
                                        className="w-full p-2 rounded mb-2 text-sm"
                                        style={{ background: 'rgba(167,139,250,0.08)', border: '1px solid rgba(167,139,250,0.3)', color: 'var(--text-primary)' }}
                                    />
                                    <div className="flex space-x-2">
                                        <button onClick={saveEditCertificate} className="px-3 py-1 rounded text-xs"
                                            style={{ background: 'rgba(52,211,153,0.15)', border: '1px solid rgba(52,211,153,0.4)', color: 'var(--neon-green)' }}>Save</button>
                                        <button onClick={cancelEditCertificate} className="px-3 py-1 rounded text-xs"
                                            style={{ background: 'rgba(148,163,184,0.1)', border: '1px solid rgba(148,163,184,0.25)', color: 'var(--text-secondary)' }}>Cancel</button>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    {certificate.image ? (
                                        <img src={certificate.image} alt={certificate.title}
                                            className="w-full h-36 object-cover rounded-lg cursor-pointer transition-all duration-300 hover:opacity-90"
                                            style={{ border: '1px solid rgba(167,139,250,0.2)' }}
                                            onClick={() => setSelectedCertificate(certificate)}
                                        />
                                    ) : (
                                        <div className="w-full h-36 rounded-lg flex items-center justify-center" style={{ background: 'rgba(167,139,250,0.08)', border: '1px solid rgba(167,139,250,0.2)' }}>
                                            <Award size={36} style={{ color: 'var(--neon-purple)', opacity: 0.5 }} />
                                        </div>
                                    )}
                                    <h3 className="text-base font-bold mb-1 mt-3" style={{ color: 'var(--text-primary)' }}>🏅 {certificate.title}</h3>
                                    <p className="text-xs mb-1" style={{ color: 'var(--neon-cyan)' }}>Issued by {certificate.issuer}</p>
                                    {certificate.date && <p className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>{certificate.date}</p>}
                                    {certificate.description && <p className="text-xs mb-3 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>{certificate.description}</p>}
                                    <div className="flex space-x-2">
                                        <button onClick={() => setSelectedCertificate(certificate)}
                                            className="inline-flex items-center text-sm font-semibold" style={{ color: 'var(--neon-purple)' }}>
                                            <Eye size={14} className="mr-1" />View
                                        </button>
                                        {certificate.credentialUrl && (
                                            <a href={certificate.credentialUrl} target="_blank" rel="noopener noreferrer"
                                                className="inline-flex items-center text-sm font-semibold" style={{ color: 'var(--neon-blue)' }}>
                                                <Award size={14} className="mr-1" />Verify
                                            </a>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {certificatesData.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>🌌 No badges earned yet.</p>
                        {isAuthenticated && (
                            <button onClick={() => setIsAddingCertificate(true)}
                                className="mt-4 px-6 py-2 rounded-lg text-sm"
                                style={{ background: 'rgba(167,139,250,0.15)', border: '1px solid rgba(167,139,250,0.4)', color: 'var(--neon-purple)' }}>
                                Claim Your First Badge
                            </button>
                        )}
                    </div>
                )}

                {/* Modal for viewing certificate */}
                {selectedCertificate && (
                    <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ background: 'rgba(5,5,16,0.92)', backdropFilter: 'blur(8px)' }}>
                        <div className="rounded-lg max-w-4xl max-h-[90vh] overflow-auto relative w-full"
                            style={{ background: 'var(--space-deep)', border: '1px solid rgba(167,139,250,0.3)', boxShadow: '0 0 40px rgba(167,139,250,0.2)' }}>
                            <div className="sticky top-0 p-4 flex justify-between items-center" style={{ background: 'rgba(10,10,46,0.95)', borderBottom: '1px solid rgba(167,139,250,0.2)' }}>
                                <div>
                                    <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{selectedCertificate.title}</h3>
                                    <p style={{ color: 'var(--neon-cyan)', fontSize: '0.9rem' }}>Issued by {selectedCertificate.issuer}</p>
                                    {selectedCertificate.date && <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{selectedCertificate.date}</p>}
                                </div>
                                <button onClick={() => setSelectedCertificate(null)} className="text-2xl font-bold transition-all"
                                    style={{ color: 'var(--text-secondary)' }}
                                    onMouseEnter={e => e.target.style.color = 'var(--neon-pink)'}
                                    onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}
                                >✕</button>
                            </div>
                            <div className="p-4">
                                {selectedCertificate.image
                                    ? <img src={selectedCertificate.image} alt={selectedCertificate.title} className="w-full h-auto rounded" />
                                    : <div className="w-full h-64 flex items-center justify-center" style={{ background: 'rgba(167,139,250,0.05)' }}><Award size={64} style={{ color: 'var(--neon-purple)', opacity: 0.4 }} /></div>
                                }
                                {selectedCertificate.description && (
                                    <p className="mt-4" style={{ color: 'var(--text-secondary)' }}>{selectedCertificate.description}</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Certificates;
