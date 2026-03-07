const API_BASE = 'https://alfa-leetcode-api.onrender.com';

const isValidUsername = (username) => /^[a-zA-Z0-9_-]{1,30}$/.test(username);

export const fetchLeetCodeProfile = async (username) => {
    if (!username || !isValidUsername(username)) {
        throw new Error('Invalid LeetCode username');
    }
    const response = await fetch(`${API_BASE}/${encodeURIComponent(username)}`);
    if (!response.ok) throw new Error('Failed to fetch LeetCode profile');
    return response.json();
};

export const fetchLeetCodeSolved = async (username) => {
    if (!username || !isValidUsername(username)) {
        throw new Error('Invalid LeetCode username');
    }
    const response = await fetch(`${API_BASE}/userProfile/${encodeURIComponent(username)}`);
    if (!response.ok) throw new Error('Failed to fetch solved stats');
    return response.json();
};

export const fetchLeetCodeContest = async (username) => {
    if (!username || !isValidUsername(username)) {
        throw new Error('Invalid LeetCode username');
    }
    const response = await fetch(`${API_BASE}/${encodeURIComponent(username)}/contest`);
    if (!response.ok) throw new Error('Failed to fetch contest data');
    return response.json();
};

export const fetchLeetCodeSkills = async (username) => {
    if (!username || !isValidUsername(username)) {
        throw new Error('Invalid LeetCode username');
    }
    const response = await fetch(`${API_BASE}/skillStats/${encodeURIComponent(username)}`);
    if (!response.ok) throw new Error('Failed to fetch skill stats');
    return response.json();
};
