import React, { useEffect, useState } from 'react';

export interface CookieConsentValue {
  version: 1;
  necessary: true;
  analytics: boolean;
  updatedAt: string;
}

const STORAGE_KEY = 'rustylub_cookie_consent_v1';

function readConsent(): CookieConsentValue | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const value = JSON.parse(raw) as CookieConsentValue;
    if (value.version !== 1 || value.necessary !== true || typeof value.analytics !== 'boolean') return null;
    return value;
  } catch {
    return null;
  }
}

interface CookieConsentManagerProps {
  lang: 'ru' | 'en';
  settingsOpen: boolean;
  onSettingsClose: () => void;
}

export default function CookieConsentManager({ lang, settingsOpen, onSettingsClose }: CookieConsentManagerProps) {
  const ru = lang === 'ru';
  const [consent, setConsent] = useState<CookieConsentValue | null>(() => readConsent());
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    if (settingsOpen) {
      setShowSettings(true);
    }
  }, [settingsOpen]);

  const save = (allowAnalytics: boolean) => {
    const next: CookieConsentValue = {
      version: 1,
      necessary: true,
      analytics: allowAnalytics,
      updatedAt: new Date().toISOString()
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // The site remains usable when browser storage is disabled.
    }
    setConsent(next);
    setShowSettings(false);
    onSettingsClose();
  };

  const closeSettings = () => {
    setShowSettings(false);
    onSettingsClose();
  };

  return (
    <>
      {!consent && !showSettings && (
        <section
          aria-label={ru ? 'Настройки файлов cookie' : 'Cookie preferences'}
          className="fixed inset-x-3 bottom-3 z-[160] mx-auto max-w-4xl border border-[#394354] bg-[#0b1018]/[.98] p-4 shadow-[0_18px_70px_rgba(0,0,0,.65)] backdrop-blur-xl sm:inset-x-5 sm:bottom-5 sm:p-5"
          role="region"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-2xl">
              <p className="font-mono text-xs font-bold uppercase tracking-[.16em] text-[#f28a24]">RUSTY.LUB / {ru ? 'КОНФИДЕНЦИАЛЬНОСТЬ' : 'PRIVACY'}</p>
              <h2 className="mt-1 text-base font-bold text-white">{ru ? 'Настройки Cookies' : 'Cookie preferences'}</h2>
              <p className="mt-1 text-sm leading-relaxed text-slate-300">
                {ru
                  ? 'Сайт использует необходимые технологии для работы интерфейса и входа в аккаунт. Необязательная аналитика сейчас не подключена. Вы можете сохранить выбор или открыть подробные настройки.'
                  : 'The site uses essential technologies for the interface and account sign-in. Optional analytics is not currently enabled. You can save your choice or open detailed settings.'}
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-2">
              <button type="button" onClick={() => save(false)} className="min-h-10 border border-slate-500 px-3 py-2 text-xs font-bold text-white transition hover:border-white">
                {ru ? 'Только необходимые' : 'Essential only'}
              </button>
            </div>
          </div>
        </section>
      )}

      {showSettings && (
        <div className="fixed inset-0 z-[170] flex items-center justify-center bg-black/75 p-3 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="cookie-settings-title">
          <div className="w-full max-w-xl border border-[#394354] bg-[#0c111a] shadow-2xl">
            <div className="border-b border-white/10 p-5">
              <p className="font-mono text-[10px] font-bold uppercase tracking-[.18em] text-[#f28a24]">RUSTY.LUB / PRIVACY CONTROL</p>
              <h2 id="cookie-settings-title" className="mt-1 text-lg font-bold text-white">{ru ? 'Настройки Cookies' : 'Cookie settings'}</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                {ru ? 'Необязательные категории выключены по умолчанию. На данный момент аналитические и рекламные трекеры на сайте не обнаружены.' : 'Optional categories are off by default. No analytics or advertising trackers are currently identified on the site.'}
              </p>
            </div>
            <div className="space-y-3 p-5">
              <div className="flex items-start justify-between gap-4 border border-white/10 bg-white/[.03] p-4">
                <div>
                  <h3 className="text-sm font-bold text-white">{ru ? 'Необходимые технологии' : 'Essential technologies'}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-slate-400">{ru ? 'Настройки интерфейса, сохранение выбранного языка и поддержка авторизации. Отключить их в этом окне нельзя.' : 'Interface preferences, language selection and authentication support. These cannot be disabled here.'}</p>
                </div>
                <span className="shrink-0 text-xs font-bold text-emerald-400">{ru ? 'Всегда активны' : 'Always active'}</span>
              </div>
              <div className="border border-white/10 p-4">
                <h3 className="text-sm font-bold text-white">{ru ? 'Необязательная аналитика' : 'Optional analytics'}</h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-400">{ru ? 'Аналитические и рекламные сервисы сейчас не подключены. Поэтому необязательные аналитические технологии не используются и отдельный выбор для них недоступен.' : 'Analytics and advertising providers are not currently connected. Optional analytics technologies are therefore not used, and no separate opt-in is available.'}</p>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-500">{ru ? 'Вы можете изменить выбор позднее через ссылку «Настройки Cookies» внизу сайта. Сохранение выбора не включает сервисы, которые фактически не подключены.' : 'You can change your choice later using the “Cookie settings” link in the site footer. Saving a preference does not activate services that are not actually integrated.'}</p>
            </div>
            <div className="flex flex-col-reverse gap-2 border-t border-white/10 p-4 sm:flex-row sm:justify-end">
              <button type="button" onClick={closeSettings} className="min-h-10 border border-slate-700 px-4 py-2 text-xs font-bold text-slate-300 hover:text-white">{ru ? 'Закрыть' : 'Close'}</button>
              <button type="button" onClick={() => save(false)} className="min-h-10 border border-slate-500 px-4 py-2 text-xs font-bold text-white hover:border-white">{ru ? 'Отклонить необязательные' : 'Reject optional'}</button>
              <button type="button" onClick={() => save(false)} className="min-h-10 border border-[#d65a2c] bg-[#c94b2b] px-4 py-2 text-xs font-bold text-white hover:bg-[#e05b35]">{ru ? 'Сохранить настройки' : 'Save settings'}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
