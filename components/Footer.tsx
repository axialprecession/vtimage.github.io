import React from 'react';
import { Mail, MapPin, Phone, ShieldCheck, Presentation, Globe } from 'lucide-react';
import { Logo } from './Logo';
import { useLanguage } from '../context/LanguageContext';
import { ViewState } from '../types';

interface FooterProps {
  setView?: (view: ViewState) => void;
}

export const Footer: React.FC<FooterProps> = ({ setView }) => {
  const { t } = useLanguage();

  return (
    <footer className="bg-brand-dark text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-white p-1 rounded-full w-10 h-10 flex items-center justify-center">
                <Logo className="w-full h-full" />
              </div>
              <div>
                <h3 className="text-2xl font-serif font-bold tracking-tight uppercase">Voice Through Image</h3>
                <a href="https://vtimage.org" className="text-brand-accent text-xs font-bold tracking-widest hover:text-white transition-colors">VTIMAGE.ORG</a>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              {t('footer.desc')}
            </p>
            <div className="pt-2 border-l-2 border-brand-accent pl-4">
              <div className="flex items-center gap-2 text-brand-accent font-bold text-xs uppercase tracking-widest">
                <ShieldCheck className="w-4 h-4" />
                <span>501(c)(3) Nonprofit</span>
              </div>
              <p className="text-gray-200 text-sm mt-1 font-mono font-bold">{t('footer.ein')}</p>
              <p className="text-gray-500 text-[10px] mt-1 italic">{t('footer.tax_exempt')}</p>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold tracking-wide uppercase text-gray-200">{t('nav.contact')}</h4>
            <div className="space-y-3">
               <div className="flex items-start space-x-3 text-gray-400">
                <MapPin className="w-5 h-5 mt-0.5 shrink-0" />
                <span className="text-sm">20153 Paseo Del Prado,<br/>Walnut, CA 91789</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400">
                <Mail className="w-5 h-5 shrink-0" />
                <span className="text-sm">VITorg@gmail.com</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400">
                <Phone className="w-5 h-5 shrink-0" />
                <span className="text-sm">+1 (555) 012-3456</span>
              </div>
            </div>
          </div>

          {/* Legal / Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold tracking-wide uppercase text-gray-200">Governance</h4>
             <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">IRS Determination Letter</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Financial Reports</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Bylaws & Policies</a></li>
              
              {/* Presentation Mode Trigger */}
              <li className="pt-4">
                 <button 
                   onClick={() => setView?.(ViewState.PRESENTATION)}
                   className="flex items-center gap-2 text-brand-accent hover:text-white transition-colors font-bold uppercase text-[10px] tracking-widest border border-brand-accent/30 px-3 py-1.5 rounded-full hover:bg-brand-accent"
                 >
                   <Presentation className="w-3 h-3" /> View Official Deck
                 </button>
              </li>
            </ul>
             <div className="pt-4">
              <span className="inline-block bg-gray-800 text-gray-400 rounded-full px-4 py-1.5 text-[10px] uppercase font-bold tracking-tighter">
                Incorporated Nov 4, 2025
              </span>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-gray-600 text-xs">
          <p>&copy; {new Date().getFullYear()} Voice Through Image Inc. All Rights Reserved.</p>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
             <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
             <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};