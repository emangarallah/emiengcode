import React from 'react';
import { 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  Terminal, 
  CheckCircle2, 
  Layers, 
  Cpu, 
  Database,
  Phone,
  Mail
} from 'lucide-react';
import { Language, translations } from '../i18n.ts';
import { Profile } from '../types.ts';

interface HeroSectionProps {
  lang: Language;
  profile: Profile | null;
  onExploreProjects: () => void;
  onRequestProject: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  lang,
  profile,
  onExploreProjects,
  onRequestProject,
}) => {
  const t = translations[lang];
  const isAr = lang === 'ar';
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  return (
    <section id="home" className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/4 start-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-gradient-to-tr from-cyan-600/15 via-indigo-600/15 to-transparent blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Main Hero Copy */}
          <div className="lg:col-span-7 space-y-6 text-start">
            
            {/* Status Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 shadow-sm backdrop-blur">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="w-2 h-2 rounded-full bg-emerald-500 -ms-4" />
              <span className="font-semibold text-emerald-700 dark:text-emerald-300">
                {t.hero.statusBadge}
              </span>
            </div>

            {/* Headline */}
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.15]">
                <span>{t.hero.titlePrefix} </span>
                <span className="bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 dark:from-cyan-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                  {t.hero.titleHighlight}
                </span>
                <br />
                <span className="text-slate-800 dark:text-slate-200 text-3xl sm:text-4xl lg:text-5xl font-extrabold">
                  {t.hero.titleSuffix}
                </span>
              </h1>
            </div>

            {/* Bio Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
              {profile?.headline || t.hero.subtext}
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={onExploreProjects}
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-cyan-500/20 hover:shadow-cyan-500/35 transition-all cursor-pointer"
              >
                <span>{t.hero.viewProjects}</span>
                <ArrowIcon className="w-4 h-4 stroke-[2.5]" />
              </button>

              <button
                onClick={onRequestProject}
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-100 dark:bg-slate-900/90 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700/80 text-slate-800 dark:text-white font-semibold text-sm transition-all cursor-pointer shadow-xs"
              >
                <Sparkles className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                <span>{t.hero.hireMe}</span>
              </button>
            </div>

            {/* Direct Contact Links */}
            {profile && (
              <div className="pt-1 flex flex-wrap items-center gap-2.5 text-xs">
                <a
                  href={`https://wa.me/${profile.whatsapp?.replace(/[^0-9]/g, '') || '967713551930'}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-950/90 border border-emerald-300 dark:border-emerald-800/80 text-emerald-800 dark:text-emerald-300 font-mono text-xs transition-colors shadow-xs"
                  title="WhatsApp"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>+{profile.whatsapp}</span>
                </a>
                <a
                  href={`mailto:${profile.email}`}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 dark:bg-slate-900/90 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors shadow-xs"
                  title="Email"
                >
                  <Mail className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                  <span>{profile.email}</span>
                </a>
              </div>
            )}

            {/* Quick Tech Highlights */}
            <div className="pt-4 flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                <span>React & TypeScript</span>
              </span>
              <span className="text-slate-300 dark:text-slate-600">·</span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Node.js & Express</span>
              </span>
              <span className="text-slate-300 dark:text-slate-600">·</span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Neon PostgreSQL</span>
              </span>
            </div>
          </div>

          {/* Interactive Code / Architecture Terminal */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl shadow-cyan-950/20 overflow-hidden font-mono text-xs text-slate-300">
              
              {/* Window Header */}
              <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="text-[11px] text-slate-400 ms-2 flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                    architecture.ts
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-slate-400 font-sans">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Neon Connected</span>
                </div>
              </div>

              {/* Terminal Code Snippet */}
              <div className="p-5 text-slate-300 space-y-2.5 overflow-x-auto selection:bg-cyan-500/30">
                <div className="text-slate-400">// EMICODE Full-Stack Architecture</div>
                <div>
                  <span className="text-purple-400">import</span> &#123; <span className="text-amber-300">NeonDatabase</span> &#125; <span className="text-purple-400">from</span> <span className="text-emerald-300">'@emicode/database'</span>;
                </div>
                <div>
                  <span className="text-purple-400">import</span> &#123; <span className="text-amber-300">PrismaClient</span> &#125; <span className="text-purple-400">from</span> <span className="text-emerald-300">'@prisma/client'</span>;
                </div>
                <div className="pt-1">
                  <span className="text-blue-400">const</span> <span className="text-yellow-300">systemSpec</span> = &#123;
                </div>
                <div className="ps-4">
                  <span className="text-slate-400">engine:</span> <span className="text-emerald-300">'React 19 + TypeScript'</span>,
                </div>
                <div className="ps-4">
                  <span className="text-slate-400">backend:</span> <span className="text-emerald-300">'Node.js + REST API'</span>,
                </div>
                <div className="ps-4">
                  <span className="text-slate-400">database:</span> <span className="text-emerald-300">'Neon Serverless PostgreSQL'</span>,
                </div>
                <div className="ps-4">
                  <span className="text-slate-400">security:</span> <span className="text-emerald-300">'HttpOnly Sessions + Argon2id'</span>,
                </div>
                <div className="ps-4">
                  <span className="text-slate-400">reliability:</span> <span className="text-cyan-400">99.98</span>,
                </div>
                <div className="ps-4">
                  <span className="text-slate-400">status:</span> <span className="text-emerald-400">'Production Ready'</span>
                </div>
                <div>&#125;;</div>
                <div className="pt-1 text-slate-400">
                  <span className="text-purple-400">export async function</span> <span className="text-blue-400">deploy</span>() &#123;
                </div>
                <div className="ps-4 text-cyan-300">
                  <span className="text-purple-400">return</span> <span className="text-purple-400">await</span> NeonDatabase.<span className="text-yellow-300">launch</span>(systemSpec);
                </div>
                <div>&#125;</div>
              </div>

              {/* Terminal Footer */}
              <div className="px-4 py-2.5 bg-slate-950/90 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-indigo-400" />
                  Full-Stack Architecture
                </span>
                <span className="text-emerald-400 font-semibold">Zero-Downtime</span>
              </div>
            </div>
          </div>

        </div>

        {/* Genuine Architectural Pillars & Capabilities */}
        <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/60 text-start shadow-xs">
            <div className="w-8 h-8 rounded-lg bg-cyan-100 dark:bg-cyan-950/80 flex items-center justify-center text-cyan-600 dark:text-cyan-400 mb-2.5">
              <Layers className="w-4 h-4" />
            </div>
            <div className="text-sm font-bold text-slate-900 dark:text-white">
              {isAr ? 'تطبيقات Full-Stack' : 'Full-Stack Apps'}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              React · TypeScript · Node.js
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/60 text-start shadow-xs">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-950/80 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-2.5">
              <Database className="w-4 h-4" />
            </div>
            <div className="text-sm font-bold text-slate-900 dark:text-white">
              {isAr ? 'قواعد بيانات سحابية' : 'Cloud Databases'}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Neon PostgreSQL · Prisma
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/60 text-start shadow-xs">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-2.5">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div className="text-sm font-bold text-slate-900 dark:text-white">
              {isAr ? 'أمان الجلسات والبيانات' : 'Security & Sessions'}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Argon2id · JWT · SSL
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/60 text-start shadow-xs">
            <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-950/80 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-2.5">
              <Phone className="w-4 h-4" />
            </div>
            <div className="text-sm font-bold text-slate-900 dark:text-white">
              {isAr ? 'تواصل ومتابعة مباشرة' : 'Direct Communication'}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              WhatsApp · Email 24h
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
