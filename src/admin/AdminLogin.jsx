import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { TextInput } from './ui';

const AdminLogin = () => {
    const { login, resetPassword } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [mode, setMode] = useState('login');
    const [busy, setBusy] = useState(false);

    const submit = async (e) => {
        e.preventDefault();
        setBusy(true);
        if (mode === 'login') await login(email, password);
        else if (await resetPassword(email)) setMode('login');
        setBusy(false);
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
            <form onSubmit={submit} className="w-full max-w-sm space-y-5 rounded-2xl bg-white p-8 shadow-xl">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">{mode === 'login' ? 'Admin sign in' : 'Reset password'}</h1>
                    <p className="mt-1 text-sm text-slate-600">
                        {mode === 'login' ? 'Manage your portfolio content.' : "We'll email you a link to set a new password."}
                    </p>
                </div>

                <TextInput label="Email" type="email" value={email} onChange={setEmail} required autoComplete="email" />

                {mode === 'login' && (
                    <div className="relative">
                        <TextInput
                            label="Password"
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={setPassword}
                            required
                            autoComplete="current-password"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((s) => !s)}
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                            className="absolute bottom-2 right-3 text-slate-500 hover:text-slate-700"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={busy}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-violet-600 py-2.5 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-60"
                >
                    {busy && <Loader2 size={16} className="animate-spin" />}
                    {mode === 'login' ? 'Sign in' : 'Send reset link'}
                </button>

                <div className="flex items-center justify-between text-sm">
                    <button type="button" onClick={() => setMode(mode === 'login' ? 'reset' : 'login')} className="text-violet-600 hover:text-violet-800">
                        {mode === 'login' ? 'Forgot password?' : 'Back to sign in'}
                    </button>
                    <Link to="/" className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-700">
                        <ArrowLeft size={14} /> Back to site
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default AdminLogin;
