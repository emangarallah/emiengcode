import React from 'react';
import { 
  Globe, 
  Calendar, 
  LayoutDashboard, 
  Smartphone, 
  Code2, 
  Database, 
  CloudUpload,
  ArrowRight,
  ArrowLeft,
  Wrench
} from 'lucide-react';
import { Service } from '../types.ts';
import { Language, translations } from '../i18n.ts';

interface ServicesSectionProps {
  services: Service[];
  lang: Language;
  onSelectServiceToOrder: (serviceTitle: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  services,
  lang,
  onSelectServiceToOrder,
}) => {
  const t = translations[lang];
  const isAr = lang === 'ar';
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  // Icon resolver
  const getIcon = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case 'globe':
        return <Globe className="w-5 h-5" />;
      case 'calendar':
        return <Calendar className="w-5 h-5" />;
      case 'layoutdashboard':
      case 'dashboard':
        return <LayoutDashboard className="w-5 h-5" />;
      case 'smartphone':
      case 'flutter':
        return <Smartphone className="w-5 h-5" />;
      case 'code2':
      case 'react':
        return <Code2 className="w-5 h-5" />;
      case 'database':
      case 'postgresql':
        return <Database className="w-5 h-5" />;
      case 'cloudupload':
      case 'devops':
      default:
        return <CloudUpload className="w-5 h-5" />;
    }
  };

  return (
    <section id="services" className="py-20 border-t border-slate-200 dark:border-slate-900 bg-slate-50/80 dark:bg-slate-950/60 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl text-start mb-12 space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">
            <Wrench className="w-3.5 h-3.5" />
            <span>{t.services.kicker}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
            {t.services.title}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
            {t.services.subtitle}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, idx) => (
            <div
              key={service.id || idx}
              className="group p-6 rounded-2xl bg-white dark:bg-slate-900/70 hover:bg-slate-50 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800/90 hover:border-slate-300 dark:hover:border-slate-700/80 transition-all duration-300 flex flex-col justify-between space-y-6 text-start shadow-xs dark:shadow-md hover:shadow-cyan-950/20"
            >
              <div className="space-y-4">
                
                {/* Icon Badge */}
                <div className="w-12 h-12 rounded-xl bg-cyan-50 dark:bg-slate-800/80 text-cyan-600 dark:text-cyan-400 flex items-center justify-center border border-cyan-100 dark:border-slate-700/60 group-hover:scale-105 group-hover:text-cyan-500 dark:group-hover:text-cyan-300 transition-all">
                  {getIcon(service.icon)}
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {service.description}
                </p>
              </div>

              {/* Action Button */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between">
                <button
                  onClick={() => onSelectServiceToOrder(service.title)}
                  className="flex items-center gap-2 text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 transition-colors cursor-pointer group-hover:translate-x-0.5"
                >
                  <span>{t.services.orderService}</span>
                  <ArrowIcon className="w-3.5 h-3.5" />
                </button>
                <span className="text-[11px] text-slate-400 font-mono">
                  #{idx + 1}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
