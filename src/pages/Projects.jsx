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
        liveUrl: '',
        inProgress: false
    });
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        const loadData = async () => {
            const data = await getPortfolioData();
            setProjectsData(data.projects || []);
        };
        loadData();
    }, []);

    const updateProjectsData = async (updatedProjects) => {
        setProjectsData(updatedProjects);
        await updatePortfolioSection('projects', updatedProjects);
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
                liveUrl: '',
                inProgress: false
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
            technologies: updatedProject.technologies.filter(tech => tech.trim() !== ''),
            inProgress: Boolean(updatedProject.inProgress)
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
        const [editData, setEditData] = useState({ inProgress: false, ...project });

        const handleSave = () => {
            updateProject(index, editData);
            setIsEditing(false);
        };

        const handleCancel = () => {
            setEditData({ inProgress: false, ...project });
            setIsEditing(false);
        };

        if (isEditing) {
            return (
                <div className="space-card rounded-xl shadow-lg overflow-hidden p-6">
                    <div className="space-y-4">
                        <input
                            type="text"
                            value={editData.title}
                            onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                            placeholder="Project title"
                            className="w-full p-2 rounded text-sm"
                            style={{ background: 'rgba(96,165,250,0.08)', border: '1px solid rgba(96,165,250,0.3)', color: 'var(--text-primary)' }}
                        />
                        
                        <textarea
                            value={editData.description}
                            onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                            placeholder="Project description"
                            rows={4}
                            className="w-full p-2 rounded resize-none text-sm"
                            style={{ background: 'rgba(96,165,250,0.08)', border: '1px solid rgba(96,165,250,0.3)', color: 'var(--text-primary)' }}
                        />
                        
                        <div>
                            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Project Image</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageChange(e.target.files[0], (img) => setEditData({ ...editData, image: img }))}
                                className="w-full p-2 rounded text-sm"
                                style={{ background: 'rgba(96,165,250,0.05)', border: '1px solid rgba(96,165,250,0.2)', color: 'var(--text-secondary)' }}
                            />
                            {editData.image && (
                                <img src={editData.image} alt="Preview" className="mt-2 w-32 h-20 object-cover rounded" style={{ border: '1px solid rgba(96,165,250,0.3)' }} />
                            )}
                        </div>
                        
                        <input
                            type="text"
                            value={editData.technologies.join(', ')}
                            onChange={(e) => handleTechnologiesChange(e.target.value, setEditData, editData)}
                            placeholder="Technologies (comma separated)"
                            className="w-full p-2 rounded text-sm"
                            style={{ background: 'rgba(96,165,250,0.08)', border: '1px solid rgba(96,165,250,0.3)', color: 'var(--text-primary)' }}
                        />
                        
                        <input
                            type="url"
                            value={editData.githubUrl}
                            onChange={(e) => setEditData({ ...editData, githubUrl: e.target.value })}
                            placeholder="GitHub URL"
                            className="w-full p-2 rounded text-sm"
                            style={{ background: 'rgba(96,165,250,0.08)', border: '1px solid rgba(96,165,250,0.3)', color: 'var(--text-primary)' }}
                        />
                        
                        <input
                            type="url"
                            value={editData.liveUrl}
                            onChange={(e) => setEditData({ ...editData, liveUrl: e.target.value })}
                            placeholder="Live demo URL"
                            className="w-full p-2 rounded text-sm"
                            style={{ background: 'rgba(96,165,250,0.08)', border: '1px solid rgba(96,165,250,0.3)', color: 'var(--text-primary)' }}
                        />

                        <label className="inline-flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                            <input
                                type="checkbox"
                                checked={Boolean(editData.inProgress)}
                                onChange={(e) => setEditData({ ...editData, inProgress: e.target.checked })}
                                className="h-4 w-4"
                            />
                            Mark as In Progress
                        </label>
                        
                        <div className="flex space-x-2">
                            <button onClick={handleSave} className="p-2 rounded" style={{ background: 'rgba(52,211,153,0.2)', border: '1px solid rgba(52,211,153,0.4)', color: 'var(--neon-green)' }}>
                                <Save size={16} />
                            </button>
                            <button onClick={handleCancel} className="p-2 rounded" style={{ background: 'rgba(148,163,184,0.1)', border: '1px solid rgba(148,163,184,0.3)', color: 'var(--text-secondary)' }}>
                                <X size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className="space-card rounded-xl overflow-hidden relative group transition-all duration-300"
                style={{ cursor: 'default' }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 30px rgba(96,165,250,0.25), 0 0 60px rgba(167,139,250,0.1)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = ''}
            >
                {isAuthenticated && (
                    <div className="absolute top-2 right-2 flex space-x-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity z-10">
                        <button onClick={() => setIsEditing(true)} className="p-1 rounded" style={{ background: 'rgba(96,165,250,0.2)', border: '1px solid rgba(96,165,250,0.4)', color: 'var(--neon-blue)' }} title="Edit project">
                            <Edit size={16} />
                        </button>
                        <button onClick={() => removeProject(index)} className="p-1 rounded" style={{ background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.4)', color: '#f87171' }} title="Remove project">
                            <X size={16} />
                        </button>
                    </div>
                )}
                
                {project.image && (
                    <div className="overflow-hidden" style={{ height: '180px' }}>
                        <img src={project.image} alt={project.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" style={{ opacity: 0.85 }} />
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '180px', background: 'linear-gradient(to bottom, transparent 60%, rgba(15,15,40,0.95))' }} />
                    </div>
                )}

                {project.inProgress && (
                    <span className="absolute top-3 left-3 text-xs font-semibold px-3 py-1 rounded-full z-10"
                        style={{ background: 'rgba(251,191,36,0.2)', border: '1px solid rgba(251,191,36,0.5)', color: '#fbbf24' }}>
                        ⚡ In Progress
                    </span>
                )}
                
                <div className="p-6">
                    <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>🪐 {project.title}</h3>
                    <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>{project.description}</p>
                    
                    {project.technologies && project.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-4">
                            {project.technologies.map((tech, techIndex) => (
                                <span key={techIndex} className="px-2 py-0.5 rounded-full text-xs"
                                    style={{ background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.25)', color: 'var(--neon-purple)' }}>
                                    {tech}
                                </span>
                            ))}
                        </div>
                    )}
                    
                    <div className="flex space-x-2">
                        {project.githubUrl && (
                            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
                                className="inline-flex items-center py-1.5 px-3 rounded-full text-xs transition-all duration-200"
                                style={{ background: 'rgba(148,163,184,0.1)', border: '1px solid rgba(148,163,184,0.25)', color: 'var(--text-secondary)' }}
                                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--neon-blue)'}
                                onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(148,163,184,0.25)'}
                            >
                                <Github size={14} className="mr-1" />Code
                            </a>
                        )}
                        {project.liveUrl && (
                            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                                className="inline-flex items-center py-1.5 px-3 rounded-full text-xs transition-all duration-200"
                                style={{ background: 'rgba(96,165,250,0.1)', border: '1px solid rgba(96,165,250,0.3)', color: 'var(--neon-blue)' }}
                                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 12px rgba(96,165,250,0.3)'}
                                onMouseLeave={e => e.currentTarget.style.boxShadow = ''}
                            >
                                <ExternalLink size={14} className="mr-1" />Launch
                            </a>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <section id="projects" className="section nebula-section py-20 px-6">
            <div className="container mx-auto">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-12">
                    <div>
                        <h2 className="text-3xl font-bold cosmic-text">Star Systems</h2>
                        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)', letterSpacing: '0.1em' }}>— MY PROJECTS —</p>
                    </div>
                    {isAuthenticated && (
                        <button onClick={() => setIsAddingProject(true)}
                            className="p-2 rounded-full self-center sm:self-auto transition-all"
                            style={{ background: 'rgba(96,165,250,0.15)', border: '1px solid rgba(96,165,250,0.4)', color: 'var(--neon-blue)' }}
                            title="Add Project"
                        >
                            <Plus size={20} />
                        </button>
                    )}
                </div>

                {isAddingProject && (
                    <div className="mb-8 p-6 space-card rounded-lg shadow-lg">
                        <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--neon-cyan)' }}>🛸 Add New Star System</h3>
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input type="text" placeholder="Project title" value={newProject.title}
                                    onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                                    className="p-2 rounded text-sm"
                                    style={{ background: 'rgba(96,165,250,0.08)', border: '1px solid rgba(96,165,250,0.3)', color: 'var(--text-primary)' }}
                                />
                                <input type="file" accept="image/*"
                                    onChange={(e) => handleImageChange(e.target.files[0], (img) => setNewProject({ ...newProject, image: img }))}
                                    className="p-2 rounded text-sm"
                                    style={{ background: 'rgba(96,165,250,0.05)', border: '1px solid rgba(96,165,250,0.2)', color: 'var(--text-secondary)' }}
                                />
                            </div>
                            <textarea placeholder="Project description" value={newProject.description}
                                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                                rows={4} className="w-full p-2 rounded resize-none text-sm"
                                style={{ background: 'rgba(96,165,250,0.08)', border: '1px solid rgba(96,165,250,0.3)', color: 'var(--text-primary)' }}
                            />
                            <input type="text" placeholder="Technologies used (comma separated)" value={newProject.technologies.join(', ')}
                                onChange={(e) => handleTechnologiesChange(e.target.value, setNewProject, newProject)}
                                className="w-full p-2 rounded text-sm"
                                style={{ background: 'rgba(96,165,250,0.08)', border: '1px solid rgba(96,165,250,0.3)', color: 'var(--text-primary)' }}
                            />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input type="url" placeholder="GitHub URL" value={newProject.githubUrl}
                                    onChange={(e) => setNewProject({ ...newProject, githubUrl: e.target.value })}
                                    className="p-2 rounded text-sm"
                                    style={{ background: 'rgba(96,165,250,0.08)', border: '1px solid rgba(96,165,250,0.3)', color: 'var(--text-primary)' }}
                                />
                                <input type="url" placeholder="Live demo URL" value={newProject.liveUrl}
                                    onChange={(e) => setNewProject({ ...newProject, liveUrl: e.target.value })}
                                    className="p-2 rounded text-sm"
                                    style={{ background: 'rgba(96,165,250,0.08)', border: '1px solid rgba(96,165,250,0.3)', color: 'var(--text-primary)' }}
                                />
                            </div>
                            <label className="inline-flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                                <input type="checkbox" checked={Boolean(newProject.inProgress)}
                                    onChange={(e) => setNewProject({ ...newProject, inProgress: e.target.checked })}
                                    className="h-4 w-4"
                                />
                                Mark as In Progress
                            </label>
                            {newProject.image && (
                                <img src={newProject.image} alt="Preview" className="w-32 h-20 object-cover rounded" style={{ border: '1px solid rgba(96,165,250,0.3)' }} />
                            )}
                        </div>
                        <div className="flex space-x-2 mt-4">
                            <button onClick={addProject} className="px-4 py-2 rounded text-sm font-medium"
                                style={{ background: 'rgba(52,211,153,0.15)', border: '1px solid rgba(52,211,153,0.4)', color: 'var(--neon-green)' }}>
                                Launch Project
                            </button>
                            <button onClick={() => setIsAddingProject(false)} className="px-4 py-2 rounded text-sm"
                                style={{ background: 'rgba(148,163,184,0.1)', border: '1px solid rgba(148,163,184,0.25)', color: 'var(--text-secondary)' }}>
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
                        <p className="text-lg mb-4" style={{ color: 'var(--text-secondary)' }}>🌌 No star systems charted yet.</p>
                        {isAuthenticated && (
                            <button onClick={() => setIsAddingProject(true)}
                                className="px-6 py-2 rounded-lg text-sm font-medium"
                                style={{ background: 'rgba(96,165,250,0.15)', border: '1px solid rgba(96,165,250,0.4)', color: 'var(--neon-blue)' }}>
                                Chart Your First Project
                            </button>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
};

export default Projects;
