import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

/**
 * Shown when the admin opens the link from a "Forgot password" email.
 * Without this, the link logs the user in but gives no way to set a new password.
 */
const PasswordRecoveryModal = () => {
    const { isRecovery, updatePassword } = useAuth();
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [saving, setSaving] = useState(false);

    if (!isRecovery) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password.length < 8) {
            toast.error('Use at least 8 characters.');
            return;
        }
        if (password !== confirm) {
            toast.error('Passwords do not match.');
            return;
        }
        setSaving(true);
        const ok = await updatePassword(password);
        setSaving(false);
        if (ok) {
            setPassword('');
            setConfirm('');
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" role="dialog" aria-modal="true" aria-labelledby="recovery-title">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg p-8 w-full max-w-md mx-4 space-y-4">
                <h2 id="recovery-title" className="text-2xl font-bold text-gray-900 text-center">Set a new password</h2>
                <div>
                    <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-1">New password</label>
                    <input
                        id="new-password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={8}
                        autoComplete="new-password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                </div>
                <div>
                    <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">Confirm password</label>
                    <input
                        id="confirm-password"
                        type="password"
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                        required
                        minLength={8}
                        autoComplete="new-password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                </div>
                <button
                    type="submit"
                    disabled={saving}
                    className="w-full bg-violet-500 hover:bg-violet-600 disabled:opacity-60 text-white font-bold py-2 px-4 rounded-md transition-colors"
                >
                    {saving ? 'Saving...' : 'Update password'}
                </button>
            </form>
        </div>
    );
};

export default PasswordRecoveryModal;
