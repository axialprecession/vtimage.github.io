
import React, { useState, useEffect } from 'react';
import { Play, X, Clock, Video, ImageIcon, LayoutGrid, Filter, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { Story, ViewState } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { db, isFirebaseConfigured } from '../firebaseConfig';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';

interface StoriesProps {
  setView?: (view: ViewState) => void;
}

const INITIAL_STORIES: Story[] = [
    {
      id: 'doc-001',
      type: 'video',
      title: "無聲的吶喊: 洛杉磯 Skid Row 紀實",
      category: 'Homelessness',
      description: "這部 4K 紀錄短片捕捉了清晨五點的 Skid Row。我們不使用煽情的配樂，只保留街道最真實的環境音，讓被忽視者的面容訴說他們的故事。",
      date: "JAN 2026",
      imageUrl: "https://images.unsplash.com/photo-1444212477490-ca407925329e?auto=format&fit=crop&q=80&w=1200", 
      localVideoUrl: "https://videos.pexels.com/video-files/3248357/3248357-uhd_2560_1440_25fps.mp4",
    },
    {
      id: 'doc-002',
      type: 'video',
      title: "重生: 走過成癮的十年",
      category: 'Addiction',
      description: "透過與三位康復者的深度訪談，我們探索了加州藥物成癮問題背後的社會結構缺口。",
      date: "DEC 2025",
      imageUrl: "https://images.unsplash.com/photo-1501769214405-5e5ee5125a02?auto=format&fit=crop&q=80&w=1200", 
      localVideoUrl: "https://videos.pexels.com/video-files/4631317/4631317-uhd_2560_1440_25fps.mp4",
    },
    {
      id: 'doc-003',
      type: 'photo',
      title: "唐人街的長者: 孤獨與堅韌",
      category: 'Social Justice',
      description: "一組捕捉舊金山華埠長者生活現況的紀實攝影專題。",
      date: "FEB 2026",
      imageUrl: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=1200", 
      photos: [
        "https://images.unsplash.com/photo-1516035069371-29a1b244cc32",
        "https://images.unsplash.com/photo-1490730141103-6cac27aaab94",
        "https://images.unsplash.com/photo-1502134249126-9f3755a50d78"
      ]
    },
    {
      id: 'doc-004',
      type: 'photo',
      title: "破碎後的縫合: 家暴倖存者影集",
      category: 'Domestic Violence',
      description: "這組攝影作品以隱喻的方式，記錄了那些在「亞裔婦女收容所」獲得新生的面孔。",
      date: "JAN 2026",
      imageUrl: "https://images.unsplash.com/photo-1508847154043-be5407fcaa5a?auto=format&fit=crop&q=80&w=1200",
      photos: [
         "https://images.unsplash.com/photo-1508847154043-be5407fcaa5a",
         "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7"
      ]
    }
];

export const Stories: React.FC<StoriesProps> = ({ setView }) => {
  const { t, language } = useLanguage();
  const isChinese = language.startsWith('zh');
  const [activeTab, setActiveTab] = useState<'video' | 'photo'>('video');
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [filterCategory, setFilterCategory] = useState<string>('All');
  
  // State for fetched stories
  const [stories, setStories] = useState<Story[]>(INITIAL_STORIES);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        if (isFirebaseConfigured && db) {
            const q = query(collection(db, "stories"), orderBy("createdAt", "desc"));
            const querySnapshot = await getDocs(q);
            const fetchedStories: Story[] = [];
            querySnapshot.forEach((doc) => {
              fetchedStories.push({ id: doc.id, ...doc.data() } as Story);
            });
            setStories([...fetchedStories, ...INITIAL_STORIES]);
        } else {
            // Demo mode: just use initial stories
            setStories(INITIAL_STORIES);
        }
      } catch (error) {
        console.error("Error fetching stories:", error);
        setStories(INITIAL_STORIES);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStories();
  }, []);

  const categories = ['All', 'Homelessness', 'Addiction', 'Social Justice', 'Domestic Violence'];

  const filteredStories = stories.filter(s => {
    const matchesTab = s.type === activeTab;
    const matchesCat = filterCategory === 'All' || s.category === filterCategory;
    return matchesTab && matchesCat;
  });

  return (
    <div className="min-h-screen bg-brand-cream">
      {/* Cinematic Header */}
      <div className="bg-brand-black text-white pt-32 pb-40 rounded-b-[4rem] shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-brand-black/50"></div>
        
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <div className="inline-block px-4 py-1.5 border border-white/20 rounded-full text-[10px] font-bold uppercase tracking-[0.3em] mb-8 text-brand-accent bg-white/5 backdrop-blur-sm">
             Documentary Archives
          </div>
          <h1 className={`text-5xl md:text-8xl font-bold mb-6 tracking-tight ${isChinese ? 'font-ming' : 'font-serif'}`}>Community Stories</h1>
          <p className="text-xl text-gray-400 font-light max-w-2xl mx-auto italic">
            Authentic narratives captured by our teams to bridge the gap between empathy and action.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-24 pb-40 relative z-10">
        {/* Controls */}
        <div className="bg-white rounded-[2.5rem] shadow-xl p-4 md:p-6 mb-16 flex flex-col lg:flex-row justify-between items-center gap-6 border border-gray-100">
           {/* Tab Switcher */}
           <div className="flex bg-gray-50 p-1.5 rounded-full">
              <button 
                onClick={() => setActiveTab('video')} 
                className={`flex items-center gap-2 px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'video' ? 'bg-brand-black text-white shadow-lg' : 'text-gray-400 hover:text-black'}`}
              >
                <Video className="w-3.5 h-3.5" /> Video
              </button>
              <button 
                onClick={() => setActiveTab('photo')} 
                className={`flex items-center gap-2 px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'photo' ? 'bg-brand-black text-white shadow-lg' : 'text-gray-400 hover:text-black'}`}
              >
                <ImageIcon className="w-3.5 h-3.5" /> Photo
              </button>
           </div>

           {/* Quick Filters */}
           <div className="flex flex-wrap justify-center gap-2">
              {categories.map(cat => (
                 <button 
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all border border-transparent ${filterCategory === cat ? 'bg-brand-accent text-white shadow-md' : 'bg-gray-50 text-gray-500 hover:border-gray-200'}`}
                 >
                   {cat}
                 </button>
              ))}
           </div>
        </div>

        {/* Dynamic Grid */}
        {isLoading ? (
            <div className="flex justify-center py-20">
                <Loader2 className="w-10 h-10 animate-spin text-gray-300" />
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredStories.map((story) => (
                <div 
                key={story.id} 
                className="group cursor-pointer" 
                onClick={() => { setSelectedStory(story); setCurrentPhotoIndex(0); }}
                >
                <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-gray-200 shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                    <img 
                    src={story.imageUrl} 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 filter grayscale group-hover:grayscale-0"
                    alt={story.title}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent opacity-90 group-hover:opacity-80 transition-opacity" />
                    
                    <div className="absolute top-6 right-6 w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 hover:bg-brand-accent hover:border-brand-accent transition-colors">
                    {story.type === 'video' ? <Play className="w-5 h-5 text-white fill-white ml-0.5" /> : <LayoutGrid className="w-5 h-5 text-white" />}
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-8">
                    <div className="flex items-center gap-3 mb-3">
                        <span className="text-brand-accent text-[9px] font-black uppercase tracking-[0.2em]">{story.category}</span>
                        <span className="w-1 h-1 bg-white/50 rounded-full"></span>
                        <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {story.date}
                        </span>
                    </div>
                    <h3 className={`text-2xl font-bold text-white leading-tight mb-2 group-hover:text-brand-accent transition-colors ${isChinese ? 'font-ming' : 'font-serif'}`}>
                        {story.title}
                    </h3>
                    </div>
                </div>
                </div>
            ))}

            {filteredStories.length === 0 && (
                <div className="col-span-full py-32 text-center">
                    <p className="text-2xl font-serif text-gray-400 italic">No stories found in this category.</p>
                </div>
            )}
            </div>
        )}
      </div>

      {/* MODAL PLAYER */}
      {selectedStory && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 md:p-8 animate-fade-in" onClick={() => setSelectedStory(null)}>
          <div className="relative w-full max-w-6xl bg-white rounded-[3rem] overflow-hidden shadow-2xl flex flex-col md:flex-row h-full md:h-[85vh] animate-slide-up" onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelectedStory(null)} className="absolute top-6 right-6 z-[110] p-3 bg-white/20 hover:bg-white/40 rounded-full text-white md:text-black transition-all backdrop-blur-md"><X className="w-5 h-5" /></button>
            
            <div className="w-full md:w-2/3 bg-black flex items-center justify-center relative">
              {selectedStory.type === 'video' ? (
                  <video controls autoPlay className="w-full h-full object-contain" src={selectedStory.localVideoUrl} />
              ) : (
                  <div className="relative w-full h-full bg-black">
                    <img src={selectedStory.photos?.[currentPhotoIndex] || selectedStory.imageUrl} className="w-full h-full object-contain" />
                    {selectedStory.photos && selectedStory.photos.length > 1 && (
                      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4">
                        <button onClick={() => setCurrentPhotoIndex(p => (p - 1 + selectedStory.photos!.length) % selectedStory.photos!.length)} className="p-3 rounded-full bg-white/10 text-white hover:bg-white/20 backdrop-blur-md"><ChevronLeft className="w-6 h-6" /></button>
                        <button onClick={() => setCurrentPhotoIndex(p => (p + 1) % selectedStory.photos!.length)} className="p-3 rounded-full bg-white/10 text-white hover:bg-white/20 backdrop-blur-md"><ChevronRight className="w-6 h-6" /></button>
                      </div>
                    )}
                  </div>
              )}
            </div>

            <div className="w-full md:w-1/3 p-10 bg-white overflow-y-auto">
               <span className="text-brand-accent text-[10px] font-black uppercase tracking-[0.3em] mb-4 block">{selectedStory.category}</span>
               <h2 className={`text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight ${isChinese ? 'font-ming' : 'font-serif'}`}>{selectedStory.title}</h2>
               <p className="text-gray-600 text-lg font-light leading-relaxed mb-10">{selectedStory.description}</p>
               
               <button 
                  onClick={() => { setView?.(ViewState.RESOURCES); setSelectedStory(null); }}
                  className="w-full py-4 border-2 border-black text-black rounded-full font-bold uppercase tracking-widest text-xs hover:bg-black hover:text-white transition-all flex items-center justify-center gap-2"
               >
                  Find Support Resources <LayoutGrid className="w-4 h-4" />
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
