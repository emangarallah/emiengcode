import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Bell, Check, CheckCheck, Clock3, ExternalLink, LoaderCircle, X } from 'lucide-react';
import { Language } from '../i18n.ts';

type Mode = 'client' | 'admin';

const readClientTrackingTokens = (): string[] => {
  if (typeof window === 'undefined') return [];
  let stored: string[] = [];
  try {
    const parsed = JSON.parse(localStorage.getItem('emicode_client_notification_tokens') || '[]');
    if (Array.isArray(parsed)) stored = parsed.filter((token): token is string => typeof token === 'string' && /^[a-f0-9]{64}$/i.test(token));
  } catch {
    stored = [];
  }
  const legacy = localStorage.getItem('emicode_client_notification_token');
  if (legacy && /^[a-f0-9]{64}$/i.test(legacy)) stored.push(legacy);
  return [...new Set(stored)].slice(0, 20);
};

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: string;
  entityType?: string | null;
  entityId?: string | null;
  targetUrl?: string | null;
  readAt?: string | null;
  createdAt: string;
}

interface ClientRequestDetails {
  id: string;
  serviceType: string;
  message: string;
  status: string;
  createdAt: string;
}

const requestStatusLabels: Record<string, { ar: string; en: string }> = {
  new: { ar: 'جديد', en: 'New' },
  in_review: { ar: 'قيد المراجعة', en: 'In review' },
  accepted: { ar: 'مقبول', en: 'Accepted' },
  rejected: { ar: 'مرفوض', en: 'Rejected' },
  contacted: { ar: 'تم التواصل', en: 'Contacted' },
  completed: { ar: 'مكتمل', en: 'Completed' },
  archived: { ar: 'مؤرشف', en: 'Archived' }
};

interface NotificationCenterProps {
  mode: Mode;
  lang: Language;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ mode, lang }) => {
  const isAr = lang === 'ar';
  const [trackingTokens, setTrackingTokens] = useState<string[]>(() => (
    mode === 'client' ? readClientTrackingTokens() : []
  ));
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<ClientRequestDetails | null>(null);
  const [isRequestLoading, setIsRequestLoading] = useState(false);
  const isOpenRef = useRef(isOpen);
  const previousIdsRef = useRef<Set<string> | null>(null);

  useEffect(() => {
    isOpenRef.current = isOpen;
  }, [isOpen]);

  const loadNotifications = useCallback(async () => {
    if (isOpenRef.current) setIsLoading(true);
    const tokens = mode === 'client' ? readClientTrackingTokens() : [];

    if (mode === 'client') setTrackingTokens(tokens);
    if (mode === 'client' && tokens.length === 0) {
      setItems([]);
      setUnreadCount(0);
      setErrorMessage(null);
      return;
    }

    try {
      const response = mode === 'admin'
        ? await fetch('/api/admin/notifications', { credentials: 'include' })
        : await fetch('/api/client/notifications', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ trackingTokens: tokens })
          });
      if (!response.ok) {
        setErrorMessage(isAr
          ? 'تعذر تحديث الإشعارات. تحقق من الاتصال وحاول مرة أخرى.'
          : 'Unable to refresh notifications. Check your connection and try again.');
        return;
      }
      const data = await response.json();
      setErrorMessage(null);
      const nextItems: NotificationItem[] = Array.isArray(data.notifications) ? data.notifications : [];
      const nextIds = new Set(nextItems.map((item) => item.id));
      const knownIds = previousIdsRef.current;
      if (knownIds) {
        const arrived = nextItems.find((item) => !knownIds.has(item.id));
        if (arrived) {
          setToast(arrived.title);
          window.setTimeout(() => setToast(null), 4000);
        }
      }
      previousIdsRef.current = nextIds;
      setItems(nextItems);
      setUnreadCount(Number(data.unreadCount) || 0);
    } catch {
      setErrorMessage(isAr
        ? 'تعذر الاتصال بخدمة الإشعارات. حاول مرة أخرى.'
        : 'Could not connect to notifications. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [mode, isAr]);

  useEffect(() => {
    let active = true;
    const refresh = async () => {
      if (!active || document.visibilityState !== 'visible') return;
      await loadNotifications();
    };
    void refresh();
    const timer = window.setInterval(() => void refresh(), 25000);
    const onClientTokenChanged = () => {
      if (mode === 'client') {
        previousIdsRef.current = new Set();
        void refresh();
      }
    };
    window.addEventListener('emicode-client-token-updated', onClientTokenChanged);
    document.addEventListener('visibilitychange', refresh);
    return () => {
      active = false;
      window.clearInterval(timer);
      window.removeEventListener('emicode-client-token-updated', onClientTokenChanged);
      document.removeEventListener('visibilitychange', refresh);
    };
  }, [loadNotifications, mode]);

  const markRead = async (id: string): Promise<boolean> => {
    setBusyId(id);
    try {
      const response = mode === 'admin'
        ? await fetch('/api/admin/notifications/read', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
          })
        : await fetch('/api/client/notifications/read', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ trackingTokens, id })
          });
      if (!response.ok) {
        setErrorMessage(isAr ? 'تعذر تعليم الإشعار كمقروء.' : 'Could not mark notification as read.');
        return false;
      }
      setErrorMessage(null);
      await loadNotifications();
      return true;
    } catch {
      setErrorMessage(isAr ? 'تعذر الاتصال بالخادم لتحديث الإشعار.' : 'Could not reach the server to update the notification.');
      return false;
    } finally {
      setBusyId(null);
    }
  };

  const markAllRead = async () => {
    setBusyId('all');
    try {
      const response = mode === 'admin'
        ? await fetch('/api/admin/notifications/read-all', {
            method: 'POST',
            credentials: 'include'
          })
        : await fetch('/api/client/notifications/read-all', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ trackingTokens })
          });
      if (!response.ok) {
        setErrorMessage(isAr ? 'تعذر تعليم الإشعارات كمقروءة.' : 'Could not mark notifications as read.');
        return;
      }
      setErrorMessage(null);
      await loadNotifications();
    } catch {
      setErrorMessage(isAr ? 'تعذر الاتصال بالخادم لتحديث الإشعارات.' : 'Could not reach the server to update notifications.');
    } finally {
      setBusyId(null);
    }
  };

  const openNotification = async (item: NotificationItem) => {
    if (!item.readAt) {
      const marked = await markRead(item.id);
      if (!marked) return;
    }
    setIsOpen(false);

    if (mode === 'client' && item.entityType === 'contact_request' && item.entityId) {
      const tokens = readClientTrackingTokens();
      if (!tokens.length) {
        setErrorMessage(isAr ? 'رمز متابعة الطلب غير متوفر.' : 'The request tracking token is unavailable.');
        setIsOpen(true);
        return;
      }
      setSelectedRequest(null);
      setIsRequestLoading(true);
      try {
        const response = await fetch('/api/client/request-details', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ trackingTokens: tokens, requestId: item.entityId })
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error('Request details unavailable');
        setSelectedRequest(data.request as ClientRequestDetails);
        setErrorMessage(null);
      } catch {
        setErrorMessage(isAr
          ? 'تعذر تحميل تفاصيل الطلب. تحقق من الاتصال وحاول مرة أخرى.'
          : 'Unable to load request details. Check your connection and try again.');
        setIsOpen(true);
      } finally {
        setIsRequestLoading(false);
      }
      return;
    }

    const target = item.targetUrl || '';
    if (target === '#contact' || target === '#projects' || target === '#services') {
      const element = document.getElementById(target.slice(1));
      element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (target.includes('#contacts') && mode === 'admin') {
      window.dispatchEvent(new CustomEvent('emicode-admin-navigate', { detail: 'contacts' }));
    }
  };

  if (mode === 'client' && trackingTokens.length === 0) return null;

  const title = mode === 'admin'
    ? (isAr ? 'إشعارات الإدارة والمبرمج' : 'Admin & developer notifications')
    : (isAr ? 'إشعارات طلبك' : 'Your request notifications');

  const wrapperClass = mode === 'client'
    ? 'fixed bottom-6 end-6 z-40'
    : 'relative shrink-0';

  return (
    <div className={wrapperClass} dir={isAr ? 'rtl' : 'ltr'}>
      <button
        type="button"
        onClick={() => {
          setIsOpen((open) => !open);
          if (!isOpen) void loadNotifications();
        }}
        aria-label={title}
        aria-expanded={isOpen}
        className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-300 bg-white text-slate-700 shadow-lg transition hover:border-cyan-400 hover:text-cyan-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:text-cyan-300"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 min-w-5 rounded-full bg-rose-500 px-1 text-center text-[10px] font-black leading-5 text-white">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {toast && (
        <div role="status" className={`absolute ${mode === 'client' ? 'bottom-14 end-0' : 'top-12 end-0'} z-[80] w-[min(80vw,320px)] rounded-xl border border-cyan-700/60 bg-slate-900 px-4 py-3 text-xs font-semibold text-white shadow-xl`}>
          {isAr ? `إشعار جديد: ${toast}` : `New notification: ${toast}`}
        </div>
      )}

      {isOpen && (
        <div className={`absolute ${mode === 'client' ? 'bottom-12 end-0' : 'top-12 end-0'} z-[70] flex max-h-[min(70vh,520px)] w-[min(90vw,380px)] flex-col overflow-hidden rounded-2xl border border-slate-700 bg-slate-950 text-white shadow-2xl`}>
          <div className="flex items-center justify-between gap-3 border-b border-slate-800 px-4 py-3">
            <div>
              <p className="text-sm font-bold">{title}</p>
              <p className="mt-0.5 text-[11px] text-slate-400">
                {isAr ? `${unreadCount} غير مقروء` : `${unreadCount} unread`}
              </p>
            </div>
            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={() => void markAllRead()}
                  disabled={busyId === 'all'}
                  title={isAr ? 'تعليم الكل كمقروء' : 'Mark all as read'}
                  className="rounded-lg p-2 text-slate-300 hover:bg-slate-800 hover:text-cyan-300 disabled:opacity-50"
                >
                  {busyId === 'all' ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <CheckCheck className="h-4 w-4" />}
                </button>
              )}
              <button type="button" onClick={() => setIsOpen(false)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white" aria-label={isAr ? 'إغلاق' : 'Close'}>
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

{errorMessage && (
            <div role="alert" className="border-b border-rose-900/70 bg-rose-950/70 px-4 py-3 text-xs leading-5 text-rose-200">
              {errorMessage}
            </div>
          )}
          <div className="overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center gap-2 p-8 text-sm text-slate-400">
                <LoaderCircle className="h-4 w-4 animate-spin" />
                {isAr ? 'جارٍ تحميل الإشعارات...' : 'Loading notifications...'}
              </div>
            ) : items.length === 0 ? (
              <div className="p-8 text-center text-sm text-slate-400">
                <Bell className="mx-auto mb-2 h-6 w-6 opacity-50" />
                {isAr ? 'لا توجد إشعارات حتى الآن' : 'No notifications yet'}
              </div>
            ) : items.map((item) => (
              <button
                type="button"
                key={item.id}
                onClick={() => void openNotification(item)}
                className={`block w-full border-b border-slate-800/80 px-4 py-3 text-start transition hover:bg-slate-900 ${item.readAt ? 'opacity-70' : 'bg-cyan-950/20'}`}
              >
                <span className="flex items-start gap-2">
                  <span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${item.readAt ? 'bg-slate-600' : 'bg-cyan-400'}`} />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold leading-5">{item.title}</span>
                      {!item.readAt && <span className="shrink-0 text-cyan-400"><ExternalLink className="h-3.5 w-3.5" /></span>}
                    </span>
                    <span className="mt-1 block text-xs leading-5 text-slate-300">{item.message}</span>
                    <span className="mt-2 flex items-center gap-1 text-[10px] text-slate-500">
                      <Clock3 className="h-3 w-3" />
                      {new Date(item.createdAt).toLocaleString(isAr ? 'ar' : 'en')}
                      {item.readAt && <Check className="ms-1 h-3 w-3 text-emerald-400" />}
                    </span>
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {(isRequestLoading || selectedRequest) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label={isAr ? 'تفاصيل الطلب' : 'Request details'}>
          <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-700 bg-slate-950 text-white shadow-2xl">
            <div className="flex items-center justify-between gap-3 border-b border-slate-800 px-5 py-4">
              <div>
                <p className="text-sm font-bold">{isAr ? 'تفاصيل طلبك' : 'Your request details'}</p>
                <p className="mt-1 text-[11px] text-slate-400">{isAr ? 'معلومات محفوظة من طلبك في قاعدة البيانات' : 'Details saved with your request'}</p>
              </div>
              {!isRequestLoading && (
                <button type="button" onClick={() => setSelectedRequest(null)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white" aria-label={isAr ? 'إغلاق التفاصيل' : 'Close details'}>
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            {isRequestLoading ? (
              <div className="flex items-center justify-center gap-2 p-10 text-sm text-slate-300">
                <LoaderCircle className="h-5 w-5 animate-spin" />
                {isAr ? 'جارٍ تحميل تفاصيل الطلب...' : 'Loading request details...'}
              </div>
            ) : selectedRequest && (
              <div className="space-y-4 p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-[11px] text-slate-400">{isAr ? 'الخدمة المطلوبة' : 'Requested service'}</p>
                    <p className="mt-1 text-sm font-bold">{selectedRequest.serviceType}</p>
                  </div>
                  <span className="rounded-full border border-cyan-800 bg-cyan-950/70 px-3 py-1 text-xs font-semibold text-cyan-200">
                    {isAr
                      ? (requestStatusLabels[selectedRequest.status]?.ar || selectedRequest.status)
                      : (requestStatusLabels[selectedRequest.status]?.en || selectedRequest.status)}
                  </span>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
                  <p className="mb-2 text-[11px] font-semibold text-slate-400">{isAr ? 'تفاصيل الطلب المرسلة' : 'Submitted details'}</p>
                  <p className="whitespace-pre-wrap break-words text-sm leading-7 text-slate-200">{selectedRequest.message}</p>
                </div>
                <p className="text-[11px] text-slate-500">
                  {isAr ? 'تاريخ الإرسال: ' : 'Submitted: '}
                  {new Date(selectedRequest.createdAt).toLocaleString(isAr ? 'ar' : 'en')}
                </p>
                <button type="button" onClick={() => setSelectedRequest(null)} className="w-full rounded-xl bg-cyan-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-cyan-500">
                  {isAr ? 'إغلاق' : 'Close'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
