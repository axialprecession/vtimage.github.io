
import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, HeartHandshake, Users, Camera, Play, ShieldCheck, ChevronDown, Heart, Info, Upload, Image as ImageIcon, Globe, CheckCircle2, Languages } from 'lucide-react';
import { ViewState } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { NewsFeed } from '../components/NewsFeed';

interface HomeProps {
  setView: (view: ViewState) => void;
}

export const Home: React.FC<HomeProps> = ({ setView }) => {
  const { t, language, setLanguage, font } = useLanguage();
  const isChinese = language.startsWith('zh');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Image logic: 
  // Priority: 1. LocalStorage user upload -> 2. Root file '/hero.jpg' -> 3. Fallback
  const [heroImage, setHeroImage] = useState<string>("/hero.jpg");
  const [imgCredit, setImgCredit] = useState<{name: string, source: string} | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    // Check local storage on mount
    const cachedImage = localStorage.getItem('vti_hero_custom');
    if (cachedImage) {
      setHeroImage(cachedImage);
      setImgCredit({ name: "You", source: "Custom Upload" });
    }
  }, []);

  const handleImageError = () => {
    if (heroImage === "/hero.jpg") {
      console.log("Local hero.jpg not found, switching to fallback.");
      setHeroImage("https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&q=80&w=2000");
      setImgCredit({ name: "Unsplash", source: "Studio Setup" });
    }
  };

  const handleFileProcess = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setHeroImage(result);
        setImgCredit({ name: "You", source: "Custom Upload" });
        try {
          localStorage.setItem('vti_hero_custom', result);
        } catch (err) {
          console.warn("Image too large to save to local storage, but displayed for session.");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const languages = [
    { code: 'en', label: 'English', native: 'English', flag: '🇺🇸' },
    { code: 'zh-TW', label: 'Traditional Chinese', native: '繁體中文', flag: '🇹🇼' },
    { code: 'zh-CN', label: 'Simplified Chinese', native: '简体中文', flag: '🇨🇳' },
    { code: 'es', label: 'Spanish', native: 'Español', flag: '🇪🇸' }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <div 
        className="relative min-h-[95vh] flex items-center justify-center overflow-hidden bg-brand-black group"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {/* Drag Overlay */}
        {isDragging && (
          <div className="absolute inset-0 z-[70] bg-brand-accent/80 backdrop-blur-sm flex flex-col items-center justify-center text-white animate-fade-in border-4 border-white border-dashed m-4 rounded-[3rem]">
            <Upload className="w-20 h-20 mb-6 animate-bounce" />
            <h3 className="text-4xl font-bold uppercase tracking-widest">{t('hero.drop_zone')}</h3>
          </div>
        )}

        {/* Quick Edit Button (Hidden by default, hover to see) */}
        <div className="absolute top-32 left-6 z-[60] opacity-0 hover:opacity-100 transition-all duration-300">
           <button 
             onClick={() => fileInputRef.current?.click()}
             className="flex items-center gap-2 px-4 py-2 bg-black/40 backdrop-blur-md border border-white/20 rounded-full text-[10px] font-bold text-white hover:bg-white hover:text-black transition-all"
           >
             <ImageIcon className="w-3 h-3" /> {t('hero.change_photo')}
           </button>
           <input 
             type="file" 
             ref={fileInputRef} 
             className="hidden" 
             accept="image/*"
             onChange={(e) => e.target.files?.[0] && handleFileProcess(e.target.files[0])}
           />
        </div>

        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src={heroImage} 
            alt="Documentary Studio Setup" 
            onError={handleImageError}
            className="w-full h-full object-cover object-center opacity-90 transition-opacity duration-500 filter contrast-125 grayscale" 
          />
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] pointer-events-none"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/90"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)]"></div>
        </div>
        
        {/* Image Credit */}
        {imgCredit && (
          <div className="absolute bottom-6 right-6 z-20 flex items-center gap-2 text-[10px] text-white/30 bg-black/20 px-3 py-1 rounded-full backdrop-blur-sm border border-white/5">
            <Camera className="w-3 h-3" />
            <span>{t('hero.photo_source')}: {imgCredit.source}</span>
          </div>
        )}
        
        {/* Hero Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 text-center pt-32 flex flex-col items-center">
          
          {/* --- MASSIVE LANGUAGE SELECTOR --- */}
          {/* High contrast, large touch targets, centered */}
          <div className="mb-16 animate-slide-up" style={{ animationDelay: '0s' }}>
             <div className="bg-white p-3 rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.5)] border border-white/20 backdrop-blur-md inline-block">
                <div className="flex items-center justify-center gap-2 mb-3 text-gray-400 font-bold text-[10px] uppercase tracking-[0.3em]">
                   <Globe className="w-3 h-3" /> Select Language / 選擇語言
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => setLanguage(lang.code as any)}
                      className={`px-6 py-4 rounded-xl text-sm md:text-lg font-bold transition-all duration-300 flex items-center gap-3 ${
                        language === lang.code 
                        ? 'bg-brand-black text-white shadow-xl scale-105 transform ring-2 ring-offset-2 ring-brand-black' 
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-black'
                      }`}
                    >
                      <span className="text-xl">{lang.flag}</span>
                      {lang.native}
                      {language === lang.code && <CheckCircle2 className="w-5 h-5 text-brand-accent ml-1" />}
                    </button>
                  ))}
                </div>
             </div>
          </div>

          <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white text-[10px] font-bold uppercase tracking-[0.3em] mb-8 animate-slide-up opacity-0" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
             <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></span>
             {t('hero.badge')}
          </div>
          
          <h1 className={`text-white mb-8 animate-slide-up opacity-0 drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)] ${
            isChinese 
              ? `fluid-title-zh ${font} font-bold leading-tight` 
              : `fluid-title-en ${font} font-light tracking-tight leading-[0.9]` 
          }`} style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
            {t('hero.title')}
          </h1>

          <p className="text-lg md:text-2xl text-gray-200 mb-12 max-w-3xl mx-auto font-light leading-relaxed opacity-0 animate-slide-up drop-shadow-lg" style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
            {t('hero.subtitle')}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center opacity-0 animate-slide-up" style={{ animationDelay: '0.7s', animationFillMode: 'forwards' }}>
            <button 
              onClick={() => setView(ViewState.STORIES)}
              className="group relative px-10 py-4 bg-white text-brand-black rounded-full font-bold uppercase tracking-widest text-[10px] hover:bg-gray-200 transition-all overflow-hidden shadow-[0_0_30px_rgba(255,255,255,0.15)]"
            >
              <span className="relative z-10 flex items-center gap-3">
                {t('hero.cta_stories')} <Play className="w-3 h-3 fill-current" />
              </span>
            </button>

            <button 
              onClick={() => setView(ViewState.SUBMIT_STORY)}
              className="group relative px-10 py-4 bg-transparent border-2 border-white text-white rounded-full font-bold uppercase tracking-widest text-[10px] hover:bg-white hover:text-black transition-all"
            >
              <span className="relative z-10 flex items-center gap-3">
                {t('hero.cta_submit')} <Upload className="w-3 h-3" />
              </span>
            </button>

            <a 
              href="https://www.zeffy.com/en-US/donation-form/support-voice-through-image-operations"
              target="_blank"
              rel="noreferrer"
              className="px-10 py-4 bg-brand-accent/90 backdrop-blur-sm border border-brand-accent text-white rounded-full font-bold uppercase tracking-widest text-[10px] hover:bg-red-700 transition-all flex items-center gap-2 shadow-glow"
            >
              {t('hero.cta_donate')} <Heart className="w-3 h-3 fill-current" />
            </a>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/30 animate-bounce">
           <ChevronDown className="w-6 h-6" />
        </div>
      </div>

      {/* Impact Stats */}
      <div className="bg-brand-black py-32 text-white relative z-20 -mt-8 rounded-t-[3rem] border-t border-white/5 shadow-[0_-20px_60px_rgba(0,0,0,0.5)]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-8">
                {[
                  { val: '124', lab: t('home.impact.stories') },
                  { val: '850+', lab: t('home.impact.helped') },
                  { val: '70+', lab: t('home.impact.verified_shelters') },
                  { val: '45', lab: t('home.impact.volunteers') }
                ].map((stat, idx) => (
                  <div key={idx} className="text-center md:text-left group cursor-default">
                    <div className="text-5xl md:text-7xl font-serif font-light mb-3 text-white group-hover:text-brand-accent transition-colors duration-500">{stat.val}</div>
                    <div className="text-[10px] md:text-xs text-gray-500 uppercase font-bold tracking-[0.2em]">{stat.lab}</div>
                  </div>
                ))}
            </div>
        </div>
      </div>

      {/* News Feed Section */}
      <div className="bg-brand-cream py-32">
         <div className="max-w-5xl mx-auto px-6">
            <NewsFeed />
         </div>
      </div>

      {/* Pillars Section */}
      <div className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
           <div className="text-center mb-20">
             <span className="text-brand-accent text-xs font-bold uppercase tracking-[0.3em] mb-4 block">{t('home.methodology.tag')}</span>
             <h2 className={`text-4xl md:text-5xl font-bold text-brand-black ${font}`}>{t('home.methodology.title')}</h2>
           </div>
           
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <Camera className="w-6 h-6" />, title: t('home.pillar1.title'), desc: t('home.pillar1.desc') },
              { icon: <HeartHandshake className="w-6 h-6" />, title: t('home.pillar2.title'), desc: t('home.pillar2.desc') },
              { icon: <Users className="w-6 h-6" />, title: t('home.pillar3.title'), desc: t('home.pillar3.desc') }
            ].map((item, idx) => (
              <div key={idx} className="group p-10 bg-gray-50 rounded-[2.5rem] hover:bg-white hover:shadow-xl transition-all duration-500 border border-transparent hover:border-gray-100">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-brand-black mb-8 shadow-sm group-hover:bg-brand-black group-hover:text-white transition-colors duration-500">
                  {item.icon}
                </div>
                <h3 className={`text-2xl font-bold text-gray-900 mb-4 ${font}`}>{item.title}</h3>
                <p className="text-gray-500 leading-relaxed font-light">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
