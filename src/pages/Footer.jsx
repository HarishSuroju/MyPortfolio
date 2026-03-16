import React from 'react';

const Footer = () => {
    return (
        <footer className="py-8 mt-0" style={{
            background: 'rgba(5,5,16,0.95)',
            borderTop: '1px solid rgba(96,165,250,0.15)',
            position: 'relative',
            zIndex: 1,
        }}>
            <div className="container mx-auto text-center px-6">
                <p className="cosmic-text font-semibold mb-1">✦ My Portfolio</p>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    &copy; {new Date().getFullYear()} — Crafted among the stars
                </p>
            </div>
        </footer>
    );
};

export default Footer;
