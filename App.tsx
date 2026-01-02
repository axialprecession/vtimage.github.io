
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
import { AdminDashboard } from './pages/AdminDashboard';
import { ViewState } from './types';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { ShieldAlert, X, CheckCircle2, Rocket, Database, Key, Terminal } from 'lucide-react';
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

  useEffect(() => {
    if (window.location.hostname !== 'localhost' && window.location.protocol === 'http:') {
      window.location.href = window.location.href.replace('http:', 'https:');
    }
  }, []);

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
        case ViewState.ADMIN_DASHBOARD: return <AdminDashboard setView={setCurrentView} />;
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
  // Debug Logic to identify exactly what is missing
  const env = (import.meta as any).env || {};
  // Use explicit checks to see what Vite loaded
  const geminiKey = process.env.GEMINI_API_KEY || env.GEMINI_API_KEY;
  const fbKey = process.env.VITE_FIREBASE_API_KEY || env.VITE_FIREBASE_API_KEY;
  
  const hasGeminiKey = !!geminiKey;
  const hasFirebase = !!fbKey;

  const [showBanner, setShowBanner] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      const hasSeenWelcome = sessionStorage.getItem('vti_welcome_seen');
      if (!hasSeenWelcome) {
        setShowWelcome(true);
      }
    }
  }, []);

  const closeWelcome = () => {
    setShowWelcome(false);
    sessionStorage.setItem('vti_welcome_seen', 'true');
  };

  const isLimitedMode = !hasGeminiKey || !isFirebaseConfigured;

  return (
    <LanguageProvider>
      <AuthProvider>
        <AppContent />
        
        {/* ENHANCED DEBUG MODAL */}
        {showWelcome && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
             <div className="bg-white rounded-[2rem] max-w-lg w-full p-8 shadow-2xl animate-slide-up relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 to-orange-500"></div>
                <button onClick={closeWelcome} className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                   <X className="w-4 h-4" />
                </button>
                
                <div className="flex justify-center mb-6">
                   <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-600 border-4 border-red-100">
                      <Rocket className="w-8 h-8" />
                   </div>
                </div>
                
                <h3 className="text-2xl font-serif font-bold text-center mb-2">Configuration Required</h3>
                <p className="text-gray-500 text-center mb-6 text-sm">
                   Your site is running, but in <b>Demo Mode</b> because environment variables are missing.
                </p>

                {/* DEBUG CONSOLE */}
                <div className="bg-gray-900 rounded-xl p-4 mb-6 font-mono text-[10px] md:text-xs text-gray-300 overflow-x-auto">
                   <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-700 text-gray-400">
                      <Terminal className="w-3 h-3" /> System Diagnostics
                   </div>
                   <div className="space-y-1">
                      <div className="flex justify-between">
                         <span>GEMINI_API_KEY:</span> 
                         <span className={hasGeminiKey ? "text-green-400" : "text-red-400"}>{hasGeminiKey ? "LOADED" : "MISSING"}</span>
                      </div>
                      <div className="flex justify-between">
                         <span>VITE_FIREBASE_API_KEY:</span> 
                         <span className={hasFirebase ? "text-green-400" : "text-red-400"}>{hasFirebase ? "LOADED" : "MISSING"}</span>
                      </div>
                   </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-xl text-xs text-blue-800 mb-6 leading-relaxed">
                   <strong>How to fix:</strong>
                   <ol className="list-decimal ml-4 mt-2 space-y-1">
                      <li>Create a file named <code>.env</code> in your project root.</li>
                      <li>Copy contents from <code>.env.example</code> (see README).</li>
                      <li>Run <code>npm run build</code> again to bake in the keys.</li>
                      <li>Run <code>npm run deploy</code>.</li>
                   </ol>
                </div>
                
                <button 
                  onClick={closeWelcome}
                  className="w-full py-4 bg-brand-black text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-brand-accent transition-all shadow-lg flex items-center justify-center gap-2"
                >
                   Continue in Demo Mode <CheckCircle2 className="w-4 h-4" />
                </button>
             </div>
          </div>
        )}

        {isLimitedMode && showBanner && !showWelcome && (
           <div className="fixed bottom-0 left-0 right-0 bg-red-600 text-white text-[10px] font-bold uppercase tracking-widest text-center py-2 z-[100] shadow-lg flex items-center justify-center gap-4 animate-in slide-in-from-bottom">
              <div className="flex items-center gap-3">
                 <ShieldAlert className="w-4 h-4" />
                 <span>Status: </span>
                 {!hasGeminiKey && <span className="flex items-center gap-1 bg-black/20 px-2 py-0.5 rounded"><Key className="w-3 h-3"/> AI Key Missing</span>}
                 {!isFirebaseConfigured && <span className="flex items-center gap-1 bg-black/20 px-2 py-0.5 rounded"><Database className="w-3 h-3"/> DB Key Missing</span>}
              </div>
              <button onClick={() => setShowBanner(false)} className="hover:bg-black/20 rounded-full p-1 transition-colors">
                 <X className="w-4 h-4" />
              </button>
           </div>
        )}
      </AuthProvider>
    </LanguageProvider>
  );
}
