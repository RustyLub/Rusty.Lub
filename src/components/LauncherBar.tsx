import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Settings, 
  Target, 
  Server, 
  ChevronDown, 
  Activity, 
  ShieldCheck, 
  Radio, 
  Volume2, 
  Sparkles, 
  ExternalLink,
  Flame,
  Check,
  Zap,
  Monitor
} from 'lucide-react';
import { 
  LauncherSettings, 
  launchRustGame, 
  FavoriteServer 
} from '../services/launcherSettings';

interface LauncherBarProps {
  settings: LauncherSettings;
  lang: 'ru' | 'en';
  appTheme: 'light' | 'dark';
  onOpenSettings: () => void;
  onToggleHud: () => void;
  isHudOpen: boolean;
  onToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export const LauncherBar: React.FC<LauncherBarProps> = ({
  settings,
  lang,
  appTheme,
  onOpenSettings,
  onToggleHud,
  isHudOpen,
  onToast
}) => {
  const isLight = appTheme === 'light';
  const [isPlaying, setIsPlaying] = useState(false);
  const [playDuration, setPlayDuration] = useState(0);
  const [serverDropdownOpen, setServerDropdownOpen] = useState(false);
  const [selectedServer, setSelectedServer] = useState<FavoriteServer | null>(null);

  useEffect(() => {
    const found = settings.favoriteServers.find(s => s.id === settings.selectedServerId);
    setSelectedServer(found || settings.favoriteServers[0] || null);
  }, [settings.selectedServerId, settings.favoriteServers]);

  // Session timer when game is launched
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isPlaying) {
      timer = setInterval(() => {
        setPlayDuration(prev => prev + 1);
      }, 1000);
    } else {
      setPlayDuration(0);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying]);

  const formatTimer = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  };

  const handleLaunchClick = () => {
    const res = launchRustGame(settings, selectedServer ? { ip: selectedServer.ip, port: selectedServer.port } : undefined);
    if (res.success) {
      setIsPlaying(true);
      onToast(lang === 'ru' ? res.messageRu : res.messageEn, 'success');
      
      if (settings.onLaunchBehavior === 'open_hud') {
        if (!isHudOpen) onToggleHud();
      }
    } else {
      onToast(lang === 'ru' ? res.messageRu : res.messageEn, 'error');
    }
  };

  const handleSelectServer = (srv: FavoriteServer) => {
    setSelectedServer(srv);
    setServerDropdownOpen(false);
    onToast(
      lang === 'ru' ? `Выбран сервер: ${srv.name}` : `Selected server: ${srv.name}`,
      'info'
    );
  };

  return (
    <div 
      className={`w-full border-b select-none font-mono transition-colors relative z-40 ${
        isLight
          ? 'bg-neutral-100/95 border-neutral-300 text-neutral-900 shadow-sm'
          : 'bg-[#080b12]/98 border-red-950/60 text-[#eef2f7] shadow-[0_4px_20px_rgba(0,0,0,0.6)]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 sm:py-2.5 flex flex-wrap items-center justify-between gap-2.5">
        
        {/* Left: Big Play Button & Session Status */}
        <div className="flex items-center gap-3">
          {/* Authentic Gaming Launcher Action Button */}
          <button
            onClick={handleLaunchClick}
            className={`group relative px-4 sm:px-6 py-2 rounded-xl font-black text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2.5 shadow-lg transition-all cursor-pointer ${
              isPlaying
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-900/40'
                : 'bg-gradient-to-r from-red-600 via-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white shadow-red-900/40 hover:scale-[1.02] active:scale-[0.98]'
            }`}
            title={lang === 'ru' ? 'Запустить клиент игры Rust через Steam' : 'Launch Rust client via Steam'}
          >
            <div className={`w-3 h-3 rounded-full shrink-0 ${isPlaying ? 'bg-emerald-300 animate-ping' : 'bg-white/80 group-hover:scale-110'}`} />
            <Play size={16} className={`shrink-0 fill-current ${isPlaying ? 'animate-pulse' : ''}`} />
            
            <div className="text-left">
              <span className="block leading-none font-teko text-base sm:text-lg">
                {isPlaying 
                  ? (lang === 'ru' ? 'В ИГРЕ RUST' : 'IN RUST GAME') 
                  : (lang === 'ru' ? 'ИГРАТЬ В RUST' : 'PLAY RUST')}
              </span>
              <span className="block text-[9px] font-sans opacity-90 leading-tight">
                {isPlaying ? formatTimer(playDuration) : 'Steam Direct Launch'}
              </span>
            </div>
          </button>

          {/* Quick Connect Server Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setServerDropdownOpen(!serverDropdownOpen)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs transition-all cursor-pointer ${
                isLight 
                  ? 'bg-white hover:bg-neutral-50 border-neutral-300 text-neutral-800' 
                  : 'bg-[#121622] hover:bg-[#181e2e] border-[#222a3d] text-neutral-200'
              }`}
            >
              <Server size={14} className="text-red-500 shrink-0" />
              <div className="text-left max-w-[150px] sm:max-w-[200px] truncate">
                <span className="font-bold text-[11px] block truncate">
                  {selectedServer ? selectedServer.name : (lang === 'ru' ? 'Выбрать сервер...' : 'Pick Server...')}
                </span>
                <span className="text-[9px] text-neutral-400 block font-mono">
                  {selectedServer ? `${selectedServer.ip}:${selectedServer.port}` : 'Steam Connect'}
                </span>
              </div>
              <ChevronDown size={14} className="opacity-50 shrink-0" />
            </button>

            {/* Dropdown Menu */}
            {serverDropdownOpen && (
              <>
                <div 
                  className="fixed inset-0 z-30" 
                  onClick={() => setServerDropdownOpen(false)} 
                />
                <div className={`absolute left-0 top-full mt-1.5 w-72 rounded-xl border shadow-xl z-40 overflow-hidden font-mono ${
                  isLight 
                    ? 'bg-white border-neutral-300 text-neutral-800' 
                    : 'bg-[#0e121c] border-[#252f44] text-[#eef2f7]'
                }`}>
                  <div className="p-2 border-b border-neutral-700/20 text-[10px] font-bold uppercase text-neutral-400 flex items-center justify-between">
                    <span>{lang === 'ru' ? 'ИЗБРАННЫЕ СЕРВЕРЫ' : 'FAVORITE SERVERS'}</span>
                    <button 
                      onClick={() => { setServerDropdownOpen(false); onOpenSettings(); }}
                      className="text-red-400 hover:underline"
                    >
                      {lang === 'ru' ? 'Редактировать' : 'Edit'}
                    </button>
                  </div>
                  <div className="max-h-60 overflow-y-auto p-1.5 space-y-1">
                    {settings.favoriteServers.map(srv => {
                      const active = selectedServer?.id === srv.id;
                      return (
                        <div
                          key={srv.id}
                          onClick={() => handleSelectServer(srv)}
                          className={`p-2 rounded-lg text-xs cursor-pointer flex items-center justify-between transition-colors ${
                            active
                              ? 'bg-red-600 text-white font-bold'
                              : isLight ? 'hover:bg-neutral-100' : 'hover:bg-[#182030] text-neutral-300'
                          }`}
                        >
                          <div className="min-w-0 pr-2">
                            <div className="truncate font-bold">{srv.name}</div>
                            <div className="text-[10px] opacity-75 font-mono">{srv.ip}:{srv.port} • Ping: {srv.ping}ms</div>
                          </div>
                          {active && <Check size={14} className="shrink-0" />}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Center / Right: Launcher Tactical Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0 flex-wrap">
          
          {/* Tactical HUD Overlay Toggle */}
          <button
            onClick={onToggleHud}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer shadow-xs ${
              isHudOpen
                ? 'bg-red-600 text-white border-red-500 shadow-red-600/30 font-black'
                : isLight
                  ? 'bg-white hover:bg-neutral-100 border-neutral-300 text-neutral-700'
                  : 'bg-[#121622] hover:bg-[#181e2e] border-[#222a3d] text-neutral-300'
            }`}
            title={lang === 'ru' ? 'Открыть тактический оверлей поверх игры (Alt + O)' : 'Toggle In-game HUD Overlay (Alt + O)'}
          >
            <Target size={14} className={isHudOpen ? 'text-white' : 'text-red-500 shrink-0'} />
            <span className="text-[11px] font-teko text-sm uppercase">HUD OVERLAY</span>
            <span className={`text-[9px] px-1 py-0.2 rounded font-mono ${
              isHudOpen ? 'bg-black/40 text-amber-300' : 'bg-neutral-800 text-neutral-400'
            }`}>
              {settings.hudHotkey}
            </span>
          </button>

          {/* Launcher Settings Modal Trigger */}
          <button
            onClick={onOpenSettings}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
              isLight
                ? 'bg-white hover:bg-neutral-100 border-neutral-300 text-neutral-700'
                : 'bg-[#121622] hover:bg-[#181e2e] border-[#222a3d] text-neutral-300 hover:text-white'
            }`}
            title={lang === 'ru' ? 'Открыть настройки лаунчера и игры' : 'Open launcher & client settings'}
          >
            <Settings size={14} className="text-amber-400 shrink-0" />
            <span className="hidden sm:inline text-[11px] font-sans">
              {lang === 'ru' ? 'Настройки' : 'Settings'}
            </span>
          </button>

          {/* EAC Compatibility Pill */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold font-mono shrink-0">
            <ShieldCheck size={12} />
            <span>EAC SAFE</span>
          </div>

          {/* Launcher Version Pill */}
          <div className="hidden xl:flex items-center gap-1 px-2 py-1 rounded-lg bg-black/40 border border-white/10 text-neutral-400 text-[10px] font-mono shrink-0">
            <span>TAURI v{settings.appVersion}</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LauncherBar;
