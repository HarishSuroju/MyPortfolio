import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogIn, LogOut, Settings, Menu, X } from 'lucide-react';
import LoginModal from '../components/LoginModal';
import CMSDashboard from '../components/CMSDashboard';

const Header = () => {
    const { isAuthenticated, logout } = useAuth();
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showCMSDashboard, setShowCMSDashboard] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleAuthAction = async () => {
        if (isAuthenticated) {
            await logout();
        } else {
            setShowLoginModal(true);
        }
        setIsMobileMenuOpen(false);
    };

    return (
        <>
            <header className="fixed w-full z-50 bg-white bg-opacity-90 backdrop-blur-sm shadow-md">
                <div className="container mx-auto px-4 py-3 sm:px-6">
                    <div className="flex items-center justify-between">
                        <a href="#" className="text-lg sm:text-2xl font-bold text-gray-900">
                            {isAuthenticated ? 'My Portfolio (Edit Mode)' : 'My Portfolio'}
                        </a>
                        <button
                            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                            className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100 xl:hidden"
                            aria-label="Toggle menu"
                        >
                            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
                        </button>
                    </div>

                    <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} mt-3 space-y-3 xl:hidden`}>
                        <nav>
                            <ul className="grid grid-cols-2 gap-2 text-sm">
                                <li><a href="#about" onClick={() => setIsMobileMenuOpen(false)} className="block rounded px-2 py-1 text-gray-700 hover:bg-gray-100">About</a></li>
                                <li><a href="#skills" onClick={() => setIsMobileMenuOpen(false)} className="block rounded px-2 py-1 text-gray-700 hover:bg-gray-100">Skills</a></li>
                                <li><a href="#projects" onClick={() => setIsMobileMenuOpen(false)} className="block rounded px-2 py-1 text-gray-700 hover:bg-gray-100">Projects</a></li>
                                <li><a href="#internships" onClick={() => setIsMobileMenuOpen(false)} className="block rounded px-2 py-1 text-gray-700 hover:bg-gray-100">Internships</a></li>
                                <li><a href="#certificates" onClick={() => setIsMobileMenuOpen(false)} className="block rounded px-2 py-1 text-gray-700 hover:bg-gray-100">Certificates</a></li>
                                <li><a href="#leetcode" onClick={() => setIsMobileMenuOpen(false)} className="block rounded px-2 py-1 text-gray-700 hover:bg-gray-100">LeetCode</a></li>
                                <li><a href="#contact" onClick={() => setIsMobileMenuOpen(false)} className="block rounded px-2 py-1 text-gray-700 hover:bg-gray-100">Contact</a></li>
                            </ul>
                        </nav>
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={handleAuthAction}
                                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm transition-colors ${
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
                                    onClick={() => {
                                        setShowCMSDashboard(true);
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className="flex items-center space-x-2 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-sm transition-colors"
                                    title="Open CMS Dashboard"
                                >
                                    <Settings size={16} />
                                    <span>CMS</span>
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="hidden xl:flex xl:items-center xl:justify-between xl:gap-6">
                        <nav>
                            <ul className="flex flex-wrap gap-4 lg:gap-6">
                                <li><a href="#about" className="text-gray-600 hover:text-accent transition-colors duration-300">About</a></li>
                                <li><a href="#skills" className="text-gray-600 hover:text-accent transition-colors duration-300">Skills</a></li>
                                <li><a href="#projects" className="text-gray-600 hover:text-accent transition-colors duration-300">Projects</a></li>
                                <li><a href="#internships" className="text-gray-600 hover:text-accent transition-colors duration-300">Internships</a></li>
                                <li><a href="#certificates" className="text-gray-600 hover:text-accent transition-colors duration-300">Certificates</a></li>
                                <li><a href="#leetcode" className="text-gray-600 hover:text-accent transition-colors duration-300">LeetCode</a></li>
                                <li><a href="#contact" className="text-gray-600 hover:text-accent transition-colors duration-300">Contact</a></li>
                            </ul>
                        </nav>

                        <div className="flex items-center space-x-2 lg:space-x-4">
                            <button
                                onClick={handleAuthAction}
                                className={`flex items-center space-x-2 px-3 lg:px-4 py-2 rounded-md transition-colors ${
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
                                    className="flex items-center space-x-2 px-3 lg:px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
                                    title="Open CMS Dashboard"
                                >
                                    <Settings size={16} />
                                    <span>CMS</span>
                                </button>
                            )}
                        </div>
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
