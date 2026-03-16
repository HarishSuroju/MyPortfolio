import React, { useState, useEffect } from 'react';
import { getPortfolioData, updatePortfolioSection } from '../utils/dataManager';
import EditableContent from '../components/EditableContent';
import { useAuth } from '../contexts/AuthContext';

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
    const { isAuthenticated } = useAuth();

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

    if (!heroData) return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--neon-cyan)' }}>
            Loading mission data...
        </div>
    );

    return (
        <section id="hero" className="relative py-24 md:py-36 flex items-center justify-center overflow-hidden"
            style={{ minHeight: '100vh', background: 'radial-gradient(ellipse at center, rgba(10,10,46,0.95) 0%, rgba(5,5,16,1) 100%)' }}
        >
            {/* Nebula background glow */}
            <div style={{
                position: 'absolute', inset: 0, pointerEvents: 'none',
                background: 'radial-gradient(ellipse at 30% 60%, rgba(167,139,250,0.12) 0%, transparent 55%), radial-gradient(ellipse at 70% 30%, rgba(34,211,238,0.1) 0%, transparent 55%)',
            }} />

            <EditableContent
                value={heroData.backgroundImage}
                onSave={(value) => updateHeroData('backgroundImage', value)}
                type="image"
                className="absolute inset-0 z-0"
            >
                <img
                    src={heroData.backgroundImage || "/portfolio bg.jpg"}
                    alt="Portfolio background"
                    className="object-cover w-full h-full"
                    style={{ opacity: 0.08 }}
                />
            </EditableContent>

            <div className="relative z-10 text-center px-6 hero-content">
                {/* Profile avatar with planet-pulse ring */}
                <div className="mb-8 flex justify-center">
                    <div className="relative inline-block">
                        <div className="planet-pulse rounded-full p-1"
                            style={{ background: 'linear-gradient(135deg, var(--neon-cyan), var(--neon-purple))' }}>
                            <EditableContent
                                value={heroData.profileImage}
                                onSave={(value) => updateHeroData('profileImage', value)}
                                type="image"
                                className="inline-block"
                            >
                                <img
                                    src={heroData.profileImage || "/me.jpg"}
                                    alt="Profile"
                                    className="w-36 h-36 rounded-full object-cover"
                                    style={{ border: '3px solid var(--space-bg)' }}
                                />
                            </EditableContent>
                        </div>
                    </div>
                </div>

                {/* Name */}
                <EditableContent
                    value={heroData.name}
                    onSave={(value) => updateHeroData('name', value)}
                    placeholder="Your Name"
                >
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-4 glow-cyan cosmic-text">
                        Hi, I'm {heroData.name}
                    </h1>
                </EditableContent>

                {/* Title */}
                <EditableContent
                    value={heroData.title}
                    onSave={(value) => updateHeroData('title', value)}
                    placeholder="Your professional title or description"
                    multiline={true}
                >
                    <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
                        {heroData.title}
                    </p>
                </EditableContent>

                {/* Skill Chips - Orbiting constellation style */}
                <div className="mb-10">
                    <div className="flex flex-wrap gap-3 justify-center">
                        {(heroData.skills || []).map((skill, idx) => (
                            <span key={idx}
                                className="flex items-center px-4 py-2 rounded-full text-sm font-medium"
                                style={{
                                    background: 'rgba(96,165,250,0.1)',
                                    border: '1px solid rgba(96,165,250,0.35)',
                                    color: 'var(--neon-blue)',
                                    backdropFilter: 'blur(8px)',
                                }}
                            >
                                ✦ {skill}
                                {isAuthenticated && (
                                    <button onClick={() => removeHeroSkill(idx)}
                                        className="ml-2 font-bold"
                                        style={{ color: 'var(--neon-pink)', opacity: 0.8 }}
                                    >&times;</button>
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
                                placeholder="Add a skill..."
                                className="p-2 rounded text-sm"
                                style={{
                                    background: 'rgba(96,165,250,0.08)',
                                    border: '1px solid rgba(96,165,250,0.3)',
                                    color: 'var(--text-primary)',
                                }}
                            />
                            <button onClick={addHeroSkill}
                                className="px-4 py-2 rounded text-sm font-medium transition-all"
                                style={{ background: 'rgba(96,165,250,0.2)', border: '1px solid rgba(96,165,250,0.4)', color: 'var(--neon-blue)' }}
                            >Add</button>
                        </div>
                    )}
                </div>

                {/* CTA Button */}
                <a href="#contact"
                    className="inline-block font-bold py-3 px-10 rounded-full transition-all duration-300"
                    style={{
                        background: 'linear-gradient(135deg, rgba(96,165,250,0.2), rgba(167,139,250,0.2))',
                        border: '1px solid rgba(96,165,250,0.5)',
                        color: 'var(--neon-cyan)',
                        boxShadow: '0 0 20px rgba(96,165,250,0.25)',
                    }}
                    onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 35px rgba(96,165,250,0.5)'}
                    onMouseLeave={e => e.currentTarget.style.boxShadow = '0 0 20px rgba(96,165,250,0.25)'}
                >
                    🛸 Initiate Contact
                </a>
            </div>
        </section>
    );
};

export default Hero;