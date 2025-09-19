import React from 'react';

const Header = () => {
    return (
        <header className="fixed w-full z-50 bg-white bg-opacity-90 backdrop-blur-sm shadow-md py-4">
            <div className="container mx-auto flex justify-between items-center px-6">
                <a href="#" className="text-2xl font-bold text-gray-900">My Portfolio</a>
                <nav>
                    <ul className="flex space-x-6">
                        <li><a href="#about" className="text-gray-600 hover:text-accent transition-colors duration-300">About</a></li>
                        <li><a href="#skills" className="text-gray-600 hover:text-accent transition-colors duration-300">Skills</a></li>
                        <li><a href="#projects" className="text-gray-600 hover:text-accent transition-colors duration-300">Projects</a></li>
                        <li><a href="#internships" className="text-gray-600 hover:text-accent transition-colors duration-300">Internships</a></li>
                        <li><a href="#certificates" className="text-gray-600 hover:text-accent transition-colors duration-300">Certificates</a></li>
                        <li><a href="#contact" className="text-gray-600 hover:text-accent transition-colors duration-300">Contact</a></li>
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;
