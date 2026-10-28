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
import logoFull from '../../logo-full.png';

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
  appTheme?: 'dark' | 'light';
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
  currentUser,
  appTheme = 'dark'
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
      color: 'border-orange-200/80 hover:border-orange-500',
      badgeClass: 'bg-orange-500 text-black font-extrabold',
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
      color: 'border-orange-500/30 hover:border-orange-500',
      badgeClass: 'bg-orange-500 text-white font-extrabold',
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
        color: 'border-orange-200/80 hover:border-orange-500',
        badgeClass: 'bg-orange-600 text-white font-extrabold',
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
    <div className="industrial-home space-y-7 lg:space-y-8 pb-16 text-left">
      
      {/* ── 1. PREMIUM SOFT LIGHT HERO SECTION ── */}
      <section className="bg-gradient-to-br from-[#171f28] via-[#10161d] to-[#0d1218] border border-[#35404b] rounded-xl p-4 sm:p-6 lg:p-7 shadow-[0_18px_55px_rgba(0,0,0,0.28)] relative overflow-hidden">
        {/* Glow Accent */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="grid grid-cols-1 gap-5 items-center relative z-10">
          {/* Left Hero Column */}
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2.5 px-2.5 py-1.5 bg-orange-500/10 border border-orange-500/20 text-[10px] font-bold uppercase tracking-wider text-orange-400 rounded-lg">
              <img src={logoFull} alt="Rusty.Lub logo" className="h-7 w-auto max-w-[110px] object-contain" />
              <span className="h-4 w-px bg-orange-500/30" />
              <span>RUSTY.LUB · SURVIVAL TOOLS</span>
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-black tracking-tight text-[#eef2f7] leading-[1.1]">
                Win the wipe. <br className="hidden sm:inline" />
                <span className="text-orange-500">Without the chaos.</span>
              </h1>
              <p className="text-sm sm:text-base text-[#aab4c5] font-normal leading-relaxed max-w-xl">
                {lang === 'ru'
                  ? 'Высокоточный набор утилит выживания для игроков Rust. Посчитайте оптимальный боезапас рейда, автоматизируйте внутриигровые бинды, настройте электронику и повысьте FPS в один клик.'
                  : 'Precision-engineered survival tools for professional Rust players. Calculate explosive costs, configure complex macro binds, design electrical grids, and optimize frames.'}
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => onNavigate('raid')}
                className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-orange-500/10 cursor-pointer flex items-center gap-1.5"
              >
                <span>{lang === 'ru' ? 'Начать бесплатно' : 'Start free'}</span>
                <ArrowRight size={13} />
              </button>

              <button
                onClick={() => onNavigate('tools')}
                className="px-6 py-3 bg-[#171d27] hover:bg-[#202938] text-[#eef2f7] border border-[#1e2633] font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>{lang === 'ru' ? 'Все инструменты' : 'See tools'}</span>
              </button>

              <a
                href="https://discord.gg/R2TyKZ9xvZ"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-transparent hover:bg-orange-500/10 text-orange-300 hover:text-orange-200 border border-orange-500/30 hover:border-orange-500/60 font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-1.5"
              >
                <Send size={13} />
                <span>{lang === 'ru' ? 'Наш Discord' : 'Join Discord'}</span>
                <ExternalLink size={11} />
              </a>
            </div>
          </div>


        </div>
      </section>

      {/* ── 2. FEATURED TOOLS BOXES (RAID, BINDS, FPS) ── */}
      <section className="space-y-4">
        <h2 className="text-xs font-black text-[#8b95a8] uppercase tracking-wider font-mono">
          {lang === 'ru' ? '🔥 ПОПУЛЯРНЫЕ РАЗДЕЛЫ' : '🔥 FEATURED PROTOCOLS'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 lg:gap-4">
          {/* Featured 1: Raid Calculator */}
          <div 
            onClick={() => onNavigate('raid')}
            className="bg-[#111820] border border-[#293541] p-4 lg:p-5 rounded-xl shadow-[0_10px_24px_rgba(0,0,0,0.16)] hover:border-orange-500/70 hover:-translate-y-0.5 transition-all cursor-pointer flex items-start gap-4 group"
          >
            <div className="w-14 h-14 shrink-0 rounded-xl bg-zinc-900 border border-[#2e394b] flex items-center justify-center shadow-inner overflow-hidden">
              <ItemImageOrFallback id="timed_explosive" lang={lang} size={46} />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-[#eef2f7] uppercase group-hover:text-orange-500 transition-colors">
                {lang === 'ru' ? 'Калькулятор Рейда' : 'Raid Calculator'}
              </h3>
              <p className="text-xs text-[#8b95a8] leading-relaxed">
                {lang === 'ru' ? 'Расчёт C4, ракет и взрывчатки для штурма баз любой сложности.' : 'Calculate sulfur and raw resources needed for optimal base raiding.'}
              </p>
            </div>
          </div>

          {/* Featured 2: Keybinds Generator */}
          <div 
            onClick={() => onNavigate('binds')}
            className="bg-[#12161e] border border-[#1e2633] p-5 rounded-2xl shadow-[0_4px_15px_rgba(0,0,0,0.01)] hover:border-orange-500 transition-all cursor-pointer flex items-start gap-4 group"
          >
            <div className="w-14 h-14 shrink-0 rounded-xl bg-zinc-900 border border-[#2e394b] flex items-center justify-center shadow-inner overflow-hidden">
              <ItemImageOrFallback id="keycard_red" lang={lang} size={46} />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-[#eef2f7] uppercase group-hover:text-orange-500 transition-colors">
                {lang === 'ru' ? 'Генератор Биндов' : 'Binds & Macros'}
              </h3>
              <p className="text-xs text-[#8b95a8] leading-relaxed">
                {lang === 'ru' ? 'Быстрый свап оружия, автоатака, бинды на двери и консольные фичи.' : 'Generate optimized F1 client console commands and macro binds.'}
              </p>
            </div>
          </div>

          {/* Featured 3: FPS Performance Optimizer */}
          <div 
            onClick={() => onNavigate('fps')}
            className="bg-[#12161e] border border-[#1e2633] p-5 rounded-2xl shadow-[0_4px_15px_rgba(0,0,0,0.01)] hover:border-orange-500 transition-all cursor-pointer flex items-start gap-4 group"
          >
            <div className="w-14 h-14 shrink-0 rounded-xl bg-zinc-900 border border-[#2e394b] flex items-center justify-center shadow-inner overflow-hidden">
              <ItemImageOrFallback id="computerstation" lang={lang} size={46} />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-neutral-950 uppercase group-hover:text-orange-500 transition-colors">
                {lang === 'ru' ? 'Оптимизация FPS' : 'FPS Booster Guide'}
              </h3>
              <p className="text-xs text-[#8b95a8] leading-relaxed">
                {lang === 'ru' ? 'Гайды настроек графики, параметры запуска Steam и буст частоты кадров.' : 'Step-by-step performance optimization guidelines for maximum frame rate.'}
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* ── 3. SPECIAL ACCESS SECTIONS (ONLY VISIBLE IF AUTHORIZED WITH SPECIAL ACCESS) ── */}
      {hasSpecialAccess && visibleSpecialCards.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xs font-black text-[#8b95a8] uppercase tracking-wider font-mono">
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
                  className={`bg-[#12161e] border p-5 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.01)] hover:shadow-md cursor-pointer flex flex-col justify-between group transition-all duration-200 hover:-translate-y-0.5 ${card.color}`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3.5">
                      <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-[#2e394b] flex items-center justify-center shadow-inner overflow-hidden group-hover:scale-105 transition-transform">
                        <ItemImageOrFallback id={card.iconId} lang={lang} size={36} />
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className={`px-2 py-0.5 rounded text-[9px] uppercase tracking-wide ${card.badgeClass}`}>
                          {card.tag}
                        </span>
                      </div>
                    </div>
                    <h3 className="text-base font-bold text-[#eef2f7] group-hover:text-orange-500 transition-colors mb-1.5">
                      {card.title}
                    </h3>
                    <p className="text-xs text-[#8b95a8] leading-relaxed">
                      {card.desc}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-semibold text-[#aab4c5] group-hover:text-orange-500">
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

      {/* ── 5. SUGGESTIONS AND CONTACT FEEDBACK ── */}
      <section className="bg-[#12161e] border border-[#1e2633] rounded-2xl p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-[#eef2f7]">
              {lang === 'ru' ? '💡 Идеи и сотрудничество' : '💡 Suggestions & Collab'}
            </h3>
            <p className="text-xs text-[#8b95a8] leading-relaxed max-w-md">
              {lang === 'ru'
                ? 'Мы постоянно дорабатываем калькуляторы и добавляем новые фичи. Если у вас есть предложения или вы обнаружили баг — сообщите нам!'
                : 'We continuously expand our toolkit. If you have an idea, want to propose a new feature, or found an issue, please contact us!'}
            </p>
          </div>

          <div className="flex items-center justify-between gap-3 bg-[#0d1016] border border-[#1e2633] rounded-xl px-4 py-3">
            <div className="space-y-0.5">
              <div className="text-[9px] font-mono text-[#8b95a8] uppercase tracking-wider">
                {lang === 'ru' ? 'ОФИЦИАЛЬНЫЙ EMAIL ПРОЕКТА' : 'OFFICIAL PROJECT EMAIL'}
              </div>
              <span className="font-mono text-xs text-orange-500 font-bold">
                rusty.lub_offers@bk.ru
              </span>
            </div>
            <button
              type="button"
              onClick={handleCopyEmail}
              className="p-2 hover:bg-[#202938] text-[#8b95a8] hover:text-[#eef2f7] transition-colors cursor-pointer rounded-lg border border-[#1e2633] bg-[#12161e] shadow-sm"
              title={lang === 'ru' ? 'Копировать почту' : 'Copy email'}
            >
              {copiedEmail ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
            </button>
          </div>
        </div>
      </section>

      {/* ── 6. UNIFIED SOCIAL WIDGETS SECTION (BOTTOM OF HOME) ── */}
      <details className="group rounded-xl border border-[#26313d] bg-[#0d1218]">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-4 sm:px-5 [&::-webkit-details-marker]:hidden">
          <span>
            <span className="block font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[#f28a24]">{lang === 'ru' ? 'СООБЩЕСТВО / МЕДИА' : 'COMMUNITY / MEDIA'}</span>
            <span className="mt-1 block text-sm font-semibold text-[#e5eaf0]">{lang === 'ru' ? 'Новости, видео и социальные виджеты' : 'News, videos and social widgets'}</span>
          </span>
          <span className="shrink-0 rounded-md border border-white/10 px-3 py-1.5 text-xs text-zinc-400 group-open:text-orange-300">{lang === 'ru' ? 'Развернуть' : 'Expand'} <span className="ml-1 inline-block transition-transform group-open:rotate-180">⌄</span></span>
        </summary>
        <div className="space-y-4 border-t border-white/10 p-4 sm:p-5">

      <section className="space-y-4 pt-4 border-t border-[#1e2633]">
        <h2 className="text-xs font-black text-[#8b95a8] uppercase tracking-wider font-mono">
          {lang === 'ru' ? '📰 СОЦИАЛЬНАЯ АКТИВНОСТЬ И ВИДЖЕТЫ' : '📰 MEDIA & SOCIAL HUB'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Widget 1: Jungle Fever Solo Rust Movie */}
          <div className="bg-[#12161e] border border-[#1e2633] rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.01)] flex flex-col justify-between group hover:border-orange-500/40 transition-all">
            <div>
              <div className="relative mb-3.5 overflow-hidden border border-[#1e2633] rounded-xl bg-[#171d27] aspect-video max-h-36">
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
              <h4 className="text-sm font-bold text-[#eef2f7] uppercase mb-1.5 group-hover:text-orange-500 transition-colors truncate">
                {lang === 'ru' ? 'Jungle Fever - Фильм Solo Rust' : 'Jungle Fever - Solo Rust Movie'}
              </h4>
              <p className="text-xs text-[#aab4c5] leading-relaxed mb-3 line-clamp-2">
                {lang === 'ru' ? 'Первая часть захватывающей серии фильмов Jungle Fever от Rusty.Lub!' : 'First part of the thrilling Jungle Fever movie series from Rusty.Lub!'}
              </p>
            </div>
            <div className="pt-2.5 border-t border-neutral-100">
              <button
                onClick={() => onNavigate('news')}
                className="w-full py-2 bg-orange-500 hover:bg-orange-600 text-white text-[10px] font-bold uppercase tracking-widest cursor-pointer transition-all rounded-lg flex items-center justify-center gap-1.5"
              >
                <Play size={10} className="fill-white" />
                <span>{lang === 'ru' ? 'СМОТРЕТЬ ФИЛЬМ' : 'WATCH MOVIE'}</span>
              </button>
            </div>
          </div>

          {/* Widget 2: Teammate Finder Bot */}
          <div className="bg-[#12161e] border border-[#1e2633] rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.01)] flex flex-col justify-between group hover:border-blue-500/40 transition-all">
            <div>
              <div className="relative mb-3.5 overflow-hidden border border-[#1e2633] rounded-xl bg-gradient-to-br from-neutral-50 to-neutral-100 aspect-video max-h-36 flex items-center justify-center">
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
              <h4 className="text-sm font-bold text-[#eef2f7] uppercase mb-1.5 group-hover:text-blue-600 transition-colors truncate">
                {lang === 'ru' ? 'Поиск команды & LFG Бот' : 'Teammate & Clan Finder Bot'}
              </h4>
              <p className="text-xs text-[#aab4c5] leading-relaxed mb-3 line-clamp-2">
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
          <div className="bg-[#12161e] border border-[#1e2633] rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.01)] flex flex-col justify-between group hover:border-orange-500/40 transition-all">
            <div>
              <div className="flex items-center gap-3 pb-3 border-b border-neutral-100 mb-3">
                <span className="text-3xl">👑</span>
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h4 className="text-sm font-bold text-[#eef2f7] uppercase">
                      {appTranslations.founderTitle[lang]}
                    </h4>
                    <span className="px-1.5 py-0.5 bg-orange-500/10 text-orange-500 text-[8px] font-bold rounded">
                      [EAC]
                    </span>
                    <span className="px-1.5 py-0.5 bg-orange-950/30 text-orange-400 border border-orange-200/80 text-[8px] font-mono font-black rounded">
                      13 000+ {lang === 'ru' ? 'ЧАСОВ' : 'HOURS'}
                    </span>
                  </div>
                  <p className="text-[10px] text-[#8b95a8] font-mono mt-0.5 uppercase tracking-wider">
                    {lang === 'ru' ? 'СОЗДАТЕЛЬ & РАЗРАБОТЧИК' : 'FOUNDER & SOLO DEV'}
                  </p>
                </div>
              </div>
              <p className="text-xs text-[#aab4c5] leading-relaxed mb-4 line-clamp-3">
                {appTranslations.founderDesc[lang]}
              </p>
            </div>
            <div className="space-y-2 pt-2 border-t border-neutral-100">
              <div className="flex items-center justify-between gap-1 text-[11px]">
                <a
                  href="https://steamcommunity.com/id/eaccheater/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-1.5 bg-neutral-900 hover:bg-black text-white text-[10px] font-bold uppercase text-center rounded-lg flex items-center justify-center gap-1 transition-all shadow-xs cursor-pointer"
                  title={lang === 'ru' ? 'Открыть профиль Steam' : 'Open Steam Profile'}
                >
                  <ExternalLink size={10} className="text-orange-400" />
                  <span>Steam</span>
                </a>
                <a
                  href="https://t.me/S1mreyReserve"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-1.5 bg-[#0d1016] hover:bg-[#171d27] border border-[#1e2633] text-neutral-700 text-[10px] font-bold uppercase text-center rounded-lg flex items-center justify-center gap-1 transition-all"
                >
                  <Send size={10} />
                  <span>Telegram</span>
                </a>
                <button
                  type="button"
                  onClick={handleCopyDiscord}
                  className={`flex-1 py-1.5 text-[10px] font-bold uppercase text-center rounded-lg flex items-center justify-center gap-1 border cursor-pointer transition-all ${
                    copiedDiscord 
                      ? 'bg-emerald-50 text-emerald-600 border-emerald-200' 
                      : 'bg-[#0d1016] hover:bg-[#171d27] border-[#1e2633] text-neutral-700'
                  }`}
                >
                  {copiedDiscord ? <Check size={10} className="text-emerald-600" /> : <Copy size={10} />}
                  <span>{copiedDiscord ? 'Copied' : 'Discord'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Widget 4: Patch Note Updates */}
          <div className="bg-[#12161e] border border-[#1e2633] rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.01)] flex flex-col justify-between group hover:border-orange-500/40 transition-all">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2 py-0.5 bg-orange-500/10 border border-orange-500/20 text-orange-500 text-[9px] font-bold uppercase tracking-wider rounded">
                  {lang === 'ru' ? 'СВЕЖИЕ НОВОСТИ' : 'LATEST NEWS'}
                </span>
                <span className="text-[9px] font-mono text-[#8b95a8]">02.07.2026</span>
              </div>
              <h4 className="text-sm font-bold text-[#eef2f7] uppercase mb-2">
                {lang === 'ru' ? 'Июльское обновление Rust' : 'July Rust Update'}
              </h4>
              <p className="text-xs text-[#aab4c5] leading-relaxed mb-4">
                {lang === 'ru'
                  ? 'Глобальный балансный патч Rust. Калькуляторы Rusty.Lub обновлены под актуальный урон и прочность всех строений.'
                  : 'Global Rust balance patch. All calculators updated for actual health and decay rates.'}
              </p>
            </div>
            <div className="pt-2.5 border-t border-neutral-100">
              <button
                onClick={() => onNavigate('news')}
                className="w-full py-2 bg-[#171d27] hover:bg-[#202938] text-[#eef2f7] text-[10px] font-bold uppercase tracking-widest cursor-pointer transition-all rounded-lg flex items-center justify-center gap-1"
              >
                <span>{lang === 'ru' ? 'ЧИТАТЬ ОБНОВЛЕНИЕ' : 'READ PATCH LOG'}</span>
                <ChevronRight size={11} />
              </button>
            </div>
          </div>

          {/* Widget 5: Discord Hub */}
          <div className="bg-[#12161e] border border-[#1e2633] rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.01)] flex flex-col justify-between group hover:border-indigo-500/40 transition-all">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[9px] font-bold uppercase tracking-wider rounded">
                  {lang === 'ru' ? 'ДИСКОРД ХАБ' : 'DISCORD COMMUNITY'}
                </span>
                <span className="text-[9px] font-mono text-[#8b95a8]">ONLINE</span>
              </div>
              <h4 className="text-sm font-bold text-[#eef2f7] uppercase mb-2">
                {lang === 'ru' ? 'Официальный Discord-клиент' : 'Official Discord Server'}
              </h4>
              <p className="text-xs text-[#aab4c5] leading-relaxed mb-4">
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
          <div className="bg-[#12161e] border border-[#1e2633] rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.01)] flex flex-col justify-between group hover:border-orange-500/40 transition-all">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2 py-0.5 bg-orange-950/30 text-orange-600 text-[9px] font-bold uppercase tracking-wider rounded">
                  {lang === 'ru' ? 'СОВЕТ ИГРОКАМ' : 'PRO-TIP'}
                </span>
                <span className="text-[9px] font-mono text-[#8b95a8]">@tv_cheater</span>
              </div>
              <h4 className="text-sm font-bold text-[#eef2f7] uppercase mb-2">
                {lang === 'ru' ? 'Отслеживание стримов на Twitch' : 'Follow streams on Twitch'}
              </h4>
              <p className="text-xs text-[#aab4c5] leading-relaxed mb-4">
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
                className="w-full py-2 bg-orange-600 hover:bg-orange-700 text-white text-[10px] font-bold uppercase tracking-widest text-center rounded-lg flex items-center justify-center gap-1.5"
              >
                <Twitch size={11} />
                <span>{lang === 'ru' ? 'ОТКРЫТЬ TWITCH' : 'WATCH TWITCH'}</span>
              </a>
            </div>
          </div>

        </div>
      </section>

        </div>
      </details>

      {/* ── 7. TWITCH LIVE EMBED IF ACTIVE ── */}
      {twitchSettings && (twitchSettings.isManualLive || twitchSettings.isLiveFromApi) && (
        <section className="bg-[#12161e] border border-orange-200 rounded-2xl p-6 shadow-[0_4px_25px_rgba(145,70,255,0.04)] relative overflow-hidden text-left">
          <div className="absolute top-0 left-0 right-0 h-1 bg-orange-600" />
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            <div className="space-y-3 flex-1">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-500/100 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500/100"></span>
                </span>
                <span className="text-[9px] font-bold uppercase tracking-widest text-orange-500 font-mono">
                  {lang === 'ru' ? 'ПРЯМОЙ ЭФИР' : 'LIVE BROADCAST'}
                </span>
                <span className="text-neutral-300 font-mono text-[9px]">•</span>
                <span className="text-[9px] font-bold uppercase tracking-widest text-orange-600 font-mono">
                  TWITCH
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="text-xl sm:text-2xl font-black text-neutral-950 uppercase leading-tight">
                  {twitchSettings.streamTitle || twitchSettings.apiTitle || (lang === 'ru' ? 'НАЧАЛСЯ СТРИМ!' : 'STREAM IS LIVE!')}
                </h3>
                <p className="text-xs text-[#aab4c5]">
                  {lang === 'ru' ? 'Канал:' : 'Channel:'} <span className="text-orange-600 font-bold hover:underline cursor-pointer" onClick={() => window.open(`https://twitch.tv/${twitchSettings.channelName}`, '_blank')}>{twitchSettings.channelName}</span>
                </p>
              </div>

              <div className="pt-1">
                <a
                  href={`https://twitch.tv/${twitchSettings.channelName}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all cursor-pointer items-center gap-1.5"
                >
                  <Twitch size={11} />
                  <span>{lang === 'ru' ? 'ПЕРЕЙТИ НА КАНАЛ' : 'OPEN TWITCH CHANNEL'}</span>
                </a>
              </div>
            </div>

            <div className="w-full lg:w-[420px] aspect-video border border-[#1e2633] rounded-xl bg-black relative overflow-hidden shrink-0">
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
