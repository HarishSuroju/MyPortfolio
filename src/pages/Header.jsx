import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Settings, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { usePortfolio } from '../contexts/DataContext';

const Header = () => {
    const { isAuthenticated } = useAuth();
    const { data } = usePortfolio();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const site = data.site;
    const links = (site?.navLinks || []).filter((link) => link.visible !== false);
    // The LeetCode section hides itself without a username, so hide its link too.
    const visibleLinks = links.filter((link) => link.target !== '#leetcode' || data.leetcode?.username);

    const close = () => setIsMobileMenuOpen(false);

    return (
        <header className="fixed w-full z-50 bg-white/90 backdrop-blur-sm shadow-md">
            <div className="container mx-auto px-4 sm:px-6">
                <div className="flex h-16 items-center justify-between gap-6">
                    <a href="#hero" className="truncate text-lg sm:text-2xl font-bold text-gray-900">
                        {site?.brandName || 'Portfolio'}
                    </a>

                    <nav className="hidden xl:block" aria-label="Main">
                        <ul className="flex items-center gap-6">
                            {visibleLinks.map((link) => (
                                <li key={link.id}>
                                    <a href={link.target} className="text-gray-600 hover:text-accent transition-colors duration-300">
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <div className="flex items-center gap-2">
                        {isAuthenticated && (
                            <Link
                                to="/admin"
                                className="inline-flex items-center gap-2 rounded-md bg-violet-500 px-3 py-2 text-sm text-white transition-colors hover:bg-violet-600"
                            >
                                <Settings size={16} />
                                <span className="hidden sm:inline">Edit site</span>
                            </Link>
                        )}
                        <button
                            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                            className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100 xl:hidden"
                            aria-label="Toggle menu"
                            aria-expanded={isMobileMenuOpen}
                        >
                            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
                        </button>
                    </div>
                </div>

                {isMobileMenuOpen && (
                    <nav className="pb-3 xl:hidden" aria-label="Mobile">
                        <ul className="grid grid-cols-2 gap-2 text-sm">
                            {visibleLinks.map((link) => (
                                <li key={link.id}>
                                    <a href={link.target} onClick={close} className="block rounded px-2 py-1 text-gray-700 hover:bg-gray-100">
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </nav>
                )}
            </div>
        </header>
    );
};

export default Header;
