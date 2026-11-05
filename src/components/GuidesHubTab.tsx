import { useState } from 'react';
import {
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  ChevronRight,
  Crosshair,
  Gauge,
  GraduationCap,
  Keyboard,
  Map,
  Search,
  ShieldAlert,
  Wrench
} from 'lucide-react';

interface GuidesHubTabProps {
  lang: 'ru' | 'en';
  onNavigate: (tab: any) => void;
}

type GuideCategory = 'all' | 'technical' | 'gameplay' | 'reference';

export default function GuidesHubTab({ lang, onNavigate }: GuidesHubTabProps) {
  const ru = lang === 'ru';
  const [category, setCategory] = useState<GuideCategory>('all');
  const [search, setSearch] = useState('');

  const guides = [
    {
      id: 'errors',
      category: 'technical' as const,
      icon: ShieldAlert,
      code: '01',
      title: ru ? 'Ошибки и решения' : 'Errors & fixes',
      desc: ru ? 'EAC, вылеты, чёрный экран и проблемы запуска Rust.' : 'EAC, crashes, black screens and Rust startup issues.',
      detail: ru ? 'Диагностика' : 'Troubleshooting'
    },
    {
      id: 'binds',
      category: 'technical' as const,
      icon: Keyboard,
      code: '02',
      title: ru ? 'Бинды и команды' : 'Binds & commands',
      desc: ru ? 'Готовые команды для боя, строительства и быстрого лута.' : 'Ready-to-use commands for combat, building and looting.',
      detail: ru ? 'Настройка игры' : 'Game setup'
    },
    {
      id: 'fps',
      category: 'technical' as const,
      icon: Gauge,
      code: '03',
      title: ru ? 'Оптимизация FPS' : 'FPS optimization',
      desc: ru ? 'Настройки графики и системы под разное железо.' : 'Graphics and system settings for different hardware.',
      detail: ru ? 'Производительность' : 'Performance'
    },
    {
      id: 'weapons',
      category: 'gameplay' as const,
      icon: Crosshair,
      code: '04',
      title: ru ? 'Оружие и стрельба' : 'Weapons & combat',
      desc: ru ? 'Урон, дистанции, модули и особенности оружия.' : 'Damage, range, attachments and weapon characteristics.',
      detail: ru ? 'Тактика' : 'Combat'
    },
    {
      id: 'monuments',
      category: 'reference' as const,
      icon: Map,
      code: '05',
      title: ru ? 'Монументы и головоломки' : 'Monuments & puzzles',
      desc: ru ? 'Карточки доступа, предохранители, маршруты и лут.' : 'Keycards, fuses, routes and loot locations.',
      detail: ru ? 'Справочник' : 'Reference'
    },
    {
      id: 'wipe',
      category: 'reference' as const,
      icon: CalendarDays,
      code: '06',
      title: ru ? 'Вайпы и события' : 'Wipes & events',
      desc: ru ? 'Расписание вайпов и важные игровые события.' : 'Wipe schedules and important in-game events.',
      detail: ru ? 'Расписание' : 'Schedule'
    },
    {
      id: 'raid',
      category: 'gameplay' as const,
      icon: Crosshair,
      code: '08',
      title: ru ? 'Рейд и взрывчатка' : 'Raiding & explosives',
      desc: ru ? 'Подсчёт C4, ракет, сатчелей и патронов перед выходом на рейд.' : 'Plan C4, rockets, satchels and explosive ammo before a raid.',
      detail: ru ? 'Калькулятор' : 'Calculator'
    },
    {
      id: 'faq',
      category: 'gameplay' as const,
      icon: GraduationCap,
      code: '07',
      title: ru ? 'Основы Rust · FAQ' : 'Rust basics · FAQ',
      desc: ru ? 'Ответы на частые вопросы и полезное для старта.' : 'Answers to common questions and useful starter knowledge.',
      detail: ru ? 'Для новичков' : 'Getting started'
    }
  ];

  const filters: { id: GuideCategory; label: string }[] = [
    { id: 'all', label: ru ? 'Все гайды' : 'All guides' },
    { id: 'technical', label: ru ? 'Настройка' : 'Setup' },
    { id: 'gameplay', label: ru ? 'Геймплей' : 'Gameplay' },
    { id: 'reference', label: ru ? 'Справочник' : 'Reference' }
  ];

  const term = search.trim().toLocaleLowerCase();
  const filteredGuides = guides.filter(guide => {
    const matchesCategory = category === 'all' || guide.category === category;
    const matchesSearch = !term || `${guide.title} ${guide.desc} ${guide.detail}`.toLocaleLowerCase().includes(term);
    return matchesCategory && matchesSearch;
  });

  return (
    <main className="mx-auto w-full max-w-[1440px] space-y-5 pb-10 text-left">
      <header className="relative overflow-hidden border border-[#29313b] bg-[#11171e] px-5 py-5 sm:px-7 sm:py-6">
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-[radial-gradient(ellipse_at_right,rgba(249,115,22,.13),transparent_70%)]" />
        <div className="relative flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <div className="mb-2 flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[.2em] text-orange-500">
              <span>// RUSTY.LUB KNOWLEDGE</span><span className="text-slate-500">·</span><span className="text-slate-400">{ru ? 'БАЗА ЗНАНИЙ' : 'FIELD MANUAL'}</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">{ru ? 'База знаний Rust' : 'Rust knowledge base'}</h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">{ru ? 'Собрали полезные вещи по игре в одном месте: от первых часов и стройки до рейдов, монументов и настроек. Без длинных вступлений — только то, что пригодится на сервере.' : 'A practical collection for Rust: from your first hours and base building to raids, monuments and settings. No long intros — just useful stuff.'}</p>
          </div>
          <div className="flex items-center gap-3 border-l border-slate-700/70 pl-4">
            <div className="text-right">
              <div className="text-xl font-black tabular-nums text-white">{guides.length}</div>
              <div className="text-[9px] font-mono uppercase tracking-widest text-slate-400">{ru ? 'РАЗДЕЛОВ' : 'GUIDES'}</div>
            </div>
            <BookOpen size={22} className="text-orange-500" />
          </div>
        </div>
      </header>

      <section className="space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-1.5" role="group" aria-label={ru ? 'Категории гайдов' : 'Guide categories'}>
            {filters.map(filter => (
              <button
                key={filter.id}
                onClick={() => setCategory(filter.id)}
                className={`min-h-9 border px-3 text-[11px] font-bold transition-colors ${category === filter.id ? 'border-orange-500 bg-orange-500 text-[#101318]' : 'border-slate-700 bg-[#11171e] text-slate-400 hover:border-slate-500 hover:text-white'}`}
              >
                {filter.label}
              </button>
            ))}
          </div>
          <label className="flex min-h-9 w-full items-center gap-2 border border-slate-700 bg-[#0c1117] px-3 sm:max-w-[260px]">
            <Search size={14} className="shrink-0 text-slate-500" />
            <input
              value={search}
              onChange={event => setSearch(event.target.value)}
              placeholder={ru ? 'Найти гайд…' : 'Search guides…'}
              className="w-full bg-transparent text-xs text-white outline-none placeholder:text-slate-500"
            />
          </label>
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3">
          {filteredGuides.map(guide => {
            const Icon = guide.icon;
            return (
              <button
                key={guide.id}
                onClick={() => onNavigate(guide.id)}
                className="group flex min-h-[132px] items-start gap-3 border border-[#29313b] bg-[#11171e] p-4 text-left transition-colors hover:border-orange-500/60 hover:bg-[#151d26]"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-slate-700/80 bg-[#0c1117] text-orange-500 transition-colors group-hover:border-orange-500/40">
                  <Icon size={20} strokeWidth={1.8} />
                </div>
                <span className="min-w-0 flex-1">
                  <span className="mb-1 flex items-center gap-2 font-mono text-[9px] font-bold tracking-widest text-slate-500">
                    <span>{guide.code}</span><span className="h-px w-5 bg-slate-700" /><span>{guide.detail}</span>
                  </span>
                  <span className="block text-sm font-bold text-white transition-colors group-hover:text-orange-400">{guide.title}</span>
                  <span className="mt-1 block text-[11px] leading-5 text-slate-400">{guide.desc}</span>
                  <span className="mt-3 inline-flex items-center gap-1 text-[10px] font-bold text-orange-500">
                    {ru ? 'Открыть раздел' : 'Open guide'}<ChevronRight size={13} className="transition-transform group-hover:translate-x-0.5" />
                  </span>
                </span>
                <ArrowUpRight size={14} className="shrink-0 text-slate-600 transition-colors group-hover:text-orange-500" />
              </button>
            );
          })}
          {filteredGuides.length === 0 && (
            <p className="col-span-full border border-dashed border-slate-700 p-6 text-center text-xs text-slate-400">
              {ru ? 'Ничего не найдено. Измени запрос или категорию.' : 'No guides found. Try another search or category.'}
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
