import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogIn, LogOut, Settings } from 'lucide-react';
import LoginModal from '../components/LoginModal';
import CMSDashboard from '../components/CMSDashboard';

const Header = () => {
    const { isAuthenticated, logout } = useAuth();
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showCMSDashboard, setShowCMSDashboard] = useState(false);

    const handleAuthAction = async () => {
        if (isAuthenticated) {
            await logout();
        } else {
            setShowLoginModal(true);
        }
    };

    return (
        <>
            <header className="fixed w-full z-50 bg-white bg-opacity-90 backdrop-blur-sm shadow-md py-4">
                <div className="container mx-auto flex justify-between items-center px-6">
                    <a href="#" className="text-2xl font-bold text-gray-900">
                        {isAuthenticated ? '✏️ My Portfolio (Edit Mode)' : 'My Portfolio'}
                    </a>
                    <div className="flex items-center space-x-6">
                        <nav>
                            <ul className="flex space-x-6">
                                <li><a href="#about" className="text-gray-600 hover:text-accent transition-colors duration-300">About</a></li>
                                <li><a href="#skills" className="text-gray-600 hover:text-accent transition-colors duration-300">Skills</a></li>
                                <li><a href="#projects" className="text-gray-600 hover:text-accent transition-colors duration-300">Projects</a></li>
                                <li><a href="#internships" className="text-gray-600 hover:text-accent transition-colors duration-300">Internships</a></li>
                                <li><a href="#certificates" className="text-gray-600 hover:text-accent transition-colors duration-300">Certificates</a></li>
                                <li><a href="#leetcode" className="text-gray-600 hover:text-accent transition-colors duration-300">LeetCode</a></li>
                                <li><a href="#contact" className="text-gray-600 hover:text-accent transition-colors duration-300">Contact</a></li>
                            </ul>
                        </nav>
                        <button
                            onClick={handleAuthAction}
                            className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                                isAuthenticated 
                                    ? 'bg-red-500 hover:bg-red-600 text-white' 
                                    : 'bg-violet-500 hover:bg-violet-600 text-white'
                            }`}
                        >
                            {isAuthenticated ? (
                                <>
                                    <LogOut size={16} />
                                    <span>Logout</span>
                                </>
                            ) : (
                                <>
                                    <LogIn size={16} />
                                    <span>Admin</span>
                                </>
                            )}
                        </button>
                        
                        {isAuthenticated && (
                            <button
                                onClick={() => setShowCMSDashboard(true)}
                                className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
                                title="Open CMS Dashboard"
                            >
                                <Settings size={16} />
                                <span>CMS</span>
                            </button>
                        )}
                    </div>
                </div>
            </header>
            
            <LoginModal 
                isOpen={showLoginModal} 
                onClose={() => setShowLoginModal(false)} 
            />
            
            <CMSDashboard 
                isOpen={showCMSDashboard} 
                onClose={() => setShowCMSDashboard(false)} 
            />
        </>
    );
};

export default Header;
