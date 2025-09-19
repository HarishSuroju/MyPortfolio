import React, { useState } from 'react';

const Internships = () => {
    const [selectedInternship, setSelectedInternship] = useState(null);
    const [activeModal, setActiveModal] = useState(null);

    // Sample internship data - replace with your actual internship details
    const internships = [
        {
            id: 1,
            company: "TCS iON",
            position: "Software Development Intern",
            duration: "June 2023 - August 2023",
            location: "Hyderabad, India",
            description: "Worked on developing web applications using modern JavaScript frameworks and contributed to various client projects.",
            technologies: ["JavaScript", "React", "Node.js", "MongoDB", "HTML/CSS"],
            projects: [
                {
                    name: "Customer Management System",
                    description: "Developed a full-stack web application for managing customer data with CRUD operations",
                    technologies: ["React", "Node.js", "MongoDB"],
                    features: ["User Authentication", "Data Visualization", "Real-time Updates"]
                },
                {
                    name: "Inventory Tracking Dashboard",
                    description: "Built an interactive dashboard for tracking inventory levels and generating reports",
                    technologies: ["React", "Chart.js", "Express.js"],
                    features: ["Interactive Charts", "PDF Reports", "Stock Alerts"]
                }
            ],
            achievements: [
                "Successfully delivered 2 major projects within the internship period",
                "Received positive feedback from senior developers",
                "Improved application performance by 30% through code optimization"
            ],
            skills: [
                "Full-stack development",
                "Database design",
                "API development",
                "Code optimization",
                "Team collaboration"
            ],
            documents: {
                offerLetter: "Available",
                completionCertificate: "Available",
                recommendationLetter: "Available"
            }
        }
        // Add more internships as needed
    ];

    const openModal = (type, internship) => {
        setActiveModal({ type, internship });
    };

    const closeModal = () => {
        setActiveModal(null);
    };

    return (
        <section id="internships" className="section py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Professional Internships
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Practical experience gained through internships, showcasing real-world projects, 
                        achievements, and professional growth
                    </p>
                </div>

                <div className="grid gap-8 md:gap-12">
                    {internships.map((internship) => (
                        <div key={internship.id} className="bg-white rounded-2xl shadow-xl overflow-hidden transform hover:scale-[1.02] transition-all duration-300">
                            {/* Header Section */}
                            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                    <div>
                                        <h3 className="text-2xl md:text-3xl font-bold mb-2">{internship.position}</h3>
                                        <p className="text-blue-100 text-lg font-semibold">{internship.company}</p>
                                        <p className="text-blue-200 mt-1">{internship.duration} • {internship.location}</p>
                                    </div>
                                    <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
                                        <button
                                            onClick={() => openModal('offer', internship)}
                                            className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-200"
                                        >
                                            📄 Offer Letter
                                        </button>
                                        <button
                                            onClick={() => openModal('certificate', internship)}
                                            className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-200"
                                        >
                                            🏆 Certificate
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Content Section */}
                            <div className="p-8">
                                <p className="text-gray-700 text-lg mb-8 leading-relaxed">{internship.description}</p>

                                {/* Technologies */}
                                <div className="mb-8">
                                    <h4 className="text-xl font-bold text-gray-900 mb-4">Technologies Used</h4>
                                    <div className="flex flex-wrap gap-3">
                                        {internship.technologies.map((tech, index) => (
                                            <span key={index} className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Projects */}
                                <div className="mb-8">
                                    <h4 className="text-xl font-bold text-gray-900 mb-6">Key Projects</h4>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        {internship.projects.map((project, index) => (
                                            <div key={index} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                                                <h5 className="text-lg font-bold text-gray-900 mb-3">{project.name}</h5>
                                                <p className="text-gray-700 mb-4">{project.description}</p>
                                                <div className="mb-4">
                                                    <p className="text-sm font-semibold text-gray-600 mb-2">Technologies:</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {project.technologies.map((tech, techIndex) => (
                                                            <span key={techIndex} className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-xs font-medium">
                                                                {tech}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-600 mb-2">Key Features:</p>
                                                    <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                                                        {project.features.map((feature, featureIndex) => (
                                                            <li key={featureIndex}>{feature}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Achievements and Skills */}
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div>
                                        <h4 className="text-xl font-bold text-gray-900 mb-4">Key Achievements</h4>
                                        <ul className="space-y-3">
                                            {internship.achievements.map((achievement, index) => (
                                                <li key={index} className="flex items-start">
                                                    <span className="text-green-500 text-xl mr-3">✓</span>
                                                    <span className="text-gray-700">{achievement}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold text-gray-900 mb-4">Skills Developed</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {internship.skills.map((skill, index) => (
                                                <span key={index} className="bg-green-100 text-green-800 px-3 py-2 rounded-lg text-sm font-medium">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal for documents */}
            {activeModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h3 className="text-2xl font-bold text-gray-900">
                                    {activeModal.type === 'offer' ? 'Offer Letter' : 'Completion Certificate'}
                                </h3>
                                <button
                                    onClick={closeModal}
                                    className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                                >
                                    ×
                                </button>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="text-center">
                                <div className="mb-6">
                                    <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <span className="text-4xl">
                                            {activeModal.type === 'offer' ? '📄' : '🏆'}
                                        </span>
                                    </div>
                                    <h4 className="text-xl font-bold text-gray-900 mb-2">
                                        {activeModal.internship.company} - {activeModal.internship.position}
                                    </h4>
                                    <p className="text-gray-600">{activeModal.internship.duration}</p>
                                </div>
                                
                                <div className="bg-gray-50 rounded-xl p-6 mb-6">
                                    <p className="text-gray-700 mb-4">
                                        {activeModal.type === 'offer' 
                                            ? 'This document contains the official offer letter for the internship position.'
                                            : 'This document contains the official completion certificate for the internship program.'
                                        }
                                    </p>
                                    <div className="text-sm text-gray-600">
                                        <p><strong>Status:</strong> {activeModal.internship.documents[activeModal.type === 'offer' ? 'offerLetter' : 'completionCertificate']}</p>
                                        <p><strong>Company:</strong> {activeModal.internship.company}</p>
                                        <p><strong>Duration:</strong> {activeModal.internship.duration}</p>
                                    </div>
                                </div>

                                <div className="flex gap-4 justify-center">
                                    <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200">
                                        📥 Download Document
                                    </button>
                                    <button className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors duration-200">
                                        👁️ Preview
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default Internships;