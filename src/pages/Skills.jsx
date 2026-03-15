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
        <section id="skills" className="section py-20 px-6 bg-gray-100">
            <div className="container mx-auto">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-12">
                    <h2 className="text-3xl font-bold text-center flex-1 sm:text-left">My Skills</h2>
                    {isAuthenticated && (
                        <button
                            onClick={() => setIsAddingSkill(true)}
                            className="bg-violet-500 hover:bg-violet-600 text-white p-2 rounded-full self-center sm:self-auto"
                            title="Add Skill"
                        >
                            <Plus size={20} />
                        </button>
                    )}
                </div>

                {isAddingSkill && (
                    <div className="mb-8 p-6 bg-white rounded-lg shadow-lg">
                        <h3 className="text-lg font-semibold mb-4">Add New Skill</h3>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <input
                                type="text"
                                placeholder="Skill name"
                                value={newSkill.name}
                                onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                                className="p-2 border border-gray-300 rounded"
                            />
                            <select
                                value={newSkill.category}
                                onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
                                className="p-2 border border-gray-300 rounded"
                            >
                                <option value="Frontend">Frontend</option>
                                <option value="Backend">Backend</option>
                                <option value="Database">Database</option>
                                <option value="Mobile">Mobile</option>
                                <option value="DevOps">DevOps</option>
                                <option value="DSA">DSA</option>
                                <option value="Programming">Programming</option>
                                <option value="Other">Other</option>
                            </select>
                            <div className="flex items-center space-x-2">
                                <span className="text-sm">Level:</span>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={newSkill.level}
                                    onChange={(e) => setNewSkill({ ...newSkill, level: parseInt(e.target.value) })}
                                    className="flex-1"
                                />
                                <span className="text-sm w-8">{newSkill.level}%</span>
                            </div>
                            <div>
                                <label className="block text-sm mb-1">Skill Image</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={e => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            const reader = new FileReader();
                                            reader.onload = (ev) => {
                                                setNewSkill(skill => ({ ...skill, icon: ev.target.result }));
                                            };
                                            reader.readAsDataURL(file);
                                        }
                                    }}
                                    className="p-2 border border-gray-300 rounded w-full"
                                />
                            </div>
                        </div>
                        <div className="flex space-x-2 mt-4">
                            <button
                                onClick={addSkill}
                                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                            >
                                Add
                            </button>
                            <button
                                onClick={() => setIsAddingSkill(false)}
                                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

                {/* Category Filter */}
                <div className="flex flex-wrap gap-2 mb-8 justify-center">
                    {getCategories().map((category) => (
                        <button
                            key={category}
                            onClick={() => setActiveCategory(category)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                                activeCategory === category
                                    ? `${getCategoryColor(category)} text-white`
                                    : 'bg-white text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {getFilteredSkills().map((skill, index) => (
                        <div
                            key={index}
                            className={`bg-white p-4 rounded-lg transform transition-all duration-300 hover:-translate-y-1 ${getCategoryGlowColor(skill.category)} hover:shadow-2xl relative group`}
                        >
                            {isAuthenticated && editIndex !== index && (
                                <>
                                    <button
                                        onClick={() => removeSkill(index)}
                                        className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white p-1 rounded opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
                                        title="Remove skill"
                                    >
                                        <X size={14} />
                                    </button>
                                    <button
                                        onClick={() => startEditSkill(index)}
                                        className="absolute top-1 right-8 bg-blue-500 hover:bg-blue-600 text-white p-1 rounded opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
                                        title="Edit skill"
                                    >
                                        ✎
                                    </button>
                                </>
                            )}
                            {editIndex === index ? (
                                <div>
                                    <input
                                        type="text"
                                        value={editSkill.name}
                                        onChange={e => setEditSkill({ ...editSkill, name: e.target.value })}
                                        className="p-2 border border-gray-300 rounded w-full mb-2"
                                        placeholder="Skill name"
                                    />
                                    <select
                                        value={editSkill.category}
                                        onChange={e => setEditSkill({ ...editSkill, category: e.target.value })}
                                        className="p-2 border border-gray-300 rounded w-full mb-2"
                                    >
                                        <option value="Frontend">Frontend</option>
                                        <option value="Backend">Backend</option>
                                        <option value="Database">Database</option>
                                        <option value="Mobile">Mobile</option>
                                        <option value="DevOps">DevOps</option>
                                        <option value="DSA">DSA</option>
                                        <option value="Programming">Programming</option>
                                        <option value="Other">Other</option>
                                    </select>
                                    <div className="flex items-center space-x-2 mb-2">
                                        <span className="text-sm">Level:</span>
                                        <input
                                            type="range"
                                            min="0"
                                            max="100"
                                            value={editSkill.level}
                                            onChange={e => setEditSkill({ ...editSkill, level: parseInt(e.target.value) })}
                                            className="flex-1"
                                        />
                                        <span className="text-sm w-8">{editSkill.level}%</span>
                                    </div>
                                    <div className="mb-2">
                                        <label className="block text-sm mb-1">Skill Image</label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={e => {
                                                const file = e.target.files[0];
                                                if (file) {
                                                    const reader = new FileReader();
                                                    reader.onload = (ev) => {
                                                        setEditSkill(skill => ({ ...skill, icon: ev.target.result }));
                                                    };
                                                    reader.readAsDataURL(file);
                                                }
                                            }}
                                            className="p-2 border border-gray-300 rounded w-full"
                                        />
                                        {editSkill.icon && (
                                            <img src={editSkill.icon} alt="icon" className="w-7 h-7 object-contain mt-2" />
                                        )}
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={saveEditSkill}
                                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                                        >
                                            Save
                                        </button>
                                        <button
                                            onClick={cancelEditSkill}
                                            className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className={`w-10 h-10 ${getCategoryColor(skill.category)} rounded-full flex items-center justify-center text-white font-bold mb-3 transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6`}>
                                        {skill.icon ? (
                                            <img src={skill.icon} alt={skill.name} className="w-7 h-7 object-contain" />
                                        ) : (
                                            skill.name.charAt(0).toUpperCase()
                                        )}
                                    </div>
                                    <h3 className="text-md font-semibold mb-1 transform transition-transform duration-300 group-hover:translate-x-1">{skill.name}</h3>
                                    <p className="text-xs text-gray-500 mb-2 transform transition-transform duration-300 group-hover:translate-x-1">{skill.category}</p>
                                    <div className="w-full bg-gray-200 rounded-full h-1.5 mb-1 overflow-hidden">
                                        <div
                                            className={`${getCategoryColor(skill.category)} h-1.5 rounded-full transition-all duration-500 ease-out`}
                                            style={{ width: `${skill.level}%` }}
                                        ></div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-medium transform transition-transform duration-300 group-hover:scale-110">{skill.level}%</span>
                                        {isAuthenticated && (
                                            <input
                                                type="range"
                                                min="0"
                                                max="100"
                                                value={skill.level}
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
                        <p className="text-gray-500 text-lg">
                            {skillsData.length === 0 
                                ? "No skills added yet." 
                                : `No skills found in the ${activeCategory} category.`}
                        </p>
                        {isAuthenticated && (
                            <button
                                onClick={() => setIsAddingSkill(true)}
                                className="mt-4 bg-violet-500 hover:bg-violet-600 text-white px-6 py-2 rounded-lg"
                            >
                                Add Your First Skill
                            </button>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
};

export default Skills;
