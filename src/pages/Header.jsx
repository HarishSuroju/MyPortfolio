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
            <header style={{
                position: 'fixed', width: '100%', zIndex: 50,
                background: 'rgba(5,5,16,0.85)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                borderBottom: '1px solid rgba(96,165,250,0.15)',
                boxShadow: '0 4px 30px rgba(0,0,0,0.5)',
            }}>
                <div className="container mx-auto px-4 py-3 sm:px-6">
                    <div className="flex items-center justify-between">
                        <a href="#" className="text-lg sm:text-2xl font-bold cosmic-text">
                            {isAuthenticated ? '⚡ Portfolio (Edit Mode)' : '✦ My Portfolio'}
                        </a>
                        <button
                            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                            className="inline-flex items-center justify-center rounded-md p-2 xl:hidden"
                            style={{ color: 'var(--neon-blue)', border: '1px solid rgba(96,165,250,0.3)' }}
                            aria-label="Toggle menu"
                        >
                            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
                        </button>
                    </div>

                    <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} mt-3 space-y-3 xl:hidden`}>
                        <nav>
                            <ul className="grid grid-cols-2 gap-2 text-sm">
                                {['about','skills','projects','internships','certificates','leetcode','contact'].map(link => (
                                    <li key={link}>
                                        <a href={`#${link}`} onClick={() => setIsMobileMenuOpen(false)}
                                            className="block rounded px-2 py-1 capitalize"
                                            style={{ color: 'var(--text-secondary)', transition: 'color 0.2s' }}
                                            onMouseEnter={e => e.target.style.color = 'var(--neon-cyan)'}
                                            onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}
                                        >{link}</a>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                        <div className="flex flex-wrap gap-2">
                            <button onClick={handleAuthAction}
                                className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm transition-colors"
                                style={{
                                    background: isAuthenticated ? 'rgba(239,68,68,0.2)' : 'rgba(96,165,250,0.15)',
                                    border: `1px solid ${isAuthenticated ? 'rgba(239,68,68,0.5)' : 'rgba(96,165,250,0.4)'}`,
                                    color: isAuthenticated ? '#f87171' : 'var(--neon-blue)',
                                }}
                            >
                                {isAuthenticated ? <><LogOut size={16} /><span>Logout</span></> : <><LogIn size={16} /><span>Admin</span></>}
                            </button>
                            {isAuthenticated && (
                                <button onClick={() => { setShowCMSDashboard(true); setIsMobileMenuOpen(false); }}
                                    className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm transition-colors"
                                    style={{ background: 'rgba(167,139,250,0.15)', border: '1px solid rgba(167,139,250,0.4)', color: 'var(--neon-purple)' }}
                                    title="Open CMS Dashboard"
                                >
                                    <Settings size={16} /><span>CMS</span>
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="hidden xl:flex xl:items-center xl:justify-between xl:gap-6">
                        <nav>
                            <ul className="flex flex-wrap gap-4 lg:gap-6">
                                {['about','skills','projects','internships','certificates','leetcode','contact'].map(link => (
                                    <li key={link}>
                                        <a href={`#${link}`}
                                            className="capitalize text-sm transition-all duration-300"
                                            style={{ color: 'var(--text-secondary)', letterSpacing: '0.05em' }}
                                            onMouseEnter={e => { e.target.style.color = 'var(--neon-cyan)'; e.target.style.textShadow = '0 0 10px var(--neon-cyan)'; }}
                                            onMouseLeave={e => { e.target.style.color = 'var(--text-secondary)'; e.target.style.textShadow = 'none'; }}
                                        >{link}</a>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                        <div className="flex items-center space-x-2 lg:space-x-4">
                            <button onClick={handleAuthAction}
                                className="flex items-center space-x-2 px-3 lg:px-4 py-2 rounded-md transition-all"
                                style={{
                                    background: isAuthenticated ? 'rgba(239,68,68,0.15)' : 'rgba(96,165,250,0.1)',
                                    border: `1px solid ${isAuthenticated ? 'rgba(239,68,68,0.4)' : 'rgba(96,165,250,0.35)'}`,
                                    color: isAuthenticated ? '#f87171' : 'var(--neon-blue)',
                                }}
                            >
                                {isAuthenticated ? <><LogOut size={16} /><span>Logout</span></> : <><LogIn size={16} /><span>Admin</span></>}
                            </button>
                            {isAuthenticated && (
                                <button onClick={() => setShowCMSDashboard(true)}
                                    className="flex items-center space-x-2 px-3 lg:px-4 py-2 rounded-md transition-all"
                                    style={{ background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.35)', color: 'var(--neon-purple)' }}
                                    title="Open CMS Dashboard"
                                >
                                    <Settings size={16} /><span>CMS</span>
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
