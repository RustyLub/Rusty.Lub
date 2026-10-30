import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  X, Settings2, Monitor, Languages, BellRing, Keyboard, RefreshCw, Info,
  Check, ExternalLink, Gamepad2, ShieldCheck, Sparkles
} from 'lucide-react';
import { checkForAppUpdates } from '../services/appUpdater';

type AppSettingsSection = 'general' | 'appearance' | 'notifications' | 'shortcuts' | 'updates' | 'about';

interface AppSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'ru' | 'en';
  appTheme: 'dark' | 'light';
  version: string;
  isTauri: boolean;
  compactUi: boolean;
  reducedMotion: boolean;
  hudHotkey: string;
  onLanguageChange: (value: 'ru' | 'en') => void;
  onThemeChange: (value: 'dark' | 'light') => void;
  onCompactUiChange: (value: boolean) => void;
  onReducedMotionChange: (value: boolean) => void;
  onOpenNotifications: () => void;
  onOpenGameSettings: () => void;
  onToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

const sections: { id: AppSettingsSection; ru: string; en: string; icon: React.ReactNode }[] = [
  { id: 'general', ru: 'Общие', en: 'General', icon: <Settings2 size={16} /> },
  { id: 'appearance', ru: 'Внешний вид', en: 'Appearance', icon: <Monitor size={16} /> },
  { id: 'notifications', ru: 'Уведомления', en: 'Notifications', icon: <BellRing size={16} /> },
  { id: 'shortcuts', ru: 'Клавиши', en: 'Shortcuts', icon: <Keyboard size={16} /> },
  { id: 'updates', ru: 'Обновления', en: 'Updates', icon: <RefreshCw size={16} /> },
  { id: 'about', ru: 'О приложении', en: 'About', icon: <Info size={16} /> }
];

const Toggle = ({ checked, onChange, label, description }: {
  checked: boolean; onChange: (value: boolean) => void; label: string; description: string;
}) => (
  <button type="button" role="switch" aria-checked={checked} onClick={() => onChange(!checked)}
    className="flex w-full items-center justify-between gap-4 rounded-lg border border-white/10 bg-[#111720] px-4 py-3 text-left transition-colors hover:border-orange-500/40">
    <span className="min-w-0">
      <span className="block text-sm font-semibold text-slate-100">{label}</span>
      <span className="mt-1 block text-xs leading-relaxed text-slate-400">{description}</span>
    </span>
    <span className={`relative h-6 w-11 shrink-0 rounded-full border transition-colors ${checked ? 'border-orange-400/60 bg-orange-500' : 'border-slate-600 bg-slate-700'}`}>
      <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-5' : 'translate-x-0.5'}`} />
    </span>
  </button>
);

const SettingCard = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-xl border border-white/10 bg-[#111720] p-4">{children}</div>
);

export default function AppSettingsModal({
  isOpen, onClose, lang, appTheme, version, isTauri, compactUi, reducedMotion,
  hudHotkey, onLanguageChange, onThemeChange, onCompactUiChange, onReducedMotionChange,
  onOpenNotifications, onOpenGameSettings, onToast
}: AppSettingsModalProps) {
  const [activeSection, setActiveSection] = useState<AppSettingsSection>('general');
  const [checking, setChecking] = useState(false);
  const [updateStatus, setUpdateStatus] = useState('');
  const ru = lang === 'ru';
  const isLight = appTheme === 'light';

  const checkUpdates = async () => {
    setChecking(true);
    setUpdateStatus(ru ? 'Проверяем GitHub Releases…' : 'Checking GitHub Releases…');
    try {
      let latestStatus = '';
      const installed = await checkForAppUpdates((message) => {
        latestStatus = message;
        setUpdateStatus(message);
      });
      if (!latestStatus) {
        latestStatus = installed
          ? (ru ? 'Обновление установлено. Приложение перезапускается.' : 'Update installed. The app is restarting.')
          : (ru ? 'Проверка завершена.' : 'Check completed.');
      }
      setUpdateStatus(latestStatus);
      onToast(latestStatus, installed ? 'success' : 'info');
    } catch (error: any) {
      const message = error?.message || (ru ? 'Не удалось проверить обновления.' : 'Unable to check for updates.');
      setUpdateStatus(message);
      onToast(message, 'error');
    } finally {
      setChecking(false);
    }
  };

  if (!isOpen) return null;

  const title = sections.find(item => item.id === activeSection);
  const panelClass = isLight
    ? 'bg-[#f4f5f7] text-slate-900'
    : 'bg-[#0c1118] text-slate-100';

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[120] flex items-center justify-center bg-black/75 p-3 backdrop-blur-sm sm:p-6"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}
      >
        <motion.section
          role="dialog" aria-modal="true" aria-labelledby="app-settings-title"
          className={`flex h-[min(760px,92vh)] w-full max-w-[1040px] overflow-hidden rounded-2xl border shadow-2xl ${isLight ? 'border-slate-300 bg-white' : 'border-[#303a49] bg-[#0c1118]'}`}
          initial={{ opacity: 0, y: 18, scale: 0.985 }} animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.985 }} transition={{ duration: 0.18 }}
        >
          <aside className={`hidden w-[230px] shrink-0 flex-col border-r p-4 sm:flex ${isLight ? 'border-slate-200 bg-slate-50' : 'border-white/10 bg-[#090d13]'}`}>
            <div className="mb-7 flex items-center gap-3 px-1 pt-1">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-orange-500/40 bg-orange-500/10 text-orange-400">
                <Settings2 size={20} />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-black tracking-wide">RUSTY<span className="text-orange-500">.LUB</span></div>
                <div className="mt-0.5 text-[10px] uppercase tracking-[.18em] text-slate-500">{ru ? 'Параметры' : 'Preferences'}</div>
              </div>
            </div>
            <nav className="space-y-1" aria-label={ru ? 'Разделы настроек' : 'Settings sections'}>
              {sections.map(item => (
                <button key={item.id} type="button" onClick={() => setActiveSection(item.id)}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                    activeSection === item.id
                      ? 'border border-orange-500/25 bg-orange-500/10 text-orange-400'
                      : isLight ? 'text-slate-600 hover:bg-slate-200/70 hover:text-slate-950' : 'text-slate-400 hover:bg-white/5 hover:text-white'
                  }`}>
                  {item.icon}<span>{ru ? item.ru : item.en}</span>
                  {activeSection === item.id && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-orange-400" />}
                </button>
              ))}
            </nav>
            <div className="mt-auto rounded-lg border border-white/10 bg-black/10 p-3">
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                <ShieldCheck size={13} /> {ru ? 'Состояние приложения' : 'Application status'}
              </div>
              <p className="mt-2 text-[11px] leading-relaxed text-slate-500">
                {ru ? 'Настройки сохраняются на этом устройстве.' : 'Preferences are stored on this device.'}
              </p>
            </div>
          </aside>

          <div className="flex min-w-0 flex-1 flex-col">
            <header className={`flex min-h-[76px] items-center justify-between gap-4 border-b px-5 py-4 sm:px-7 ${isLight ? 'border-slate-200 bg-white' : 'border-white/10 bg-[#101720]'}`}>
              <div className="min-w-0">
                <div className="text-[10px] font-bold uppercase tracking-[.2em] text-orange-500">{ru ? 'НАСТРОЙКИ ПРИЛОЖЕНИЯ' : 'APPLICATION SETTINGS'}</div>
                <h2 id="app-settings-title" className="mt-1 text-xl font-bold">{ru ? title?.ru : title?.en}</h2>
              </div>
              <button type="button" onClick={onClose} aria-label={ru ? 'Закрыть настройки' : 'Close settings'}
                className={`rounded-lg border p-2 transition-colors ${isLight ? 'border-slate-200 text-slate-500 hover:bg-slate-100' : 'border-white/10 text-slate-400 hover:bg-white/10 hover:text-white'}`}>
                <X size={18} />
              </button>
            </header>

            <div className="flex gap-1 overflow-x-auto border-b border-white/10 px-3 py-2 sm:hidden">
              {sections.map(item => (
                <button key={item.id} type="button" onClick={() => setActiveSection(item.id)}
                  className={`flex shrink-0 items-center gap-1.5 rounded-md px-3 py-2 text-xs ${activeSection === item.id ? 'bg-orange-500/15 text-orange-400' : 'text-slate-400'}`}>
                  {item.icon}{ru ? item.ru : item.en}
                </button>
              ))}
            </div>

            <div className={`min-h-0 flex-1 overflow-y-auto p-5 sm:p-7 ${panelClass}`}>
              {activeSection === 'general' && (
                <div className="max-w-2xl space-y-5">
                  <div>
                    <h3 className="text-lg font-bold">{ru ? 'Основные параметры' : 'Basic preferences'}</h3>
                    <p className="mt-1 text-sm text-slate-400">{ru ? 'Язык интерфейса и быстрый доступ к параметрам игрового лаунчера.' : 'Interface language and quick access to game launcher configuration.'}</p>
                  </div>
                  <SettingCard>
                    <div className="mb-3 flex items-center gap-2 text-sm font-semibold"><Languages size={16} className="text-orange-400" />{ru ? 'Язык интерфейса' : 'Interface language'}</div>
                    <div className="grid grid-cols-2 gap-2">
                      <button type="button" onClick={() => onLanguageChange('ru')} className={`rounded-lg border px-4 py-3 text-sm font-bold ${lang === 'ru' ? 'border-orange-500 bg-orange-500/10 text-orange-500' : 'border-white/10 text-slate-400'}`}>Русский {lang === 'ru' && <Check size={14} className="ml-1 inline" />}</button>
                      <button type="button" onClick={() => onLanguageChange('en')} className={`rounded-lg border px-4 py-3 text-sm font-bold ${lang === 'en' ? 'border-orange-500 bg-orange-500/10 text-orange-500' : 'border-white/10 text-slate-400'}`}>English {lang === 'en' && <Check size={14} className="ml-1 inline" />}</button>
                    </div>
                  </SettingCard>
                  <SettingCard>
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-orange-500/10 p-2 text-orange-400"><Gamepad2 size={18} /></div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-semibold">{ru ? 'Настройки Rust и HUD' : 'Rust & HUD settings'}</div>
                        <p className="mt-1 text-xs text-slate-400">{ru ? 'Путь к RustClient.exe, аргументы запуска, серверы, оверлей и игровые оповещения.' : 'RustClient.exe path, launch arguments, servers, overlay and game alerts.'}</p>
                      </div>
                      <button type="button" onClick={onOpenGameSettings} className="shrink-0 rounded-lg border border-orange-500/40 px-3 py-2 text-xs font-bold text-orange-400 hover:bg-orange-500/10">{ru ? 'Открыть' : 'Open'}</button>
                    </div>
                  </SettingCard>
                  <SettingCard>
                    <div className="flex items-center gap-3">
                      <Sparkles size={18} className="text-orange-400" />
                      <div>
                        <div className="text-sm font-semibold">{ru ? 'Сохранение параметров' : 'Preference storage'}</div>
                        <p className="mt-1 text-xs text-slate-400">{ru ? 'Язык, тема и параметры отображения сохраняются локально и применяются при следующем запуске.' : 'Language, theme and display preferences are stored locally and restored on next launch.'}</p>
                      </div>
                    </div>
                  </SettingCard>
                </div>
              )}

              {activeSection === 'appearance' && (
                <div className="max-w-2xl space-y-5">
                  <div><h3 className="text-lg font-bold">{ru ? 'Оформление рабочего пространства' : 'Workspace appearance'}</h3><p className="mt-1 text-sm text-slate-400">{ru ? 'Industrial Steel — тёмная сталь, графитовые панели и тактические оранжевые акценты.' : 'Industrial Steel — dark steel, graphite panels and tactical orange accents.'}</p></div>
                  <SettingCard>
                    <div className="mb-3 text-sm font-semibold">{ru ? 'Цветовая тема' : 'Colour theme'}</div>
                    <div className="grid grid-cols-2 gap-3">
                      <button type="button" onClick={() => onThemeChange('dark')} className={`rounded-xl border p-3 text-left ${appTheme === 'dark' ? 'border-orange-500 ring-1 ring-orange-500/30' : 'border-white/10'}`}>
                        <div className="mb-3 h-14 rounded-lg border border-white/10 bg-[#0b1119] p-2"><div className="h-2 w-1/2 rounded bg-orange-500" /><div className="mt-2 h-5 rounded bg-[#1b2633]" /></div>
                        <span className="text-sm font-semibold">{ru ? 'Тёмная' : 'Dark'}</span>{appTheme === 'dark' && <Check size={14} className="ml-2 inline text-orange-400" />}
                      </button>
                      <button type="button" onClick={() => onThemeChange('light')} className={`rounded-xl border p-3 text-left ${appTheme === 'light' ? 'border-orange-500 ring-1 ring-orange-500/30' : 'border-white/10'}`}>
                        <div className="mb-3 h-14 rounded-lg border border-slate-200 bg-slate-100 p-2"><div className="h-2 w-1/2 rounded bg-orange-500" /><div className="mt-2 h-5 rounded bg-white" /></div>
                        <span className="text-sm font-semibold">{ru ? 'Светлая' : 'Light'}</span>{appTheme === 'light' && <Check size={14} className="ml-2 inline text-orange-400" />}
                      </button>
                    </div>
                  </SettingCard>
                  <Toggle checked={compactUi} onChange={onCompactUiChange} label={ru ? 'Компактный интерфейс' : 'Compact interface'} description={ru ? 'Уменьшает вертикальные отступы, чтобы на экране помещалось больше инструментов.' : 'Reduces vertical spacing so more tools fit in the window.'} />
                  <Toggle checked={reducedMotion} onChange={onReducedMotionChange} label={ru ? 'Уменьшить анимацию' : 'Reduce motion'} description={ru ? 'Отключает декоративные CSS-анимации и плавные переходы интерфейса.' : 'Disables decorative CSS animations and interface transitions.'} />
                </div>
              )}

              {activeSection === 'notifications' && (
                <div className="max-w-2xl space-y-5">
                  <div><h3 className="text-lg font-bold">{ru ? 'Центр уведомлений' : 'Notification centre'}</h3><p className="mt-1 text-sm text-slate-400">{ru ? 'Управляйте уведомлениями о вайпах, Rust+, новостях и таймерах в отдельной панели.' : 'Manage wipe, Rust+, news and timer notifications in the dedicated notification panel.'}</p></div>
                  <SettingCard>
                    <div className="flex items-start gap-3">
                      <div className="rounded-lg bg-orange-500/10 p-2 text-orange-400"><BellRing size={20} /></div>
                      <div className="min-w-0 flex-1"><div className="font-semibold">{ru ? 'Каналы и тестирование' : 'Channels & testing'}</div><p className="mt-1 text-xs text-slate-400">{ru ? 'Настройка типов оповещений, разрешений и тестовых сигналов.' : 'Configure alert types, permissions and test notifications.'}</p></div>
                    </div>
                    <button type="button" onClick={onOpenNotifications} className="mt-4 rounded-lg bg-orange-500 px-4 py-2.5 text-xs font-black uppercase tracking-wide text-white hover:bg-orange-400">{ru ? 'Открыть настройки уведомлений' : 'Open notification settings'}</button>
                  </SettingCard>
                  <p className="text-xs leading-relaxed text-slate-500">{ru ? 'Разрешение Windows или WebView может дополнительно потребовать подтверждения системой.' : 'Windows or WebView may separately ask you to grant notification permission.'}</p>
                </div>
              )}

              {activeSection === 'shortcuts' && (
                <div className="max-w-2xl space-y-5">
                  <div><h3 className="text-lg font-bold">{ru ? 'Горячие клавиши' : 'Keyboard shortcuts'}</h3><p className="mt-1 text-sm text-slate-400">{ru ? 'Быстрые команды для навигации по Rusty.Lub Desktop.' : 'Quick commands for navigating Rusty.Lub Desktop.'}</p></div>
                  {[
                    { keys: 'Ctrl + K', label: ru ? 'Открыть быстрый поиск и команды' : 'Open quick search and commands' },
                    { keys: 'M', label: ru ? 'Открыть каталог разделов' : 'Open sections catalogue' },
                    { keys: '/', label: ru ? 'Вызвать поиск' : 'Open search' },
                    { keys: hudHotkey || 'Alt + O', label: ru ? 'Переключить HUD-оверлей' : 'Toggle HUD overlay' }
                  ].map(item => <div key={item.keys} className="flex items-center justify-between gap-4 rounded-lg border border-white/10 bg-[#111720] px-4 py-3"><span className="text-sm text-slate-300">{item.label}</span><kbd className="shrink-0 rounded-md border border-slate-600 bg-[#080c12] px-2.5 py-1.5 font-mono text-xs font-bold text-orange-400">{item.keys}</kbd></div>)}
                  <p className="text-xs text-slate-500">{ru ? 'Горячие клавиши работают, когда окно приложения активно. HUD также может регистрировать глобальную комбинацию через настройки лаунчера.' : 'Shortcuts work while the app window is focused. HUD can also register a global shortcut in launcher settings.'}</p>
                </div>
              )}

              {activeSection === 'updates' && (
                <div className="max-w-2xl space-y-5">
                  <div><h3 className="text-lg font-bold">{ru ? 'Обновление приложения' : 'Application updates'}</h3><p className="mt-1 text-sm text-slate-400">{ru ? 'Проверка новых сборок Windows Desktop Edition через GitHub Releases.' : 'Check for new Windows Desktop Edition builds through GitHub Releases.'}</p></div>
                  <SettingCard>
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-orange-500/10 p-3 text-orange-400"><RefreshCw size={20} /></div>
                      <div className="min-w-0 flex-1"><div className="font-semibold">{ru ? 'Текущая версия' : 'Current version'}</div><div className="mt-1 font-mono text-sm text-orange-400">Rusty.Lub {version}</div></div>
                      <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold uppercase text-emerald-400">{ru ? 'Desktop' : 'Desktop'}</span>
                    </div>
                    <button type="button" onClick={checkUpdates} disabled={checking || !isTauri} className="mt-5 flex items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 py-3 text-xs font-black uppercase tracking-wide text-white transition-colors hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-50">
                      <RefreshCw size={14} className={checking ? 'animate-spin' : ''} />{checking ? (ru ? 'Проверка…' : 'Checking…') : (ru ? 'Проверить обновления' : 'Check for updates')}
                    </button>
                    {!isTauri && <p className="mt-3 text-xs text-amber-400">{ru ? 'Проверка установленных обновлений доступна только в Windows-приложении.' : 'Installed-app updates can only be checked in the Windows app.'}</p>}
                    {updateStatus && <p role="status" className="mt-3 break-words text-xs leading-relaxed text-slate-400">{updateStatus}</p>}
                  </SettingCard>
                  <p className="text-xs text-slate-500">{ru ? 'При обнаружении подписанного обновления оно будет загружено и установлено штатным механизмом Tauri Updater.' : 'When a signed update is available, it is downloaded and installed through the Tauri Updater.'}</p>
                </div>
              )}

              {activeSection === 'about' && (
                <div className="max-w-2xl space-y-5">
                  <div className="flex items-center gap-4 rounded-xl border border-orange-500/20 bg-gradient-to-r from-orange-500/10 to-transparent p-5">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-orange-500/40 bg-[#101720] text-xl font-black text-orange-400">RL</div>
                    <div><h3 className="text-xl font-black tracking-wide">RUSTY.LUB</h3><p className="mt-1 text-xs uppercase tracking-[.18em] text-orange-400">{ru ? 'Windows Desktop Edition' : 'Windows Desktop Edition'}</p><p className="mt-1 text-xs text-slate-400">{ru ? 'Инструменты и база знаний для игроков Rust.' : 'Tools and knowledge base for Rust players.'}</p></div>
                  </div>
                  <SettingCard>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between gap-4"><span className="text-slate-400">{ru ? 'Версия интерфейса' : 'Interface version'}</span><span className="font-mono font-bold">{version}</span></div>
                      <div className="flex justify-between gap-4"><span className="text-slate-400">{ru ? 'Платформа' : 'Platform'}</span><span className="font-semibold">{isTauri ? 'Windows x64 · Tauri 2' : (ru ? 'Предпросмотр браузера' : 'Browser preview')}</span></div>
                      <div className="flex justify-between gap-4"><span className="text-slate-400">{ru ? 'Дизайн-система' : 'Design system'}</span><span className="font-semibold">Industrial Steel</span></div>
                      <div className="flex justify-between gap-4"><span className="text-slate-400">{ru ? 'Основной сайт' : 'Website'}</span><a className="text-orange-400 hover:underline" href="https://rusty-lub.ru/" target="_blank" rel="noreferrer">rusty-lub.ru <ExternalLink size={12} className="inline" /></a></div>
                    </div>
                  </SettingCard>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <a href="https://github.com/RustyLub/Rusty.Lub" target="_blank" rel="noreferrer" className="rounded-lg border border-white/10 bg-[#111720] p-4 text-sm font-semibold hover:border-orange-500/40"><span className="block">GitHub <ExternalLink size={12} className="inline" /></span><span className="mt-1 block text-xs font-normal text-slate-500">{ru ? 'Исходный код проекта' : 'Project source code'}</span></a>
                    <a href="https://discord.gg/R2TyKZ9xvZ" target="_blank" rel="noreferrer" className="rounded-lg border border-white/10 bg-[#111720] p-4 text-sm font-semibold hover:border-orange-500/40"><span className="block">Discord <ExternalLink size={12} className="inline" /></span><span className="mt-1 block text-xs font-normal text-slate-500">{ru ? 'Сообщество и поддержка' : 'Community and support'}</span></a>
                    <a href="mailto:rusty.lub_offers@bk.ru" className="rounded-lg border border-white/10 bg-[#111720] p-4 text-sm font-semibold hover:border-orange-500/40"><span className="block">{ru ? 'Связаться с разработчиком' : 'Contact developer'}</span><span className="mt-1 block text-xs font-normal text-slate-500">rusty.lub_offers@bk.ru</span></a>
                    <button type="button" onClick={onOpenGameSettings} className="rounded-lg border border-white/10 bg-[#111720] p-4 text-left text-sm font-semibold hover:border-orange-500/40"><span className="block">{ru ? 'Параметры игрового клиента' : 'Game client settings'}</span><span className="mt-1 block text-xs font-normal text-slate-500">{ru ? 'Rust, серверы и HUD' : 'Rust, servers and HUD'}</span></button>
                  </div>
                  <p className="text-[11px] leading-relaxed text-slate-500">© 2026 Rusty.Lub. Rust is a trademark of Facepunch Studios Ltd. Rusty.Lub is an independent community project.</p>
                </div>
              )}
            </div>

            <footer className={`flex items-center justify-between gap-3 border-t px-5 py-3 text-[11px] ${isLight ? 'border-slate-200 bg-white text-slate-500' : 'border-white/10 bg-[#090d13] text-slate-500'}`}>
              <span>RUSTY.LUB DESKTOP <span className="text-orange-500">/</span> {version}</span>
              <button type="button" onClick={onClose} className="rounded-md border border-white/10 px-3 py-1.5 font-semibold hover:border-orange-500/40 hover:text-orange-400">{ru ? 'Готово' : 'Done'}</button>
            </footer>
          </div>
        </motion.section>
      </motion.div>
    </AnimatePresence>
  );
}
