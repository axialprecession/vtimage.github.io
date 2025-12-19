
import React from 'react';
import { Mail, Phone, MapPin, Send, MessageCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const Contact: React.FC = () => {
  const { t, language } = useLanguage();
  const isChinese = language.startsWith('zh');

  return (
    <div className="min-h-screen bg-brand-cream py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* Contact Info */}
          <div className="space-y-12 animate-slide-up">
            <div>
              <div className="inline-block px-4 py-1.5 border border-brand-black/10 rounded-full text-[10px] font-bold uppercase tracking-[0.3em] mb-6 text-brand-accent bg-white">
                 Get in Touch
              </div>
              <h1 className={`text-5xl md:text-6xl font-bold mb-6 text-brand-black ${isChinese ? 'font-ming' : 'font-serif'}`}>
                {t('contact.title')}
              </h1>
              <p className="text-xl text-gray-500 font-light leading-relaxed max-w-md">
                {t('contact.subtitle')}
              </p>
            </div>

            <div className="space-y-8">
              <div className="flex items-start gap-6 group p-6 rounded-3xl hover:bg-white transition-colors duration-300">
                <div className="bg-brand-black text-white p-4 rounded-full shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className={`font-bold text-lg text-brand-black mb-2 ${isChinese ? 'font-ming' : 'font-serif'}`}>{t('contact.office')}</h3>
                  <p className="text-gray-500 leading-relaxed">20153 Paseo Del Prado<br/>Walnut, CA 91789</p>
                </div>
              </div>

              <div className="flex items-start gap-6 group p-6 rounded-3xl hover:bg-white transition-colors duration-300">
                <div className="bg-brand-black text-white p-4 rounded-full shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className={`font-bold text-lg text-brand-black mb-2 ${isChinese ? 'font-ming' : 'font-serif'}`}>{t('contact.email')}</h3>
                  <p className="text-gray-500">VITorg@gmail.com</p>
                  <p className="text-gray-400 text-xs mt-2 uppercase tracking-widest font-bold">Media & Partnerships</p>
                </div>
              </div>

              <div className="flex items-start gap-6 group p-6 rounded-3xl hover:bg-white transition-colors duration-300">
                <div className="bg-brand-black text-white p-4 rounded-full shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className={`font-bold text-lg text-brand-black mb-2 ${isChinese ? 'font-ming' : 'font-serif'}`}>{t('contact.phone')}</h3>
                  <p className="text-gray-500">+1 (555) 012-3456</p>
                  <p className="text-gray-400 text-xs mt-2 uppercase tracking-widest font-bold">Mon-Fri, 9am - 5pm PST</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white p-10 md:p-12 rounded-[3rem] shadow-xl border border-gray-100 relative overflow-hidden animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none">
               <MessageCircle className="w-64 h-64 text-brand-black" />
            </div>
            
            <h2 className={`text-3xl font-bold mb-8 text-brand-black relative z-10 ${isChinese ? 'font-ming' : 'font-serif'}`}>
              {t('contact.form.title')}
            </h2>
            
            <form className="space-y-6 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest ml-2">{t('contact.form.name')}</label>
                  <input 
                    type="text" 
                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-brand-accent/20 focus:ring-4 focus:ring-brand-accent/10 outline-none transition-all text-gray-800 font-medium placeholder-gray-300"
                    placeholder="Jane Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest ml-2">{t('contact.form.email')}</label>
                  <input 
                    type="email" 
                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-brand-accent/20 focus:ring-4 focus:ring-brand-accent/10 outline-none transition-all text-gray-800 font-medium placeholder-gray-300"
                    placeholder="jane@example.com"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest ml-2">{t('contact.form.subject')}</label>
                <div className="relative">
                  <select className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-brand-accent/20 focus:ring-4 focus:ring-brand-accent/10 outline-none transition-all text-gray-800 font-medium appearance-none cursor-pointer">
                    <option>General Inquiry</option>
                    <option>Volunteer Opportunities</option>
                    <option>Submit a Story Idea</option>
                    <option>Partnership/Sponsorship</option>
                  </select>
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest ml-2">{t('contact.form.message')}</label>
                <textarea 
                  rows={5} 
                  className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-brand-accent/20 focus:ring-4 focus:ring-brand-accent/10 outline-none transition-all text-gray-800 font-medium placeholder-gray-300 resize-none"
                  placeholder="How can we help?"
                ></textarea>
              </div>

              <button 
                type="button" 
                className="w-full bg-brand-black text-white py-5 rounded-2xl font-bold uppercase tracking-widest hover:bg-brand-accent transition-all shadow-lg hover:shadow-brand-accent/30 hover:-translate-y-1 flex items-center justify-center gap-3 text-sm"
              >
                {t('contact.form.send')} <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
