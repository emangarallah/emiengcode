import React, { useState } from 'react';
import { 
  Send, 
  MessageSquare, 
  Mail, 
  Phone, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Sparkles,
  ArrowRight,
  ArrowLeft,
  X
} from 'lucide-react';
import { Language, translations } from '../i18n.ts';
import { Profile, Service } from '../types.ts';

interface ContactSectionProps {
  lang: Language;
  profile: Profile | null;
  services: Service[];
  selectedServicePreload?: string;
  referenceProjectPreload?: string;
  prefilledMessage?: string;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  lang,
  profile,
  services,
  selectedServicePreload,
  referenceProjectPreload,
  prefilledMessage,
}) => {
  const t = translations[lang];
  const isAr = lang === 'ar';
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [serviceType, setServiceType] = useState(selectedServicePreload || '');
  const [budget, setBudget] = useState('');
  const [timeline, setTimeline] = useState('');
  const [additionalFeatures, setAdditionalFeatures] = useState('');
  const [referenceProject, setReferenceProject] = useState(referenceProjectPreload || '');
  const [message, setMessage] = useState(prefilledMessage || '');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Update if preloaded values change
  React.useEffect(() => {
    if (selectedServicePreload) {
      setServiceType(selectedServicePreload);
    }
  }, [selectedServicePreload]);

  React.useEffect(() => {
    if (referenceProjectPreload !== undefined) {
      setReferenceProject(referenceProjectPreload);
    }
  }, [referenceProjectPreload]);

  React.useEffect(() => {
    if (prefilledMessage) {
      setMessage(prefilledMessage);
    }
  }, [prefilledMessage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccess(false);

    try {
      const selectedService = services.find((service) => service.title === serviceType);
      if (!selectedService) {
        throw new Error(isAr ? 'يرجى اختيار خدمة متاحة من القائمة.' : 'Please select an available service.');
      }

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone: phone.trim() || null,
          serviceId: selectedService.id,
          serviceType: selectedService.title,
          budget: budget.trim() || null,
          timeline: timeline.trim() || null,
          additionalFeatures: additionalFeatures.trim() || null,
          referenceProject: referenceProject.trim() || null,
          message
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'فشل إرسال الطلب، يرجى المحاولة لاحقًا');
      }

      if (typeof data.trackingToken === 'string' && /^[a-f0-9]{64}$/i.test(data.trackingToken)) {
        // The request and notifications are already committed on the server. Browser storage
        // restrictions must not turn a successful submission into a reported failure.
        try {
          let previousTokens: string[] = [];
        try {
          const saved = JSON.parse(localStorage.getItem('emicode_client_notification_tokens') || '[]');
          if (Array.isArray(saved)) previousTokens = saved.filter((token): token is string => typeof token === 'string' && /^[a-f0-9]{64}$/i.test(token));
        } catch {
          previousTokens = [];
        }
        const legacyToken = localStorage.getItem('emicode_client_notification_token');
        if (legacyToken && /^[a-f0-9]{64}$/i.test(legacyToken)) previousTokens.push(legacyToken);
        const tokens = [data.trackingToken, ...previousTokens.filter((token) => token !== data.trackingToken)];
        localStorage.setItem('emicode_client_notification_tokens', JSON.stringify([...new Set(tokens)].slice(0, 20)));
        // Keep the last-token key for older cached frontend builds.
        localStorage.setItem('emicode_client_notification_token', data.trackingToken);
          window.dispatchEvent(new Event('emicode-client-token-updated'));
        } catch {
          // Submission succeeded in Neon, but this browser cannot persist the tracking token.
        }
      }
      setSuccess(true);
      setName('');
      setEmail('');
      setPhone('');
      setBudget('');
      setTimeline('');
      setAdditionalFeatures('');
      setReferenceProject('');
      setMessage('');
    } catch (err: any) {
      setErrorMessage(err.message || 'حدث خطأ في الاتصال بالخادم');
    } finally {
      setIsSubmitting(false);
    }
  };

  // WhatsApp link preparation
  const whatsappNumber = profile?.whatsapp?.trim() || '';
  const cleanPhone = whatsappNumber.replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    isAr 
      ? 'مرحبًا م. عماد، أود استشارتك بشأن مشروع برمجي جديد.'
      : 'Hello! I would like to inquire about software engineering for a new project.'
  )}`;

  return (
    <section id="contact" className="py-20 border-t border-slate-200 dark:border-slate-900 bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl text-start mb-14 space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{t.contact.kicker}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
            {t.contact.title}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
            {t.contact.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Contact Details & Direct WhatsApp/Email */}
          <div className="lg:col-span-5 space-y-6 text-start">
            
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-5 shadow-xs dark:shadow-md">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                <span>{isAr ? 'قنوات التواصل المباشرة' : 'Direct Channels'}</span>
              </h3>
              
              <div className="space-y-4">
                {/* WhatsApp */}
                {cleanPhone && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-between text-emerald-800 dark:text-emerald-300 transition-colors group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 flex items-center justify-center text-emerald-600 dark:text-emerald-300">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">{t.contact.form.whatsAppCta}</div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white font-mono mt-0.5">+{whatsappNumber}</div>
                    </div>
                  </div>
                  <ArrowIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
                )}

                {/* Email */}
                {profile?.email && (
                <a
                  href={`mailto:${profile?.email || ''}`}
                  className="p-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-slate-800 dark:text-slate-200 transition-colors group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white dark:bg-slate-800 flex items-center justify-center text-cyan-600 dark:text-cyan-400 border border-slate-200 dark:border-slate-700">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">{t.contact.form.emailCta}</div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white font-mono mt-0.5">{profile?.email || ''}</div>
                    </div>
                  </div>
                  <ArrowIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
                )}

              </div>

              {/* Response information without an unsupported response-time guarantee */}
              <div className="pt-2 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <Clock className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                <span>{isAr ? 'أرسل تفاصيل مشروعك وسيتم التواصل معك عبر بيانات الاتصال التي تقدمها.' : 'Send your project details and we will contact you using the details you provide.'}</span>
              </div>
            </div>

            {/* Neon Storage Notice */}
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/60 text-xs text-slate-600 dark:text-slate-400 flex items-center gap-2 shadow-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>{isAr ? 'يتم حفظ جميع الطلبات مباشرة في قاعدة بيانات Neon مع تأمين جلسات الاتصال.' : 'All client requests are securely saved into Neon PostgreSQL.'}</span>
            </div>

          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7">
            <form
              onSubmit={handleSubmit}
              className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-4 text-start shadow-xs dark:shadow-xl"
            >
              
              {/* Success Notification */}
              {success && (
                <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700/80 text-emerald-800 dark:text-emerald-200 flex items-start gap-3 animate-in fade-in">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm font-bold">{t.contact.form.successTitle}</p>
                    <p className="text-xs text-emerald-700 dark:text-emerald-300">{t.contact.form.successDesc}</p>
                  </div>
                </div>
              )}

              {/* Error Notification */}
              {errorMessage && (
                <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/80 border border-rose-300 dark:border-rose-700/80 text-rose-800 dark:text-rose-200 flex items-start gap-3 animate-in fade-in">
                  <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm font-bold">{t.contact.form.errorTitle}</p>
                    <p className="text-xs text-rose-700 dark:text-rose-300">{errorMessage}</p>
                  </div>
                </div>
              )}

              {/* Reference Project Banner if user clicked "أريد مشروعاً مشابهاً" */}
              {referenceProject && (
                <div className="p-3 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-200 dark:border-cyan-800/80 flex items-center justify-between text-xs text-cyan-800 dark:text-cyan-200 animate-in fade-in">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
                    <span>{t.contact.form.referenceProject}: <strong className="font-bold text-cyan-900 dark:text-cyan-100">{referenceProject}</strong></span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setReferenceProject('')}
                    className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-cyan-100 dark:hover:bg-cyan-900 transition-colors"
                    title={isAr ? 'إلغاء الربط بالمشروع المرجعي' : 'Clear reference project'}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Grid Inputs: Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {t.contact.form.name} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t.contact.form.namePlaceholder}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {t.contact.form.email} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t.contact.form.emailPlaceholder}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none"
                  />
                </div>
              </div>

              {/* Phone & Service */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {t.contact.form.phone}
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={t.contact.form.phonePlaceholder}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {t.contact.form.service} <span className="text-rose-500">*</span>
                  </label>
                  <select
                    required
                    value={serviceType}
                    onChange={(e) => setServiceType(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-sm text-slate-900 dark:text-white outline-none cursor-pointer"
                  >
                    <option value="">{t.contact.form.selectService}</option>
                    {services.map((srv) => (
                      <option key={srv.id} value={srv.title}>
                        {srv.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Budget & Expected Timeline */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {t.contact.form.budget}
                  </label>
                  <input
                    type="text"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    placeholder={t.contact.form.budgetPlaceholder}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {t.contact.form.timeline}
                  </label>
                  <input
                    type="text"
                    value={timeline}
                    onChange={(e) => setTimeline(e.target.value)}
                    placeholder={t.contact.form.timelinePlaceholder}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none"
                  />
                </div>
              </div>

              {/* Project Description (Required) */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {t.contact.form.message} <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={t.contact.form.messagePlaceholder}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none resize-y"
                />
              </div>

              {/* Additional Features (Optional) */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {t.contact.form.additionalFeatures}
                </label>
                <textarea
                  rows={2}
                  value={additionalFeatures}
                  onChange={(e) => setAdditionalFeatures(e.target.value)}
                  placeholder={t.contact.form.additionalFeaturesPlaceholder}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none resize-y"
                />
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold text-sm shadow-xl shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <span>{t.contact.form.submitting}</span>
                  ) : (
                    <>
                      <span>{t.contact.form.submit}</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>

        </div>

      </div>
    </section>
  );
};
