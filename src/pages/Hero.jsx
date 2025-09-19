import React from 'react';
import portfolioBg from '../assets/portfolio bg.jpg';

const Hero = () => {
    return (
        <section id="hero" className="relative bg-gray-200 py-24 md:py-32 flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 z-0">
                <img src={portfolioBg} alt="Portfolio background" className="object-cover w-full h-full opacity-50" />
            </div>
            <div className="relative z-10 text-center px-6 hero-content">
                <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-4">Hi, I'm Harish Suroju</h1>
                {/* <p id="hero-typing-text" className="text-xl md:text-2xl text-gray-600 typing-effect font-mono">A passionate software developer with a love for building cool things.</p> */}
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
