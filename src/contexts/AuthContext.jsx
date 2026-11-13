import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
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
    const [user, setUser] = useState(null);
    const [isRecovery, setIsRecovery] = useState(false);

    useEffect(() => {
        if (!supabase) {
            setIsLoading(false);
            return;
        }

        // Check current session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            setIsAuthenticated(!!session?.user);
            setIsLoading(false);
        });

        // Listen for auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            // Supabase fires this when the user lands from a password-reset email link.
            if (event === 'PASSWORD_RECOVERY') setIsRecovery(true);
            setUser(session?.user ?? null);
            setIsAuthenticated(!!session?.user);
        });

        return () => subscription.unsubscribe();
    }, []);

    const login = async (email, password) => {
        if (!supabase) {
            toast.error('Supabase is not configured. Check your environment variables.');
            return false;
        }

        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
            toast.error(error.message);
            return false;
        }
        toast.success('Successfully logged in!');
        return true;
    };

    const logout = async () => {
        if (!supabase) return;
        await supabase.auth.signOut();
        toast.success('Successfully logged out!');
    };

    const resetPassword = async (email) => {
        if (!supabase) {
            toast.error('Supabase is not configured.');
            return false;
        }

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: window.location.origin,
        });
        if (error) {
            toast.error(error.message);
            return false;
        }
        toast.success('Password reset email sent! Check your inbox.');
        return true;
    };

    const updatePassword = async (newPassword) => {
        if (!supabase) return false;
        const { error } = await supabase.auth.updateUser({ password: newPassword });
        if (error) {
            toast.error(error.message);
            return false;
        }
        setIsRecovery(false);
        toast.success('Password updated. You are now logged in.');
        return true;
    };

    const value = {
        isRecovery,
        updatePassword,
        isAuthenticated,
        isLoading,
        user,
        login,
        logout,
        resetPassword
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};