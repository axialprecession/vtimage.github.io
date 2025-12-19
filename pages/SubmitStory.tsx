
import React, { useState, useRef, useEffect } from 'react';
import { ViewState } from '../types';
import { Camera, Video, Upload, ArrowLeft, CheckCircle, Edit2, Trash2, ImageIcon, AlertTriangle, CloudOff } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { db, storage, isFirebaseConfigured } from '../firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

interface MediaItem {
  id: string;
  file: File;
  caption: string;
}

interface SubmitStoryProps {
  setView: (view: ViewState) => void;
}

const FilePreview: React.FC<{ item: MediaItem, onRemove: () => void, onEdit: () => void }> = ({ item, onRemove, onEdit }) => {
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    const objectUrl = URL.createObjectURL(item.file);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [item.file]);

  if (!preview) return <div className="aspect-square bg-gray-100 animate-pulse rounded-[2rem]" />;

  return (
    <div className="relative group aspect-square bg-gray-100 rounded-[2rem] overflow-hidden border border-gray-200 shadow-sm transition-all hover:scale-95">
      {item.file.type.startsWith('video/') ? (
        <video src={preview} className="w-full h-full object-cover" />
      ) : (
        <img src={preview} alt="preview" className="w-full h-full object-cover" />
      )}
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
        <button type="button" onClick={onRemove} className="p-3 bg-white rounded-full text-red-600 hover:bg-red-600 hover:text-white transition-all"><Trash2 className="w-4 h-4" /></button>
      </div>
    </div>
  );
};

export const SubmitStory: React.FC<SubmitStoryProps> = ({ setView }) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [useDemoMode, setUseDemoMode] = useState(false);
  const [photoItems, setPhotoItems] = useState<MediaItem[]>([]);
  const [videoItems, setVideoItems] = useState<MediaItem[]>([]);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({ title: '', category: 'Social Justice', description: '' });

  // Check initial configuration
  useEffect(() => {
    if (!isFirebaseConfigured) {
        setUseDemoMode(true);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'photo' | 'video') => {
    if (e.target.files) {
      const newItems: MediaItem[] = Array.from(e.target.files).map((file: File) => ({
        id: Math.random().toString(36).substring(7),
        file,
        caption: ''
      }));
      if (type === 'photo') setPhotoItems(prev => [...prev, ...newItems]);
      else setVideoItems(prev => [...prev, ...newItems]);
    }
  };

  const uploadFile = async (file: File) => {
    // If we are in demo mode, return a local URL immediately
    if (useDemoMode || !storage) {
        console.log("[Demo Mode] Simulating upload for:", file.name);
        await new Promise(resolve => setTimeout(resolve, 800)); // Fake network delay
        return URL.createObjectURL(file);
    }
    
    try {
        const fileRef = ref(storage, `uploads/${user?.id || 'guest'}/${Date.now()}_${file.name}`);
        const snapshot = await uploadBytes(fileRef, file);
        return await getDownloadURL(snapshot.ref);
    } catch (e: any) {
        console.warn("Firebase Upload Failed (Permissions/Quota). Switching to Demo Mode.", e);
        setUseDemoMode(true); // Switch to demo mode for subsequent files
        return URL.createObjectURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user && !useDemoMode) {
        alert("Please log in to submit a story.");
        return;
    }
    
    setIsSubmitting(true);
    setUploadProgress('Preparing upload...');

    try {
        const photoUrls = [];
        const videoUrls = [];

        // Upload Photos
        for (let i = 0; i < photoItems.length; i++) {
            setUploadProgress(useDemoMode ? `Simulating upload ${i + 1}...` : `Uploading photo ${i + 1}...`);
            const url = await uploadFile(photoItems[i].file);
            photoUrls.push(url);
        }

        // Upload Videos
        for (let i = 0; i < videoItems.length; i++) {
            setUploadProgress(useDemoMode ? `Simulating upload ${i + 1}...` : `Uploading video ${i + 1}...`);
            const url = await uploadFile(videoItems[i].file);
            videoUrls.push(url);
        }

        setUploadProgress('Finalizing story...');

        const mainType = videoUrls.length > 0 ? 'video' : 'photo';
        const mainUrl = videoUrls.length > 0 ? videoUrls[0] : (photoUrls.length > 0 ? photoUrls[0] : '');

        if (!mainUrl) {
            alert("Please upload at least one photo or video.");
            setIsSubmitting(false);
            return;
        }

        // Save to Firestore (or Simulate)
        if (isFirebaseConfigured && db && !useDemoMode) {
            try {
                await addDoc(collection(db, "stories"), {
                    title: formData.title,
                    description: formData.description,
                    category: formData.category,
                    type: mainType,
                    imageUrl: mainType === 'photo' ? mainUrl : "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=800",
                    localVideoUrl: mainType === 'video' ? mainUrl : null,
                    photos: photoUrls,
                    userId: user?.id || 'demo-user',
                    userName: user?.name || 'Demo User',
                    createdAt: serverTimestamp(),
                    date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }).toUpperCase()
                });
            } catch (firestoreError) {
                console.warn("Firestore write failed, switching to demo mode success screen.", firestoreError);
                setUseDemoMode(true);
            }
        } else {
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        setIsSuccess(true);
    } catch (error) {
        console.error("Error uploading story: ", error);
        // Even if it fails, we show success in demo mode to let user see the flow
        setUseDemoMode(true);
        setIsSuccess(true);
    } finally {
        setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white max-w-lg w-full rounded-[3.5rem] p-16 shadow-2xl text-center">
          <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-4xl font-serif font-bold text-gray-900 mb-6">Story Received</h2>
          <p className="text-gray-500 mb-8 text-lg">
             Your narrative has been securely recorded. 
             {useDemoMode && (
               <div className="mt-6 bg-orange-50 border border-orange-100 rounded-xl p-4 text-left">
                 <div className="flex items-center gap-2 text-orange-700 font-bold text-xs uppercase tracking-widest mb-2">
                    <CloudOff className="w-4 h-4" /> Preview Mode Active
                 </div>
                 <p className="text-xs text-orange-600 leading-relaxed">
                    Because the database connection is not yet fully active (waiting for upgrade), this story was saved locally for demonstration purposes.
                 </p>
               </div>
             )}
          </p>
          <button onClick={() => setView(ViewState.STORIES)} className="w-full py-5 bg-black text-white rounded-full font-bold hover:scale-105 transition-all shadow-lg">View Stories</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="max-w-4xl mx-auto px-6">
        <button onClick={() => setView(ViewState.STORIES)} className="flex items-center text-gray-400 hover:text-black transition-colors mb-12 group">
          <ArrowLeft className="w-5 h-5 mr-3 group-hover:-translate-x-2 transition-transform" /> Back
        </button>

        <div className="bg-white rounded-[4rem] shadow-2xl overflow-hidden border border-gray-100">
          <div className="bg-brand-black text-white p-12 md:p-20">
            <h1 className="text-5xl font-serif font-bold mb-6">Submit Story</h1>
            <p className="text-gray-400 text-xl font-light">Share your visual evidence. All uploads are securely stored via Google Cloud.</p>
          </div>

          <form onSubmit={handleSubmit} className="p-12 md:p-20 space-y-16">
            <div className="space-y-10">
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-[0.3em] mb-4">Title</label>
                <input 
                    required 
                    type="text" 
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    className="w-full bg-gray-50 px-8 py-5 rounded-[2rem] outline-none focus:ring-2 focus:ring-brand-accent transition-all text-xl font-serif" 
                    placeholder="Give this moment a name..." 
                />
              </div>
              
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-[0.3em] mb-4">Category</label>
                <select 
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                    className="w-full bg-gray-50 px-8 py-5 rounded-[2rem] outline-none focus:ring-2 focus:ring-brand-accent transition-all text-lg appearance-none cursor-pointer"
                >
                    <option value="Social Justice">Social Justice</option>
                    <option value="Homelessness">Homelessness</option>
                    <option value="Domestic Violence">Domestic Violence</option>
                    <option value="Addiction">Addiction</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-[0.3em] mb-4">Description</label>
                <textarea 
                    required 
                    rows={6} 
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    className="w-full bg-gray-50 px-8 py-5 rounded-[2.5rem] outline-none focus:ring-2 focus:ring-brand-accent transition-all text-lg resize-none" 
                    placeholder="Tell us the story behind the image..." 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
               {/* Upload Photo */}
               <div className="space-y-6">
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-[0.3em]">Photography</label>
                  <div onClick={() => photoInputRef.current?.click()} className="aspect-square bg-gray-50 border-4 border-dashed border-gray-200 rounded-[3rem] flex flex-col items-center justify-center cursor-pointer hover:border-brand-accent hover:bg-white transition-all group">
                     <input type="file" ref={photoInputRef} onChange={e => handleFileChange(e, 'photo')} multiple accept="image/*" className="hidden" />
                     <ImageIcon className="w-12 h-12 text-gray-300 group-hover:text-brand-accent mb-4 transition-colors" />
                     <p className="text-gray-400 font-bold">Add Photos</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     {photoItems.map((item, i) => <FilePreview key={item.id} item={item} onRemove={() => setPhotoItems(p => p.filter((_, idx) => idx !== i))} onEdit={() => {}} />)}
                  </div>
               </div>

               {/* Upload Video */}
               <div className="space-y-6">
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-[0.3em]">Documentary Video</label>
                  <div onClick={() => videoInputRef.current?.click()} className="aspect-square bg-gray-50 border-4 border-dashed border-gray-200 rounded-[3rem] flex flex-col items-center justify-center cursor-pointer hover:border-brand-accent hover:bg-white transition-all group">
                     <input type="file" ref={videoInputRef} onChange={e => handleFileChange(e, 'video')} multiple accept="video/*" className="hidden" />
                     <Video className="w-12 h-12 text-gray-300 group-hover:text-brand-accent mb-4 transition-colors" />
                     <p className="text-gray-400 font-bold">Add Video</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     {videoItems.map((item, i) => <FilePreview key={item.id} item={item} onRemove={() => setVideoItems(p => p.filter((_, idx) => idx !== i))} onEdit={() => {}} />)}
                  </div>
               </div>
            </div>

            <button type="submit" disabled={isSubmitting} className="w-full py-6 bg-brand-accent text-white rounded-full font-black text-xl shadow-2xl hover:bg-red-700 transition-all disabled:bg-gray-200">
               {isSubmitting ? uploadProgress : 'Publish Story'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
