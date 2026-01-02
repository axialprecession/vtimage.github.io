
import React from 'react';
import { Calendar, User, ShieldCheck, FileText, CheckCircle, Eye, UserPlus, Send, Heart, Users } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { ViewState } from '../types';

interface AboutProps {
  setView?: (view: ViewState) => void;
}

export const About: React.FC<AboutProps> = ({ setView }) => {
  const { t, language, font } = useLanguage();
  const isChinese = language.startsWith('zh');

  const participationSteps = [
    {
      icon: <Eye className="w-8 h-8 text-brand-accent" />,
      title: t('about.participate.step1'),
      desc: t('about.participate.step1_desc')
    },
    {
      icon: <UserPlus className="w-8 h-8 text-brand-accent" />,
      title: t('about.participate.step2'),
      desc: t('about.participate.step2_desc')
    },
    {
      icon: <Send className="w-8 h-8 text-brand-accent" />,
      title: t('about.participate.step3'),
      desc: t('about.participate.step3_desc')
    }
  ];

  return (
    <div className="min-h-screen bg-white py-20 md:py-32">
      <div className="max-w-5xl mx-auto px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-20 animate-slide-up">
          <div className="inline-block px-4 py-1.5 border border-brand-black/10 rounded-full text-[10px] font-bold uppercase tracking-[0.3em] mb-6 text-brand-accent">
             {t('about.tag')}
          </div>
          <h1 className={`text-5xl md:text-6xl font-bold text-brand-black mb-6 tracking-tight ${font}`}>{t('about.title')}</h1>
          <p className="text-xl md:text-2xl text-gray-500 max-w-3xl mx-auto font-light leading-relaxed">
            {t('about.subtitle')}
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="bg-brand-cream rounded-[3rem] p-10 md:p-16 mb-20 border border-gray-100 shadow-soft animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <h2 className={`text-3xl font-bold mb-10 flex items-center ${font}`}>
            <span className="w-2 h-8 bg-brand-accent mr-4 rounded-full"></span>
            {t('about.vision_title')}
          </h2>
          <div className="space-y-12">
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-4">{t('about.vision_sub')}</h3>
              <p className={`text-2xl md:text-3xl text-brand-black leading-relaxed ${font} ${isChinese ? 'font-bold' : 'italic'}`}>
                {t('about.vision_text')}
              </p>
            </div>
            <div className="pt-12 border-t border-gray-200">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-6">{t('about.mission_sub')}</h3>
              <ul className="space-y-6">
                {[t('about.mission_1'), t('about.mission_2'), t('about.mission_3')].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-4">
                    <div className="bg-white p-1 rounded-full shadow-sm mt-1">
                       <CheckCircle className="w-5 h-5 text-brand-accent" />
                    </div>
                    <span className="text-lg text-gray-700 leading-relaxed font-light">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Participation Steps */}
        <div className="mb-24">
          <h2 className={`text-4xl font-bold text-center mb-16 ${font}`}>{t('about.participate.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {participationSteps.map((step, idx) => (
              <div key={idx} className="text-center p-8 rounded-[2.5rem] bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:border-brand-accent/20 transition-all duration-300 hover:-translate-y-2 group">
                <div className="mx-auto w-20 h-20 bg-brand-cream rounded-full flex items-center justify-center mb-6 group-hover:bg-brand-black transition-colors duration-300 shadow-inner">
                  <div className="text-brand-accent group-hover:text-white transition-colors">{step.icon}</div>
                </div>
                <h3 className={`text-xl font-bold mb-3 ${font}`}>{step.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Volunteer With Us Section */}
        <div className="bg-white border border-gray-100 rounded-[3rem] p-10 md:p-16 mb-24 flex flex-col md:flex-row items-center gap-12 shadow-2xl relative overflow-hidden group">
           <div className="absolute inset-0 bg-brand-black opacity-[0.02] pointer-events-none group-hover:opacity-[0.04] transition-opacity"></div>
           <div className="w-32 h-32 bg-brand-black text-white rounded-full flex items-center justify-center flex-shrink-0 shadow-2xl ring-8 ring-gray-50">
              <Users className="w-12 h-12" />
           </div>
           <div className="flex-1 text-center md:text-left relative z-10">
              <h3 className={`text-4xl font-bold text-brand-black mb-4 ${font}`}>{t('about.volunteer.title')}</h3>
              <p className="text-gray-600 text-lg mb-6 leading-relaxed font-light">{t('about.volunteer.desc')}</p>
              <div className="inline-block bg-gray-50 px-4 py-2 rounded-lg border border-gray-100 mb-8">
                 <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{t('about.volunteer.roles')}</p>
              </div>
              <br/>
              <button 
                onClick={() => setView?.(ViewState.VOLUNTEER)}
                className="px-10 py-4 bg-brand-black text-white rounded-full font-bold uppercase tracking-widest hover:bg-brand-accent transition-all shadow-lg hover:shadow-xl hover:scale-105"
              >
                {t('about.volunteer.btn')}
              </button>
           </div>
        </div>

        {/* Dedicated Donate Section */}
        <div className="bg-brand-black rounded-[3rem] p-12 md:p-20 text-center text-white mb-24 relative overflow-hidden group">
          {/* Background decoration */}
          <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] pointer-events-none"></div>
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand-accent/30 rounded-full blur-[100px] pointer-events-none"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px] pointer-events-none"></div>

          <div className="relative z-10 flex flex-col items-center">
            <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-brand-accent font-bold text-[10px] uppercase tracking-[0.2em] mb-10">
              <ShieldCheck className="w-3 h-3" />
              Official 501(c)(3) Certified
            </div>

            <h2 className={`text-5xl md:text-7xl font-bold mb-8 tracking-tighter leading-none ${font}`}>
              {t('about.donate.title')}
            </h2>
            <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto mb-6 leading-relaxed font-light">
              {t('about.donate.subtitle')}
            </p>
            <p className="text-brand-accent font-bold uppercase tracking-widest text-xs mb-12 animate-pulse">
              {t('about.donate.tax')}
            </p>

            <a 
              href="https://www.zeffy.com/en-US/donation-form/support-voice-through-image-operations"
              target="_blank"
              rel="noreferrer"
              className="px-12 py-5 bg-white text-brand-black rounded-full text-sm font-black uppercase tracking-widest hover:bg-brand-accent hover:text-white transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-brand-accent/50 hover:scale-105 flex items-center gap-3"
            >
               {t('about.donate.btn')} <Heart className="w-4 h-4 fill-current" />
            </a>
          </div>
        </div>

        {/* Corporate History / Leadership */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-gray-50 rounded-[2.5rem] border border-gray-100 p-10 shadow-sm hover:shadow-md transition-shadow">
            <h3 className={`text-xl font-bold mb-6 flex items-center gap-3 ${font}`}>
              <div className="bg-white p-2 rounded-full shadow-sm"><Calendar className="w-5 h-5 text-brand-accent" /></div>
              {t('about.history')}
            </h3>
            <p className="text-gray-600 leading-relaxed font-light">
              {t('about.history_text')}
            </p>
          </div>
          
          <div className="bg-gray-50 rounded-[2.5rem] border border-gray-100 p-10 shadow-sm hover:shadow-md transition-shadow">
            <h3 className={`text-xl font-bold mb-6 flex items-center gap-3 ${font}`}>
              <div className="bg-white p-2 rounded-full shadow-sm"><User className="w-5 h-5 text-brand-accent" /></div>
              {t('about.leadership')}
            </h3>
             <ul className="space-y-6">
               <li className="flex flex-col">
                  <span className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1">{t('about.founder')}</span>
                  <span className={`font-bold text-xl text-gray-900 ${font}`}>Matchy Chyan</span>
               </li>
               <li className="flex flex-col">
                  <span className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1">{t('about.roles')}</span>
                  <span className="text-gray-600 font-medium">{t('about.roles_list')}</span>
               </li>
             </ul>
          </div>
        </div>

        {/* Legal & Tax Transparency Section */}
        <div className="relative bg-white border border-gray-100 rounded-[3rem] p-10 md:p-16 overflow-hidden shadow-2xl">
          <div className="absolute -top-10 -right-10 opacity-[0.03] rotate-12 pointer-events-none">
            <ShieldCheck className="w-80 h-80 text-brand-black" />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center md:items-start">
            <div className="flex-shrink-0 w-32 h-32 md:w-40 md:h-40 rounded-full border-8 border-gray-50 bg-white flex flex-col items-center justify-center text-center p-4 shadow-xl">
               <ShieldCheck className="w-10 h-10 md:w-12 md:h-12 text-brand-accent mb-2" />
               <span className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-tighter leading-none mb-1">IRS Determined</span>
               <span className="text-xl md:text-3xl font-serif font-bold text-brand-black">501(c)(3)</span>
            </div>

            <div className="flex-1 text-center md:text-left">
              <h3 className={`text-3xl font-bold text-brand-black mb-6 ${font}`}>{t('about.legal')}</h3>
              <p className="text-gray-600 leading-relaxed mb-10 font-light text-lg">
                {t('about.legal_text')}
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                  <span className="block text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-2">
                    {t('about.legal_ein')}
                  </span>
                  <span className="font-mono text-xl font-bold text-brand-black tracking-wider">41-2510011</span>
                </div>
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                  <span className="block text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-2">
                    Certification Date
                  </span>
                  <span className="font-serif text-xl font-bold text-brand-black">Nov 4, 2025</span>
                </div>
              </div>

              <div className="mt-8 flex items-center justify-center md:justify-start gap-2 text-[10px] text-gray-400 uppercase tracking-wider font-bold">
                <FileText className="w-4 h-4" />
                <span>IRS Letter 947 (Rev. 2-2020) | Catalog Number 35152P</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
