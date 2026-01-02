
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Play, X, Clock, Video, ImageIcon, LayoutGrid, Filter, ChevronLeft, ChevronRight, Loader2, Upload, Mic, MapPin, User, ArrowLeft, ArrowRight, Image as IconImage, Headphones, Edit2, Pause, Volume2, VolumeX } from 'lucide-react';
import { Story, ViewState } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { db, isFirebaseConfigured } from '../firebaseConfig';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';

interface StoriesProps {
  setView?: (view: ViewState) => void;
}

// Mock Data Sets for Different Languages
const STORIES_EN: Story[] = [
    {
      id: 'doc-001',
      type: 'video',
      title: "Silent Cry: Inside Skid Row",
      category: 'Homelessness',
      description: "This 4K documentary short captures Skid Row at 5 AM. We use no dramatic music, only the raw ambient sounds of the street.",
      date: "JAN 2026",
      imageUrl: "https://images.unsplash.com/photo-1444212477490-ca407925329e?auto=format&fit=crop&q=80&w=1200", 
      localVideoUrl: "https://videos.pexels.com/video-files/3248357/3248357-uhd_2560_1440_25fps.mp4",
      location: "Los Angeles, CA",
      authorName: "VTI Team"
    },
    {
      id: 'doc-002',
      type: 'video',
      title: "Rebirth: Ten Years After Addiction",
      category: 'Addiction',
      description: "Through deep interviews with three recovering addicts, we explore the gaps in California's social structure.",
      date: "DEC 2025",
      imageUrl: "https://images.unsplash.com/photo-1501769214405-5e5ee5125a02?auto=format&fit=crop&q=80&w=1200", 
      localVideoUrl: "https://videos.pexels.com/video-files/4631317/4631317-uhd_2560_1440_25fps.mp4",
      location: "San Francisco, CA",
      authorName: "Sarah Jenkins"
    },
    {
      id: 'doc-003',
      type: 'photo',
      title: "Chinatown Elders: Solitude & Resilience",
      category: 'Social Justice',
      description: "A photo essay capturing the current living conditions of seniors in San Francisco Chinatown.",
      date: "FEB 2026",
      imageUrl: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=1200", 
      photos: [
        "https://images.unsplash.com/photo-1516035069371-29a1b244cc32",
        "https://images.unsplash.com/photo-1490730141103-6cac27aaab94",
        "https://images.unsplash.com/photo-1502134249126-9f3755a50d78"
      ]
    },
    {
      id: 'doc-005',
      type: 'audio',
      title: "Voices from the Street: Episode 1",
      category: 'Homelessness',
      description: "An unfiltered interview with Michael, a veteran living in a tent city, discussing systemic failures and hope.",
      date: "MAR 2026",
      imageUrl: "https://images.unsplash.com/photo-1478737270239-2f02b77ac6d5?auto=format&fit=crop&q=80&w=800",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      location: "San Diego, CA"
    }
];

const STORIES_ZH_TW: Story[] = [
    {
      id: 'doc-001',
      type: 'video',
      title: "無聲的吶喊: 洛杉磯 Skid Row 紀實",
      category: 'Homelessness',
      description: "這部 4K 紀錄短片捕捉了清晨五點的 Skid Row。我們不使用煽情的配樂，只保留街道最真實的環境音，讓被忽視者的面容訴說他們的故事。",
      date: "JAN 2026",
      imageUrl: "https://images.unsplash.com/photo-1444212477490-ca407925329e?auto=format&fit=crop&q=80&w=1200", 
      localVideoUrl: "https://videos.pexels.com/video-files/3248357/3248357-uhd_2560_1440_25fps.mp4",
      location: "Los Angeles, CA",
      authorName: "VTI 團隊"
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
      location: "San Francisco, CA",
      authorName: "Sarah Jenkins"
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
      id: 'doc-005',
      type: 'audio',
      title: "街頭之聲: 第一集",
      category: 'Homelessness',
      description: "專訪住在帳篷區的退伍軍人 Michael，探討體制缺失與一線希望。",
      date: "MAR 2026",
      imageUrl: "https://images.unsplash.com/photo-1478737270239-2f02b77ac6d5?auto=format&fit=crop&q=80&w=800",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      location: "San Diego, CA"
    }
];

const STORIES_ZH_CN: Story[] = [
    {
      id: 'doc-001',
      type: 'video',
      title: "无声的呐喊: 洛杉矶 Skid Row 纪实",
      category: 'Homelessness',
      description: "这部 4K 纪录短片捕捉了清晨五点的 Skid Row。我们不使用煽情的配乐，只保留街道最真实的环境音，让被忽视者的面容诉说他们的故事。",
      date: "JAN 2026",
      imageUrl: "https://images.unsplash.com/photo-1444212477490-ca407925329e?auto=format&fit=crop&q=80&w=1200", 
      localVideoUrl: "https://videos.pexels.com/video-files/3248357/3248357-uhd_2560_1440_25fps.mp4",
      location: "Los Angeles, CA",
      authorName: "VTI 团队"
    },
    {
      id: 'doc-002',
      type: 'video',
      title: "重生: 走过成瘾的十年",
      category: 'Addiction',
      description: "通过与三位康复者的深度访谈，我们探索了加州药物成瘾问题背后的社会结构缺口。",
      date: "DEC 2025",
      imageUrl: "https://images.unsplash.com/photo-1501769214405-5e5ee5125a02?auto=format&fit=crop&q=80&w=1200", 
      localVideoUrl: "https://videos.pexels.com/video-files/4631317/4631317-uhd_2560_1440_25fps.mp4",
      location: "San Francisco, CA",
      authorName: "Sarah Jenkins"
    },
    {
      id: 'doc-003',
      type: 'photo',
      title: "唐人街的长者: 孤独与坚韧",
      category: 'Social Justice',
      description: "一组捕捉旧金山华埠长者生活现况的纪实摄影专题。",
      date: "FEB 2026",
      imageUrl: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=1200", 
      photos: [
        "https://images.unsplash.com/photo-1516035069371-29a1b244cc32",
        "https://images.unsplash.com/photo-1490730141103-6cac27aaab94",
        "https://images.unsplash.com/photo-1502134249126-9f3755a50d78"
      ]
    },
    {
      id: 'doc-005',
      type: 'audio',
      title: "街头之声: 第一集",
      category: 'Homelessness',
      description: "专访住在帐篷区的退伍军人 Michael，探讨体制缺失与一线希望。",
      date: "MAR 2026",
      imageUrl: "https://images.unsplash.com/photo-1478737270239-2f02b77ac6d5?auto=format&fit=crop&q=80&w=800",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      location: "San Diego, CA"
    }
];

const STORIES_ES: Story[] = [
    {
      id: 'doc-001',
      type: 'video',
      title: "Grito Silencioso: Dentro de Skid Row",
      category: 'Homelessness',
      description: "Este corto documental en 4K captura Skid Row a las 5 AM. No usamos música dramática, solo los sonidos ambientales crudos de la calle.",
      date: "JAN 2026",
      imageUrl: "https://images.unsplash.com/photo-1444212477490-ca407925329e?auto=format&fit=crop&q=80&w=1200", 
      localVideoUrl: "https://videos.pexels.com/video-files/3248357/3248357-uhd_2560_1440_25fps.mp4",
      location: "Los Angeles, CA",
      authorName: "Equipo VTI"
    },
    {
      id: 'doc-002',
      type: 'video',
      title: "Renacimiento: Diez Años Después de la Adicción",
      category: 'Addiction',
      description: "A través de entrevistas profundas con tres adictos en recuperación, exploramos las brechas en la estructura social de California.",
      date: "DEC 2025",
      imageUrl: "https://images.unsplash.com/photo-1501769214405-5e5ee5125a02?auto=format&fit=crop&q=80&w=1200", 
      localVideoUrl: "https://videos.pexels.com/video-files/4631317/4631317-uhd_2560_1440_25fps.mp4",
      location: "San Francisco, CA",
      authorName: "Sarah Jenkins"
    },
    {
      id: 'doc-003',
      type: 'photo',
      title: "Ancianos de Chinatown: Soledad y Resiliencia",
      category: 'Social Justice',
      description: "Un ensayo fotográfico que captura las condiciones de vida actuales de las personas mayores en el barrio chino de San Francisco.",
      date: "FEB 2026",
      imageUrl: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=1200", 
      photos: [
        "https://images.unsplash.com/photo-1516035069371-29a1b244cc32",
        "https://images.unsplash.com/photo-1490730141103-6cac27aaab94",
        "https://images.unsplash.com/photo-1502134249126-9f3755a50d78"
      ]
    },
    {
      id: 'doc-005',
      type: 'audio',
      title: "Voces de la Calle: Episodio 1",
      category: 'Homelessness',
      description: "Una entrevista sin filtros con Michael, un veterano que vive en una ciudad de tiendas de campaña, discutiendo fallas sistémicas y esperanza.",
      date: "MAR 2026",
      imageUrl: "https://images.unsplash.com/photo-1478737270239-2f02b77ac6d5?auto=format&fit=crop&q=80&w=800",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      location: "San Diego, CA"
    }
];

// Custom Audio Player Component
const AudioPlayer = ({ src, title }: { src?: string, title: string }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  
  // Use a symmetrical bar visualization
  const BAR_COUNT = 32;
  const [bars, setBars] = useState<number[]>(new Array(BAR_COUNT).fill(10));

  useEffect(() => {
    if (audioRef.current) {
        audioRef.current.volume = volume;
        // Don't auto-play to avoid browser policy issues, but if it was playing, resume
        if (isPlaying) {
            audioRef.current.play().catch(() => setIsPlaying(false));
        }
    }
  }, [src]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isPlaying) {
        interval = setInterval(() => {
            // Create a mirrored visualizer effect
            const halfBars = Array.from({ length: BAR_COUNT / 2 }, () => Math.max(10, Math.random() * 90 + 10));
            setBars([...halfBars.slice().reverse(), ...halfBars]);
        }, 100);
    } else {
        setBars(new Array(BAR_COUNT).fill(10));
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const curr = audioRef.current.currentTime;
      const dur = audioRef.current.duration;
      if (dur > 0) {
        setCurrentTime(curr);
        setProgress((curr / dur) * 100);
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };
  
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = Number(e.target.value);
      if (audioRef.current && duration > 0) {
          const newTime = (val / 100) * duration;
          audioRef.current.currentTime = newTime;
          setProgress(val);
          setCurrentTime(newTime);
      }
  }

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="w-full max-w-lg flex flex-col items-center z-10 p-4">
       <audio 
         ref={audioRef} 
         src={src} 
         onTimeUpdate={handleTimeUpdate} 
         onLoadedMetadata={handleLoadedMetadata}
         onEnded={() => setIsPlaying(false)}
       />
       
       {/* Visualizer */}
       <div className="flex gap-[2px] h-24 items-end justify-center mb-10 w-full px-4">
            {bars.map((height, i) => (
                <div 
                    key={i} 
                    className={`w-2 md:w-3 rounded-t-full transition-all duration-100 ease-in-out ${isPlaying ? 'bg-gradient-to-t from-brand-accent to-red-400' : 'bg-white/20'}`}
                    style={{ 
                       height: `${height}%`,
                       opacity: isPlaying ? 0.9 : 0.3
                    }}
                ></div>
            ))}
       </div>

       {/* Album Art / Icon */}
       <div className={`relative mb-10 transition-all duration-700 ${isPlaying ? 'scale-110' : 'scale-100'}`}>
            <div className={`w-40 h-40 rounded-full flex items-center justify-center bg-gray-900 border-4 ${isPlaying ? 'border-brand-accent shadow-[0_0_50px_rgba(204,29,59,0.5)] animate-pulse' : 'border-white/10'}`}>
                <Headphones className={`w-16 h-16 text-white transition-transform duration-500 ${isPlaying ? 'scale-110' : ''}`} />
            </div>
            {/* Spinning ring when playing */}
            {isPlaying && (
                <div className="absolute inset-[-10px] rounded-full border border-dashed border-white/20 animate-spin pointer-events-none" style={{ animationDuration: '8s' }}></div>
            )}
       </div>

       <div className="text-center mb-10 max-w-sm">
          <h3 className="text-white text-2xl md:text-3xl font-bold mb-3 tracking-tight leading-snug drop-shadow-lg">{title}</h3>
          <p className="text-brand-accent text-xs font-black uppercase tracking-[0.2em]">Audio Documentary</p>
       </div>

       {/* Controls Card */}
       <div className="w-full bg-white/10 rounded-[2.5rem] p-8 backdrop-blur-xl border border-white/10 shadow-2xl">
          {/* Progress Bar */}
          <div className="flex items-center gap-4 mb-6">
             <span className="text-xs text-gray-300 font-mono w-10 text-right">{formatTime(currentTime)}</span>
             <div className="relative flex-1 h-1.5 group">
                {/* Track background */}
                <div className="absolute inset-0 bg-white/20 rounded-full"></div>
                {/* Fill */}
                <div 
                    className="absolute inset-y-0 left-0 bg-brand-accent rounded-full pointer-events-none group-hover:bg-red-500 transition-colors"
                    style={{ width: `${progress}%` }}
                ></div>
                {/* Input overlay for seeking */}
                <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={progress} 
                    onChange={handleSeek}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                {/* Thumb indicator (visual only) */}
                <div 
                    className="absolute top-1/2 -translate-y-1/2 h-3 w-3 bg-white rounded-full shadow-md pointer-events-none transition-transform group-hover:scale-125"
                    style={{ left: `${progress}%`, marginLeft: '-6px' }}
                ></div>
             </div>
             <span className="text-xs text-gray-300 font-mono w-10">{formatTime(duration)}</span>
          </div>
          
          <div className="flex justify-between items-center px-4">
             {/* Volume Control */}
             <div className="flex items-center gap-2 group">
                <button onClick={() => setIsMuted(!isMuted)} className="text-gray-400 hover:text-white transition-colors">
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <div className="w-0 overflow-hidden group-hover:w-16 transition-all duration-300 ease-out">
                    <input 
                        type="range" 
                        min="0" 
                        max="1" 
                        step="0.05"
                        value={isMuted ? 0 : volume} 
                        onChange={(e) => setVolume(parseFloat(e.target.value))}
                        className="w-16 h-1 bg-white/30 rounded-full appearance-none cursor-pointer accent-brand-accent"
                    />
                </div>
             </div>

             {/* Playback Controls */}
             <div className="flex items-center gap-6">
                <button 
                    onClick={() => { if(audioRef.current) audioRef.current.currentTime -= 15 }}
                    className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full"
                    title="-15s"
                >
                    <div className="text-[10px] font-bold uppercase tracking-wider flex flex-col items-center leading-none">
                        <span>15</span>
                        <ArrowLeft className="w-3 h-3 mt-0.5" />
                    </div>
                </button>

                <button 
                onClick={togglePlay}
                className="w-16 h-16 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 transition-all hover:bg-brand-accent hover:text-white shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                >
                    {isPlaying ? (
                        <Pause className="w-6 h-6 fill-current" />
                    ) : (
                        <Play className="w-6 h-6 ml-1 fill-current" />
                    )}
                </button>

                <button 
                    onClick={() => { if(audioRef.current) audioRef.current.currentTime += 15 }}
                    className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full"
                    title="+15s"
                >
                    <div className="text-[10px] font-bold uppercase tracking-wider flex flex-col items-center leading-none">
                        <span>15</span>
                        <ArrowRight className="w-3 h-3 mt-0.5" />
                    </div>
                </button>
             </div>

             {/* Empty placeholder to balance flex layout or add more controls later */}
             <div className="w-6"></div>
          </div>
       </div>
    </div>
  );
};

export const Stories: React.FC<StoriesProps> = ({ setView }) => {
  const { t, language, font } = useLanguage();
  const { user } = useAuth();
  const isChinese = language.startsWith('zh');
  const [activeTab, setActiveTab] = useState<'video' | 'photo' | 'audio'>('video');
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [filterCategory, setFilterCategory] = useState<string>('All');
  
  // Choose initial stories based on language for Demo Mode
  const getInitialStories = useCallback(() => {
      switch(language) {
          case 'zh-TW': return STORIES_ZH_TW;
          case 'zh-CN': return STORIES_ZH_CN;
          case 'es': return STORIES_ES;
          default: return STORIES_EN;
      }
  }, [language]);

  const [stories, setStories] = useState<Story[]>(getInitialStories());
  const [isLoading, setIsLoading] = useState(true);

  // Re-fetch stories when language changes to update mock content
  useEffect(() => {
    const fetchStories = async () => {
      setIsLoading(true);
      try {
        if (isFirebaseConfigured && db) {
            const q = query(collection(db, "stories"), orderBy("createdAt", "desc"));
            const querySnapshot = await getDocs(q);
            const fetchedStories: Story[] = [];
            querySnapshot.forEach((doc) => {
              fetchedStories.push({ id: doc.id, ...doc.data() } as Story);
            });
            // Append fetched stories to localized static stories
            setStories([...fetchedStories, ...getInitialStories()]);
        } else {
            // Demo Mode: Switch content based on language
            setStories(getInitialStories());
        }
      } catch (error) {
        console.error("Error fetching stories:", error);
        setStories(getInitialStories());
      } finally {
        setIsLoading(false);
      }
    };

    fetchStories();
  }, [language, getInitialStories]);

  const categories = ['All', 'Homelessness', 'Addiction', 'Social Justice', 'Domestic Violence'];

  const filteredStories = stories.filter(s => {
    const matchesTab = s.type === activeTab;
    const matchesCat = filterCategory === 'All' || s.category === filterCategory;
    return matchesTab && matchesCat;
  });

  // Navigation Logic between stories
  const getCurrentStoryIndex = () => {
    if (!selectedStory) return -1;
    return filteredStories.findIndex(s => s.id === selectedStory.id);
  };

  const handleNextStory = () => {
    const idx = getCurrentStoryIndex();
    if (idx !== -1 && idx < filteredStories.length - 1) {
      setSelectedStory(filteredStories[idx + 1]);
      setCurrentPhotoIndex(0);
    }
  };

  const handlePrevStory = () => {
    const idx = getCurrentStoryIndex();
    if (idx > 0) {
      setSelectedStory(filteredStories[idx - 1]);
      setCurrentPhotoIndex(0);
    }
  };

  // Navigation Logic for Photos
  const nextPhoto = useCallback(() => {
    if (selectedStory?.photos) {
      setCurrentPhotoIndex(p => (p + 1) % selectedStory.photos!.length);
    }
  }, [selectedStory]);

  const prevPhoto = useCallback(() => {
    if (selectedStory?.photos) {
      setCurrentPhotoIndex(p => (p - 1 + selectedStory.photos!.length) % selectedStory.photos!.length);
    }
  }, [selectedStory]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedStory) return;
      
      if (selectedStory.type === 'photo') {
        if (e.key === 'ArrowRight') nextPhoto();
        if (e.key === 'ArrowLeft') prevPhoto();
      }
      
      if (e.key === 'Escape') setSelectedStory(null);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedStory, nextPhoto, prevPhoto]);

  return (
    <div className="min-h-screen bg-brand-cream">
      {/* Cinematic Header */}
      <div className="bg-brand-black text-white pt-32 pb-40 rounded-b-[4rem] shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-brand-black/50"></div>
        
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <div className="inline-block px-4 py-1.5 border border-white/20 rounded-full text-[10px] font-bold uppercase tracking-[0.3em] mb-8 text-brand-accent bg-white/5 backdrop-blur-sm">
             {t('stories.header.tag')}
          </div>
          <h1 className={`text-5xl md:text-8xl font-bold mb-6 tracking-tight ${font}`}>
            {t('stories.header.title')}
          </h1>
          <p className="text-xl text-gray-400 font-light max-w-2xl mx-auto italic">
            {t('stories.header.sub')}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-24 pb-40 relative z-10">
        {/* Controls */}
        <div className="bg-white rounded-[2.5rem] shadow-xl p-4 md:p-6 mb-16 flex flex-col xl:flex-row justify-between items-center gap-6 border border-gray-100">
           
           {/* Left: Tab Switcher */}
           <div className="flex bg-gray-50 p-1.5 rounded-full overflow-x-auto no-scrollbar max-w-full">
              <button 
                onClick={() => setActiveTab('video')} 
                className={`flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'video' ? 'bg-brand-black text-white shadow-lg' : 'text-gray-400 hover:text-black'}`}
              >
                <Video className="w-3.5 h-3.5" /> {t('stories.tab.video')}
              </button>
              <button 
                onClick={() => setActiveTab('photo')} 
                className={`flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'photo' ? 'bg-brand-black text-white shadow-lg' : 'text-gray-400 hover:text-black'}`}
              >
                <ImageIcon className="w-3.5 h-3.5" /> {t('stories.tab.photo')}
              </button>
              <button 
                onClick={() => setActiveTab('audio')} 
                className={`flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'audio' ? 'bg-brand-black text-white shadow-lg' : 'text-gray-400 hover:text-black'}`}
              >
                <Mic className="w-3.5 h-3.5" /> {t('stories.tab.audio')}
              </button>
           </div>

           {/* Middle: Filters */}
           <div className="flex flex-wrap justify-center gap-2 overflow-x-auto no-scrollbar">
              {categories.map(cat => (
                 <button 
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all border border-transparent whitespace-nowrap ${filterCategory === cat ? 'bg-brand-accent text-white shadow-md' : 'bg-gray-50 text-gray-500 hover:border-gray-200'}`}
                 >
                   {cat === 'All' ? t('stories.filter.all') : cat}
                 </button>
              ))}
           </div>

           {/* Right: Submit Button (High Visibility) */}
           <button 
             onClick={() => setView?.(ViewState.SUBMIT_STORY)}
             className="px-8 py-3 bg-brand-accent text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg flex items-center gap-2 flex-shrink-0"
           >
             <Upload className="w-4 h-4" />
             {t('stories.btn.submit')}
           </button>
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
                className="group cursor-pointer relative"
                onClick={() => { setSelectedStory(story); setCurrentPhotoIndex(0); }}
                >
                <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-gray-200 shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                    <img 
                    src={story.imageUrl} 
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 filter grayscale group-hover:grayscale-0"
                    alt={story.title}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent opacity-90 group-hover:opacity-80 transition-opacity" />
                    
                    <div className="absolute top-6 right-6 w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 hover:bg-brand-accent hover:border-brand-accent transition-colors">
                    {story.type === 'video' ? <Play className="w-5 h-5 text-white fill-white ml-0.5" /> : (story.type === 'audio' ? <Mic className="w-5 h-5 text-white" /> : <LayoutGrid className="w-5 h-5 text-white" />)}
                    </div>

                    {/* Admin Edit Button Overlay */}
                    {user?.isAdmin && (
                        <div 
                            className="absolute top-6 left-6 z-20"
                            onClick={(e) => {
                                e.stopPropagation();
                                setView?.(ViewState.ADMIN_DASHBOARD);
                            }}
                        >
                            <button className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-full shadow-lg text-xs font-bold hover:scale-105 transition-transform">
                                <Edit2 className="w-3 h-3" /> Edit
                            </button>
                        </div>
                    )}
                    
                    <div className="absolute bottom-0 left-0 p-8 w-full">
                    <span className="inline-block px-3 py-1 bg-brand-accent text-white text-[9px] font-bold uppercase tracking-widest rounded-full mb-4 shadow-lg">
                        {story.category}
                    </span>
                    <h3 className={`text-2xl font-bold text-white mb-2 leading-tight ${font}`}>
                        {story.title}
                    </h3>
                    <div className="flex justify-between items-end">
                        <div>
                            <p className="text-gray-300 text-sm line-clamp-2 font-light leading-relaxed mb-4">
                                {story.description}
                            </p>
                            <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {story.date}</span>
                                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {story.location || 'CA'}</span>
                            </div>
                        </div>
                    </div>
                    </div>
                </div>
                </div>
            ))}
            </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredStories.length === 0 && (
            <div className="text-center py-32 opacity-50">
                <p className="text-xl font-serif italic text-gray-400">{t('stories.empty')}</p>
                <button 
                    onClick={() => setView?.(ViewState.RESOURCES)}
                    className="mt-6 text-brand-accent font-bold uppercase tracking-widest text-xs hover:underline"
                >
                    {t('stories.modal.resource_btn')}
                </button>
            </div>
        )}
      </div>

      {/* Fullscreen Story Modal */}
      {selectedStory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl animate-fade-in p-0 md:p-10">
          <div className="relative w-full h-full max-w-7xl mx-auto flex flex-col md:flex-row overflow-hidden bg-black md:rounded-[3rem] shadow-2xl">
            
            {/* Close Button */}
            <button 
              onClick={() => setSelectedStory(null)} 
              className="absolute top-6 right-6 z-50 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition-all hover:rotate-90"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Navigation Arrows (Desktop) */}
            <div className="hidden md:block absolute top-1/2 left-6 z-40 -translate-y-1/2">
               <button onClick={handlePrevStory} className="p-4 rounded-full bg-white/5 hover:bg-white/10 backdrop-blur-md text-white transition-all hover:scale-110">
                  <ChevronLeft className="w-8 h-8" />
               </button>
            </div>
            <div className="hidden md:block absolute top-1/2 right-6 z-40 -translate-y-1/2">
               <button onClick={handleNextStory} className="p-4 rounded-full bg-white/5 hover:bg-white/10 backdrop-blur-md text-white transition-all hover:scale-110">
                  <ChevronRight className="w-8 h-8" />
               </button>
            </div>

            {/* Media Area (Left/Top) */}
            <div className="flex-1 relative bg-gray-900 flex items-center justify-center overflow-hidden h-[50vh] md:h-full">
              {selectedStory.type === 'video' && (
                <video 
                  src={selectedStory.localVideoUrl} 
                  controls 
                  autoPlay 
                  className="w-full h-full object-contain"
                  poster={selectedStory.imageUrl}
                />
              )}
              
              {selectedStory.type === 'audio' && (
                 <div className="w-full h-full relative">
                    <img 
                        src={selectedStory.imageUrl} 
                        className="absolute inset-0 w-full h-full object-cover opacity-30 blur-3xl scale-110" 
                        alt="Background ambience"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/20"></div>
                    
                    <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
                        <AudioPlayer src={selectedStory.audioUrl} title={selectedStory.title} />
                    </div>
                 </div>
              )}

              {selectedStory.type === 'photo' && selectedStory.photos && (
                <div className="w-full h-full relative group bg-black">
                  <img 
                    src={selectedStory.photos[currentPhotoIndex]} 
                    className="w-full h-full object-contain"
                    alt={`Slide ${currentPhotoIndex + 1}`}
                  />
                  
                  {/* Photo Navigation Buttons (Visible) */}
                  <button
                      onClick={(e) => { e.stopPropagation(); prevPhoto(); }}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-white hover:text-black text-white rounded-full backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 duration-300"
                      title="Previous Photo"
                  >
                      <ChevronLeft className="w-6 h-6" />
                  </button>

                  <button
                      onClick={(e) => { e.stopPropagation(); nextPhoto(); }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-white hover:text-black text-white rounded-full backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 duration-300"
                      title="Next Photo"
                  >
                      <ChevronRight className="w-6 h-6" />
                  </button>

                  {/* Photo Navigation Overlay (Dots) */}
                  <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10">
                     {selectedStory.photos.map((_, idx) => (
                        <button 
                          key={idx}
                          onClick={(e) => { e.stopPropagation(); setCurrentPhotoIndex(idx); }}
                          className={`w-2 h-2 rounded-full transition-all shadow-sm ${idx === currentPhotoIndex ? 'bg-white w-6' : 'bg-white/40 hover:bg-white/80'}`}
                        />
                     ))}
                  </div>
                </div>
              )}
            </div>

            {/* Info Area (Right/Bottom) */}
            <div className="w-full md:w-[400px] lg:w-[500px] bg-white text-black p-8 md:p-12 overflow-y-auto flex flex-col h-[50vh] md:h-full">
               <div className="mb-auto">
                  <div className="flex items-center gap-3 mb-6">
                     <span className="px-3 py-1 bg-black text-white text-[10px] font-bold uppercase tracking-widest rounded-full">{selectedStory.category}</span>
                     <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">{selectedStory.date}</span>
                  </div>
                  
                  <h2 className={`text-3xl md:text-4xl font-bold mb-6 leading-tight ${font}`}>{selectedStory.title}</h2>
                  
                  <div className="flex items-center gap-3 mb-8 pb-8 border-b border-gray-100">
                     <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-serif font-bold">
                        {selectedStory.authorName?.charAt(0)}
                     </div>
                     <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Documented By</p>
                        <p className="font-bold">{selectedStory.authorName}</p>
                     </div>
                  </div>

                  <div className="prose prose-lg text-gray-600 leading-relaxed font-light mb-8">
                     <p>{selectedStory.description}</p>
                     <p>
                        {isChinese 
                          ? "我們在拍攝過程中，不僅僅是為了記錄，更是為了連結。每一個故事的主角，我們都確保他們在拍攝後能與當地的救援機構取得聯繫。"
                          : (language === 'es' 
                              ? "Durante nuestro proceso de filmación, no solo registramos; conectamos. Nos aseguramos de que cada sujeto en nuestras historias esté conectado con agencias de ayuda local inmediatamente después de la filmación."
                              : "During our filming process, we don't just record; we connect. We ensure that every subject in our stories is connected with local aid agencies immediately after filming."
                            )
                        }
                     </p>
                  </div>
               </div>

               <div className="mt-8 pt-8 border-t border-gray-100">
                  <h4 className="text-xs font-black uppercase tracking-[0.2em] mb-4 text-brand-accent">Take Action</h4>
                  <div className="space-y-3">
                     <button 
                       onClick={() => { setSelectedStory(null); setView?.(ViewState.RESOURCES); }}
                       className="w-full py-4 bg-gray-50 hover:bg-black hover:text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                     >
                        {t('stories.modal.resource_btn')}
                     </button>
                     <button 
                       onClick={() => { setSelectedStory(null); setView?.(ViewState.DONATE); }}
                       className="w-full py-4 border border-gray-200 hover:border-brand-accent hover:text-brand-accent rounded-xl text-xs font-bold uppercase tracking-widest transition-all"
                     >
                        Support This Cause
                     </button>
                  </div>
               </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
