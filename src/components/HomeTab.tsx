import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Lock, 
  ArrowRight, 
  ChevronRight, 
  Play, 
  ExternalLink, 
  Twitch, 
  Send, 
  Copy, 
  Check, 
  RefreshCw,
  Search,
  Activity,
  Smartphone,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { ItemImageOrFallback } from './IconUtils';
import { CustomUser } from '../types';

interface HomeTabProps {
  lang: 'ru' | 'en';
  onNavigate: (tab: any) => void;
  onOpenDonation?: () => void;
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
  twitchSettings: any;
  showJungleFeverSpoiler: boolean;
  onGenerateWallpaper: () => void;
  appTranslations: any;
  isVip: boolean;
  isOwner: boolean;
  isAdmin: boolean;
  currentUser?: CustomUser | null;
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
  isVip,
  isOwner,
  isAdmin,
  currentUser
}: HomeTabProps) {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedDiscord, setCopiedDiscord] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('rusty.lub_offers@bk.ru');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleCopyDiscord = () => {
    navigator.clipboard.writeText('eaccheater');
    setCopiedDiscord(true);
    setTimeout(() => setCopiedDiscord(false), 2000);
  };

  // Special access modules with genuine Rust item icon IDs (strictly gated)
  const hasSpecialAccess = Boolean(currentUser && (isVip || isOwner || isAdmin));
  const visibleSpecialCards = [
    ...(currentUser && isVip ? [{
      id: 'radar',
      iconId: 'rf_pager',
      title: 'Player Radar',
      desc: lang === 'ru' 
        ? 'Отслеживание врагов на серверах, истории онлайна и активности баз.' 
        : 'Track enemy player online status and server histories.',
      tag: 'VIP',
      isLocked: false,
      color: 'border-amber-200/80 hover:border-amber-500',
      badgeClass: 'bg-amber-500 text-black font-extrabold',
    }] : []),
    ...(currentUser && isOwner ? [{
      id: 'rustplus',
      iconId: 'smart.alarm',
      title: 'Rust+ Bot Hub',
      desc: lang === 'ru' 
        ? 'Удаленное управление умной базой: сирены рейда, турели, обогреватели.' 
        : 'Control smart devices, automatic sam sites, and raid sirens.',
      tag: 'OWNER',
      isLocked: false,
      color: 'border-red-200/80 hover:border-red-500',
      badgeClass: 'bg-red-600 text-white font-extrabold',
    }] : []),
    ...(currentUser && isAdmin ? [
      {
        id: 'admin',
        iconId: 'lock.code',
        title: lang === 'ru' ? 'Панель Админа' : 'Admin Panel & DB',
        desc: lang === 'ru' 
          ? 'Панель администратора проекта для управления новостями и модерации.' 
          : 'Site administration, user database management, and news publisher.',
        tag: 'ADMIN',
        isLocked: false,
        color: 'border-purple-200/80 hover:border-purple-500',
        badgeClass: 'bg-purple-600 text-white font-extrabold',
      },
      {
        id: 'icons',
        iconId: 'spraycan',
        title: lang === 'ru' ? 'Спрайты предметов' : 'Rust Icons Catalog',
        desc: lang === 'ru' 
          ? 'Полная библиотека внутриигровых спрайтов и кодов предметов.' 
          : 'Asset catalog of item sprite definitions and RustLabs image CDN IDs.',
        tag: 'ADMIN',
        isLocked: false,
        color: 'border-[#10b981]/20 hover:border-[#10b981]',
        badgeClass: 'bg-[#10b981] text-white font-extrabold',
      }
    ] : [])
  ];

  return (
    <div className="space-y-10 pb-16 text-left">
      
      {/* ── 1. PREMIUM SOFT LIGHT HERO SECTION ── */}
      <section className="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-8 md:p-10 shadow-[0_4px_30px_rgba(0,0,0,0.015)] relative overflow-hidden">
        {/* Glow Accent */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-red-500/[0.02] rounded-full blur-3xl pointer-events-none" />
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
          {/* Left Hero Column */}
          <div className="md:col-span-8 space-y-6">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-50 border border-red-100 text-[10px] font-bold uppercase tracking-wider text-red-600 rounded-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
              <span>{lang === 'ru' ? 'Светлый Дизайн v2.0' : 'Soft Light Layout v2.0'}</span>
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-neutral-900 leading-[1.1]">
                Win the wipe. <br className="hidden sm:inline" />
                <span className="text-red-600">Without the chaos.</span>
              </h1>
              <p className="text-sm sm:text-base text-neutral-600 font-normal leading-relaxed max-w-xl">
                {lang === 'ru'
                  ? 'Высокоточный набор утилит выживания для игроков Rust. Посчитайте оптимальный боезапас рейда, автоматизируйте внутриигровые бинды, настройте электронику и повысьте FPS в один клик.'
                  : 'Precision-engineered survival tools for professional Rust players. Calculate explosive costs, configure complex macro binds, design electrical grids, and optimize frames.'}
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => onNavigate('raid')}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-red-500/10 cursor-pointer flex items-center gap-1.5"
              >
                <span>{lang === 'ru' ? 'Начать бесплатно' : 'Start free'}</span>
                <ArrowRight size={13} />
              </button>

              <button
                onClick={() => onNavigate('tools')}
                className="px-6 py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border border-neutral-200 font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>{lang === 'ru' ? 'Все инструменты' : 'See tools'}</span>
              </button>
            </div>
          </div>

          {/* Right Hero Column: Authentic C4 Display item slot */}
          <div className="md:col-span-4 flex justify-center">
            <div className="relative p-6 bg-neutral-50 border border-neutral-200 rounded-2xl flex flex-col items-center text-center max-w-[240px] w-full shadow-sm">
              <div className="w-24 h-24 rounded-2xl bg-zinc-900 border-2 border-neutral-800 flex items-center justify-center shadow-inner relative overflow-hidden group mb-3">
                <ItemImageOrFallback id="timed_explosive" lang={lang} size={76} />
                <div className="absolute bottom-1 right-1.5 text-[8px] font-mono text-neutral-500 font-black">C4</div>
              </div>
              <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-neutral-400">
                TIMED EXPLOSIVE
              </span>
              <h3 className="text-xs font-bold text-neutral-800 mt-1">
                {lang === 'ru' ? 'Калькулятор Рейдов' : 'Raid Calculator'}
              </h3>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. FEATURED TOOLS BOXES (RAID, BINDS, FPS) ── */}
      <section className="space-y-4">
        <h2 className="text-xs font-black text-neutral-400 uppercase tracking-wider font-mono">
          {lang === 'ru' ? '🔥 ПОПУЛЯРНЫЕ РАЗДЕЛЫ' : '🔥 FEATURED PROTOCOLS'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Featured 1: Raid Calculator */}
          <div 
            onClick={() => onNavigate('raid')}
            className="bg-white border border-neutral-200 p-5 rounded-2xl shadow-[0_4px_15px_rgba(0,0,0,0.01)] hover:border-red-500 transition-all cursor-pointer flex items-start gap-4 group"
          >
            <div className="w-14 h-14 shrink-0 rounded-xl bg-zinc-900 border border-neutral-800 flex items-center justify-center shadow-inner overflow-hidden">
              <ItemImageOrFallback id="timed_explosive" lang={lang} size={46} />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-neutral-950 uppercase group-hover:text-red-600 transition-colors">
                {lang === 'ru' ? 'Калькулятор Рейда' : 'Raid Calculator'}
              </h3>
              <p className="text-xs text-neutral-500 leading-relaxed">
                {lang === 'ru' ? 'Расчёт C4, ракет и взрывчатки для штурма баз любой сложности.' : 'Calculate sulfur and raw resources needed for optimal base raiding.'}
              </p>
            </div>
          </div>

          {/* Featured 2: Keybinds Generator */}
          <div 
            onClick={() => onNavigate('binds')}
            className="bg-white border border-neutral-200 p-5 rounded-2xl shadow-[0_4px_15px_rgba(0,0,0,0.01)] hover:border-red-500 transition-all cursor-pointer flex items-start gap-4 group"
          >
            <div className="w-14 h-14 shrink-0 rounded-xl bg-zinc-900 border border-neutral-800 flex items-center justify-center shadow-inner overflow-hidden">
              <ItemImageOrFallback id="keycard_red" lang={lang} size={46} />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-neutral-950 uppercase group-hover:text-red-600 transition-colors">
                {lang === 'ru' ? 'Генератор Биндов' : 'Binds & Macros'}
              </h3>
              <p className="text-xs text-neutral-500 leading-relaxed">
                {lang === 'ru' ? 'Быстрый свап оружия, автоатака, бинды на двери и консольные фичи.' : 'Generate optimized F1 client console commands and macro binds.'}
              </p>
            </div>
          </div>

          {/* Featured 3: FPS Performance Optimizer */}
          <div 
            onClick={() => onNavigate('fps')}
            className="bg-white border border-neutral-200 p-5 rounded-2xl shadow-[0_4px_15px_rgba(0,0,0,0.01)] hover:border-red-500 transition-all cursor-pointer flex items-start gap-4 group"
          >
            <div className="w-14 h-14 shrink-0 rounded-xl bg-zinc-900 border border-neutral-800 flex items-center justify-center shadow-inner overflow-hidden">
              <ItemImageOrFallback id="computerstation" lang={lang} size={46} />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-neutral-950 uppercase group-hover:text-red-600 transition-colors">
                {lang === 'ru' ? 'Оптимизация FPS' : 'FPS Booster Guide'}
              </h3>
              <p className="text-xs text-neutral-500 leading-relaxed">
                {lang === 'ru' ? 'Гайды настроек графики, параметры запуска Steam и буст частоты кадров.' : 'Step-by-step performance optimization guidelines for maximum frame rate.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. SPECIAL ACCESS SECTIONS (ONLY VISIBLE IF AUTHORIZED WITH SPECIAL ACCESS) ── */}
      {hasSpecialAccess && visibleSpecialCards.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xs font-black text-neutral-400 uppercase tracking-wider font-mono">
            {lang === 'ru' ? '🔒 ОСОБЫЙ ДОСТУП' : '🔒 SPECIAL ACCESS GATED'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {visibleSpecialCards.map((card) => {
              const handleCardClick = () => {
                onNavigate(card.id);
              };

              return (
                <div 
                  key={card.id}
                  onClick={handleCardClick}
                  className={`bg-white border p-5 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.01)] hover:shadow-md cursor-pointer flex flex-col justify-between group transition-all duration-200 hover:-translate-y-0.5 ${card.color}`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3.5">
                      <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-neutral-800 flex items-center justify-center shadow-inner overflow-hidden group-hover:scale-105 transition-transform">
                        <ItemImageOrFallback id={card.iconId} lang={lang} size={36} />
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className={`px-2 py-0.5 rounded text-[9px] uppercase tracking-wide ${card.badgeClass}`}>
                          {card.tag}
                        </span>
                      </div>
                    </div>
                    <h3 className="text-base font-bold text-neutral-900 group-hover:text-red-600 transition-colors mb-1.5">
                      {card.title}
                    </h3>
                    <p className="text-xs text-neutral-500 leading-relaxed">
                      {card.desc}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-semibold text-neutral-600 group-hover:text-red-600">
                    <span>
                      {lang === 'ru' ? 'Открыть модуль' : 'Open Module'}
                    </span>
                    <ChevronRight size={14} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ── 4. SERVER MONITOR ── */}
      <section className="bg-white border border-neutral-200 rounded-2xl p-5 sm:p-6 space-y-4 text-left shadow-[0_4px_25px_rgba(0,0,0,0.01)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-100 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-600 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600" />
              </span>
              <h3 className="text-lg font-bold text-neutral-900">
                {selectedProject === 'rustymoose'
                  ? (lang === 'ru' ? 'Мониторинг серверов Rusty Moose' : 'Rusty Moose Server Monitor')
                  : (lang === 'ru' ? 'Мониторинг серверов Rustoria' : 'Rustoria Server Monitor')}
              </h3>
            </div>
            <p className="text-xs text-neutral-500">
              {lang === 'ru' 
                ? 'Онлайн, очереди и показатели серверов в реальном времени.' 
                : 'Real-time online counts, queues, and ping stats.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Project Switcher */}
            <div className="flex bg-neutral-100 p-0.5 border border-neutral-200 rounded-lg text-xs font-mono">
              <button
                onClick={() => {
                  onSelectProject('rustoria');
                  onRefreshServers('rustoria');
                }}
                className={`px-3 py-1 font-bold rounded-md cursor-pointer transition-all ${
                  selectedProject === 'rustoria'
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'text-neutral-500 hover:text-neutral-800'
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
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'text-neutral-500 hover:text-neutral-800'
                }`}
              >
                RUSTY MOOSE
              </button>
            </div>

            {/* Region Filter */}
            <div className="flex bg-neutral-100 p-0.5 border border-neutral-200 rounded-lg text-xs font-mono">
              {(['ALL', 'US', 'EU', 'SEA'] as const).map((reg, i) => (
                <button
                  key={`${reg}-${i}`}
                  onClick={() => onSetRegionFilter(reg)}
                  className={`px-2.5 py-1 font-bold rounded-md cursor-pointer transition-all ${
                    regionFilter === reg
                      ? 'bg-red-600 text-white shadow-sm'
                      : 'text-neutral-500 hover:text-neutral-800'
                  }`}
                >
                  {reg}
                </button>
              ))}
            </div>

            <button
              onClick={() => onRefreshServers(selectedProject)}
              disabled={loadingServers}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-neutral-800 bg-white border border-neutral-200 hover:border-red-600 transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw size={12} className={loadingServers ? 'animate-spin text-red-600' : ''} />
              <span>{lang === 'ru' ? 'Обновить' : 'Refresh'}</span>
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={14} />
          <input
            type="text"
            value={serverSearch}
            onChange={(e) => onSetServerSearch(e.target.value)}
            placeholder={lang === 'en' ? 'Search by server name, map, or IP...' : 'Поиск по названию, карте или IP...'}
            className="w-full bg-neutral-50 border border-neutral-200 focus:border-red-600 text-neutral-900 placeholder-neutral-400 pl-9 pr-4 py-2 rounded-lg outline-none transition-all text-xs font-mono"
          />
        </div>

        {/* Server List */}
        <div className="space-y-2">
          {rustoriaServers.length === 0 && loadingServers ? (
            <div className="py-8 text-center space-y-2">
              <RefreshCw size={20} className="animate-spin text-red-600 mx-auto" />
              <p className="text-xs text-neutral-500 font-mono">{lang === 'ru' ? 'Загрузка серверов...' : 'Loading servers...'}</p>
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

                  return (
                    <div
                      key={server.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 hover:border-red-600/60 transition-all gap-3"
                    >
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-sm text-neutral-900 truncate">
                            {server.name}
                          </span>
                          {server.wipeCycle && (
                            <span className="px-1.5 py-0.5 bg-red-50 text-red-600 text-[10px] font-mono font-bold rounded">
                              {server.wipeCycle}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-neutral-500 font-mono">
                          <span>IP: {server.ip}:{server.port}</span>
                          {server.map && <span>• {server.map}</span>}
                        </div>
                      </div>

                      <div className="flex items-center gap-4 shrink-0">
                        <div className="text-right font-mono">
                          <div className="text-xs font-bold text-neutral-900">
                            {server.players} / {server.maxPlayers}
                          </div>
                          {server.queued > 0 && (
                            <div className="text-[10px] text-amber-600">
                              +{server.queued} queue
                            </div>
                          )}
                        </div>

                        <button
                          onClick={() => onCopyServer(connectCmd, server.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                            isCopied
                              ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                              : 'bg-white text-neutral-600 hover:text-neutral-900 border border-neutral-200 hover:border-red-600'
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

      {/* ── 5. SUGGESTIONS AND CONTACT FEEDBACK ── */}
      <section className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-neutral-900">
              {lang === 'ru' ? '💡 Идеи и сотрудничество' : '💡 Suggestions & Collab'}
            </h3>
            <p className="text-xs text-neutral-500 leading-relaxed max-w-md">
              {lang === 'ru'
                ? 'Мы постоянно дорабатываем калькуляторы и добавляем новые фичи. Если у вас есть предложения или вы обнаружили баг — сообщите нам!'
                : 'We continuously expand our toolkit. If you have an idea, want to propose a new feature, or found an issue, please contact us!'}
            </p>
          </div>

          <div className="flex items-center justify-between gap-3 bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3">
            <div className="space-y-0.5">
              <div className="text-[9px] font-mono text-neutral-400 uppercase tracking-wider">
                {lang === 'ru' ? 'ОФИЦИАЛЬНЫЙ EMAIL ПРОЕКТА' : 'OFFICIAL PROJECT EMAIL'}
              </div>
              <span className="font-mono text-xs text-red-600 font-bold">
                rusty.lub_offers@bk.ru
              </span>
            </div>
            <button
              type="button"
              onClick={handleCopyEmail}
              className="p-2 hover:bg-neutral-200 text-neutral-500 hover:text-neutral-800 transition-colors cursor-pointer rounded-lg border border-neutral-200 bg-white shadow-sm"
              title={lang === 'ru' ? 'Копировать почту' : 'Copy email'}
            >
              {copiedEmail ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
            </button>
          </div>
        </div>
      </section>

      {/* ── 6. UNIFIED SOCIAL WIDGETS SECTION (BOTTOM OF HOME) ── */}
      <section className="space-y-4 pt-4 border-t border-neutral-200">
        <h2 className="text-xs font-black text-neutral-400 uppercase tracking-wider font-mono">
          {lang === 'ru' ? '📰 СОЦИАЛЬНАЯ АКТИВНОСТЬ И ВИДЖЕТЫ' : '📰 MEDIA & SOCIAL HUB'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Widget 1: Jungle Fever Solo Rust Movie */}
          <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.01)] flex flex-col justify-between group hover:border-red-500/40 transition-all">
            <div>
              <div className="relative mb-3.5 overflow-hidden border border-neutral-200 rounded-xl bg-neutral-100 aspect-video max-h-36">
                <img 
                  referrerPolicy="no-referrer" 
                  src="https://i.ytimg.com/vi/RxS0ISoktOY/maxresdefault.jpg" 
                  alt="Jungle Fever Part 1" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                />
                <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/75 text-white text-[8px] font-bold uppercase tracking-wider rounded flex items-center gap-1">
                  <span>🎬</span>
                  <span>{lang === 'ru' ? 'СЕРИЯ ФИЛЬМОВ' : 'MOVIE SERIES'}</span>
                </div>
              </div>
              <h4 className="text-sm font-bold text-neutral-900 uppercase mb-1.5 group-hover:text-red-600 transition-colors truncate">
                {lang === 'ru' ? 'Jungle Fever - Фильм Solo Rust' : 'Jungle Fever - Solo Rust Movie'}
              </h4>
              <p className="text-xs text-neutral-600 leading-relaxed mb-3 line-clamp-2">
                {lang === 'ru' ? 'Первая часть захватывающей серии фильмов Jungle Fever от Rusty.Lub!' : 'First part of the thrilling Jungle Fever movie series from Rusty.Lub!'}
              </p>
            </div>
            <div className="pt-2.5 border-t border-neutral-100">
              <button
                onClick={() => onNavigate('news')}
                className="w-full py-2 bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold uppercase tracking-widest cursor-pointer transition-all rounded-lg flex items-center justify-center gap-1.5"
              >
                <Play size={10} className="fill-white" />
                <span>{lang === 'ru' ? 'СМОТРЕТЬ ФИЛЬМ' : 'WATCH MOVIE'}</span>
              </button>
            </div>
          </div>

          {/* Widget 2: Teammate Finder Bot */}
          <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.01)] flex flex-col justify-between group hover:border-blue-500/40 transition-all">
            <div>
              <div className="relative mb-3.5 overflow-hidden border border-neutral-200 rounded-xl bg-gradient-to-br from-neutral-50 to-neutral-100 aspect-video max-h-36 flex items-center justify-center">
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
                <div className="absolute top-2 left-2 px-2 py-0.5 bg-blue-600 text-white text-[8px] font-bold uppercase tracking-wider rounded flex items-center gap-1">
                  <span>🤖</span>
                  <span>TELEGRAM BOT</span>
                </div>
              </div>
              <h4 className="text-sm font-bold text-neutral-900 uppercase mb-1.5 group-hover:text-blue-600 transition-colors truncate">
                {lang === 'ru' ? 'Поиск команды & LFG Бот' : 'Teammate & Clan Finder Bot'}
              </h4>
              <p className="text-xs text-neutral-600 leading-relaxed mb-3 line-clamp-2">
                {lang === 'ru' ? '@RustLFGBot — мгновенный поиск тиммейтов и набор в кланы прямо в Telegram.' : '@RustLFGBot — instant search for teammates and clan recruitment in Telegram.'}
              </p>
            </div>
            <div className="pt-2.5 border-t border-neutral-100">
              <button
                onClick={() => onNavigate('news')}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold uppercase tracking-widest cursor-pointer transition-all rounded-lg flex items-center justify-center gap-1.5"
              >
                <ExternalLink size={10} />
                <span>{lang === 'ru' ? 'ОТКРЫТЬ НОВОСТЬ' : 'READ NEWS'}</span>
              </button>
            </div>
          </div>

          {/* Widget 3: Developed by Rusty.Lub */}
          <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.01)] flex flex-col justify-between group hover:border-red-500/40 transition-all">
            <div>
              <div className="flex items-center gap-3 pb-3 border-b border-neutral-100 mb-3">
                <span className="text-3xl">👑</span>
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h4 className="text-sm font-bold text-neutral-900 uppercase">
                      {appTranslations.founderTitle[lang]}
                    </h4>
                    <span className="px-1.5 py-0.5 bg-red-50 text-red-600 text-[8px] font-bold rounded">
                      [EAC]
                    </span>
                  </div>
                  <p className="text-[10px] text-neutral-500 font-mono mt-0.5 uppercase tracking-wider">
                    {lang === 'ru' ? 'СОЗДАТЕЛЬ & РАЗРАБОТЧИК' : 'FOUNDER & SOLO DEV'}
                  </p>
                </div>
              </div>
              <p className="text-xs text-neutral-600 leading-relaxed mb-4 line-clamp-3">
                {appTranslations.founderDesc[lang]}
              </p>
            </div>
            <div className="space-y-2 pt-2 border-t border-neutral-100">
              <div className="flex items-center justify-between gap-1 text-[11px]">
                <a
                  href="https://t.me/S1mreyReserve"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-1.5 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 text-neutral-700 text-[10px] font-bold uppercase text-center rounded-lg flex items-center justify-center gap-1"
                >
                  <Send size={10} />
                  <span>Telegram</span>
                </a>
                <button
                  type="button"
                  onClick={handleCopyDiscord}
                  className={`flex-1 py-1.5 text-[10px] font-bold uppercase text-center rounded-lg flex items-center justify-center gap-1 border cursor-pointer ${
                    copiedDiscord 
                      ? 'bg-emerald-50 text-emerald-600 border-emerald-200' 
                      : 'bg-neutral-50 hover:bg-neutral-100 border-neutral-200 text-neutral-700'
                  }`}
                >
                  {copiedDiscord ? <Check size={10} className="text-emerald-600" /> : <Copy size={10} />}
                  <span>{copiedDiscord ? 'Copied' : 'Discord'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Widget 4: Patch Note Updates */}
          <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.01)] flex flex-col justify-between group hover:border-red-500/40 transition-all">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2 py-0.5 bg-red-50 border border-red-100 text-red-600 text-[9px] font-bold uppercase tracking-wider rounded">
                  {lang === 'ru' ? 'СВЕЖИЕ НОВОСТИ' : 'LATEST NEWS'}
                </span>
                <span className="text-[9px] font-mono text-neutral-400">02.07.2026</span>
              </div>
              <h4 className="text-sm font-bold text-neutral-900 uppercase mb-2">
                {lang === 'ru' ? 'Июльское обновление Rust' : 'July Rust Update'}
              </h4>
              <p className="text-xs text-neutral-600 leading-relaxed mb-4">
                {lang === 'ru'
                  ? 'Глобальный балансный патч Rust. Калькуляторы Rusty.Lub обновлены под актуальный урон и прочность всех строений.'
                  : 'Global Rust balance patch. All calculators updated for actual health and decay rates.'}
              </p>
            </div>
            <div className="pt-2.5 border-t border-neutral-100">
              <button
                onClick={() => onNavigate('news')}
                className="w-full py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-[10px] font-bold uppercase tracking-widest cursor-pointer transition-all rounded-lg flex items-center justify-center gap-1"
              >
                <span>{lang === 'ru' ? 'ЧИТАТЬ ОБНОВЛЕНИЕ' : 'READ PATCH LOG'}</span>
                <ChevronRight size={11} />
              </button>
            </div>
          </div>

          {/* Widget 5: Discord Hub */}
          <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.01)] flex flex-col justify-between group hover:border-indigo-500/40 transition-all">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[9px] font-bold uppercase tracking-wider rounded">
                  {lang === 'ru' ? 'ДИСКОРД ХАБ' : 'DISCORD COMMUNITY'}
                </span>
                <span className="text-[9px] font-mono text-neutral-400">ONLINE</span>
              </div>
              <h4 className="text-sm font-bold text-neutral-900 uppercase mb-2">
                {lang === 'ru' ? 'Официальный Discord-клиент' : 'Official Discord Server'}
              </h4>
              <p className="text-xs text-neutral-600 leading-relaxed mb-4">
                {lang === 'ru'
                  ? 'Присоединяйтесь к нашему серверу для общения с другими выжившими, поиска пати и получения эксклюзивных промокодов.'
                  : 'Join our server to chat with other survivors, find premium teammates, and receive VIP promo codes.'}
              </p>
            </div>
            <div className="pt-2.5 border-t border-neutral-100">
              <a
                href="https://discord.gg/R2TyKZ9xvZ"
                target="_blank"
                rel="noreferrer"
                className="w-full py-2 bg-[#5865f2] hover:bg-[#4752c4] text-white text-[10px] font-bold uppercase tracking-widest text-center rounded-lg flex items-center justify-center gap-1.5"
              >
                <span>🚀</span>
                <span>{lang === 'ru' ? 'ПРИСОЕДИНИТЬСЯ' : 'JOIN SERVER'}</span>
              </a>
            </div>
          </div>

          {/* Widget 6: Twitch Pro-Tip */}
          <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.01)] flex flex-col justify-between group hover:border-purple-500/40 transition-all">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2 py-0.5 bg-purple-50 text-purple-600 text-[9px] font-bold uppercase tracking-wider rounded">
                  {lang === 'ru' ? 'СОВЕТ ИГРОКАМ' : 'PRO-TIP'}
                </span>
                <span className="text-[9px] font-mono text-neutral-400">@tv_cheater</span>
              </div>
              <h4 className="text-sm font-bold text-neutral-900 uppercase mb-2">
                {lang === 'ru' ? 'Отслеживание стримов на Twitch' : 'Follow streams on Twitch'}
              </h4>
              <p className="text-xs text-neutral-600 leading-relaxed mb-4">
                {lang === 'ru'
                  ? 'Следите за штурмами баз, тактиками застройки и раздачами внутриигровых призов в реальном времени!'
                  : 'Watch base raids, defense tactics, and live giveaways on Twitch channel in real-time!'}
              </p>
            </div>
            <div className="pt-2.5 border-t border-neutral-100">
              <a
                href="https://www.twitch.tv/tv_cheater"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white text-[10px] font-bold uppercase tracking-widest text-center rounded-lg flex items-center justify-center gap-1.5"
              >
                <Twitch size={11} />
                <span>{lang === 'ru' ? 'ОТКРЫТЬ TWITCH' : 'WATCH TWITCH'}</span>
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* ── 7. TWITCH LIVE EMBED IF ACTIVE ── */}
      {twitchSettings && (twitchSettings.isManualLive || twitchSettings.isLiveFromApi) && (
        <section className="bg-white border border-purple-200 rounded-2xl p-6 shadow-[0_4px_25px_rgba(145,70,255,0.04)] relative overflow-hidden text-left">
          <div className="absolute top-0 left-0 right-0 h-1 bg-purple-600" />
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            <div className="space-y-3 flex-1">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                <span className="text-[9px] font-bold uppercase tracking-widest text-red-600 font-mono">
                  {lang === 'ru' ? 'ПРЯМОЙ ЭФИР' : 'LIVE BROADCAST'}
                </span>
                <span className="text-neutral-300 font-mono text-[9px]">•</span>
                <span className="text-[9px] font-bold uppercase tracking-widest text-purple-600 font-mono">
                  TWITCH
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="text-xl sm:text-2xl font-black text-neutral-950 uppercase leading-tight">
                  {twitchSettings.streamTitle || twitchSettings.apiTitle || (lang === 'ru' ? 'НАЧАЛСЯ СТРИМ!' : 'STREAM IS LIVE!')}
                </h3>
                <p className="text-xs text-neutral-600">
                  {lang === 'ru' ? 'Канал:' : 'Channel:'} <span className="text-purple-600 font-bold hover:underline cursor-pointer" onClick={() => window.open(`https://twitch.tv/${twitchSettings.channelName}`, '_blank')}>{twitchSettings.channelName}</span>
                </p>
              </div>

              <div className="pt-1">
                <a
                  href={`https://twitch.tv/${twitchSettings.channelName}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all cursor-pointer items-center gap-1.5"
                >
                  <Twitch size={11} />
                  <span>{lang === 'ru' ? 'ПЕРЕЙТИ НА КАНАЛ' : 'OPEN TWITCH CHANNEL'}</span>
                </a>
              </div>
            </div>

            <div className="w-full lg:w-[420px] aspect-video border border-neutral-200 rounded-xl bg-black relative overflow-hidden shrink-0">
              <iframe
                src={`https://player.twitch.tv/?channel=${twitchSettings.channelName}&parent=${window.location.hostname}&muted=false`}
                frameBorder="0"
                allowFullScreen={true}
                scrolling="no"
                className="w-full h-full"
              ></iframe>
            </div>
          </div>
        </section>
      )}

    </div>
  );
}
