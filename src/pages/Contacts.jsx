import React, { useState, useEffect } from 'react';
import { getPortfolioData } from '../utils/dataManager';

const FALLBACK_EMAIL = 'harishsurojuv@gmail.com';

const Contact = () => {
    const [email, setEmail] = useState(FALLBACK_EMAIL);

    // The email lives in the CMS "contact" section, so it can be changed without a redeploy.
    useEffect(() => {
        getPortfolioData().then((data) => {
            if (data.contact?.email) setEmail(data.contact.email);
        });
    }, []);

    return (
        <section id="contact" className="section py-20 px-6 bg-white">
            <div className="container mx-auto text-center">
                <h2 className="text-3xl font-bold mb-4">Let's build something amazing together!</h2>
                <p className="text-lg text-gray-700 mb-8">Feel free to reach out to me for collaboration or just to say hi.</p>
                <div className="flex flex-wrap justify-center items-center gap-6 mb-8">
                    <a
                        href={`mailto:${email}`}
                        className="bg-violet-500 hover:bg-violet-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-transform transform hover:scale-105"
                    >
                        Say Hello
                    </a>
                </div>
            </div>
        </section>
    );
};

export default Contact;
