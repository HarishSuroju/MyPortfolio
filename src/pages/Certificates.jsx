import React, { useState } from 'react';
import adobeParticipation from '../assets/Adobe Participation img.png';
import dsaJavaNptel from '../assets/HArish DSA in Java by NPTEL.png';
import dbmsSqlOracle from '../assets/Harish DBMS SQL by ORACLE.png';
import pspCNptel from '../assets/Harish PSP using C by NPTEL.png';
import saylorCpp from '../assets/Saylor C++.png';
import tcsion from '../assets/tcsion.png';

const Certificates = () => {
    const [selectedCertificate, setSelectedCertificate] = useState(null);

    const openModal = (image, title, organization) => {
        setSelectedCertificate({ image, title, organization });
    };

    const closeModal = () => {
        setSelectedCertificate(null);
    };

    return (
        <section id="certificates" className="section py-20 px-6 bg-gray-100">
            <div className="container mx-auto">
                <h2 className="text-3xl font-bold text-center mb-12">Certificates</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div className="bg-white rounded-xl shadow-lg p-6 transform transition-transform hover:scale-105">
                        <div className="mb-4">
                            <img src={dsaJavaNptel} alt="Data Structures and Algorithms in Java Certificate" className="w-full h-48 object-cover rounded-lg" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Data Structures and Algorithms in Java</h3>
                        <p className="text-gray-700 mb-4">Issued by NPTEL</p>
                        <button 
                            onClick={() => openModal(dsaJavaNptel, 'Data Structures and Algorithms in Java', 'NPTEL')}
                            className="inline-block text-accent hover:text-accent-dark font-semibold cursor-pointer"
                        >
                            View Credential
                        </button>
                    </div>
                    <div className="bg-white rounded-xl shadow-lg p-6 transform transition-transform hover:scale-105">
                        <div className="mb-4">
                            <img src={dbmsSqlOracle} alt="Database Management System SQL Certificate" className="w-full h-48 object-cover rounded-lg" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Database Management System with SQL</h3>
                        <p className="text-gray-700 mb-4">Issued by Oracle</p>
                        <button 
                            onClick={() => openModal(dbmsSqlOracle, 'Database Management System with SQL', 'Oracle')}
                            className="inline-block text-accent hover:text-accent-dark font-semibold cursor-pointer"
                        >
                            View Credential
                        </button>
                    </div>
                    <div className="bg-white rounded-xl shadow-lg p-6 transform transition-transform hover:scale-105">
                        <div className="mb-4">
                            <img src={pspCNptel} alt="Problem Solving through Programming in C Certificate" className="w-full h-48 object-cover rounded-lg" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Problem Solving through Programming in C</h3>
                        <p className="text-gray-700 mb-4">Issued by NPTEL</p>
                        <button 
                            onClick={() => openModal(pspCNptel, 'Problem Solving through Programming in C', 'NPTEL')}
                            className="inline-block text-accent hover:text-accent-dark font-semibold cursor-pointer"
                        >
                            View Credential
                        </button>
                    </div>
                    <div className="bg-white rounded-xl shadow-lg p-6 transform transition-transform hover:scale-105">
                        <div className="mb-4">
                            <img src={saylorCpp} alt="C++ Programming Certificate" className="w-full h-48 object-cover rounded-lg" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">C++ Programming</h3>
                        <p className="text-gray-700 mb-4">Issued by Saylor Academy</p>
                        <button 
                            onClick={() => openModal(saylorCpp, 'C++ Programming', 'Saylor Academy')}
                            className="inline-block text-accent hover:text-accent-dark font-semibold cursor-pointer"
                        >
                            View Credential
                        </button>
                    </div>
                    <div className="bg-white rounded-xl shadow-lg p-6 transform transition-transform hover:scale-105">
                        <div className="mb-4">
                            <img src={adobeParticipation} alt="Adobe Participation Certificate" className="w-full h-48 object-cover rounded-lg" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Adobe Creative Workshop</h3>
                        <p className="text-gray-700 mb-4">Issued by Adobe</p>
                        <button 
                            onClick={() => openModal(adobeParticipation, 'Adobe Creative Workshop', 'Adobe')}
                            className="inline-block text-accent hover:text-accent-dark font-semibold cursor-pointer"
                        >
                            View Credential
                        </button>
                    </div>
                    <div className="bg-white rounded-xl shadow-lg p-6 transform transition-transform hover:scale-105">
                        <div className="mb-4">
                            <img src={tcsion} alt="TCS iON Certificate" className="w-full h-48 object-cover rounded-lg" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">TCS iON Career Edge</h3>
                        <p className="text-gray-700 mb-4">Issued by TCS iON</p>
                        <button 
                            onClick={() => openModal(tcsion, 'TCS iON Career Edge', 'TCS iON')}
                            className="inline-block text-accent hover:text-accent-dark font-semibold cursor-pointer"
                        >
                            View Credential
                        </button>
                    </div>
                </div>

                {/* Modal for viewing certificate */}
                {selectedCertificate && (
                    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-auto relative">
                            <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
                                <div>
                                    <h3 className="text-xl font-bold">{selectedCertificate.title}</h3>
                                    <p className="text-gray-600">Issued by {selectedCertificate.organization}</p>
                                </div>
                                <button
                                    onClick={closeModal}
                                    className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                                >
                                    ×
                                </button>
                            </div>
                            <div className="p-4">
                                <img 
                                    src={selectedCertificate.image} 
                                    alt={selectedCertificate.title}
                                    className="w-full h-auto"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Certificates;
