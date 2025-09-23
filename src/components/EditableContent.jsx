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
                            className="w-full p-2 border border-gray-300 rounded"
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
                        className="w-full p-2 border border-gray-300 rounded resize-none"
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
                        className="w-full p-2 border border-gray-300 rounded"
                        autoFocus
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
                    <button
                        onClick={handleSave}
                        className="bg-green-500 hover:bg-green-600 text-white p-2 rounded"
                        title="Save"
                    >
                        <Save size={16} />
                    </button>
                    <button
                        onClick={handleCancel}
                        className="bg-gray-500 hover:bg-gray-600 text-white p-2 rounded"
                        title="Cancel"
                    >
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
                className="absolute top-0 right-0 bg-violet-500 hover:bg-violet-600 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                title="Edit"
            >
                {type === 'image' ? <Upload size={16} /> : <Edit size={16} />}
            </button>
        </div>
    );
};

export default EditableContent;