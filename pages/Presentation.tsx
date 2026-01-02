
import React, { useState, useEffect } from 'react';
import { ViewState } from '../types';
import { ChevronRight, ChevronLeft, X, Camera, Heart, Users, Globe, ShieldCheck, TrendingUp, Quote, CheckCircle2, ArrowRightLeft, DollarSign, Calendar, QrCode, Mic, Truck, Briefcase, Link, ExternalLink, Bot, Database, Zap, Map, UploadCloud, Smartphone } from 'lucide-react';
import { Logo } from '../components/Logo';
import { useLanguage } from '../context/LanguageContext';

interface PresentationProps {
  setView: (view: ViewState) => void;
}

export const Presentation: React.FC<PresentationProps> = ({ setView }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { t, font } = useLanguage();

  const slides = [
    // 1. Title
    {
      type: 'title',
      title: t('pres.s1.title'),
      subtitle: t('pres.s1.sub'),
      tagline: t('pres.s1.tag'),
      bgImage: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=2000"
    },
    // 2. Problem (Compassion Fatigue)
    {
      type: 'problem',
      title: t('pres.s2.title'),
      highlight: t('pres.s2.text'),
      sub: t('pres.s2.sub'),
      points: [t('pres.s2.p1'), t('pres.s2.p2'), t('pres.s2.p3')],
      bgImage: "https://images.unsplash.com/photo-1533035332503-455b5d19472e?auto=format&fit=crop&q=80&w=2000"
    },
    // 3. Philosophy (Action over Pity) - NEW
    {
      type: 'vision',
      title: t('pres.s3.title'),
      vision: t('pres.s3.vis'),
      mission: t('pres.s3.mis'),
      icon: <Zap className="w-20 h-20" /> // Changing icon to Zap for Action
    },
    // 4. Ecosystem
    {
      type: 'pillars',
      title: t('pres.s4.title'),
      items: [
         { title: t('pres.s4.p1'), desc: t('pres.s4.d1'), icon: <Camera className="w-8 h-8 md:w-10 md:h-10"/> },
         { title: t('pres.s4.p2'), desc: t('pres.s4.d2'), icon: <Bot className="w-8 h-8 md:w-10 md:h-10"/> }, // Bot icon for AI
         { title: t('pres.s4.p3'), desc: t('pres.s4.d3'), icon: <Users className="w-8 h-8 md:w-10 md:h-10"/> }
      ]
    },
    // 5. Tech AI (NEW)
    {
      type: 'tech',
      title: t('pres.s5.title'),
      stat: t('pres.s5.stat'),
      desc: t('pres.s5.desc'),
      text: t('pres.s5.text'),
      icon: <Bot className="w-24 h-24 text-brand-accent"/>
    },
    // 6. The Digital Hub (NEW)
    {
      type: 'list',
      title: t('pres.s6.title'),
      subtitle: t('pres.s6.sub'),
      items: [t('pres.s6.p1'), t('pres.s6.p2'), t('pres.s6.p3')],
      icon: <Database className="w-16 h-16 text-blue-400 mb-6"/>
    },
    // 7. Democratized Storytelling (NEW)
    {
      type: 'simple',
      title: t('pres.s7.title'),
      subtitle: t('pres.s7.sub'),
      points: [t('pres.s7.p1'), t('pres.s7.p2'), t('pres.s7.p3')],
      icon: <UploadCloud className="w-16 h-16 text-green-400 mb-6"/>
    },
    // 8. User Journey
    {
      type: 'roadmap',
      title: t('pres.s8.title'),
      steps: t('pres.s8.steps').split(' -> ')
    },
    // 9. Dignity First (Philosophy)
    {
      type: 'problem',
      title: t('pres.s9.title'),
      highlight: t('pres.s9.text'),
      sub: t('pres.s9.sub'),
      bgImage: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=2000"
    },
    // 10. Impact
    {
      type: 'stats_grid',
      title: t('pres.s10.title'),
      stats: [
          { val: t('pres.s10.stat1'), icon: <Heart className="w-6 h-6"/> },
          { val: t('pres.s10.stat2'), icon: <Camera className="w-6 h-6"/> },
          { val: t('pres.s10.stat3'), icon: <Users className="w-6 h-6"/> }
      ]
    },
    // 11. Quote
    {
      type: 'quote',
      title: t('pres.s11.title'),
      quote: t('pres.s11.quote'),
      author: t('pres.s11.author'),
      bgImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=2000"
    },
    // 12. Comparison (VTI vs Old)
    {
      type: 'comparison',
      title: t('pres.s12.title'),
      col1: t('pres.s12.us'),
      col2: t('pres.s12.others'),
      points: [
         { p1: t('pres.s12.p1'), p2: t('pres.s12.o1') },
         { p1: t('pres.s12.p2'), p2: t('pres.s12.o2') }
      ]
    },
    // 13. Tech Stack
    {
      type: 'tech_stack',
      title: t('pres.s13.title'),
      highlight: t('pres.s13.stack'),
      desc: t('pres.s13.desc')
    },
    // 14. Scalability
    {
      type: 'simple',
      title: t('pres.s14.title'),
      text: t('pres.s14.text'),
      icon: <Globe className="w-16 h-16 text-blue-500 mb-6"/>
    },
    // 15. Financials
    {
      type: 'pie',
      title: t('pres.s15.title'),
      subtitle: t('pres.s15.sub'),
      segments: [
         { label: t('pres.s15.p1'), val: '60%' },
         { label: t('pres.s15.p2'), val: '30%' },
         { label: t('pres.s15.p3'), val: '10%' }
      ]
    },
    // 16. Roadmap
    {
      type: 'roadmap',
      title: t('pres.s16.title'),
      steps: [t('pres.s16.q1'), t('pres.s16.q2'), t('pres.s16.q3')]
    },
    // 17. Official Status
    {
      type: 'tax',
      title: t('pres.s17.title'),
      stat: t('pres.s17.stat'),
      text: t('pres.s17.text')
    },
    // 18. The Ask
    {
      type: 'ask',
      title: t('pres.s18.title'),
      amount: t('pres.s18.goal'),
      sub: t('pres.s18.sub'),
      items: [
        { label: 'Dev Team', icon: <Bot className="w-6 h-6" /> },
        { label: 'Van', icon: <Truck className="w-6 h-6" /> },
        { label: 'Gear', icon: <Camera className="w-6 h-6" /> },
        { label: 'Staff', icon: <Users className="w-6 h-6" /> },
      ]
    },
    // 19. Why Now
    {
      type: 'problem',
      title: t('pres.s19.title'),
      highlight: t('pres.s19.text'),
      bgImage: "https://images.unsplash.com/photo-1596386461350-326ccb383e9f?auto=format&fit=crop&q=80&w=2000"
    },
    // 20. CTA
    {
      type: 'final',
      title: t('pres.s20.title'),
      sub: t('pres.s20.sub'),
      cta: t('pres.s20.cta')
    }
  ];

  const nextSlide = () => { if (currentSlide < slides.length - 1) setCurrentSlide(c => c + 1); };
  const prevSlide = () => { if (currentSlide > 0) setCurrentSlide(c => c - 1); };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'Space') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'Escape') setView(ViewState.HOME);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide]);

  const slide = slides[currentSlide];

  return (
    <div className="fixed inset-0 z-50 bg-black text-white overflow-y-auto md:overflow-hidden flex flex-col font-sans select-none">
      
      {/* --- HEADER --- */}
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-50">
        <div className="flex items-center gap-3">
           <div className="bg-white p-1 rounded-full"><Logo className="w-6 h-6" /></div>
           <span className="font-serif font-bold text-sm tracking-widest uppercase hidden md:inline">Voice Through Image</span>
        </div>
        <div className="flex gap-4 items-center">
           <span className="text-gray-500 font-mono text-sm">{currentSlide + 1} / {slides.length}</span>
           <button onClick={() => setView(ViewState.HOME)} className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors">
              <X className="w-5 h-5" />
           </button>
        </div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="flex-1 relative flex items-center justify-center w-full min-h-screen md:min-h-full">
         
         {/* Background Handling */}
         {slide.bgImage && (
            <div className="absolute inset-0 z-0">
               <img src={slide.bgImage} className="w-full h-full object-cover opacity-40 animate-fade-in" />
               <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
            </div>
         )}

         <div className="relative z-10 w-full max-w-7xl px-6 md:px-8 py-20 animate-fade-in">
            
            {/* TITLE SLIDE */}
            {slide.type === 'title' && (
               <div className="text-center">
                  <div className="mb-6 inline-block p-4 border border-white/30 rounded-full backdrop-blur-md bg-white/10"><Bot className="w-12 h-12 text-brand-accent"/></div>
                  <h1 className={`text-5xl md:text-8xl font-bold mb-6 tracking-tighter leading-tight ${font}`}>{slide.title}</h1>
                  <p className="text-xl md:text-2xl text-gray-300 font-light mb-12">{slide.subtitle}</p>
                  <div className="inline-block px-6 py-2 border border-brand-accent text-brand-accent rounded-full text-sm uppercase tracking-[0.3em] font-bold">
                     {slide.tagline}
                  </div>
               </div>
            )}

            {/* PROBLEM SLIDE */}
            {slide.type === 'problem' && (
               <div className="max-w-5xl mx-auto">
                  <h2 className={`text-3xl md:text-5xl font-bold mb-8 md:mb-10 text-brand-accent ${font}`}>{slide.title}</h2>
                  <h3 className={`text-4xl md:text-6xl font-bold mb-10 md:mb-12 leading-tight text-white ${font}`}>{slide.highlight}</h3>
                  <div className="space-y-6">
                     {slide.points?.map((p: any, i: number) => (
                        <div key={i} className="flex items-start gap-4 md:gap-6 text-xl md:text-2xl font-light text-gray-300">
                           <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0 mt-3"></div>
                           <span>{p}</span>
                        </div>
                     ))}
                  </div>
                  {slide.sub && <p className="mt-12 text-lg md:text-xl text-gray-400 font-serif italic border-t border-gray-700 pt-8">{slide.sub}</p>}
               </div>
            )}

            {/* VISION SLIDE */}
            {slide.type === 'vision' && (
               <div className="text-center max-w-5xl mx-auto">
                  <div className="mb-10 flex justify-center text-brand-accent animate-pulse">{slide.icon}</div>
                  <h2 className={`text-2xl md:text-4xl font-bold mb-8 text-gray-400 ${font}`}>{slide.title}</h2>
                  <p className={`text-3xl md:text-6xl font-bold leading-tight mb-16 text-white ${font}`}>"{slide.vision}"</p>
                  <p className="text-lg md:text-2xl text-gray-300 border-t border-gray-800 pt-8 leading-relaxed">{slide.mission}</p>
               </div>
            )}

            {/* PILLARS SLIDE */}
            {slide.type === 'pillars' && (
               <div className="text-center w-full">
                  <h2 className={`text-4xl md:text-5xl font-bold mb-12 md:mb-16 ${font}`}>{slide.title}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12">
                     {slide.items?.map((item: any, i: number) => (
                        <div key={i} className="p-6 md:p-8 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 transition-all flex flex-row md:flex-col items-center gap-4 md:gap-0 text-left md:text-center group">
                           <div className="mb-0 md:mb-6 flex justify-center text-brand-accent flex-shrink-0 bg-white/10 p-3 rounded-full md:bg-transparent md:p-0 group-hover:scale-110 transition-transform">
                              {item.icon}
                           </div>
                           <div>
                              <h3 className={`text-2xl md:text-3xl font-bold mb-2 md:mb-4 ${font}`}>{item.title}</h3>
                              <p className="text-gray-400 text-sm md:text-base">{item.desc}</p>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            )}

            {/* TECH SLIDE (Enhanced) */}
            {slide.type === 'tech' && (
               <div className="text-center max-w-4xl mx-auto">
                  <div className="flex justify-center mb-8">{slide.icon}</div>
                  <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${font}`}>{slide.title}</h2>
                  <div className="text-[100px] md:text-[150px] font-bold leading-none text-white/90 mb-4 tracking-tighter shadow-brand-accent drop-shadow-[0_0_15px_rgba(204,29,59,0.5)]">{slide.stat}</div>
                  <div className="text-xl md:text-2xl uppercase tracking-[0.3em] text-brand-accent mb-12">{slide.desc}</div>
                  <p className="text-xl md:text-2xl text-gray-300 leading-relaxed font-light">{slide.text}</p>
               </div>
            )}

            {/* TECH STACK (NEW LAYOUT) */}
            {slide.type === 'tech_stack' && (
                <div className="text-center max-w-5xl mx-auto">
                    <h2 className={`text-4xl md:text-5xl font-bold mb-12 text-gray-400 ${font}`}>{slide.title}</h2>
                    <div className="p-10 border-2 border-brand-accent rounded-[3rem] bg-brand-accent/5 backdrop-blur-sm mb-8">
                        <h3 className="text-3xl md:text-5xl font-mono font-bold text-white mb-4">{slide.highlight}</h3>
                    </div>
                    <p className="text-xl text-gray-400">{slide.desc}</p>
                </div>
            )}

            {/* STATS GRID (NEW LAYOUT) */}
            {slide.type === 'stats_grid' && (
                <div className="max-w-5xl mx-auto w-full">
                    <h2 className={`text-4xl md:text-5xl font-bold mb-16 text-center ${font}`}>{slide.title}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {slide.stats?.map((stat: any, i: number) => (
                            <div key={i} className="bg-white/10 p-8 rounded-[2rem] text-center border border-white/5 hover:bg-white/20 transition-all">
                                <div className="flex justify-center mb-4 text-brand-accent">{stat.icon}</div>
                                <div className="text-3xl md:text-4xl font-bold">{stat.val}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* QUOTE SLIDE */}
            {slide.type === 'quote' && (
               <div className="max-w-5xl mx-auto text-center">
                  <Quote className="w-12 h-12 md:w-16 md:h-16 text-brand-accent mx-auto mb-8 opacity-50" />
                  <p className={`text-3xl md:text-6xl italic leading-tight mb-12 ${font}`}>"{slide.quote}"</p>
                  <p className="text-lg md:text-xl font-bold text-gray-400 uppercase tracking-widest">— {slide.author}</p>
               </div>
            )}

            {/* COMPARISON SLIDE */}
            {slide.type === 'comparison' && (
               <div className="max-w-6xl mx-auto w-full">
                  <h2 className={`text-3xl md:text-4xl font-bold mb-12 text-center ${font}`}>{slide.title}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                     <div className="bg-brand-accent/10 p-6 md:p-8 rounded-3xl border border-brand-accent/30">
                        <h3 className="text-xl md:text-2xl font-bold mb-6 md:mb-8 text-center text-brand-accent">{slide.col1}</h3>
                        <div className="space-y-4 md:space-y-6">
                           {slide.points?.map((p: any, i: number) => (
                              <div key={i} className="flex items-center gap-3">
                                 <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6 text-green-400 flex-shrink-0" />
                                 <span className="text-base md:text-lg font-bold">{p.p1}</span>
                              </div>
                           ))}
                        </div>
                     </div>
                     <div className="bg-white/5 p-6 md:p-8 rounded-3xl border border-white/10 opacity-50 grayscale">
                        <h3 className="text-xl md:text-2xl font-bold mb-6 md:mb-8 text-center text-gray-400">{slide.col2}</h3>
                        <div className="space-y-4 md:space-y-6">
                           {slide.points?.map((p: any, i: number) => (
                              <div key={i} className="flex items-center gap-3">
                                 <div className="w-5 h-5 md:w-6 md:h-6 rounded-full border border-gray-500 flex-shrink-0"></div>
                                 <span className="text-base md:text-lg">{p.p2}</span>
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>
               </div>
            )}

            {/* LIST/SIMPLE/ROADMAP */}
            {(slide.type === 'list' || slide.type === 'simple' || slide.type === 'roadmap') && (
               <div className="max-w-4xl mx-auto text-center">
                  {slide.icon && <div className="flex justify-center">{slide.icon}</div>}
                  <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${font}`}>{slide.title}</h2>
                  
                  {slide.subtitle && <p className="text-xl md:text-2xl text-brand-accent mb-12">{slide.subtitle}</p>}
                  
                  {slide.points && (
                     <div className="space-y-4 md:space-y-6 text-2xl md:text-3xl font-light">
                        {(slide.points as string[]).map((p: string, i: number) => <div key={i}>• {p}</div>)}
                     </div>
                  )}

                  {slide.text && <p className="text-xl md:text-3xl text-gray-300 leading-relaxed font-light">{slide.text}</p>}

                  {slide.steps && (
                     <div className="flex flex-col md:flex-row justify-between mt-12 md:mt-16 gap-8 md:gap-0 border-t border-white/20 pt-10 text-left md:text-center">
                        {slide.steps.map((s: string, i: number) => (
                           <div key={i} className="flex-1 px-4">
                              <div className="text-3xl md:text-4xl font-bold mb-2 text-gray-600">0{i+1}</div>
                              <div className="text-lg md:text-xl">{s}</div>
                           </div>
                        ))}
                     </div>
                  )}

                  {slide.items && (
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 mt-12">
                        {(slide.items as string[]).map((it: string, i: number) => (
                           <div key={i} className="p-4 md:p-6 bg-white/10 rounded-2xl font-bold text-lg md:text-xl">{it}</div>
                        ))}
                     </div>
                  )}
               </div>
            )}

            {/* FINANCIALS PIE */}
            {slide.type === 'pie' && (
               <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12 md:gap-16">
                   <div className="flex-1 text-center md:text-left">
                      <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${font}`}>{slide.title}</h2>
                      <p className="text-lg md:text-xl text-gray-400 mb-10">{slide.subtitle}</p>
                      <div className="space-y-4 md:space-y-6">
                         {slide.segments?.map((s: any, i: number) => (
                            <div key={i} className="bg-white/5 p-4 rounded-xl flex justify-between items-center">
                               <span className="font-bold text-base md:text-lg">{s.label}</span>
                               <span className="text-xl md:text-2xl font-mono text-brand-accent">{s.val}</span>
                            </div>
                         ))}
                      </div>
                   </div>
                   <div className="w-64 h-64 md:w-80 md:h-80 rounded-full border-[20px] border-white/10 flex items-center justify-center relative flex-shrink-0">
                      <div className="absolute inset-0 border-[20px] border-brand-accent rounded-full border-l-transparent border-b-transparent rotate-45"></div>
                      <div className="text-center">
                         <div className="text-3xl md:text-4xl font-bold">100%</div>
                         <div className="text-[10px] md:text-xs uppercase">Transparency</div>
                      </div>
                   </div>
               </div>
            )}

             {/* TAX 501c3 */}
             {slide.type === 'tax' && (
               <div className="text-center max-w-3xl mx-auto border-2 border-white/20 p-8 md:p-16 rounded-[2rem] md:rounded-[3rem] bg-white/5 backdrop-blur-sm">
                  <ShieldCheck className="w-16 h-16 md:w-24 md:h-24 text-green-400 mx-auto mb-8" />
                  <h2 className="text-4xl md:text-6xl font-bold mb-4">{slide.stat}</h2>
                  <p className="text-xl md:text-2xl leading-relaxed">{slide.text}</p>
               </div>
            )}

            {/* THE ASK */}
            {slide.type === 'ask' && (
               <div className="max-w-6xl mx-auto text-center w-full">
                  <h2 className={`text-2xl md:text-4xl font-bold mb-8 text-gray-400 uppercase tracking-widest ${font}`}>{slide.title}</h2>
                  <div className="text-[80px] md:text-[140px] font-bold leading-none text-brand-accent mb-4">{slide.amount}</div>
                  <p className="text-xl md:text-2xl mb-12 md:mb-16 text-white">{slide.sub}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                     {slide.items?.map((item: any, i: number) => (
                        <div key={i} className="p-4 md:p-6 bg-white/5 rounded-2xl md:rounded-3xl backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all flex flex-col items-center gap-3 md:gap-4 group">
                           <div className="p-3 bg-white/10 rounded-full text-brand-accent group-hover:text-white group-hover:bg-brand-accent transition-colors">
                              {item.icon}
                           </div>
                           <div className="text-sm md:text-lg font-bold text-gray-300 group-hover:text-white">{item.label}</div>
                        </div>
                     ))}
                  </div>
               </div>
            )}

            {/* FINAL CTA */}
            {slide.type === 'final' && (
               <div className="text-center">
                  <h2 className={`text-5xl md:text-8xl font-bold mb-8 ${font}`}>{slide.title}</h2>
                  <p className="text-xl md:text-3xl text-gray-300 mb-16">{slide.sub}</p>
                  
                  <a 
                    href="https://www.zeffy.com/en-US/donation-form/support-voice-through-image-operations" 
                    target="_blank" 
                    rel="noreferrer"
                    className="inline-block group"
                  >
                    <div className="p-8 bg-white rounded-3xl hover:scale-105 transition-transform duration-300 shadow-2xl hover:shadow-white/20 cursor-pointer">
                        <div className="flex flex-col items-center">
                           <QrCode className="w-32 h-32 md:w-48 md:h-48 text-black mb-4 group-hover:text-brand-accent transition-colors" />
                           <p className="text-black font-bold uppercase tracking-widest text-sm group-hover:text-brand-accent transition-colors flex items-center gap-2">
                              {slide.cta} <ExternalLink className="w-4 h-4"/>
                           </p>
                        </div>
                    </div>
                  </a>
               </div>
            )}

         </div>
      </div>

      {/* --- FOOTER PROGRESS --- */}
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-gray-900 z-50">
         <div 
           className="h-full bg-brand-accent transition-all duration-300 ease-out"
           style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
         ></div>
      </div>
      
      {/* Click Nav Overlay */}
      <div className="absolute inset-y-0 left-0 w-16 md:w-24 hover:bg-white/5 cursor-pointer z-40 flex items-center justify-center group transition-colors" onClick={prevSlide}>
         <ChevronLeft className="w-8 h-8 md:w-12 md:h-12 text-white/20 group-hover:text-white transition-colors" />
      </div>
      <div className="absolute inset-y-0 right-0 w-16 md:w-24 hover:bg-white/5 cursor-pointer z-40 flex items-center justify-center group transition-colors" onClick={nextSlide}>
         <ChevronRight className="w-8 h-8 md:w-12 md:h-12 text-white/20 group-hover:text-white transition-colors" />
      </div>

    </div>
  );
};
