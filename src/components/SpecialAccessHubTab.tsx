import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldAlert, 
  Lock, 
  Crown, 
  Shield, 
  Activity, 
  Smartphone, 
  Image as ImageIcon, 
  ShieldCheck, 
  KeyRound, 
  User, 
  LogIn, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  Monitor, 
  Download, 
  Bell, 
  Cpu, 
  HardDrive, 
  ExternalLink,
  ChevronRight,
  Radio,
  Zap,
  Terminal,
  FileCode,
  RefreshCw
} from 'lucide-react';
import { CustomUser } from '../types';
import { PlayerRadar } from './Radar/PlayerRadar';
import RustPlusTab from './RustPlusTab';
import RustItemIconsTab from './RustItemIconsTab';
import AdminTab from './AdminTab';
import SpecialAccessGated from './SpecialAccessGated';
import { getAvatarUrl } from '../customAvatars';

interface SpecialAccessHubTabProps {
  lang: 'ru' | 'en';
  currentUser?: CustomUser | null;
  appTheme: 'light' | 'dark';
  isVip: boolean;
  isOwner: boolean;
  isAdmin: boolean;
  onOpenAuth: () => void;
  onOpenCabinet: () => void;
  onNavigateTab: (tab: string) => void;
  onToast: (msg: string, type: 'success' | 'error' | 'info') => void;
  onOpenNotifications: () => void;
  onOpenConfigExporter: () => void;
}

export const SpecialAccessHubTab: React.FC<SpecialAccessHubTabProps> = ({
  lang,
  currentUser,
  appTheme,
  isVip,
  isOwner,
  isAdmin,
  onOpenAuth,
  onOpenCabinet,
  onNavigateTab,
  onToast,
  onOpenNotifications,
  onOpenConfigExporter
}) => {
  const isLight = appTheme === 'light';
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'radar' | 'rustplus' | 'icons' | 'admin' | 'windows-features'>('overview');

  const modules = [
    {
      id: 'radar',
      titleRu: 'PLAYER RADAR (VIP)',
      titleEn: 'PLAYER RADAR (VIP)',
      requiredRole: 'vip' as const,
      isAuthorized: isVip,
      icon: <Activity className="text-rose-500" size={24} />,
      badgeColor: 'bg-rose-500/10 text-rose-500 border-rose-500/30',
      descRu: 'Тактический радар игроков, мониторинг дисконнектов, история активных сессий и вычисление близости вражеских кланов.',
      descEn: 'Tactical player radar, disconnect monitoring, active session logs, and enemy proximity calculation.'
    },
    {
      id: 'rustplus',
      titleRu: 'RUST+ BOT HUB (OWNER)',
      titleEn: 'RUST+ BOT HUB (OWNER)',
      requiredRole: 'owner' as const,
      isAuthorized: isOwner || isAdmin,
      icon: <Smartphone className="text-amber-500" size={24} />,
      badgeColor: 'bg-amber-500/10 text-amber-500 border-amber-500/30',
      descRu: 'Управление умными турелями, автоматическая сирена рейда, пейджер рейда и контроллеры электросетей базы.',
      descEn: 'Smart turret control, automated raid alarm, raid pager, and base electrical network controllers.'
    },
    {
      id: 'icons',
      titleRu: 'ИКОНКИ RUST & СПРАЙТЫ (ADMIN)',
      titleEn: 'RUST ICONS & SPRITE LIBRARY (ADMIN)',
      requiredRole: 'admin' as const,
      isAuthorized: isAdmin,
      icon: <ImageIcon className="text-emerald-500" size={24} />,
      badgeColor: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30',
      descRu: 'Библиотека оригинальных ассетов Facepunch, генерация прозрачных PNG и экспорт ассетов предмета.',
      descEn: 'Facepunch official item asset library, transparent PNG generation, and item sprite exporter.'
    },
    {
      id: 'admin',
      titleRu: 'ПАНЕЛЬ АДМИНИСТРАТОРА (ADMIN)',
      titleEn: 'ADMIN CONTROL PANEL (ADMIN)',
      requiredRole: 'admin' as const,
      isAuthorized: isAdmin,
      icon: <ShieldCheck className="text-purple-500" size={24} />,
      badgeColor: 'bg-purple-500/10 text-purple-500 border-purple-500/30',
      descRu: 'Управление пользователями, модерация глобального чата, вещание объявление и аудит действий.',
      descEn: 'User role management, global chat moderation, site announcement broadcasts, and activity logs.'
    }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-6 space-y-8">
      {/* Page Header */}
      <div className={`p-6 sm:p-8 rounded-2xl border relative overflow-hidden shadow-xl ${
        isLight
          ? 'bg-white border-neutral-200/90 shadow-[0_4px_25px_rgba(0,0,0,0.04)]'
          : 'bg-[#0d1017]/95 border-[#1e2637] shadow-[0_8px_30px_rgba(0,0,0,0.6)]'
      }`}>
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase font-mono bg-red-600 text-white shadow-sm">
              <ShieldAlert size={14} />
              <span>{lang === 'ru' ? 'СЕКЦИЯ ВЫСОКОГО ДОСТУПА' : 'HIGH SECURITY ACCESS ZONE'}</span>
            </div>
            <h1 className={`text-3xl sm:text-4xl font-black uppercase tracking-tight font-teko ${
              isLight ? 'text-neutral-900' : 'text-[#eef2f7]'
            }`}>
              {lang === 'ru' ? 'ОСОБЫЙ ДОСТУП RUSTY.LUB' : 'RUSTY.LUB SPECIAL ACCESS HUB'}
            </h1>
            <p className={`text-xs sm:text-sm max-w-2xl leading-relaxed ${
              isLight ? 'text-neutral-600' : 'text-[#8b95a8]'
            }`}>
              {lang === 'ru'
                ? 'Централизованный хаб закрытых разделов, требующих верификации привилегий (VIP, Owner, Admin). Каждый доступ логируется системой безопасности.'
                : 'Centralized hub for restricted modules requiring privilege verification (VIP, Owner, Admin). All access requests are logged.'}
            </p>
          </div>

          {/* User Auth Card Summary */}
          <div className={`p-4 rounded-xl border shrink-0 min-w-[280px] ${
            isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-[#141822] border-[#222b3d]'
          }`}>
            <div className="text-[10px] font-mono font-bold uppercase text-red-500 mb-2 flex items-center justify-between">
              <span>{lang === 'ru' ? 'СТАТУС АВТОРИЗАЦИИ' : 'AUTH PRIVILEGE STATUS'}</span>
              <KeyRound size={12} />
            </div>

            {currentUser ? (
              <div className="flex items-center gap-3">
                <img referrerPolicy="no-referrer" 
                  src={getAvatarUrl(currentUser.photoURL, currentUser.avatarClass)} 
                  alt={currentUser.displayName} 
                  className="w-10 h-10 rounded-full object-cover border-2 border-red-500/50 bg-black shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className={`text-sm font-bold font-mono truncate ${
                    isLight ? 'text-neutral-900' : 'text-[#eef2f7]'
                  }`}>
                    {currentUser.displayName}
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-bold uppercase ${
                      isAdmin ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                      isOwner ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                      isVip ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                      'bg-neutral-500/20 text-neutral-400 border border-neutral-500/30'
                    }`}>
                      {currentUser.uid === 'serustqs' ? '👑 OWNER' : (currentUser.role || 'USER')}
                    </span>
                    {isVip && (
                      <span className="text-[10px] text-amber-500 font-bold flex items-center gap-0.5">
                        <Crown size={10} /> VIP
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="text-xs text-neutral-400">
                  {lang === 'ru' ? 'Вы вошли как Гость. Авторизуйтесь для проверки доступа.' : 'Logged in as Guest. Please authenticate.'}
                </div>
                <button
                  onClick={onOpenAuth}
                  className="w-full py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <LogIn size={13} />
                  <span>{lang === 'ru' ? 'Войти в аккаунт' : 'Log In'}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Tabs Bar inside Special Access Hub */}
        <div className="flex items-center gap-2 mt-6 pt-6 border-t border-neutral-700/30 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveSubTab('overview')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shrink-0 border ${
              activeSubTab === 'overview'
                ? 'bg-red-600 text-white border-red-600 shadow-md'
                : isLight
                  ? 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700 border-neutral-200'
                  : 'bg-[#141822] hover:bg-[#1a212f] text-[#8b95a8] hover:text-[#eef2f7] border-[#222b3d]'
            }`}
          >
            {lang === 'ru' ? 'Обзор Всех Модулей' : 'All Modules Overview'}
          </button>

          {modules.map((mod) => (
            <button
              key={mod.id}
              onClick={() => setActiveSubTab(mod.id as any)}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shrink-0 border flex items-center gap-1.5 ${
                activeSubTab === mod.id
                  ? 'bg-red-600 text-white border-red-600 shadow-md'
                  : isLight
                    ? 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700 border-neutral-200'
                    : 'bg-[#141822] hover:bg-[#1a212f] text-[#8b95a8] hover:text-[#eef2f7] border-[#222b3d]'
              }`}
            >
              {!mod.isAuthorized && <Lock size={12} className="text-amber-500" />}
              <span>{lang === 'ru' ? mod.titleRu : mod.titleEn}</span>
            </button>
          ))}

          <button
            onClick={() => setActiveSubTab('windows-features')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shrink-0 border flex items-center gap-1.5 ${
              activeSubTab === 'windows-features'
                ? 'bg-red-600 text-white border-red-600 shadow-md'
                : isLight
                  ? 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700 border-neutral-200'
                  : 'bg-[#141822] hover:bg-[#1a212f] text-[#8b95a8] hover:text-[#eef2f7] border-[#222b3d]'
            }`}
          >
            <Monitor size={13} className="text-sky-400" />
            <span>{lang === 'ru' ? 'Фишки Windows (Tauri 2)' : 'Windows Features (Tauri 2)'}</span>
          </button>
        </div>
      </div>

      {/* Main Content Area based on sub-tab */}
      {activeSubTab === 'overview' && (
        <div className="space-y-8">
          {/* Modules Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {modules.map((mod) => (
              <div
                key={mod.id}
                className={`p-6 rounded-2xl border transition-all relative overflow-hidden flex flex-col justify-between ${
                  isLight
                    ? 'bg-white border-neutral-200 hover:shadow-lg'
                    : 'bg-[#0e121a]/95 border-[#1e2637] hover:border-red-500/40 shadow-xl'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-xl bg-black/30 border border-white/10 shrink-0">
                      {mod.icon}
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase border ${mod.badgeColor}`}>
                      {mod.requiredRole.toUpperCase()} REQUIRED
                    </span>
                  </div>

                  <div>
                    <h3 className={`text-xl font-bold uppercase tracking-tight font-teko ${
                      isLight ? 'text-neutral-900' : 'text-[#eef2f7]'
                    }`}>
                      {lang === 'ru' ? mod.titleRu : mod.titleEn}
                    </h3>
                    <p className={`text-xs mt-1 leading-relaxed ${
                      isLight ? 'text-neutral-600' : 'text-[#8b95a8]'
                    }`}>
                      {lang === 'ru' ? mod.descRu : mod.descEn}
                    </p>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-neutral-800/40 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {mod.isAuthorized ? (
                      <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-500 font-mono">
                        <CheckCircle2 size={14} />
                        <span>{lang === 'ru' ? 'ДОСТУП РАЗРЕШЕН' : 'ACCESS GRANTED'}</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-xs font-bold text-amber-500 font-mono">
                        <Lock size={14} />
                        <span>{lang === 'ru' ? 'ТРЕБУЕТСЯ РОЛЬ' : 'RESTRICTED'}</span>
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => setActiveSubTab(mod.id as any)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
                      mod.isAuthorized
                        ? 'bg-red-600 hover:bg-red-700 text-white shadow-md'
                        : 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border border-amber-500/30'
                    }`}
                  >
                    <span>{mod.isAuthorized ? (lang === 'ru' ? 'Открыть модуль' : 'Launch Module') : (lang === 'ru' ? 'Проверить доступ' : 'Check Access')}</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Windows Desktop Integration Banner */}
          <div className={`p-6 rounded-2xl border relative overflow-hidden ${
            isLight ? 'bg-neutral-100 border-neutral-300' : 'bg-[#10141d] border-[#1e2637]'
          }`}>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center justify-center shrink-0">
                  <Monitor size={24} />
                </div>
                <div>
                  <h4 className={`text-base font-bold uppercase tracking-wide font-teko ${
                    isLight ? 'text-neutral-900' : 'text-[#eef2f7]'
                  }`}>
                    {lang === 'ru' ? 'Рекомендации для Windows Приложения на Tauri 2' : 'Windows Tauri 2 Desktop App Enhancements'}
                  </h4>
                  <p className={`text-xs ${isLight ? 'text-neutral-600' : 'text-[#8b95a8]'}`}>
                    {lang === 'ru' 
                      ? 'Узнайте о встроенных системных возможностях: оверлей, автообновления, уведомления и экспорт файлов.'
                      : 'Explore native Windows integration capabilities: overlay, auto-updates, tray alerts, and config exports.'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveSubTab('windows-features')}
                className="px-4 py-2.5 bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 text-sky-400 font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shrink-0"
              >
                {lang === 'ru' ? 'Смотреть фишки Windows' : 'View Windows Features'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Embedded Sub-module Views */}
      {activeSubTab === 'radar' && (
        <div>
          {isVip ? (
            <PlayerRadar />
          ) : (
            <SpecialAccessGated
              moduleTitle="PLAYER RADAR (VIP)"
              moduleIcon="rf_pager"
              requiredRole="vip"
              currentUser={currentUser}
              lang={lang}
              appTheme={appTheme}
              onOpenAuth={onOpenAuth}
              onOpenVip={onOpenCabinet}
              onGoHome={() => setActiveSubTab('overview')}
            />
          )}
        </div>
      )}

      {activeSubTab === 'rustplus' && (
        <div>
          {currentUser && (isOwner || isAdmin) ? (
            <RustPlusTab
              lang={lang}
              currentUser={currentUser}
              isAdmin={isAdmin}
              onOpenNotifications={onOpenNotifications}
              onToast={onToast}
            />
          ) : (
            <SpecialAccessGated
              moduleTitle="Rust+ Bot Hub (OWNER)"
              moduleIcon="smart.alarm"
              requiredRole="owner"
              currentUser={currentUser}
              lang={lang}
              appTheme={appTheme}
              onOpenAuth={onOpenAuth}
              onOpenVip={onOpenCabinet}
              onGoHome={() => setActiveSubTab('overview')}
            />
          )}
        </div>
      )}

      {activeSubTab === 'icons' && (
        <div>
          {currentUser && isAdmin ? (
            <RustItemIconsTab lang={lang} />
          ) : (
            <SpecialAccessGated
              moduleTitle="Rust Item Icons & Sprite Library (ADMIN)"
              moduleIcon="spraycan"
              requiredRole="admin"
              currentUser={currentUser}
              lang={lang}
              appTheme={appTheme}
              onOpenAuth={onOpenAuth}
              onOpenVip={onOpenCabinet}
              onGoHome={() => setActiveSubTab('overview')}
            />
          )}
        </div>
      )}

      {activeSubTab === 'admin' && (
        <div>
          {currentUser && isAdmin ? (
            <AdminTab lang={lang} currentUser={currentUser} onToast={onToast} />
          ) : (
            <SpecialAccessGated
              moduleTitle="Administrator Control Panel (ADMIN)"
              moduleIcon="keycard_red"
              requiredRole="admin"
              currentUser={currentUser}
              lang={lang}
              appTheme={appTheme}
              onOpenAuth={onOpenAuth}
              onOpenVip={onOpenCabinet}
              onGoHome={() => setActiveSubTab('overview')}
            />
          )}
        </div>
      )}

      {/* Windows App Features Section */}
      {activeSubTab === 'windows-features' && (
        <div className="space-y-6">
          <div className={`p-6 rounded-2xl border ${
            isLight ? 'bg-white border-neutral-200' : 'bg-[#0d1017] border-[#1e2637]'
          }`}>
            <h2 className="text-2xl font-black uppercase font-teko text-red-500 mb-2">
              {lang === 'ru' ? '🖥️ ВОЗМОЖНОСТИ НАСТОЛЬНОГО ПРИЛОЖЕНИЯ WINDOWS (TAURI 2)' : '🖥️ WINDOWS TAURI 2 DESKTOP CAPABILITIES'}
            </h2>
            <p className={`text-xs sm:text-sm leading-relaxed mb-6 ${isLight ? 'text-neutral-600' : 'text-[#8b95a8]'}`}>
              {lang === 'ru'
                ? 'Для наилучшего игрового опыта Rust настольное приложение Rusty.Lub снабжено официальным плагином Tauri 2 Updater, кастомным заголовком окна и интеграциями.'
                : 'For optimal Rust gameplay, Rusty.Lub desktop application includes official Tauri 2 Updater, custom titlebar, and native OS integrations.'}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Feature 1: Updater */}
              <div className={`p-4 rounded-xl border space-y-2 ${
                isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-[#131822] border-[#202838]'
              }`}>
                <div className="flex items-center gap-2 text-red-500 font-bold text-sm">
                  <RefreshCw size={16} />
                  <span>Auto-Updater (Tauri 2)</span>
                </div>
                <p className={`text-xs ${isLight ? 'text-neutral-600' : 'text-[#8b95a8]'}`}>
                  {lang === 'ru'
                    ? 'Автоматический поиск обновлений на GitHub Release, проверка подписи ключа ed25519 и установка .exe без участия пользователя.'
                    : 'Automatic update checks on GitHub Releases with ed25519 signature verification.'}
                </p>
              </div>

              {/* Feature 2: Native Dialogs */}
              <div className={`p-4 rounded-xl border space-y-2 ${
                isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-[#131822] border-[#202838]'
              }`}>
                <div className="flex items-center gap-2 text-sky-400 font-bold text-sm">
                  <FileCode size={16} />
                  <span>Config & Bind Exporter</span>
                </div>
                <p className={`text-xs ${isLight ? 'text-neutral-600' : 'text-[#8b95a8]'}`}>
                  {lang === 'ru'
                    ? 'Сохранение биндов прямо в файл `autoexec.cfg` или `keys.cfg` в папку Rust через системные диалоги Windows.'
                    : 'Directly save keybinds into `autoexec.cfg` or `keys.cfg` in your Rust directory.'}
                </p>
                <button
                  onClick={onOpenConfigExporter}
                  className="mt-2 text-[11px] text-sky-400 font-bold uppercase hover:underline cursor-pointer"
                >
                  {lang === 'ru' ? 'Открыть Экспортёр Биндов ➔' : 'Open Bind Exporter ➔'}
                </button>
              </div>

              {/* Feature 3: Notifications */}
              <div className={`p-4 rounded-xl border space-y-2 ${
                isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-[#131822] border-[#202838]'
              }`}>
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                  <Bell size={16} />
                  <span>Native Tray & Alerts</span>
                </div>
                <p className={`text-xs ${isLight ? 'text-neutral-600' : 'text-[#8b95a8]'}`}>
                  {lang === 'ru'
                    ? 'Уведомления Windows при рейде вашей базы (через Rust+ Bot Hub) или появлении врагов в области Player Radar.'
                    : 'Native Windows desktop toast notifications on base raids and enemy radar sightings.'}
                </p>
                <button
                  onClick={onOpenNotifications}
                  className="mt-2 text-[11px] text-amber-400 font-bold uppercase hover:underline cursor-pointer"
                >
                  {lang === 'ru' ? 'Настройки Уведомлений ➔' : 'Notification Settings ➔'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpecialAccessHubTab;
