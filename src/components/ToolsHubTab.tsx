import { useMemo, useState } from 'react';
import { ChevronRight, Lock, Search, Shield, Zap, Package, Keyboard, Grid3X3, Sparkles } from 'lucide-react';
import { ItemImageOrFallback } from './IconUtils';
import { CustomUser } from '../types';

interface ToolsHubTabProps {
  lang: 'ru' | 'en';
  onNavigate: (tab: any) => void;
  isVip: boolean;
  isAdmin: boolean;
  isOwner: boolean;
  onOpenVip: () => void;
  appTheme?: 'dark' | 'light';
  currentUser?: CustomUser | null;
}

type ToolCategory = 'all' | 'raid' | 'base' | 'resources' | 'gameplay';

export default function ToolsHubTab({
  lang,
  onNavigate,
  isVip,
  isAdmin,
  isOwner,
  appTheme = 'dark',
  currentUser
}: ToolsHubTabProps) {
  const ru = lang === 'ru';
  const light = appTheme === 'light';
  const [category, setCategory] = useState<ToolCategory>('all');
  const [search, setSearch] = useState('');

  const publicTools = [
    { id: 'raid', iconId: 'explosive.timed', category: 'raid' as const, title: ru ? 'Рейд и крафт' : 'Raid & Craft', desc: ru ? 'Взрывчатка для цели или ресурсы для изготовления.' : 'Explosives for a target or ingredients for crafting.', featured: true },
    { id: 'ecoraid', iconId: 'pickaxe', category: 'raid' as const, title: ru ? 'Эко-рейд' : 'Eco raid', desc: ru ? 'Инструменты, прочность и слабая сторона.' : 'Tools, durability and soft-side routes.' },
    { id: 'decay', iconId: 'cupboard.tool', category: 'base' as const, title: ru ? 'Гниение и содержание' : 'Decay & upkeep', desc: ru ? 'Время до разрушения и содержание построек.' : 'Decay timers and building upkeep.' },
    { id: 'electrical', iconId: 'generator.wind.scrap', category: 'base' as const, title: ru ? 'Электрика' : 'Electricity', desc: ru ? 'Питание, аккумуляторы и схемы базы.' : 'Power, batteries and base circuits.' },
    { id: 'mixing', iconId: 'mixingtable', category: 'resources' as const, title: ru ? 'Стол смешивания' : 'Mixing table', desc: ru ? 'Рецепты чаёв и необходимые ингредиенты.' : 'Tea recipes and required ingredients.' },
    { id: 'breeder', iconId: 'seed.hemp', category: 'resources' as const, title: ru ? 'Селекция растений' : 'Plant genetics', desc: ru ? 'Гены, скрещивание и урожай.' : 'Genes, crossbreeding and harvests.' },
    { id: 'recycler', iconId: 'scrap', category: 'resources' as const, title: ru ? 'Переработка' : 'Recycler', desc: ru ? 'Ресурсы и скрап после переработки.' : 'Resources and scrap from recycling.' },
    { id: 'quarry', iconId: 'jackhammer', category: 'resources' as const, title: ru ? 'Карьеры и добыча' : 'Quarries & mining', desc: ru ? 'Добыча ресурсов и расход дизеля.' : 'Resource output and diesel usage.' },
    { id: 'binds', iconId: 'keycard_blue', category: 'gameplay' as const, title: ru ? 'Бинды и команды' : 'Binds & commands', desc: ru ? 'Готовые команды и настройка клавиш.' : 'Ready-to-use commands and keybinds.' }
  ];

  const categories: { id: ToolCategory; label: string }[] = [
    { id: 'all', label: ru ? 'Все' : 'All' },
    { id: 'raid', label: ru ? 'Рейд' : 'Raid' },
    { id: 'base', label: ru ? 'База' : 'Base' },
    { id: 'resources', label: ru ? 'Ресурсы' : 'Resources' },
    { id: 'gameplay', label: ru ? 'Геймплей' : 'Gameplay' }
  ];

  const filteredTools = useMemo(() => {
    const term = search.trim().toLocaleLowerCase();
    return publicTools.filter(tool => {
      const matchesCategory = category === 'all' || tool.category === category;
      const matchesSearch = !term || `${tool.title} ${tool.desc}`.toLocaleLowerCase().includes(term);
      return matchesCategory && matchesSearch;
    });
  }, [category, search, ru]);

  const hasSpecialAccess = Boolean(currentUser && (isVip || isOwner || isAdmin));
  const specialTools = [
    ...(currentUser && isVip ? [{ id: 'radar', iconId: 'rf_pager', title: 'Player Radar', desc: ru ? 'Активность игроков и серверов.' : 'Player and server activity.', tag: 'VIP' }] : []),
    ...(currentUser && isOwner ? [{ id: 'rustplus', iconId: 'smart.alarm', title: 'Rust+ Bot Hub', desc: ru ? 'Управление умными устройствами базы.' : 'Manage smart base devices.', tag: 'OWNER' }] : []),
    ...(currentUser && isAdmin ? [
      { id: 'admin', iconId: 'lock.code', title: ru ? 'Панель администратора' : 'Admin panel', desc: ru ? 'Управление сайтом и модерация.' : 'Site management and moderation.', tag: 'ADMIN' },
      { id: 'icons', iconId: 'spraycan', title: ru ? 'Каталог иконок Rust' : 'Rust icons catalog', desc: ru ? 'Внутриигровые иконки и идентификаторы.' : 'Game icons and identifiers.', tag: 'ADMIN' }
    ] : [])
  ];

  const panel = light ? 'border-[#303b49] bg-[#111820]' : 'border-[#29313b] bg-[#11171e]';
  const muted = light ? 'text-slate-400' : 'text-slate-400';

  return (
    <main className="mx-auto w-full max-w-[1440px] space-y-5 pb-10 text-left">
      <header className={`relative overflow-hidden border ${panel} px-5 py-5 sm:px-7 sm:py-6`}>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-[radial-gradient(ellipse_at_right,rgba(249,115,22,.13),transparent_70%)]" />
        <div className="relative flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <div className="mb-2 flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[.2em] text-orange-500">
              <span>// RUSTY.LUB TOOLS</span><span className={muted}>·</span><span className={muted}>{ru ? 'ИНСТРУМЕНТЫ ВЫЖИВАНИЯ' : 'SURVIVAL TOOLKIT'}</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">{ru ? 'Калькуляторы и инструменты' : 'Calculators & tools'}</h1>
            <p className={`mt-2 max-w-xl text-sm leading-6 ${muted}`}>{ru ? 'Выбери задачу — нужный инструмент уже под рукой. Без лишних экранов и сложной навигации.' : 'Choose a task and open the right tool. Clear controls, useful results, no clutter.'}</p>
          </div>
          <div className="flex items-center gap-3 border-l border-slate-700/70 pl-4">
            <div className="text-right"><div className="text-xl font-black tabular-nums text-white">{publicTools.length}</div><div className={`text-[9px] font-mono uppercase tracking-widest ${muted}`}>{ru ? 'ИНСТРУМЕНТОВ' : 'TOOLS'}</div></div>
            <Grid3X3 size={22} className="text-orange-500" />
          </div>
        </div>
      </header>

      <section className="space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-1.5" role="group" aria-label={ru ? 'Категории инструментов' : 'Tool categories'}>
            {categories.map(item => (
              <button key={item.id} onClick={() => setCategory(item.id)} className={`min-h-9 border px-3 text-[11px] font-bold transition-colors ${category === item.id ? 'border-orange-500 bg-orange-500 text-[#101318]' : `border-slate-700 bg-[#11171e] text-slate-400 hover:border-slate-500 hover:text-white`}`}>{item.label}</button>
            ))}
          </div>
          <label className={`flex min-h-9 w-full items-center gap-2 border px-3 sm:max-w-[260px] ${light ? 'border-[#303b49] bg-[#111820]' : 'border-slate-700 bg-[#0c1117]'}`}>
            <Search size={14} className="shrink-0 text-slate-500" />
            <input value={search} onChange={event => setSearch(event.target.value)} placeholder={ru ? 'Найти инструмент…' : 'Find a tool…'} className="w-full bg-transparent text-xs text-white outline-none placeholder:text-slate-500" />
          </label>
        </div>

        <button onClick={() => onNavigate('raid')} className="group relative flex w-full flex-col gap-4 overflow-hidden border border-orange-500/40 bg-[#151b22] p-4 text-left transition-colors hover:border-orange-400 sm:flex-row sm:items-center sm:p-5">
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(ellipse_at_right,rgba(249,115,22,.12),transparent_70%)]" />
          <div className="relative flex h-14 w-14 shrink-0 items-center justify-center border border-orange-500/30 bg-[#0c1117]"><ItemImageOrFallback id="explosive.timed" lang={lang} size={44} /></div>
          <div className="relative min-w-0 flex-1">
            <div className="mb-1 flex flex-wrap items-center gap-2"><span className="font-mono text-[9px] font-bold uppercase tracking-[.18em] text-orange-500">{ru ? 'ОСНОВНОЙ ИНСТРУМЕНТ' : 'FEATURED TOOL'}</span><span className="border border-orange-500/30 px-1.5 py-0.5 text-[9px] font-bold text-orange-400">{ru ? 'РЕЙД + КРАФТ' : 'RAID + CRAFT'}</span></div>
            <h2 className="text-base font-black text-white sm:text-lg">{ru ? 'Рейд-калькулятор' : 'Raid calculator'}</h2>
            <p className={`mt-1 text-xs leading-5 ${muted}`}>{ru ? 'Рассчитай взрывчатку для постройки или общий список ресурсов для крафта C4, ракет, сатчелей и патронов.' : 'Calculate explosives for a structure or combined crafting resources for C4, rockets, satchels and ammo.'}</p>
          </div>
          <span className="relative inline-flex shrink-0 items-center gap-2 border border-slate-600 px-4 py-2 text-[11px] font-bold text-white transition-colors group-hover:border-orange-500 group-hover:text-orange-400">{ru ? 'Открыть' : 'Open'}<ChevronRight size={14} /></span>
        </button>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3">
          {filteredTools.filter(tool => !tool.featured).map(tool => (
            <button key={tool.id} onClick={() => onNavigate(tool.id)} className={`group flex min-h-[104px] items-center gap-3 border p-3 text-left transition-colors hover:border-orange-500/60 ${panel}`}>
              <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-slate-700/70 bg-[#0c1117]"><ItemImageOrFallback id={tool.iconId} lang={lang} size={34} /></div>
              <span className="min-w-0 flex-1"><span className="block text-sm font-bold text-white group-hover:text-orange-400">{tool.title}</span><span className={`mt-1 block text-[11px] leading-4 ${muted}`}>{tool.desc}</span></span>
              <ChevronRight size={15} className="shrink-0 text-slate-600 transition-transform group-hover:translate-x-0.5 group-hover:text-orange-500" />
            </button>
          ))}
          {filteredTools.filter(tool => !tool.featured).length === 0 && <p className={`col-span-full border border-dashed p-6 text-center text-xs ${muted}`}>{ru ? 'Ничего не найдено. Измени запрос или категорию.' : 'No tools found. Try another search or category.'}</p>}
        </div>
      </section>

      {hasSpecialAccess && specialTools.length > 0 && (
        <section className="space-y-3 border-t border-slate-800 pt-4">
          <div className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[.18em] text-slate-400"><Lock size={13} className="text-orange-500" />{ru ? 'Специальный доступ' : 'Special access'}</div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3">
            {specialTools.map(tool => (
              <button key={tool.id} onClick={() => onNavigate(tool.id)} className={`group flex min-h-[88px] items-center gap-3 border p-3 text-left transition-colors hover:border-orange-500/60 ${panel}`}>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-slate-700 bg-[#0c1117]"><ItemImageOrFallback id={tool.iconId} lang={lang} size={32} /></div>
                <span className="min-w-0 flex-1"><span className="flex flex-wrap items-center gap-2 text-sm font-bold text-white"><span>{tool.title}</span><span className="border border-orange-500/30 px-1.5 py-0.5 font-mono text-[8px] text-orange-400">{tool.tag}</span></span><span className={`mt-1 block text-[11px] leading-4 ${muted}`}>{tool.desc}</span></span>
                <ChevronRight size={14} className="text-slate-600 group-hover:text-orange-500" />
              </button>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
