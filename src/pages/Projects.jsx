import React, { useState, useEffect } from 'react';
import { getPortfolioData, updatePortfolioSection, handleImageUpload, validateImageFile } from '../utils/dataManager';
import { useAuth } from '../contexts/AuthContext';
import { Plus, X, Edit, Save, ExternalLink, Github } from 'lucide-react';
import toast from 'react-hot-toast';

const Projects = () => {
    const [projectsData, setProjectsData] = useState([]);
    const [isAddingProject, setIsAddingProject] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [newProject, setNewProject] = useState({
        title: '',
        description: '',
        image: '',
        technologies: [],
        githubUrl: '',
        liveUrl: ''
    });
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        const data = getPortfolioData();
        setProjectsData(data.projects || []);
    }, []);

    const updateProjectsData = (updatedProjects) => {
        setProjectsData(updatedProjects);
        updatePortfolioSection('projects', updatedProjects);
    };

    const addProject = () => {
        if (newProject.title.trim() && newProject.description.trim()) {
            const project = {
                ...newProject,
                id: Date.now(),
                technologies: newProject.technologies.filter(tech => tech.trim() !== '')
            };
            const updatedProjects = [...projectsData, project];
            updateProjectsData(updatedProjects);
            setNewProject({
                title: '',
                description: '',
                image: '',
                technologies: [],
                githubUrl: '',
                liveUrl: ''
            });
            setIsAddingProject(false);
            toast.success('Project added successfully!');
        } else {
            toast.error('Please fill in title and description');
        }
    };

    const removeProject = (index) => {
        const updatedProjects = projectsData.filter((_, i) => i !== index);
        updateProjectsData(updatedProjects);
        toast.success('Project removed successfully!');
    };

    const updateProject = (index, updatedProject) => {
        const updatedProjects = [...projectsData];
        updatedProjects[index] = {
            ...updatedProject,
            technologies: updatedProject.technologies.filter(tech => tech.trim() !== '')
        };
        updateProjectsData(updatedProjects);
        setEditingProject(null);
        toast.success('Project updated successfully!');
    };

    const handleImageChange = async (file, setImageFunction) => {
        if (!file) return;
        try {
            validateImageFile(file);
            const imageDataUrl = await handleImageUpload(file);
            setImageFunction(imageDataUrl);
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleTechnologiesChange = (value, setter, currentProject) => {
        const techArray = value.split(',').map(tech => tech.trim());
        setter({ ...currentProject, technologies: techArray });
    };

    const ProjectCard = ({ project, index }) => {
        const [isEditing, setIsEditing] = useState(false);
        const [editData, setEditData] = useState(project);

        const handleSave = () => {
            updateProject(index, editData);
            setIsEditing(false);
        };

        const handleCancel = () => {
            setEditData(project);
            setIsEditing(false);
        };

        if (isEditing) {
            return (
                <div className="bg-gray-100 rounded-xl shadow-lg overflow-hidden p-6">
                    <div className="space-y-4">
                        <input
                            type="text"
                            value={editData.title}
                            onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                            placeholder="Project title"
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                        
                        <textarea
                            value={editData.description}
                            onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                            placeholder="Project description"
                            rows={4}
                            className="w-full p-2 border border-gray-300 rounded resize-none"
                        />
                        
                        <div>
                            <label className="block text-sm font-medium mb-2">Project Image</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageChange(e.target.files[0], (img) => setEditData({ ...editData, image: img }))}
                                className="w-full p-2 border border-gray-300 rounded"
                            />
                            {editData.image && (
                                <img src={editData.image} alt="Preview" className="mt-2 w-32 h-20 object-cover rounded" />
                            )}
                        </div>
                        
                        <input
                            type="text"
                            value={editData.technologies.join(', ')}
                            onChange={(e) => handleTechnologiesChange(e.target.value, setEditData, editData)}
                            placeholder="Technologies (comma separated)"
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                        
                        <input
                            type="url"
                            value={editData.githubUrl}
                            onChange={(e) => setEditData({ ...editData, githubUrl: e.target.value })}
                            placeholder="GitHub URL"
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                        
                        <input
                            type="url"
                            value={editData.liveUrl}
                            onChange={(e) => setEditData({ ...editData, liveUrl: e.target.value })}
                            placeholder="Live demo URL"
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                        
                        <div className="flex space-x-2">
                            <button
                                onClick={handleSave}
                                className="bg-green-500 hover:bg-green-600 text-white p-2 rounded"
                            >
                                <Save size={16} />
                            </button>
                            <button
                                onClick={handleCancel}
                                className="bg-gray-500 hover:bg-gray-600 text-white p-2 rounded"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className="bg-gray-100 rounded-xl shadow-lg overflow-hidden transform transition-transform hover:scale-105 relative group">
                {isAuthenticated && (
                    <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        <button
                            onClick={() => setIsEditing(true)}
                            className="bg-blue-500 hover:bg-blue-600 text-white p-1 rounded"
                            title="Edit project"
                        >
                            <Edit size={16} />
                        </button>
                        <button
                            onClick={() => removeProject(index)}
                            className="bg-red-500 hover:bg-red-600 text-white p-1 rounded"
                            title="Remove project"
                        >
                            <X size={16} />
                        </button>
                    </div>
                )}
                
                {project.image && (
                    <img src={project.image} alt={project.title} className="w-full h-48 object-cover" />
                )}
                
                <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                    <p className="text-gray-700 mb-4">{project.description}</p>
                    
                    {project.technologies && project.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                            {project.technologies.map((tech, techIndex) => (
                                <span key={techIndex} className="bg-violet-100 text-violet-800 px-2 py-1 rounded-full text-xs">
                                    {tech}
                                </span>
                            ))}
                        </div>
                    )}
                    
                    <div className="flex space-x-2">
                        {project.githubUrl && (
                            <a
                                href={project.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center bg-gray-800 text-white py-2 px-4 rounded-full text-sm hover:bg-gray-700 transition-colors duration-300"
                            >
                                <Github size={16} className="mr-1" />
                                Code
                            </a>
                        )}
                        {project.liveUrl && (
                            <a
                                href={project.liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center bg-violet-500 text-white py-2 px-4 rounded-full text-sm hover:bg-violet-600 transition-colors duration-300"
                            >
                                <ExternalLink size={16} className="mr-1" />
                                Live Demo
                            </a>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <section id="projects" className="section py-20 px-6 bg-white">
            <div className="container mx-auto">
                <div className="flex justify-between items-center mb-12">
                    <h2 className="text-3xl font-bold text-center flex-1">My Projects</h2>
                    {isAuthenticated && (
                        <button
                            onClick={() => setIsAddingProject(true)}
                            className="bg-violet-500 hover:bg-violet-600 text-white p-2 rounded-full"
                            title="Add Project"
                        >
                            <Plus size={20} />
                        </button>
                    )}
                </div>

                {isAddingProject && (
                    <div className="mb-8 p-6 bg-white border-2 border-violet-200 rounded-lg shadow-lg">
                        <h3 className="text-lg font-semibold mb-4">Add New Project</h3>
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    placeholder="Project title"
                                    value={newProject.title}
                                    onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                                    className="p-2 border border-gray-300 rounded"
                                />
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleImageChange(e.target.files[0], (img) => setNewProject({ ...newProject, image: img }))}
                                    className="p-2 border border-gray-300 rounded"
                                />
                            </div>
                            
                            <textarea
                                placeholder="Project description"
                                value={newProject.description}
                                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                                rows={4}
                                className="w-full p-2 border border-gray-300 rounded resize-none"
                            />
                            
                            <input
                                type="text"
                                placeholder="Technologies used (comma separated)"
                                value={newProject.technologies.join(', ')}
                                onChange={(e) => handleTechnologiesChange(e.target.value, setNewProject, newProject)}
                                className="w-full p-2 border border-gray-300 rounded"
                            />
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input
                                    type="url"
                                    placeholder="GitHub URL"
                                    value={newProject.githubUrl}
                                    onChange={(e) => setNewProject({ ...newProject, githubUrl: e.target.value })}
                                    className="p-2 border border-gray-300 rounded"
                                />
                                <input
                                    type="url"
                                    placeholder="Live demo URL"
                                    value={newProject.liveUrl}
                                    onChange={(e) => setNewProject({ ...newProject, liveUrl: e.target.value })}
                                    className="p-2 border border-gray-300 rounded"
                                />
                            </div>
                            
                            {newProject.image && (
                                <img src={newProject.image} alt="Preview" className="w-32 h-20 object-cover rounded" />
                            )}
                        </div>
                        
                        <div className="flex space-x-2 mt-4">
                            <button
                                onClick={addProject}
                                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                            >
                                Add Project
                            </button>
                            <button
                                onClick={() => setIsAddingProject(false)}
                                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projectsData.map((project, index) => (
                        <ProjectCard key={project.id || index} project={project} index={index} />
                    ))}
                </div>

                {projectsData.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No projects added yet.</p>
                        {isAuthenticated && (
                            <button
                                onClick={() => setIsAddingProject(true)}
                                className="mt-4 bg-violet-500 hover:bg-violet-600 text-white px-6 py-2 rounded-lg"
                            >
                                Add Your First Project
                            </button>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
};

export default Projects;
