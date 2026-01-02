
import React, { useState } from 'react';
import { ViewState } from '../types';
import { ArrowLeft, CheckCircle, Send, HeartHandshake } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface VolunteerProps {
  setView: (view: ViewState) => void;
}

export const Volunteer: React.FC<VolunteerProps> = ({ setView }) => {
  const { t, font } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white max-w-md w-full rounded-[2.5rem] p-12 shadow-2xl text-center border border-gray-100">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className={`text-3xl font-bold text-gray-900 mb-4 ${font}`}>{t('volunteer.success')}</h2>
          <p className="text-gray-500 mb-10 leading-relaxed">Our coordinator will review your profile and reach out within 3-5 business days.</p>
          <button 
            onClick={() => setView(ViewState.HOME)} 
            className="w-full py-4 bg-brand-black text-white rounded-full font-bold uppercase tracking-widest text-sm hover:scale-105 transition-all"
          >
            {t('common.back')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="max-w-3xl mx-auto px-6">
        <button 
          onClick={() => setView(ViewState.ABOUT)} 
          className="flex items-center text-gray-400 hover:text-black transition-colors mb-12 group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-2 transition-transform" /> 
          <span className="text-xs font-bold uppercase tracking-widest">{t('common.back')}</span>
        </button>

        <div className="bg-white rounded-[3rem] shadow-xl overflow-hidden border border-gray-100">
          <div className="bg-brand-black text-white p-10 md:p-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 opacity-10 p-10">
               <HeartHandshake className="w-40 h-40" />
            </div>
            <div className="relative z-10">
               <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${font}`}>{t('volunteer.title')}</h1>
               <p className="text-gray-400 text-lg font-light max-w-xl">{t('volunteer.subtitle')}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-10 md:p-16 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-2">{t('volunteer.form.name')}</label>
                <input 
                  required 
                  type="text" 
                  className="w-full bg-gray-50 px-6 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-brand-accent transition-all font-medium text-gray-800" 
                  placeholder="Jane Doe" 
                />
              </div>
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-2">{t('volunteer.form.phone')}</label>
                <input 
                  required 
                  type="tel" 
                  className="w-full bg-gray-50 px-6 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-brand-accent transition-all font-medium text-gray-800" 
                  placeholder="(555) 123-4567" 
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-2">{t('volunteer.form.email')}</label>
              <input 
                required 
                type="email" 
                className="w-full bg-gray-50 px-6 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-brand-accent transition-all font-medium text-gray-800" 
                placeholder="you@example.com" 
              />
            </div>

            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-2">{t('volunteer.form.role')}</label>
              <select className="w-full bg-gray-50 px-6 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-brand-accent transition-all font-medium text-gray-800 cursor-pointer appearance-none">
                <option>Field Documentation / Videography</option>
                <option>Community Outreach</option>
                <option>Event Support</option>
                <option>Translation / Administrative</option>
                <option>Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-2">{t('volunteer.form.message')}</label>
              <textarea 
                required 
                rows={4} 
                className="w-full bg-gray-50 px-6 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-brand-accent transition-all text-gray-800 resize-none" 
                placeholder="Tell us a bit about yourself..." 
              />
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting} 
              className="w-full py-5 bg-brand-accent text-white rounded-full font-bold uppercase tracking-widest text-sm hover:bg-red-700 transition-all disabled:bg-gray-200 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg"
            >
               {isSubmitting ? t('common.processing') : (
                 <>{t('common.submit')} <Send className="w-4 h-4" /></>
               )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
