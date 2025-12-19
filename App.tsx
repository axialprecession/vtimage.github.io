import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Stories } from './pages/Stories';
import { Resources } from './pages/Resources';
import { ResourceCategory } from './pages/ResourceCategory';
import { Contact } from './pages/Contact';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Profile } from './pages/Profile';
import { VerifyEmail } from './pages/VerifyEmail';
import { SubmitStory } from './pages/SubmitStory';
import { AIChat } from './pages/AIChat';
import { Volunteer } from './pages/Volunteer';
import { Presentation } from './pages/Presentation';
import { Donate } from './pages/Donate';
import { ViewState } from './types';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { ShieldAlert, X, CheckCircle2, Rocket } from 'lucide-react';
import { isFirebaseConfigured } from './firebaseConfig';

function AppContent() {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.HOME);
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const viewParam = params.get('view');
    if (viewParam) {
      const viewKey = viewParam.toUpperCase();
      if (viewKey in ViewState) {
        setCurrentView(ViewState[viewKey as keyof typeof ViewState]);
      }
    }
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView]);

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setCurrentView(ViewState.RESOURCE_CATEGORY);
  };

  const renderView = () => {
    try {
      switch (currentView) {
        case ViewState.HOME: return <Home setView={setCurrentView} />;
        case ViewState.ABOUT: return <About setView={setCurrentView} />;
        case ViewState.STORIES: return <Stories setView={setCurrentView} />;
        case ViewState.RESOURCES: return <Resources setView={setCurrentView} onCategorySelect={handleCategorySelect} />;
        case ViewState.RESOURCE_CATEGORY: return <ResourceCategory category={selectedCategory} setView={setCurrentView} />;
        case ViewState.CONTACT: return <Contact />;
        case ViewState.LOGIN: return <Login setView={setCurrentView} />;
        case ViewState.SIGNUP: return <Signup setView={setCurrentView} />;
        case ViewState.PROFILE: return <Profile />;
        case ViewState.VERIFY_EMAIL: return <VerifyEmail setView={setCurrentView} />;
        case ViewState.SUBMIT_STORY: return <SubmitStory setView={setCurrentView} />;
        case ViewState.CHAT: return <AIChat />;
        case ViewState.VOLUNTEER: return <Volunteer setView={setCurrentView} />;
        case ViewState.PRESENTATION: return <Presentation setView={setCurrentView} />;
        case ViewState.DONATE: return <Donate setView={setCurrentView} />;
        default: return <Home setView={setCurrentView} />;
      }
    } catch (e) {
      console.error("View Rendering Error:", e);
      return <div className="p-20 text-center font-serif text-gray-500">System Reset Required. Please refresh browser.</div>;
    }
  };

  if (currentView === ViewState.PRESENTATION) {
     return renderView();
  }

  return (
    <div className="flex flex-col min-h-screen font-sans text-brand-black bg-white selection:bg-brand-accent selection:text-white">
      <Navbar currentView={currentView} setView={setCurrentView} />
      <main className="flex-grow min-h-[60vh]">
        {renderView()}
      </main>
      <Footer setView={setCurrentView} />
    </div>
  );
}

export default function App() {
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      const hasSeenWelcome = sessionStorage.getItem('vti_welcome_seen');
      if (!hasSeenWelcome) setShowWelcome(true);
    }
  }, []);

  const closeWelcome = () => {
    setShowWelcome(false);
    sessionStorage.setItem('vti_welcome_seen', 'true');
  };

  return (
    <LanguageProvider>
      <AuthProvider>
        <AppContent />
        {showWelcome && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
             <div className="bg-white rounded-[2rem] max-w-md w-full p-8 shadow-2xl animate-slide-up relative">
                <button onClick={closeWelcome} className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                   <X className="w-4 h-4" />
                </button>
                <div className="flex justify-center mb-6">
                   <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                      <Rocket className="w-8 h-8" />
                   </div>
                </div>
                <h3 className="text-2xl font-serif font-bold text-center mb-4">Ready for Preview</h3>
                <p className="text-gray-500 text-center mb-8 leading-relaxed">
                   We noticed Firebase isn't fully configured yet, but that's okay! We've enabled <b>Demo Mode</b> so you can explore all features immediately.
                </p>
                <button onClick={closeWelcome} className="w-full py-4 bg-brand-black text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-brand-accent transition-all shadow-lg flex items-center justify-center gap-2">
                   Start Exploring <CheckCircle2 className="w-4 h-4" />
                </button>
             </div>
          </div>
        )}
      </AuthProvider>
    </LanguageProvider>
  );
}