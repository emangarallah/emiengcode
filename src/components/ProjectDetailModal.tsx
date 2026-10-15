import React, { useState } from 'react';
import { 
  X, 
  ExternalLink, 
  Layers, 
  Sparkles, 
  FlaskConical,
  ArrowRight, 
  ArrowLeft,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { Project } from '../types.ts';
import { Language, translations } from '../i18n.ts';

interface ProjectDetailModalProps {
  project: Project | null;
  lang: Language;
  onClose: () => void;
  onRequestSimilar: (projectName: string, serviceTitle?: string | null) => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  lang,
  onClose,
  onRequestSimilar,
}) => {
  if (!project) return null;

  const t = translations[lang];
  const isAr = lang === 'ar';
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;
  const isTemplate = Boolean(project.isTemplate || project.status === 'prototype');

  const allImages = [project.coverImage, ...(project.gallery || [])].filter(Boolean);
  const [selectedImgIndex, setSelectedImgIndex] = useState(0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      
      {/* Modal Container */}
      <div 
        className="relative w-full max-w-4xl my-auto rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden text-start max-h-[92vh] flex flex-col transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header Bar */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
            <span className="text-cyan-600 dark:text-cyan-400 uppercase font-bold">{project.category}</span>
            {project.serviceTitle && (
              <>
                <span>·</span>
                <span className="text-slate-700 dark:text-slate-300 font-semibold bg-slate-200/70 dark:bg-slate-800 px-2 py-0.5 rounded text-[11px]">
                  {project.serviceTitle}
                </span>
              </>
            )}
            <span>·</span>
            {isTemplate ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/30">
                <FlaskConical className="w-3.5 h-3.5 text-amber-500" />
                {isAr ? 'نموذج تجريبي · مثال توضيحي' : 'Illustrative Prototype'}
              </span>
            ) : (
              <span className="text-slate-500 dark:text-slate-400">
                {new Date(project.createdAt).toLocaleDateString(isAr ? 'ar-EG' : 'en-US', { year: 'numeric', month: 'short' })}
              </span>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-200 dark:bg-slate-900 hover:bg-slate-300 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-6 space-y-6">
          
          {/* Main Title & Kicker */}
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-tight">
              {project.title}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              {project.shortDescription}
            </p>
          </div>

          {/* Illustrative Template Disclaimer Banner */}
          {isTemplate && (
            <div className="p-4 rounded-xl bg-amber-50/90 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-200 text-xs sm:text-sm flex items-start gap-3 shadow-xs">
              <div className="w-6 h-6 rounded-md bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <div className="space-y-1">
                <p className="font-bold text-amber-950 dark:text-amber-100">
                  {isAr ? 'نموذج تجريبي ومثال توضيحي لإبراز إمكانيات التطوير' : 'Illustrative Prototype & Architecture Showcase'}
                </p>
                <p className="text-xs text-amber-800/90 dark:text-amber-300/90 leading-relaxed">
                  {isAr 
                    ? 'هذا المشروع نموذج عملي وتوضيحي يعرض معايير التصميم، بنية واجهات المستخدم، وهندسة الوظائف التي يمكن تنفيذها. لا يمثل عملاً منفذاً لعميل محدد، ويمكن برمجته وتخصيصه بالكامل وفق هوية ومتطلبات نشاطك التجاري.'
                    : 'This project is a functional demonstration showcasing design systems, UI architecture, and technical workflows. It does not claim client endorsement and can be fully engineered and tailored for your brand.'}
                </p>
              </div>
            </div>
          )}

          {/* Live Vercel preview; image gallery remains available for projects without a deployment URL. */}
          {project.liveUrl ? (
            <section className="space-y-3" aria-label={isAr ? 'معاينة المشروع مباشرة' : 'Live project preview'}>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-cyan-600 dark:text-cyan-300">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    {isAr ? 'معاينة مباشرة من Vercel' : 'Live preview from Vercel'}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {isAr ? 'شاهد الموقع المنشور نفسه بدلًا من عرض كود المصدر.' : 'Explore the deployed website instead of source code.'}
                  </p>
                </div>
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-cyan-600 to-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-cyan-500/20 hover:opacity-95"
                >
                  <span>{isAr ? 'فتح المشروع كاملًا' : 'Open full project'}</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>

              <div className="overflow-hidden rounded-xl border border-slate-300 bg-slate-100 shadow-xl dark:border-slate-700">
                <div className="flex h-10 items-center gap-3 border-b border-slate-300 bg-slate-200 px-3 dark:border-slate-700 dark:bg-slate-950">
                  <span className="flex gap-1.5" aria-hidden="true">
                    <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                  </span>
                  <span className="min-w-0 flex-1 truncate rounded-md border border-slate-300 bg-white px-3 py-1 text-start font-mono text-[10px] text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                    {project.liveUrl.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                  </span>
                  <span className="hidden text-[9px] font-black tracking-widest text-slate-500 sm:inline">VERCEL</span>
                </div>
                <iframe
                  src={project.liveUrl}
                  title={isAr ? `معاينة ${project.title}` : `${project.title} live preview`}
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allow="fullscreen; clipboard-read; clipboard-write"
                  className="h-[55vh] min-h-[320px] max-h-[640px] w-full bg-white"
                />
              </div>
              <p className="text-[11px] leading-5 text-slate-500 dark:text-slate-400">
                {isAr
                  ? 'إذا منع الموقع التضمين داخل النافذة، استخدم زر «فتح المشروع كاملًا» لعرضه في صفحة مستقلة.'
                  : 'If the site blocks embedding, use “Open full project” to view it in a separate tab.'}
              </p>
            </section>
          ) : (
            <div className="space-y-2.5">
              <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-slate-950 border border-slate-200 dark:border-slate-800">
                <img
                  src={allImages[selectedImgIndex]}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
                {allImages.length > 1 && (
                  <div className="absolute inset-y-0 inset-x-2 flex items-center justify-between pointer-events-none">
                    <button
                      onClick={() => setSelectedImgIndex((prev) => (prev > 0 ? prev - 1 : allImages.length - 1))}
                      className="p-2 rounded-full bg-slate-900/80 text-white hover:bg-slate-900 pointer-events-auto border border-slate-700 backdrop-blur"
                      aria-label={isAr ? 'الصورة السابقة' : 'Previous image'}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setSelectedImgIndex((prev) => (prev < allImages.length - 1 ? prev + 1 : 0))}
                      className="p-2 rounded-full bg-slate-900/80 text-white hover:bg-slate-900 pointer-events-auto border border-slate-700 backdrop-blur"
                      aria-label={isAr ? 'الصورة التالية' : 'Next image'}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {allImages.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {allImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImgIndex(idx)}
                      className={`relative w-20 h-14 rounded-lg overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                        selectedImgIndex === idx ? 'border-cyan-500 scale-95' : 'border-slate-300 dark:border-slate-800 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={isAr ? `صورة ${idx + 1}` : `Image ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Action Links Bar */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2.5">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-indigo-600 text-white text-xs font-bold shadow-md shadow-cyan-500/20 hover:opacity-95"
                >
                  <span>{t.projects.liveDemo}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}

            </div>

            <button
              onClick={() => {
                onClose();
                onRequestSimilar(project.title, project.serviceTitle);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-50 dark:bg-slate-800/90 hover:bg-cyan-100 dark:hover:bg-slate-800 text-cyan-700 dark:text-cyan-300 text-xs font-bold border border-cyan-300 dark:border-cyan-500/30 cursor-pointer shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
              <span>{t.projectDetail.requestSimilar}</span>
              <ArrowIcon className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Detailed Problem & Architectural Solution */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
              <Layers className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <span>{t.projectDetail.overview}</span>
            </h3>
            
            <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line space-y-3">
              {project.description}
            </div>
          </div>

          {/* Tech Stack Matrix */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {t.projectDetail.technologiesUsed}
            </h4>
            <div className="flex flex-wrap items-center gap-2">
              {project.technologies.map((tech, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-md text-xs font-mono font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
            {isTemplate ? (isAr ? 'معرّف النموذج: ' : 'Template ID: ') : 'ID: '}{project.slug}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold cursor-pointer"
          >
            {t.projectDetail.close}
          </button>
        </div>

      </div>
    </div>
  );
};
