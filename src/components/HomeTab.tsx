import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Flame, 
  Keyboard, 
  Settings, 
  UserPlus, 
  HelpCircle, 
  Search, 
  RefreshCw, 
  Copy, 
  Check, 
  Zap, 
  Sprout, 
  FlaskConical, 
  Pickaxe, 
  Clock, 
  ShieldAlert, 
  Layers,
  ArrowRight,
  ChevronRight,
  Play,
  ExternalLink,
  Twitch,
  Sparkles,
  Smartphone,
  Gamepad2,
  Send,
  Cpu,
  Compass,
  Image
} from 'lucide-react';
// @ts-ignore
import oilRigBg from '../assets/images/oil_rig_wallpaper_1783378845895.jpg';
import DiscordWidget from './DiscordWidget';

interface HomeTabProps {
  lang: 'ru' | 'en';
  onNavigate: (tab: any) => void;
  onOpenDonation?: () => void;
  // Server monitor props
  selectedProject: 'rustoria' | 'rustymoose';
  onSelectProject: (proj: 'rustoria' | 'rustymoose') => void;
  rustoriaServers: any[];
  loadingServers: boolean;
  onRefreshServers: (proj: 'rustoria' | 'rustymoose') => void;
  copiedServerId: string | null;
  onCopyServer: (cmd: string, id: string) => void;
  regionFilter: 'ALL' | 'US' | 'EU' | 'SEA';
  onSetRegionFilter: (reg: 'ALL' | 'US' | 'EU' | 'SEA') => void;
  serverSearch: string;
  onSetServerSearch: (search: string) => void;
  // Widgets props
  twitchSettings: any;
  showJungleFeverSpoiler: boolean;
  onGenerateWallpaper: () => void;
  appTranslations: any;
}

export default function HomeTab({
  lang,
  onNavigate,
  onOpenDonation,
  selectedProject,
  onSelectProject,
  rustoriaServers,
  loadingServers,
  onRefreshServers,
  copiedServerId,
  onCopyServer,
  regionFilter,
  onSetRegionFilter,
  serverSearch,
  onSetServerSearch,
  twitchSettings,
  showJungleFeverSpoiler,
  onGenerateWallpaper,
  appTranslations,
}: HomeTabProps) {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedDiscord, setCopiedDiscord] = useState(false);
  const handleCopyEmail = () => {
    navigator.clipboard.writeText('rusty.lub_offers@bk.ru');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <div className="space-y-12 pb-12">
      {/* ── 1. HERO SECTION (RESTORED OIL RIG HIGH-CONTRAST PANEL) ── */}
      <section 
        className="relative overflow-hidden border border-[#2a344a] p-6 sm:p-8 md:p-10 shadow-2xl text-left bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(13, 16, 24, 0.82), rgba(13, 16, 24, 0.94)), url(${oilRigBg})`
        }}
      >
        <div className="absolute top-0 left-0 right-0 h-1 rust-hazard" />
        
        {/* Corner Brackets */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#f97316]/60" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#f97316]/60" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#f97316]/60" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#f97316]/60" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          {/* Left Column: Title, Description, CTAs, Stats */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-black/60 border border-[#f97316]/30 text-xs font-mono font-bold uppercase tracking-widest text-[#f97316]">
              <span className="w-2 h-2 rounded-full bg-[#f97316] animate-pulse" />
              <span>{lang === 'ru' ? 'ТАКТИЧЕСКИЙ ПОРТАЛ' : 'TACTICAL COMMAND PROTOCOL'}</span>
            </div>

            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-wider text-white uppercase font-sans leading-none">
                RUSTY<span className="text-[#f97316]">.LUB</span>
              </h1>
              <p className="text-xs font-mono font-bold tracking-widest text-[#8b95a8] uppercase">
                {lang === 'ru' ? 'Ультимативный набор инструментов выживания' : 'Ultimate Survival & Raid Toolkit'}
              </p>
            </div>

            <p className="text-sm sm:text-base text-gray-200 leading-relaxed max-w-xl font-sans font-medium">
              {lang === 'ru'
                ? 'Добро пожаловать на RUSTY.LUB — профессиональный информационный хаб для игроков Rust. Здесь собраны высокоточные калькуляторы рейдов, инструменты для инженеров электрики, схемы фермерства, подробные руководства по оптимизации FPS и бинды для комфортного выживания.'
                : 'Welcome to RUSTY.LUB — professional information hub for Rust survivors. Explore high-fidelity raid calculators, decay timers, electrical grid simulators, berry genetics helpers, FPS optimization guides, and vital macro binds.'}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={() => onNavigate('raid')}
                className="px-5 py-3 bg-[#cd412b] hover:bg-[#b53723] border border-[#e6553f] text-white font-mono font-black text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer flex items-center gap-2"
              >
                <span>💥</span>
                <span>{lang === 'ru' ? 'РАСЧЁТ РЕЙДА' : 'CALCULATE RAID'}</span>
              </button>

              <button
                onClick={() => onNavigate('binds')}
                className="px-5 py-3 bg-[#111622]/90 hover:bg-[#151c2c] border border-[#2a344a] text-gray-200 hover:text-white font-mono font-black text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer flex items-center gap-2"
              >
                <span>⌨️</span>
                <span>{lang === 'ru' ? 'БИНДЫ' : 'BINDS & COMMANDS'}</span>
              </button>

              <button
                onClick={() => onNavigate('fps')}
                className="px-5 py-3 bg-[#111622]/90 hover:bg-[#151c2c] border border-[#2a344a] text-gray-200 hover:text-white font-mono font-black text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer flex items-center gap-2"
              >
                <span>📊</span>
                <span>{lang === 'ru' ? 'ОПТИМИЗАЦИЯ FPS' : 'FPS BOOST GUIDE'}</span>
              </button>
            </div>

            {/* Stats Row */}
            <div className="flex items-center gap-6 pt-4 border-t border-[#2a344a]/50 text-left">
              <div>
                <strong className="block text-xl font-mono font-black text-white">12+</strong>
                <span className="text-[10px] font-mono uppercase font-bold text-[#8b95a8] tracking-wider">{lang === 'ru' ? 'инструментов' : 'calculators'}</span>
              </div>
              <div className="h-6 w-[1px] bg-[#2a344a]" />
              <div>
                <strong className="block text-xl font-mono font-black text-white">50+</strong>
                <span className="text-[10px] font-mono uppercase font-bold text-[#8b95a8] tracking-wider">{lang === 'ru' ? 'руководств' : 'guides'}</span>
              </div>
              <div className="h-6 w-[1px] bg-[#2a344a]" />
              <div>
                <strong className="block text-xl font-mono font-black text-[#f97316]">24/7</strong>
                <span className="text-[10px] font-mono uppercase font-bold text-[#8b95a8] tracking-wider">{lang === 'ru' ? 'актуально' : 'real-time updates'}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Styled Suggestions Email Block */}
          <div className="lg:col-span-5">
            <div className="bg-[#0b0e14]/90 border border-[#2a344a] p-5 relative overflow-hidden flex flex-col justify-between h-full shadow-xl">
              <div className="rust-bracket-tl" />
              <div className="rust-bracket-tr" />
              <div className="rust-bracket-bl" />
              <div className="rust-bracket-br" />

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-lg">💡</span>
                  <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                    {lang === 'ru' ? 'ИДЕИ И ПРЕДЛОЖЕНИЯ' : 'SUGGESTIONS & COLLAB'}
                  </h4>
                </div>

                <p className="text-xs text-gray-300 leading-relaxed font-sans">
                  {lang === 'ru'
                    ? 'Мы постоянно улучшаем калькуляторы и добавляем новые фичи. Если у вас есть предложение, идея для нового инструмента или вы нашли ошибку — напишите нам напрямую!'
                    : 'We continuously expand our toolkit and optimize guides. If you have an idea, want to propose a new feature, or found a bug — submit it directly to our mailbox!'}
                </p>

                <div className="bg-black/40 border border-[#1e2633] p-3 space-y-2">
                  <div className="text-[9px] font-mono text-[#8b95a8] uppercase tracking-wider">
                    {lang === 'ru' ? 'ОФИЦИАЛЬНЫЙ EMAIL ПРОЕКТА:' : 'OFFICIAL CONTACT MAILBOX:'}
                  </div>
                  <div className="flex items-center justify-between gap-2 bg-[#12161e] border border-[#2a344a] px-3 py-2">
                    <span className="font-mono text-xs text-[#f97316] font-bold select-all truncate">
                      rusty.lub_offers@bk.ru
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyEmail}
                      className="p-1 hover:bg-[#2a344a]/50 text-gray-400 hover:text-white transition-colors cursor-pointer"
                      title={lang === 'ru' ? 'Копировать почту' : 'Copy email'}
                    >
                      {copiedEmail ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>

                <div className="text-[10px] font-mono text-zinc-500 text-center leading-relaxed">
                  {lang === 'ru' 
                    ? 'Или отправьте тикет через вкладку "Обратная связь"!' 
                    : 'Or open a ticket via the Comms & Feedback section!'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. WIDGETS SECTION (HOME EXCLUSIVE) ── */}
      <section className="space-y-6">
        {/* 2 Featured Promo Modules: Jungle Fever & Telegram LFG Bot (Compact sleek layout) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
          {/* Jungle Fever Spoiler Block */}
          {showJungleFeverSpoiler && (
            <div className="bg-[#0f131c]/95 border border-[#2a344a] hover:border-[#ff2a4d]/60 rounded-none p-3.5 sm:p-4 shadow-lg relative overflow-hidden flex flex-col justify-between group transition-all">
              <div className="hud-corner-tl" />
              <div className="hud-corner-tr" />
              <div className="hud-corner-bl" />
              <div className="hud-corner-br" />
              
              <div>
                <div className="relative mb-2.5 overflow-hidden border border-[#2a344a] bg-black/80 aspect-[21/9] sm:aspect-[16/7] max-h-28">
                  <img 
                    referrerPolicy="no-referrer" 
                    src="https://i.ytimg.com/vi/RxS0ISoktOY/maxresdefault.jpg" 
                    alt="Jungle Fever Part 1" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                  />
                  <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 bg-black/80 border border-[#ff2a4d]/50 text-[#ff2a4d] text-[8px] font-mono font-black uppercase tracking-wider flex items-center gap-1">
                    <span>🎬</span>
                    <span>{lang === 'ru' ? 'СЕРИЯ ФИЛЬМОВ' : 'MOVIE SERIES'}</span>
                  </div>
                </div>
                <h4 className="text-xs sm:text-sm font-black text-white font-sans uppercase mb-1 group-hover:text-[#ff2a4d] transition-colors truncate">
                  {lang === 'ru' ? 'Jungle Fever - Фильм Solo Rust' : 'Jungle Fever - Solo Rust Movie'}
                </h4>
                <p className="text-[11px] text-gray-300 font-sans mb-3 line-clamp-2 leading-relaxed">
                  {lang === 'ru' ? 'Первая часть захватывающей серии фильмов Jungle Fever!' : 'First part of the thrilling Jungle Fever movie series!'}
                </p>
              </div>
              <div className="flex items-center gap-2 pt-2 border-t border-[#2a344a]/50">
                <button
                  onClick={() => onNavigate('news')}
                  className="w-full py-2 bg-[#cd412b] hover:bg-[#b53723] text-white text-[9px] font-black uppercase tracking-widest font-mono cursor-pointer transition-all border border-[#e6553f] shadow-sm flex items-center justify-center gap-1.5"
                >
                  <Play size={10} className="fill-white" />
                  <span>{lang === 'ru' ? 'СМОТРЕТЬ ПЕРВУЮ ЧАСТЬ' : 'WATCH PART 1'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Rust LFG Bot Featured Banner */}
          <div className={`bg-[#0f131c]/95 border border-[#2a344a] hover:border-blue-500/60 rounded-none p-3.5 sm:p-4 shadow-lg relative overflow-hidden flex flex-col justify-between group transition-all ${!showJungleFeverSpoiler ? 'md:col-span-2' : ''}`}>
            <div className="hud-corner-tl" />
            <div className="hud-corner-tr" />
            <div className="hud-corner-bl" />
            <div className="hud-corner-br" />
            
            <div>
              <div className="relative mb-2.5 overflow-hidden border border-[#2a344a] bg-gradient-to-br from-[#0c1017] to-[#121824] aspect-[21/9] sm:aspect-[16/7] max-h-28 flex items-center justify-center">
                <img 
                  referrerPolicy="no-referrer" 
                  src="/rust_lfg_bot.png" 
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.src.includes('/images/rust_lfg_bot.png')) {
                      target.src = '/images/rust_lfg_bot.png';
                    }
                  }}
                  alt="Rust LFG Bot" 
                  className="h-full w-full object-contain p-2 group-hover:scale-105 transition-transform duration-300" 
                />
                <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 bg-black/80 border border-blue-400/50 text-blue-400 text-[8px] font-mono font-black uppercase tracking-wider flex items-center gap-1">
                  <span>🤖</span>
                  <span>TELEGRAM BOT</span>
                </div>
              </div>
              <h4 className="text-xs sm:text-sm font-black text-white font-sans uppercase mb-1 group-hover:text-blue-400 transition-colors flex items-center gap-1.5 truncate">
                <span>🤖</span>
                <span className="truncate">{lang === 'ru' ? 'Бот для поиска команды в Rust' : 'Teammate & Clan Finder Bot'}</span>
              </h4>
              <p className="text-[11px] text-gray-300 font-sans mb-3 line-clamp-2 leading-relaxed">
                {lang === 'ru' ? '@RustLFGBot — поиск тиммейтов и кланов прямо в Telegram.' : '@RustLFGBot — find teammates and clans directly in Telegram.'}
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2 border-t border-[#2a344a]/50">
              <button
                onClick={() => onNavigate('news')}
                className="w-full py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-[9px] font-black uppercase tracking-widest font-mono cursor-pointer transition-all border border-blue-400/50 shadow-sm flex items-center justify-center gap-1.5"
              >
                <ExternalLink size={10} />
                <span>{lang === 'ru' ? 'ПЕРЕЙТИ К НОВОСТИ' : 'READ FULL NEWS'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Twitch Live Stream Widget */}
        {twitchSettings && (twitchSettings.isManualLive || twitchSettings.isLiveFromApi) && (
          <div className="bg-[#14171e]/90 border-2 border-purple-600/50 rounded-none p-6 shadow-[0_0_25px_rgba(168,85,247,0.15)] relative overflow-hidden rust-metal-pattern">
            {/* Tactical Corner Brackets with purple hue */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-purple-500" />
            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-purple-500" />
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-purple-500" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-purple-500" />

            {/* Twitch Purple top header stripe */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 via-fuchsia-500 to-purple-600" />

            <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
              <div className="space-y-3 flex-1 text-left">
                {/* Live Badge */}
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  </span>
                  <span className="text-[9px] font-black uppercase tracking-widest text-red-500 font-mono">
                    {lang === 'ru' ? 'ПРЯМОЙ ЭФИР' : 'LIVE BROADCAST'}
                  </span>
                  <span className="text-gray-600 font-mono text-[9px]">•</span>
                  <span className="text-[9px] font-black uppercase tracking-widest text-purple-400 font-mono flex items-center gap-1">
                    <span>TWITCH</span>
                  </span>
                  {!!twitchSettings.viewerCount && twitchSettings.viewerCount > 0 && (
                    <>
                      <span className="text-gray-600 font-mono text-[9px]">•</span>
                      <span className="text-[9px] font-bold text-gray-300 font-mono">
                        👁️ {twitchSettings.viewerCount} {lang === 'ru' ? 'зрителей' : 'viewers'}
                      </span>
                    </>
                  )}
                </div>

                <div className="space-y-1">
                  <h3 className="text-xl sm:text-2xl font-black text-white uppercase leading-tight font-sans tracking-wide">
                    {twitchSettings.streamTitle || twitchSettings.apiTitle || (lang === 'ru' ? 'НАЧАЛСЯ СТРИМ!' : 'STREAM IS LIVE!')}
                  </h3>
                  <p className="text-xs text-zinc-400 font-mono">
                    {lang === 'ru' ? 'Канал:' : 'Channel:'} <span className="text-purple-400 font-bold hover:underline cursor-pointer" onClick={() => window.open(`https://twitch.tv/${twitchSettings.channelName}`, '_blank')}>{twitchSettings.channelName}</span>
                    {twitchSettings.gameName && ` • ${lang === 'ru' ? 'Категория' : 'Category'}: ${twitchSettings.gameName}`}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2.5 pt-1">
                  <a
                    href={`https://twitch.tv/${twitchSettings.channelName}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-[10px] font-black uppercase tracking-widest font-mono transition-all cursor-pointer flex items-center gap-1.5 shadow-lg shadow-purple-600/20 border border-purple-500"
                  >
                    <span className="text-xs">📺</span>
                    <span>{lang === 'ru' ? 'ПЕРЕЙТИ НА TWITCH КАНАЛ' : 'GO TO TWITCH CHANNEL'}</span>
                  </a>
                </div>
              </div>

              {/* Interactive Twitch Stream Frame embed */}
              <div className="w-full lg:w-[420px] aspect-video border border-purple-500/20 bg-black/50 relative overflow-hidden shrink-0">
                <iframe
                  src={`https://player.twitch.tv/?channel=${twitchSettings.channelName}&parent=${window.location.hostname}&muted=false`}
                  frameBorder="0"
                  allowFullScreen={true}
                  scrolling="no"
                  className="w-full h-full"
                ></iframe>
              </div>
            </div>
          </div>
        )}

        {/* Clan EAC Leader & Veteran Bio + Twitch Pro-Tip + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Left Column: Founder Bio + NEW Twitch Advice Tracker */}
          <div className="lg:col-span-8 space-y-4">
            {/* Biography card - Compact & Practical */}
            <div className="bg-[#11141c]/95 border border-[#2a344a] p-4 sm:p-5 shadow-xl relative overflow-hidden flex flex-col justify-between group text-left">
              <div className="hud-corner-tl" />
              <div className="hud-corner-tr" />
              <div className="hud-corner-bl" />
              <div className="hud-corner-br" />

              <div className="space-y-3">
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 border-b border-[#20293a]">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">👑</span>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="text-base sm:text-lg font-black text-white tracking-wider font-sans uppercase leading-none">
                          {appTranslations.founderTitle[lang]}
                        </h2>
                        <span className="px-1.5 py-0.5 bg-[#cd412b]/20 border border-[#cd412b]/50 text-[#ff4b36] text-[9px] font-bold font-mono">
                          [EAC]{'{'}CHEATER{'}'}
                        </span>
                        {/* Recruitment Status Badge */}
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 text-[8.5px] font-bold font-mono uppercase">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span>{lang === 'ru' ? 'НАБОР АКТИВЕН' : 'RECRUITMENT ACTIVE'}</span>
                        </span>
                      </div>

                      {/* In-game Roles Badges */}
                      <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                        <span className="text-[8px] font-mono uppercase font-bold text-zinc-500">
                          {lang === 'ru' ? 'РОЛИ:' : 'ROLES:'}
                        </span>
                        <span className="px-1.5 py-0.2 bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[8.5px] font-mono font-bold">
                          🏗️ BUILDER
                        </span>
                        <span className="px-1.5 py-0.2 bg-red-500/10 border border-red-500/30 text-red-400 text-[8.5px] font-mono font-bold">
                          💥 RAID LEADER
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Compact Rust Survival Stats HUD */}
                  <div className="flex items-center gap-3 bg-[#0a0d14] px-2.5 py-1 border border-[#222a38] text-[9px] font-mono">
                    <div className="flex items-center gap-1.5">
                      <span className="text-orange-400">🥩 FOOD</span>
                      <span className="font-bold text-white">250</span>
                    </div>
                    <span className="text-gray-700">|</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-blue-400">💧 WATER</span>
                      <span className="font-bold text-white">250</span>
                    </div>
                    <span className="text-gray-700">|</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-emerald-400">☢️ RADS</span>
                      <span className="font-bold text-emerald-400">0</span>
                    </div>
                  </div>
                </div>

                {/* Brief Bio */}
                <p className="text-[11.5px] text-gray-300 leading-relaxed font-sans">
                  {appTranslations.founderDesc[lang]}
                </p>

                {/* Compact 3-Column Metrics Grid */}
                <div className="grid grid-cols-3 gap-2.5 pt-0.5">
                  <div className="bg-[#161a24] p-2 border border-[#263044] text-center">
                    <span className="block text-[8.5px] text-gray-400 uppercase font-mono font-bold tracking-wider mb-0.5">
                      {appTranslations.hoursCount[lang]}
                    </span>
                    <span className="text-sm sm:text-base font-black text-white font-mono">12 000+</span>
                  </div>

                  <div className="bg-[#161a24] p-2 border border-[#263044] text-center">
                    <span className="block text-[8.5px] text-gray-400 uppercase font-mono font-bold tracking-wider mb-0.5">
                      {lang === 'ru' ? 'РАЗРАБОТКА' : 'DEV STATUS'}
                    </span>
                    <span className="text-sm sm:text-base font-black text-blue-400 font-mono">Solo Dev</span>
                  </div>

                  <div className="bg-[#161a24] p-2 border border-[#263044] text-center">
                    <span className="block text-[8.5px] text-gray-400 uppercase font-mono font-bold tracking-wider mb-0.5">
                      {appTranslations.vacStatus[lang]}
                    </span>
                    <span className="text-sm sm:text-base font-black text-emerald-400 font-mono">{appTranslations.vacSafe[lang]}</span>
                  </div>
                </div>

                {/* Author Contact / Cooperation & Bug Reports Bar */}
                <div className="bg-[#0c1017] border border-[#20293a] p-2.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-300">
                    <span className="text-[#cd412b] font-bold">📩</span>
                    <span className="font-bold uppercase text-zinc-400">
                      {lang === 'ru' ? 'Связь / Сотрудничество / Баги:' : 'Contact / Collab / Bugs:'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <a
                      href="https://t.me/S1mreyReserve"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-sky-500/15 hover:bg-sky-500 hover:text-white text-sky-400 text-[9.5px] font-mono font-bold uppercase tracking-wider transition-all border border-sky-500/30"
                    >
                      <Send size={10} />
                      <span>Telegram: @S1mreyReserve</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText('eaccheater');
                        setCopiedDiscord(true);
                        setTimeout(() => setCopiedDiscord(false), 2000);
                      }}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 text-[9.5px] font-mono font-bold uppercase tracking-wider transition-all border cursor-pointer ${
                        copiedDiscord 
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50' 
                          : 'bg-[#5865f2]/15 hover:bg-[#5865f2] hover:text-white text-[#8891f2] border-[#5865f2]/30'
                      }`}
                    >
                      {copiedDiscord ? <Check size={10} className="text-emerald-400" /> : <Copy size={10} />}
                      <span>{copiedDiscord ? (lang === 'ru' ? 'СКОПИРОВАНО!' : 'COPIED!') : 'Discord: eaccheater'}</span>
                    </button>
                  </div>
                </div>

                {/* Action buttons row */}
                <div className="flex flex-wrap items-center gap-2 pt-0.5">
                  <button
                    id="steam-profile-btn"
                    disabled
                    title={lang === 'ru' ? 'Временно недоступно' : 'Temporarily unavailable'}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500 bg-[#12141a] border border-[#1f2637] opacity-60 cursor-not-allowed select-none shadow-sm"
                  >
                    <Gamepad2 size={12} className="text-zinc-500" />
                    <span>{lang === 'ru' ? 'Steam Профиль' : 'Steam Profile'}</span>
                    <span className="text-[8px] px-1 py-0.2 bg-zinc-800 text-zinc-400 border border-zinc-700">
                      {lang === 'ru' ? 'СКОРО' : 'SOON'}
                    </span>
                  </button>

                  <a
                    href="https://www.twitch.tv/tv_cheater/about"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-purple-300 bg-[#6441a5]/15 hover:bg-[#6441a5] hover:text-white transition-all border border-[#6441a5]/40 shadow-sm"
                  >
                    <Twitch size={12} className="text-purple-400" />
                    <span>{lang === 'ru' ? 'Twitch Канал' : 'Twitch Channel'}</span>
                    <ExternalLink size={9} className="opacity-75" />
                  </a>

                  <button
                    onClick={onGenerateWallpaper}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 hover:bg-amber-500 hover:text-black transition-all border border-amber-500/30 shadow-sm cursor-pointer lg:ml-auto"
                  >
                    <Sparkles size={12} />
                    <span>{lang === 'ru' ? 'Обои Rust' : 'Rust Wallpaper'}</span>
                  </button>
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-[#20293a] flex items-center justify-between flex-wrap gap-2 text-[10px] text-gray-500 font-mono">
                <span>{appTranslations.copyright[lang]}</span>
                <a
                  href="https://discord.gg/R2TyKZ9xvZ"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[#ff4b36] hover:underline font-bold uppercase"
                >
                  <span>{appTranslations.joinClan[lang]}</span>
                  <ExternalLink size={10} />
                </a>
              </div>
            </div>

            {/* NEW Compact & Practical Widget: Совет начать отслеживать стримы на Twitch */}
            <div className="bg-gradient-to-r from-[#141224] via-[#101322] to-[#141224] border border-[#6441a5]/50 hover:border-[#9146ff] p-4 sm:p-5 shadow-xl relative overflow-hidden group transition-all text-left">
              <div className="hud-corner-tl" />
              <div className="hud-corner-tr" />
              <div className="hud-corner-bl" />
              <div className="hud-corner-br" />

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-[#6441a5]/20 border border-[#9146ff]/40 text-[#a970ff] shrink-0">
                    <Twitch size={18} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 bg-[#9146ff]/20 text-[#bf94ff] border border-[#9146ff]/30 uppercase">
                        {lang === 'ru' ? 'СОВЕТ ИГРОКАМ' : 'PRO-TIP'}
                      </span>
                      <span className="flex items-center gap-1 text-[9px] text-purple-300 font-mono">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#9146ff] animate-ping" />
                        tv_cheater
                      </span>
                    </div>
                    <h3 className="text-sm sm:text-base font-black text-white uppercase font-sans tracking-wide mt-0.5">
                      {lang === 'ru' ? 'Совет: Начните отслеживать стримы на Twitch канале' : 'Tip: Start Following Live Streams on Twitch'}
                    </h3>
                  </div>
                </div>

                <a
                  href="https://www.twitch.tv/tv_cheater"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 bg-[#9146ff] hover:bg-[#772ce8] text-white text-[10px] font-mono font-black uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-md shadow-[#9146ff]/20 border border-[#a970ff] shrink-0"
                >
                  <Twitch size={11} />
                  <span>{lang === 'ru' ? 'ОТСЛЕЖИВАТЬ КАНАЛ' : 'FOLLOW ON TWITCH'}</span>
                  <ExternalLink size={10} />
                </a>
              </div>

              {/* Practical Benefits 3-Point Checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-[11px] text-zinc-300 font-sans text-left">
                <div className="bg-black/30 border border-[#2b2247] p-2.5 flex items-start gap-2">
                  <span className="text-purple-400 font-bold">⚡</span>
                  <div>
                    <span className="font-bold text-white block text-[10.5px] uppercase font-mono">
                      {lang === 'ru' ? 'Старты вайпов и рейды' : 'Wipe Days & Raids'}
                    </span>
                    <span className="text-[10px] text-zinc-400 leading-tight block mt-0.5">
                      {lang === 'ru' ? 'Смотрите штурмы баз и тактики выживания в реальном времени' : 'Watch real-time base raids, defenses, and live tactics'}
                    </span>
                  </div>
                </div>

                <div className="bg-black/30 border border-[#2b2247] p-2.5 flex items-start gap-2">
                  <span className="text-purple-400 font-bold">🎯</span>
                  <div>
                    <span className="font-bold text-white block text-[10.5px] uppercase font-mono">
                      {lang === 'ru' ? 'Фишки и схемы баз' : 'Base Builds & Tips'}
                    </span>
                    <span className="text-[10px] text-zinc-400 leading-tight block mt-0.5">
                      {lang === 'ru' ? 'Разборы спреев, схем электрики и оптимизации ресурсов' : 'Recoil breakdowns, electrical setups & cost optimization'}
                    </span>
                  </div>
                </div>

                <div className="bg-black/30 border border-[#2b2247] p-2.5 flex items-start gap-2">
                  <span className="text-purple-400 font-bold">🎁</span>
                  <div>
                    <span className="font-bold text-white block text-[10.5px] uppercase font-mono">
                      {lang === 'ru' ? 'Дропы и розыгрыши' : 'Drops & Giveaways'}
                    </span>
                    <span className="text-[10px] text-zinc-400 leading-tight block mt-0.5">
                      {lang === 'ru' ? 'Включайте колокольчик, чтобы не пропускать подарки и закрытые паки' : 'Turn on the bell notification for exclusive viewer drops'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: News & Updates + Discord Widget */}
          <div className="lg:col-span-4 space-y-4">
            {/* News & Updates Widget - Compact & Practical */}
            <div className="bg-[#11141c]/95 border border-[#2a344a] p-4 shadow-xl relative overflow-hidden group text-left">
              <div className="hud-corner-tl" />
              <div className="hud-corner-tr" />
              <div className="hud-corner-bl" />
              <div className="hud-corner-br" />

              {/* Top Hazard Warning Stripe */}
              <div className="absolute top-0 left-0 right-0 h-0.5 rust-hazard" />

              <div className="space-y-3">
                {/* Flashing Alert Indicator */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 bg-[#cd412b]/15 border border-[#cd412b]/40 px-2 py-0.5 text-[8px] font-black uppercase tracking-widest text-[#ff4b36] font-mono">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#ff4b36]"></span>
                    </span>
                    <span>{lang === 'ru' ? 'СВЕЖИЕ НОВОСТИ' : 'LATEST NEWS'}</span>
                  </div>
                  <span className="text-[8.5px] font-mono text-gray-500 font-bold uppercase">FEED_v2.6</span>
                </div>

                <div className="space-y-0.5">
                  <h3 className="text-xs sm:text-sm font-black text-white tracking-wider font-mono uppercase">
                    {lang === 'ru' ? 'Новости и обновления Rust' : 'Rust News & Updates'}
                  </h3>
                  <div className="h-[1px] w-8 bg-[#cd412b]" />
                </div>

                {/* July Update Promo */}
                <div className="bg-[#171b26] border border-[#222a38] p-3 space-y-1.5 relative text-left">
                  <div className="flex items-center justify-between">
                    <span className="text-[8px] text-[#ff4b36] font-mono font-bold uppercase tracking-wider">
                      UPDATE 2026
                    </span>
                    <span className="text-[7.5px] font-mono text-gray-500">02.07.2026</span>
                  </div>
                  <h4 className="text-[11.5px] font-black text-white uppercase tracking-wide leading-snug">
                    {lang === 'ru' 
                      ? 'Июльское обновление Rust & Функции Rusty.Lub' 
                      : 'July Rust Update & Rusty.Lub Features'}
                  </h4>
                  <p className="text-[10px] text-gray-400 font-sans leading-relaxed line-clamp-3">
                    {lang === 'ru'
                      ? 'Глобальный патч Rust. Калькуляторы обновлены под актуальный баланс, улучшена скорость загрузки и добавлен кастомный фон визитки в кабинете!'
                      : 'Global Rust patch. Calculators updated for current balance, improved load speeds, and custom card backgrounds added!'}
                  </p>
                </div>

                <button
                  onClick={() => onNavigate('news')}
                  className="w-full flex items-center justify-center gap-1.5 py-2 bg-[#cd412b] hover:bg-[#b03825] text-white text-[9px] font-mono font-black uppercase tracking-widest transition-all cursor-pointer border border-[#e6553f] shadow-sm"
                >
                  <span>{lang === 'ru' ? 'ЧИТАТЬ ОБНОВЛЕНИЕ' : 'READ PATCH LOG'}</span>
                  <ChevronRight size={11} />
                </button>
              </div>
            </div>

            {/* Discord Widget */}
            <DiscordWidget lang={lang} />
          </div>
        </div>
      </section>

      {/* ── 3. TOOLS GRID SECTION ── */}
      <section className="space-y-5 text-left">
        <div className="space-y-1">
          <div className="text-xs font-bold uppercase tracking-wider text-[#f97316]">
            {lang === 'ru' ? 'Инструменты' : 'Tools'}
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#eef2f7]">
            {lang === 'ru' ? 'Всё для доминирования на вайпе' : 'Everything for wipe domination'}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            onClick={() => onNavigate('raid')}
            className="p-5 rounded-xl bg-[#12161e] border border-[#1e2633] hover:border-[#f97316] transition-all duration-200 hover:-translate-y-1 hover:shadow-xl cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-xl bg-[#f97316]/10 flex items-center justify-center text-xl mb-3.5">
              💥
            </div>
            <h3 className="text-base font-bold text-[#eef2f7] group-hover:text-[#f97316] transition-colors mb-1">
              Raid Calculator
            </h3>
            <p className="text-xs text-[#8b95a8] leading-relaxed">
              {lang === 'ru' ? 'Стоимость рейда по типу стен и дверей' : 'Raid costs by wall and door types'}
            </p>
          </div>

          <div
            onClick={() => onNavigate('ecoraid')}
            className="p-5 rounded-xl bg-[#12161e] border border-[#1e2633] hover:border-[#f97316] transition-all duration-200 hover:-translate-y-1 hover:shadow-xl cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-xl bg-[#f97316]/10 flex items-center justify-center text-xl mb-3.5">
              🌿
            </div>
            <h3 className="text-base font-bold text-[#eef2f7] group-hover:text-[#f97316] transition-colors mb-1">
              Eco-Raid & Weak Side
            </h3>
            <p className="text-xs text-[#8b95a8] leading-relaxed">
              {lang === 'ru' ? 'Слабые стороны и эконом-рейд' : 'Soft side exploitation and cheap raid routes'}
            </p>
          </div>

          <div
            onClick={() => onNavigate('decay')}
            className="p-5 rounded-xl bg-[#12161e] border border-[#1e2633] hover:border-[#f97316] transition-all duration-200 hover:-translate-y-1 hover:shadow-xl cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-xl bg-[#f97316]/10 flex items-center justify-center text-xl mb-3.5">
              ⏱️
            </div>
            <h3 className="text-base font-bold text-[#eef2f7] group-hover:text-[#f97316] transition-colors mb-1">
              Decay Timer
            </h3>
            <p className="text-xs text-[#8b95a8] leading-relaxed">
              {lang === 'ru' ? 'Таймеры гниения построек без TC' : 'Decay calculation for buildings without TC'}
            </p>
          </div>

          <div
            onClick={() => onNavigate('electrical')}
            className="p-5 rounded-xl bg-[#12161e] border border-[#1e2633] hover:border-[#f97316] transition-all duration-200 hover:-translate-y-1 hover:shadow-xl cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-xl bg-[#f97316]/10 flex items-center justify-center text-xl mb-3.5">
              ⚡
            </div>
            <h3 className="text-base font-bold text-[#eef2f7] group-hover:text-[#f97316] transition-colors mb-1">
              Electricity
            </h3>
            <p className="text-xs text-[#8b95a8] leading-relaxed">
              {lang === 'ru' ? 'Схемы и расчёты энергии турелей и ловушек' : 'Circuit setups for traps, batteries & turrets'}
            </p>
          </div>

          <div
            onClick={() => onNavigate('mixing')}
            className="p-5 rounded-xl bg-[#12161e] border border-[#1e2633] hover:border-[#f97316] transition-all duration-200 hover:-translate-y-1 hover:shadow-xl cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-xl bg-[#f97316]/10 flex items-center justify-center text-xl mb-3.5">
              🧪
            </div>
            <h3 className="text-base font-bold text-[#eef2f7] group-hover:text-[#f97316] transition-colors mb-1">
              Mixing Table (Tea)
            </h3>
            <p className="text-xs text-[#8b95a8] leading-relaxed">
              {lang === 'ru' ? 'Рецепты чаёв, баффов и крафта' : 'Tea recipes, buff multipliers and crafting'}
            </p>
          </div>

          <div
            onClick={() => onNavigate('breeder')}
            className="p-5 rounded-xl bg-[#12161e] border border-[#1e2633] hover:border-[#f97316] transition-all duration-200 hover:-translate-y-1 hover:shadow-xl cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-xl bg-[#f97316]/10 flex items-center justify-center text-xl mb-3.5">
              🌾
            </div>
            <h3 className="text-base font-bold text-[#eef2f7] group-hover:text-[#f97316] transition-colors mb-1">
              Farming & Genetics
            </h3>
            <p className="text-xs text-[#8b95a8] leading-relaxed">
              {lang === 'ru' ? 'Генетика ягод, клоны и автополив' : 'Berry genetics, cloning and irrigation setups'}
            </p>
          </div>
        </div>
      </section>

      {/* ── 4. SERVER MONITOR SECTION ── */}
      <section className="bg-[#12161e] border border-[#1e2633] rounded-2xl p-5 sm:p-6 space-y-4 text-left shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1e2633] pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#f97316] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#f97316]" />
              </span>
              <h3 className="text-lg font-bold text-[#eef2f7]">
                {selectedProject === 'rustymoose'
                  ? (lang === 'ru' ? 'Мониторинг серверов Rusty Moose' : 'Rusty Moose Server Monitor')
                  : (lang === 'ru' ? 'Мониторинг серверов Rustoria' : 'Rustoria Server Monitor')}
              </h3>
            </div>
            <p className="text-xs text-[#8b95a8]">
              {lang === 'ru' 
                ? 'Онлайн, очереди и показатели серверов в реальном времени.' 
                : 'Real-time online counts, queues, and ping stats.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Project Switcher */}
            <div className="flex bg-[#08090c] p-0.5 border border-[#1e2633] rounded-lg text-xs font-mono">
              <button
                onClick={() => {
                  onSelectProject('rustoria');
                  onRefreshServers('rustoria');
                }}
                className={`px-3 py-1 font-bold rounded-md cursor-pointer transition-all ${
                  selectedProject === 'rustoria'
                    ? 'bg-[#f97316] text-white shadow-sm'
                    : 'text-[#8b95a8] hover:text-white'
                }`}
              >
                RUSTORIA
              </button>
              <button
                onClick={() => {
                  onSelectProject('rustymoose');
                  onRefreshServers('rustymoose');
                }}
                className={`px-3 py-1 font-bold rounded-md cursor-pointer transition-all ${
                  selectedProject === 'rustymoose'
                    ? 'bg-[#f97316] text-white shadow-sm'
                    : 'text-[#8b95a8] hover:text-white'
                }`}
              >
                RUSTY MOOSE
              </button>
            </div>

            {/* Region Filter */}
            <div className="flex bg-[#08090c] p-0.5 border border-[#1e2633] rounded-lg text-xs font-mono">
              {(['ALL', 'US', 'EU', 'SEA'] as const).map((reg, i) => (
                <button
                  key={`${reg}-${i}`}
                  onClick={() => onSetRegionFilter(reg)}
                  className={`px-2.5 py-1 font-bold rounded-md cursor-pointer transition-all ${
                    regionFilter === reg
                      ? 'bg-[#f97316] text-white'
                      : 'text-[#8b95a8] hover:text-white'
                  }`}
                >
                  {reg}
                </button>
              ))}
            </div>

            <button
              onClick={() => onRefreshServers(selectedProject)}
              disabled={loadingServers}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#eef2f7] bg-[#171c26] border border-[#1e2633] hover:border-[#f97316] transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw size={12} className={loadingServers ? 'animate-spin text-[#f97316]' : ''} />
              <span>{lang === 'ru' ? 'Обновить' : 'Refresh'}</span>
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5a6578]" size={14} />
          <input
            type="text"
            value={serverSearch}
            onChange={(e) => onSetServerSearch(e.target.value)}
            placeholder={lang === 'en' ? 'Search by server name, map, or IP...' : 'Поиск по названию, карте или IP...'}
            className="w-full bg-[#08090c] border border-[#1e2633] focus:border-[#f97316] text-[#eef2f7] placeholder-[#5a6578] pl-9 pr-4 py-2 rounded-lg outline-none transition-all text-xs font-mono"
          />
        </div>

        {/* Server List */}
        <div className="space-y-2">
          {rustoriaServers.length === 0 && loadingServers ? (
            <div className="py-8 text-center space-y-2">
              <RefreshCw size={20} className="animate-spin text-[#f97316] mx-auto" />
              <p className="text-xs text-[#8b95a8] font-mono">{lang === 'ru' ? 'Загрузка серверов...' : 'Loading servers...'}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-2">
              {rustoriaServers
                .filter((server) => {
                  const matchesRegion = regionFilter === 'ALL' || 
                    server.name?.toLowerCase().includes(`-${regionFilter.toLowerCase()}`) || 
                    server.name?.toLowerCase().includes(` ${regionFilter.toLowerCase()} `) ||
                    server.id?.toLowerCase().includes(`-${regionFilter.toLowerCase()}`);
                  const matchesSearch = serverSearch === '' || 
                    server.name?.toLowerCase().includes(serverSearch.toLowerCase()) ||
                    server.ip?.toLowerCase().includes(serverSearch.toLowerCase());
                  return matchesRegion && matchesSearch;
                })
                .slice(0, 6)
                .map((server) => {
                  const connectCmd = `connect ${server.ip}:${server.port}`;
                  const isCopied = copiedServerId === server.id;
                  const progressPercent = Math.min(100, Math.max(0, (server.players / (server.maxPlayers || 1)) * 100));

                  return (
                    <div
                      key={server.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl bg-[#0d1016] border border-[#1e2633] hover:border-[#f97316]/60 transition-all gap-3"
                    >
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-sm text-[#eef2f7] truncate">
                            {server.name}
                          </span>
                          {server.wipeCycle && (
                            <span className="px-1.5 py-0.5 bg-[#f97316]/10 text-[#f97316] text-[10px] font-mono font-bold rounded">
                              {server.wipeCycle}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-[#8b95a8] font-mono">
                          <span>IP: {server.ip}:{server.port}</span>
                          {server.map && <span>• {server.map}</span>}
                        </div>
                      </div>

                      <div className="flex items-center gap-4 shrink-0">
                        <div className="text-right font-mono">
                          <div className="text-xs font-bold text-[#eef2f7]">
                            {server.players} / {server.maxPlayers}
                          </div>
                          {server.queued > 0 && (
                            <div className="text-[10px] text-amber-400">
                              +{server.queued} queue
                            </div>
                          )}
                        </div>

                        <button
                          onClick={() => onCopyServer(connectCmd, server.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                            isCopied
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                              : 'bg-[#171c26] text-[#8b95a8] hover:text-white border border-[#1e2633] hover:border-[#f97316]'
                          }`}
                        >
                          {isCopied ? <Check size={12} /> : <Copy size={12} />}
                          <span>{isCopied ? (lang === 'ru' ? 'Скопировано!' : 'Copied!') : 'connect'}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </section>

      {/* ── 5. CTA BAND SECTION ── */}
      <section className="rounded-2xl bg-gradient-to-r from-[#1a0e08] via-[#12161e] to-[#12161e] border border-[#f97316]/30 p-8 sm:p-10 shadow-2xl text-left">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <h2 className="text-2xl sm:text-3xl font-black text-[#eef2f7]">
              {lang === 'ru' ? 'Готов к следующему вайпу?' : 'Ready for the next wipe?'}
            </h2>
            <p className="text-sm text-[#8b95a8]">
              {lang === 'ru'
                ? 'Посчитай рейд и сохрани бинды за 2 минуты.'
                : 'Calculate raid cost and configure your binds in 2 minutes.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigate('raid')}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#f97316] to-[#ea580c] hover:from-[#ea580c] hover:to-[#c2410c] text-white font-bold text-sm tracking-wide shadow-lg shadow-[#f97316]/25 hover:-translate-y-0.5 transition-all cursor-pointer"
            >
              {lang === 'ru' ? 'Начать сейчас' : 'Start Now'}
            </button>
            <button
              onClick={() => onNavigate('faq')}
              className="px-6 py-3 rounded-xl border border-[#1e2633] hover:border-[#f97316] bg-[#12161e] hover:bg-[#171c26] text-[#eef2f7] font-semibold text-sm tracking-wide transition-all cursor-pointer"
            >
              {lang === 'ru' ? 'FAQ для новичков' : 'Beginner FAQ'}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
