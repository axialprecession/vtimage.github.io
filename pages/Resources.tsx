
import React, { useState } from 'react';
import { Search, Home, Utensils, Gavel, Users, Brain, Shield, ChevronRight, Sparkles, Loader2, MessageSquare, ArrowRight, X, MapPin, Phone, Clock, Globe } from 'lucide-react';
import { ViewState, Resource } from '../types';
import { getAIResourceAssistance } from '../services/geminiService';
import { useLanguage } from '../context/LanguageContext';
import { searchResources, getSearchSuggestions } from '../data/resources';

interface ResourcesProps {
  setView: (view: ViewState) => void;
  onCategorySelect: (category: string) => void;
}

export const Resources: React.FC<ResourcesProps> = ({ setView, onCategorySelect }) => {
  const { t, language } = useLanguage();
  const [aiQuery, setAiQuery] = useState('');
  const [aiResult, setAiResult] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const isChinese = language.startsWith('zh');

  // Directory Search State
  const [directoryQuery, setDirectoryQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchResults, setSearchResults] = useState<Resource[] | null>(null);

  const handleAiSearch = async (e?: React.FormEvent, customQuery?: string) => {
    if (e) e.preventDefault();
    const query = customQuery || aiQuery;
    if (!query.trim()) return;
    setIsAiLoading(true);
    setAiResult(null);
    try {
      const result = await getAIResourceAssistance(query, "California");
      setAiResult(result);
    } catch (error) {
      setAiResult("Unable to fetch real-time info. Please check the directory below or call 2-1-1.");
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleDirectorySearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setDirectoryQuery(val);
    if (val.length > 1) {
      setSuggestions(getSearchSuggestions(val));
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const executeDirectorySearch = (query: string) => {
    setDirectoryQuery(query);
    setShowSuggestions(false);
    if (query.trim()) {
      const results = searchResources(query);
      setSearchResults(results);
    } else {
      setSearchResults(null);
    }
  };

  const clearDirectorySearch = () => {
    setDirectoryQuery('');
    setSearchResults(null);
    setSuggestions([]);
  };

  const getResourceField = (resource: Resource, field: 'name' | 'desc' | 'hours' | 'type') => {
    if (language === 'zh-TW') {
      if (field === 'name') return resource.nameZhTW || resource.name;
      if (field === 'desc') return resource.descriptionZhTW || resource.description;
      if (field === 'hours') return resource.operatingHoursZhTW || resource.operatingHours;
      if (field === 'type') return resource.typeZhTW || t(`resources.cat.${resource.type.toLowerCase().replace(' ', '_')}`);
    }
    if (language === 'zh-CN') {
      if (field === 'name') return resource.nameZhCN || resource.name;
      if (field === 'desc') return resource.descriptionZhCN || resource.description;
      if (field === 'hours') return resource.operatingHoursZhCN || resource.operatingHours;
      if (field === 'type') return resource.typeZhCN || t(`resources.cat.${resource.type.toLowerCase().replace(' ', '_')}`);
    }
    if (field === 'name') return resource.name;
    if (field === 'desc') return resource.description;
    if (field === 'hours') return resource.operatingHours || 'Hours not listed';
    if (field === 'type') return resource.type;
  };

  const suggestedPrompts = [
    { label: language === 'zh-TW' ? "尋找收容所" : "Find Shelters", query: "Find open emergency shelters in California" },
    { label: language === 'zh-TW' ? "法律援助" : "Legal Aid", query: "Find pro-bono legal aid for eviction" },
    { label: language === 'zh-TW' ? "食物發放" : "Free Food", query: "Find food banks near me" },
    { label: language === 'zh-TW' ? "心理諮商" : "Mental Health", query: "Find culturally sensitive therapy" }
  ];

  const categories = [
    { id: 'Chinese Services', label: t('resources.cat.chinese_services'), icon: <Users className="w-6 h-6" />, color: 'bg-brand-accent', desc: 'Mandarin/Cantonese speaking support.' },
    { id: 'Shelter', label: t('resources.cat.shelter'), icon: <Home className="w-6 h-6" />, color: 'bg-orange-500', desc: 'Emergency housing & youth centers.' },
    { id: 'Food Bank', label: t('resources.cat.food'), icon: <Utensils className="w-6 h-6" />, color: 'bg-green-600', desc: 'Free meal programs & groceries.' },
    { id: 'Legal Aid', label: t('resources.cat.legal'), icon: <Gavel className="w-6 h-6" />, color: 'bg-blue-600', desc: 'Immigration & tenant rights.' },
    { id: 'Mental Health', label: t('resources.cat.mental_health'), icon: <Brain className="w-6 h-6" />, color: 'bg-purple-600', desc: 'Counseling & crisis intervention.' },
    { id: 'Domestic Violence', label: t('resources.cat.dv'), icon: <Shield className="w-6 h-6" />, color: 'bg-red-600', desc: 'Safe houses & victim advocacy.' },
  ];

  return (
    <div className="min-h-screen bg-brand-cream">
      {/* AI Assistant Hero Section */}
      <div className="bg-brand-black text-white pt-32 pb-48 md:pb-64 relative overflow-hidden rounded-b-[4rem] shadow-2xl z-10">
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-gray-800 via-brand-black to-black"></div>
        
        <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-brand-accent text-xs font-bold uppercase tracking-widest mb-8">
            <Sparkles className="w-3 h-3" /> AI Resource Assistant
          </div>
          
          <h1 className={`text-4xl md:text-6xl font-bold mb-6 tracking-tight ${isChinese ? 'font-ming' : 'font-serif'}`}>How can we help you today?</h1>
          <p className="text-lg text-gray-400 font-light max-w-2xl mx-auto mb-12">
            Search for resources using natural language. We'll connect you with verified services.
          </p>

          <div className="max-w-3xl mx-auto relative">
            <form onSubmit={handleAiSearch} className="relative group z-20">
              <input 
                type="text" 
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                placeholder="Ex: I need a safe place to sleep in Los Angeles..."
                className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-full pl-8 pr-32 py-5 text-lg text-white placeholder-gray-500 outline-none focus:bg-white focus:text-black focus:placeholder-gray-400 transition-all duration-300 shadow-2xl"
              />
              <button 
                type="submit" 
                disabled={isAiLoading} 
                className="absolute right-2 top-2 bottom-2 px-8 bg-brand-accent text-white rounded-full font-bold uppercase tracking-widest text-xs hover:bg-white hover:text-brand-accent transition-all disabled:opacity-50 flex items-center gap-2"
              >
                 {isAiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Search'}
              </button>
            </form>

            <div className="flex flex-wrap justify-center gap-3 mt-8">
               {suggestedPrompts.map((prompt, i) => (
                  <button 
                    key={i} 
                    onClick={() => { setAiQuery(prompt.query); handleAiSearch(undefined, prompt.query); }}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-xs font-medium text-gray-300 transition-all"
                  >
                    {prompt.label}
                  </button>
               ))}
            </div>

            {aiResult && (
               <div className="mt-12 bg-white rounded-[2.5rem] p-8 md:p-12 text-left text-brand-black shadow-2xl animate-fade-in border border-gray-100">
                  <div className="flex items-center gap-3 mb-6 text-brand-accent border-b border-gray-100 pb-4">
                    <MessageSquare className="w-5 h-5" />
                    <span className="font-bold uppercase tracking-widest text-xs">Assistant Response</span>
                  </div>
                  <div className={`prose prose-lg max-w-none text-gray-700 leading-relaxed ${isChinese ? 'font-ming' : 'font-serif'}`}>
                     {aiResult}
                  </div>
                  <div className="mt-8 flex justify-end">
                    <button onClick={() => setAiResult(null)} className="text-xs font-bold text-gray-400 hover:text-black uppercase tracking-widest">Close</button>
                  </div>
               </div>
            )}
          </div>
        </div>
      </div>

      {/* Categories Grid / Search Results */}
      <div className="max-w-7xl mx-auto px-6 -mt-32 pb-40 relative z-0">
        <div className="bg-white rounded-[3rem] p-8 md:p-16 shadow-soft border border-gray-100/50">
           
           {/* Directory Header with Search */}
           <div className="mb-12 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8">
             <div>
               <h2 className={`text-3xl font-bold text-brand-black mb-2 ${isChinese ? 'font-ming' : 'font-serif'}`}>Browse Directory</h2>
               <p className="text-gray-500">
                 {searchResults ? `Found ${searchResults.length} results for "${directoryQuery}"` : "Select a category to view verified organizations."}
               </p>
             </div>

             <div className="relative w-full lg:w-96 group z-30">
                <input 
                  type="text" 
                  value={directoryQuery}
                  onChange={handleDirectorySearchChange}
                  onKeyDown={(e) => e.key === 'Enter' && executeDirectorySearch(directoryQuery)}
                  placeholder="Search by name, city, or service..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-full pl-6 pr-12 py-4 text-sm focus:outline-none focus:border-brand-black focus:ring-1 focus:ring-brand-black transition-all"
                />
                {directoryQuery ? (
                   <button onClick={clearDirectorySearch} className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-black">
                      <X className="w-4 h-4" />
                   </button>
                ) : (
                   <button onClick={() => executeDirectorySearch(directoryQuery)} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black">
                      <Search className="w-4 h-4" />
                   </button>
                )}

                {/* Auto-suggestions Dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-slide-up z-50">
                    {suggestions.map((suggestion, idx) => (
                      <button
                        key={idx}
                        onClick={() => executeDirectorySearch(suggestion)}
                        className="w-full text-left px-6 py-3 text-sm hover:bg-gray-50 flex items-center gap-2 text-gray-700 hover:text-black transition-colors border-b border-gray-50 last:border-0"
                      >
                        <Search className="w-3 h-3 text-gray-400" /> {suggestion}
                      </button>
                    ))}
                  </div>
                )}
             </div>
           </div>

           {searchResults ? (
             // Search Results List
             <div className="space-y-8 animate-fade-in">
               {searchResults.length > 0 ? (
                 searchResults.map((resource) => (
                  <div 
                    key={resource.id} 
                    className="bg-white rounded-[2rem] p-8 md:p-10 border border-gray-100 hover:shadow-xl hover:border-brand-accent/20 transition-all duration-300"
                  >
                    <div className="flex flex-col md:flex-row gap-8 justify-between">
                      <div className="flex-1">
                         <div className="flex gap-3 mb-4">
                            <span className="px-3 py-1 bg-gray-50 text-gray-600 rounded-full text-[10px] font-bold uppercase tracking-wider border border-gray-200">{resource.region}</span>
                            <span className="px-3 py-1 bg-brand-cream text-brand-black rounded-full text-[10px] font-bold uppercase tracking-wider border border-brand-accent/10">{resource.type}</span>
                         </div>
                         <h3 className={`text-3xl font-bold text-brand-black mb-4 ${isChinese ? 'font-ming' : 'font-serif'}`}>
                            {getResourceField(resource, 'name')}
                         </h3>
                         <p className="text-gray-500 leading-relaxed mb-8 border-l-2 border-brand-accent/20 pl-4 italic">
                            {getResourceField(resource, 'desc')}
                         </p>
    
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center gap-3 text-gray-600 bg-gray-50 p-3 rounded-xl">
                               <MapPin className="w-4 h-4 text-brand-accent" />
                               <span className="font-medium">{resource.location}</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-600 bg-gray-50 p-3 rounded-xl">
                               <Phone className="w-4 h-4 text-brand-accent" />
                               <span className="font-bold">{resource.contact}</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-600 bg-gray-50 p-3 rounded-xl">
                               <Clock className="w-4 h-4 text-brand-accent" />
                               <span>{getResourceField(resource, 'hours')}</span>
                            </div>
                            {resource.website && (
                               <a href={`https://${resource.website}`} target="_blank" className="flex items-center gap-3 text-blue-600 hover:underline bg-blue-50 p-3 rounded-xl hover:bg-blue-100 transition-colors">
                                  <Globe className="w-4 h-4" />
                                  <span>{resource.website}</span>
                               </a>
                            )}
                         </div>
                      </div>
                    </div>
                  </div>
                 ))
               ) : (
                 <div className="text-center py-20">
                    <p className="text-xl font-serif text-gray-400 italic mb-4">No results found for "{directoryQuery}".</p>
                    <button onClick={clearDirectorySearch} className="text-brand-accent font-bold hover:underline mb-8">View All Categories</button>
                    
                    <div className="bg-blue-50 p-6 rounded-3xl inline-block max-w-md mx-auto shadow-inner">
                        <p className="text-sm text-blue-800 mb-3 font-bold">Can't find what you need? Try asking our AI.</p>
                        <button 
                            onClick={() => { 
                                setAiQuery(`Help me find resources for: ${directoryQuery}`); 
                                handleAiSearch(undefined, `Help me find resources for: ${directoryQuery}`); 
                                window.scrollTo({top: 0, behavior: 'smooth'}); 
                            }}
                            className="flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-full text-xs font-bold uppercase tracking-widest shadow-sm hover:shadow-md transition-all mx-auto hover:scale-105"
                        >
                            <Sparkles className="w-3 h-3" /> Ask AI Assistant
                        </button>
                    </div>
                 </div>
               )}
             </div>
           ) : (
             // Default Categories Grid
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
               {categories.map((cat) => (
                 <button 
                   key={cat.id}
                   onClick={() => onCategorySelect(cat.id)}
                   className="group text-left bg-white p-8 rounded-[2.5rem] border border-gray-100 hover:border-brand-accent/30 hover:shadow-2xl transition-all duration-500 flex flex-col justify-between h-64 relative overflow-hidden"
                 >
                   <div className={`absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-125 duration-700`}>
                      {React.cloneElement(cat.icon as React.ReactElement<any>, { className: "w-32 h-32" })}
                   </div>

                   <div className="flex justify-between items-start relative z-10">
                     <div className={`w-14 h-14 ${cat.color} text-white rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                       {cat.icon}
                     </div>
                     <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-brand-black group-hover:text-white transition-colors duration-300">
                        <ArrowRight className="w-4 h-4 -rotate-45 group-hover:rotate-0 transition-all duration-300" />
                     </div>
                   </div>
                   
                   <div className="relative z-10">
                     <h3 className={`text-xl font-bold mb-2 text-brand-black ${isChinese ? 'font-ming' : 'font-serif'}`}>{cat.label}</h3>
                     <p className="text-sm text-gray-500 font-light leading-relaxed group-hover:text-gray-700 transition-colors">{cat.desc}</p>
                   </div>
                 </button>
               ))}
             </div>
           )}
        </div>
      </div>
    </div>
  );
};
