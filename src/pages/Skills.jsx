import React, { useState, useEffect } from 'react';
import { getPortfolioData, updatePortfolioSection } from '../utils/dataManager';
import { useAuth } from '../contexts/AuthContext';
import { Plus, X } from 'lucide-react';
// Import all icons from the icons folder (Vite/React way)
import toast from 'react-hot-toast';

const Skills = () => {
    const [skillsData, setSkillsData] = useState([]);
    const [isAddingSkill, setIsAddingSkill] = useState(false);
    const [newSkill, setNewSkill] = useState({ name: '', level: 50, category: 'Frontend', icon: '' });
    const [activeCategory, setActiveCategory] = useState('All');
    const [editIndex, setEditIndex] = useState(null);
    const [editSkill, setEditSkill] = useState({ name: '', level: 50, category: 'Frontend', icon: '' });
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        const loadData = async () => {
            const data = await getPortfolioData();
            setSkillsData(data.skills || []);
        };
        loadData();
    }, []);

    const updateSkillsData = async (updatedSkills) => {
        setSkillsData(updatedSkills);
        await updatePortfolioSection('skills', updatedSkills);
    };

    const startEditSkill = (index) => {
        setEditIndex(index);
        setEditSkill({ ...skillsData[index] });
    };

    const cancelEditSkill = () => {
        setEditIndex(null);
        setEditSkill({ name: '', level: 50, category: 'Frontend', icon: '' });
    };

    const saveEditSkill = () => {
        if (editSkill.name.trim()) {
            const updatedSkills = [...skillsData];
            updatedSkills[editIndex] = { ...editSkill };
            updateSkillsData(updatedSkills);
            setEditIndex(null);
            setEditSkill({ name: '', level: 50, category: 'Frontend', icon: '' });
            toast.success('Skill updated successfully!');
        }
    };

    const addSkill = () => {
        if (newSkill.name.trim()) {
            // If icon is not set, try to auto-assign based on name
            let icon = newSkill.icon;
            if (!icon && skillIcons[newSkill.name]) {
                icon = skillIcons[newSkill.name];
            }
            const updatedSkills = [...skillsData, { ...newSkill, icon, id: Date.now() }];
            updateSkillsData(updatedSkills);
            setNewSkill({ name: '', level: 50, category: 'Frontend', icon: '' });
            setIsAddingSkill(false);
            toast.success('Skill added successfully!');
        }
    };

    const removeSkill = (index) => {
        const updatedSkills = skillsData.filter((_, i) => i !== index);
        updateSkillsData(updatedSkills);
        toast.success('Skill removed successfully!');
    };

    const updateSkillLevel = (index, newLevel) => {
        const updatedSkills = [...skillsData];
        updatedSkills[index].level = newLevel;
        updateSkillsData(updatedSkills);
    };

    const getCategoryColor = (category) => {
        const colors = {
            'Frontend': 'bg-blue-500',
            'Backend': 'bg-green-500',
            'Database': 'bg-purple-500',
            'Mobile': 'bg-yellow-500',
            'DevOps': 'bg-red-500',
            'DSA': 'bg-orange-500',
            'Other': 'bg-gray-500'
        };
        return colors[category] || colors['Other'];
    };

    const getCategoryGlowColor = (category) => {
        const glowColors = {
            'Frontend': 'hover:shadow-[0_0_15px_5px_rgba(59,130,246,0.5)]',
            'Backend': 'hover:shadow-[0_0_15px_5px_rgba(34,197,94,0.5)]',
            'Database': 'hover:shadow-[0_0_15px_5px_rgba(147,51,234,0.5)]',
            'Mobile': 'hover:shadow-[0_0_15px_5px_rgba(234,179,8,0.5)]',
            'DevOps': 'hover:shadow-[0_0_15px_5px_rgba(239,68,68,0.5)]',
            'DSA': 'hover:shadow-[0_0_15px_5px_rgba(251,146,60,0.5)]',
            'Other': 'hover:shadow-[0_0_15px_5px_rgba(107,114,128,0.5)]'
        };
        return glowColors[category] || glowColors['Other'];
    };

    // Get unique categories
    const getCategories = () => {
        const categories = [...new Set(skillsData.map(skill => skill.category))];
        return ['All', ...categories];
    };

    // Filter skills by category
    const getFilteredSkills = () => {
        if (activeCategory === 'All') {
            return skillsData;
        }
        return skillsData.filter(skill => skill.category === activeCategory);
    };

    return (
        <section id="skills" className="section py-20 px-6" style={{ background: 'var(--space-bg)' }}>
            <div className="container mx-auto">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-12">
                    <div>
                        <h2 className="text-3xl font-bold cosmic-text">Skill Constellation</h2>
                        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)', letterSpacing: '0.1em' }}>— MY SKILLS —</p>
                    </div>
                    {isAuthenticated && (
                        <button onClick={() => setIsAddingSkill(true)}
                            className="p-2 rounded-full self-center sm:self-auto transition-all"
                            style={{ background: 'rgba(167,139,250,0.15)', border: '1px solid rgba(167,139,250,0.4)', color: 'var(--neon-purple)' }}
                            title="Add Skill"
                        >
                            <Plus size={20} />
                        </button>
                    )}
                </div>

                {isAddingSkill && (
                    <div className="mb-8 p-6 space-card rounded-lg shadow-lg">
                        <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--neon-purple)' }}>✦ Add New Star</h3>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <input type="text" placeholder="Skill name" value={newSkill.name}
                                onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                                className="p-2 rounded text-sm"
                                style={{ background: 'rgba(167,139,250,0.08)', border: '1px solid rgba(167,139,250,0.3)', color: 'var(--text-primary)' }}
                            />
                            <select value={newSkill.category}
                                onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
                                className="p-2 rounded text-sm"
                                style={{ background: 'rgba(167,139,250,0.08)', border: '1px solid rgba(167,139,250,0.3)', color: 'var(--text-primary)' }}
                            >
                                {['Frontend','Backend','Database','Mobile','DevOps','DSA','Programming','Other'].map(c => (
                                    <option key={c} value={c} style={{ background: 'var(--space-deep)' }}>{c}</option>
                                ))}
                            </select>
                            <div className="flex items-center space-x-2">
                                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Level:</span>
                                <input type="range" min="0" max="100" value={newSkill.level}
                                    onChange={(e) => setNewSkill({ ...newSkill, level: parseInt(e.target.value) })}
                                    className="flex-1"
                                />
                                <span className="text-sm w-8" style={{ color: 'var(--neon-purple)' }}>{newSkill.level}%</span>
                            </div>
                            <div>
                                <label className="block text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>Skill Image</label>
                                <input type="file" accept="image/*"
                                    onChange={e => { const f = e.target.files[0]; if (f) { const r = new FileReader(); r.onload = ev => setNewSkill(s => ({ ...s, icon: ev.target.result })); r.readAsDataURL(f); } }}
                                    className="p-2 rounded w-full text-sm"
                                    style={{ background: 'rgba(167,139,250,0.05)', border: '1px solid rgba(167,139,250,0.2)', color: 'var(--text-secondary)' }}
                                />
                            </div>
                        </div>
                        <div className="flex space-x-2 mt-4">
                            <button onClick={addSkill} className="px-4 py-2 rounded text-sm"
                                style={{ background: 'rgba(52,211,153,0.15)', border: '1px solid rgba(52,211,153,0.4)', color: 'var(--neon-green)' }}>Add</button>
                            <button onClick={() => setIsAddingSkill(false)} className="px-4 py-2 rounded text-sm"
                                style={{ background: 'rgba(148,163,184,0.1)', border: '1px solid rgba(148,163,184,0.25)', color: 'var(--text-secondary)' }}>Cancel</button>
                        </div>
                    </div>
                )}

                {/* Category Filter */}
                <div className="flex flex-wrap gap-2 mb-8 justify-center">
                    {getCategories().map((category) => (
                        <button key={category} onClick={() => setActiveCategory(category)}
                            className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-300"
                            style={activeCategory === category
                                ? { background: 'rgba(167,139,250,0.25)', border: '1px solid rgba(167,139,250,0.6)', color: 'var(--neon-purple)', boxShadow: '0 0 12px rgba(167,139,250,0.3)' }
                                : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-secondary)' }
                            }
                        >
                            {category}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {getFilteredSkills().map((skill, index) => (
                        <div key={index}
                            className="space-card p-4 rounded-lg relative group transition-all duration-300"
                            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 20px rgba(167,139,250,0.3)'}
                            onMouseLeave={e => e.currentTarget.style.boxShadow = ''}
                        >
                            {isAuthenticated && editIndex !== index && (
                                <>
                                    <button onClick={() => removeSkill(index)}
                                        className="absolute top-1 right-1 p-1 rounded opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
                                        style={{ background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.4)', color: '#f87171' }}
                                        title="Remove skill"><X size={14} /></button>
                                    <button onClick={() => startEditSkill(index)}
                                        className="absolute top-1 right-8 p-1 rounded opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity text-xs"
                                        style={{ background: 'rgba(96,165,250,0.2)', border: '1px solid rgba(96,165,250,0.4)', color: 'var(--neon-blue)' }}
                                        title="Edit skill">✎</button>
                                </>
                            )}
                            {editIndex === index ? (
                                <div>
                                    <input type="text" value={editSkill.name}
                                        onChange={e => setEditSkill({ ...editSkill, name: e.target.value })}
                                        className="p-2 rounded w-full mb-2 text-sm"
                                        style={{ background: 'rgba(167,139,250,0.08)', border: '1px solid rgba(167,139,250,0.3)', color: 'var(--text-primary)' }}
                                        placeholder="Skill name"
                                    />
                                    <select value={editSkill.category}
                                        onChange={e => setEditSkill({ ...editSkill, category: e.target.value })}
                                        className="p-2 rounded w-full mb-2 text-sm"
                                        style={{ background: 'rgba(167,139,250,0.08)', border: '1px solid rgba(167,139,250,0.3)', color: 'var(--text-primary)' }}
                                    >
                                        {['Frontend','Backend','Database','Mobile','DevOps','DSA','Programming','Other'].map(c => (
                                            <option key={c} value={c} style={{ background: 'var(--space-deep)' }}>{c}</option>
                                        ))}
                                    </select>
                                    <div className="flex items-center space-x-2 mb-2">
                                        <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Level:</span>
                                        <input type="range" min="0" max="100" value={editSkill.level}
                                            onChange={e => setEditSkill({ ...editSkill, level: parseInt(e.target.value) })}
                                            className="flex-1"
                                        />
                                        <span className="text-xs" style={{ color: 'var(--neon-purple)' }}>{editSkill.level}%</span>
                                    </div>
                                    <div className="mb-2">
                                        <label className="block text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>Skill Image</label>
                                        <input type="file" accept="image/*"
                                            onChange={e => { const f = e.target.files[0]; if (f) { const r = new FileReader(); r.onload = ev => setEditSkill(s => ({ ...s, icon: ev.target.result })); r.readAsDataURL(f); } }}
                                            className="p-1 rounded w-full text-xs"
                                            style={{ background: 'rgba(167,139,250,0.05)', border: '1px solid rgba(167,139,250,0.2)', color: 'var(--text-secondary)' }}
                                        />
                                        {editSkill.icon && <img src={editSkill.icon} alt="icon" className="w-7 h-7 object-contain mt-2" />}
                                    </div>
                                    <div className="flex space-x-2">
                                        <button onClick={saveEditSkill} className="px-3 py-1 rounded text-xs"
                                            style={{ background: 'rgba(52,211,153,0.15)', border: '1px solid rgba(52,211,153,0.4)', color: 'var(--neon-green)' }}>Save</button>
                                        <button onClick={cancelEditSkill} className="px-3 py-1 rounded text-xs"
                                            style={{ background: 'rgba(148,163,184,0.1)', border: '1px solid rgba(148,163,184,0.25)', color: 'var(--text-secondary)' }}>Cancel</button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold mb-3 transition-all duration-300 group-hover:scale-110"
                                        style={{ background: 'linear-gradient(135deg, rgba(167,139,250,0.3), rgba(96,165,250,0.3))', border: '1px solid rgba(167,139,250,0.4)', color: 'var(--neon-purple)' }}>
                                        {skill.icon
                                            ? <img src={skill.icon} alt={skill.name} className="w-7 h-7 object-contain" />
                                            : skill.name.charAt(0).toUpperCase()
                                        }
                                    </div>
                                    <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{skill.name}</h3>
                                    <p className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>{skill.category}</p>
                                    <div className="w-full rounded-full h-1.5 mb-1 overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                                        <div className="skill-bar-fill h-1.5 rounded-full" style={{ width: `${skill.level}%` }} />
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-medium" style={{ color: 'var(--neon-purple)' }}>{skill.level}%</span>
                                        {isAuthenticated && (
                                            <input type="range" min="0" max="100" value={skill.level}
                                                onChange={(e) => updateSkillLevel(index, parseInt(e.target.value))}
                                                className="w-16"
                                            />
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>

                {getFilteredSkills().length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
                            {skillsData.length === 0 ? '🌌 No stars mapped yet.' : `No skills in ${activeCategory} galaxy.`}
                        </p>
                        {isAuthenticated && (
                            <button onClick={() => setIsAddingSkill(true)}
                                className="mt-4 px-6 py-2 rounded-lg text-sm"
                                style={{ background: 'rgba(167,139,250,0.15)', border: '1px solid rgba(167,139,250,0.4)', color: 'var(--neon-purple)' }}>
                                Map Your First Star
                            </button>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
};

export default Skills;
