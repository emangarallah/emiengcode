import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { Language } from '../i18n.ts';

interface ThemeToggleProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  lang: Language;
  compact?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  darkMode,
  setDarkMode,
  lang,
  compact = false,
}) => {
  const isAr = lang === 'ar';

  if (compact) {
    return (
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="flex items-center justify-center p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
        title={
          darkMode 
            ? (isAr ? 'التبديل إلى الوضع الفاتح (Light)' : 'Switch to Light Mode')
            : (isAr ? 'التبديل إلى الوضع الداكن (Dark)' : 'Switch to Dark Mode')
        }
        aria-label="Toggle Theme"
      >
        {darkMode ? (
          <Sun className="w-4 h-4 text-amber-400 animate-in spin-in-180 duration-200" />
        ) : (
          <Moon className="w-4 h-4 text-indigo-600 animate-in spin-in-180 duration-200" />
        )}
      </button>
    );
  }

  return (
    <div 
      className="inline-flex items-center p-1 rounded-xl bg-slate-200/80 dark:bg-slate-900 border border-slate-300/80 dark:border-slate-800 transition-colors shadow-inner"
      role="group"
      aria-label="Theme Mode Selection"
    >
      {/* Light Button */}
      <button
        type="button"
        onClick={() => setDarkMode(false)}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
          !darkMode
            ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80'
            : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
        }`}
        title={isAr ? 'الوضع الفاتح' : 'Light Mode'}
      >
        <Sun className={`w-3.5 h-3.5 ${!darkMode ? 'text-amber-500' : 'text-slate-400'}`} />
        <span>{isAr ? 'فاتح' : 'Light'}</span>
      </button>

      {/* Dark Button */}
      <button
        type="button"
        onClick={() => setDarkMode(true)}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
          darkMode
            ? 'bg-slate-800 text-cyan-300 shadow-sm border border-slate-700'
            : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
        }`}
        title={isAr ? 'الوضع الداكن' : 'Dark Mode'}
      >
        <Moon className={`w-3.5 h-3.5 ${darkMode ? 'text-cyan-400' : 'text-slate-400'}`} />
        <span>{isAr ? 'داكن' : 'Dark'}</span>
      </button>
    </div>
  );
};
