
import React, { useEffect, useState } from 'react';
import { fetchDailyNews, NewsResult } from '../services/geminiService';
import { Newspaper, Loader2, ExternalLink, Sparkles, Database, ShieldAlert } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const NewsFeed: React.FC = () => {
  const { t, language, font } = useLanguage();
  const [news, setNews] = useState<NewsResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const getNews = async () => {
      try {
        setLoading(true);
        // Cache management per language
        const cached = sessionStorage.getItem(`vti_news_${language}`);
        if (cached) {
          setNews(JSON.parse(cached));
          setLoading(false);
          return;
        }

        const result = await fetchDailyNews(language);
        if (isMounted) {
          setNews(result);
          sessionStorage.setItem(`vti_news_${language}`, JSON.stringify(result));
        }
      } catch (err) {
        // We handle the specific 429 in the service, but if something else fails:
        if (isMounted) setError(true);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    getNews();

    return () => {
      isMounted = false;
    };
  }, [language]);

  if (error && !news) {
    return (
      <div className="bg-gray-50 p-12 rounded-[2rem] border border-gray-100 text-center text-gray-400 animate-in fade-in">
        <ShieldAlert className="w-12 h-12 mx-auto mb-6 opacity-20" />
        <p className="italic text-xl">{t('home.news.error')}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-6 px-8 py-3 bg-black text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden animate-in fade-in duration-700">
      <div className="p-8 md:p-12 bg-brand-black text-white relative">
        <div className="absolute top-0 right-0 p-8 opacity-10">
           <Newspaper className="w-24 h-24" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-brand-accent rounded-xl flex items-center justify-center shadow-lg shadow-brand-accent/20">
              <Newspaper className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className={`text-3xl font-bold ${font}`}>{t('home.news.title')}</h2>
              <p className="text-gray-400 font-light text-sm">{t('home.news.subtitle')}</p>
            </div>
          </div>
          
          {news?.isFallback && (
            <div className="flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[9px] font-black uppercase tracking-widest text-gray-400">
              <Database className="w-3 h-3 text-orange-500" /> Archive Mode
            </div>
          )}
        </div>
      </div>

      <div className="p-8 md:p-12">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400">
            <Loader2 className="w-10 h-10 animate-spin mb-6 text-brand-accent" />
            <p className="italic tracking-wide">{t('home.news.loading')}</p>
          </div>
        ) : (
          <div className="space-y-10">
            <div className={`prose prose-lg max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap font-medium italic border-l-4 border-gray-50 pl-8 ${font}`}>
              {news?.text}
            </div>
            
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-3 text-[10px] text-brand-accent font-black uppercase tracking-[0.2em] bg-red-50 w-fit px-4 py-2 rounded-full">
                 <Sparkles className="w-3 h-3 animate-pulse" /> {news?.isFallback ? "Verified Intelligence Archive" : t('home.news.generated')}
              </div>
              {news?.isFallback && (
                 <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest italic">Live Search quota reached - showing verified data</span>
              )}
            </div>

            {news?.sources && news.sources.length > 0 && (
              <div className="border-t border-gray-100 pt-10">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                  <ExternalLink className="w-3 h-3" /> {t('home.news.sources')}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {news.sources.map((source, index) => (
                    <a 
                      key={index}
                      href={source.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 hover:bg-gray-50 hover:border-brand-accent hover:shadow-lg transition-all text-sm group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center group-hover:bg-brand-accent group-hover:text-white transition-colors">
                        <ExternalLink className="w-3 h-3" />
                      </div>
                      <span className="truncate text-gray-600 group-hover:text-brand-black font-bold tracking-tight">{source.title}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
