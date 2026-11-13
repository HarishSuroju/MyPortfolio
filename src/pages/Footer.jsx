import React from 'react';
import { usePortfolio } from '../contexts/DataContext';

// Ignore leftover sample links such as https://github.com/username
const isReal = (url) => Boolean(url) && !/\/username\/?$/i.test(url);

const Footer = () => {
    const { data } = usePortfolio();
    const social = data.contact?.socialLinks || {};
    const links = [
        ['GitHub', social.github],
        ['LinkedIn', social.linkedin],
        ['Twitter', social.twitter],
    ].filter(([, url]) => isReal(url));

    return (
        <footer className="bg-primary text-secondary py-8 mt-12">
            <div className="container mx-auto px-6 text-center space-y-3">
                {links.length > 0 && (
                    <ul className="flex flex-wrap justify-center gap-5 text-sm">
                        {links.map(([label, url]) => (
                            <li key={label}>
                                <a href={url} target="_blank" rel="noopener noreferrer" className="hover:text-white underline-offset-4 hover:underline">
                                    {label}
                                </a>
                            </li>
                        ))}
                    </ul>
                )}
                <p>&copy; {new Date().getFullYear()} {data.site?.footerText}</p>
            </div>
        </footer>
    );
};

export default Footer;
