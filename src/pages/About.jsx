import React, { useState, useEffect } from 'react';
import { getPortfolioData, updatePortfolioSection } from '../utils/dataManager';
import EditableContent from '../components/EditableContent';
import meImage from '../assets/me.jpg';

const About = () => {
    const [aboutData, setAboutData] = useState(null);

    useEffect(() => {
        const data = getPortfolioData();
        setAboutData(data.about);
    }, []);

    const updateAboutData = (field, value) => {
        const updatedAbout = { ...aboutData, [field]: value };
        setAboutData(updatedAbout);
        updatePortfolioSection('about', updatedAbout);
    };

    if (!aboutData) return <div>Loading...</div>;

    return (
        <section id="about" className="section py-20 px-6 bg-white">
            <div className="container mx-auto">
                <EditableContent
                    value={aboutData.title}
                    onSave={(value) => updateAboutData('title', value)}
                    placeholder="Section Title"
                >
                    <h2 className="text-3xl font-bold text-center mb-12">{aboutData.title}</h2>
                </EditableContent>
                
                <div className="flex flex-col md:flex-row items-center md:space-x-12">
                    <div className="md:w-1/3 mb-8 md:mb-0">
                        <EditableContent
                            value={aboutData.profileImage}
                            onSave={(value) => updateAboutData('profileImage', value)}
                            type="image"
                        >
                            <img 
                                src={aboutData.profileImage || meImage} 
                                alt="Your Photo" 
                                className="rounded-3xl shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-500" 
                            />
                        </EditableContent>
                    </div>
                    
                    <div className="md:w-2/3 text-gray-700">
                        <EditableContent
                            value={aboutData.description}
                            onSave={(value) => updateAboutData('description', value)}
                            placeholder="Write about yourself..."
                            multiline={true}
                        >
                            <div className="text-lg leading-relaxed mb-6 whitespace-pre-line">
                                {aboutData.description}
                            </div>
                        </EditableContent>
                        
                        <EditableContent
                            value={aboutData.experience}
                            onSave={(value) => updateAboutData('experience', value)}
                            placeholder="Your experience level"
                        >
                            <p className="text-lg font-semibold text-violet-600 mb-4">
                                {aboutData.experience}
                            </p>
                        </EditableContent>
                        
                        <div className="flex flex-wrap gap-2">
                            {aboutData.skills && aboutData.skills.map((skill, index) => (
                                <span 
                                    key={index}
                                    className="bg-violet-100 text-violet-800 px-3 py-1 rounded-full text-sm font-medium"
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
