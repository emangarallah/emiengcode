import React from 'react';
import { Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';
import { Project } from '../types.ts';
import { Language, translations } from '../i18n.ts';
import { ProjectCard } from './ProjectCard.tsx';

interface FeaturedProjectsProps {
  projects: Project[];
  lang: Language;
  onSelectProject: (p: Project) => void;
  onViewAllProjects: () => void;
}

export const FeaturedProjects: React.FC<FeaturedProjectsProps> = ({
  projects,
  lang,
  onSelectProject,
  onViewAllProjects,
}) => {
  const t = translations[lang];
  const isAr = lang === 'ar';
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  const featured = projects.filter(p => p.featured);
  const displayItems = featured.length > 0 ? featured : projects.slice(0, 3);

  if (displayItems.length === 0) {
    return null;
  }

  return (
    <section className="py-16 border-t border-slate-200 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-950/40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 text-start">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t.featured.kicker}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {t.featured.title}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xl">
              {t.featured.subtitle}
            </p>
          </div>

          <button
            onClick={onViewAllProjects}
            className="self-start md:self-auto flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700 transition-colors cursor-pointer shadow-xs"
          >
            <span>{t.featured.viewAll}</span>
            <ArrowIcon className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayItems.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              lang={lang}
              onSelectProject={onSelectProject}
            />
          ))}
        </div>

      </div>
    </section>
  );
};
