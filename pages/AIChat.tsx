
import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, AlertCircle, Loader2 } from 'lucide-react';
import { createChatSession } from '../services/geminiService';
import { useLanguage } from '../context/LanguageContext';
import { Chat, GenerateContentResponse } from '@google/genai';

interface Message {
  role: 'user' | 'model';
  text: string;
}

export const AIChat: React.FC = () => {
  const { t } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: t('chat.welcome') }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chatSessionRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatSessionRef.current = createChatSession();
    scrollToBottom();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMsg = inputValue;
    setInputValue('');
    setError(null);
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      if (!chatSessionRef.current) {
         chatSessionRef.current = createChatSession();
      }
      setMessages(prev => [...prev, { role: 'model', text: '' }]);
      
      const streamResult = await chatSessionRef.current.sendMessageStream({ message: userMsg });
      
      let fullText = '';
      for await (const chunk of streamResult) {
        const c = chunk as GenerateContentResponse;
        if (c.text) {
          fullText += c.text;
          setMessages(prev => {
            const newMsgs = [...prev];
            newMsgs[newMsgs.length - 1] = { role: 'model', text: fullText };
            return newMsgs;
          });
        }
      }
    } catch (err: any) {
      setError(t('chat.error'));
      setMessages(prev => prev.filter(m => m.text !== ''));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 pt-20 bg-gray-50 flex flex-col">
      <div className="flex-1 max-w-3xl mx-auto w-full flex flex-col bg-white shadow-xl md:my-8 md:rounded-[2.5rem] overflow-hidden border border-gray-100">
        
        {/* Chat Header */}
        <div className="bg-white border-b border-gray-50 px-6 py-4 flex items-center justify-center relative">
           <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">AI Support Assistant</span>
           </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white">
           {messages.map((msg, idx) => (
             <div key={idx} className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex max-w-[85%] items-end gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                   {/* Avatar */}
                   <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${msg.role === 'user' ? 'bg-brand-black text-white' : 'bg-brand-accent text-white'}`}>
                      {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                   </div>

                   {/* Bubble */}
                   <div className={`px-5 py-3.5 rounded-2xl text-sm leading-relaxed ${
                     msg.role === 'user' 
                       ? 'bg-brand-black text-white rounded-br-none' 
                       : 'bg-gray-100 text-gray-800 rounded-bl-none'
                   }`}>
                      <div className="whitespace-pre-wrap font-medium">
                        {msg.text}
                        {msg.role === 'model' && msg.text === '' && <span className="animate-pulse">Thinking...</span>}
                      </div>
                   </div>
                </div>
             </div>
           ))}
           <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 md:p-6 bg-white border-t border-gray-50">
           {error && (
             <div className="mb-4 flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-xl text-xs font-medium">
                <AlertCircle className="w-4 h-4" /> {error}
             </div>
           )}
           <form onSubmit={handleSend} className="relative flex items-center gap-3">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your message..."
                disabled={isLoading}
                className="flex-1 bg-gray-50 border-0 rounded-full px-6 py-4 text-sm md:text-base outline-none focus:ring-2 focus:ring-brand-accent/10 focus:bg-white transition-all text-gray-800 placeholder-gray-400"
              />
              <button 
                type="submit" 
                disabled={isLoading || !inputValue.trim()}
                className="bg-brand-black text-white p-4 rounded-full hover:bg-brand-accent disabled:opacity-50 disabled:hover:bg-brand-black transition-colors shadow-lg"
              >
                 {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              </button>
           </form>
           <p className="text-center text-[10px] text-gray-300 mt-4 uppercase tracking-wider">
              AI generated response. Call 911 for emergencies.
           </p>
        </div>
      </div>
    </div>
  );
};
