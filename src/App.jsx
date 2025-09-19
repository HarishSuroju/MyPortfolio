import React, { useEffect } from 'react';
import Header from './pages/Header.jsx';
import Hero from './pages/Hero.jsx';
import About from './pages/About.jsx';
import Skills from './pages/Skills.jsx';
import Projects from './pages/Projects.jsx';
import Internships from './pages/Internships.jsx';
import Certificates from './pages/Certificates.jsx';
import Contact from './pages/Contacts.jsx';
import Footer from './pages/Footer.jsx';

function App() {
    useEffect(() => {
        // Intersection Observer for scroll animations
        const sections = document.querySelectorAll('.section');
        const observerOptions = {
            root: null,
            threshold: 0.2,
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        sections.forEach(section => {
            observer.observe(section);
        });

        // Typing effect on the hero section
        const heroText = "A passionate software developer with a love for building cool things.";
        let i = 0;
        const typingElement = document.getElementById("hero-typing-text");

        if (typingElement) {
            typingElement.innerHTML = '';
            function typeWriter() {
                if (i < heroText.length) {
                    typingElement.innerHTML += heroText.charAt(i);
                    i++;
                    setTimeout(typeWriter, 50);
                } else {
                    typingElement.classList.remove('typing-effect');
                    typingElement.style.borderRight = 'none';
                }
            }
            typeWriter();
        }
    }, []);

    return (
        <div className="bg-gray-100 text-gray-900 font-inter scroll-smooth">
            <Header />
            <main className="pt-20">
                <Hero />
                <About />
                <Skills />
                <Projects />
                <Internships />
                <Certificates />
                <Contact />
            </main>
            <Footer />
        </div>
    );
}

export default App;
