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
        { name: "SQL", level: 70, category: "Database" }
    ],
    projects: [
        {
            id: 1,
            title: "Scientific Live Calculator",
            description: "A scientific calculator web app with live evaluation, built with HTML, CSS and JavaScript.",
            image: "/Calci.png",
            technologies: ["Html", "Css", "JavaScript"],
            githubUrl: "https://github.com/HarishSuroju/calci.git",
            liveUrl: "https://calci-two-psi.vercel.app/"
        }
    ],
    internships: [],
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
        email: "harishsurojuv@gmail.com",
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
// Data management utilities - Supabase (primary) + localStorage (cache/fallback)
// ---------------------------------------------------------------------------

const CACHE_KEY = 'portfolioData';

// localStorage can throw (quota exceeded, private mode, blocked storage).
// Persistence to the cache must never break saving to the database.
const readCache = () => {
    try {
        const raw = localStorage.getItem(CACHE_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
};

const writeCache = (data) => {
    try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(data));
        return true;
    } catch (error) {
        console.warn('Could not write portfolio cache (storage full or unavailable):', error);
        return false;
    }
};

const toRows = (data) =>
    Object.keys(data).map((key) => ({ section_key: key, data: data[key] }));

// One shared in-flight request: every section calls getPortfolioData() on mount,
// so without this the full dataset is downloaded once per section.
let inFlight = null;
let memory = null;

const fetchPortfolioData = async () => {
    if (supabase) {
        try {
            const { data, error } = await supabase
                .from('portfolio_sections')
                .select('section_key, data');

            if (error) throw error;

            if (data && data.length > 0) {
                const portfolioData = { ...defaultPortfolioData };
                data.forEach((row) => {
                    portfolioData[row.section_key] = row.data;
                });
                writeCache(portfolioData);
                return portfolioData;
            }
            // Table exists but is empty - show defaults
            return { ...defaultPortfolioData };
        } catch (error) {
            console.error('Supabase fetch failed, using cache:', error);
        }
    }

    const cached = readCache();
    return cached ? { ...defaultPortfolioData, ...cached } : { ...defaultPortfolioData };
};

/**
 * Fetch the full portfolio object (deduplicated across callers).
 * Tries Supabase first, caches in localStorage, falls back to cache / defaults.
 */
export const getPortfolioData = () => {
    if (memory) return Promise.resolve(memory);
    if (!inFlight) {
        inFlight = fetchPortfolioData()
            .then((data) => {
                memory = data;
                return data;
            })
            .finally(() => {
                inFlight = null;
            });
    }
    return inFlight;
};

const invalidate = (data) => {
    memory = data ?? null;
};

/**
 * Save the entire portfolio object (bulk write). Returns true only if the
 * database write succeeded (or Supabase is not configured).
 */
export const savePortfolioData = async (data) => {
    if (!data || typeof data !== 'object' || Array.isArray(data)) {
        throw new Error('Portfolio data must be a JSON object keyed by section.');
    }

    invalidate({ ...defaultPortfolioData, ...data });
    writeCache(memory);

    if (supabase) {
        try {
            const { error } = await supabase
                .from('portfolio_sections')
                .upsert(toRows(data), { onConflict: 'section_key' });

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
 * Update a single section (partial write). Returns true on success.
 */
export const updatePortfolioSection = async (section, sectionData) => {
    const current = memory || readCache() || { ...defaultPortfolioData };
    invalidate({ ...current, [section]: sectionData });
    writeCache(memory);

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
 * Reset all data to defaults (DB + cache). Returns { data, saved }.
 */
export const resetPortfolioData = async () => {
    const defaults = { ...defaultPortfolioData };
    invalidate(defaults);
    writeCache(defaults);

    let saved = true;
    if (supabase) {
        try {
            const { error } = await supabase
                .from('portfolio_sections')
                .upsert(toRows(defaults), { onConflict: 'section_key' });
            if (error) throw error;
        } catch (error) {
            console.error('Supabase reset failed:', error);
            saved = false;
        }
    }
    return { data: defaults, saved };
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
    const saved = await updatePortfolioSection('certificates', defaultPortfolioData.certificates);
    return { data: updatedData, saved };
};

/**
 * Push current default data to Supabase (first-time DB initialization).
 */
export const initializeDatabase = async () => {
    if (!supabase) throw new Error('Supabase is not configured');

    const defaults = { ...defaultPortfolioData };
    const { error } = await supabase
        .from('portfolio_sections')
        .upsert(toRows(defaults), { onConflict: 'section_key' });

    if (error) throw error;
    invalidate(defaults);
    writeCache(defaults);
    return true;
};

// ---------------------------------------------------------------------------
// Image handling utilities (client-side only)
// ---------------------------------------------------------------------------

const MAX_IMAGE_DIMENSION = 1600;

const readAsDataURL = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
    });

/**
 * Reads an image and downsizes it (max 1600px, WebP/JPEG) so the stored data
 * URL stays small enough for the database row and localStorage cache.
 * GIFs are kept as-is to preserve animation.
 */
export const handleImageUpload = async (file) => {
    if (!file) throw new Error('No file provided');

    const original = await readAsDataURL(file);
    if (file.type === 'image/gif') return original;

    try {
        const img = await new Promise((resolve, reject) => {
            const image = new Image();
            image.onload = () => resolve(image);
            image.onerror = () => reject(new Error('Failed to decode image'));
            image.src = original;
        });

        const scale = Math.min(1, MAX_IMAGE_DIMENSION / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);

        const compressed = canvas.toDataURL('image/webp', 0.85);
        // Use the smaller of the two (some browsers fall back to PNG for webp).
        return compressed.startsWith('data:image/webp') && compressed.length < original.length
            ? compressed
            : original;
    } catch {
        return original;
    }
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