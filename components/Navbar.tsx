
import React, { useState, useEffect } from 'react';
import { Menu, X, Heart, MessageCircle, Check, User as UserIcon, LogOut, ArrowRight } from 'lucide-react';
import { ViewState } from '../types';
import { useAuth } from '../context/AuthContext';
import { useLanguage, Language } from '../context/LanguageContext';
import { Logo } from './Logo';

interface NavbarProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, setView }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  const isChinese = language.startsWith('zh');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: t('nav.home'), value: ViewState.HOME },
    { label: t('nav.about'), value: ViewState.ABOUT },
    { label: t('nav.stories'), value: ViewState.STORIES },
    { label: t('nav.resources'), value: ViewState.RESOURCES },
    { label: t('nav.contact'), value: ViewState.CONTACT },
  ];

  const languages: { code: Language; label: string }[] = [
    { code: 'en', label: 'EN' },
    { code: 'zh-TW', label: '繁體' },
    { code: 'zh-CN', label: '简体' },
    { code: 'es', label: 'ES' },
  ];

  const handleProfileClick = () => {
    setView(ViewState.PROFILE);
    setProfileMenuOpen(false);
    setIsOpen(false);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${scrolled ? 'py-2' : 'py-6'}`}>
      <div className={`mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl transition-all duration-500`}>
        {/* Glass Container */}
        <div className={`relative bg-white/70 backdrop-blur-md border border-white/50 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] rounded-full px-6 transition-all duration-500 ${scrolled ? 'h-16' : 'h-20'} flex justify-between items-center`}>
          
          {/* Logo Section */}
          <div className="flex items-center cursor-pointer group gap-3" onClick={() => setView(ViewState.HOME)}>
            {/* Changed from brand-black to black to ensure deep black color */}
            <div className="text-black transition-transform duration-500 group-hover:rotate-90">
              <Logo className="h-10 w-10 md:h-9 md:w-9" />
            </div>
            <div className="flex flex-col justify-center">
              <div className="font-serif font-bold tracking-tighter text-black leading-none group-hover:text-brand-accent transition-colors">
                
                {/* Mobile View - Adjusted size and vertical alignment */}
                <div className="md:hidden flex items-center gap-3">
                  <span className="text-2xl">VTI</span>
                  {isChinese && (
                    <span className="text-xl font-ming font-bold tracking-widest text-gray-800 border-l-2 border-gray-300 pl-3 pt-0.5">
                      影像之聲
                    </span>
                  )}
                </div>

                {/* Desktop View - Adjusted size and vertical alignment */}
                <div className="hidden md:flex items-center gap-3">
                  <span className="text-xl">Voice Through Image</span>
                  {isChinese && (
                    <span className="text-lg font-ming font-bold tracking-widest text-gray-600 border-l-2 border-gray-300 pl-3 pt-0.5">
                      影像之聲
                    </span>
                  )}
                </div>

              </div>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex md:items-center md:space-x-1">
            {navItems.map((item) => (
              <button
                key={item.value}
                onClick={() => setView(item.value)}
                className={`relative px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
                  currentView === item.value
                    ? 'text-black bg-black/5'
                    : 'text-gray-500 hover:text-black hover:bg-black/5'
                }`}
              >
                {item.label}
              </button>
            ))}

            <div className="h-4 w-px bg-gray-300 mx-4 opacity-50"></div>

            {/* AI Assistant Button */}
            <button
               onClick={() => setView(ViewState.CHAT)}
               className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${
                 currentView === ViewState.CHAT
                  ? 'bg-brand-accent border-brand-accent text-white shadow-glow'
                  : 'bg-transparent border-gray-200 text-gray-500 hover:border-brand-accent hover:text-brand-accent'
               }`}
            >
               <MessageCircle className="w-3.5 h-3.5" />
               <span className="hidden lg:inline">{t('nav.chat')}</span>
            </button>

            {/* Donate Button (Internal Route) */}
            <button
               onClick={() => setView(ViewState.DONATE)}
               className={`ml-2 flex items-center gap-2 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-colors shadow-lg ${
                 currentView === ViewState.DONATE
                 ? 'bg-brand-accent text-white'
                 : 'bg-black text-white hover:bg-brand-accent hover:shadow-brand-accent/30'
               }`}
            >
               <Heart className="w-3 h-3 fill-current" />
               <span>{t('nav.donate')}</span>
            </button>

            {/* Language Switcher */}
            <div className="relative ml-2">
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center justify-center w-8 h-8 text-[10px] font-bold text-gray-500 hover:text-black hover:bg-gray-100 rounded-full transition-colors"
              >
                {languages.find(l => l.code === language)?.label}
              </button>
              
              {langMenuOpen && (
                 <div className="absolute right-0 top-full mt-2 w-32 bg-white rounded-2xl shadow-xl py-2 border border-gray-100 overflow-hidden animate-slide-up z-50">
                    {languages.map(lang => (
                      <button
                        key={lang.code}
                        onClick={() => { setLanguage(lang.code); setLangMenuOpen(false); }}
                        className={`w-full text-left px-4 py-2 text-xs flex items-center justify-between hover:bg-gray-50 transition-colors ${language === lang.code ? 'font-bold text-brand-accent' : 'text-gray-600'}`}
                      >
                        {lang.label}
                        {language === lang.code && <Check className="w-3 h-3" />}
                      </button>
                    ))}
                 </div>
              )}
            </div>

            {/* Auth Section */}
            {isAuthenticated && user ? (
              <div className="relative ml-4">
                <button 
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="flex items-center gap-3 pl-1 pr-1 py-1 rounded-full hover:bg-gray-50 transition-all border border-transparent hover:border-gray-200"
                >
                  <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center overflow-hidden shadow-md ring-2 ring-white">
                     {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                     ) : (
                        <span className="font-serif font-bold text-xs">{user.name.charAt(0)}</span>
                     )}
                  </div>
                </button>

                {profileMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-60 bg-white rounded-3xl shadow-soft py-2 border border-gray-100 overflow-hidden animate-slide-up z-50">
                    <div className="px-6 py-4 border-b border-gray-50 bg-brand-cream">
                      <p className="text-sm font-bold text-black truncate">{user.name}</p>
                      <p className="text-[10px] text-gray-400 font-medium truncate">{user.email}</p>
                    </div>
                    <div className="p-2 space-y-1">
                      <button onClick={handleProfileClick} className="flex items-center gap-3 w-full text-left px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 rounded-xl transition-colors">
                        <UserIcon className="w-4 h-4" /> {t('nav.profile')}
                      </button>
                      <button onClick={() => { logout(); setView(ViewState.HOME); }} className="flex items-center gap-3 w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                        <LogOut className="w-4 h-4" /> {t('nav.signout')}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2 ml-4">
                <button 
                  onClick={() => setView(ViewState.LOGIN)}
                  className="px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-black hover:bg-gray-50 transition-colors"
                >
                  {t('nav.login')}
                </button>
                <button 
                  onClick={() => setView(ViewState.SIGNUP)}
                  className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center hover:bg-brand-accent transition-colors shadow-lg"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-full text-black hover:bg-gray-100 transition-colors"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-white/95 backdrop-blur-xl animate-fade-in pt-32 px-6 pb-6 overflow-y-auto">
           <div className="flex flex-col space-y-4">
            {navItems.map((item) => (
              <button
                key={item.value}
                onClick={() => { setView(item.value); setIsOpen(false); }}
                className={`text-3xl font-serif font-bold text-left py-2 border-b border-gray-100 ${
                  currentView === item.value ? 'text-brand-accent' : 'text-black'
                }`}
              >
                {item.label}
              </button>
            ))}
            
            <button
               onClick={() => { setView(ViewState.CHAT); setIsOpen(false); }}
               className="text-3xl font-serif font-bold text-left py-2 border-b border-gray-100 flex items-center gap-3 text-blue-600"
            >
               {t('nav.chat')} <MessageCircle className="w-6 h-6" />
            </button>

            <button
               onClick={() => { setView(ViewState.DONATE); setIsOpen(false); }}
               className="text-3xl font-serif font-bold text-left py-2 border-b border-gray-100 flex items-center gap-3 text-brand-accent"
            >
               {t('nav.donate')} <Heart className="w-6 h-6 fill-current" />
            </button>

            <div className="pt-8 grid grid-cols-2 gap-4">
               {isAuthenticated ? (
                 <button onClick={() => { logout(); setIsOpen(false); }} className="px-6 py-4 bg-gray-100 rounded-2xl text-sm font-bold">Sign Out</button>
               ) : (
                 <>
                   <button onClick={() => { setView(ViewState.LOGIN); setIsOpen(false); }} className="px-6 py-4 bg-gray-100 rounded-2xl text-sm font-bold">Log In</button>
                   <button onClick={() => { setView(ViewState.SIGNUP); setIsOpen(false); }} className="px-6 py-4 bg-black text-white rounded-2xl text-sm font-bold">Join Us</button>
                 </>
               )}
            </div>
            
            <div className="pt-8 flex gap-4 justify-center">
               {languages.map(lang => (
                 <button 
                   key={lang.code}
                   onClick={() => { setLanguage(lang.code); setIsOpen(false); }}
                   className={`text-sm font-bold uppercase ${language === lang.code ? 'text-brand-accent underline' : 'text-gray-400'}`}
                 >
                   {lang.label}
                 </button>
               ))}
            </div>
           </div>
        </div>
      )}
    </nav>
  );
};
