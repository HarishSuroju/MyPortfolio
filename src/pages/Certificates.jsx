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

    return (
        <section id="certificates" className="section py-20 px-6 bg-gray-100">
            <div className="container mx-auto">
                <div className="flex justify-between items-center mb-12">
                    <h2 className="text-3xl font-bold text-center flex-1">Certificates</h2>
                    <div className="flex space-x-2">
                        {isAuthenticated && (
                            <>
                                <button
                                    onClick={resetToAllCertificates}
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                                    title="Restore All Certificates"
                                >
                                    Reset All
                                </button>
                                <button
                                    onClick={() => setIsAddingCertificate(true)}
                                    className="bg-violet-500 hover:bg-violet-600 text-white p-2 rounded-full"
                                    title="Add Certificate"
                                >
                                    <Plus size={20} />
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {isAddingCertificate && (
                    <div className="mb-8 p-6 bg-white border-2 border-violet-200 rounded-lg shadow-lg">
                        <h3 className="text-lg font-semibold mb-4">Add New Certificate</h3>
                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="Certificate title"
                                value={newCertificate.title}
                                onChange={(e) => setNewCertificate({ ...newCertificate, title: e.target.value })}
                                className="w-full p-2 border border-gray-300 rounded"
                            />
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    placeholder="Issuing organization"
                                    value={newCertificate.issuer}
                                    onChange={(e) => setNewCertificate({ ...newCertificate, issuer: e.target.value })}
                                    className="p-2 border border-gray-300 rounded"
                                />
                                <input
                                    type="text"
                                    placeholder="Date (e.g., 2023)"
                                    value={newCertificate.date}
                                    onChange={(e) => setNewCertificate({ ...newCertificate, date: e.target.value })}
                                    className="p-2 border border-gray-300 rounded"
                                />
                            </div>
                            
                            <textarea
                                placeholder="Description"
                                value={newCertificate.description}
                                onChange={(e) => setNewCertificate({ ...newCertificate, description: e.target.value })}
                                rows={3}
                                className="w-full p-2 border border-gray-300 rounded resize-none"
                            />
                            
                            <div>
                                <label className="block text-sm font-medium mb-2">Certificate Image</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleImageChange(e.target.files[0], (img) => setNewCertificate({ ...newCertificate, image: img }))}
                                    className="w-full p-2 border border-gray-300 rounded"
                                />
                                {newCertificate.image && (
                                    <img src={newCertificate.image} alt="Preview" className="mt-2 w-32 h-20 object-cover rounded" />
                                )}
                            </div>
                            
                            <input
                                type="url"
                                placeholder="Credential URL (optional)"
                                value={newCertificate.credentialUrl}
                                onChange={(e) => setNewCertificate({ ...newCertificate, credentialUrl: e.target.value })}
                                className="w-full p-2 border border-gray-300 rounded"
                            />
                        </div>
                        
                        <div className="flex space-x-2 mt-4">
                            <button
                                onClick={addCertificate}
                                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                            >
                                Add Certificate
                            </button>
                            <button
                                onClick={() => setIsAddingCertificate(false)}
                                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {certificatesData.map((certificate, index) => (
                        <div key={certificate.id || index} className="bg-white rounded-xl shadow-lg p-4 transform transition-transform hover:scale-105 relative group">
                            {isAuthenticated && (
                                <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                    <button
                                        onClick={() => removeCertificate(index)}
                                        className="bg-red-500 hover:bg-red-600 text-white p-1 rounded"
                                        title="Remove certificate"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            )}
                            
                            <div className="mb-4">
                                {certificate.image ? (
                                    <img 
                                        src={certificate.image} 
                                        alt={certificate.title} 
                                        className="w-full h-36 object-cover rounded-lg cursor-pointer transition-all duration-300 hover:scale-105 hover:opacity-90"
                                        onClick={() => setSelectedCertificate(certificate)}
                                    />
                                ) : (
                                    <div className="w-full h-36 bg-gray-200 rounded-lg flex items-center justify-center">
                                        <Award size={36} className="text-gray-400" />
                                    </div>
                                )}
                            </div>
                            
                            <h3 className="text-lg font-bold mb-1">{certificate.title}</h3>
                            <p className="text-gray-700 text-sm mb-1">Issued by {certificate.issuer}</p>
                            {certificate.date && (
                                <p className="text-gray-600 text-xs mb-2">{certificate.date}</p>
                            )}
                            {certificate.description && (
                                <p className="text-gray-600 text-xs mb-3 line-clamp-2">{certificate.description}</p>
                            )}
                            
                            <div className="flex space-x-2">
                                <button 
                                    onClick={() => setSelectedCertificate(certificate)}
                                    className="inline-flex items-center text-violet-600 hover:text-violet-700 text-sm font-semibold"
                                >
                                    <Eye size={14} className="mr-1" />
                                    View
                                </button>
                                {certificate.credentialUrl && (
                                    <a
                                        href={certificate.credentialUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm font-semibold"
                                    >
                                        <Award size={14} className="mr-1" />
                                        Verify
                                    </a>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {certificatesData.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No certificates added yet.</p>
                        {isAuthenticated && (
                            <button
                                onClick={() => setIsAddingCertificate(true)}
                                className="mt-4 bg-violet-500 hover:bg-violet-600 text-white px-6 py-2 rounded-lg"
                            >
                                Add Your First Certificate
                            </button>
                        )}
                    </div>
                )}

                {/* Modal for viewing certificate */}
                {selectedCertificate && (
                    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-auto relative">
                            <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
                                <div>
                                    <h3 className="text-xl font-bold">{selectedCertificate.title}</h3>
                                    <p className="text-gray-600">Issued by {selectedCertificate.issuer}</p>
                                    {selectedCertificate.date && (
                                        <p className="text-gray-500 text-sm">{selectedCertificate.date}</p>
                                    )}
                                </div>
                                <button
                                    onClick={() => setSelectedCertificate(null)}
                                    className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                                >
                                    ×
                                </button>
                            </div>
                            <div className="p-4">
                                {selectedCertificate.image ? (
                                    <img 
                                        src={selectedCertificate.image} 
                                        alt={selectedCertificate.title}
                                        className="w-full h-auto"
                                    />
                                ) : (
                                    <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                                        <Award size={64} className="text-gray-400" />
                                    </div>
                                )}
                                {selectedCertificate.description && (
                                    <p className="mt-4 text-gray-700">{selectedCertificate.description}</p>
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