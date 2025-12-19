import React, { useState } from 'react';
import { ViewState } from './types';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Stories from './pages/Stories';
import SubmitStory from './pages/SubmitStory';
import Resources from './pages/Resources';
import About from './pages/About';
import Contact from './pages/Contact';
import Profile from './pages/Profile';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';

function AppContent() {
  const [currentView, setCurrentView] = useState<ViewState>('HOME');
  const { user, login } = useAuth();

  // Basic login page placeholder
  const LoginView = () => (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <p className="text-sm text-gray-500 mb-4 text-center">Use <b>admin@voicethroughimage.org</b> to test admin features.</p>
        <form onSubmit={(e) => {
            e.preventDefault();
            const email = (e.target as any).email.value;
            login(email);
            setCurrentView('HOME');
        }}>
            <input name="email" type="email" placeholder="Email" className="w-full border p-2 rounded mb-4" defaultValue="admin@voicethroughimage.org" />
            <input type="password" placeholder="Password" className="w-full border p-2 rounded mb-6" />
            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded font-bold">Sign In</button>
        </form>
      </div>
    </div>
  );

  const renderView = () => {
    switch (currentView) {
      case 'HOME':
        return <Home navigateTo={setCurrentView} />;
      case 'STORIES':
        return <Stories navigateTo={setCurrentView} />;
      case 'SUBMIT_STORY':
        return <SubmitStory navigateTo={setCurrentView} />;
      case 'RESOURCES':
        return <Resources navigateTo={setCurrentView} />;
      case 'ABOUT':
        return <About navigateTo={setCurrentView} />;
      case 'CONTACT':
        return <Contact navigateTo={setCurrentView} />;
      case 'PROFILE':
        return <Profile navigateTo={setCurrentView} />;
      case 'LOGIN':
        return <LoginView />;
      default:
        return <Home navigateTo={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar currentView={currentView} navigateTo={setCurrentView} />
      <main>
        {renderView()}
      </main>
      
      <footer className="bg-gray-900 text-gray-400 py-12 px-4 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
                <span className="text-white font-bold text-lg">Voice Through Image</span>
                <p className="text-sm mt-1">Amplifying voices through media.</p>
            </div>
            <div className="text-sm">
                © {new Date().getFullYear()} Voice Through Image. All rights reserved.
            </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </LanguageProvider>
  );
}
