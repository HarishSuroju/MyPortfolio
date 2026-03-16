import React from 'react';

const Contact = () => {
    return (
        <section id="contact" className="section nebula-section py-20 px-6">
            <div className="container mx-auto text-center">
                <h2 className="text-3xl font-bold mb-2 cosmic-text">Open a Channel</h2>
                <p className="text-sm mb-12" style={{ color: 'var(--text-secondary)', letterSpacing: '0.12em' }}>— CONTACT —</p>

                {/* Radio wave animation */}
                <div className="flex justify-center mb-10">
                    <div style={{ position: 'relative', width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div className="radio-wave" />
                        <div className="radio-wave" />
                        <div className="radio-wave" />
                        <span style={{ fontSize: '2rem', position: 'relative', zIndex: 1 }}>📡</span>
                    </div>
                </div>

                <p className="text-lg mb-8 max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
                    Transmission ready. Feel free to reach out for collaboration, opportunities, or just to say hi across the cosmos.
                </p>

                <div className="flex flex-wrap justify-center items-center gap-6 mb-8">
                    <a href="mailto:harishsurojuv@gmail.com"
                        className="inline-block font-bold py-3 px-10 rounded-full transition-all duration-300"
                        style={{
                            background: 'linear-gradient(135deg, rgba(34,211,238,0.15), rgba(96,165,250,0.15))',
                            border: '1px solid rgba(34,211,238,0.45)',
                            color: 'var(--neon-cyan)',
                            boxShadow: '0 0 20px rgba(34,211,238,0.2)',
                        }}
                        onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 40px rgba(34,211,238,0.4)'}
                        onMouseLeave={e => e.currentTarget.style.boxShadow = '0 0 20px rgba(34,211,238,0.2)'}
                    >
                        🚀 Send Transmission
                    </a>
                </div>
            </div>
        </section>
    );
};

export default Contact;
