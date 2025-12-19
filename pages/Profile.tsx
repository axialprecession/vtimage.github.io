
import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { ViewState } from '../types';
import { Camera, Save, User, Mail, Upload, Trash2, AlertTriangle, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const Profile: React.FC = () => {
  const { t } = useLanguage();
  const { user, updateProfile, deleteAccount } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!user) return <div className="p-12 text-center">Please log in to view profile.</div>;

  const handleSave = () => {
    updateProfile(name);
    setIsEditing(false);
  };

  const handleDelete = () => {
    deleteAccount();
    // No need to redirect manually, the auth state change will trigger re-renders in App.tsx
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        updateProfile(name, base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-gray-900">{t('profile.title')}</h1>
          <p className="text-gray-600">{t('profile.manage')}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-8">
          {/* Header Background */}
          <div className="h-32 bg-brand-dark"></div>
          
          <div className="px-8 pb-8">
            <div className="relative flex items-end -mt-16 mb-6">
              <div className="relative">
                <div className="w-32 h-32 rounded-full border-4 border-white bg-gray-200 overflow-hidden flex items-center justify-center">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-4xl font-serif font-bold text-gray-400">{user.name.charAt(0)}</span>
                  )}
                </div>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors text-black"
                  title="Upload new photo"
                >
                  <Camera className="w-4 h-4" />
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </div>
              <div className="ml-6 mb-2">
                <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
                <p className="text-gray-500 text-sm">Member since 2025</p>
              </div>
            </div>

            <div className="space-y-6 max-w-lg">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2 mb-4">
                <h3 className="text-lg font-medium text-gray-900">{t('profile.title')}</h3>
                <button 
                  onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                    isEditing 
                    ? 'bg-black text-white hover:bg-gray-800' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {isEditing ? <><Save className="w-4 h-4"/> {t('profile.save')}</> : t('profile.edit')}
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                  <User className="w-4 h-4" /> {t('contact.form.name')}
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                  />
                ) : (
                  <p className="text-gray-900 px-4 py-2 bg-gray-50 rounded-lg">{user.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                  <Mail className="w-4 h-4" /> {t('contact.form.email')}
                </label>
                <p className="text-gray-500 px-4 py-2 bg-gray-50 rounded-lg border border-transparent cursor-not-allowed">
                  {user.email}
                </p>
              </div>

            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-red-100">
            <div className="px-8 py-6">
                <h3 className="text-lg font-bold text-red-600 mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" /> Danger Zone
                </h3>
                <p className="text-gray-500 text-sm mb-6">
                    Deleting your account is permanent. All your data, including story submissions and history, will be removed.
                </p>
                <button 
                    onClick={() => setShowDeleteConfirm(true)}
                    className="px-6 py-3 bg-red-50 text-red-600 rounded-lg font-bold text-sm hover:bg-red-600 hover:text-white transition-all flex items-center gap-2"
                >
                    <Trash2 className="w-4 h-4" /> Delete My Account
                </button>
            </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-slide-up relative">
                <button 
                    onClick={() => setShowDeleteConfirm(false)}
                    className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                    <X className="w-5 h-5 text-gray-400" />
                </button>
                
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                    <AlertTriangle className="w-8 h-8 text-red-600" />
                </div>
                
                <h3 className="text-2xl font-serif font-bold text-center mb-4">Are you absolutely sure?</h3>
                <p className="text-center text-gray-500 mb-8 leading-relaxed">
                    This action cannot be undone. This will permanently delete your account <b>{user.email}</b> and remove your data from our servers.
                </p>
                
                <div className="flex gap-4">
                    <button 
                        onClick={() => setShowDeleteConfirm(false)}
                        className="flex-1 py-4 rounded-xl font-bold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleDelete}
                        className="flex-1 py-4 rounded-xl font-bold bg-red-600 text-white hover:bg-red-700 transition-colors shadow-lg shadow-red-200"
                    >
                        Yes, Delete
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};
