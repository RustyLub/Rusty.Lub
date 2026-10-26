import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Settings, 
  Play, 
  Target, 
  Bell, 
  Cpu, 
  Info, 
  RefreshCw, 
  Trash2, 
  Save, 
  RotateCcw, 
  Check, 
  Volume2, 
  VolumeX, 
  Sliders, 
  Server, 
  FolderOpen, 
  ShieldCheck, 
  Zap, 
  Eye, 
  Monitor, 
  ExternalLink,
  Plus,
  Compass,
  AlertTriangle,
  Flame
} from 'lucide-react';
import { 
  LauncherSettings, 
  getLauncherSettings, 
  saveLauncherSettings, 
  resetLauncherSettings, 
  clearLauncherCache,
  LAUNCH_PRESETS,
  FavoriteServer,
  DEFAULT_LAUNCHER_SETTINGS
} from '../services/launcherSettings';
import { checkForAppUpdates } from '../services/appUpdater';
import { sendWindowsNotification, playNotificationAudio } from '../services/tauriNotifications';

interface LauncherSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'ru' | 'en';
  appTheme: 'light' | 'dark';
  onToast?: (msg: string, type: 'success' | 'error' | 'info') => void;
  onSettingsSaved?: (newSettings: LauncherSettings) => void;
}

type SettingsTab = 'launch' | 'hud' | 'alerts' | 'servers' | 'system' | 'about';

export const LauncherSettingsModal: React.FC<LauncherSettingsModalProps> = ({
  isOpen,
  onClose,
  lang,
  appTheme,
  onToast,
  onSettingsSaved
}) => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('launch');
  const [settings, setSettings] = useState<LauncherSettings>(getLauncherSettings);
  const [isSavedRecently, setIsSavedRecently] = useState(false);
  const [isCheckingUpdate, setIsCheckingUpdate] = useState(false);
  const [updateLog, setUpdateLog] = useState<string | null>(null);

  // New server form inputs
  const [newServerName, setNewServerName] = useState('');
  const [newServerIp, setNewServerIp] = useState('');
  const [newServerPort, setNewServerPort] = useState('28015');

  useEffect(() => {
    if (isOpen) {
      setSettings(getLauncherSettings());
      setIsSavedRecently(false);
      setUpdateLog(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isLight = appTheme === 'light';

  const handleFieldChange = <K extends keyof LauncherSettings>(field: K, value: LauncherSettings[K]) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleApplyPreset = (presetKey: 'fps' | 'stream' | 'lowpc') => {
    const preset = LAUNCH_PRESETS[presetKey];
    setSettings(prev => ({
      ...prev,
      launchPreset: presetKey,
      launchArgs: preset.args
    }));
    if (onToast) {
      onToast(
        lang === 'ru' 
          ? `Применен пресет: ${preset.labelRu}` 
          : `Applied preset: ${preset.labelEn}`, 
        'info'
      );
    }
  };

  const handleSaveAll = () => {
    const updated = saveLauncherSettings(settings);
    setSettings(updated);
    setIsSavedRecently(true);
    if (onSettingsSaved) onSettingsSaved(updated);
    if (onToast) {
      onToast(
        lang === 'ru' ? 'Настройки лаунчера успешно сохранены!' : 'Launcher settings saved successfully!', 
        'success'
      );
    }
    setTimeout(() => setIsSavedRecently(false), 2000);
  };

  const handleResetDefaults = () => {
    const defaults = resetLauncherSettings();
    setSettings(defaults);
    if (onSettingsSaved) onSettingsSaved(defaults);
    if (onToast) {
      onToast(
        lang === 'ru' ? 'Настройки сброшены до стандартных значений' : 'Settings restored to factory defaults', 
        'info'
      );
    }
  };

  const handleTestSiren = () => {
    playNotificationAudio('raid');
    sendWindowsNotification(
      lang === 'ru' ? '⚠️ ТЕСТ ТРЕВОГИ ЛАУНЧЕРА' : '⚠️ LAUNCHER RAID ALERT TEST',
      lang === 'ru' ? 'Звуковая сирена и уведомление Windows работают штатно.' : 'Sound siren & Windows notifications are operational.',
      'raid'
    );
  };

  const handleCheckUpdateNow = async () => {
    setIsCheckingUpdate(true);
    setUpdateLog(lang === 'ru' ? 'Проверка обновлений на GitHub Releases...' : 'Checking GitHub Releases...');
    try {
      const updated = await checkForAppUpdates((status) => {
        setUpdateLog(status);
      });
      if (updated) {
        if (onToast) onToast(lang === 'ru' ? 'Обновление скачано и готово к установке!' : 'Update downloaded and ready to install!', 'success');
      } else {
        if (!updateLog) setUpdateLog(lang === 'ru' ? 'Установлена последняя актуальная версия v2.6.4' : 'Latest version v2.6.4 is already installed');
      }
    } catch (err: any) {
      setUpdateLog(err?.message || (lang === 'ru' ? 'Ошибка проверки обновлений' : 'Update check failed'));
    } finally {
      setIsCheckingUpdate(false);
    }
  };

  const handleAddServer = () => {
    if (!newServerName || !newServerIp) {
      if (onToast) onToast(lang === 'ru' ? 'Введите название и IP сервера' : 'Enter server name and IP', 'error');
      return;
    }
    const portNum = parseInt(newServerPort, 10) || 28015;
    const newServer: FavoriteServer = {
      id: `custom-${Date.now()}`,
      name: newServerName.trim(),
      ip: newServerIp.trim(),
      port: portNum,
      region: 'Custom',
      type: 'Player Added',
      ping: 25
    };
    const updatedServers = [...settings.favoriteServers, newServer];
    setSettings(prev => ({
      ...prev,
      favoriteServers: updatedServers,
      selectedServerId: newServer.id
    }));
    setNewServerName('');
    setNewServerIp('');
    setNewServerPort('28015');
    if (onToast) onToast(lang === 'ru' ? 'Сервер добавлен в избранное!' : 'Server added to favorites!', 'success');
  };

  const handleRemoveServer = (id: string) => {
    const updated = settings.favoriteServers.filter(s => s.id !== id);
    setSettings(prev => ({
      ...prev,
      favoriteServers: updated,
      selectedServerId: prev.selectedServerId === id ? (updated[0]?.id || '') : prev.selectedServerId
    }));
  };

  const handleClearCacheNow = async () => {
    const success = await clearLauncherCache();
    if (onToast) {
      onToast(
        success 
          ? (lang === 'ru' ? 'Кэш и временные файлы лаунчера очищены!' : 'Launcher cache and temporary data cleared!')
          : (lang === 'ru' ? 'Не удалось полностью очистить кэш' : 'Could not fully clear cache'),
        success ? 'success' : 'error'
      );
    }
  };

  const navItems: { id: SettingsTab; labelRu: string; labelEn: string; icon: React.ReactNode }[] = [
    { id: 'launch', labelRu: 'Клиент Rust & Запуск', labelEn: 'Rust Client & Launch', icon: <Play size={16} /> },
    { id: 'hud', labelRu: 'HUD Оверлей (Alt+O)', labelEn: 'HUD Overlay (Alt+O)', icon: <Target size={16} /> },
    { id: 'alerts', labelRu: 'Сирены & Оповещения', labelEn: 'Sirens & Alerts', icon: <Bell size={16} /> },
    { id: 'servers', labelRu: 'Серверы & Коннект', labelEn: 'Servers & Connect', icon: <Server size={16} /> },
    { id: 'system', labelRu: 'Система & FPS', labelEn: 'System & FPS', icon: <Cpu size={16} /> },
    { id: 'about', labelRu: 'О лаунчере & Апдейты', labelEn: 'About & Updates', icon: <Info size={16} /> }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 pointer-events-auto select-none">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className={`relative w-full max-w-4xl max-h-[90vh] rounded-2xl border-2 shadow-2xl overflow-hidden z-10 flex flex-col font-mono rust-metal-pattern ${
          isLight
            ? 'bg-white border-neutral-300 text-neutral-900 shadow-[0_20px_60px_rgba(0,0,0,0.3)]'
            : 'bg-[#0a0d14] border-red-600/60 text-[#eef2f7] shadow-[0_20px_60px_rgba(0,0,0,0.9)]'
        }`}
      >
        {/* Tactical Corner Brackets */}
        <div className="rust-bracket-tl" />
        <div className="rust-bracket-tr" />
        <div className="rust-bracket-bl" />
        <div className="rust-bracket-br" />

        {/* Hazard top bar */}
        <div className="h-1.5 rust-hazard w-full shrink-0" />

        {/* Header */}
        <div 
          data-tauri-drag-region
          className="px-5 py-3.5 bg-gradient-to-r from-red-800 via-red-700 to-amber-700 text-white flex items-center justify-between shadow-md shrink-0 cursor-move"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-black/40 flex items-center justify-center font-black text-amber-400 border border-white/10 shadow-xs">
              <Settings size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-base tracking-wider font-teko uppercase">
                  {lang === 'ru' ? 'ПАРАМЕТРЫ ПРИЛОЖЕНИЯ-ЛАУНЧЕРА' : 'LAUNCHER CLIENT SETTINGS'}
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded font-bold bg-black/40 text-amber-300 border border-amber-500/30">
                  v{settings.appVersion} DESKTOP
                </span>
              </div>
              <p className="text-[11px] text-white/80 font-sans">
                {lang === 'ru' 
                  ? 'Конфигурация параметров запуска Rust, внутриигрового HUD оверлея, звуковых сирен и оптимизации' 
                  : 'Configure Rust launch args, in-game HUD overlay, sound sirens and hardware optimizations'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-black/30 hover:bg-black/50 text-white/80 hover:text-white transition-all cursor-pointer"
            title={lang === 'ru' ? 'Закрыть (Esc)' : 'Close (Esc)'}
          >
            <X size={18} />
          </button>
        </div>

        {/* Main Body: Sidebar Tabs + Content Area */}
        <div className="flex-1 flex flex-col sm:flex-row overflow-hidden min-h-0">
          {/* Sidebar Nav */}
          <div className={`w-full sm:w-60 p-3 sm:p-4 border-b sm:border-b-0 sm:border-r flex sm:flex-col gap-1.5 overflow-x-auto sm:overflow-y-auto shrink-0 ${
            isLight ? 'bg-neutral-100/90 border-neutral-200' : 'bg-[#06080e]/95 border-[#182030]'
          }`}>
            <span className="hidden sm:block text-[10px] font-bold uppercase tracking-wider text-neutral-400 px-2 py-1">
              {lang === 'ru' ? 'РАЗДЕЛЫ НАСТРОЕК' : 'CONFIGURATION TABS'}
            </span>
            {navItems.map(item => {
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left shrink-0 cursor-pointer ${
                    active
                      ? 'bg-red-600 text-white shadow-md shadow-red-600/30 font-black'
                      : isLight
                        ? 'hover:bg-neutral-200/80 text-neutral-700'
                        : 'hover:bg-[#141a26] text-[#909eb2] hover:text-[#eef2f7]'
                  }`}
                >
                  <span className={active ? 'text-white' : 'text-red-500'}>{item.icon}</span>
                  <span className="truncate">{lang === 'ru' ? item.labelRu : item.labelEn}</span>
                </button>
              );
            })}

            <div className="mt-auto hidden sm:block pt-4 border-t border-neutral-700/20">
              <div className={`p-2.5 rounded-xl text-[10px] space-y-1 ${
                isLight ? 'bg-neutral-200/80 text-neutral-600' : 'bg-black/30 text-neutral-400 border border-white/5'
              }`}>
                <div className="flex items-center gap-1.5 font-bold text-amber-500">
                  <ShieldCheck size={13} />
                  <span>EAC COMPATIBLE</span>
                </div>
                <p className="leading-tight">
                  {lang === 'ru' ? 'Полная совместимость с Easy Anti-Cheat. Оверлей не внедряется в память игры.' : 'Safe overlay mode: No code injection into Rust process.'}
                </p>
              </div>
            </div>
          </div>

          {/* Tab Content Panel */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto min-h-0 space-y-6">
            {/* TAB 1: RUST CLIENT & LAUNCH */}
            {activeTab === 'launch' && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-sm sm:text-base font-black text-red-500 uppercase tracking-wide flex items-center gap-2">
                    <Play size={16} />
                    {lang === 'ru' ? 'ПАРАМЕТРЫ ЗАПУСКА RUST' : 'RUST EXECUTION & LAUNCH ARGS'}
                  </h3>
                  <p className="text-xs text-neutral-400 font-sans mt-0.5">
                    {lang === 'ru' 
                      ? 'Тонкая настройка аргументов запуска игры для повышения стабильности и FPS.' 
                      : 'Fine-tune launch command line parameters for peak FPS and reduced stutters.'}
                  </p>
                </div>

                {/* Rust Executable Path */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-300">
                    {lang === 'ru' ? 'Путь к исполняемому файлу RustClient.exe:' : 'RustClient.exe File Path:'}
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={settings.rustPath}
                      onChange={(e) => handleFieldChange('rustPath', e.target.value)}
                      className={`flex-1 px-3 py-2 rounded-lg text-xs font-mono border focus:outline-none focus:border-red-500 ${
                        isLight ? 'bg-neutral-100 border-neutral-300 text-neutral-800' : 'bg-[#121620] border-[#222c3d] text-neutral-200'
                      }`}
                    />
                    <button
                      onClick={() => handleFieldChange('rustPath', DEFAULT_LAUNCHER_SETTINGS.rustPath)}
                      className="px-3 py-2 rounded-lg text-xs font-bold bg-neutral-700/40 hover:bg-neutral-700/70 text-white transition-colors cursor-pointer"
                      title={lang === 'ru' ? 'Сбросить путь к Steam по умолчанию' : 'Reset to default Steam path'}
                    >
                      <RotateCcw size={13} />
                    </button>
                  </div>
                </div>

                {/* Presets */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-300">
                    {lang === 'ru' ? 'Быстрые пресеты оптимизации параметров:' : 'Optimization Launch Presets:'}
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {(['fps', 'stream', 'lowpc'] as const).map(pKey => {
                      const preset = LAUNCH_PRESETS[pKey];
                      const isSelected = settings.launchPreset === pKey;
                      return (
                        <button
                          key={pKey}
                          onClick={() => handleApplyPreset(pKey)}
                          className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-red-600/20 border-red-500 text-red-400 font-bold shadow-xs'
                              : isLight
                                ? 'bg-neutral-100 hover:bg-neutral-200 border-neutral-200 text-neutral-700'
                                : 'bg-[#10141e] hover:bg-[#161c2a] border-[#1d2535] text-neutral-300'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-bold uppercase truncate">{lang === 'ru' ? preset.labelRu : preset.labelEn}</span>
                            {isSelected && <Check size={14} className="text-red-500 shrink-0" />}
                          </div>
                          <p className="text-[10px] text-neutral-400 line-clamp-2 font-sans">
                            {preset.args}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Custom Launch Arguments */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-neutral-300">
                      {lang === 'ru' ? 'Командная строка запуска (Launch Arguments):' : 'Launch Arguments Command Line:'}
                    </label>
                    <span className="text-[10px] text-amber-500 font-bold">
                      {settings.launchPreset === 'custom' ? 'CUSTOM' : settings.launchPreset.toUpperCase()}
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    value={settings.launchArgs}
                    onChange={(e) => {
                      handleFieldChange('launchArgs', e.target.value);
                      handleFieldChange('launchPreset', 'custom');
                    }}
                    className={`w-full p-3 rounded-lg text-xs font-mono border focus:outline-none focus:border-red-500 resize-none ${
                      isLight ? 'bg-neutral-100 border-neutral-300 text-neutral-800' : 'bg-[#121620] border-[#222c3d] text-neutral-200'
                    }`}
                  />
                  <p className="text-[11px] text-neutral-500 font-sans">
                    {lang === 'ru'
                      ? 'Рекомендуемые флаги: -high (высокий приоритет), -maxMem=16384 (16GB RAM), -malloc=system (быстрый аллокатор), -window-mode exclusive.'
                      : 'Recommended flags: -high (high CPU priority), -maxMem=16384 (16GB RAM), -malloc=system, -window-mode exclusive.'}
                  </p>
                </div>

                {/* Launch Behavior */}
                <div className="space-y-2 pt-2 border-t border-neutral-700/20">
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-300">
                    {lang === 'ru' ? 'Действие лаунчера при нажатии «Запуск Rust»:' : 'Launcher Behavior on Rust Play:'}
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {[
                      { id: 'open_hud', labelRu: 'Открыть HUD Оверлей', labelEn: 'Open HUD Overlay', descRu: 'Лаунчер переходит в режим компактного оверлея', descEn: 'Switches into compact in-game overlay' },
                      { id: 'minimize_tray', labelRu: 'Свернуть в трей', labelEn: 'Minimize to Tray', descRu: 'Экономит 100% ресурсов GPU во время игры', descEn: 'Minimizes to Windows system tray' },
                      { id: 'keep_open', labelRu: 'Оставить открытым', labelEn: 'Keep Open', descRu: 'Удобно для пользователей двух мониторов', descEn: 'Great for second monitor companion view' }
                    ].map(opt => (
                      <button
                        key={opt.id}
                        onClick={() => handleFieldChange('onLaunchBehavior', opt.id as any)}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          settings.onLaunchBehavior === opt.id
                            ? 'bg-red-600/20 border-red-500 text-red-400 font-bold'
                            : isLight
                              ? 'bg-neutral-100 hover:bg-neutral-200 border-neutral-200 text-neutral-700'
                              : 'bg-[#10141e] hover:bg-[#161c2a] border-[#1d2535] text-neutral-300'
                        }`}
                      >
                        <span className="text-xs font-bold block">{lang === 'ru' ? opt.labelRu : opt.labelEn}</span>
                        <span className="text-[10px] text-neutral-400 font-sans block mt-0.5">{lang === 'ru' ? opt.descRu : opt.descEn}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* System Toggles */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer ${
                    isLight ? 'bg-neutral-100 border-neutral-200' : 'bg-[#10141e] border-[#1d2535]'
                  }`}>
                    <input
                      type="checkbox"
                      checked={settings.runAsAdmin}
                      onChange={(e) => handleFieldChange('runAsAdmin', e.target.checked)}
                      className="accent-red-600 w-4 h-4 rounded"
                    />
                    <div>
                      <span className="text-xs font-bold block">{lang === 'ru' ? 'Запуск от имени Администратора' : 'Run as Administrator'}</span>
                      <span className="text-[10px] text-neutral-400 font-sans block">{lang === 'ru' ? 'Требуется для глобальных хоткеев в играх' : 'Required for global shortcuts in full-screen games'}</span>
                    </div>
                  </label>

                  <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer ${
                    isLight ? 'bg-neutral-100 border-neutral-200' : 'bg-[#10141e] border-[#1d2535]'
                  }`}>
                    <input
                      type="checkbox"
                      checked={settings.autoStartWindows}
                      onChange={(e) => handleFieldChange('autoStartWindows', e.target.checked)}
                      className="accent-red-600 w-4 h-4 rounded"
                    />
                    <div>
                      <span className="text-xs font-bold block">{lang === 'ru' ? 'Автозапуск при старте Windows' : 'Start with Windows'}</span>
                      <span className="text-[10px] text-neutral-400 font-sans block">{lang === 'ru' ? 'Фоновый запуск с мониторингом рейдов' : 'Silent background start with raid monitors'}</span>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {/* TAB 2: HUD OVERLAY CONFIG */}
            {activeTab === 'hud' && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-sm sm:text-base font-black text-red-500 uppercase tracking-wide flex items-center gap-2">
                    <Target size={16} />
                    {lang === 'ru' ? 'НАСТРОЙКИ ВНУТРИИГРОВОГО HUD ОВЕРЛЕЯ' : 'IN-GAME HUD OVERLAY CONFIG'}
                  </h3>
                  <p className="text-xs text-neutral-400 font-sans mt-0.5">
                    {lang === 'ru' 
                      ? 'Управление прозрачностью, поведением и горячими клавишами тактического оверлея поверх Rust.' 
                      : 'Customize transparency, hotkeys and pinning for the in-game tactical overlay.'}
                  </p>
                </div>

                {/* Hotkey Selector */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-300">
                    {lang === 'ru' ? 'Горячая клавиша быстрого вызова оверлея:' : 'Quick Overlay Toggle Hotkey:'}
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {['Alt+O', 'Ctrl+F1', 'F12', 'F8'].map(hk => (
                      <button
                        key={hk}
                        onClick={() => handleFieldChange('hudHotkey', hk)}
                        className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer font-mono text-xs font-bold ${
                          settings.hudHotkey === hk
                            ? 'bg-red-600 text-white border-red-500 shadow-xs'
                            : isLight
                              ? 'bg-neutral-100 hover:bg-neutral-200 border-neutral-200 text-neutral-700'
                              : 'bg-[#10141e] hover:bg-[#161c2a] border-[#1d2535] text-neutral-300'
                        }`}
                      >
                        {hk}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Opacity Slider */}
                <div className="space-y-2 p-3.5 rounded-xl border border-neutral-700/30 bg-black/20">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-neutral-300 flex items-center gap-2">
                      <Sliders size={14} className="text-red-500" />
                      {lang === 'ru' ? 'Прозрачность оверлея по умолчанию:' : 'Default Overlay Opacity:'}
                    </label>
                    <span className="font-mono text-xs font-bold text-amber-400">
                      {settings.hudDefaultOpacity}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min={40}
                    max={100}
                    step={1}
                    value={settings.hudDefaultOpacity}
                    onChange={(e) => handleFieldChange('hudDefaultOpacity', parseInt(e.target.value, 10))}
                    className="w-full accent-red-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-neutral-500 font-mono">
                    <span>40% (Прозрачный)</span>
                    <span>75% (Баланс)</span>
                    <span>100% (Непрозрачный)</span>
                  </div>
                </div>

                {/* Start Section in Overlay */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-300">
                    {lang === 'ru' ? 'Стартовая вкладка оверлея:' : 'Initial Overlay Screen:'}
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'raid', labelRu: 'Рейд-калькулятор', labelEn: 'Raid Matrix' },
                      { id: 'weapons', labelRu: 'ТТХ Оружия', labelEn: 'Weapons Matrix' },
                      { id: 'binds', labelRu: 'Бинды & Макросы', labelEn: 'Quick Binds' },
                      { id: 'alerts', labelRu: 'Rust+ Тревоги', labelEn: 'Rust+ Alerts' }
                    ].map(sec => (
                      <button
                        key={sec.id}
                        onClick={() => handleFieldChange('hudStartSection', sec.id as any)}
                        className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer text-center ${
                          settings.hudStartSection === sec.id
                            ? 'bg-red-600 text-white border-red-500 shadow-xs'
                            : isLight
                              ? 'bg-neutral-100 hover:bg-neutral-200 border-neutral-200 text-neutral-700'
                              : 'bg-[#10141e] hover:bg-[#161c2a] border-[#1d2535] text-neutral-300'
                        }`}
                      >
                        {lang === 'ru' ? sec.labelRu : sec.labelEn}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Always on top & Sound feedback */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer ${
                    isLight ? 'bg-neutral-100 border-neutral-200' : 'bg-[#10141e] border-[#1d2535]'
                  }`}>
                    <input
                      type="checkbox"
                      checked={settings.hudAlwaysOnTop}
                      onChange={(e) => handleFieldChange('hudAlwaysOnTop', e.target.checked)}
                      className="accent-red-600 w-4 h-4 rounded"
                    />
                    <div>
                      <span className="text-xs font-bold block">{lang === 'ru' ? 'Закрепить поверх окон (Always on Top)' : 'Always on Top Mode'}</span>
                      <span className="text-[10px] text-neutral-400 font-sans block">{lang === 'ru' ? 'Окно оверлея никогда не перекрывается игрой' : 'Prevents game from hiding the overlay window'}</span>
                    </div>
                  </label>

                  <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer ${
                    isLight ? 'bg-neutral-100 border-neutral-200' : 'bg-[#10141e] border-[#1d2535]'
                  }`}>
                    <input
                      type="checkbox"
                      checked={settings.hudSoundEffects}
                      onChange={(e) => handleFieldChange('hudSoundEffects', e.target.checked)}
                      className="accent-red-600 w-4 h-4 rounded"
                    />
                    <div>
                      <span className="text-xs font-bold block">{lang === 'ru' ? 'Звуковой отклик при открытии' : 'Tactical Audio Feedback'}</span>
                      <span className="text-[10px] text-neutral-400 font-sans block">{lang === 'ru' ? 'Звук тактического зуммера при хоткее' : 'Chime sound when toggling overlay'}</span>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {/* TAB 3: ALERTS & SIRENS */}
            {activeTab === 'alerts' && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-sm sm:text-base font-black text-red-500 uppercase tracking-wide flex items-center gap-2">
                    <Bell size={16} />
                    {lang === 'ru' ? 'ОПОВЕЩЕНИЯ И ТАКТИЧЕСКИЕ СИРЕНЫ' : 'WINDOWS ALERTS & SOUND SIRENS'}
                  </h3>
                  <p className="text-xs text-neutral-400 font-sans mt-0.5">
                    {lang === 'ru' 
                      ? 'Нативные Windows Toast уведомления и громкие сирены для защиты вашей базы в оффлайне.' 
                      : 'Native Windows toasts and customizable raid sirens for offline base defense.'}
                  </p>
                </div>

                {/* Native Toasts toggle */}
                <label className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer ${
                  isLight ? 'bg-neutral-100 border-neutral-200' : 'bg-[#10141e] border-[#1d2535]'
                }`}>
                  <div>
                    <span className="text-xs font-bold block">{lang === 'ru' ? 'Нативные Windows Toast уведомления (Tauri 2)' : 'Native Windows Toast Notifications (Tauri 2)'}</span>
                    <span className="text-[10px] text-neutral-400 font-sans block">{lang === 'ru' ? 'Всплывающие карточки в правом нижнем углу Windows даже при свернутом лаунчере' : 'Desktop notifications in Windows action center even when minimized'}</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.nativeNotifications}
                    onChange={(e) => handleFieldChange('nativeNotifications', e.target.checked)}
                    className="accent-red-600 w-5 h-5 rounded cursor-pointer"
                  />
                </label>

                {/* Siren Type */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-300">
                    {lang === 'ru' ? 'Тип звукового сигнала тревоги:' : 'Alarm Siren Sound Type:'}
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {[
                      { id: 'tactical', labelRu: 'Тактическая тревога', labelEn: 'Tactical Raid Pulse', descRu: 'Синтез двухтонового пульса 880Hz' },
                      { id: 'siren', labelRu: 'Сирена ГО (War Siren)', labelEn: 'Air Raid Siren', descRu: 'Нарастающий вой тревоги' },
                      { id: 'radar', labelRu: 'Радарный зуммер', labelEn: 'Sonar Blip', descRu: 'Короткий резкий щелчок сенсора' }
                    ].map(snd => (
                      <button
                        key={snd.id}
                        onClick={() => handleFieldChange('raidSirenType', snd.id as any)}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          settings.raidSirenType === snd.id
                            ? 'bg-red-600/20 border-red-500 text-red-400 font-bold'
                            : isLight
                              ? 'bg-neutral-100 hover:bg-neutral-200 border-neutral-200 text-neutral-700'
                              : 'bg-[#10141e] hover:bg-[#161c2a] border-[#1d2535] text-neutral-300'
                        }`}
                      >
                        <span className="text-xs font-bold block">{lang === 'ru' ? snd.labelRu : snd.labelEn}</span>
                        <span className="text-[10px] text-neutral-400 font-sans block mt-0.5">{snd.descRu}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Volume Slider */}
                <div className="space-y-2 p-3.5 rounded-xl border border-neutral-700/30 bg-black/20">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-neutral-300 flex items-center gap-2">
                      <Volume2 size={14} className="text-red-500" />
                      {lang === 'ru' ? 'Громкость звукового оповещения:' : 'Siren Audio Volume:'}
                    </label>
                    <span className="font-mono text-xs font-bold text-amber-400">{settings.raidSirenVolume}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={5}
                    value={settings.raidSirenVolume}
                    onChange={(e) => handleFieldChange('raidSirenVolume', parseInt(e.target.value, 10))}
                    className="w-full accent-red-600 cursor-pointer"
                  />
                </div>

                {/* Test button */}
                <div className="pt-2">
                  <button
                    onClick={handleTestSiren}
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                  >
                    <Volume2 size={16} />
                    <span>{lang === 'ru' ? 'Протестировать сирену и Windows-уведомление' : 'Test Sound Siren & Windows Toast'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB 4: SERVERS & DIRECT CONNECT */}
            {activeTab === 'servers' && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-sm sm:text-base font-black text-red-500 uppercase tracking-wide flex items-center gap-2">
                    <Server size={16} />
                    {lang === 'ru' ? 'ИЗБРАННЫЕ СЕРВЕРЫ И БЫСТРЫЙ КОННЕКТ' : 'FAVORITE SERVERS & QUICK CONNECT'}
                  </h3>
                  <p className="text-xs text-neutral-400 font-sans mt-0.5">
                    {lang === 'ru' 
                      ? 'Серверы для быстрого запуска через протокол Steam (steam://connect/IP:PORT).' 
                      : 'Preset servers for one-click direct connect via Steam protocol.'}
                  </p>
                </div>

                {/* List of servers */}
                <div className="space-y-2">
                  {settings.favoriteServers.map(srv => {
                    const isSelected = settings.selectedServerId === srv.id;
                    return (
                      <div
                        key={srv.id}
                        className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                          isSelected
                            ? 'bg-red-600/15 border-red-500 text-white'
                            : isLight
                              ? 'bg-neutral-100 border-neutral-200 text-neutral-800'
                              : 'bg-[#10141e] border-[#1d2535] text-neutral-200'
                        }`}
                      >
                        <div 
                          className="flex-1 min-w-0 cursor-pointer"
                          onClick={() => handleFieldChange('selectedServerId', srv.id)}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold truncate">{srv.name}</span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-black/40 text-amber-400 border border-white/10 shrink-0 font-mono">
                              {srv.type}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-[11px] text-neutral-400 font-mono mt-0.5">
                            <span>{srv.ip}:{srv.port}</span>
                            <span>•</span>
                            <span className="text-emerald-400 font-semibold">{srv.players || 'Online'}</span>
                            <span>•</span>
                            <span>Ping: {srv.ping}ms</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => handleFieldChange('selectedServerId', srv.id)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-red-600 text-white shadow-xs'
                                : 'bg-neutral-700/40 hover:bg-neutral-700/70 text-neutral-300'
                            }`}
                          >
                            {isSelected ? (lang === 'ru' ? 'Выбран' : 'Selected') : (lang === 'ru' ? 'Выбрать' : 'Select')}
                          </button>
                          {settings.favoriteServers.length > 1 && (
                            <button
                              onClick={() => handleRemoveServer(srv.id)}
                              className="p-1.5 rounded-lg hover:bg-red-500/20 text-neutral-400 hover:text-red-400 transition-colors cursor-pointer"
                              title={lang === 'ru' ? 'Удалить из избранного' : 'Remove server'}
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Add Server Form */}
                <div className={`p-4 rounded-xl border space-y-3 ${
                  isLight ? 'bg-neutral-100 border-neutral-200' : 'bg-black/30 border-neutral-700/30'
                }`}>
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-300 flex items-center gap-2">
                    <Plus size={14} className="text-red-500" />
                    {lang === 'ru' ? 'Добавить кастомный сервер в избранное:' : 'Add Custom Rust Server:'}
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input
                      type="text"
                      placeholder={lang === 'ru' ? 'Название (Magic Rust)' : 'Server Name'}
                      value={newServerName}
                      onChange={(e) => setNewServerName(e.target.value)}
                      className={`px-3 py-2 rounded-lg text-xs border focus:outline-none focus:border-red-500 ${
                        isLight ? 'bg-white border-neutral-300' : 'bg-[#121620] border-[#222c3d]'
                      }`}
                    />
                    <input
                      type="text"
                      placeholder="IP (185.189.255.45)"
                      value={newServerIp}
                      onChange={(e) => setNewServerIp(e.target.value)}
                      className={`px-3 py-2 rounded-lg text-xs font-mono border focus:outline-none focus:border-red-500 ${
                        isLight ? 'bg-white border-neutral-300' : 'bg-[#121620] border-[#222c3d]'
                      }`}
                    />
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Port (28015)"
                        value={newServerPort}
                        onChange={(e) => setNewServerPort(e.target.value)}
                        className={`w-24 px-3 py-2 rounded-lg text-xs font-mono border focus:outline-none focus:border-red-500 ${
                          isLight ? 'bg-white border-neutral-300' : 'bg-[#121620] border-[#222c3d]'
                        }`}
                      />
                      <button
                        onClick={handleAddServer}
                        className="flex-1 px-3 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase transition-all cursor-pointer"
                      >
                        {lang === 'ru' ? 'Добавить' : 'Add'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: SYSTEM & PERFORMANCE */}
            {activeTab === 'system' && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-sm sm:text-base font-black text-red-500 uppercase tracking-wide flex items-center gap-2">
                    <Cpu size={16} />
                    {lang === 'ru' ? 'ПРОИЗВОДИТЕЛЬНОСТЬ И КЭШ' : 'PERFORMANCE & CACHE'}
                  </h3>
                  <p className="text-xs text-neutral-400 font-sans mt-0.5">
                    {lang === 'ru' 
                      ? 'Оптимизация потребления видеокарты и оперативной памяти лаунчером во время игры в Rust.' 
                      : 'Hardware acceleration and background resource throttles to keep maximum GPU headroom for Rust.'}
                  </p>
                </div>

                {/* FPS Limits */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-300">
                    {lang === 'ru' ? 'Лимит частоты кадров окна лаунчера:' : 'Launcher Render Framerate Limit:'}
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { val: 60, label: '60 FPS' },
                      { val: 144, label: '144 FPS' },
                      { val: 240, label: '240 FPS' },
                      { val: 0, label: lang === 'ru' ? 'Без лимита' : 'Unlimited' }
                    ].map(fps => (
                      <button
                        key={fps.val}
                        onClick={() => handleFieldChange('fpsLimit', fps.val)}
                        className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer font-mono text-xs font-bold ${
                          settings.fpsLimit === fps.val
                            ? 'bg-red-600 text-white border-red-500 shadow-xs'
                            : isLight
                              ? 'bg-neutral-100 hover:bg-neutral-200 border-neutral-200 text-neutral-700'
                              : 'bg-[#10141e] hover:bg-[#161c2a] border-[#1d2535] text-neutral-300'
                        }`}
                      >
                        {fps.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Background throttle */}
                <label className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer ${
                  isLight ? 'bg-neutral-100 border-neutral-200' : 'bg-[#10141e] border-[#1d2535]'
                }`}>
                  <div>
                    <span className="text-xs font-bold block">{lang === 'ru' ? 'Фоновое энергосбережение (30 FPS в фоне)' : 'Background GPU Power Saving (30 FPS in background)'}</span>
                    <span className="text-[10px] text-neutral-400 font-sans block">{lang === 'ru' ? 'Снижает нагрузку на видеокарту до 0% когда активно окно Rust' : 'Minimizes CPU/GPU draw when Rust window is focused'}</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.backgroundFpsLimit === 30}
                    onChange={(e) => handleFieldChange('backgroundFpsLimit', e.target.checked ? 30 : 60)}
                    className="accent-red-600 w-5 h-5 rounded cursor-pointer"
                  />
                </label>

                {/* Clear Cache */}
                <div className={`p-4 rounded-xl border flex items-center justify-between gap-4 ${
                  isLight ? 'bg-neutral-100 border-neutral-200' : 'bg-[#10141e] border-[#1d2535]'
                }`}>
                  <div>
                    <span className="text-xs font-bold block">{lang === 'ru' ? 'Очистить кэш и временные файлы' : 'Clear Temporary Cache & Logs'}</span>
                    <span className="text-[10px] text-neutral-400 font-sans block">{lang === 'ru' ? 'Освобождает диск и удаляет устаревшие кэшированные иконки предметов' : 'Deletes cached item icons, search index and web storage'}</span>
                  </div>
                  <button
                    onClick={handleClearCacheNow}
                    className="px-3.5 py-2 rounded-xl bg-neutral-700/50 hover:bg-neutral-700 text-white font-bold text-xs transition-colors cursor-pointer flex items-center gap-2 shrink-0"
                  >
                    <Trash2 size={14} />
                    <span>{lang === 'ru' ? 'Очистить' : 'Clean'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB 6: ABOUT & UPDATES */}
            {activeTab === 'about' && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-sm sm:text-base font-black text-red-500 uppercase tracking-wide flex items-center gap-2">
                    <Info size={16} />
                    {lang === 'ru' ? 'О ПРИЛОЖЕНИИ-ЛАУНЧЕРЕ & ОБНОВЛЕНИЯ' : 'ABOUT LAUNCHER & UPDATES'}
                  </h3>
                  <p className="text-xs text-neutral-400 font-sans mt-0.5">
                    {lang === 'ru' 
                      ? 'Информация о сборке, цифровая подпись Tauri 2 и автоматический апдейтер.' 
                      : 'Build metadata, Tauri 2 signing certificate and auto-updater status.'}
                  </p>
                </div>

                {/* Version card */}
                <div className={`p-4 rounded-xl border space-y-3 ${
                  isLight ? 'bg-neutral-100 border-neutral-200' : 'bg-black/30 border-neutral-700/30'
                }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-base font-black text-red-500 font-teko uppercase tracking-wider block">
                        RUSTY.LUB DESKTOP EDITION
                      </span>
                      <span className="text-xs text-neutral-300 font-mono">
                        Version {settings.appVersion} (Windows x64 Build 2026.10)
                      </span>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono">
                      RELEASE STABLE
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-neutral-700/20 text-xs font-mono">
                    <div>
                      <span className="text-neutral-500 text-[10px] block">RUNTIME:</span>
                      <span className="text-neutral-200 font-bold">Tauri 2.0 / Rust</span>
                    </div>
                    <div>
                      <span className="text-neutral-500 text-[10px] block">ENGINE:</span>
                      <span className="text-neutral-200 font-bold">Edge WebView2</span>
                    </div>
                    <div>
                      <span className="text-neutral-500 text-[10px] block">EAC SECURITY:</span>
                      <span className="text-emerald-400 font-bold">Safe & Compliant</span>
                    </div>
                  </div>
                </div>

                {/* Updater Action */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-neutral-300">
                      {lang === 'ru' ? 'Служба обновлений GitHub Releases:' : 'GitHub Releases Updater Service:'}
                    </label>
                    <span className="text-[11px] text-neutral-500 font-mono">
                      ed25519 Verified
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleCheckUpdateNow}
                      disabled={isCheckingUpdate}
                      className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 shadow-sm"
                    >
                      <RefreshCw size={14} className={isCheckingUpdate ? 'animate-spin' : ''} />
                      <span>{isCheckingUpdate ? (lang === 'ru' ? 'Проверка...' : 'Checking...') : (lang === 'ru' ? 'Проверить обновления' : 'Check for Updates')}</span>
                    </button>
                    {updateLog && (
                      <span className="text-xs text-amber-400 font-mono truncate">
                        {updateLog}
                      </span>
                    )}
                  </div>
                </div>

                {/* Changelog */}
                <div className="space-y-1.5 pt-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-300 block">
                    {lang === 'ru' ? 'История изменений v2.6.4:' : 'Changelog v2.6.4:'}
                  </span>
                  <div className={`p-3 rounded-xl border text-xs space-y-1 font-sans ${
                    isLight ? 'bg-neutral-100 border-neutral-200 text-neutral-700' : 'bg-[#10141e] border-[#1d2535] text-neutral-400'
                  }`}>
                    <p>• <strong>Windows Launcher Shell:</strong> Полная трансформация десктоп-версии под настоящий игровой лаунчер с интеграцией Steam.</p>
                    <p>• <strong>In-Game HUD Overlay:</strong> Настройка прозрачности, быстрого вызова по Alt+O и закрепление поверх всех окон.</p>
                    <p>• <strong>Rust Launch Arguments:</strong> Предустановленные соревновательные пресеты для максимального FPS и стабильности.</p>
                    <p>• <strong>Offline Raid Sirens:</strong> Прямая отправка нативных уведомлений Windows Toast через Tauri 2 IPC.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className={`px-5 py-3 border-t flex items-center justify-between shrink-0 ${
          isLight ? 'bg-neutral-100 border-neutral-200' : 'bg-[#06080e] border-[#182030]'
        }`}>
          <button
            onClick={handleResetDefaults}
            className="text-xs font-bold text-neutral-400 hover:text-red-400 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw size={13} />
            <span>{lang === 'ru' ? 'Сбросить по умолчанию' : 'Restore Defaults'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                isLight ? 'bg-white hover:bg-neutral-200 border-neutral-300 text-neutral-700' : 'bg-[#121620] hover:bg-[#1a202c] border-[#222c3d] text-neutral-300'
              }`}
            >
              {lang === 'ru' ? 'Отмена' : 'Cancel'}
            </button>

            <button
              onClick={handleSaveAll}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-red-600/30 transition-all cursor-pointer"
            >
              {isSavedRecently ? <Check size={14} /> : <Save size={14} />}
              <span>{isSavedRecently ? (lang === 'ru' ? 'Сохранено!' : 'Saved!') : (lang === 'ru' ? 'Сохранить' : 'Save Changes')}</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LauncherSettingsModal;
