import React from 'react';
import { Code2, Github, Linkedin, Instagram, Mail, Database, ShieldCheck } from 'lucide-react';
import { Profile } from '../types.ts';
import { Language, translations } from '../i18n.ts';
import { ThemeToggle } from './ThemeToggle.tsx';

interface FooterProps {
  lang: Language;
  profile: Profile | null;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  onOpenAdmin: () => void;
  onNavigate: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  lang,
  profile,
  darkMode,
  setDarkMode,
  onOpenAdmin,
  onNavigate,
}) => {
  const t = translations[lang];

  return (
    <footer className="border-t border-slate-200 dark:border-slate-900 bg-slate-100/80 dark:bg-slate-950 text-slate-600 dark:text-slate-400 text-xs py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          
          {/* Brand Info */}
          <div className="space-y-2 text-start">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white">
                <Code2 className="w-4 h-4 stroke-[2.5]" />
              </div>
              <span className="text-lg font-black tracking-wider text-slate-900 dark:text-white font-mono">
                EMI<span className="text-cyan-600 dark:text-cyan-400">CODE</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
              {profile?.bio?.slice(0, 130) || t.tagline}...
            </p>
          </div>

          {/* Quick Links & Theme Switcher */}
          <div className="flex flex-wrap items-center gap-5 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <button onClick={() => onNavigate('home')} className="hover:text-cyan-600 dark:hover:text-white transition-colors cursor-pointer">
              {t.nav.home}
            </button>
            <button onClick={() => onNavigate('projects')} className="hover:text-cyan-600 dark:hover:text-white transition-colors cursor-pointer">
              {t.nav.projects}
            </button>
            <button onClick={() => onNavigate('services')} className="hover:text-cyan-600 dark:hover:text-white transition-colors cursor-pointer">
              {t.nav.services}
            </button>
            <button onClick={() => onNavigate('workflow')} className="hover:text-cyan-600 dark:hover:text-white transition-colors cursor-pointer">
              {t.nav.workflow}
            </button>
            <button onClick={() => onNavigate('contact')} className="hover:text-cyan-600 dark:hover:text-white transition-colors cursor-pointer">
              {t.nav.contact}
            </button>


            {/* Bottom Theme Toggle */}
            <ThemeToggle
              darkMode={darkMode}
              setDarkMode={setDarkMode}
              lang={lang}
            />
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-3">
            {profile?.githubUrl && (
              <a
                href={profile.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
                title="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
            )}
            {profile?.linkedinUrl && (
              <a
                href={profile.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
                title="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            )}
            <a
              href="https://www.instagram.com/code_emi?srtk=MXR5aHphOXByZ2J3ZQ=="
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-fuchsia-50 dark:bg-slate-900 border border-fuchsia-200 dark:border-slate-800 text-fuchsia-700 dark:text-fuchsia-400 hover:text-fuchsia-900 dark:hover:text-fuchsia-300 transition-colors"
              title="Instagram"
              aria-label="Instagram @code_emi"
            >
              <Instagram className="w-4 h-4" />
            </a>
            {profile?.email && (
              <a
                href={`mailto:${profile.email}`}
                className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-cyan-600 dark:text-cyan-400 hover:text-cyan-800 dark:hover:text-cyan-300 transition-colors"
                title="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            )}
          </div>

        </div>

        {/* Bottom bar with Neon PostgreSQL note */}
        <div className="pt-8 border-t border-slate-200 dark:border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-start">
          <div className="flex items-center justify-center sm:justify-start gap-2 text-slate-500 dark:text-slate-400">
            <span>{t.footer.rights}</span>
            <button
              onClick={onOpenAdmin}
              className="text-slate-400/40 hover:text-cyan-500 dark:text-slate-600 dark:hover:text-cyan-400 p-0.5 transition-colors cursor-pointer"
              title="Admin Portal"
              aria-label="Admin Portal"
            >
              <ShieldCheck className="w-3 h-3" />
            </button>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-300">
            <Database className="w-3.5 h-3.5 text-cyan-500 dark:text-cyan-400" />
            <span>{t.footer.databaseBadge}</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
