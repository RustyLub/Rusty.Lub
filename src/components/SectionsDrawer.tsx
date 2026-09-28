import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Search,
  Home,
  Compass,
  UserPlus,
  MessageSquare,
  HelpCircle,
  BookOpen,
  Keyboard,
  Settings,
  Target,
  MapPin,
  Clock,
  Flame,
  Pickaxe,
  Calculator,
  Zap,
  Cpu,
  Sprout,
  Layers,
  Activity,
  Smartphone,
  Image,
  ShieldCheck,
  Lock,
  ExternalLink,
  ChevronRight,
  Sparkles,
  LayoutGrid
} from 'lucide-react';
import { ItemImageOrFallback } from './IconUtils';
import { CustomUser } from '../types';

export type TabType = 
  | 'home' 
  | 'tools' 
  | 'guides' 
  | 'faq' 
  | 'errors' 
  | 'binds' 
  | 'fps' 
  | 'raid' 
  | 'decay' 
  | 'electrical' 
  | 'weapons' 
  | 'breeder' 
  | 'chat' 
  | 'news' 
  | 'admin' 
  | 'radar' 
  | 'recycler' 
  | 'icons' 
  | 'monuments' 
  | 'wipe' 
  | 'ecoraid' 
  | 'quarry' 
  | 'mixing' 
  | 'clan' 
  | 'rustplus';

interface SectionItem {
  id: TabType;
  titleRu: string;
  titleEn: string;
  descRu: string;
  descEn: string;
  iconId?: string;
  lucideIcon?: React.ReactNode;
  badge?: string;
  badgeColor?: string;
  isSpecial?: boolean;
  requiredRole?: 'vip' | 'owner' | 'admin';
}

interface SectionCategory {
  id: 'tools' | 'knowledge' | 'community' | 'special';
  titleRu: string;
  titleEn: string;
  badgeRu: string;
  badgeEn: string;
  items: SectionItem[];
}

interface SectionsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: TabType;
  onSelectTab: (tabId: TabType) => void;
  lang: 'ru' | 'en';
  appTheme: 'light' | 'dark';
  isVip: boolean;
  isAdmin: boolean;
  isOwner: boolean;
  onOpenVip?: () => void;
  currentUser?: CustomUser | null;
}

export default function SectionsDrawer({
  isOpen,
  onClose,
  activeTab,
  onSelectTab,
  lang,
  appTheme,
  isVip,
  isAdmin,
  isOwner,
  onOpenVip,
  currentUser
}: SectionsDrawerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Focus search when opened
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 150);
      return () => clearTimeout(timer);
    } else {
      setSearchQuery('');
      setSelectedCategory('all');
    }
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Full categorized registry of all sections from the second photo
  const categories: SectionCategory[] = useMemo(() => [
    {
      id: 'tools',
      titleRu: 'КАЛЬКУЛЯТОРЫ И ИНСТРУМЕНТЫ',
      titleEn: 'CALCULATORS & TOOLS',
      badgeRu: '9 инструментов',
      badgeEn: '9 tools',
      items: [
        {
          id: 'tools',
          titleRu: 'Каталог всех инструментов',
          titleEn: 'All Tools Hub',
          descRu: 'Главная панель калькуляторов и утилит выживания',
          descEn: 'Master dashboard for all raid & survival utilities',
          lucideIcon: <LayoutGrid size={20} className="text-red-600" />,
          badge: 'HUB',
          badgeColor: 'bg-red-500/10 text-red-600 border-red-500/20'
        },
        {
          id: 'raid',
          titleRu: 'Калькулятор Рейда',
          titleEn: 'Raid Calculator',
          descRu: 'Расчет серы, ракет, С4, взрывных патронов под любые стены',
          descEn: 'Sulfur, rockets, C4, exp ammo costs for any base tier',
          iconId: 'explosive.timed',
          badge: 'HOT',
          badgeColor: 'bg-amber-500/10 text-amber-600 border-amber-500/20'
        },
        {
          id: 'ecoraid',
          titleRu: 'Эко-Рейд & Soft Side',
          titleEn: 'Eco-Raid & Soft Side',
          descRu: 'Дешевый рейд кирками, копьями и инструментами по мягкой стороне',
          descEn: 'Cost-efficient raiding with pickaxes, spears & tools',
          iconId: 'pickaxe',
          badge: 'ECO',
          badgeColor: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
        },
        {
          id: 'decay',
          titleRu: 'Таймер Гниения (TC)',
          titleEn: 'Decay & Upkeep Timer',
          descRu: 'Расчет времени гниения построек и содержания шкафа (TC)',
          descEn: 'Calculate wall upkeep & decay timers when TC runs empty',
          iconId: 'cupboard.tool'
        },
        {
          id: 'electrical',
          titleRu: 'Симулятор Электрики',
          titleEn: 'Electrical Simulator',
          descRu: 'Схемы солнечных панелей, батарей, турелей и автоматики',
          descEn: 'Interactive wire simulator for solar, batteries & SAM sites',
          iconId: 'generator.wind.scrap'
        },
        {
          id: 'mixing',
          titleRu: 'Стол Смешивания',
          titleEn: 'Mixing Table',
          descRu: 'Рецепты чаев (здоровье, руда, дерево) и пороха',
          descEn: 'Tea brewing recipes (health, ore, max health) & pure gunpowder',
          iconId: 'mixingtable'
        },
        {
          id: 'breeder',
          titleRu: 'Фермерство & Генетика',
          titleEn: 'Breeder & Genetics',
          descRu: 'Селекция генов конопли (Y/G), полив, свет и урожайность',
          descEn: 'Hemp crossbreeding solver for perfect 6Y/6G clones',
          iconId: 'seed.hemp'
        },
        {
          id: 'recycler',
          titleRu: 'Переработчик Предметов',
          titleEn: 'Recycler & Scrap',
          descRu: 'Выход металлолома, МВК и ткани из компонентов и предметов',
          descEn: 'Scrap, HQM & cloth yield breakdown for any recycled item',
          iconId: 'scrap'
        },
        {
          id: 'quarry',
          titleRu: 'Карьеры & Добыча',
          titleEn: 'Mining & Quarry',
          descRu: 'Калькулятор дизеля, добычи руды и гигантского экскаватора',
          descEn: 'Diesel fuel efficiency, ore yield & Giant Excavator rates',
          iconId: 'jackhammer'
        }
      ]
    },
    {
      id: 'knowledge',
      titleRu: 'БАЗА ЗНАНИЙ И ГАЙДЫ',
      titleEn: 'KNOWLEDGE & GUIDES',
      badgeRu: '8 разделов',
      badgeEn: '8 sections',
      items: [
        {
          id: 'guides',
          titleRu: 'Каталог Гайдов',
          titleEn: 'Guides Catalog',
          descRu: 'Общий хаб всех тактик, руководств и игровых баз знаний',
          descEn: 'Central hub for all gameplay guides, tactics & tutorials',
          lucideIcon: <BookOpen size={20} className="text-blue-600" />,
          badge: 'GUIDES',
          badgeColor: 'bg-blue-500/10 text-blue-600 border-blue-500/20'
        },
        {
          id: 'faq',
          titleRu: 'Частые Вопросы (FAQ)',
          titleEn: 'FAQ & Beginners',
          descRu: 'Базовые советы новичкам, ответы на частые игровые вопросы',
          descEn: 'Beginner survival questions, tips & common game questions',
          lucideIcon: <HelpCircle size={20} className="text-amber-500" />
        },
        {
          id: 'errors',
          titleRu: 'Ошибки & Решения',
          titleEn: 'Crash & Error Fixes',
          descRu: 'EAC ошибки, вылеты клиента, черный экран и оптимизация',
          descEn: 'EasyAntiCheat fixes, crash solutions, disconnect remedies',
          lucideIcon: <Settings size={20} className="text-rose-500" />
        },
        {
          id: 'binds',
          titleRu: 'Бинды & Консоль F1',
          titleEn: 'Binds & F1 Console',
          descRu: 'Авто-бег, прыжок-присед, зум, быстрый крафт и боевые бинды',
          descEn: 'Auto-run, crouch-jump, combat FOV toggles & craft binds',
          iconId: 'keycard_red'
        },
        {
          id: 'fps',
          titleRu: 'Оптимизация FPS',
          titleEn: 'FPS Boost & Engine',
          descRu: 'Параметры запуска Steam, GC буфер, настройки графики Rust',
          descEn: 'Steam launch options, GC buffer, texture config for maximum FPS',
          iconId: 'computerstation'
        },
        {
          id: 'weapons',
          titleRu: 'Оружие & Спреи',
          titleEn: 'Weapons & Recoil',
          descRu: 'Таблицы урона, отдача АК/МП5, глушители и насадки на ствол',
          descEn: 'Damage dropoff, AK/MP5 recoil control & attachment stats',
          iconId: 'rifle.ak'
        },
        {
          id: 'monuments',
          titleRu: 'Карта Монументов',
          titleEn: 'Monuments & Puzzles',
          descRu: 'Схемы карточек (зеленая/синяя/красная), предохранители и лут',
          descEn: 'Green/Blue/Red keycard puzzle guides, fuses and elite crates',
          iconId: 'fuse'
        },
        {
          id: 'wipe',
          titleRu: 'Вайпы & Ивенты',
          titleEn: 'Wipe & Event Timers',
          descRu: 'Расписание глобальных вайпов Facepunch, вертолета и карго',
          descEn: 'Official monthly Facepunch wipe dates, Patrol Heli & Cargo ship',
          lucideIcon: <Clock size={20} className="text-purple-500" />
        }
      ]
    },
    {
      id: 'community',
      titleRu: 'СООБЩЕСТВО И СЕРВЕРЫ',
      titleEn: 'COMMUNITY & SERVERS',
      badgeRu: '4 раздела',
      badgeEn: '4 sections',
      items: [
        {
          id: 'home',
          titleRu: 'Главная Страница',
          titleEn: 'Home Overview',
          descRu: 'Обзор платформы, быстрый доступ к инструментам и мониторинг',
          descEn: 'Platform overview, quick launcher and live status widgets',
          lucideIcon: <Home size={20} className="text-red-600" />
        },
        {
          id: 'news',
          titleRu: 'Новости & Обновления',
          titleEn: 'News & Devblogs',
          descRu: 'Свежие девблоги Facepunch, патчноуты и анонсы турниров',
          descEn: 'Official Facepunch devblogs, patch notes and updates',
          lucideIcon: <Compass size={20} className="text-sky-500" />
        },
        {
          id: 'clan',
          titleRu: 'Поиск Клана & Тиммейтов',
          titleEn: 'Find Clan & Teammates',
          descRu: 'Доска объявлений для набора в кланы, поиска дуо или трио',
          descEn: 'Player recruitment board, clan rosters & teammate finder',
          lucideIcon: <UserPlus size={20} className="text-blue-500" />
        },
        {
          id: 'chat',
          titleRu: 'Чат Сообщества',
          titleEn: 'Community Chat',
          descRu: 'Живой онлайн-чат игроков, обмен тактиками и общение',
          descEn: 'Live chat room for Rust survivors and wipe coordination',
          lucideIcon: <MessageSquare size={20} className="text-emerald-500" />
        }
      ]
    },
    ...(Boolean(currentUser && (isVip || isOwner || isAdmin)) ? [{
      id: 'special' as const,
      titleRu: 'ОСОБЫЙ ДОСТУП',
      titleEn: 'SPECIAL ACCESS',
      badgeRu: 'Закрытые разделы',
      badgeEn: 'Restricted',
      items: [
        ...(currentUser && isVip ? [{
          id: 'radar' as const,
          titleRu: 'Player Radar (VIP)',
          titleEn: 'Player Radar (VIP)',
          descRu: 'Радарная карта игроков, позиционирование и отслеживание рейдов',
          descEn: 'Tactical player locator, grid distance & raid positioning',
          iconId: 'rf_pager',
          badge: 'VIP',
          badgeColor: 'bg-rose-500/10 text-rose-600 border-rose-500/20',
          isSpecial: true,
          requiredRole: 'vip' as const
        }] : []),
        ...(currentUser && isOwner ? [{
          id: 'rustplus' as const,
          titleRu: 'Rust+ Bot Hub (OWNER)',
          titleEn: 'Rust+ Bot Hub (OWNER)',
          descRu: 'Центр управления Rust+ Companion ботами и серверными вебхуками',
          descEn: 'Rust+ companion bot integration & smart switch webhook control',
          iconId: 'smart.alarm',
          badge: 'OWNER',
          badgeColor: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
          isSpecial: true,
          requiredRole: 'owner' as const
        }] : []),
        ...(currentUser && isAdmin ? [
          {
            id: 'icons' as const,
            titleRu: 'Иконки Rust (ADMIN)',
            titleEn: 'Rust Icons Library (ADMIN)',
            descRu: 'Каталог всех спрайтов предметов Rust, поиск ID и кэш изображений',
            descEn: 'Complete Rust item sprite catalog, CDN URLs & asset inspector',
            iconId: 'spraycan',
            badge: 'ADMIN',
            badgeColor: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
            isSpecial: true,
            requiredRole: 'admin' as const
          },
          {
            id: 'admin' as const,
            titleRu: 'Панель Админа (ADMIN)',
            titleEn: 'Admin Panel (ADMIN)',
            descRu: 'Управление пользователями, бан-лист, системные анонсы и логи',
            descEn: 'User roles, VIP grants, system announcements & server analytics',
            iconId: 'lock.code',
            badge: 'ADMIN',
            badgeColor: 'bg-red-500/10 text-red-600 border-red-500/20',
            isSpecial: true,
            requiredRole: 'admin' as const
          }
        ] : [])
      ]
    }] : [])
  ], [currentUser, isVip, isOwner, isAdmin]);

  // Filter items based on search query and category
  const filteredCategories = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    
    return categories
      .map(category => {
        if (selectedCategory !== 'all' && category.id !== selectedCategory) {
          return null;
        }

        const matchingItems = category.items.filter(item => {
          if (!query) return true;
          const title = (lang === 'ru' ? item.titleRu : item.titleEn).toLowerCase();
          const desc = (lang === 'ru' ? item.descRu : item.descEn).toLowerCase();
          const id = item.id.toLowerCase();
          return title.includes(query) || desc.includes(query) || id.includes(query);
        });

        if (matchingItems.length === 0) return null;

        return {
          ...category,
          items: matchingItems
        };
      })
      .filter((cat): cat is SectionCategory => cat !== null);
  }, [categories, searchQuery, selectedCategory, lang]);

  const totalMatchingItems = useMemo(() => {
    return filteredCategories.reduce((sum, cat) => sum + cat.items.length, 0);
  }, [filteredCategories]);

  const handleItemClick = (item: SectionItem) => {
    // Check permissions
    if (item.requiredRole === 'vip' && !isVip) {
      if (onOpenVip) onOpenVip();
      onClose();
      return;
    }
    if (item.requiredRole === 'owner' && !isOwner) {
      return;
    }
    if (item.requiredRole === 'admin' && !isAdmin) {
      return;
    }

    onSelectTab(item.id);
    onClose();
  };

  const isLight = appTheme === 'light';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            aria-hidden="true"
          />

          {/* Drawer Panel: slides from the left */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className={`relative w-full max-w-xl sm:max-w-2xl h-full shadow-2xl flex flex-col z-10 overflow-hidden ${
              isLight ? 'bg-[#f4f3f0] text-neutral-900 border-r border-neutral-300' : 'bg-[#0b0e14] text-[#eef2f7] border-r border-[#1e2633]'
            }`}
          >
            {/* Drawer Header */}
            <div className={`p-4 sm:p-5 border-b shrink-0 flex items-center justify-between ${
              isLight ? 'bg-white border-neutral-200 shadow-xs' : 'bg-[#10141d] border-[#1e2633]'
            }`}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-red-600 flex items-center justify-center text-white font-black font-mono shadow-sm">
                  RL
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base sm:text-lg font-black font-teko tracking-wide uppercase leading-tight">
                      {lang === 'ru' ? 'КАТАЛОГ ВСЕХ РАЗДЕЛОВ' : 'ALL SECTIONS DIRECTORY'}
                    </h2>
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-red-500/10 text-red-600 border border-red-500/20">
                      {categories.reduce((sum, c) => sum + c.items.length, 0)} {lang === 'ru' ? 'РАЗДЕЛОВ' : 'TABS'}
                    </span>
                  </div>
                  <p className={`text-xs ${isLight ? 'text-neutral-500' : 'text-[#8b95a8]'}`}>
                    {lang === 'ru' 
                      ? 'Полный перечень калькуляторов, баз знаний, гайдов и сервисов' 
                      : 'Complete roster of raid calculators, knowledge hubs & VIP tools'}
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className={`p-2 rounded-lg transition-colors cursor-pointer ${
                  isLight ? 'hover:bg-neutral-100 text-neutral-600' : 'hover:bg-white/10 text-[#8b95a8] hover:text-white'
                }`}
                title={lang === 'ru' ? 'Закрыть (Esc)' : 'Close (Esc)'}
              >
                <X size={20} />
              </button>
            </div>

            {/* Search and Category Filter Toolbar */}
            <div className={`p-4 border-b shrink-0 space-y-3 ${
              isLight ? 'bg-white/80 border-neutral-200' : 'bg-[#0e121a] border-[#1e2633]'
            }`}>
              {/* Search input */}
              <div className="relative">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={lang === 'ru' ? 'Быстрый поиск раздела (например: рейд, гниение, бинды, fps)...' : 'Quick search section (e.g. raid, decay, binds, fps)...'}
                  className={`w-full pl-10 pr-9 py-2.5 text-xs sm:text-sm rounded-lg border outline-none font-medium transition-all ${
                    isLight 
                      ? 'bg-neutral-50 border-neutral-200 text-neutral-900 focus:bg-white focus:border-red-500 focus:ring-2 focus:ring-red-500/10' 
                      : 'bg-[#141923] border-[#222b3b] text-[#eef2f7] focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                  }`}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 p-1"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 custom-scrollbar text-xs">
                {[
                  { id: 'all', labelRu: 'Все разделы', labelEn: 'All' },
                  { id: 'tools', labelRu: 'Калькуляторы (9)', labelEn: 'Tools (9)' },
                  { id: 'knowledge', labelRu: 'База знаний (8)', labelEn: 'Knowledge (8)' },
                  { id: 'community', labelRu: 'Сообщество (4)', labelEn: 'Community (4)' },
                  ...(Boolean(currentUser && (isVip || isOwner || isAdmin)) ? [
                    { id: 'special', labelRu: 'Особый доступ', labelEn: 'Special Access' }
                  ] : [])
                ].map((tab) => {
                  const isCurrent = selectedCategory === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setSelectedCategory(tab.id)}
                      className={`px-3 py-1.5 rounded-md font-bold whitespace-nowrap transition-all cursor-pointer text-xs ${
                        isCurrent
                          ? 'bg-red-600 text-white shadow-xs'
                          : isLight
                            ? 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
                            : 'bg-[#161c28] hover:bg-[#1e2637] text-[#8b95a8] hover:text-[#eef2f7]'
                      }`}
                    >
                      {lang === 'ru' ? tab.labelRu : tab.labelEn}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6 custom-scrollbar">
              {totalMatchingItems === 0 ? (
                <div className={`text-center py-12 px-4 rounded-xl border border-dashed ${
                  isLight ? 'bg-white border-neutral-300' : 'bg-[#121620] border-[#1e2633]'
                }`}>
                  <Search size={36} className="mx-auto text-neutral-400 mb-2 opacity-60" />
                  <div className="text-sm font-bold">
                    {lang === 'ru' ? 'Разделы не найдены' : 'No sections matched'}
                  </div>
                  <p className={`text-xs mt-1 ${isLight ? 'text-neutral-500' : 'text-[#8b95a8]'}`}>
                    {lang === 'ru' 
                      ? `По запросу «${searchQuery}» ничего не найдено. Попробуйте другой запрос.` 
                      : `Nothing found for "${searchQuery}". Try different keywords.`}
                  </p>
                  <button
                    onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                    className="mt-3 px-3 py-1.5 bg-red-600 text-white text-xs font-bold rounded-md cursor-pointer hover:bg-red-700"
                  >
                    {lang === 'ru' ? 'Сбросить фильтр' : 'Reset filter'}
                  </button>
                </div>
              ) : (
                filteredCategories.map((category) => (
                  <div key={category.id} className="space-y-2.5">
                    {/* Category Title */}
                    <div className="flex items-center justify-between px-1">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-3.5 bg-red-600 rounded-full" />
                        <h3 className={`text-xs font-black tracking-wider uppercase font-mono ${
                          isLight ? 'text-neutral-700' : 'text-neutral-300'
                        }`}>
                          {lang === 'ru' ? category.titleRu : category.titleEn}
                        </h3>
                      </div>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                        isLight ? 'bg-neutral-200/80 text-neutral-600' : 'bg-white/5 text-[#8b95a8]'
                      }`}>
                        {lang === 'ru' ? category.badgeRu : category.badgeEn}
                      </span>
                    </div>

                    {/* Category Grid Items */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
                      {category.items.map((item) => {
                        const isActive = activeTab === item.id;
                        const isLocked = (item.requiredRole === 'vip' && !isVip)
                          || (item.requiredRole === 'owner' && !isOwner)
                          || (item.requiredRole === 'admin' && !isAdmin);

                        return (
                          <div
                            key={item.id}
                            onClick={() => handleItemClick(item)}
                            className={`group relative flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer text-left ${
                              isActive
                                ? isLight
                                  ? 'bg-red-500/5 border-red-500 shadow-sm ring-1 ring-red-500/20'
                                  : 'bg-red-500/10 border-red-500/60 shadow-sm'
                                : isLight
                                  ? 'bg-white hover:bg-neutral-50/90 border-neutral-200/80 hover:border-neutral-300 shadow-xs hover:shadow-md hover:-translate-y-0.5'
                                  : 'bg-[#121620] hover:bg-[#161c28] border-[#1e2633] hover:border-[#2e3b4f] hover:-translate-y-0.5'
                            } ${isLocked ? 'opacity-75 hover:opacity-100' : ''}`}
                          >
                            {/* Icon container */}
                            <div className={`w-10 h-10 rounded-lg shrink-0 flex items-center justify-center p-1 border transition-transform group-hover:scale-105 ${
                              isActive
                                ? 'bg-red-500/10 border-red-500/30'
                                : isLight
                                  ? 'bg-neutral-100 border-neutral-200'
                                  : 'bg-black/40 border-white/5'
                            }`}>
                              {item.iconId ? (
                                <ItemImageOrFallback id={item.iconId} lang={lang} size={28} />
                              ) : (
                                item.lucideIcon || <LayoutGrid size={20} className="text-neutral-500" />
                              )}
                            </div>

                            {/* Details */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className={`text-xs font-bold truncate leading-tight ${
                                  isActive
                                    ? 'text-red-600'
                                    : isLight
                                      ? 'text-neutral-900 group-hover:text-red-600'
                                      : 'text-[#eef2f7] group-hover:text-red-400'
                                }`}>
                                  {lang === 'ru' ? item.titleRu : item.titleEn}
                                </span>

                                {item.badge && (
                                  <span className={`text-[9px] font-black px-1.5 py-0.2 rounded font-mono shrink-0 border ${item.badgeColor || 'bg-neutral-200 text-neutral-700'}`}>
                                    {item.badge}
                                  </span>
                                )}

                                {isLocked && (
                                  <span className="text-[10px] text-amber-500 shrink-0 ml-auto flex items-center gap-0.5 font-bold font-mono">
                                    <Lock size={11} />
                                    <span>LOCKED</span>
                                  </span>
                                )}
                              </div>

                              <p className={`text-[11px] line-clamp-2 mt-0.5 leading-snug ${
                                isLight ? 'text-neutral-500' : 'text-[#8b95a8]'
                              }`}>
                                {lang === 'ru' ? item.descRu : item.descEn}
                              </p>
                            </div>

                            {/* Chevron */}
                            <ChevronRight 
                              size={14} 
                              className={`shrink-0 self-center text-neutral-400 group-hover:translate-x-0.5 transition-transform ${
                                isActive ? 'text-red-600' : ''
                              }`} 
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer summary bar */}
            <div className={`p-3 sm:p-4 border-t shrink-0 flex items-center justify-between text-xs font-mono ${
              isLight ? 'bg-white border-neutral-200 text-neutral-600' : 'bg-[#0d1017] border-[#1e2633] text-[#8b95a8]'
            }`}>
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>RUSTY.LUB v2.6 • {lang === 'ru' ? '24 активных модуля' : '24 active tools'}</span>
              </div>

              <div className="flex items-center gap-3">
                <span className="hidden sm:inline text-[11px] opacity-70">
                  {lang === 'ru' ? 'Нажмите Esc для закрытия' : 'Press Esc to close'}
                </span>
                <button
                  onClick={onClose}
                  className={`px-3 py-1 rounded font-bold cursor-pointer transition-colors ${
                    isLight ? 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800' : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                >
                  {lang === 'ru' ? 'Закрыть' : 'Close'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
