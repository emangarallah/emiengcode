import React, { useState, useEffect } from 'react';
import { Project, Service, Profile } from './types.ts';
import { Language } from './i18n.ts';
import { Navbar } from './components/Navbar.tsx';
import { HeroSection } from './components/HeroSection.tsx';
import { FeaturedProjects } from './components/FeaturedProjects.tsx';
import { ProjectsPage } from './components/ProjectsPage.tsx';
import { ServicesSection } from './components/ServicesSection.tsx';
import { WorkflowSection } from './components/WorkflowSection.tsx';
import { ContactSection } from './components/ContactSection.tsx';
import { ProjectDetailModal } from './components/ProjectDetailModal.tsx';
import { AdminPortal } from './components/AdminPortal.tsx';
import { Footer } from './components/Footer.tsx';
import { ThemeToggle } from './components/ThemeToggle.tsx';

export default function App() {
  const [lang, setLang] = useState<Language>('ar');
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [activeSection, setActiveSection] = useState<string>('home');

  // Domain data
  const [projects, setProjects] = useState<Project[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Modals & Triggers
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [contactServicePreload, setContactServicePreload] = useState<string>('');
  const [contactReferenceProject, setContactReferenceProject] = useState<string>('');
  const [contactPrefilledMessage, setContactPrefilledMessage] = useState<string>('');

  // Admin login check
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);

  // Sync HTML dir & lang
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  // Sync Dark mode to document.documentElement
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Load public initial data & profile details from Neon database
  const loadData = async () => {
    try {
      const [pRes, sRes, profRes] = await Promise.all([
        fetch('/api/projects'),
        fetch('/api/services'),
        fetch(`/api/profile?t=${Date.now()}`)
      ]);

      if (pRes.ok) setProjects(await pRes.json());
      if (sRes.ok) setServices(await sRes.json());
      if (profRes.ok) {
        const profileData = await profRes.json();
        setProfile(profileData);
      }
    } catch (err) {
      console.error('Failed to load initial portfolio data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const checkAdminAuth = async (): Promise<boolean> => {
    try {
      const headers: Record<string, string> = {};
      const stored = typeof window !== 'undefined' ? sessionStorage.getItem('emicode_admin_token') : null;
      if (stored) headers['Authorization'] = `Bearer ${stored}`;
      const res = await fetch('/api/admin/me', { credentials: 'include', headers });
      return res.ok;
    } catch {
      return false;
    }
  };

  useEffect(() => {
    loadData();
    let active = true;
    checkAdminAuth().then((ok) => {
      if (active) setIsAdminLoggedIn(ok);
    });
    return () => { active = false; };
  }, []);

  // Sync hash routing e.g. #project-slug or #admin / #dashboard
  useEffect(() => {
    const handleRoute = () => {
      const hash = window.location.hash;
      const path = window.location.pathname;

      if (hash.startsWith('#project/')) {
        const slug = hash.replace('#project/', '');
        const found = projects.find(p => p.slug === slug);
        if (found) setSelectedProject(found);
      } else if (hash === '#admin' || hash === '#dashboard' || path === '/admin' || path === '/dashboard') {
        setIsAdminOpen(true);
      }
    };

    handleRoute();
    window.addEventListener('hashchange', handleRoute);
    window.addEventListener('popstate', handleRoute);
    return () => {
      window.removeEventListener('hashchange', handleRoute);
      window.removeEventListener('popstate', handleRoute);
    };
  }, [projects]);

  const handleSelectProject = (project: Project) => {
    setSelectedProject(project);
    window.location.hash = `#project/${project.slug}`;
  };

  const handleCloseProject = () => {
    setSelectedProject(null);
    if (window.location.hash.startsWith('#project/')) {
      history.pushState('', document.title, window.location.pathname + window.location.search);
    }
  };

  const handleCloseAdmin = () => {
    setIsAdminOpen(false);
    checkAdminAuth().then((ok) => setIsAdminLoggedIn(ok));
    if (window.location.hash === '#admin' || window.location.hash === '#dashboard') {
      history.pushState('', document.title, window.location.pathname + window.location.search);
    }
  };

  const handleScrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectServiceToOrder = (serviceTitle: string) => {
    setContactServicePreload(serviceTitle);
    setContactReferenceProject('');
    setContactPrefilledMessage(
      lang === 'ar'
        ? `أود الاستفسار وطلب خدمة: "${serviceTitle}".`
        : `I would like to inquire about and request the service: "${serviceTitle}".`
    );
    handleScrollToSection('contact');
  };

  const handleRequestSimilarProject = (projectName: string, serviceTitle?: string | null) => {
    if (serviceTitle) {
      setContactServicePreload(serviceTitle);
    }
    setContactReferenceProject(projectName);
    setContactPrefilledMessage(
      lang === 'ar'
        ? `مرحبًا، أعجبني نموذج المشروع "${projectName}" وأود الاستفسار عن بناء نظام متكامل مشابه له بمواصفات مخصصة لنشاطي.`
        : `Hello, I reviewed the prototype project "${projectName}" and would like to build a similar custom system.`
    );
    handleScrollToSection('contact');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col selection:bg-cyan-500/20 selection:text-cyan-700 dark:selection:text-cyan-300 transition-colors">
      
      {/* Top Navbar */}
      <Navbar
        lang={lang}
        setLang={setLang}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        isAdminLoggedIn={isAdminLoggedIn}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onRequestProject={() => handleScrollToSection('contact')}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        
        {/* Hero Section */}
        <HeroSection
          lang={lang}
          profile={profile}
          onExploreProjects={() => handleScrollToSection('projects')}
          onRequestProject={() => handleScrollToSection('contact')}
        />

        {/* Featured Projects Highlight */}
        <FeaturedProjects
          projects={projects}
          lang={lang}
          onSelectProject={handleSelectProject}
          onRequestSimilar={handleRequestSimilarProject}
          onViewAllProjects={() => handleScrollToSection('projects')}
        />

        {/* All Projects with Filters & Search */}
        <ProjectsPage
          projects={projects}
          lang={lang}
          onSelectProject={handleSelectProject}
          onRequestSimilar={handleRequestSimilarProject}
        />

        {/* Development Services (7 core services) */}
        <ServicesSection
          services={services}
          lang={lang}
          onSelectServiceToOrder={handleSelectServiceToOrder}
        />

        {/* Work Process / Steps */}
        <WorkflowSection lang={lang} />

        {/* Secure Contact Form with Neon backend storage */}
        <ContactSection
          lang={lang}
          profile={profile}
          services={services}
          selectedServicePreload={contactServicePreload}
          referenceProjectPreload={contactReferenceProject}
          prefilledMessage={contactPrefilledMessage}
        />

      </main>

      {/* Footer */}
      <Footer
        lang={lang}
        profile={profile}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onNavigate={handleScrollToSection}
      />

      {/* Floating Quick Theme Toggle (Light & Dark Buttons) */}
      <div className="fixed bottom-6 start-6 z-30 shadow-xl rounded-xl">
        <ThemeToggle
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          lang={lang}
        />
      </div>

      {/* Deep-dive Project Details Modal */}
      {selectedProject && (
        <ProjectDetailModal
          project={selectedProject}
          lang={lang}
          onClose={handleCloseProject}
          onRequestSimilar={handleRequestSimilarProject}
        />
      )}

      {/* Admin Control Center Portal */}
      {isAdminOpen && (
        <AdminPortal
          lang={lang}
          onClose={handleCloseAdmin}
          onDataChanged={() => {
            loadData();
            checkAdminAuth().then((ok) => setIsAdminLoggedIn(ok));
          }}
        />
      )}

    </div>
  );
}
