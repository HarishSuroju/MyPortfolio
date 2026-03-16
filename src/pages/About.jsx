import React, { useState, useEffect } from 'react';
import { getPortfolioData, updatePortfolioSection } from '../utils/dataManager';
import EditableContent from '../components/EditableContent';

const About = () => {
    const [aboutData, setAboutData] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            const data = await getPortfolioData();
            setAboutData(data.about);
        };
        loadData();
    }, []);

    const updateAboutData = async (field, value) => {
        const updatedAbout = { ...aboutData, [field]: value };
        setAboutData(updatedAbout);
        await updatePortfolioSection('about', updatedAbout);
    };

    if (!aboutData) return (
        <div style={{ padding: '5rem', textAlign: 'center', color: 'var(--neon-cyan)' }}>Loading...</div>
    );

    return (
        <section id="about" className="section nebula-section py-20 px-6">
            <div className="container mx-auto">
                <EditableContent
                    value={aboutData.title}
                    onSave={(value) => updateAboutData('title', value)}
                    placeholder="Section Title"
                >
                    <h2 className="text-3xl font-bold text-center mb-2 cosmic-text">{aboutData.title}</h2>
                </EditableContent>
                <p className="text-center mb-12" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', letterSpacing: '0.15em' }}>
                    — MISSION LOG —
                </p>

                <div className="flex flex-col md:flex-row items-center md:space-x-12">
                    <div className="md:w-1/3 mb-8 md:mb-0">
                        <EditableContent
                            value={aboutData.profileImage}
                            onSave={(value) => updateAboutData('profileImage', value)}
                            type="image"
                        >
                            <img
                                src={aboutData.profileImage || "/me.jpg"}
                                alt="Your Photo"
                                className="rounded-2xl shadow-2xl transition-all duration-500 hover:scale-105"
                                style={{
                                    border: '2px solid rgba(96,165,250,0.3)',
                                    boxShadow: '0 0 40px rgba(96,165,250,0.15)',
                                }}
                            />
                        </EditableContent>
                    </div>

                    <div className="md:w-2/3" style={{ color: 'var(--text-primary)' }}>
                        <EditableContent
                            value={aboutData.description}
                            onSave={(value) => updateAboutData('description', value)}
                            placeholder="Write about yourself..."
                            multiline={true}
                        >
                            <div className="text-lg leading-relaxed mb-6 whitespace-pre-line" style={{ color: 'var(--text-secondary)' }}>
                                {aboutData.description}
                            </div>
                        </EditableContent>

                        <EditableContent
                            value={aboutData.experience}
                            onSave={(value) => updateAboutData('experience', value)}
                            placeholder="Your experience level"
                        >
                            <p className="text-lg font-semibold mb-4 glow-cyan" style={{ color: 'var(--neon-cyan)' }}>
                                🚀 {aboutData.experience}
                            </p>
                        </EditableContent>

                        <div className="flex flex-wrap gap-2">
                            {aboutData.skills && aboutData.skills.map((skill, index) => (
                                <span key={index}
                                    className="px-3 py-1 rounded-full text-sm font-medium"
                                    style={{
                                        background: 'rgba(167,139,250,0.1)',
                                        border: '1px solid rgba(167,139,250,0.3)',
                                        color: 'var(--neon-purple)',
                                    }}
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;