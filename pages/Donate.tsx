
import React from 'react';
import { Heart, ShieldCheck, CheckCircle2, ArrowRight, ExternalLink, Camera, Users, Clapperboard } from 'lucide-react';
import { ViewState } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface DonateProps {
  setView: (view: ViewState) => void;
}

export const Donate: React.FC<DonateProps> = ({ setView }) => {
  const { t, language } = useLanguage();
  const isChinese = language.startsWith('zh');

  return (
    <div className="min-h-screen bg-brand-cream">
      {/* Hero Section */}
      <div className="bg-brand-black text-white pt-32 pb-48 rounded-b-[4rem] relative overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-transparent to-brand-black/50"></div>
        
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <div className="inline-block px-4 py-1.5 border border-white/20 rounded-full text-[10px] font-bold uppercase tracking-[0.3em] mb-8 text-brand-accent bg-white/5 backdrop-blur-sm">
             501(c)(3) Certified
          </div>
          <h1 className={`text-5xl md:text-7xl font-bold mb-8 tracking-tight leading-tight ${isChinese ? 'font-ming' : 'font-serif'}`}>
            {t('donate.page.title')}
          </h1>
          <p className="text-xl text-gray-300 font-light max-w-2xl mx-auto leading-relaxed">
            {t('donate.page.sub')}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 -mt-24 pb-40 relative z-10">
        <div className="bg-white rounded-[3rem] p-10 md:p-16 shadow-2xl border border-gray-100">
          
          <div className="flex flex-col md:flex-row gap-12 items-center mb-16">
             <div className="flex-1">
                <h2 className={`text-3xl font-bold mb-6 text-brand-black ${isChinese ? 'font-ming' : 'font-serif'}`}>{t('donate.tiers.title')}</h2>
                <div className="space-y-6">
                   <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors">
                      <div className="bg-brand-cream p-3 rounded-full text-brand-accent"><Camera className="w-6 h-6"/></div>
                      <div>
                         <h3 className="font-bold text-lg mb-1">{t('donate.tier1.title')}</h3>
                         <p className="text-gray-500 text-sm">{t('donate.tier1.desc')}</p>
                      </div>
                   </div>
                   <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors">
                      <div className="bg-brand-cream p-3 rounded-full text-brand-accent"><Users className="w-6 h-6"/></div>
                      <div>
                         <h3 className="font-bold text-lg mb-1">{t('donate.tier2.title')}</h3>
                         <p className="text-gray-500 text-sm">{t('donate.tier2.desc')}</p>
                      </div>
                   </div>
                   <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors">
                      <div className="bg-brand-cream p-3 rounded-full text-brand-accent"><Clapperboard className="w-6 h-6"/></div>
                      <div>
                         <h3 className="font-bold text-lg mb-1">{t('donate.tier3.title')}</h3>
                         <p className="text-gray-500 text-sm">{t('donate.tier3.desc')}</p>
                      </div>
                   </div>
                </div>
             </div>

             <div className="flex-1 w-full">
                <div className="bg-brand-black rounded-[2.5rem] p-8 md:p-12 text-center text-white relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-8 opacity-10"><Heart className="w-32 h-32" /></div>
                   
                   <h3 className="text-2xl font-serif font-bold mb-8 relative z-10">{t('about.donate.btn')}</h3>
                   
                   <a 
                      href="https://www.zeffy.com/en-US/donation-form/support-voice-through-image-operations"
                      target="_blank"
                      rel="noreferrer"
                      className="block w-full py-4 bg-white text-brand-black rounded-full font-black uppercase tracking-widest text-sm hover:bg-brand-accent hover:text-white transition-all shadow-lg hover:shadow-brand-accent/50 hover:scale-105 mb-6 relative z-10 flex items-center justify-center gap-2"
                   >
                      {t('donate.secure')} <ExternalLink className="w-4 h-4"/>
                   </a>
                   
                   <div className="flex items-center justify-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                      <ShieldCheck className="w-3 h-3" /> {t('donate.fee_note')}
                   </div>
                </div>
             </div>
          </div>

          <div className="border-t border-gray-100 pt-10 text-center">
             <div className="inline-flex items-center gap-2 text-brand-accent font-bold text-xs uppercase tracking-widest mb-4">
                <CheckCircle2 className="w-4 h-4" /> Tax Deductible
             </div>
             <p className="text-gray-500 max-w-2xl mx-auto mb-4">{t('about.legal_text')}</p>
             <p className="text-sm text-gray-400 italic">{t('donate.check')}</p>
          </div>

        </div>
      </div>
    </div>
  );
};
