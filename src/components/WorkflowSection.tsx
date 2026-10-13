import React from 'react';
import { Compass, Palette, Code, Rocket, CheckCircle } from 'lucide-react';
import { Language, translations } from '../i18n.ts';

interface WorkflowSectionProps {
  lang: Language;
}

export const WorkflowSection: React.FC<WorkflowSectionProps> = ({ lang }) => {
  const t = translations[lang];

  const steps = [
    {
      num: '01',
      icon: <Compass className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />,
      title: t.workflow.step1Title,
      desc: t.workflow.step1Desc
    },
    {
      num: '02',
      icon: <Palette className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />,
      title: t.workflow.step2Title,
      desc: t.workflow.step2Desc
    },
    {
      num: '03',
      icon: <Code className="w-5 h-5 text-purple-600 dark:text-purple-400" />,
      title: t.workflow.step3Title,
      desc: t.workflow.step3Desc
    },
    {
      num: '04',
      icon: <Rocket className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
      title: t.workflow.step4Title,
      desc: t.workflow.step4Desc
    }
  ];

  return (
    <section id="workflow" className="py-20 border-t border-slate-200 dark:border-slate-900 bg-white dark:bg-slate-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl text-start mb-16 space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>{t.workflow.kicker}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
            {t.workflow.title}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
            {t.workflow.subtitle}
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between space-y-4 text-start relative group shadow-xs"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 flex items-center justify-center">
                    {step.icon}
                  </div>
                  <span className="text-2xl font-black text-slate-300 dark:text-slate-600 font-mono">
                    {step.num}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors">
                  {step.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {step.desc}
                </p>
              </div>

              <div className="pt-2">
                <div className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full" 
                    style={{ width: `${(idx + 1) * 25}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
