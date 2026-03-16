import React, { useEffect, useRef } from 'react';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import Header from './pages/Header.jsx';
import Hero from './pages/Hero.jsx';
import About from './pages/About.jsx';
import Skills from './pages/Skills.jsx';
import Projects from './pages/Projects.jsx';
import Internships from './pages/Internships.jsx';
import Certificates from './pages/Certificates.jsx';
import Contact from './pages/Contacts.jsx';
import LeetCode from './pages/LeetCode.jsx';
import Footer from './pages/Footer.jsx';

/* Generates a random starfield + shooting stars into #starfield */
function buildStarfield(container) {
    const fragment = document.createDocumentFragment();
    // Static stars
    for (let i = 0; i < 220; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        const size = Math.random() * 2.5 + 0.5;
        star.style.cssText = `
            width:${size}px; height:${size}px;
            top:${Math.random() * 100}%;
            left:${Math.random() * 100}%;
            --dur:${(Math.random() * 4 + 2).toFixed(1)}s;
            --delay:-${(Math.random() * 5).toFixed(1)}s;
            opacity:${Math.random() * 0.7 + 0.2};
        `;
        fragment.appendChild(star);
    }
    // Shooting stars
    for (let i = 0; i < 5; i++) {
        const s = document.createElement('div');
        s.className = 'shooting-star';
        s.style.cssText = `
            top:${Math.random() * 60}%;
            left:${Math.random() * 60}%;
            --sdur:${(Math.random() * 3 + 2).toFixed(1)}s;
            --sdelay:${(Math.random() * 8).toFixed(1)}s;
        `;
        fragment.appendChild(s);
    }
    container.appendChild(fragment);
}

function App() {
    const starfieldRef = useRef(null);

    useEffect(() => {
        if (starfieldRef.current) buildStarfield(starfieldRef.current);

        // Intersection Observer for scroll animations
        const sections = document.querySelectorAll('.section');
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    obs.unobserve(entry.target);
                }
            });
        }, { root: null, threshold: 0.15 });
        sections.forEach(s => observer.observe(s));

        return () => observer.disconnect();
    }, []);

    return (
        <AuthProvider>
            <div className="scroll-smooth" style={{ background: 'var(--space-bg)', color: 'var(--text-primary)', minHeight: '100vh' }}>
                {/* Animated starfield background */}
                <div id="starfield" ref={starfieldRef} />

                <Toaster
                    position="top-right"
                    toastOptions={{
                        duration: 3000,
                        style: {
                            background: 'rgba(10,10,46,0.95)',
                            color: '#e2e8f0',
                            border: '1px solid rgba(96,165,250,0.3)',
                            boxShadow: '0 0 20px rgba(96,165,250,0.2)',
                        },
                    }}
                />
                <Header />
                <main className="pt-20" style={{ position: 'relative', zIndex: 1 }}>
                    <Hero />
                    <About />
                    <Skills />
                    <Projects />
                    <Internships />
                    <Certificates />
                    <LeetCode />
                    <Contact />
                </main>
                <Footer />
            </div>
        </AuthProvider>
    );
}

export default App;
