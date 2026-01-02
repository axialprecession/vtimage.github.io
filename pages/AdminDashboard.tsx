
import React, { useState, useEffect } from 'react';
import { ViewState, Resource, Story } from '../types';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Plus, Trash2, MapPin, Phone, Database, FileText, Edit2, X, Save, RefreshCw, Mic, Calendar, User, AlertCircle, Video, Image as ImageIcon, Loader2 } from 'lucide-react';
import { db, isFirebaseConfigured } from '../firebaseConfig';
import { collection, addDoc, getDocs, deleteDoc, updateDoc, doc, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { resources as staticResources } from '../data/resources';

interface AdminDashboardProps {
  setView: (view: ViewState) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ setView }) => {
  const { user, isLoading: authLoading } = useAuth();
  const { t, language, font } = useLanguage();
  const isChinese = language.startsWith('zh');
  const [activeTab, setActiveTab] = useState<'resources' | 'stories'>('resources');
  
  // Mock Data Generators based on Language (Moved inside component to access current language)
  const getMockStories = (): Story[] => [
    {
      id: 'demo-story-1',
      type: 'video',
      title: isChinese ? "無聲的吶喊: 洛杉磯 Skid Row 紀實" : "Silent Cry: Inside Skid Row",
      category: 'Homelessness',
      description: isChinese 
        ? "這部 4K 紀錄短片捕捉了清晨五點的 Skid Row。我們不使用煽情的配樂，只保留街道最真實的環境音。" 
        : "This 4K documentary short captures Skid Row at 5 AM. We use no dramatic music, only the raw ambient sounds of the street.",
      date: "JAN 2026",
      imageUrl: "https://images.unsplash.com/photo-1444212477490-ca407925329e?auto=format&fit=crop&q=80&w=1200", 
      localVideoUrl: "",
      authorName: "VTI Team"
    },
    {
      id: 'demo-story-2',
      type: 'photo',
      title: isChinese ? "重生: 走過成癮的十年" : "Rebirth: Ten Years After Addiction",
      category: 'Addiction',
      description: isChinese
        ? "透過與三位康復者的深度訪談，我們探索了加州藥物成癮問題背後的社會結構缺口。"
        : "Through deep interviews with three recovering addicts, we explore the gaps in California's social structure.",
      date: "DEC 2025",
      imageUrl: "https://images.unsplash.com/photo-1501769214405-5e5ee5125a02?auto=format&fit=crop&q=80&w=1200", 
      localVideoUrl: "",
      location: "San Francisco, CA",
      authorName: "Sarah Jenkins"
    }
  ];

  // State for loading
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Data State
  const [stories, setStories] = useState<Story[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);

  // Resource Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [resourceForm, setResourceForm] = useState<Partial<Resource>>({
    region: 'South',
    type: 'Shelter',
    name: '',
    location: '',
    contact: '',
    description: '',
    operatingHours: 'Mon-Fri 9am-5pm',
    website: ''
  });

  // Story Form State
  const [editingStoryId, setEditingStoryId] = useState<string | null>(null);
  const [storyForm, setStoryForm] = useState<Partial<Story>>({
    title: '',
    category: 'Homelessness',
    description: '',
    location: '',
    authorName: 'VTI Team',
    type: 'video',
    imageUrl: '',
    localVideoUrl: '',
    audioUrl: '',
    date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }).toUpperCase()
  });

  useEffect(() => {
    // Only redirect if auth is finished loading and user is NOT admin
    if (!authLoading && !user?.isAdmin) {
      setView(ViewState.HOME);
    }
  }, [user, authLoading, setView]);

  // Fetch data when tab or language changes
  useEffect(() => {
    if (activeTab === 'stories') {
        fetchStories();
    } else {
        fetchResources();
    }
  }, [activeTab, language]); 

  const fetchStories = async () => {
      setIsLoadingData(true);
      if (isFirebaseConfigured && db) {
          try {
              const q = query(collection(db, "stories"), orderBy("createdAt", "desc"));
              const snapshot = await getDocs(q);
              const fetchedStories: Story[] = [];
              snapshot.forEach(doc => {
                  fetchedStories.push({ id: doc.id, ...doc.data() } as Story);
              });
              // Append mock stories if DB is empty for better demo experience
              setStories(fetchedStories.length > 0 ? fetchedStories : getMockStories()); 
          } catch (e) {
              console.error("Error fetching stories", e);
              setStories(getMockStories());
          }
      } else {
          // Demo Mode: Use localized mock data
          setStories(getMockStories());
      }
      setIsLoadingData(false);
  };

  const fetchResources = async () => {
      setIsLoadingData(true);
      if (isFirebaseConfigured && db) {
          try {
              const q = query(collection(db, "resources"), orderBy("createdAt", "desc"));
              const snapshot = await getDocs(q);
              const fetchedResources: Resource[] = [];
              snapshot.forEach(doc => {
                  fetchedResources.push({ id: doc.id, ...doc.data() } as Resource);
              });
              setResources(fetchedResources); 
          } catch (e) {
              console.error("Error fetching resources", e);
              setResources(staticResources.slice(0, 5));
          }
      } else {
          // Demo Mode
          if (resources.length === 0) setResources(staticResources.slice(0, 5));
      }
      setIsLoadingData(false);
  };

  const resetForm = () => {
    if (activeTab === 'resources') {
        setResourceForm({
            region: 'South',
            type: 'Shelter',
            name: '',
            location: '',
            contact: '',
            description: '',
            operatingHours: 'Mon-Fri 9am-5pm',
            website: ''
        });
        setEditingId(null);
    } else {
        setStoryForm({
            title: '',
            category: 'Homelessness',
            description: '',
            location: '',
            authorName: 'VTI Team',
            type: 'video',
            imageUrl: '',
            localVideoUrl: '',
            audioUrl: '',
            date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }).toUpperCase()
        });
        setEditingStoryId(null);
    }
  };

  const handleResourceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
        if (isFirebaseConfigured && db) {
            if (editingId) {
                const docRef = doc(db, "resources", editingId);
                await updateDoc(docRef, { ...resourceForm, updatedAt: serverTimestamp() });
            } else {
                await addDoc(collection(db, "resources"), { ...resourceForm, createdAt: serverTimestamp(), isDynamic: true });
            }
            alert(t('admin.success'));
            fetchResources();
        } else {
            // Demo Simulation
            await new Promise(r => setTimeout(r, 500));
            if (editingId) {
                setResources(prev => prev.map(r => r.id === editingId ? { ...r, ...resourceForm } as Resource : r));
            } else {
                const newRes = { ...resourceForm, id: `demo-${Date.now()}`, isDynamic: true } as Resource;
                setResources(prev => [newRes, ...prev]);
            }
            alert(t('admin.success') + " (Preview Mode)");
        }
        resetForm();
    } catch (e) {
        console.error(e);
        alert(t('common.error'));
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleStorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
        if (isFirebaseConfigured && db) {
            if (editingStoryId) {
                const docRef = doc(db, "stories", editingStoryId);
                await updateDoc(docRef, { ...storyForm, updatedAt: serverTimestamp() });
            } else {
                await addDoc(collection(db, "stories"), { ...storyForm, createdAt: serverTimestamp() });
            }
            alert(t('admin.success'));
            fetchStories();
        } else {
            // Demo Simulation
            await new Promise(r => setTimeout(r, 500));
            if (editingStoryId) {
                setStories(prev => prev.map(s => s.id === editingStoryId ? { ...s, ...storyForm } as Story : s));
            } else {
                const newStory = { ...storyForm, id: `demo-story-${Date.now()}` } as Story;
                setStories(prev => [newStory, ...prev]);
            }
            alert(t('admin.success') + " (Preview Mode)");
        }
        resetForm();
    } catch (e) {
        console.error(e);
        alert(t('common.error'));
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleEditResource = (res: Resource) => {
      setResourceForm(res);
      setEditingId(res.id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEditStory = (story: Story) => {
      setStoryForm(story);
      setEditingStoryId(story.id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteResource = async (id: string) => {
      if (!confirm(t('admin.delete_confirm'))) return;
      
      if (isFirebaseConfigured && db) {
          try {
              await deleteDoc(doc(db, "resources", id));
              setResources(prev => prev.filter(r => r.id !== id));
              if (editingId === id) resetForm();
          } catch (e) { console.error(e); alert(t('common.error')); }
      } else {
          setResources(prev => prev.filter(r => r.id !== id));
          if (editingId === id) resetForm();
      }
  };

  const handleDeleteStory = async (storyId: string) => {
      if (!confirm(t('admin.delete_confirm'))) return;
      
      if (isFirebaseConfigured && db) {
          try {
              await deleteDoc(doc(db, "stories", storyId));
              setStories(prev => prev.filter(s => s.id !== storyId));
              if (editingStoryId === storyId) resetForm();
          } catch (e) { console.error(e); alert(t('common.error')); }
      } else {
          // Demo Mode Delete
          setStories(prev => prev.filter(s => s.id !== storyId));
          if (editingStoryId === storyId) resetForm();
      }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!user?.isAdmin) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className={`text-4xl font-bold text-gray-900 mb-8 ${font}`}>{t('admin.title')}</h1>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-200 pb-1">
            <button 
                onClick={() => { setActiveTab('resources'); resetForm(); }}
                className={`pb-3 px-4 font-bold text-sm uppercase tracking-widest transition-colors ${activeTab === 'resources' ? 'text-brand-accent border-b-2 border-brand-accent' : 'text-gray-400 hover:text-gray-600'}`}
            >
                {t('admin.tab.resources')}
            </button>
            <button 
                onClick={() => { setActiveTab('stories'); resetForm(); }}
                className={`pb-3 px-4 font-bold text-sm uppercase tracking-widest transition-colors ${activeTab === 'stories' ? 'text-brand-accent border-b-2 border-brand-accent' : 'text-gray-400 hover:text-gray-600'}`}
            >
                {t('admin.tab.stories')}
            </button>
        </div>

        {/* Preview Mode Alert */}
        {!isFirebaseConfigured && (
            <div className="mb-8 p-4 bg-yellow-50 border border-yellow-100 rounded-xl flex items-center gap-3 text-yellow-800 text-sm shadow-sm">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
                <span><strong>{t('admin.preview_mode')}</strong></span>
            </div>
        )}

        {activeTab === 'resources' ? (
            <div className="space-y-12">
                {/* Resource Form */}
                <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            {editingId ? <><Edit2 className="w-6 h-6 text-brand-accent" /> {t('common.save')}</> : <><Database className="w-6 h-6 text-brand-accent" /> {t('admin.add_resource')}</>}
                        </h2>
                        {editingId && (
                            <button onClick={resetForm} className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-red-500 transition-colors">
                                <X className="w-4 h-4" /> {t('common.cancel')}
                            </button>
                        )}
                    </div>
                    
                    <form onSubmit={handleResourceSubmit} className="space-y-6 max-w-4xl">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{t('admin.form.name')}</label>
                                <input 
                                    required type="text" value={resourceForm.name}
                                    onChange={e => setResourceForm({...resourceForm, name: e.target.value})}
                                    className="w-full bg-gray-50 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-brand-accent"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{t('admin.form.type')}</label>
                                <select 
                                    value={resourceForm.type}
                                    onChange={e => setResourceForm({...resourceForm, type: e.target.value as any})}
                                    className="w-full bg-gray-50 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-brand-accent"
                                >
                                    <option value="Shelter">Shelter</option>
                                    <option value="Food Bank">Food Bank</option>
                                    <option value="Legal Aid">Legal Aid</option>
                                    <option value="Mental Health">Mental Health</option>
                                    <option value="Chinese Services">Chinese Services</option>
                                    <option value="Domestic Violence">Domestic Violence</option>
                                    <option value="Addiction Recovery">Addiction Recovery</option>
                                </select>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{t('admin.form.region')}</label>
                                <select 
                                    value={resourceForm.region}
                                    onChange={e => setResourceForm({...resourceForm, region: e.target.value as any})}
                                    className="w-full bg-gray-50 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-brand-accent"
                                >
                                    <option value="South">Southern CA</option>
                                    <option value="North">Northern CA</option>
                                    <option value="Central">Central CA</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{t('admin.form.contact')}</label>
                                <input 
                                    required type="text" value={resourceForm.contact}
                                    onChange={e => setResourceForm({...resourceForm, contact: e.target.value})}
                                    className="w-full bg-gray-50 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-brand-accent"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{t('admin.form.location')}</label>
                                <input 
                                    required type="text" value={resourceForm.location}
                                    onChange={e => setResourceForm({...resourceForm, location: e.target.value})}
                                    className="w-full bg-gray-50 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-brand-accent"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Website (Optional)</label>
                                <input 
                                    type="text" value={resourceForm.website || ''}
                                    onChange={e => setResourceForm({...resourceForm, website: e.target.value})}
                                    placeholder="example.org"
                                    className="w-full bg-gray-50 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-brand-accent"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{t('admin.form.desc')}</label>
                            <textarea 
                                required rows={3} value={resourceForm.description}
                                onChange={e => setResourceForm({...resourceForm, description: e.target.value})}
                                className="w-full bg-gray-50 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-brand-accent resize-none"
                            />
                        </div>
                        <button 
                            type="submit" disabled={isSubmitting}
                            className={`px-8 py-3 text-white rounded-full font-bold uppercase tracking-widest hover:scale-105 transition-all disabled:opacity-50 flex items-center gap-2 ${editingId ? 'bg-green-600 hover:bg-green-700' : 'bg-brand-black hover:bg-brand-accent'}`}
                        >
                            {isSubmitting ? t('common.processing') : (editingId ? <><Save className="w-4 h-4"/> {t('common.save')}</> : <><Plus className="w-4 h-4"/> {t('common.submit')}</>)}
                        </button>
                    </form>
                </div>

                {/* Resource List */}
                <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        Existing Database Resources
                        {isLoadingData && <RefreshCw className="w-4 h-4 animate-spin text-gray-400" />}
                    </h3>
                    
                    {resources.length === 0 ? (
                        <div className="bg-gray-50 border border-dashed border-gray-300 rounded-2xl p-8 text-center text-gray-400">
                            No resources found. Add one above.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4">
                            {resources.map(res => (
                                <div key={res.id} className={`p-6 rounded-2xl border transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${editingId === res.id ? 'bg-brand-cream border-brand-accent shadow-md' : 'bg-white border-gray-100 shadow-sm'}`}>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-1">
                                            <h4 className="font-bold text-lg text-gray-900">{res.name}</h4>
                                            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] uppercase font-bold rounded-md">{res.type}</span>
                                            {res.isDynamic && <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] uppercase font-bold rounded-md">New</span>}
                                        </div>
                                        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                                            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {res.location}</span>
                                            <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {res.contact}</span>
                                        </div>
                                    </div>
                                    {/* Action Buttons with better visibility */}
                                    <div className="flex items-center gap-3 flex-shrink-0 mt-4 md:mt-0">
                                        <button 
                                            onClick={() => handleEditResource(res)}
                                            className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 hover:bg-black text-white rounded-lg transition-all text-xs font-bold uppercase tracking-wider shadow-sm"
                                        >
                                            <Edit2 className="w-3 h-3" /> Edit
                                        </button>
                                        <button 
                                            onClick={() => handleDeleteResource(res.id)}
                                            className="flex items-center gap-2 px-5 py-2.5 bg-red-50 hover:bg-red-600 hover:text-white text-red-600 rounded-lg transition-all text-xs font-bold uppercase tracking-wider border border-red-100"
                                        >
                                            <Trash2 className="w-3 h-3" /> Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        ) : (
            <div className="space-y-12">
                {/* Story Form */}
                <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            {editingStoryId ? <><Edit2 className="w-6 h-6 text-brand-accent" /> {t('admin.edit_story')}</> : <><FileText className="w-6 h-6 text-brand-accent" /> {t('admin.add_story')}</>}
                        </h2>
                        {editingStoryId && (
                            <button onClick={resetForm} className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-red-500 transition-colors">
                                <X className="w-4 h-4" /> {t('common.cancel')}
                            </button>
                        )}
                    </div>
                    
                    <form onSubmit={handleStorySubmit} className="space-y-6 max-w-4xl">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{t('admin.story.title')}</label>
                                <input 
                                    required type="text" value={storyForm.title}
                                    onChange={e => setStoryForm({...storyForm, title: e.target.value})}
                                    className="w-full bg-gray-50 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-brand-accent"
                                    placeholder="Story Title"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{t('admin.story.category')}</label>
                                <select 
                                    value={storyForm.category}
                                    onChange={e => setStoryForm({...storyForm, category: e.target.value as any})}
                                    className="w-full bg-gray-50 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-brand-accent"
                                >
                                    <option value="Homelessness">Homelessness</option>
                                    <option value="Addiction">Addiction</option>
                                    <option value="Social Justice">Social Justice</option>
                                    <option value="Domestic Violence">Domestic Violence</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{t('admin.story.type')}</label>
                                <select 
                                    value={storyForm.type}
                                    onChange={e => setStoryForm({...storyForm, type: e.target.value as any})}
                                    className="w-full bg-gray-50 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-brand-accent"
                                >
                                    <option value="video">Video</option>
                                    <option value="photo">Photo</option>
                                    <option value="audio">Audio</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{t('admin.form.location')}</label>
                                <input 
                                    type="text" value={storyForm.location}
                                    onChange={e => setStoryForm({...storyForm, location: e.target.value})}
                                    placeholder="e.g. Los Angeles, CA"
                                    className="w-full bg-gray-50 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-brand-accent"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{t('admin.story.author')}</label>
                                <input 
                                    type="text" value={storyForm.authorName}
                                    onChange={e => setStoryForm({...storyForm, authorName: e.target.value})}
                                    className="w-full bg-gray-50 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-brand-accent"
                                />
                            </div>
                        </div>

                        {/* Media Links */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{t('admin.story.cover')}</label>
                                <input 
                                    type="text" value={storyForm.imageUrl}
                                    onChange={e => setStoryForm({...storyForm, imageUrl: e.target.value})}
                                    placeholder="https://..."
                                    className="w-full bg-gray-50 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-brand-accent"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{t('admin.story.media')}</label>
                                <input 
                                    type="text" 
                                    value={storyForm.type === 'audio' ? storyForm.audioUrl : storyForm.localVideoUrl}
                                    onChange={e => storyForm.type === 'audio' ? setStoryForm({...storyForm, audioUrl: e.target.value}) : setStoryForm({...storyForm, localVideoUrl: e.target.value})}
                                    placeholder="https://..."
                                    className="w-full bg-gray-50 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-brand-accent"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{t('admin.form.desc')}</label>
                            <textarea 
                                required rows={4} value={storyForm.description}
                                onChange={e => setStoryForm({...storyForm, description: e.target.value})}
                                className="w-full bg-gray-50 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-brand-accent resize-none"
                            />
                        </div>

                        <button 
                            type="submit" disabled={isSubmitting}
                            className={`px-8 py-3 text-white rounded-full font-bold uppercase tracking-widest hover:scale-105 transition-all disabled:opacity-50 flex items-center gap-2 ${editingStoryId ? 'bg-green-600 hover:bg-green-700' : 'bg-brand-black hover:bg-brand-accent'}`}
                        >
                            {isSubmitting ? t('common.processing') : (editingStoryId ? <><Save className="w-4 h-4"/> {t('common.save')}</> : <><Plus className="w-4 h-4"/> {t('admin.add_story')}</>)}
                        </button>
                    </form>
                </div>

                {/* Story List */}
                <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        {stories.length} Stories Found
                        {isLoadingData && <RefreshCw className="w-4 h-4 animate-spin text-gray-400" />}
                    </h3>

                    {isLoadingData ? (
                        <div className="text-center py-12 text-gray-400">{t('common.loading')}</div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4">
                            {stories.map(story => (
                                <div key={story.id} className={`bg-white p-6 rounded-2xl shadow-sm border transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${editingStoryId === story.id ? 'bg-brand-cream border-brand-accent shadow-md' : 'border-gray-100'}`}>
                                    <div className="flex items-center gap-4 flex-1">
                                        <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0 border border-gray-200">
                                            {story.type === 'audio' ? (
                                                <div className="w-full h-full flex items-center justify-center bg-gray-800 text-white"><Mic className="w-8 h-8"/></div>
                                            ) : (
                                                <img src={story.imageUrl} alt="" className="w-full h-full object-cover" />
                                            )}
                                        </div>
                                        <div>
                                            <div className="flex flex-wrap gap-2 mb-1">
                                                <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md ${story.type === 'video' ? 'bg-blue-50 text-blue-600' : story.type === 'audio' ? 'bg-purple-50 text-purple-600' : 'bg-green-50 text-green-600'}`}>
                                                    {story.type}
                                                </span>
                                                <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md bg-gray-100 text-gray-500">
                                                    {story.category}
                                                </span>
                                            </div>
                                            <h3 className="font-bold text-lg leading-tight">{story.title}</h3>
                                            <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                                                <span className="flex items-center gap-1"><Calendar className="w-3 h-3"/> {story.date}</span>
                                                <span className="flex items-center gap-1"><User className="w-3 h-3"/> {story.authorName}</span>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Action Buttons with better visibility */}
                                    <div className="flex items-center gap-3 flex-shrink-0 mt-4 md:mt-0">
                                        <button 
                                            onClick={() => handleEditStory(story)}
                                            className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 hover:bg-black text-white rounded-lg transition-all text-xs font-bold uppercase tracking-wider shadow-sm"
                                        >
                                            <Edit2 className="w-3 h-3" /> Edit
                                        </button>
                                        <button 
                                            onClick={() => handleDeleteStory(story.id)}
                                            className="flex items-center gap-2 px-5 py-2.5 bg-red-50 hover:bg-red-600 hover:text-white text-red-600 rounded-lg transition-all text-xs font-bold uppercase tracking-wider border border-red-100"
                                        >
                                            <Trash2 className="w-3 h-3" /> Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {stories.length === 0 && <p className="text-gray-400 italic text-center py-8">No user stories found.</p>}
                        </div>
                    )}
                </div>
            </div>
        )}
      </div>
    </div>
  );
};
