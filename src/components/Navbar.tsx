import React, { useState } from 'react';
import { 
  Code2, 
  Globe2, 
  Menu, 
  X, 
  ShieldCheck, 
  ArrowUpRight 
} from 'lucide-react';
import { Language, translations } from '../i18n.ts';
import { ThemeToggle } from './ThemeToggle.tsx';
import { NotificationCenter } from './NotificationCenter.tsx';

interface NavbarProps {
  lang: Language;
  setLang: (lang: Language) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  activeSection: string;
  setActiveSection: (sec: string) => void;
  isAdminLoggedIn: boolean;
  onOpenAdmin: () => void;
  onRequestProject: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  lang,
  setLang,
  darkMode,
  setDarkMode,
  activeSection,
  setActiveSection,
  isAdminLoggedIn,
  onOpenAdmin,
  onRequestProject,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = translations[lang];

  const navLinks = [
    { id: 'home', label: t.nav.home },
    { id: 'projects', label: t.nav.projects },
    { id: 'services', label: t.nav.services },
    { id: 'workflow', label: t.nav.workflow },
    { id: 'contact', label: t.nav.contact },
  ];

  const handleNavClick = (id: string) => {
    setActiveSection(id);
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/90 dark:bg-slate-950/85 border-b border-slate-200 dark:border-slate-800/80 transition-colors shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <button 
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-3 text-start group cursor-pointer focus:outline-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <Code2 className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <span className="text-xl font-black tracking-wider text-slate-900 dark:text-white flex items-center gap-1 font-mono">
              EMI<span className="text-cyan-600 dark:text-cyan-400">CODE</span>
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium block -mt-0.5 tracking-wide">
              {lang === 'ar' ? 'معرض أعمال البرمجيات' : 'ENGINEERING PORTFOLIO'}
            </span>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`text-sm font-medium transition-colors relative py-1 focus:outline-none cursor-pointer ${
                  isActive 
                    ? 'text-cyan-600 dark:text-cyan-400 font-semibold' 
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 start-0 w-full h-0.5 bg-cyan-600 dark:bg-cyan-400 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Actions & Controls */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Dedicated Light & Dark Toggle Buttons */}
          <ThemeToggle
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            lang={lang}
          />

          {/* Language Switch */}
          <button
            onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            title={lang === 'ar' ? 'Switch to English' : 'التحويل للعربية'}
          >
            <Globe2 className="w-3.5 h-3.5 text-cyan-500 dark:text-cyan-400" />
            <span>{lang === 'ar' ? 'EN' : 'عربي'}</span>
          </button>

          <NotificationCenter mode="client" lang={lang} placement="inline" />

          {/* Always-visible admin entry; server-side APIs still enforce authentication. */}
          <button
            onClick={onOpenAdmin}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-500/40 text-emerald-800 dark:text-emerald-300 shadow-sm transition-all cursor-pointer hover:bg-emerald-100 dark:hover:bg-emerald-900/60"
            title={isAdminLoggedIn ? t.nav.admin : (lang === 'ar' ? 'دخول الإدارة' : 'Admin login')}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{isAdminLoggedIn ? t.nav.admin : (lang === 'ar' ? 'دخول الإدارة' : 'Admin login')}</span>
            {isAdminLoggedIn && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />}
          </button>

          {/* CTA Request Project */}
          <button
            onClick={onRequestProject}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white shadow-md shadow-cyan-500/15 hover:shadow-cyan-500/30 transition-all cursor-pointer"
          >
            <span>{t.nav.requestProject}</span>
            <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Mobile Menu & Quick Controls */}
        <div className="flex lg:hidden items-center gap-2">
          {/* Quick Theme Toggle for Mobile */}
          <ThemeToggle
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            lang={lang}
            compact={true}
          />

          {/* Language Switch */}
          <button
            onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
            className="px-2.5 py-1 text-xs font-semibold rounded bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-300"
          >
            {lang === 'ar' ? 'EN' : 'عربي'}
          </button>

          <NotificationCenter mode="client" lang={lang} placement="inline" />

          {/* Hamburger Menu */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 pt-3 pb-6 space-y-4 animate-in slide-in-from-top duration-200 shadow-lg">
          
          {/* Mobile Theme Selector */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              {lang === 'ar' ? 'مظهر الموقع' : 'Theme Mode'}
            </span>
            <ThemeToggle
              darkMode={darkMode}
              setDarkMode={setDarkMode}
              lang={lang}
            />
          </div>

          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`text-start px-3 py-2 text-sm rounded-lg font-medium transition-colors ${
                  activeSection === link.id
                    ? 'bg-cyan-50 dark:bg-slate-900 text-cyan-600 dark:text-cyan-400 font-bold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900/50'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-200 dark:border-slate-800/80 flex flex-col gap-2.5">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="flex items-center justify-between w-full px-3 py-2 text-sm rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60"
              title={isAdminLoggedIn ? t.nav.admin : (lang === 'ar' ? 'دخول الإدارة' : 'Admin login')}
            >
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                {isAdminLoggedIn ? t.nav.admin : (lang === 'ar' ? 'دخول الإدارة' : 'Admin login')}
              </span>
              {isAdminLoggedIn && (
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 rounded font-semibold">
                  {lang === 'ar' ? 'متصل' : 'Active'}
                </span>
              )}
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onRequestProject();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-bold rounded-lg bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-lg shadow-cyan-500/20"
            >
              <span>{t.nav.requestProject}</span>
              <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
