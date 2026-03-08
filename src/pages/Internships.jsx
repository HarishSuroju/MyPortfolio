import React, { useState, useEffect } from 'react';
import { getPortfolioData, updatePortfolioSection } from '../utils/dataManager';
import { useAuth } from '../contexts/AuthContext';
import { Plus, X, Edit, Save, Calendar, MapPin, Award, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

const Internships = () => {
    const [internshipsData, setInternshipsData] = useState([]);
    const [isAddingInternship, setIsAddingInternship] = useState(false);
    const [newInternship, setNewInternship] = useState({
        company: '',
        position: '',
        duration: '',
        location: '',
        description: '',
        skills: [],
        achievements: []
    });
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        const loadData = async () => {
            const data = await getPortfolioData();
            setInternshipsData(data.internships || []);
        };
        loadData();
    }, []);

    const updateInternshipsData = async (updatedInternships) => {
        setInternshipsData(updatedInternships);
        await updatePortfolioSection('internships', updatedInternships);
    };

    const addInternship = () => {
        if (newInternship.company.trim() && newInternship.position.trim()) {
            const internship = {
                ...newInternship,
                id: Date.now(),
                skills: newInternship.skills.filter(skill => skill.trim() !== ''),
                achievements: newInternship.achievements.filter(achievement => achievement.trim() !== '')
            };
            const updatedInternships = [...internshipsData, internship];
            updateInternshipsData(updatedInternships);
            setNewInternship({
                company: '',
                position: '',
                duration: '',
                location: '',
                description: '',
                skills: [],
                achievements: []
            });
            setIsAddingInternship(false);
            toast.success('Internship added successfully!');
        } else {
            toast.error('Please fill in company and position');
        }
    };

    const removeInternship = (index) => {
        const updatedInternships = internshipsData.filter((_, i) => i !== index);
        updateInternshipsData(updatedInternships);
        toast.success('Internship removed successfully!');
    };

    const handleArrayFieldChange = (value, setter, currentData, fieldName) => {
        const arrayData = value.split('\n');
        setter({ ...currentData, [fieldName]: arrayData });
    };

    return (
        <section id="internships" className="section py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="container mx-auto px-6">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-12">
                    <div className="text-center flex-1 sm:text-left">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Professional Internships</h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Practical experience gained through internships and professional development
                        </p>
                    </div>
                    {isAuthenticated && (
                        <button
                            onClick={() => setIsAddingInternship(true)}
                            className="bg-violet-500 hover:bg-violet-600 text-white p-2 rounded-full self-center sm:self-auto sm:ml-4"
                            title="Add Internship"
                        >
                            <Plus size={20} />
                        </button>
                    )}
                </div>

                {isAddingInternship && (
                    <div className="mb-8 p-6 bg-white border-2 border-violet-200 rounded-lg shadow-lg">
                        <h3 className="text-lg font-semibold mb-4">Add New Internship</h3>
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    placeholder="Company name"
                                    value={newInternship.company}
                                    onChange={(e) => setNewInternship({ ...newInternship, company: e.target.value })}
                                    className="p-2 border border-gray-300 rounded"
                                />
                                <input
                                    type="text"
                                    placeholder="Position/Role"
                                    value={newInternship.position}
                                    onChange={(e) => setNewInternship({ ...newInternship, position: e.target.value })}
                                    className="p-2 border border-gray-300 rounded"
                                />
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    placeholder="Duration (e.g., Jun 2023 - Aug 2023)"
                                    value={newInternship.duration}
                                    onChange={(e) => setNewInternship({ ...newInternship, duration: e.target.value })}
                                    className="p-2 border border-gray-300 rounded"
                                />
                                <input
                                    type="text"
                                    placeholder="Location"
                                    value={newInternship.location}
                                    onChange={(e) => setNewInternship({ ...newInternship, location: e.target.value })}
                                    className="p-2 border border-gray-300 rounded"
                                />
                            </div>
                            
                            <textarea
                                placeholder="Description of your role and responsibilities"
                                value={newInternship.description}
                                onChange={(e) => setNewInternship({ ...newInternship, description: e.target.value })}
                                rows={4}
                                className="w-full p-2 border border-gray-300 rounded resize-none"
                            />
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Skills (one per line)</label>
                                    <textarea
                                        placeholder={'React\nNode.js\nPostgreSQL\nTailwind CSS'}
                                        value={newInternship.skills.join('\n')}
                                        onChange={(e) => handleArrayFieldChange(e.target.value, setNewInternship, newInternship, 'skills')}
                                        rows={4}
                                        className="w-full p-2 border border-gray-300 rounded resize-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Achievements (one per line)</label>
                                    <textarea
                                        placeholder={'Delivered 2 major projects\nReceived positive feedback\nImproved performance by 30%'}
                                        value={newInternship.achievements.join('\n')}
                                        onChange={(e) => handleArrayFieldChange(e.target.value, setNewInternship, newInternship, 'achievements')}
                                        rows={4}
                                        className="w-full p-2 border border-gray-300 rounded resize-none"
                                    />
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex space-x-2 mt-4">
                            <button
                                onClick={addInternship}
                                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                            >
                                Add Internship
                            </button>
                            <button
                                onClick={() => setIsAddingInternship(false)}
                                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

                <div className="grid gap-8 md:gap-12">
                    {internshipsData.map((internship, index) => (
                        <div key={internship.id || index} className="bg-white rounded-2xl shadow-xl overflow-hidden relative group">
                            {isAuthenticated && (
                                <div className="absolute top-4 right-4 flex space-x-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity z-10">
                                    <button
                                        onClick={() => removeInternship(index)}
                                        className="bg-red-500 hover:bg-red-600 text-white p-2 rounded"
                                        title="Remove internship"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            )}
                            
                            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
                                <h3 className="text-2xl font-bold mb-2">{internship.position}</h3>
                                <p className="text-blue-100 text-lg font-semibold">{internship.company}</p>
                                <div className="flex items-center gap-4 mt-2 text-blue-200">
                                    {internship.duration && (
                                        <div className="flex items-center gap-1">
                                            <Calendar size={16} />
                                            <span>{internship.duration}</span>
                                        </div>
                                    )}
                                    {internship.location && (
                                        <div className="flex items-center gap-1">
                                            <MapPin size={16} />
                                            <span>{internship.location}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="p-6">
                                {internship.description && (
                                    <p className="text-gray-700 text-lg mb-6 leading-relaxed">{internship.description}</p>
                                )}

                                <div className="grid md:grid-cols-2 gap-6">
                                    {internship.skills && internship.skills.length > 0 && (
                                        <div>
                                            <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                                                <Award size={20} className="text-green-500" />
                                                Skills Developed
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {internship.skills.map((skill, skillIndex) => (
                                                    <span key={skillIndex} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    
                                    {internship.achievements && internship.achievements.length > 0 && (
                                        <div>
                                            <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                                                <FileText size={20} className="text-violet-500" />
                                                Key Achievements
                                            </h4>
                                            <ul className="space-y-2">
                                                {internship.achievements.map((achievement, achievementIndex) => (
                                                    <li key={achievementIndex} className="flex items-start gap-2">
                                                        <span className="text-green-500 text-lg mt-0.5">✓</span>
                                                        <span className="text-gray-700 text-sm">{achievement}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {internshipsData.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No internships added yet.</p>
                        {isAuthenticated && (
                            <button
                                onClick={() => setIsAddingInternship(true)}
                                className="mt-4 bg-violet-500 hover:bg-violet-600 text-white px-6 py-2 rounded-lg"
                            >
                                Add Your First Internship
                            </button>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
};

export default Internships;
