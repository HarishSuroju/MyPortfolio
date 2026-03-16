import React, { useState } from 'react';
import { Edit, Save, X, Upload } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { handleImageUpload, validateImageFile } from '../utils/dataManager';
import toast from 'react-hot-toast';

const EditableContent = ({ 
    children, 
    value, 
    onSave, 
    type = 'text', 
    placeholder = 'Click to edit...',
    className = '',
    multiline = false 
}) => {
    const { isAuthenticated } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(value || '');

    if (!isAuthenticated) {
        return <div className={className}>{children}</div>;
    }

    const handleSave = () => {
        onSave(editValue);
        setIsEditing(false);
        toast.success('Content updated successfully!');
    };

    const handleCancel = () => {
        setEditValue(value || '');
        setIsEditing(false);
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            validateImageFile(file);
            const imageDataUrl = await handleImageUpload(file);
            setEditValue(imageDataUrl);
        } catch (error) {
            toast.error(error.message);
        }
    };

    if (isEditing) {
        return (
            <div className={`relative ${className}`}>
                {type === 'image' ? (
                    <div className="space-y-2">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="w-full p-2 rounded"
                            style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(96,165,250,0.3)', color: 'var(--text-primary)' }}
                        />
                        {editValue && (
                            <img 
                                src={editValue} 
                                alt="Preview" 
                                className="max-w-xs max-h-40 object-cover rounded"
                            />
                        )}
                    </div>
                ) : multiline ? (
                    <textarea
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        placeholder={placeholder}
                        className="w-full p-2 rounded resize-none"
                        style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(96,165,250,0.3)', color: 'var(--text-primary)', outline: 'none' }}
                        rows={4}
                        autoFocus
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && e.ctrlKey) {
                                handleSave();
                            }
                        }}
                    />
                ) : (
                    <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        placeholder={placeholder}
                        className="w-full p-2 rounded"
                        style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(96,165,250,0.3)', color: 'var(--text-primary)', outline: 'none' }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleSave();
                            }
                            if (e.key === 'Escape') {
                                handleCancel();
                            }
                        }}
                    />
                )}
                
                <div className="flex space-x-2 mt-2">
                    <button onClick={handleSave}
                        className="p-2 rounded transition-all"
                        style={{ background: 'rgba(52,211,153,0.2)', border: '1px solid var(--neon-green)', color: 'var(--neon-green)' }}
                        title="Save">
                        <Save size={16} />
                    </button>
                    <button onClick={handleCancel}
                        className="p-2 rounded transition-all"
                        style={{ background: 'rgba(96,165,250,0.1)', border: '1px solid rgba(96,165,250,0.3)', color: 'var(--text-secondary)' }}
                        title="Cancel">
                        <X size={16} />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={`relative group ${className}`}>
            {children}
            <button
                onClick={() => setIsEditing(true)}
                className="absolute top-1 right-1 p-1.5 rounded opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all"
                style={{ background: 'rgba(167,139,250,0.25)', border: '1px solid var(--neon-purple)', color: 'var(--neon-purple)' }}
                title="Edit"
            >
                {type === 'image' ? <Upload size={16} /> : <Edit size={16} />}
            </button>
        </div>
    );
};

export default EditableContent;
