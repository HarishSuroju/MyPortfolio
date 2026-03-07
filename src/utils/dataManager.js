import { supabase } from '../lib/supabase';

// Default portfolio data structure
const defaultPortfolioData = {
    hero: {
        name: "Harish Suroju",
        title: "A passionate software developer with a love for building cool things.",
        profileImage: "/me.jpg",
        backgroundImage: "/portfolio bg.jpg"
    },
    about: {
        title: "About Me",
        description: "I'm a passionate software developer with experience in modern web technologies. I love creating innovative solutions and learning new technologies.\n\nMy journey in web development began with a curiosity for how things work, and it quickly evolved into a passion for crafting engaging user experiences.\n\nWhen I'm not coding, you can find me exploring new technologies, contributing to open-source projects, or sipping coffee while sketching out new ideas.",
        skills: ["JavaScript", "React", "Node.js", "Python", "Java"],
        experience: "2+ years of development experience",
        profileImage: "/me.jpg"
    },
    skills: [
        { name: "Java", level: 70, category: "Programming" },
        { name: "Python", level: 60, category: "Programming" },
        { name: "JavaScript", level: 65, category: "Frontend" },
        { name: "React", level: 60, category: "Frontend" },
        { name: "Node.js", level: 50, category: "Backend" },
        { name: "Java", level: 60, category: "Backend" },
        { name: "SQL", level: 70, category: "Database" }
    ],
    projects: [
        {
            id: 1,
            title: "Scientific Live Calculater",
            description: "A simple calculator application implemented in Java for performing basic arithmetic operations.",
            image: "/Calci.png",
            technologies: ["Html", "Css", "JavaScript"],
            githubUrl: "https://github.com/HarishSuroju/calci.git",
            liveUrl: "https://calci-two-psi.vercel.app/"
        }
    ],
    certificates: [
        {
            id: 1,
            title: "DSA in Java by NPTEL",
            issuer: "NPTEL",
            date: "2023",
            image: "/HArish DSA in Java by NPTEL.png",
            description: "Data Structures and Algorithms certification"
        },
        {
            id: 2,
            title: "DBMS SQL by ORACLE",
            issuer: "Oracle",
            date: "2023",
            image: "/Harish DBMS SQL by ORACLE.png",
            description: "Database Management Systems certification"
        },
        {
            id: 3,
            title: "Problem Solving through Programming in C",
            issuer: "NPTEL",
            date: "2023",
            image: "/Harish PSP using C by NPTEL.png",
            description: "Programming in C certification"
        },
        {
            id: 4,
            title: "C++ Programming",
            issuer: "Saylor Academy",
            date: "2023",
            image: "/Saylor-CPP.png",
            description: "C++ Programming certification"
        },
        {
            id: 5,
            title: "Adobe Creative Workshop",
            issuer: "Adobe",
            date: "2023",
            image: "/Adobe Participation img.png",
            description: "Adobe Creative Suite workshop participation"
        },
        {
            id: 6,
            title: "TCS iON Career Edge",
            issuer: "TCS iON",
            date: "2023",
            image: "/tcsion.png",
            description: "Professional development certification"
        }
    ],
    contact: {
        email: "harish@example.com",
        phone: "+1234567890",
        location: "City, Country",
        socialLinks: {
            linkedin: "https://linkedin.com/in/username",
            github: "https://github.com/username",
            twitter: "https://twitter.com/username"
        }
    },
    leetcode: {
        username: ""
    }
};

// ---------------------------------------------------------------------------
// Data management utilities — Supabase (primary) + localStorage (cache/fallback)
// ---------------------------------------------------------------------------

/**
 * Fetch the full portfolio object.
 * Tries Supabase first, caches in localStorage, falls back to localStorage / defaults.
 */
export const getPortfolioData = async () => {
    // Try Supabase
    if (supabase) {
        try {
            const { data, error } = await supabase
                .from('portfolio_sections')
                .select('section_key, data');

            if (error) throw error;

            if (data && data.length > 0) {
                const portfolioData = { ...defaultPortfolioData };
                data.forEach(row => {
                    portfolioData[row.section_key] = row.data;
                });
                // Cache for fast subsequent loads
                localStorage.setItem('portfolioData', JSON.stringify(portfolioData));
                return portfolioData;
            }
            // Table exists but is empty — return defaults
            return defaultPortfolioData;
        } catch (error) {
            console.error('Supabase fetch failed, using cache:', error);
        }
    }

    // Fallback: localStorage cache → defaults
    const cached = localStorage.getItem('portfolioData');
    if (cached) {
        try {
            return JSON.parse(cached);
        } catch {
            // corrupt cache
        }
    }
    return defaultPortfolioData;
};

/**
 * Save the entire portfolio object (bulk write).
 */
export const savePortfolioData = async (data) => {
    // Update localStorage cache immediately
    localStorage.setItem('portfolioData', JSON.stringify(data));

    if (supabase) {
        try {
            const rows = Object.keys(data).map(key => ({
                section_key: key,
                data: data[key],
            }));

            const { error } = await supabase
                .from('portfolio_sections')
                .upsert(rows, { onConflict: 'section_key' });

            if (error) throw error;
            return true;
        } catch (error) {
            console.error('Supabase bulk save failed:', error);
            return false;
        }
    }
    return true;
};

/**
 * Update a single section (partial write).
 */
export const updatePortfolioSection = async (section, sectionData) => {
    // Update localStorage cache immediately for instant UI
    const cached = localStorage.getItem('portfolioData');
    const currentData = cached ? JSON.parse(cached) : { ...defaultPortfolioData };
    currentData[section] = sectionData;
    localStorage.setItem('portfolioData', JSON.stringify(currentData));

    if (supabase) {
        try {
            const { error } = await supabase
                .from('portfolio_sections')
                .upsert(
                    { section_key: section, data: sectionData },
                    { onConflict: 'section_key' }
                );

            if (error) throw error;
            return true;
        } catch (error) {
            console.error('Supabase section update failed:', error);
            return false;
        }
    }
    return true;
};

/**
 * Reset all data to defaults (DB + cache).
 */
export const resetPortfolioData = async () => {
    localStorage.setItem('portfolioData', JSON.stringify(defaultPortfolioData));

    if (supabase) {
        try {
            const rows = Object.keys(defaultPortfolioData).map(key => ({
                section_key: key,
                data: defaultPortfolioData[key],
            }));

            const { error } = await supabase
                .from('portfolio_sections')
                .upsert(rows, { onConflict: 'section_key' });

            if (error) throw error;
        } catch (error) {
            console.error('Supabase reset failed:', error);
        }
    }
    return defaultPortfolioData;
};

/**
 * Reset certificates section to defaults.
 */
export const resetCertificates = async () => {
    const currentData = await getPortfolioData();
    const updatedData = {
        ...currentData,
        certificates: defaultPortfolioData.certificates
    };
    await savePortfolioData(updatedData);
    return updatedData;
};

/**
 * Push current default data to Supabase (first-time DB initialization).
 */
export const initializeDatabase = async () => {
    if (!supabase) throw new Error('Supabase is not configured');

    const rows = Object.keys(defaultPortfolioData).map(key => ({
        section_key: key,
        data: defaultPortfolioData[key],
    }));

    const { error } = await supabase
        .from('portfolio_sections')
        .upsert(rows, { onConflict: 'section_key' });

    if (error) throw error;
    localStorage.setItem('portfolioData', JSON.stringify(defaultPortfolioData));
    return true;
};

// ---------------------------------------------------------------------------
// Image handling utilities (unchanged — these are client-side only)
// ---------------------------------------------------------------------------

export const handleImageUpload = (file) => {
    return new Promise((resolve, reject) => {
        if (!file) {
            reject(new Error('No file provided'));
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            resolve(e.target.result);
        };
        reader.onerror = () => {
            reject(new Error('Failed to read file'));
        };
        reader.readAsDataURL(file);
    });
};

export const validateImageFile = (file) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
        throw new Error('Invalid file type. Please upload a JPEG, PNG, or GIF image.');
    }

    if (file.size > maxSize) {
        throw new Error('File size too large. Please upload an image smaller than 5MB.');
    }

    return true;
};