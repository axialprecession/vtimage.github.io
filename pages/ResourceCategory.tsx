
import React, { useEffect } from 'react';
import { ViewState, Resource } from '../types';
import { getResourcesByCategory } from '../data/resources';
import { ArrowLeft, MapPin, Phone, Clock, Globe, ShieldCheck, Heart, Share2, ExternalLink } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface ResourceCategoryProps {
  category: string;
  setView: (view: ViewState) => void;
}

export const ResourceCategory: React.FC<ResourceCategoryProps> = ({ category, setView }) => {
  const { t, language, font } = useLanguage();
  const resources = getResourcesByCategory(category);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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

  const getCategoryLabel = (cat: string) => {
    switch(cat) {
      case 'Shelter': return t('resources.cat.shelter');
      case 'Legal Aid': return t('resources.cat.legal');
      case 'Food Bank': return t('resources.cat.food');
      case 'Addiction Recovery': return t('resources.cat.recovery');
      case 'Mental Health': return t('resources.cat.mental_health');
      case 'Domestic Violence': return t('resources.cat.dv');
      case 'Chinese Services': return t('resources.cat.chinese_services');
      default: return cat;
    }
  };

  return (
    <div className="min-h-screen bg-brand-cream pt-28 pb-40">
      <div className="max-w-5xl mx-auto px-6">
        
        {/* Navigation */}
        <button 
          onClick={() => setView(ViewState.RESOURCES)}
          className="flex items-center text-gray-400 hover:text-black transition-all mb-12 group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-2 transition-transform" />
          <span className="text-xs font-bold uppercase tracking-widest">{t('nav.resources')}</span>
        </button>

        {/* Header */}
        <div className="mb-20 border-l-4 border-brand-accent pl-8 py-2">
          <div className="text-brand-accent text-xs font-black uppercase tracking-[0.3em] mb-4">
            Verified Directory
          </div>
          <h1 className={`text-5xl md:text-7xl font-bold text-gray-900 mb-6 tracking-tight ${font}`}>
            {getCategoryLabel(category)}
          </h1>
          <p className="text-lg text-gray-500 font-light max-w-2xl leading-relaxed">
            {language.startsWith('zh') 
              ? `共有 ${resources.length} 個經過驗證的機構服務於此類別。` 
              : `Access ${resources.length} verified organizations currently serving this category.`}
          </p>
        </div>

        {/* List */}
        <div className="space-y-8">
          {resources.length > 0 ? (
            resources.map((resource) => (
              <div 
                key={resource.id} 
                className="bg-white rounded-[2rem] p-8 md:p-10 shadow-sm border border-gray-100 hover:shadow-xl hover:border-gray-200 transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row gap-8 justify-between">
                  <div className="flex-1">
                     <div className="flex gap-3 mb-4">
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-md text-[10px] font-bold uppercase tracking-wider">{resource.region}</span>
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-md text-[10px] font-bold uppercase tracking-wider">{resource.type}</span>
                     </div>
                     <h3 className={`text-3xl font-bold text-brand-black mb-4 ${font}`}>
                        {getResourceField(resource, 'name')}
                     </h3>
                     <p className="text-gray-500 leading-relaxed mb-8 border-l-2 border-brand-accent/20 pl-4 italic">
                        {getResourceField(resource, 'desc')}
                     </p>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-3 text-gray-600">
                           <MapPin className="w-4 h-4 text-brand-accent" />
                           <span className="font-medium">{resource.location}</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-600">
                           <Phone className="w-4 h-4 text-brand-accent" />
                           <span className="font-bold">{resource.contact}</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-600">
                           <Clock className="w-4 h-4 text-brand-accent" />
                           <span>{getResourceField(resource, 'hours')}</span>
                        </div>
                        {resource.website && (
                           <a href={`https://${resource.website}`} target="_blank" className="flex items-center gap-3 text-blue-600 hover:underline">
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
            <div className="text-center py-20 text-gray-400 italic">
               No resources found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
