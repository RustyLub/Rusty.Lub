import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  HelpCircle, 
  ChevronDown, 
  Search, 
  Compass, 
  Users, 
  ShieldAlert, 
  Flame, 
  Zap, 
  Layers, 
  BookOpen, 
  Target,
  Sparkles,
  Server,
  Key,
  Gamepad2
} from 'lucide-react';

interface FaqItem {
  id: string;
  category: 'basics' | 'servers' | 'clan' | 'combat' | 'survival';
  questionRu: string;
  questionEn: string;
  answerRu: string;
  answerEn: string;
  tags: string[];
}

const FAQ_DATA: FaqItem[] = [
  {
    id: 'server-choice',
    category: 'servers',
    questionRu: 'Как выбрать свой первый сервер в Rust?',
    questionEn: 'How to choose your first Rust server?',
    answerRu: 'Для новичков лучше всего подходят официальные серверы с лимитом команды (Solo/Duo/Trio) или модифицированные 2x/3x серверы с низким пингом. Избегайте серверов с пометкой Main в первые часы игры, так как там играют кланы по 10-20 человек. Рекомендуем начать с серверов с небольшим онлайном (50-100 человек) для спокойного изучения карты и монументов.',
    answerEn: 'For beginners, official team-limited servers (Solo/Duo/Trio) or lightly modded 2x/3x servers with low ping are best. Avoid Main servers at start where large 10-20 person zergs play. Start on servers with medium pop (50-100 players) to peacefully learn maps, monuments, and blueprints.',
    tags: ['сервер', 'server', 'новичок', 'онлайн', 'вайп', 'wipe', 'ping']
  },
  {
    id: 'first-base',
    category: 'basics',
    questionRu: 'Где и как построить первое надёжное убежище?',
    questionEn: 'Where and how to build the first reliable starter base?',
    answerRu: 'Стройте классический стартер 2x1 или 1x2 с шлюзом (airlock) из двух дверей, открывающихся навстречу друг другу — это защитит от дверных кемперов. Ставьте базу вблизи деревьев и камней, но не слишком близко к крупным монументам (Launch Site, Military Tunnels). Сразу ставьте шкаф с инструментами (TC), замок с кодом или ключом, и улучшайте стены до камня (Stone) и ставьте железные двери.',
    answerEn: 'Build a standard 2x1 or 1x2 starter base with a proper airlock (two doors opening towards each other to prevent doorcamping). Place it near wood and node clusters, away from top-tier monuments. Lock your Tool Cupboard immediately, upgrade walls to stone, and get metal doors installed ASAP.',
    tags: ['база', 'дом', 'стройка', 'starter', '2x1', 'airlock', 'шлюз', 'шкаф', 'tc']
  },
  {
    id: 'find-clan',
    category: 'clan',
    questionRu: 'Как найти адекватный клан или напарника для игры?',
    questionEn: 'How to find a decent clan or teammate for Rust?',
    answerRu: 'Воспользуйтесь разделом "Поиск Клана / Напарников" на нашем сайте! Также создавайте анкеты в официальных Discord-сообществах. Указывайте ваш реальный возраст, количество часов в игре, любимую роль (фермер, электрик, строитель, PvP-стрелок) и прайм-тайм. Для старта лучше искать дуо/трио со схожим опытом.',
    answerEn: 'Use our website\'s "Clan & Teammate Search" section! You can also post in official Discord LFG channels. List your real age, hours played, preferred roles (farmer, electrician, builder, roamer), and time zone. Starting with a duo or trio of similar skill is recommended.',
    tags: ['клан', 'тимейт', 'clan', 'team', 'lfg', 'дискорд', 'пати']
  },
  {
    id: 'soft-side-walls',
    category: 'basics',
    questionRu: 'Что такое "Мягкая сторона" (Soft Side) стен и потолков?',
    questionEn: 'What is the "Soft Side" of walls and ceilings?',
    answerRu: 'Каждая стена и дверной проем в Rust имеет мягкую и твёрдую сторону. Твёрдая сторона должна всегда смотреть НА УЛИЦУ. Мягкая сторона (светлая гладкая текстура или балки) получает в десятки раз больше урона от кирок и копий. Потолки всегда имеют мягкую сторону снизу (изнутри дома). Используйте наш раздел "Эко-рейд" для подробных расчетов!',
    answerEn: 'Every wall and doorway has a soft side and a hard side. The hard side MUST always face outward. The soft side takes up to 10-20x more damage from pickaxes and spears. Ceilings have their soft side facing downward. Check our "Eco-Raid" tab for full breakdown and numbers!',
    tags: ['softside', 'софтсайд', 'экорейд', 'стены', 'реверс', 'кирка']
  },
  {
    id: 'decay-protection',
    category: 'survival',
    questionRu: 'Почему мой дом гниёт и исчезает (Decay)?',
    questionEn: 'Why is my base decaying and breaking down?',
    answerRu: 'Любая постройка в игре требует постоянного содержания. Откройте шкаф с инструментами (Tool Cupboard) и положите внутрь ресурсы, из которых построен ваш дом (дерево, камень, фрагменты металла, МВК). В меню шкафа отображается точное количество часов до полного разрушения постройки. Воспользуйтесь нашим "Калькулятором гниения" для точных расчетов.',
    answerEn: 'All buildings in Rust require maintenance upkeep. Open your Tool Cupboard (TC) and insert matching materials (wood, stone, metal frags, HQM). The TC UI shows exactly how many hours of upkeep remain. You can test your base upkeep in our "Decay Calculator" tab.',
    tags: ['гниение', 'decay', 'шкаф', 'содержание', 'upkeep', 'ресурсы']
  },
  {
    id: 'blueprints-scrap',
    category: 'basics',
    questionRu: 'Как быстро изучать чертежи и фармить скрап (Scrap)?',
    questionEn: 'How to farm scrap fast and unlock blueprints?',
    answerRu: 'Фармите бочки и ящики вдоль дорог и в море на лодке (дайвинг с аквалангом очень безопасен для новичков). Складывайте компоненты (шестеренки, трубы, пружины) и перерабатывайте в переработчике (Recycler) на монументах вроде Mining Outpost или Сфера (Dome). Используйте верстаки 1, 2 и 3 уровней (Workbench) для исследования дерева технологий.',
    answerEn: 'Hit barrels and crates along roads and oceans using diving kits/boats (very safe for beginners). Recycle unwanted components (gears, pipes, springs) at Recyclers in monuments like Mining Outpost or Dome. Use Workbenches (T1, T2, T3) tech trees to unlock necessary blueprints.',
    tags: ['скрап', 'scrap', 'чертежи', 'верстак', 'workbench', 'компоненты', 'переработчик']
  },
  {
    id: 'sound-hearing',
    category: 'combat',
    questionRu: 'Как слышать шаги лучше и не попадать в засады?',
    questionEn: 'How to hear enemy footsteps better and avoid ambushes?',
    answerRu: 'Включите наушники с хорошим позиционированием, отключите внутриигровую музыку (Audio -> Music = 0). Ходьба в приседе (Кнопка Ctrl) делает ваши шаги полностью бесшумными. При подходе к опасным местам всегда осматривайтесь свободной камерой (по умолчанию зажатая клавиша Alt).',
    answerEn: 'Set game music volume to 0. Crouching (Ctrl) makes movement completely silent. Use Alt-look (free look) constantly to maintain 360-degree situational awareness without changing your running direction.',
    tags: ['звук', 'шаги', 'alt', 'присед', 'наушники', 'стелс']
  },
  {
    id: 'rust-plus-app',
    category: 'survival',
    questionRu: 'Что такое Rust+ и зачем оно нужно?',
    questionEn: 'What is Rust+ mobile app and why use it?',
    answerRu: 'Rust+ — это официальное мобильное приложение от Facepunch. Оно позволяет получать уведомления на телефон при срабатывании тревоги на базе (если вас рейдят), отслеживать карту, взрывы вертолета/карго и удаленно переключать умные переключатели (Smart Switch) для закрытия дверей или включения турелей.',
    answerEn: 'Rust+ is the official mobile companion app by Facepunch. It notifies your phone in real-time when raid alarms trigger, lets you view the live map, cargo spawns, and remotely control Smart Switches for auto-turrets and bunker doors.',
    tags: ['rust+', 'растплюс', 'приложение', 'рейд', 'тревога', 'телефон']
  }
];

interface FaqTabProps {
  lang: 'ru' | 'en';
}

export default function FaqTab({ lang }: FaqTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({
    'server-choice': true,
    'first-base': true
  });

  const categories = [
    { id: 'all', labelRu: 'Все вопросы', labelEn: 'All Questions', icon: HelpCircle },
    { id: 'servers', labelRu: 'Выбор серверов', labelEn: 'Server Choice', icon: Server },
    { id: 'basics', labelRu: 'Основы и Стройка', labelEn: 'Basics & Building', icon: Layers },
    { id: 'clan', labelRu: 'Кланы и Команда', labelEn: 'Clans & Teams', icon: Users },
    { id: 'combat', labelRu: 'Бой и Оружие', labelEn: 'Combat & PvP', icon: Target },
    { id: 'survival', labelRu: 'Выживание и Rust+', labelEn: 'Survival & Rust+', icon: ShieldAlert },
  ];

  const quickFilterHints = [
    { label: '2x1 Starter', query: '2x1' },
    { label: 'Soft Side', query: 'softside' },
    { label: 'Decay / Шкаф', query: 'decay' },
    { label: 'Scrap & Blueprints', query: 'scrap' },
    { label: 'Rust+', query: 'rust+' },
    { label: 'Solo/Duo/Trio', query: 'сервер' }
  ];

  const filteredFaq = useMemo(() => {
    return FAQ_DATA.filter((item) => {
      const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
      const query = searchQuery.trim().toLowerCase();
      if (!query) return matchesCategory;

      const qText = (lang === 'ru' ? item.questionRu : item.questionEn).toLowerCase();
      const aText = (lang === 'ru' ? item.answerRu : item.answerEn).toLowerCase();
      const tagMatch = item.tags.some(t => t.toLowerCase().includes(query));

      return matchesCategory && (qText.includes(query) || aText.includes(query) || tagMatch);
    });
  }, [searchQuery, activeCategory, lang]);

  const toggleAccordion = (id: string) => {
    setOpenIds(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const expandAll = () => {
    const allOpened: Record<string, boolean> = {};
    FAQ_DATA.forEach(item => { allOpened[item.id] = true; });
    setOpenIds(allOpened);
  };

  const collapseAll = () => {
    setOpenIds({});
  };

  return (
    <div id="faq-section" className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header Banner with Real-time Search Box */}
      <div className="bg-stone-900/90 border border-stone-800/80 rounded-2xl p-6 sm:p-8 backdrop-blur-md relative overflow-hidden shadow-2xl">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3.5 bg-orange-600/20 text-orange-500 rounded-xl border border-orange-500/30 shadow-lg shadow-orange-950/40">
              <HelpCircle className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-stone-100 tracking-tight flex items-center gap-2.5">
                {lang === 'ru' ? 'База знаний: Вопросы и Ответы' : 'Rust Knowledge Base: FAQ'}
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30 font-medium">
                  {FAQ_DATA.length} {lang === 'ru' ? 'гайда' : 'guides'}
                </span>
              </h1>
              <p className="text-stone-400 text-sm mt-1 max-w-2xl">
                {lang === 'ru'
                  ? 'Подробные ответы на главные вопросы новичков: выбор первого сервера, надёжная постройка, поиск клана и ключевые механики выживания.'
                  : 'Answers to the most common beginner questions: server selection, starter building, finding a team, and essential survival mechanics.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={expandAll}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-stone-800/80 hover:bg-stone-700 text-stone-300 border border-stone-700 transition cursor-pointer"
            >
              {lang === 'ru' ? 'Развернуть все' : 'Expand All'}
            </button>
            <button
              onClick={collapseAll}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-stone-800/80 hover:bg-stone-700 text-stone-400 border border-stone-700 transition cursor-pointer"
            >
              {lang === 'ru' ? 'Свернуть' : 'Collapse All'}
            </button>
          </div>
        </div>

        {/* Real-time Search Input Box */}
        <div className="mt-6 space-y-2.5">
          <div className="relative">
            <Search className="w-5 h-5 text-orange-500/80 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              id="faq-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={lang === 'ru' ? '🔍 Поиск по вопросам, ответам и тегам (сервер, 2x1, softside, decay, scrap, спрей)...' : '🔍 Search FAQ by questions, answers & tags (server, 2x1, softside, decay, scrap, spray)...'}
              className="w-full bg-stone-950/90 border border-stone-700/90 focus:border-orange-500 rounded-xl pl-11 pr-24 py-3.5 text-stone-100 placeholder-stone-500 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 transition shadow-inner"
            />
            {searchQuery && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <span className="text-[11px] font-mono font-bold text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">
                  {filteredFaq.length} {lang === 'ru' ? 'найдено' : 'matches'}
                </span>
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-stone-400 hover:text-stone-100 bg-stone-800 hover:bg-stone-700 px-2 py-1 rounded transition cursor-pointer"
                >
                  {lang === 'ru' ? 'Очистить' : 'Clear'}
                </button>
              </div>
            )}
          </div>

          {/* Quick Filter Keyword Pills */}
          <div className="flex items-center gap-1.5 flex-wrap text-xs pt-1">
            <span className="text-stone-500 text-[11px] font-medium mr-1 flex items-center gap-1">
              <Sparkles size={12} className="text-orange-400" />
              {lang === 'ru' ? 'Быстрый поиск:' : 'Quick tags:'}
            </span>
            {quickFilterHints.map((hint, idx) => (
              <button
                key={idx}
                onClick={() => setSearchQuery(hint.query)}
                className={`text-[11px] px-2.5 py-1 rounded-lg border transition cursor-pointer ${
                  searchQuery.toLowerCase() === hint.query.toLowerCase()
                    ? 'bg-orange-500 text-white border-orange-400 shadow-sm shadow-orange-900/50 font-bold'
                    : 'bg-stone-950/60 hover:bg-stone-800 text-stone-400 hover:text-orange-300 border-stone-800 hover:border-orange-500/40'
                }`}
              >
                {hint.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all border ${
                isActive
                  ? 'bg-orange-600 text-white border-orange-500 shadow-md shadow-orange-950/40'
                  : 'bg-stone-900/80 text-stone-400 border-stone-800/80 hover:bg-stone-800 hover:text-stone-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              {lang === 'ru' ? cat.labelRu : cat.labelEn}
            </button>
          );
        })}
      </div>

      {/* FAQ Accordion List */}
      <div className="space-y-3">
        {filteredFaq.length === 0 ? (
          <div className="bg-stone-900/60 border border-stone-800 rounded-2xl p-12 text-center">
            <HelpCircle className="w-12 h-12 text-stone-600 mx-auto mb-3" />
            <p className="text-stone-300 font-bold text-base">
              {lang === 'ru' ? 'Ничего не найдено' : 'No matching questions found'}
            </p>
            <p className="text-stone-500 text-sm mt-1">
              {lang === 'ru' ? 'Попробуйте изменить поисковый запрос или выбрать другую категорию' : 'Try adjusting your search query or choosing another category'}
            </p>
          </div>
        ) : (
          filteredFaq.map((item) => {
            const isOpen = !!openIds[item.id];
            const q = lang === 'ru' ? item.questionRu : item.questionEn;
            const a = lang === 'ru' ? item.answerRu : item.answerEn;

            return (
              <div
                key={item.id}
                id={`faq-item-${item.id}`}
                className={`bg-stone-900/80 border rounded-xl overflow-hidden transition-colors ${
                  isOpen ? 'border-orange-500/40 bg-stone-900/95 shadow-lg shadow-black/40' : 'border-stone-800 hover:border-stone-700/80'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(item.id)}
                  className="w-full px-5 py-4 flex items-center justify-between text-left gap-4 focus:outline-none"
                >
                  <span className="font-bold text-stone-100 text-sm sm:text-base flex items-center gap-3">
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${isOpen ? 'bg-orange-500 shadow-sm shadow-orange-500' : 'bg-stone-600'}`} />
                    {q}
                  </span>
                  <div className={`p-1.5 rounded-lg bg-stone-800/80 text-stone-400 transition-transform duration-200 flex-shrink-0 ${isOpen ? 'rotate-180 text-orange-400 bg-orange-500/20' : ''}`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 pt-1 text-sm text-stone-300 leading-relaxed border-t border-stone-800/60 mt-1">
                        <p className="pt-2">{a}</p>

                        {/* Tag Pills */}
                        <div className="flex flex-wrap items-center gap-1.5 mt-4 pt-3 border-t border-stone-800/40">
                          <span className="text-[11px] font-medium text-stone-500 uppercase tracking-wider mr-1">
                            {lang === 'ru' ? 'Теги:' : 'Tags:'}
                          </span>
                          {item.tags.map((tag) => (
                            <span
                              key={tag}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSearchQuery(tag);
                              }}
                              className="cursor-pointer text-[11px] px-2 py-0.5 rounded-md bg-stone-800 text-stone-400 hover:bg-orange-500/20 hover:text-orange-300 border border-stone-700/60 transition"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
