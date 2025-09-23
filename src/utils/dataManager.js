// Default portfolio data structure
const defaultPortfolioData = {
    hero: {
        name: "Harish Suroju",
        title: "A passionate software developer with a love for building cool things.",
        profileImage: "/src/assets/me.jpg",
        backgroundImage: "/src/assets/portfolio bg.jpg"
    },
    about: {
        title: "About Me",
        description: "I'm a passionate software developer with experience in modern web technologies. I love creating innovative solutions and learning new technologies.\n\nMy journey in web development began with a curiosity for how things work, and it quickly evolved into a passion for crafting engaging user experiences.\n\nWhen I'm not coding, you can find me exploring new technologies, contributing to open-source projects, or sipping coffee while sketching out new ideas.",
        skills: ["JavaScript", "React", "Node.js", "Python", "Java"],
        experience: "2+ years of development experience",
        profileImage: "/src/assets/me.jpg"
    },
    skills: [
        { name: "JavaScript", level: 90, category: "Frontend" },
        { name: "React", level: 85, category: "Frontend" },
        { name: "Node.js", level: 80, category: "Backend" },
        { name: "Python", level: 75, category: "Backend" },
        { name: "Java", level: 85, category: "Backend" },
        { name: "SQL", level: 80, category: "Database" }
    ],
    projects: [
        {
            id: 1,
            title: "E-commerce Platform",
            description: "A full-stack e-commerce solution built with React and Node.js",
            image: "/api/placeholder/400/300",
            technologies: ["React", "Node.js", "MongoDB"],
            githubUrl: "https://github.com/username/project1",
            liveUrl: "https://project1.com"
        }
    ],
    internships: [
        {
            id: 1,
            company: "Tech Company",
            position: "Software Development Intern",
            duration: "Jun 2023 - Aug 2023",
            description: "Worked on web development projects using React and Node.js",
            skills: ["React", "Node.js", "Git"]
        }
    ],
    certificates: [
        {
            id: 1,
            title: "DSA in Java by NPTEL",
            issuer: "NPTEL",
            date: "2023",
            image: "/src/assets/HArish DSA in Java by NPTEL.png",
            description: "Data Structures and Algorithms certification"
        },
        {
            id: 2,
            title: "DBMS SQL by ORACLE",
            issuer: "Oracle",
            date: "2023",
            image: "/src/assets/Harish DBMS SQL by ORACLE.png",
            description: "Database Management Systems certification"
        },
        {
            id: 3,
            title: "Problem Solving through Programming in C",
            issuer: "NPTEL",
            date: "2023",
            image: "/src/assets/Harish PSP using C by NPTEL.png",
            description: "Programming in C certification"
        },
        {
            id: 4,
            title: "C++ Programming",
            issuer: "Saylor Academy",
            date: "2023",
            image: "/src/assets/Saylor C++.png",
            description: "C++ Programming certification"
        },
        {
            id: 5,
            title: "Adobe Creative Workshop",
            issuer: "Adobe",
            date: "2023",
            image: "/src/assets/Adobe Participation img.png",
            description: "Adobe Creative Suite workshop participation"
        },
        {
            id: 6,
            title: "TCS iON Career Edge",
            issuer: "TCS iON",
            date: "2023",
            image: "/src/assets/tcsion.png",
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
    }
};

// Data management utilities
export const getPortfolioData = () => {
    const savedData = localStorage.getItem('portfolioData');
    if (savedData) {
        try {
            return JSON.parse(savedData);
        } catch (error) {
            console.error('Error parsing portfolio data:', error);
            return defaultPortfolioData;
        }
    }
    return defaultPortfolioData;
};

export const savePortfolioData = (data) => {
    try {
        localStorage.setItem('portfolioData', JSON.stringify(data));
        return true;
    } catch (error) {
        console.error('Error saving portfolio data:', error);
        return false;
    }
};

export const updatePortfolioSection = (section, data) => {
    const currentData = getPortfolioData();
    const updatedData = {
        ...currentData,
        [section]: data
    };
    return savePortfolioData(updatedData);
};

export const resetPortfolioData = () => {
    localStorage.removeItem('portfolioData');
    return defaultPortfolioData;
};

// Force reset function to load all certificates
export const resetCertificates = () => {
    const currentData = getPortfolioData();
    const updatedData = {
        ...currentData,
        certificates: defaultPortfolioData.certificates
    };
    savePortfolioData(updatedData);
    return updatedData;
};

// Image handling utilities
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