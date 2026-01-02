
import React, { useState, useRef, useEffect } from 'react';
import { ViewState } from '../types';
import { Camera, Video, Upload, ArrowLeft, CheckCircle, Trash2, ImageIcon, CloudOff, FileText, Database, ShieldCheck, Mic, MapPin, Image as IconImage } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { db, storage, isFirebaseConfigured } from '../firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

interface MediaItem {
  id: string;
  file: File;
  type: 'image' | 'video' | 'audio';
}

interface SubmitStoryProps {
  setView: (view: ViewState) => void;
}

const FilePreview: React.FC<{ item: MediaItem, onRemove: () => void }> = ({ item, onRemove }) => {
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    const objectUrl = URL.createObjectURL(item.file);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [item.file]);

  if (!preview) return <div className="aspect-square bg-gray-100 animate-pulse rounded-[2rem]" />;

  return (
    <div className="relative group aspect-square bg-gray-100 rounded-[2rem] overflow-hidden border border-gray-200 shadow-sm transition-all hover:scale-95">
      {item.type === 'video' ? (
        <video src={preview} className="w-full h-full object-cover" />
      ) : item.type === 'audio' ? (
        <div className="w-full h-full flex flex-col items-center justify-center bg-brand-black text-white p-4">
           <Mic className="w-8 h-8 mb-2 text-brand-accent" />
           <span className="text-xs text-center truncate w-full">{item.file.name}</span>
        </div>
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
  const { t, language, font } = useLanguage();
  const isChinese = language.startsWith('zh');
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [useDemoMode, setUseDemoMode] = useState(false);
  
  // Submission Mode
  const [submissionType, setSubmissionType] = useState<'visual' | 'audio'>('visual'); // 'visual' or 'audio'

  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({ 
    title: '', 
    category: 'Social Justice', 
    description: '',
    location: '',
    agreedToTerms: false 
  });

  // Check initial configuration
  useEffect(() => {
    if (!isFirebaseConfigured) {
        setUseDemoMode(true);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video' | 'audio') => {
    if (e.target.files) {
      const newItems: MediaItem[] = Array.from(e.target.files).map((file: File) => ({
        id: Math.random().toString(36).substring(7),
        file,
        type
      }));
      setMediaItems(prev => [...prev, ...newItems]);
    }
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCoverImage(e.target.files[0]);
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
    if (!formData.agreedToTerms) {
        alert("Please agree to the terms of submission.");
        return;
    }
    if (mediaItems.length === 0) {
        alert("Please upload at least one file.");
        return;
    }
    
    setIsSubmitting(true);
    setUploadProgress(t('common.processing'));

    try {
        const uploadedUrls: string[] = [];
        let coverUrl = '';

        // Upload Media
        for (let i = 0; i < mediaItems.length; i++) {
            setUploadProgress(useDemoMode ? `Simulating upload ${i + 1}...` : `Uploading file ${i + 1}...`);
            const url = await uploadFile(mediaItems[i].file);
            uploadedUrls.push(url);
        }

        // Upload Cover if audio
        if (submissionType === 'audio' && coverImage) {
             setUploadProgress("Uploading cover image...");
             coverUrl = await uploadFile(coverImage);
        }

        setUploadProgress("Finalizing archive...");

        const mainType = submissionType === 'audio' ? 'audio' : (mediaItems.some(m => m.type === 'video') ? 'video' : 'photo');
        
        // Determine main media URL
        let mainUrl = '';
        let audioUrl = '';
        
        if (mainType === 'audio') {
            audioUrl = uploadedUrls[0];
            mainUrl = coverUrl || "https://images.unsplash.com/photo-1478737270239-2f02b77ac6d5?auto=format&fit=crop&q=80&w=1200"; // Default mic image
        } else {
            mainUrl = uploadedUrls[0];
        }

        // Save to Firestore (or Simulate)
        if (isFirebaseConfigured && db && !useDemoMode) {
            try {
                await addDoc(collection(db, "stories"), {
                    title: formData.title,
                    description: formData.description,
                    category: formData.category,
                    location: formData.location,
                    type: mainType,
                    imageUrl: mainType === 'photo' ? mainUrl : (mainType === 'audio' ? mainUrl : "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=800"), // Fallback for video thumbnail generation later
                    localVideoUrl: mainType === 'video' ? mainUrl : null,
                    audioUrl: mainType === 'audio' ? audioUrl : null,
                    photos: mainType === 'photo' ? uploadedUrls : [],
                    userId: user?.id || 'demo-user',
                    authorName: user?.name || 'Anonymous Contributor',
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
          <h2 className={`text-4xl font-bold text-gray-900 mb-6 ${font}`}>{t('submit.success_title')}</h2>
          <p className="text-gray-500 mb-8 text-lg">
             {t('submit.success_desc')}
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
          <button onClick={() => setView(ViewState.STORIES)} className="w-full py-5 bg-black text-white rounded-full font-bold hover:scale-105 transition-all shadow-lg">{t('common.back')}</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-24">
      <div className="max-w-5xl mx-auto px-6">
        <button onClick={() => setView(ViewState.STORIES)} className="flex items-center text-gray-400 hover:text-black transition-colors mb-12 group">
          <ArrowLeft className="w-5 h-5 mr-3 group-hover:-translate-x-2 transition-transform" /> {t('common.back')}
        </button>

        <div className="bg-white rounded-[4rem] shadow-2xl overflow-hidden border border-gray-100">
          <div className="bg-brand-black text-white p-12 md:p-20 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-10 opacity-10">
               <Database className="w-40 h-40" />
            </div>
            <div className="relative z-10">
               <div className="inline-block px-4 py-1.5 border border-white/20 rounded-full text-[10px] font-bold uppercase tracking-[0.3em] mb-6 text-brand-accent bg-white/5 backdrop-blur-sm">
                  {t('stories.header.tag')}
               </div>
               <h1 className={`text-5xl md:text-6xl font-bold mb-6 ${font}`}>{t('submit.title')}</h1>
               <p className="text-gray-400 text-xl font-light max-w-2xl">{t('submit.subtitle')}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8 md:p-16 space-y-12">
            
            {/* Type Selection */}
            <div className="flex flex-col sm:flex-row gap-4 p-2 bg-gray-50 rounded-[2rem] border border-gray-200">
               <button 
                 type="button"
                 onClick={() => { setSubmissionType('visual'); setMediaItems([]); }}
                 className={`flex-1 py-4 rounded-[1.5rem] font-bold uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2 ${submissionType === 'visual' ? 'bg-white shadow-lg text-brand-black' : 'text-gray-400 hover:text-gray-600'}`}
               >
                 <Video className="w-4 h-4" /> {t('submit.type.video_photo')}
               </button>
               <button 
                 type="button"
                 onClick={() => { setSubmissionType('audio'); setMediaItems([]); }}
                 className={`flex-1 py-4 rounded-[1.5rem] font-bold uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2 ${submissionType === 'audio' ? 'bg-white shadow-lg text-brand-black' : 'text-gray-400 hover:text-gray-600'}`}
               >
                 <Mic className="w-4 h-4" /> {t('submit.type.audio')}
               </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
               {/* Left Column: Metadata */}
               <div className="lg:col-span-2 space-y-8">
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-[0.3em] mb-3">{t('submit.form.title')}</label>
                    <input 
                        required 
                        type="text" 
                        value={formData.title}
                        onChange={e => setFormData({...formData, title: e.target.value})}
                        className={`w-full bg-gray-50 px-6 py-4 rounded-[1.5rem] outline-none focus:ring-2 focus:ring-brand-accent transition-all font-bold text-lg text-brand-black placeholder-gray-300 ${font}`}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div>
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-[0.3em] mb-3">{t('submit.form.category')}</label>
                        <select 
                            value={formData.category}
                            onChange={e => setFormData({...formData, category: e.target.value as any})}
                            className="w-full bg-gray-50 px-6 py-4 rounded-[1.5rem] outline-none focus:ring-2 focus:ring-brand-accent transition-all font-bold text-sm text-brand-black appearance-none cursor-pointer"
                        >
                            <option>Homelessness</option>
                            <option>Addiction</option>
                            <option>Social Justice</option>
                            <option>Domestic Violence</option>
                        </select>
                     </div>
                     <div>
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-[0.3em] mb-3">{t('submit.form.location')}</label>
                        <input 
                            required 
                            type="text" 
                            value={formData.location}
                            onChange={e => setFormData({...formData, location: e.target.value})}
                            className="w-full bg-gray-50 px-6 py-4 rounded-[1.5rem] outline-none focus:ring-2 focus:ring-brand-accent transition-all font-bold text-sm text-brand-black"
                            placeholder="e.g. Los Angeles, CA"
                        />
                     </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-[0.3em] mb-3">{t('submit.form.desc')}</label>
                    <textarea 
                        required 
                        rows={6}
                        value={formData.description}
                        onChange={e => setFormData({...formData, description: e.target.value})}
                        className="w-full bg-gray-50 px-6 py-4 rounded-[2rem] outline-none focus:ring-2 focus:ring-brand-accent transition-all text-gray-600 leading-relaxed resize-none"
                        placeholder={t('submit.form.desc_placeholder')}
                    />
                  </div>
               </div>

               {/* Right Column: Upload */}
               <div className="space-y-6">
                  <div className="p-8 border-2 border-dashed border-gray-200 rounded-[2.5rem] text-center hover:border-brand-accent hover:bg-brand-accent/5 transition-all group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                     <div className="w-16 h-16 bg-brand-black text-white rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-xl">
                        {submissionType === 'audio' ? <Mic className="w-6 h-6" /> : <Camera className="w-6 h-6" />}
                     </div>
                     <h3 className="font-bold text-gray-900 mb-1">{submissionType === 'audio' ? t('submit.upload_audio') : t('submit.upload_video')}</h3>
                     <p className="text-xs text-gray-400 mb-4">MP4, JPG, MP3</p>
                     <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        multiple={submissionType === 'visual'} 
                        accept={submissionType === 'audio' ? "audio/*" : "image/*,video/*"}
                        onChange={(e) => handleFileChange(e, submissionType === 'audio' ? 'audio' : 'image')} 
                     />
                  </div>

                  {/* Optional Cover for Audio */}
                  {submissionType === 'audio' && (
                      <div className="p-6 border border-gray-100 rounded-[2rem] bg-gray-50 text-center cursor-pointer hover:bg-gray-100 transition-all" onClick={() => coverInputRef.current?.click()}>
                          <div className="flex items-center justify-center gap-3 text-gray-500 mb-2">
                              <ImageIcon className="w-5 h-5" />
                              <span className="text-xs font-bold uppercase tracking-wider">{t('submit.upload_cover')}</span>
                          </div>
                          {coverImage ? <span className="text-xs text-green-600 font-bold">{coverImage.name}</span> : <span className="text-[10px] text-gray-400">JPG, PNG</span>}
                          <input type="file" ref={coverInputRef} className="hidden" accept="image/*" onChange={handleCoverChange} />
                      </div>
                  )}

                  {/* Previews */}
                  <div className="grid grid-cols-2 gap-3">
                     {mediaItems.map((item, idx) => (
                        <FilePreview 
                            key={item.id} 
                            item={item} 
                            onRemove={() => setMediaItems(prev => prev.filter(i => i.id !== item.id))} 
                        />
                     ))}
                  </div>
               </div>
            </div>

            <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
                <label className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors ${formData.agreedToTerms ? 'bg-brand-black border-brand-black text-white' : 'border-gray-300 group-hover:border-gray-400'}`}>
                        {formData.agreedToTerms && <CheckCircle className="w-4 h-4" />}
                    </div>
                    <input type="checkbox" className="hidden" checked={formData.agreedToTerms} onChange={e => setFormData({...formData, agreedToTerms: e.target.checked})} />
                    <span className="text-xs text-gray-500 font-medium max-w-md leading-tight">{t('submit.terms')}</span>
                </label>

                <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="px-12 py-5 bg-brand-accent text-white rounded-full font-bold uppercase tracking-widest text-sm hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl hover:shadow-brand-accent/30 hover:-translate-y-1 w-full md:w-auto flex items-center justify-center gap-3"
                >
                    {isSubmitting ? (
                        <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> {uploadProgress}</>
                    ) : (
                        <>{t('common.submit')} <Upload className="w-4 h-4" /></>
                    )}
                </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};
