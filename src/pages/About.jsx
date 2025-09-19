import React from 'react';
import meImage from '../assets/me.jpg';

const About = () => {
    return (
        <section id="about" className="section py-20 px-6 bg-white">
            <div className="container mx-auto">
                <h2 className="text-3xl font-bold text-center mb-12">About Me</h2>
                <div className="flex flex-col md:flex-row items-center md:space-x-12">
                    <div className="md:w-1/3 mb-8 md:mb-0">
                        <img src={meImage} alt="Your Photo" className="rounded-3xl shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-500" />
                    </div>
                    <div className="md:w-2/3 text-gray-700">
                        <p className="text-lg leading-relaxed mb-4">
                            Hello! I am a full-stack developer specializing in creating beautiful and functional web applications. With a strong foundation in modern web technologies, I love turning complex problems into simple, elegant solutions.
                        </p>
                        <p className="text-lg leading-relaxed mb-4">
                            My journey in web development began with a curiosity for how things work, and it quickly evolved into a passion for crafting engaging user experiences. I believe that a great application is a perfect blend of robust backend systems and intuitive frontend design.
                        </p>
                        <p className="text-lg leading-relaxed">
                            When I'm not coding, you can find me exploring new technologies, contributing to open-source projects, or sipping coffee while sketching out new ideas. I'm always eager to learn and grow, and I'm excited about the possibility of collaborating with you on your next big project.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
