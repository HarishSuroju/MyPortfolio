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
    const [editIndex, setEditIndex] = useState(null);
    const [editInternship, setEditInternship] = useState({ company: '', position: '', duration: '', location: '', description: '', skills: [], achievements: [] });

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

    const startEditInternship = (index) => {
        setEditIndex(index);
        setEditInternship({ ...internshipsData[index], skills: [...internshipsData[index].skills], achievements: [...internshipsData[index].achievements] });
    };

    const cancelEditInternship = () => {
        setEditIndex(null);
        setEditInternship({ company: '', position: '', duration: '', location: '', description: '', skills: [], achievements: [] });
    };

    const saveEditInternship = () => {
        if (editInternship.company.trim() && editInternship.position.trim()) {
            const updatedInternships = [...internshipsData];
            updatedInternships[editIndex] = { ...editInternship, skills: editInternship.skills.filter(s => s.trim() !== ''), achievements: editInternship.achievements.filter(a => a.trim() !== '') };
            updateInternshipsData(updatedInternships);
            setEditIndex(null);
            setEditInternship({ company: '', position: '', duration: '', location: '', description: '', skills: [], achievements: [] });
            toast.success('Internship updated successfully!');
        } else {
            toast.error('Please fill in company and position');
        }
    };

    const handleArrayFieldChange = (value, setter, currentData, fieldName) => {
        const arrayData = value.split('\n');
        setter({ ...currentData, [fieldName]: arrayData });
    };

    return (
        <section id="internships" className="section nebula-section py-20">
            <div className="container mx-auto px-6">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-12">
                    <div className="text-center flex-1 sm:text-left">
                        <h2 className="text-3xl sm:text-4xl font-bold cosmic-text mb-2">Mission Log</h2>
                        <p className="text-sm" style={{ color: 'var(--text-secondary)', letterSpacing: '0.1em' }}>— PROFESSIONAL INTERNSHIPS —</p>
                    </div>
                    {isAuthenticated && (
                        <button
                            onClick={() => setIsAddingInternship(true)}
                            className="p-2 rounded-full self-center sm:self-auto sm:ml-4 transition-all"
                            style={{ background: 'rgba(96,165,250,0.15)', border: '1px solid rgba(96,165,250,0.4)', color: 'var(--neon-blue)' }}
                            title="Add Internship"
                        >
                            <Plus size={20} />
                        </button>
                    )}
                </div>

                {isAddingInternship && (
                    <div className="mb-8 p-6 space-card rounded-lg shadow-lg">
                        <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--neon-cyan)' }}>🚀 Log New Mission</h3>
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input type="text" placeholder="Company name" value={newInternship.company}
                                    onChange={(e) => setNewInternship({ ...newInternship, company: e.target.value })}
                                    className="p-2 rounded text-sm"
                                    style={{ background: 'rgba(96,165,250,0.08)', border: '1px solid rgba(96,165,250,0.3)', color: 'var(--text-primary)' }}
                                />
                                <input type="text" placeholder="Position/Role" value={newInternship.position}
                                    onChange={(e) => setNewInternship({ ...newInternship, position: e.target.value })}
                                    className="p-2 rounded text-sm"
                                    style={{ background: 'rgba(96,165,250,0.08)', border: '1px solid rgba(96,165,250,0.3)', color: 'var(--text-primary)' }}
                                />
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input type="text" placeholder="Duration (e.g., Jun 2023 - Aug 2023)" value={newInternship.duration}
                                    onChange={(e) => setNewInternship({ ...newInternship, duration: e.target.value })}
                                    className="p-2 rounded text-sm"
                                    style={{ background: 'rgba(96,165,250,0.08)', border: '1px solid rgba(96,165,250,0.3)', color: 'var(--text-primary)' }}
                                />
                                <input type="text" placeholder="Location" value={newInternship.location}
                                    onChange={(e) => setNewInternship({ ...newInternship, location: e.target.value })}
                                    className="p-2 rounded text-sm"
                                    style={{ background: 'rgba(96,165,250,0.08)', border: '1px solid rgba(96,165,250,0.3)', color: 'var(--text-primary)' }}
                                />
                            </div>
                            
                            <textarea placeholder="Description of your role and responsibilities" value={newInternship.description}
                                onChange={(e) => setNewInternship({ ...newInternship, description: e.target.value })}
                                rows={4} className="w-full p-2 rounded resize-none text-sm"
                                style={{ background: 'rgba(96,165,250,0.08)', border: '1px solid rgba(96,165,250,0.3)', color: 'var(--text-primary)' }}
                            />
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Skills (one per line)</label>
                                    <textarea placeholder={'React\nNode.js\nPostgreSQL'} value={newInternship.skills.join('\n')}
                                        onChange={(e) => handleArrayFieldChange(e.target.value, setNewInternship, newInternship, 'skills')}
                                        rows={4} className="w-full p-2 rounded resize-none text-sm"
                                        style={{ background: 'rgba(96,165,250,0.08)', border: '1px solid rgba(96,165,250,0.3)', color: 'var(--text-primary)' }}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Achievements (one per line)</label>
                                    <textarea placeholder={'Delivered 2 projects\nImproved performance by 30%'} value={newInternship.achievements.join('\n')}
                                        onChange={(e) => handleArrayFieldChange(e.target.value, setNewInternship, newInternship, 'achievements')}
                                        rows={4} className="w-full p-2 rounded resize-none text-sm"
                                        style={{ background: 'rgba(96,165,250,0.08)', border: '1px solid rgba(96,165,250,0.3)', color: 'var(--text-primary)' }}
                                    />
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex space-x-2 mt-4">
                            <button onClick={addInternship} className="px-4 py-2 rounded text-sm"
                                style={{ background: 'rgba(52,211,153,0.15)', border: '1px solid rgba(52,211,153,0.4)', color: 'var(--neon-green)' }}>
                                Add Mission
                            </button>
                            <button onClick={() => setIsAddingInternship(false)} className="px-4 py-2 rounded text-sm"
                                style={{ background: 'rgba(148,163,184,0.1)', border: '1px solid rgba(148,163,184,0.25)', color: 'var(--text-secondary)' }}>
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

                <div className="grid gap-8 md:gap-12">
                    {internshipsData.map((internship, index) => (
                        <div key={internship.id || index} className="space-card rounded-2xl overflow-hidden relative group transition-all duration-300"
                            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 30px rgba(96,165,250,0.2)'}
                            onMouseLeave={e => e.currentTarget.style.boxShadow = ''}
                        >
                            {isAuthenticated && editIndex !== index && (
                                <div className="absolute top-4 right-4 flex space-x-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity z-10">
                                    <button onClick={() => removeInternship(index)}
                                        className="p-2 rounded" title="Remove internship"
                                        style={{ background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.4)', color: '#f87171' }}>
                                        <X size={16} />
                                    </button>
                                    <button onClick={() => startEditInternship(index)}
                                        className="p-2 rounded" title="Edit internship"
                                        style={{ background: 'rgba(96,165,250,0.2)', border: '1px solid rgba(96,165,250,0.4)', color: 'var(--neon-blue)' }}>
                                        <Edit size={16} />
                                    </button>
                                </div>
                            )}
                            {editIndex === index ? (
                                <div className="p-6">
                                    <input type="text" placeholder="Company name" value={editInternship.company}
                                        onChange={e => setEditInternship({ ...editInternship, company: e.target.value })}
                                        className="p-2 rounded w-full mb-2 text-sm"
                                        style={{ background: 'rgba(96,165,250,0.08)', border: '1px solid rgba(96,165,250,0.3)', color: 'var(--text-primary)' }}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Position/Role"
                                        value={editInternship.position}
                                        onChange={e => setEditInternship({ ...editInternship, position: e.target.value })}
                                        className="p-2 rounded w-full mb-2 text-sm"
                                        style={{ background: 'rgba(96,165,250,0.08)', border: '1px solid rgba(96,165,250,0.3)', color: 'var(--text-primary)' }}
                                    />
                                    <input type="text" placeholder="Duration" value={editInternship.duration}
                                        onChange={e => setEditInternship({ ...editInternship, duration: e.target.value })}
                                        className="p-2 rounded w-full mb-2 text-sm"
                                        style={{ background: 'rgba(96,165,250,0.08)', border: '1px solid rgba(96,165,250,0.3)', color: 'var(--text-primary)' }}
                                    />
                                    <input type="text" placeholder="Location" value={editInternship.location}
                                        onChange={e => setEditInternship({ ...editInternship, location: e.target.value })}
                                        className="p-2 rounded w-full mb-2 text-sm"
                                        style={{ background: 'rgba(96,165,250,0.08)', border: '1px solid rgba(96,165,250,0.3)', color: 'var(--text-primary)' }}
                                    />
                                    <textarea placeholder="Description" value={editInternship.description}
                                        onChange={e => setEditInternship({ ...editInternship, description: e.target.value })}
                                        rows={3} className="w-full p-2 rounded mb-2 resize-none text-sm"
                                        style={{ background: 'rgba(96,165,250,0.08)', border: '1px solid rgba(96,165,250,0.3)', color: 'var(--text-primary)' }}
                                    />
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                                        <div>
                                            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Skills (one per line)</label>
                                            <textarea value={editInternship.skills.join('\n')}
                                                onChange={e => setEditInternship({ ...editInternship, skills: e.target.value.split('\n') })}
                                                rows={4} className="w-full p-2 rounded resize-none text-sm"
                                                style={{ background: 'rgba(96,165,250,0.08)', border: '1px solid rgba(96,165,250,0.3)', color: 'var(--text-primary)' }}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Achievements (one per line)</label>
                                            <textarea value={editInternship.achievements.join('\n')}
                                                onChange={e => setEditInternship({ ...editInternship, achievements: e.target.value.split('\n') })}
                                                rows={4} className="w-full p-2 rounded resize-none text-sm"
                                                style={{ background: 'rgba(96,165,250,0.08)', border: '1px solid rgba(96,165,250,0.3)', color: 'var(--text-primary)' }}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button onClick={saveEditInternship} className="px-3 py-1 rounded text-sm"
                                            style={{ background: 'rgba(52,211,153,0.15)', border: '1px solid rgba(52,211,153,0.4)', color: 'var(--neon-green)' }}>Save</button>
                                        <button onClick={cancelEditInternship} className="px-3 py-1 rounded text-sm"
                                            style={{ background: 'rgba(148,163,184,0.1)', border: '1px solid rgba(148,163,184,0.25)', color: 'var(--text-secondary)' }}>Cancel</button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="p-6" style={{
                                        background: 'linear-gradient(135deg, rgba(96,165,250,0.15), rgba(167,139,250,0.1))',
                                        borderBottom: '1px solid rgba(96,165,250,0.2)',
                                    }}>
                                        <h3 className="text-xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>🛸 {internship.position}</h3>
                                        <p className="font-semibold mb-2" style={{ color: 'var(--neon-blue)' }}>{internship.company}</p>
                                        <div className="flex items-center gap-4" style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                                            {internship.duration && (
                                                <div className="flex items-center gap-1">
                                                    <Calendar size={14} />
                                                    <span>{internship.duration}</span>
                                                </div>
                                            )}
                                            {internship.location && (
                                                <div className="flex items-center gap-1">
                                                    <MapPin size={14} />
                                                    <span>{internship.location}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        {internship.description && (
                                            <p className="text-sm mb-6 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{internship.description}</p>
                                        )}
                                        <div className="grid md:grid-cols-2 gap-6">
                                            {internship.skills && internship.skills.length > 0 && (
                                                <div>
                                                    <h4 className="text-sm font-bold mb-3 flex items-center gap-2" style={{ color: 'var(--neon-green)' }}>
                                                        <Award size={16} />
                                                        Skills Acquired
                                                    </h4>
                                                    <div className="flex flex-wrap gap-2">
                                                        {internship.skills.map((skill, skillIndex) => (
                                                            <span key={skillIndex} className="px-2 py-0.5 rounded-full text-xs"
                                                                style={{ background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.3)', color: 'var(--neon-green)' }}>
                                                                {skill}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                            {internship.achievements && internship.achievements.length > 0 && (
                                                <div>
                                                    <h4 className="text-sm font-bold mb-3 flex items-center gap-2" style={{ color: 'var(--neon-purple)' }}>
                                                        <FileText size={16} />
                                                        Achievements
                                                    </h4>
                                                    <ul className="space-y-1">
                                                        {internship.achievements.map((achievement, achievementIndex) => (
                                                            <li key={achievementIndex} className="flex items-start gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                                                                <span style={{ color: 'var(--neon-cyan)' }}>✦</span>
                                                                <span>{achievement}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>

                {internshipsData.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>🌌 No missions logged yet.</p>
                        {isAuthenticated && (
                            <button onClick={() => setIsAddingInternship(true)}
                                className="mt-4 px-6 py-2 rounded-lg text-sm"
                                style={{ background: 'rgba(96,165,250,0.15)', border: '1px solid rgba(96,165,250,0.4)', color: 'var(--neon-blue)' }}>
                                Log Your First Mission
                            </button>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
};

export default Internships;
