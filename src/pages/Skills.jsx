import React, { useState, useEffect } from 'react';
import { getPortfolioData, updatePortfolioSection } from '../utils/dataManager';
import { useAuth } from '../contexts/AuthContext';
import { Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';

const Skills = () => {
    const [skillsData, setSkillsData] = useState([]);
    const [isAddingSkill, setIsAddingSkill] = useState(false);
    const [newSkill, setNewSkill] = useState({ name: '', level: 50, category: 'Frontend' });
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        const data = getPortfolioData();
        setSkillsData(data.skills || []);
    }, []);

    const updateSkillsData = (updatedSkills) => {
        setSkillsData(updatedSkills);
        updatePortfolioSection('skills', updatedSkills);
    };

    const addSkill = () => {
        if (newSkill.name.trim()) {
            const updatedSkills = [...skillsData, { ...newSkill, id: Date.now() }];
            updateSkillsData(updatedSkills);
            setNewSkill({ name: '', level: 50, category: 'Frontend' });
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

    return (
        <section id="skills" className="section py-20 px-6 bg-gray-100">
            <div className="container mx-auto">
                <div className="flex justify-between items-center mb-12">
                    <h2 className="text-3xl font-bold text-center flex-1">My Skills</h2>
                    {isAuthenticated && (
                        <button
                            onClick={() => setIsAddingSkill(true)}
                            className="bg-violet-500 hover:bg-violet-600 text-white p-2 rounded-full"
                            title="Add Skill"
                        >
                            <Plus size={20} />
                        </button>
                    )}
                </div>

                {isAddingSkill && (
                    <div className="mb-8 p-6 bg-white rounded-lg shadow-lg">
                        <h3 className="text-lg font-semibold mb-4">Add New Skill</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {skillsData.map((skill, index) => (
                        <div key={index} className="bg-white p-6 rounded-lg shadow-lg transform transition-transform hover:scale-105 relative group">
                            {isAuthenticated && (
                                <button
                                    onClick={() => removeSkill(index)}
                                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                                    title="Remove skill"
                                >
                                    <X size={16} />
                                </button>
                            )}
                            
                            <div className={`w-12 h-12 ${getCategoryColor(skill.category)} rounded-full flex items-center justify-center text-white font-bold mb-4`}>
                                {skill.name.charAt(0).toUpperCase()}
                            </div>
                            
                            <h3 className="text-xl font-semibold mb-2">{skill.name}</h3>
                            <p className="text-sm text-gray-500 mb-3">{skill.category}</p>
                            
                            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                                <div 
                                    className={`${getCategoryColor(skill.category)} h-2 rounded-full transition-all duration-300`}
                                    style={{ width: `${skill.level}%` }}
                                ></div>
                            </div>
                            
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">{skill.level}%</span>
                                {isAuthenticated && (
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={skill.level}
                                        onChange={(e) => updateSkillLevel(index, parseInt(e.target.value))}
                                        className="w-20"
                                    />
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {skillsData.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No skills added yet.</p>
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