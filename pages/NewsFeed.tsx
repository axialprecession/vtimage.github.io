import React, { useEffect, useState } from 'react';
import { Newspaper, ExternalLink, Loader2 } from 'lucide-react';
import { fetchDailyNews, NewsResult } from '../services/geminiService';
import { useLanguage } from '../context/LanguageContext';

export default function NewsFeed() {
  const { t } = useLanguage();
  const [news, setNews] = useState<NewsResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNews = async () => {
      const data = await fetchDailyNews();
      setNews(data);
      setLoading(false);
    };
    loadNews();
  }, []);

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-4">
          <Newspaper className="w-5 h-5 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-900">{t('news.title')}</h2>
        </div>
        
        {loading ? (
          <div className="flex items-center gap-2 text-gray-500 animate-pulse">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>{t('news.loading')}</span>
          </div>
        ) : news ? (
          <div className="bg-gray-50 rounded-xl p-6">
            <p className="text-gray-700 leading-relaxed whitespace-pre-line mb-4">
              {news.text}
            </p>
            
            {news.sources && news.sources.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-2">
                  {t('news.sources')}
                </span>
                <div className="flex flex-wrap gap-2">
                  {news.sources.map((source: any, idx: number) => {
                    if (source.web?.uri) {
                      return (
                        <a 
                          key={idx}
                          href={source.web.uri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 bg-blue-50 px-2 py-1 rounded-full border border-blue-100 transition-colors"
                        >
                          <ExternalLink className="w-3 h-3" />
                          {source.web.title || 'Source'}
                        </a>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>
            )}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">Unable to load updates at this time.</p>
        )}
      </div>
    </div>
  );
}