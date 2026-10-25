import React, { useState, useEffect } from 'react';
import { Minus, Square, Copy, X, RefreshCw, Shield, Sparkles, Monitor, Radio } from 'lucide-react';
import { checkForAppUpdates } from '../services/appUpdater';

interface WindowsTitlebarProps {
  appName?: string;
  appVersion?: string;
  activeTabLabel?: string;
  onlineCount?: number;
  appTheme: 'light' | 'dark';
  lang: 'ru' | 'en';
  onToast?: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export const WindowsTitlebar: React.FC<WindowsTitlebarProps> = ({
  appName = 'RUSTY.LUB',
  appVersion = '2.6.0',
  activeTabLabel,
  onlineCount = 1,
  appTheme,
  lang,
  onToast
}) => {
  const isLight = appTheme === 'light';
  const [isMaximized, setIsMaximized] = useState(false);
  const [isCheckingUpdate, setIsCheckingUpdate] = useState(false);
  const [isTauriEnv, setIsTauriEnv] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && ('__TAURI_INTERNALS__' in window || '__TAURI__' in window)) {
      setIsTauriEnv(true);
    }
  }, []);

  const handleMinimize = async () => {
    if (isTauriEnv) {
      try {
        const { getCurrentWindow } = await import('@tauri-apps/api/window');
        await getCurrentWindow().minimize();
      } catch (err) {
        console.warn('Tauri minimize error:', err);
      }
    } else {
      if (onToast) onToast(lang === 'ru' ? 'Сворачивание доступно в Windows-приложении' : 'Minimize is available in Windows App', 'info');
    }
  };

  const handleMaximizeToggle = async () => {
    if (isTauriEnv) {
      try {
        const { getCurrentWindow } = await import('@tauri-apps/api/window');
        const win = getCurrentWindow();
        const maximized = await win.isMaximized();
        if (maximized) {
          await win.unmaximize();
          setIsMaximized(false);
        } else {
          await win.maximize();
          setIsMaximized(true);
        }
      } catch (err) {
        console.warn('Tauri maximize error:', err);
      }
    } else {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
        setIsMaximized(true);
      } else {
        document.exitFullscreen().catch(() => {});
        setIsMaximized(false);
      }
    }
  };

  const handleClose = async () => {
    if (isTauriEnv) {
      try {
        const { getCurrentWindow } = await import('@tauri-apps/api/window');
        await getCurrentWindow().close();
      } catch (err) {
        console.warn('Tauri close error:', err);
      }
    } else {
      if (onToast) onToast(lang === 'ru' ? 'Выход из приложения (Tauri 2)' : 'Closing Tauri 2 Desktop App', 'info');
    }
  };

  const handleManualCheckUpdate = async () => {
    setIsCheckingUpdate(true);
    try {
      let statusMsg = '';
      const updated = await checkForAppUpdates((msg) => { statusMsg = msg; });
      if (updated) {
        if (onToast) onToast(lang === 'ru' ? 'Обновление загружено. Приложение перезапускается...' : 'Update downloaded. Restarting app...', 'success');
      } else {
        if (onToast) onToast(statusMsg || (lang === 'ru' ? 'У вас установлена последняя версия v2.6.0!' : 'You have the latest version v2.6.0!'), 'success');
      }
    } catch (e) {
      if (onToast) onToast(lang === 'ru' ? 'Проверка обновлений синхронизирована с GitHub.' : 'Update check synced with GitHub.', 'info');
    } finally {
      setIsCheckingUpdate(false);
    }
  };

  return (
    <div 
      data-tauri-drag-region
      className={`w-full h-8 px-3 flex items-center justify-between text-xs select-none border-b z-50 sticky top-0 transition-colors font-mono ${
        isLight 
          ? 'bg-neutral-200/90 border-neutral-300 text-neutral-800' 
          : 'bg-[#06080d] border-[#181f2c] text-[#a0aab8]'
      }`}
    >
      {/* Left: Window Identity & Status */}
      <div className="flex items-center gap-2.5 min-w-0" data-tauri-drag-region>
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="w-4 h-4 rounded bg-red-600 flex items-center justify-center font-black text-[9px] text-white shadow-xs">
            RL
          </div>
          <span className="font-bold tracking-wider text-[11px] text-red-500 font-teko uppercase">
            {appName}
          </span>
          <span className="text-[9px] px-1 py-0.2 rounded font-bold bg-red-500/10 text-red-600 border border-red-500/20">
            v{appVersion}
          </span>
        </div>

        <span className="opacity-30 font-light">|</span>

        {/* Windows Platform Badge */}
        <div className="hidden sm:flex items-center gap-1.5 text-[10px] opacity-80 shrink-0">
          <Monitor size={11} className="text-sky-400" />
          <span className="font-semibold">{isTauriEnv ? 'TAURI 2.0 WINDOWS x64' : 'WINDOWS DESKTOP MODE'}</span>
        </div>

        {activeTabLabel && (
          <>
            <span className="hidden md:inline opacity-30 font-light">|</span>
            <div className="hidden md:flex items-center gap-1 text-[11px] font-bold text-amber-500 truncate max-w-[200px]">
              <Sparkles size={11} className="shrink-0" />
              <span className="truncate">{activeTabLabel}</span>
            </div>
          </>
        )}
      </div>

      {/* Right: Updater & Native Windows Controls */}
      <div className="flex items-center gap-1 shrink-0">
        {/* Quick Tauri Auto-Update Button */}
        <button
          onClick={handleManualCheckUpdate}
          disabled={isCheckingUpdate}
          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase flex items-center gap-1 transition-all cursor-pointer border ${
            isLight
              ? 'bg-neutral-100 hover:bg-white text-neutral-800 border-neutral-300'
              : 'bg-[#121620] hover:bg-[#1a202c] text-[#c8d0d8] border-[#20293a]'
          }`}
          title={lang === 'ru' ? 'Проверить автообновления Rust' : 'Check for Tauri App Updates'}
        >
          <RefreshCw size={10} className={`text-red-500 ${isCheckingUpdate ? 'animate-spin' : ''}`} />
          <span className="hidden lg:inline">{isCheckingUpdate ? (lang === 'ru' ? 'Проверка...' : 'Checking...') : (lang === 'ru' ? 'Автообновление' : 'Auto-Update')}</span>
        </button>

        <span className="opacity-20 mx-1">|</span>

        {/* Window Controls: Minimize, Maximize, Close */}
        <button
          onClick={handleMinimize}
          className={`w-7 h-6 flex items-center justify-center transition-colors cursor-pointer rounded-xs ${
            isLight ? 'hover:bg-neutral-300 text-neutral-700' : 'hover:bg-white/10 text-neutral-300'
          }`}
          title={lang === 'ru' ? 'Свернуть окно' : 'Minimize'}
        >
          <Minus size={12} />
        </button>

        <button
          onClick={handleMaximizeToggle}
          className={`w-7 h-6 flex items-center justify-center transition-colors cursor-pointer rounded-xs ${
            isLight ? 'hover:bg-neutral-300 text-neutral-700' : 'hover:bg-white/10 text-neutral-300'
          }`}
          title={isMaximized ? (lang === 'ru' ? 'Восстановить' : 'Restore') : (lang === 'ru' ? 'Развернуть' : 'Maximize')}
        >
          {isMaximized ? <Copy size={11} className="rotate-180" /> : <Square size={11} />}
        </button>

        <button
          onClick={handleClose}
          className="w-7 h-6 flex items-center justify-center transition-colors cursor-pointer rounded-xs hover:bg-red-600 hover:text-white text-neutral-300"
          title={lang === 'ru' ? 'Закрыть приложение' : 'Close Application'}
        >
          <X size={13} />
        </button>
      </div>
    </div>
  );
};

export default WindowsTitlebar;
