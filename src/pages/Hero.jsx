import React, { useState, useEffect } from 'react';
import { getPortfolioData, updatePortfolioSection } from '../utils/dataManager';
import EditableContent from '../components/EditableContent';

const Hero = () => {
    const [heroData, setHeroData] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            const data = await getPortfolioData();
            setHeroData(data.hero);
        };
        loadData();
    }, []);

    const updateHeroData = async (field, value) => {
        const updatedHero = { ...heroData, [field]: value };
        setHeroData(updatedHero);
        await updatePortfolioSection('hero', updatedHero);
    };

    // --- Editable Skills for Hero Section ---
    const [newSkill, setNewSkill] = useState('');
    const isAuthenticated = true; // Replace with your actual auth logic if needed

    const addHeroSkill = async () => {
        if (!newSkill.trim()) return;
        const updatedSkills = [...(heroData.skills || []), newSkill.trim()];
        await updateHeroData('skills', updatedSkills);
        setNewSkill('');
    };

    const removeHeroSkill = async (index) => {
        const updatedSkills = [...(heroData.skills || [])];
        updatedSkills.splice(index, 1);
        await updateHeroData('skills', updatedSkills);
    };

    if (!heroData) return <div>Loading...</div>;

    return (
        <section id="hero" className="relative bg-gray-200 py-24 md:py-32 flex items-center justify-center overflow-hidden">
            <EditableContent
                value={heroData.backgroundImage}
                onSave={(value) => updateHeroData('backgroundImage', value)}
                type="image"
                className="absolute inset-0 z-0"
            >
                <img 
                    src={heroData.backgroundImage || "/portfolio bg.jpg"} 
                    alt="Portfolio background" 
                    className="object-cover w-full h-full opacity-50 transition-all duration-500 hover:opacity-40" 
                />
            </EditableContent>
            
            <div className="relative z-10 text-center px-6 hero-content">
                <div className="mb-6">
                    <EditableContent
                        value={heroData.profileImage}
                        onSave={(value) => updateHeroData('profileImage', value)}
                        type="image"
                        className="inline-block"
                    >
                        <img 
                            src={heroData.profileImage || "/me.jpg"} 
                            alt="Profile" 
                            className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg mx-auto transition-all duration-300 hover:scale-110 hover:shadow-xl" 
                        />
                    </EditableContent>
                </div>
                
                <EditableContent
                    value={heroData.name}
                    onSave={(value) => updateHeroData('name', value)}
                    placeholder="Your Name"
                >
                    <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-4">
                        Hi, I'm {heroData.name}
                    </h1>
                </EditableContent>
                
                <EditableContent
                    value={heroData.title}
                    onSave={(value) => updateHeroData('title', value)}
                    placeholder="Your professional title or description"
                    multiline={true}
                >
                    <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto">
                        {heroData.title}
                    </p>
                </EditableContent>

                {/* Editable Skills Chips */}
                <div className="mb-8">
                    <div className="flex flex-wrap gap-3 justify-center">
                        {(heroData.skills || []).map((skill, idx) => (
                            <span key={idx} className="bg-violet-100 text-violet-700 px-4 py-2 rounded-full text-md font-medium flex items-center">
                                {skill}
                                {isAuthenticated && (
                                    <button onClick={() => removeHeroSkill(idx)} className="ml-2 text-violet-500 hover:text-red-500 font-bold">&times;</button>
                                )}
                            </span>
                        ))}
                    </div>
                    {isAuthenticated && (
                        <div className="flex justify-center mt-4 gap-2">
                            <input
                                type="text"
                                value={newSkill}
                                onChange={e => setNewSkill(e.target.value)}
                                placeholder="Add a skill for hero section"
                                className="p-2 border border-violet-300 rounded"
                            />
                            <button
                                onClick={addHeroSkill}
                                className="bg-violet-500 hover:bg-violet-600 text-white px-4 py-2 rounded"
                            >
                                Add
                            </button>
                        </div>
                    )}
                </div>

                <div className="mt-8">
                    <a href="#contact" className="bg-violet-500 hover:bg-violet-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-transform transform hover:scale-105">
                        Get In Touch
                    </a>
                </div>
            </div>
        </section>
    );
};

export default Hero;