import React from 'react';

const Projects = () => {
    return (
        <section id="projects" className="section py-20 px-6 bg-white">
            <div className="container mx-auto">
                <h2 className="text-3xl font-bold text-center mb-12">My Projects</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div className="bg-gray-100 rounded-xl shadow-lg overflow-hidden transform transition-transform hover:scale-105">
                        <img src="https://placehold.co/600x400/6b46c1/ffffff?text=Project+1+Image" alt="Project 1" className="w-full h-48 object-cover" />
                        <div className="p-6">
                            <h3 className="text-xl font-bold mb-2"></h3>
                            <p className="text-gray-700 mb-4">A brief description of your project. Mention the technologies used and the problem it solved.</p>
                            <a href="#" className="inline-block bg-accent text-white py-2 px-4 rounded-full text-sm hover:bg-accent-dark transition-colors duration-300">View Project</a>
                        </div>
                    </div>
                    <div className="bg-gray-100 rounded-xl shadow-lg overflow-hidden transform transition-transform hover:scale-105">
                        <img src="https://placehold.co/600x400/6b46c1/ffffff?text=Project+2+Image" alt="Project 2" className="w-full h-48 object-cover" />
                        <div className="p-6">
                            <h3 className="text-xl font-bold mb-2">Project Title 2</h3>
                            <p className="text-gray-700 mb-4">A brief description of your project. Mention the technologies used and the problem it solved.</p>
                            <a href="#" className="inline-block bg-accent text-white py-2 px-4 rounded-full text-sm hover:bg-accent-dark transition-colors duration-300">View Project</a>
                        </div>
                    </div>
                    <div className="bg-gray-100 rounded-xl shadow-lg overflow-hidden transform transition-transform hover:scale-105">
                        <img src="https://placehold.co/600x400/6b46c1/ffffff?text=Project+3+Image" alt="Project 3" className="w-full h-48 object-cover" />
                        <div className="p-6">
                            <h3 className="text-xl font-bold mb-2">Project Title 3</h3>
                            <p className="text-gray-700 mb-4">A brief description of your project. Mention the technologies used and the problem it solved.</p>
                            <a href="#" className="inline-block bg-accent text-white py-2 px-4 rounded-full text-sm hover:bg-accent-dark transition-colors duration-300">View Project</a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Projects;
