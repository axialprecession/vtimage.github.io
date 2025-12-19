import React from 'react';
import { ViewState } from '../types';
import { useAuth } from '../context/AuthContext';
import { Mail, CheckCircle, ExternalLink } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface VerifyEmailProps {
  setView: (view: ViewState) => void;
}

export const VerifyEmail: React.FC<VerifyEmailProps> = ({ setView }) => {
  const { t } = useLanguage();
  const { pendingEmail, verifyAccount, demoToken } = useAuth();

  const handleVerify = () => {
    if (demoToken) {
      verifyAccount(demoToken);
      setView(ViewState.HOME);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-10 rounded-2xl shadow-xl text-center">
        <div className="mx-auto h-20 w-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
          <Mail className="h-10 w-10 text-blue-600" />
        </div>
        
        <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">
          {t('auth.verify.title')}
        </h2>
        
        <p className="text-gray-600 mb-8">
          {t('auth.verify.text')} <br/>
          <span className="font-semibold text-gray-900">{pendingEmail}</span>.
        </p>

        {/* Demo Simulation UI */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-left mb-6">
          <h4 className="text-xs font-bold text-yellow-800 uppercase tracking-wider mb-2">Demo Mode</h4>
          <p className="text-xs text-yellow-700 mb-3">
            Since this is a demo without a real backend email server, use the button below to simulate clicking the email link.
          </p>
          <div className="flex items-center gap-2 text-xs font-mono bg-white p-2 rounded border border-yellow-100 text-gray-500 mb-3">
            <span>Token:</span>
            <span className="text-black select-all">{demoToken || 'Generating...'}</span>
          </div>
          <button
            onClick={handleVerify}
            className="w-full flex items-center justify-center gap-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-900 py-2 rounded text-sm font-medium transition-colors"
          >
            <ExternalLink className="w-4 h-4" /> Simulate Link Click
          </button>
        </div>

        <button 
          onClick={() => setView(ViewState.LOGIN)}
          className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
        >
          {t('auth.login.btn')}
        </button>
      </div>
    </div>
  );
};