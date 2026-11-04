import React, { useEffect, useState } from 'react';
import { ArrowRight, BookOpen, Check, Copy, ExternalLink, Handshake, MessageCircle, Newspaper, Send, ShieldCheck, Users, Wrench, ChevronRight } from 'lucide-react';
import { ItemImageOrFallback } from './IconUtils';
import { CustomUser } from '../types';
import logoFull from '../../logo-full.png';
import oilRigBg from '../assets/images/oil_rig_wallpaper_1783378845895.jpg';

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
  isVip,
  isOwner,
  isAdmin,
  currentUser,
  appTheme = 'dark'
}: HomeTabProps) {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedServerAddress, setCopiedServerAddress] = useState(false);
  const [serverBadgeRefresh, setServerBadgeRefresh] = useState(() => Date.now());

  useEffect(() => {
    const refreshId = window.setInterval(() => setServerBadgeRefresh(Date.now()), 45000);
    return () => window.clearInterval(refreshId);
  }, []);
  const ru = lang === 'ru';

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText('rusty.lub_offers@bk.ru');
      setCopiedEmail(true);
      window.setTimeout(() => setCopiedEmail(false), 2000);
    } catch {
      setCopiedEmail(false);
    }
  };

  const popularTools = [
    { id: 'raid', icon: 'timed_explosive', title: ru ? 'Рейд-калькулятор' : 'Raid calculator', desc: ru ? 'Рассчитай, сколько нужно взрывчатки для рейда.' : 'Calculate the explosives needed for a raid.' },
    { id: 'raid', icon: 'workbench1', title: ru ? 'Крафт-калькулятор' : 'Craft calculator', desc: ru ? 'Узнай, что нужно для изготовления предметов.' : 'Plan the resources needed to craft items.' },
    { id: 'binds', icon: 'keycard_red', title: ru ? 'Бинды и макросы' : 'Binds & macros', desc: ru ? 'Ускорь свою игру и повысь эффективность.' : 'Speed up your gameplay and improve efficiency.' },
    { id: 'fps', icon: 'computerstation', title: ru ? 'Оптимизация FPS' : 'FPS optimization', desc: ru ? 'Настрой производительность под свой ПК.' : 'Tune performance for your PC.' },
    { id: 'guides', icon: 'paper', title: ru ? 'База знаний' : 'Knowledge base', desc: ru ? 'Полезные гайды и игровые материалы.' : 'Useful guides and game references.' }
  ];

  const newsCards = [
    { category: ru ? 'ГАЙДЫ' : 'GUIDES', title: ru ? 'Тактика и полезные советы для Rust' : 'Rust tactics and practical tips', imagePosition: 'center 45%' },
    { category: ru ? 'НОВОСТИ' : 'NEWS', title: ru ? 'Следи за обновлениями проекта' : 'Keep up with project updates', imagePosition: 'center 25%' },
    { category: ru ? 'ГАЙДЫ' : 'GUIDES', title: ru ? 'Настройки, оружие и игровые механики' : 'Settings, weapons and game mechanics', imagePosition: 'center 65%' },
    { category: ru ? 'НОВОСТИ' : 'NEWS', title: ru ? 'Всё важное о мире Rust в одном месте' : 'Everything important about Rust in one place', imagePosition: 'center 80%' }
  ];

  const specialCards = [
    ...(currentUser && isVip ? [{ id: 'radar', title: 'Player Radar', desc: ru ? 'Отслеживание активности игроков и серверов.' : 'Track player and server activity.', tag: 'VIP', icon: 'rf_pager' }] : []),
    ...(currentUser && isOwner ? [{ id: 'rustplus', title: 'Rust+ Bot Hub', desc: ru ? 'Управление умными устройствами базы.' : 'Manage your base smart devices.', tag: 'OWNER', icon: 'smart.alarm' }] : []),
    ...(currentUser && isAdmin ? [{ id: 'admin', title: ru ? 'Панель администратора' : 'Admin control center', desc: ru ? 'Управление контентом и модерация.' : 'Content management and moderation.', tag: 'ADMIN', icon: 'lock.code' }, { id: 'icons', title: ru ? 'Каталог спрайтов' : 'Rust icons catalog', desc: ru ? 'Библиотека игровых предметов и кодов.' : 'Game item sprite and code library.', tag: 'ADMIN', icon: 'spraycan' }] : [])
  ];

  return (
    <div className={`industrial-home keep-dark -mt-5 box-border w-full min-w-0 max-w-full space-y-0 overflow-x-clip overflow-y-hidden pb-10 text-left ${appTheme === 'light' ? 'home-light-preview' : ''}`}>
      {/* HERO */}
      <section className="relative isolate min-h-[430px] overflow-hidden border-b border-slate-700/70 bg-[#080d12] sm:min-h-[455px]">
        <img src={oilRigBg} alt="" aria-hidden="true" className="absolute inset-0 -z-20 h-full w-full object-cover object-center opacity-65" />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(5,9,13,.98)_0%,rgba(5,9,13,.88)_34%,rgba(5,9,13,.28)_72%,rgba(5,9,13,.72)_100%),linear-gradient(0deg,rgba(5,9,13,.94),transparent_55%)]" />
        <div className="mx-auto grid min-h-[430px] max-w-none items-center gap-8 px-5 py-10 sm:min-h-[455px] sm:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(300px,380px)] xl:grid-cols-[minmax(0,1fr)_minmax(340px,420px)] lg:gap-12 xl:gap-16 lg:px-12 xl:px-16">
          <div className="max-w-5xl">
            <div className="mb-4 flex items-center gap-3">
              <img src={logoFull} alt="Rusty.Lub" className="h-9 w-9 object-contain" />
              <span className="font-mono text-[10px] font-bold uppercase tracking-[.22em] text-slate-300"><span className="text-orange-500">//</span> {ru ? 'СПРАВОЧНИК ДЛЯ ИГРОКОВ RUST' : 'RUST PLAYER KNOWLEDGE HUB'}</span>
            </div>
            <h1 className="text-5xl font-black leading-[.94] tracking-[-.055em] text-white sm:text-6xl lg:text-7xl">RUSTY<span className="text-orange-500">.LUB</span></h1>
            <h2 className="mt-4 max-w-xl text-xl font-bold leading-snug text-white sm:text-2xl">{ru ? 'Всё, что нужно для комфортной игры в Rust — в одном месте.' : 'Everything you need for a better Rust experience — in one place.'}</h2>
            <p className="mt-4 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">{ru ? 'Инструменты, гайды, калькуляторы, бинды и макросы, оптимизация, сообщество и многое другое — для тех, кто играет серьёзно.' : 'Tools, guides, calculators, binds, optimization, community and more — built for players who take Rust seriously.'}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <button onClick={() => onNavigate('raid')} className="inline-flex min-h-11 items-center gap-2 border border-orange-400 bg-orange-500 px-6 py-3 text-xs font-black text-[#101318] shadow-[0_8px_28px_rgba(249,115,22,.22)] transition hover:bg-orange-400">{ru ? 'Начать бесплатно' : 'Get started'} <ArrowRight size={15} /></button>
              <button onClick={() => onNavigate('tools')} className="inline-flex min-h-11 items-center gap-2 border border-slate-400/50 bg-slate-950/55 px-5 py-3 text-xs font-bold text-white transition hover:border-orange-400">{ru ? 'Все инструменты' : 'All tools'} <ArrowRight size={14} className="text-orange-500" /></button>
              <a href="https://discord.gg/R2TyKZ9xvZ" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 border border-slate-400/50 bg-slate-950/45 px-5 py-3 text-xs font-bold text-white transition hover:border-orange-400"><MessageCircle size={15} /> Discord <ExternalLink size={11} /></a>
            </div>
          </div>
          <aside className="border border-slate-500/50 bg-[#080d12]/85 p-4 shadow-2xl backdrop-blur-md sm:p-5">
            <p className="mb-4 border-b border-slate-700 pb-3 font-mono text-[10px] font-black uppercase tracking-[.18em] text-white"><span className="text-orange-500">///</span> {ru ? 'ПОЧЕМУ RUSTY.LUB?' : 'WHY RUSTY.LUB?'}</p>
            {[
              { icon: Wrench, title: ru ? 'Удобные инструменты' : 'Useful tools', desc: ru ? 'Все нужные калькуляторы и сервисы.' : 'Calculators and utilities in one place.' },
              { icon: BookOpen, title: ru ? 'Актуальные гайды' : 'Practical guides', desc: ru ? 'Подробные инструкции и советы.' : 'Detailed instructions and tips.' },
              { icon: Users, title: ru ? 'Активное сообщество' : 'Active community', desc: ru ? 'Помощь, общение, обмен опытом.' : 'Help, discussion and shared experience.' },
              { icon: ShieldCheck, title: ru ? 'Регулярные обновления' : 'Regular updates', desc: ru ? 'Мы следим за игрой и обновляем контент.' : 'We keep the content up to date.' }
            ].map(({ icon: Icon, title, desc }) => <div key={title} className="mb-4 flex items-center gap-3 last:mb-0"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-orange-500/50 bg-orange-500/10 text-orange-500"><Icon size={17} /></span><span><b className="block text-xs text-white">{title}</b><small className="mt-1 block text-[10px] leading-4 text-slate-400">{desc}</small></span></div>)}
            <div className="mt-4 border-t border-slate-700 pt-3 font-mono text-[10px] uppercase tracking-wider text-slate-400">RUST — {ru ? 'ЭТО НЕ ПРОСТО ИГРА' : 'MORE THAN A GAME'}<b className="mt-1 block text-sm text-orange-500">{ru ? 'ЭТО СООБЩЕСТВО' : 'IT IS A COMMUNITY'}</b></div>
          </aside>
        </div>
      </section>

      {/* FEATURED NOVEMBER UPDATE */}
      <section className="mx-auto max-w-none border-b border-orange-500/30 px-5 py-6 sm:px-8 lg:px-10">
        <button
          type="button"
          onClick={() => onNavigate('news')}
          className="group relative grid w-full overflow-hidden border border-orange-500/40 bg-[#0b1118] text-left transition hover:border-orange-400 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]"
          aria-label={ru ? 'Открыть полную новость о ноябрьском обновлении Rust' : 'Read the full Rust November update article'}
        >
          <div className="relative min-h-[190px] overflow-hidden sm:min-h-[230px]">
            <img src={oilRigBg} alt="" className="absolute inset-0 h-full w-full object-cover object-center opacity-75 transition duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#080d12]/20 via-[#080d12]/35 to-[#080d12]/80 lg:bg-gradient-to-r lg:from-transparent lg:to-[#0b1118]" />
            <span className="absolute left-4 top-4 border border-orange-400/60 bg-[#101318]/90 px-3 py-1 font-mono text-[9px] font-black tracking-[.18em] text-orange-400">{ru ? 'ГЛАВНАЯ НОВОСТЬ · НОЯБРЬ 2026' : 'TOP STORY · NOVEMBER 2026'}</span>
          </div>
          <div className="relative flex flex-col justify-center p-5 sm:p-7 lg:-ml-10 lg:pl-12">
            <span className="font-mono text-[10px] font-bold uppercase tracking-[.2em] text-orange-500">{ru ? 'ОБНОВЛЕНИЕ RUST · 5 НОЯБРЯ' : 'RUST UPDATE · NOVEMBER 5'}</span>
            <h2 className="mt-2 max-w-2xl text-xl font-black leading-tight text-white sm:text-2xl">{ru ? 'Ноябрьское обновление Rust: чертежи, UZI и глобальный вайп' : 'Rust November Update: Blueprints, UZI and Force Wipe'}</h2>
            <p className="mt-3 max-w-2xl text-xs leading-5 text-slate-300">{ru ? 'Что известно о предстоящем обновлении, изменениях прогрессии и подготовке к вайпу. Предварительные детали сверяйте с финальными заметками Facepunch.' : 'What is known about the upcoming update, progression changes and wipe preparation. Check provisional details against Facepunch final notes.'}</p>
            <span className="mt-5 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-orange-400">{ru ? 'ЧИТАТЬ ПОЛНУЮ НОВОСТЬ' : 'READ FULL ARTICLE'} <ArrowRight size={15} className="transition group-hover:translate-x-1" /></span>
          </div>
        </button>
      </section>

      {/* POPULAR TOOLS */}
      <section className="mx-auto max-w-none border-b border-slate-700/70 px-5 py-8 sm:px-8 lg:px-10">
        <div className="mb-4 flex items-end justify-between gap-4"><div><p className="font-mono text-[10px] font-bold uppercase tracking-[.2em] text-slate-400"><span className="text-orange-500">///</span> {ru ? 'БЫСТРЫЙ ДОСТУП' : 'QUICK ACCESS'}</p><h2 className="mt-1 text-xl font-black uppercase text-white sm:text-2xl">{ru ? 'Популярные инструменты' : 'Popular tools'}</h2></div><button onClick={() => onNavigate('tools')} className="mb-1 inline-flex shrink-0 items-center gap-2 text-[11px] font-bold text-orange-500 hover:text-orange-300">{ru ? 'Все инструменты' : 'All tools'} <ArrowRight size={14} /></button></div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 2xl:gap-5">
          {popularTools.map((tool, i) => <button key={tool.title} onClick={() => onNavigate(tool.id)} className="group relative flex min-h-[170px] flex-col justify-end overflow-hidden border border-slate-600/60 bg-[linear-gradient(145deg,#17212b,#0b1016)] p-4 text-left transition hover:-translate-y-1 hover:border-orange-500/70">
            <div className="absolute inset-0 opacity-[.12] transition group-hover:opacity-25" style={{ backgroundImage: `url(${oilRigBg})`, backgroundSize: 'cover', backgroundPosition: `${i * 20}% center` }} />
            <span className="relative mb-3 flex h-12 w-12 items-center justify-center"><ItemImageOrFallback id={tool.icon} lang={lang} size={42} /></span>
            <span className="relative block text-xs font-black text-white">{tool.title}</span><span className="relative mt-1 block text-[10px] leading-4 text-slate-400">{tool.desc}</span><ArrowRight className="absolute bottom-4 right-4 text-orange-500 transition group-hover:translate-x-1" size={17} />
          </button>)}
        </div>
      </section>

      {/* ABOUT + GAME SERVER */}
      <section className="mx-auto grid max-w-none gap-6 border-b border-slate-700/70 px-5 py-8 sm:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(320px,390px)] lg:items-start lg:gap-8 lg:px-10">
        <div className="min-w-0">
          <div className="relative isolate min-h-[190px] overflow-hidden border border-slate-600/60 bg-[#080d12]">
            <img src={oilRigBg} alt="" aria-hidden="true" className="absolute inset-0 -z-20 h-full w-full object-cover object-center opacity-80" />
            <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(5,9,13,.94)_0%,rgba(5,9,13,.72)_48%,rgba(5,9,13,.2)_100%),linear-gradient(0deg,rgba(5,9,13,.65),transparent)]" />
            <div className="flex min-h-[190px] max-w-xl flex-col justify-end p-5 sm:p-6">
              <span className="font-mono text-[9px] font-bold uppercase tracking-[.24em] text-orange-400">RUST KNOWLEDGE // SURVIVAL TOOLS</span>
              <h2 className="mt-2 text-2xl font-black leading-tight tracking-tight text-white sm:text-3xl">{ru ? 'Больше, чем просто сайт' : 'More than just a website'}</h2>
              <p className="mt-2 max-w-lg text-xs leading-5 text-slate-200 sm:text-sm">{ru ? 'Rusty.Lub — практический справочник для выживших. Всё необходимое, чтобы планировать рейды, строить базы, разбираться в механиках и играть увереннее.' : 'Rusty.Lub is a practical field guide for survivors. Everything you need to plan raids, build bases, master game mechanics and play smarter.'}</p>
              <button onClick={() => onNavigate('guides')} className="mt-4 inline-flex w-fit items-center gap-2 border border-orange-400/80 bg-orange-500 px-4 py-2.5 text-[10px] font-black uppercase tracking-wider text-[#101318] transition hover:bg-orange-400">{ru ? 'Открыть справочник' : 'Explore the guide'} <ArrowRight size={14} /></button>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {[
              { icon: Wrench, number: '01', title: ru ? 'Инструменты' : 'Tools', desc: ru ? 'Калькуляторы, расчёты и полезные утилиты для игры.' : 'Calculators, planning tools and useful utilities.', action: 'tools' },
              { icon: BookOpen, number: '02', title: ru ? 'База знаний' : 'Knowledge base', desc: ru ? 'Гайды по строительству, оружию, механикам и тактике.' : 'Guides for building, weapons, mechanics and tactics.', action: 'guides' },
              { icon: Users, number: '03', title: ru ? 'Сообщество' : 'Community', desc: ru ? 'Игроки, кланы, общение и совместная игра.' : 'Players, clans, discussion and team play.', action: 'clans' },
              { icon: Handshake, number: '04', title: ru ? 'Партнёрства' : 'Partnerships', desc: ru ? 'Совместные проекты и сотрудничество с Rusty.Lub.' : 'Joint projects and collaboration with Rusty.Lub.', action: 'support' }
            ].map(({ icon: Icon, number, title, desc, action }) => <button key={number} type="button" onClick={() => onNavigate(action)} className="group flex min-h-[112px] items-start gap-3 border border-slate-700/80 bg-[#0d141c] p-3.5 text-left transition duration-200 hover:border-orange-500/70 hover:bg-[#131d27] sm:p-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-orange-500/30 bg-orange-500/10 text-orange-400 transition group-hover:border-orange-500 group-hover:bg-orange-500 group-hover:text-[#101318]"><Icon size={19} /></span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2"><b className="text-sm font-bold text-white">{title}</b><small className="font-mono text-[9px] text-slate-600">{number}</small></span>
                <span className="mt-1.5 block text-[11px] leading-[1.55] text-slate-400">{desc}</span>
              </span>
              <ArrowRight size={15} className="mt-1 shrink-0 text-slate-600 transition group-hover:translate-x-1 group-hover:text-orange-400" />
            </button>)}
          </div>
        </div>

        <aside className="min-w-0 border border-orange-500/30 bg-[#0b1118] p-4 shadow-xl sm:p-5">
          <div className="mb-3 flex items-center justify-between gap-3">
            <span className="font-mono text-[10px] font-bold uppercase tracking-[.18em] text-slate-400">{ru ? 'СЕРВЕР СООБЩЕСТВА' : 'COMMUNITY SERVER'}</span>
            <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-500"><span className="h-1.5 w-1.5 rounded-full bg-orange-500" /> ENUM.GG</span>
          </div>
          <h3 className="text-xl font-black leading-tight text-white">Rusty.Lub <span className="text-orange-500">Vanilla 1x</span></h3>
          <p className="mt-2 text-xs leading-5 text-slate-400">{ru ? 'Классический Rust без лишних модификаций. Стройся, объединяйся с командой и сражайся за выживание.' : 'Classic Rust without unnecessary modifications. Build, team up and fight to survive.'}</p>
          <a href="https://enum.gg/server/rusty-lub-vanilla-fun-server-nmcqfPa3" target="_blank" rel="noopener noreferrer" className="mt-4 flex min-h-14 items-center justify-center border border-slate-700 bg-black/30 px-3 py-3 transition hover:border-orange-500/70" aria-label={ru ? 'Открыть актуальный статус сервера на Enum' : 'Open live server status on Enum'}>
            <img key={serverBadgeRefresh} src={`https://enum.gg/api/public/v1/servers/nmcqfPa3/badge.svg?refresh=${serverBadgeRefresh}`} alt={ru ? 'Актуальный статус и количество игроков на сервере' : 'Live server status and player count'} className="h-7 max-w-full" loading="eager" decoding="async" />
          </a>
          <p className="mt-2 text-center font-mono text-[9px] uppercase tracking-wider text-slate-500">{ru ? 'Автообновление · 45 секунд' : 'Auto-refresh · 45 seconds'}</p>
          <div className="mt-3 flex items-center justify-between gap-3 border border-slate-700 bg-black/25 px-3 py-2.5">
            <span className="truncate font-mono text-xs text-slate-200">135.148.15.101:26952</span>
            <button type="button" onClick={async () => { try { await navigator.clipboard.writeText('135.148.15.101:26952'); setCopiedServerAddress(true); window.setTimeout(() => setCopiedServerAddress(false), 1800); } catch { setCopiedServerAddress(false); } }} className="inline-flex shrink-0 items-center gap-1.5 text-[10px] font-bold uppercase text-orange-400 transition hover:text-orange-300" aria-label={ru ? 'Скопировать адрес сервера' : 'Copy server address'}>
              {copiedServerAddress ? <Check size={13} /> : <Copy size={13} />}
              {copiedServerAddress ? (ru ? 'Скопировано' : 'Copied') : (ru ? 'Копировать' : 'Copy')}
            </button>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <a href="steam://connect/135.148.15.101:26952" className="inline-flex min-h-10 items-center justify-center gap-2 bg-orange-500 px-3 py-2 text-[11px] font-black uppercase tracking-wide text-[#101318] transition hover:bg-orange-400"><ArrowRight size={15} /> {ru ? 'Играть' : 'Play now'}</a>
            <a href="https://enum.gg/server/rusty-lub-vanilla-fun-server-nmcqfPa3" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center justify-center gap-2 border border-slate-600 px-3 py-2 text-[11px] font-bold uppercase tracking-wide text-slate-200 transition hover:border-orange-500 hover:text-orange-400">{ru ? 'Подробнее' : 'Details'} <ExternalLink size={13} /></a>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2 border-t border-slate-700/70 pt-3">
            <div><p className="font-mono text-[9px] uppercase tracking-wider text-slate-500">{ru ? 'РЕГИОН' : 'REGION'}</p><p className="mt-1 text-xs font-bold text-white">US</p></div>
            <div><p className="font-mono text-[9px] uppercase tracking-wider text-slate-500">{ru ? 'КАРТА' : 'MAP'}</p><p className="mt-1 text-xs font-bold text-white">Procedural</p></div>
            <div><p className="font-mono text-[9px] uppercase tracking-wider text-slate-500">{ru ? 'СЛОТЫ' : 'SLOTS'}</p><p className="mt-1 text-xs font-bold text-white">75</p></div>
          </div>
        </aside>
      </section>

      {/* NEWS & GUIDES */}
      <section className="mx-auto max-w-none border-b border-slate-700/70 px-5 py-8 sm:px-8 lg:px-10">
        <div className="mb-4 grid gap-4 sm:grid-cols-[minmax(260px,.7fr)_minmax(0,2fr)] sm:items-end"><div><p className="font-mono text-[10px] font-bold uppercase tracking-[.2em] text-slate-400"><span className="text-orange-500">///</span> {ru ? 'АКТУАЛЬНОЕ' : 'LATEST'}</p><h2 className="mt-1 text-xl font-black uppercase text-white sm:text-2xl">{ru ? 'Новости и гайды' : 'News and guides'}</h2><p className="mt-2 text-xs leading-5 text-slate-400">{ru ? 'Следи за обновлениями, читай полезные материалы и будь в курсе всего, что происходит в мире Rust.' : 'Follow updates, explore useful materials and stay informed about Rust.'}</p><button onClick={() => onNavigate('news')} className="mt-3 inline-flex items-center gap-2 border border-orange-500/70 px-4 py-2 text-[10px] font-bold text-orange-400 hover:bg-orange-500 hover:text-black">{ru ? 'Перейти к новостям' : 'View news'} <ArrowRight size={13} /></button></div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">{newsCards.map((card, i) => <button key={card.title} onClick={() => onNavigate('news')} className="group overflow-hidden border border-slate-600/60 bg-[#0d131a] text-left transition hover:border-orange-500/70"><div className="relative h-24 overflow-hidden"><img src={oilRigBg} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" style={{ objectPosition: card.imagePosition }} /><div className="absolute inset-0 bg-gradient-to-t from-[#080d12] to-transparent" /></div><div className="p-3"><span className="font-mono text-[9px] font-black text-orange-500">{card.category}</span><p className="mt-1 min-h-9 text-[11px] font-bold leading-4 text-white">{card.title}</p><span className="mt-2 flex justify-end text-orange-500"><ArrowRight size={13} /></span></div></button>)}</div>
        </div>
      </section>

      {/* COMMUNITY */}
      <section className="mx-auto max-w-none px-5 py-7 sm:px-8 lg:px-10">
        <div className="grid gap-5 border border-slate-600/60 bg-[linear-gradient(100deg,#101923,#0b1118)] p-5 sm:grid-cols-[1.4fr_1fr_auto] sm:items-center sm:px-7">
          <div className="flex items-center gap-4"><div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#5865f2]/15 text-[#a5adff]"><MessageCircle size={28} /></div><div><h2 className="text-xs font-black uppercase text-white">{ru ? 'Присоединяйся к нашему сообществу' : 'Join our community'}</h2><p className="mt-1 text-[10px] text-slate-400">{ru ? 'Общайся, получай помощь, участвуй в жизни проекта.' : 'Chat, get help and take part in the project.'}</p></div></div>
          <div className="flex flex-wrap gap-5 text-[10px] text-slate-300"><span className="flex items-center gap-2"><Users size={17} /> <b>Discord</b></span><span className="flex items-center gap-2"><MessageCircle size={17} /> <b>Community</b></span><span className="flex items-center gap-2"><ShieldCheck size={17} /> <b>Support</b></span></div>
          <a href="https://discord.gg/R2TyKZ9xvZ" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center justify-center gap-2 bg-orange-500 px-5 py-3 text-[10px] font-black uppercase text-[#101318] transition hover:bg-orange-400">{ru ? 'Перейти в Discord' : 'Join Discord'} <ArrowRight size={14} /></a>
        </div>
      </section>

      {/* PARTNERSHIP / CONTACT */}
      <section className="mx-auto flex max-w-none flex-wrap items-center justify-between gap-4 border-t border-slate-700/60 px-5 pt-5 sm:px-8 lg:px-10">
        <div><p className="font-mono text-[10px] font-bold uppercase tracking-wider text-orange-500">{ru ? 'ПАРТНЁРСТВО И ПОДДЕРЖКА' : 'PARTNERSHIPS & SUPPORT'}</p><p className="mt-1 text-xs text-slate-400">{ru ? 'Есть идея или предложение для Rusty.Lub?' : 'Have an idea or suggestion for Rusty.Lub?'}</p></div>
        <div className="flex flex-wrap gap-2"><button onClick={() => onNavigate('support')} className="inline-flex items-center gap-2 border border-slate-600 px-4 py-2 text-[10px] font-bold text-slate-200 hover:border-orange-500">{ru ? 'Связаться с нами' : 'Contact us'} <ArrowRight size={13} /></button><button onClick={copyEmail} className="inline-flex items-center gap-2 border border-slate-600 px-4 py-2 text-[10px] font-bold text-slate-200 hover:border-orange-500">{copiedEmail ? <Check size={13} /> : <Copy size={13} />}{copiedEmail ? (ru ? 'Скопировано' : 'Copied') : 'rusty.lub_offers@bk.ru'}</button></div>
      </section>

      {specialCards.length > 0 && <section className="mx-auto max-w-none px-5 pt-6 sm:px-8 lg:px-10"><p className="mb-3 font-mono text-[10px] font-bold uppercase tracking-wider text-orange-400">{ru ? 'ОСОБЫЙ ДОСТУП' : 'SPECIAL ACCESS'}</p><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{specialCards.map(card => <button key={card.id} onClick={() => onNavigate(card.id)} className="flex items-center gap-3 border border-slate-700 bg-[#101820] p-3 text-left hover:border-orange-500"><ItemImageOrFallback id={card.icon} lang={lang} size={34} /><span className="min-w-0 flex-1"><b className="block text-xs text-white">{card.title}</b><small className="mt-1 block text-[10px] text-slate-400">{card.desc}</small></span><span className="font-mono text-[9px] text-orange-500">{card.tag}</span><ChevronRight size={14} className="text-slate-500" /></button>)}</div></section>}
    </div>
  );
}
