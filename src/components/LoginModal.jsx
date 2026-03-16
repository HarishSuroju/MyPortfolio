import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff, X, RotateCcw } from 'lucide-react';

const LoginModal = ({ isOpen, onClose }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [resetEmail, setResetEmail] = useState('');
    const { login, resetPassword } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await login(email, password);
        if (success) {
            setEmail('');
            setPassword('');
            onClose();
        }
    };

    const handlePasswordReset = async (e) => {
        e.preventDefault();
        const success = await resetPassword(resetEmail);
        if (success) {
            setResetEmail('');
            setShowForgotPassword(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: 'rgba(5,5,16,0.85)', backdropFilter: 'blur(8px)' }}>
            <div className="rounded-lg p-8 w-full max-w-md mx-4 relative" style={{
                background: 'var(--space-deep)',
                border: '1px solid rgba(96,165,250,0.3)',
                boxShadow: '0 0 40px rgba(96,165,250,0.15)',
            }}>
                <button onClick={onClose} className="absolute top-4 right-4 transition-all"
                    style={{ color: 'var(--text-secondary)' }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--neon-pink)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
                >
                    <X size={24} />
                </button>
                
                <h2 className="text-2xl font-bold mb-6 text-center cosmic-text">
                    {showForgotPassword ? '🔑 Reset Password' : '🛸 Admin Login'}
                </h2>
                
                {!showForgotPassword ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
                                Email
                            </label>
                            <input type="email" id="email" value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-3 py-2 rounded-md focus:outline-none"
                                style={{ background: 'rgba(96,165,250,0.08)', border: '1px solid rgba(96,165,250,0.3)', color: 'var(--text-primary)' }}
                                placeholder="Enter your email"
                            />
                        </div>
                        
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password" value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full px-3 py-2 pr-10 rounded-md focus:outline-none"
                                    style={{ background: 'rgba(96,165,250,0.08)', border: '1px solid rgba(96,165,250,0.3)', color: 'var(--text-primary)' }}
                                    placeholder="Enter your password"
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    style={{ color: 'var(--text-secondary)' }}>
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>
                        
                        <button type="submit"
                            className="w-full font-bold py-2 px-4 rounded-md transition-all"
                            style={{ background: 'linear-gradient(135deg, rgba(96,165,250,0.3), rgba(167,139,250,0.3))', border: '1px solid rgba(96,165,250,0.5)', color: 'var(--neon-cyan)' }}>
                            🚀 Login
                        </button>
                        
                        <div className="text-center mt-4">
                            <button type="button" onClick={() => setShowForgotPassword(true)}
                                className="text-sm" style={{ color: 'var(--neon-purple)' }}>
                                Forgot Password?
                            </button>
                        </div>
                    </form>
                ) : (
                    <form onSubmit={handlePasswordReset} className="space-y-4">
                        <div>
                            <label htmlFor="reset-email" className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
                                Email
                            </label>
                            <input type="email" id="reset-email" value={resetEmail}
                                onChange={(e) => setResetEmail(e.target.value)}
                                required
                                className="w-full px-3 py-2 rounded-md focus:outline-none"
                                style={{ background: 'rgba(96,165,250,0.08)', border: '1px solid rgba(96,165,250,0.3)', color: 'var(--text-primary)' }}
                                placeholder="Enter your email"
                            />
                        </div>
                        
                        <button type="submit"
                            className="w-full font-bold py-2 px-4 rounded-md transition-all"
                            style={{ background: 'linear-gradient(135deg, rgba(96,165,250,0.3), rgba(167,139,250,0.3))', border: '1px solid rgba(96,165,250,0.5)', color: 'var(--neon-cyan)' }}
                        >
                            Reset Password
                        </button>
                        
                        <div className="text-center mt-4">
                            <button type="button" onClick={() => setShowForgotPassword(false)}
                                className="text-sm flex items-center justify-center"
                                style={{ color: 'var(--neon-purple)' }}>
                                <RotateCcw size={16} className="mr-1" />
                                Back to Login
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default LoginModal;