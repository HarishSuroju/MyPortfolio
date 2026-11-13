import React from 'react';
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
import PasswordRecoveryModal from './components/PasswordRecoveryModal.jsx';

function App() {
    return (
        <AuthProvider>
            <div className="bg-gray-100 text-gray-900 font-inter">
                <Toaster 
                    position="top-right"
                    toastOptions={{
                        duration: 3000,
                        style: {
                            background: '#363636',
                            color: '#fff',
                        },
                    }}
                />
                <PasswordRecoveryModal />
                <Header />
                <main className="pt-20">
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
