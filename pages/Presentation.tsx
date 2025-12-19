
import React, { useState, useEffect } from 'react';
import { ViewState } from '../types';
import { ChevronRight, ChevronLeft, X, Camera, Heart, Users, Globe, ShieldCheck, TrendingUp, Quote, CheckCircle2, ArrowRightLeft, DollarSign, Calendar, QrCode, Mic, Truck, Briefcase, Link, ExternalLink } from 'lucide-react';
import { Logo } from '../components/Logo';
import { useLanguage } from '../context/LanguageContext';

interface PresentationProps {
  setView: (view: ViewState) => void;
}

export const Presentation: React.FC<PresentationProps> = ({ setView }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { t } = useLanguage();

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
      points: [t('pres.s2.p1'), t('pres.s2.p2'), t('pres.s2.p3')],
      bgImage: "https://images.unsplash.com/photo-1533035332503-455b5d19472e?auto=format&fit=crop&q=80&w=2000"
    },
    // 3. Vision
    {
      type: 'vision',
      title: t('pres.s3.title'),
      vision: t('pres.s3.vis'),
      mission: t('pres.s3.mis'),
      icon: <Camera className="w-20 h-20" />
    },
    // 4. Pillars
    {
      type: 'pillars',
      title: t('pres.s4.title'),
      items: [
         { title: t('pres.s4.p1'), desc: t('pres.s4.d1'), icon: <Camera className="w-8 h-8 md:w-10 md:h-10"/> },
         { title: t('pres.s4.p2'), desc: t('pres.s4.d2'), icon: <Globe className="w-8 h-8 md:w-10 md:h-10"/> },
         { title: t('pres.s4.p3'), desc: t('pres.s4.d3'), icon: <TrendingUp className="w-8 h-8 md:w-10 md:h-10"/> }
      ]
    },
    // 5. Interview (Human Element)
    {
      type: 'quote',
      title: t('pres.s5.title'),
      quote: t('pres.s5.quote'),
      author: t('pres.s5.author'),
      bgImage: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=2000"
    },
    // 6. Differentiation (Comparison)
    {
      type: 'comparison',
      title: t('pres.s6.title'),
      col1: t('pres.s6.us'),
      col2: t('pres.s6.others'),
      points: [
         { p1: t('pres.s6.p1'), p2: t('pres.s6.o1') },
         { p1: t('pres.s6.p2'), p2: t('pres.s6.o2') },
         { p1: t('pres.s6.p3'), p2: t('pres.s6.o3') }
      ]
    },
    // 7. Ecosystem
    {
      type: 'ecosystem',
      title: t('pres.s7.title'),
      subtitle: t('pres.s7.sub'),
      points: [t('pres.s7.p1'), t('pres.s7.p2')]
    },
    // 8. Technology
    {
      type: 'tech',
      title: t('pres.s8.title'),
      stat: t('pres.s8.stat'),
      desc: t('pres.s8.desc'),
      text: t('pres.s8.text')
    },
    // 9. Volunteers
    {
      type: 'list',
      title: t('pres.s9.title'),
      subtitle: t('pres.s9.sub'),
      items: [t('pres.s9.p1'), t('pres.s9.p2'), t('pres.s9.p3')]
    },
    // 10. Success Story
    {
      type: 'quote',
      title: t('pres.s10.title'),
      quote: t('pres.s10.text'),
      author: "Maria's Journey",
      bgImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=2000"
    },
    // 11. Financials
    {
      type: 'pie',
      title: t('pres.s11.title'),
      subtitle: t('pres.s11.sub'),
      segments: [
         { label: t('pres.s11.p1'), val: '85%' },
         { label: t('pres.s11.p2'), val: '10%' },
         { label: t('pres.s11.p3'), val: '5%' }
      ]
    },
    // 12. 501c3 Tax
    {
      type: 'tax',
      title: t('pres.s12.title'),
      stat: t('pres.s12.stat'),
      subtitle: t('pres.s12.sub'),
      text: t('pres.s12.text')
    },
    // 13. Roadmap
    {
      type: 'roadmap',
      title: t('pres.s13.title'),
      steps: [t('pres.s13.q1'), t('pres.s13.q2'), t('pres.s13.q3')]
    },
    // 14. Silence is Complicity
    {
      type: 'problem', // Using problem layout for high impact
      title: t('pres.s14.title'),
      highlight: t('pres.s14.text'),
      sub: t('pres.s14.sub'),
      bgImage: "https://images.unsplash.com/photo-1596386461350-326ccb383e9f?auto=format&fit=crop&q=80&w=2000" // Darker, serious mood
    },
    // 15. The Ask
    {
      type: 'ask',
      title: t('pres.s15.title'),
      amount: t('pres.s15.goal'),
      sub: t('pres.s15.sub'),
      items: [
        { label: t('pres.s15.i1'), icon: <Camera className="w-6 h-6" /> },
        { label: t('pres.s15.i2'), icon: <Truck className="w-6 h-6" /> },
        { label: t('pres.s15.i3'), icon: <Briefcase className="w-6 h-6" /> },
        { label: t('pres.s15.i4'), icon: <Quote className="w-6 h-6" /> },
        { label: t('pres.s15.i5'), icon: <Mic className="w-6 h-6" /> },
        { label: t('pres.s15.i6'), icon: <Heart className="w-6 h-6" /> },
        { label: t('pres.s15.i7'), icon: <Link className="w-6 h-6" /> },
      ]
    },
    // 16. CTA
    {
      type: 'final',
      title: t('pres.s16.title'),
      sub: t('pres.s16.sub'),
      cta: t('pres.s16.cta')
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
                  <div className="mb-6 inline-block p-4 border border-white/30 rounded-full backdrop-blur-md bg-white/10"><Camera className="w-12 h-12 text-brand-accent"/></div>
                  <h1 className="text-5xl md:text-8xl font-serif font-bold mb-6 tracking-tighter leading-tight">{slide.title}</h1>
                  <p className="text-xl md:text-2xl text-gray-300 font-light mb-12">{slide.subtitle}</p>
                  <div className="inline-block px-6 py-2 border border-brand-accent text-brand-accent rounded-full text-sm uppercase tracking-[0.3em] font-bold">
                     {slide.tagline}
                  </div>
               </div>
            )}

            {/* PROBLEM SLIDE */}
            {slide.type === 'problem' && (
               <div className="max-w-5xl mx-auto">
                  <h2 className="text-3xl md:text-5xl font-serif font-bold mb-8 md:mb-10 text-brand-accent">{slide.title}</h2>
                  <h3 className="text-4xl md:text-6xl font-bold mb-10 md:mb-12 leading-tight text-white">{slide.highlight}</h3>
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
                  <div className="mb-10 flex justify-center text-brand-accent">{slide.icon}</div>
                  <h2 className="text-2xl md:text-4xl font-serif font-bold mb-8 text-gray-400">{slide.title}</h2>
                  <p className="text-3xl md:text-6xl font-bold leading-tight mb-16 text-white">"{slide.vision}"</p>
                  <p className="text-lg md:text-xl text-gray-400 border-t border-gray-800 pt-8">{slide.mission}</p>
               </div>
            )}

            {/* PILLARS SLIDE (RWD Fixed) */}
            {slide.type === 'pillars' && (
               <div className="text-center w-full">
                  <h2 className="text-4xl md:text-5xl font-serif font-bold mb-12 md:mb-16">{slide.title}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12">
                     {slide.items?.map((item: any, i: number) => (
                        <div key={i} className="p-6 md:p-8 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 transition-all flex flex-row md:flex-col items-center gap-4 md:gap-0 text-left md:text-center">
                           <div className="mb-0 md:mb-6 flex justify-center text-brand-accent flex-shrink-0 bg-white/10 p-3 rounded-full md:bg-transparent md:p-0">
                              {item.icon}
                           </div>
                           <div>
                              <h3 className="text-2xl md:text-3xl font-bold mb-2 md:mb-4">{item.title}</h3>
                              <p className="text-gray-400 text-sm md:text-base">{item.desc}</p>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            )}

            {/* QUOTE SLIDE */}
            {slide.type === 'quote' && (
               <div className="max-w-5xl mx-auto text-center">
                  <Quote className="w-12 h-12 md:w-16 md:h-16 text-brand-accent mx-auto mb-8 opacity-50" />
                  <p className="text-3xl md:text-6xl font-serif italic leading-tight mb-12">"{slide.quote}"</p>
                  <p className="text-lg md:text-xl font-bold text-gray-400 uppercase tracking-widest">— {slide.author}</p>
               </div>
            )}

            {/* COMPARISON SLIDE (RWD Fixed) */}
            {slide.type === 'comparison' && (
               <div className="max-w-6xl mx-auto w-full">
                  <h2 className="text-3xl md:text-4xl font-serif font-bold mb-12 text-center">{slide.title}</h2>
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

            {/* ECOSYSTEM/TECH/LIST/SIMPLE/ROADMAP (Generic Text) */}
            {(slide.type === 'ecosystem' || slide.type === 'tech' || slide.type === 'list' || slide.type === 'simple' || slide.type === 'roadmap') && (
               <div className="max-w-4xl mx-auto text-center">
                  <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">{slide.title}</h2>
                  
                  {slide.subtitle && <p className="text-xl md:text-2xl text-brand-accent mb-12">{slide.subtitle}</p>}
                  
                  {slide.points && (
                     <div className="space-y-4 md:space-y-6 text-2xl md:text-3xl font-light">
                        {(slide.points as string[]).map((p: string, i: number) => <div key={i}>• {p}</div>)}
                     </div>
                  )}

                  {slide.stat && <div className="text-[80px] md:text-[120px] font-bold leading-none text-white/90 mb-4">{slide.stat}</div>}
                  {slide.desc && <div className="text-lg md:text-xl uppercase tracking-widest text-gray-500 mb-8">{slide.desc}</div>}
                  
                  {slide.text && <p className="text-xl md:text-2xl text-gray-300 leading-relaxed">{slide.text}</p>}
                  {slide.sub && <p className="text-gray-500 mt-6">{slide.sub}</p>}

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
                      <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">{slide.title}</h2>
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
                  <p className="text-lg md:text-xl uppercase tracking-widest mb-10 text-gray-400">{slide.subtitle}</p>
                  <p className="text-xl md:text-2xl leading-relaxed">{slide.text}</p>
               </div>
            )}

            {/* THE ASK (RWD Fixed) */}
            {slide.type === 'ask' && (
               <div className="max-w-6xl mx-auto text-center w-full">
                  <h2 className="text-2xl md:text-4xl font-serif font-bold mb-8 text-gray-400 uppercase tracking-widest">{slide.title}</h2>
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
                  <h2 className="text-5xl md:text-8xl font-serif font-bold mb-8">{slide.title}</h2>
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
