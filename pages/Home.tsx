
import React, { useState } from 'react';
import { ArrowRight, HeartHandshake, Users, Camera, Play, ShieldCheck, ChevronDown, Heart, Info } from 'lucide-react';
import { ViewState } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { NewsFeed } from '../components/NewsFeed';

interface HomeProps {
  setView: (view: ViewState) => void;
}

export const Home: React.FC<HomeProps> = ({ setView }) => {
  const { t, language } = useLanguage();
  const isChinese = language.startsWith('zh');
  
  // Image fallback logic: 
  // 1. Try /data/hero.jpg (User's specific location)
  // 2. Fallback to /hero.jpg (Root/Public folder)
  // 3. Fallback to Unsplash placeholder
  const [heroImage, setHeroImage] = useState("/data/hero.jpg");
  const [imgCredit, setImgCredit] = useState<{name: string, source: string} | null>(null);

  const handleImageError = () => {
    if (heroImage === "/data/hero.jpg") {
      console.log("Image not found in data folder, trying root...");
      setHeroImage("/hero.jpg");
    } else if (heroImage === "/hero.jpg") {
      console.log("Local image not found, using online fallback.");
      setHeroImage("https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=2000");
      setImgCredit({ name: "Caleb Oquendo", source: "Unsplash" });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <div className="relative min-h-[95vh] flex items-center justify-center overflow-hidden bg-brand-black">
        {/* Background Image with Parallax-like fix */}
        <div className="absolute inset-0 z-0">
          <img 
            src={heroImage} 
            alt="Behind the scenes at Voice Through Image studio" 
            onError={handleImageError}
            className="w-full h-full object-cover opacity-90 transition-opacity duration-500" 
          />
          {/* Enhanced gradient to ensure text readability over the white shirt in the photo */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-brand-black"></div>
          <div className="absolute inset-0 bg-black/20 mix-blend-multiply"></div>
        </div>
        
        {/* Image Credit (Only shows if fallback is used) */}
        {imgCredit && (
          <div className="absolute bottom-6 right-6 z-20 flex items-center gap-2 text-[10px] text-white/40 bg-black/20 px-3 py-1 rounded-full backdrop-blur-sm border border-white/5">
            <Camera className="w-3 h-3" />
            <span>Photo by {imgCredit.name} ({imgCredit.source})</span>
          </div>
        )}
        
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 text-center pt-20">
          <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-white text-[10px] font-bold uppercase tracking-[0.3em] mb-8 animate-slide-up opacity-0" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
             <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
             Recording Reality
          </div>
          
          <h1 className={`text-white mb-8 animate-slide-up opacity-0 drop-shadow-2xl ${
            isChinese 
              ? 'fluid-title-zh font-ming font-bold leading-tight' 
              : 'fluid-title-en font-serif font-light tracking-tight leading-[0.9]' 
          }`} style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
            {t('hero.title')}
          </h1>

          <p className="text-lg md:text-2xl text-gray-200 mb-12 max-w-3xl mx-auto font-light leading-relaxed opacity-0 animate-slide-up" style={{ animationDelay: '0.5s', animationFillMode: 'forwards', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
            {t('hero.subtitle')}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center opacity-0 animate-slide-up" style={{ animationDelay: '0.7s', animationFillMode: 'forwards' }}>
            <button 
              onClick={() => setView(ViewState.STORIES)}
              className="group relative px-10 py-4 bg-white text-brand-black rounded-full font-bold uppercase tracking-widest text-[10px] hover:bg-gray-100 transition-all overflow-hidden shadow-[0_0_20px_rgba(255,255,255,0.3)]"
            >
              <span className="relative z-10 flex items-center gap-3">
                {t('hero.cta_stories')} <Play className="w-3 h-3 fill-current" />
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
                  { val: '70+', lab: 'Verified Shelters' },
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
             <span className="text-brand-accent text-xs font-bold uppercase tracking-[0.3em] mb-4 block">Our Methodology</span>
             <h2 className="text-4xl md:text-5xl font-serif font-bold text-brand-black">Bridging Empathy & Action</h2>
           </div>
           
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <Camera className="w-6 h-6" />, title: "Documentary Journalism", desc: "Unveiling truth through raw, unfiltered imagery." },
              { icon: <HeartHandshake className="w-6 h-6" />, title: "Immediate Action", desc: "Directly linking narratives to 70+ verified agencies." },
              { icon: <Users className="w-6 h-6" />, title: "Policy Advocacy", desc: "Driving systemic change with visual evidence." }
            ].map((item, idx) => (
              <div key={idx} className="group p-10 bg-gray-50 rounded-[2.5rem] hover:bg-white hover:shadow-xl transition-all duration-500 border border-transparent hover:border-gray-100">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-brand-black mb-8 shadow-sm group-hover:bg-brand-black group-hover:text-white transition-colors duration-500">
                  {item.icon}
                </div>
                <h3 className="text-2xl font-serif font-bold text-gray-900 mb-4">{item.title}</h3>
                <p className="text-gray-500 leading-relaxed font-light">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
