import React from 'react';
import { ExternalLink, Github, ArrowUpRight, CheckCircle2, FlaskConical, Clock } from 'lucide-react';
import { Project } from '../types.ts';
import { Language, translations } from '../i18n.ts';

interface ProjectCardProps {
  project: Project;
  lang: Language;
  onSelectProject: (p: Project) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  lang,
  onSelectProject,
}) => {
  const t = translations[lang];

  const isTemplate = Boolean(project.isTemplate || project.status === 'prototype');
  const isAr = lang === 'ar';

  // Status mapping
  const getStatusBadge = () => {
    if (isTemplate) {
      return {
        label: isAr ? 'نموذج تجريبي' : 'Illustrative Prototype',
        subLabel: isAr ? 'مثال توضيحي' : 'Demo Template',
        icon: <FlaskConical className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />,
        color: 'text-amber-800 dark:text-amber-300 bg-amber-50/95 dark:bg-amber-950/80 border-amber-300 dark:border-amber-700/80'
      };
    }

    switch (project.status) {
      case 'completed':
        return {
          label: t.projects.statusLabels.completed,
          subLabel: null,
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />,
          color: 'text-emerald-700 dark:text-emerald-300 bg-emerald-50/90 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800/60'
        };
      case 'in_development':
      default:
        return {
          label: t.projects.statusLabels.in_development,
          subLabel: null,
          icon: <Clock className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />,
          color: 'text-cyan-700 dark:text-cyan-300 bg-cyan-50/90 dark:bg-cyan-950/60 border-cyan-300 dark:border-cyan-800/60'
        };
    }
  };

  const statusInfo = getStatusBadge();

  // Category label
  const categoryLabel = (t.projects.categories as Record<string, string>)[project.category] || project.category;

  return (
    <article className="group relative rounded-2xl bg-white dark:bg-slate-900/80 hover:bg-slate-50 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800/90 hover:border-slate-300 dark:hover:border-slate-700/80 transition-all duration-300 flex flex-col overflow-hidden shadow-xs dark:shadow-lg hover:shadow-cyan-950/20">
      
      {/* Cover Image Area */}
      <div 
        onClick={() => onSelectProject(project)}
        className="relative aspect-[16/10] overflow-hidden bg-slate-950 cursor-pointer"
      >
        <img
          src={project.coverImage}
          alt={project.title}
          loading="lazy"
          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
        
        {/* Status / Template in image header */}
        <div className="absolute top-3.5 end-3.5 flex flex-col items-end gap-1.5">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border backdrop-blur-md shadow-xs ${statusInfo.color}`}>
            {statusInfo.icon}
            <span>{statusInfo.label}</span>
          </span>
          {isTemplate && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-slate-900/90 text-amber-300 border border-amber-500/40 backdrop-blur-md">
              {isAr ? 'مثال توضيحي' : 'Sample Showcase'}
            </span>
          )}
        </div>

        {/* Category kicker */}
        <div className="absolute bottom-3 start-4 text-xs font-semibold text-cyan-400 tracking-wide uppercase">
          {categoryLabel}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4 text-start">
        <div className="space-y-2.5">
          
          {/* Title */}
          <h3 
            onClick={() => onSelectProject(project)}
            className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors cursor-pointer line-clamp-1"
            title={project.title}
          >
            {project.title}
          </h3>

          {/* Short description */}
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
            {project.shortDescription}
          </p>

          {/* Clean tech list with subtle typographic style */}
          <div className="pt-1 flex flex-wrap items-center gap-1.5">
            {project.technologies.slice(0, 4).map((tech, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded text-[11px] font-mono text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60"
              >
                {tech}
              </span>
            ))}
            {project.technologies.length > 4 && (
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono px-1">
                +{project.technologies.length - 4}
              </span>
            )}
          </div>
        </div>

        {/* Card Footer Actions */}
        <div className="pt-3 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between gap-3 text-xs">
          
          {/* Details Button */}
          <button
            onClick={() => onSelectProject(project)}
            className="flex items-center gap-1.5 font-bold text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 transition-colors focus:outline-none cursor-pointer"
          >
            <span>{t.projects.viewDetails}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>

          {/* External Links */}
          <div className="flex items-center gap-2">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white transition-colors"
                title={t.projects.liveDemo}
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}

            {project.githubUrl ? (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white transition-colors"
                title={t.projects.viewCode}
                onClick={(e) => e.stopPropagation()}
              >
                <Github className="w-3.5 h-3.5" />
              </a>
            ) : !isTemplate ? (
              <span 
                className="p-1.5 rounded-lg text-slate-400 dark:text-slate-600 bg-slate-100 dark:bg-slate-900/60 cursor-not-allowed"
                title={t.projects.codePrivate}
              >
                <Github className="w-3.5 h-3.5 opacity-40" />
              </span>
            ) : null}
          </div>
        </div>

      </div>
    </article>
  );
};
