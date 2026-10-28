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
      
      {/* ── 1. CINEMATIC RUST HERO ── */}
      <section className="relative isolate flex min-h-[480px] overflow-hidden rounded-2xl border border-[#3a4654] bg-[#090d12] shadow-[0_28px_80px_rgba(0,0,0,0.5)] sm:min-h-[540px] lg:min-h-[590px]">
        <img
          src="https://images.squarespace-cdn.com/content/v1/5420d068e4b09194f76b2af6/9d28c2b3-0cdd-4cb8-893b-a792929b264b/20250325155147_1-Edit.jpg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 -z-20 h-full w-full object-cover object-center"
          fetchPriority="high"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#080b10]/95 via-[#080b10]/75 to-[#080b10]/25" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#080b10]/85 via-transparent to-[#080b10]/20" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_78%_42%,rgba(249,115,22,0.14),transparent_42%)]" />

        <div className="flex w-full items-center p-5 sm:p-8 lg:p-12 xl:p-16">
          <div className="w-full max-w-6xl space-y-6 sm:space-y-8">
            <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-7 lg:gap-10">
              <div className="shrink-0 border-l-2 border-orange-500 bg-black/35 px-3 py-3 backdrop-blur-sm sm:px-4 sm:py-4">
                <img src={logoFull} alt="Rusty.Lub logo" className="h-auto w-[150px] max-w-full object-contain object-left sm:w-[175px] md:w-[195px] lg:w-[220px]" />
              </div>

              <div className="min-w-0 space-y-4">
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-orange-300 sm:text-xs">
                  {lang === 'ru' ? 'ИНСТРУМЕНТЫ • БАЗА ЗНАНИЙ • СООБЩЕСТВО' : 'TOOLS • KNOWLEDGE • COMMUNITY'}
                </p>
                <h1 className="w-full max-w-none text-[clamp(1.65rem,5.2vw,4.5rem)] font-black leading-[1.08] tracking-tight text-white drop-shadow-[0_3px_18px_rgba(0,0,0,0.6)]">
                  {lang === 'ru' ? <><span className="block whitespace-nowrap">Твой следующий вайп.</span><span className="block whitespace-nowrap text-orange-400">Под твоим контролем.</span></> : <><span className="block whitespace-nowrap">Your next wipe.</span><span className="block whitespace-nowrap text-orange-400">On your terms.</span></>}
                </h1>
                <p className="max-w-2xl text-sm leading-7 text-[#e0e5eb] drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] sm:text-base lg:text-lg">
                  {lang === 'ru'
                    ? 'Калькулятор рейда, игровые инструменты и база знаний Rust — всё необходимое, чтобы подготовиться к вайпу и играть эффективнее.'
                    : 'Raid calculations, practical game tools, and a Rust knowledge base — everything you need to prepare for wipe and play smarter.'}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:flex-wrap">
              <button onClick={() => onNavigate('raid')} className="inline-flex min-h-12 items-center justify-center gap-2 border border-orange-300 bg-orange-500 px-6 py-3 text-xs font-extrabold uppercase tracking-wider text-[#101318] shadow-[0_8px_30px_rgba(249,115,22,0.28)] transition hover:bg-orange-400 cursor-pointer">
                {lang === 'ru' ? 'Калькулятор рейда' : 'Raid calculator'} <ArrowRight size={15} />
              </button>
              <button onClick={() => onNavigate('tools')} className="inline-flex min-h-12 items-center justify-center gap-2 border border-white/35 bg-black/40 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-sm transition hover:border-orange-400/70 hover:bg-black/60 cursor-pointer">
                {lang === 'ru' ? 'Все инструменты' : 'All tools'}
              </button>
              <a href="https://discord.gg/R2TyKZ9xvZ" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 border border-orange-400/60 bg-[#0b1016]/55 px-6 py-3 text-xs font-bold uppercase tracking-wider text-orange-200 backdrop-blur-sm transition hover:border-orange-300 hover:bg-orange-500/15">
                <Send size={14} /> Discord <ExternalLink size={11} />
              </a>
            </div>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-white/15 pt-4 font-mono text-[9px] uppercase tracking-[0.16em] text-white/65 sm:text-[10px]">
              <span>Raid tools</span><span className="text-orange-400">/</span><span>FPS & binds</span><span className="text-orange-400">/</span><span>Rust community</span>
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

      {/* ── PARTNERSHIP FEATURE ── */}
      <section className="relative overflow-hidden rounded-2xl border border-orange-500/35 bg-[#10161e] p-5 sm:p-7">
        <div className="pointer-events-none absolute -right-10 -top-16 h-56 w-56 rounded-full bg-orange-500/10 blur-3xl" />
        <div className="relative grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-orange-300"><span className="h-1.5 w-1.5 rounded-full bg-orange-400" /> {lang === 'ru' ? 'ПАРТНЁРСТВО И СОТРУДНИЧЕСТВО' : 'PARTNERSHIPS & COLLABORATION'}</span>
            <h2 className="text-2xl font-black tracking-tight text-white sm:text-3xl">{lang === 'ru' ? 'Есть идея для Rusty.Lub?' : 'Have an idea for Rusty.Lub?'}</h2>
            <p className="max-w-2xl text-sm leading-6 text-[#aab7c6]">{lang === 'ru' ? 'Обсудим интеграции, полезные сервисы для игроков Rust и совместные проекты. Напиши нам — рассмотрим каждое предложение.' : 'Let’s discuss integrations, useful Rust player services, and joint projects. Reach out and tell us what you have in mind.'}</p>
          </div>
          <div className="flex flex-wrap gap-3 md:justify-end">
            <button onClick={() => onNavigate('support')} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-orange-500 px-5 py-3 text-xs font-extrabold uppercase tracking-wider text-[#101318] transition hover:bg-orange-400 cursor-pointer">{lang === 'ru' ? 'Предложить сотрудничество' : 'Work with us'} <ArrowRight size={14} /></button>
            <button onClick={handleCopyEmail} className="inline-flex min-h-11 items-center justify-center rounded-lg border border-[#3b4858] bg-[#151d27] px-4 py-3 text-xs font-bold text-[#dce4ed] transition hover:border-orange-500/50 cursor-pointer">{copiedEmail ? (lang === 'ru' ? 'Email скопирован' : 'Email copied') : (lang === 'ru' ? 'Скопировать email' : 'Copy email')}</button>
          </div>
        </div>
      </section>

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
