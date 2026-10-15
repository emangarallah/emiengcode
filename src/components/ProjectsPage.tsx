import React, { useState, useMemo } from 'react';
import { Search, Filter, RefreshCw, FolderGit2 } from 'lucide-react';
import { Project } from '../types.ts';
import { Language, translations } from '../i18n.ts';
import { ProjectCard } from './ProjectCard.tsx';

interface ProjectsPageProps {
  projects: Project[];
  lang: Language;
  onSelectProject: (p: Project) => void;
  onRequestSimilar?: (projectName: string, serviceTitle?: string | null) => void;
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({
  projects,
  lang,
  onSelectProject,
  onRequestSimilar,
}) => {
  const t = translations[lang];
  const isAr = lang === 'ar';
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const categories = [
    { id: 'all', label: t.projects.categories.all },
    { id: 'saas', label: t.projects.categories.saas },
    { id: 'web', label: t.projects.categories.web },
    { id: 'mobile', label: t.projects.categories.mobile },
    { id: 'api', label: t.projects.categories.api },
    { id: 'enterprise', label: t.projects.categories.enterprise },
  ];

  const statuses = [
    { id: 'all', label: t.projects.statusLabels.all },
    { id: 'completed', label: t.projects.statusLabels.completed },
    { id: 'prototype', label: t.projects.statusLabels.prototype },
    { id: 'in_development', label: t.projects.statusLabels.in_development },
  ];

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      // Category check
      if (selectedCategory !== 'all' && project.category !== selectedCategory) {
        return false;
      }
      // Status check
      if (selectedStatus !== 'all' && project.status !== selectedStatus) {
        return false;
      }
      // Search check
      if (search.trim()) {
        const query = search.trim().toLowerCase();
        const matchesTitle = project.title.toLowerCase().includes(query);
        const matchesDesc = project.shortDescription.toLowerCase().includes(query) ||
                            project.description.toLowerCase().includes(query);
        const matchesTech = project.technologies.some(t => t.toLowerCase().includes(query));
        return matchesTitle || matchesDesc || matchesTech;
      }
      return true;
    });
  }, [projects, selectedCategory, selectedStatus, search]);

  const handleReset = () => {
    setSearch('');
    setSelectedCategory('all');
    setSelectedStatus('all');
  };

  return (
    <section id="projects" className="py-20 border-t border-slate-200 dark:border-slate-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl text-start mb-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>{t.projects.kicker}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
            {t.projects.title}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
            {t.projects.subtitle}
          </p>
        </div>

        {/* Filters and Search Bar */}
        <div className="space-y-4 mb-8">
          
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t.projects.searchPlaceholder}
                className="w-full ps-10 pe-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-sm text-slate-900 dark:text-white placeholder-slate-400 transition-all outline-none"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute end-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700 dark:hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Status Selector */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400 hidden sm:block" />
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none cursor-pointer"
              >
                {statuses.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Category Tabs (Segmented Button Controls) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-colors focus:outline-none cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-50 dark:bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border border-cyan-400/40 dark:border-cyan-500/30'
                      : 'bg-white dark:bg-slate-900/90 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

        </div>

        {/* Projects Content or Empty State */}
        {projects.length === 0 ? (
          <div className="p-12 sm:p-16 text-center rounded-2xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/80 space-y-4 shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-200 dark:border-cyan-800 text-cyan-600 dark:text-cyan-400 mx-auto flex items-center justify-center">
              <FolderGit2 className="w-7 h-7" />
            </div>
            <div className="space-y-2 max-w-md mx-auto">
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                {isAr ? 'ستُعرض المشاريع هنا قريبًا' : 'Projects will be showcased here soon'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {isAr 
                  ? 'يجري حاليًا تجهيز وتوثيق أحدث الأنظمة والمشاريع البرمجية المكتملة لنشرها هنا مع روابط التجربة الحية والشرح التقني.'
                  : 'Real software projects and production systems are currently being prepared and will be published here with live demos.'}
              </p>
            </div>
          </div>
        ) : filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                lang={lang}
                onSelectProject={onSelectProject}
                onRequestSimilar={onRequestSimilar}
              />
            ))}
          </div>
        ) : (
          /* Filter Reset Empty State */
          <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/80 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
              <Search className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <p className="text-base font-bold text-slate-900 dark:text-white">
                {t.projects.empty}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isAr ? 'جرب تغيير مصطلحات البحث أو إعادة تصفية الفئات' : 'Try adjusting search terms or resetting filters'}
              </p>
            </div>
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{t.projects.resetFilters}</span>
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
