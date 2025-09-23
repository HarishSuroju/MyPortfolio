import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Default admin credentials (in a real app, this would be handled by a backend)
    const ADMIN_EMAIL = 'admin@portfolio.com';
    const ADMIN_PASSWORD = 'admin123';

    useEffect(() => {
        // Check if user is already logged in
        const authStatus = localStorage.getItem('isAuthenticated');
        if (authStatus === 'true') {
            setIsAuthenticated(true);
        }
        setIsLoading(false);
    }, []);

    const login = (email, password) => {
        if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
            setIsAuthenticated(true);
            localStorage.setItem('isAuthenticated', 'true');
            toast.success('Successfully logged in!');
            return true;
        } else {
            toast.error('Invalid credentials');
            return false;
        }
    };

    const logout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem('isAuthenticated');
        toast.success('Successfully logged out!');
    };

    const value = {
        isAuthenticated,
        isLoading,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};