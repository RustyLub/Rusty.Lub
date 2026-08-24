import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, X, Flame, Keyboard, BookOpen, Target, 
  MapPin, FlaskConical, Pickaxe, Zap, ArrowRight, CornerDownLeft, Sparkles, HelpCircle
} from 'lucide-react';
import { raidTargets, bindsDatabase, errorDatabase, weaponStatsDatabase } from '../data';

interface SearchItem {
  id: string;
  tab: string;
  category: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  tags?: string[];
  actionPayload?: any;
}

interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: string, extra?: any) => void;
  lang: 'ru' | 'en';
}

export const CommandPaletteModal: React.FC<CommandPaletteModalProps> = ({
  isOpen,
  onClose,
  onSelectTab,
  lang
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Build searchable database
  const searchPool: SearchItem[] = [
    // Raid Targets
    ...raidTargets.map(t => ({
      id: `raid-${t.id}`,
      tab: 'raid',
      category: lang === 'ru' ? 'Калькулятор Рейда' : 'Raid Calculator',
      title: t.name,
      subtitle: `${lang === 'ru' ? 'Прочность:' : 'Health:'} ${t.hp} HP | C4: ${t.c4} | Rockets: ${t.rocket}`,
      icon: <Flame size={16} className="text-[#ff2a4d]" />,
      tags: ['рейд', 'raid', 'взрывчатка', 'c4', 'ракета', 'дверь', 'стена', t.name.toLowerCase()]
    })),
    // Binds
    ...bindsDatabase.map((b, i) => ({
      id: `bind-${i}`,
      tab: 'binds',
      category: lang === 'ru' ? 'Макро-Бинды' : 'Keybinds',
      title: b.desc,
      subtitle: b.cmd,
      icon: <Keyboard size={16} className="text-blue-400" />,
      tags: ['бинд', 'bind', 'макрос', 'консоль', 'f1', b.cmd.toLowerCase(), b.desc.toLowerCase()]
    })),
    // Errors
    ...errorDatabase.map((e, i) => ({
      id: `error-${i}`,
      tab: 'errors',
      category: lang === 'ru' ? 'База Ошибок' : 'Error Fixes',
      title: e.title,
      subtitle: e.desc.length > 80 ? e.desc.slice(0, 80) + '...' : e.desc,
      icon: <BookOpen size={16} className="text-amber-400" />,
      tags: ['ошибка', 'краш', 'crash', 'eac', 'вылет', 'unity', 'память', e.title.toLowerCase()]
    })),
    // Weapons
    ...weaponStatsDatabase.map(w => ({
      id: `weapon-${w.id}`,
      tab: 'weapons',
      category: lang === 'ru' ? 'Оружие & Отдача' : 'Weapons & Recoil',
      title: w.name,
      subtitle: `${lang === 'ru' ? 'Урон' : 'Damage'}: ${w.damage} | Mag: ${w.magSize} | Range: ${w.range}`,
      icon: <Target size={16} className="text-purple-400" />,
      tags: ['оружие', 'gun', 'ak47', 'recoil', 'спрей', 'отдача', w.name.toLowerCase()]
    })),
    // Extra tools
    {
      id: 'tool-faq',
      tab: 'faq',
      category: lang === 'ru' ? 'База Знаний' : 'Knowledge Base',
      title: lang === 'ru' ? 'Часто задаваемые вопросы (FAQ)' : 'Frequently Asked Questions (FAQ)',
      subtitle: lang === 'ru' ? 'Гайды для новичков, выбор серверов, стройка 2х1, софтсайд и выживание' : 'Beginner guides, server picking, starter bases, soft-side & survival',
      icon: <HelpCircle size={16} className="text-orange-400" />,
      tags: ['faq', 'вопросы', 'ответы', 'новичок', 'гайды', 'сервера', 'софтсайд', 'выживание']
    },
    {
      id: 'tool-clan',
      tab: 'clan',
      category: lang === 'ru' ? 'Сообщество' : 'Community',
      title: lang === 'ru' ? 'Поиск Клана & Тимейта' : 'Find Clan & Teammates',
      subtitle: lang === 'ru' ? 'Анкеты игроков, поиск тиммейтов и клановые наборы' : 'Player profiles and clan recruitment',
      icon: <Sparkles size={16} className="text-emerald-400" />,
      tags: ['клан', 'тимейт', 'lfg', 'пати', 'команда', 'набор']
    },
    {
      id: 'tool-mixing',
      tab: 'mixing',
      category: lang === 'ru' ? 'Ферма & Чай' : 'Teas & Mixing',
      title: lang === 'ru' ? 'Стол Смешивания (Рецепты Чая)' : 'Mixing Table & Teas',
      subtitle: lang === 'ru' ? 'Чай на руду, дерево, здоровье, скрап и макс. HP' : 'Ore tea, scrap tea, max health tea recipes',
      icon: <FlaskConical size={16} className="text-emerald-400" />,
      tags: ['чай', 'чай на руду', 'стол смешивания', 'ягоды', 'tea', 'mixing']
    },
    {
      id: 'tool-ecoraid',
      tab: 'ecoraid',
      category: lang === 'ru' ? 'Рейды' : 'Raiding',
      title: lang === 'ru' ? 'Эко-Рейд & Soft Side (Слабые стороны)' : 'Eco-Raid & Weak Sides',
      subtitle: lang === 'ru' ? 'Копья, кирки, стрелы, сайлент-рейды и мягкие стороны стен' : 'Spears, picks, weak side walls and doors',
      icon: <Pickaxe size={16} className="text-orange-400" />,
      tags: ['эко рейд', 'мягкая сторона', 'soft side', 'копья', 'кирки', 'деревянная дверь']
    },
    {
      id: 'tool-electrical',
      tab: 'electrical',
      category: lang === 'ru' ? 'Автоматика' : 'Automation',
      title: lang === 'ru' ? 'Симулятор Электрики & Турели' : 'Electrical Simulator',
      subtitle: lang === 'ru' ? 'Схемы подключения батарей, солнечных панелей и турелей' : 'Battery circuits, solar panels and auto-turrets',
      icon: <Zap size={16} className="text-yellow-400" />,
      tags: ['электрика', 'турель', 'аккумулятор', 'генератор', 'таймер', 'электричество']
    },
    {
      id: 'tool-monuments',
      tab: 'monuments',
      category: lang === 'ru' ? 'Карта' : 'Map',
      title: lang === 'ru' ? 'Монументы, Карточки & Головоломки' : 'Monuments & Keycards',
      subtitle: lang === 'ru' ? 'Нефтяные вышки, Космодром, Военные туннели и зеленые/синие/красные карты' : 'Oil rigs, Launch Site, Military Tunnels and puzzle cards',
      icon: <MapPin size={16} className="text-cyan-400" />,
      tags: ['монумент', 'нефтянка', 'космодром', 'карточка', 'зеленая карта', 'красная карта']
    }
  ];

  const filtered = query.trim() === ''
    ? searchPool.slice(0, 8)
    : searchPool.filter(item => {
        const q = query.toLowerCase();
        return (
          item.title.toLowerCase().includes(q) ||
          item.subtitle.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          (item.tags && item.tags.some(t => t.toLowerCase().includes(q)))
        );
      }).slice(0, 15);

  // Keyboard navigation inside palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % (filtered.length || 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filtered.length) % (filtered.length || 1));
      } else if (e.key === 'Enter' && filtered[selectedIndex]) {
        e.preventDefault();
        const item = filtered[selectedIndex];
        onSelectTab(item.tab, item.actionPayload);
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, filtered, onClose, onSelectTab]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.15 }}
            className="w-full max-w-2xl bg-[#11141b] border-2 border-[#ff2a4d]/50 shadow-[0_0_35px_rgba(255,42,77,0.25)] overflow-hidden relative"
          >
            {/* Top Hazard Accent */}
            <div className="h-1 rust-hazard w-full" />

            {/* Search Input Bar */}
            <div className="p-4 border-b border-[#2a2f3b] flex items-center gap-3 bg-[#0a0c10]">
              <Search size={20} className="text-[#ff2a4d] shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={e => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                placeholder={lang === 'ru' ? 'Быстрый поиск: рейд двери, автоатака, чай на руду, ошибка Unity, AK...' : 'Quick search: raid door, autoattack, ore tea, EAC fix, AK recoil...'}
                className="w-full bg-transparent text-white font-mono text-sm placeholder-zinc-500 focus:outline-none"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="text-zinc-500 hover:text-white p-1 cursor-pointer"
                >
                  <X size={16} />
                </button>
              )}
              <div className="hidden sm:flex items-center gap-1 text-[10px] font-mono text-zinc-500 bg-white/5 px-2 py-0.5 border border-white/10 shrink-0">
                <span>ESC</span>
              </div>
            </div>

            {/* Quick Filter Categories */}
            <div className="px-4 py-2 bg-[#0e1117] border-b border-[#2a2f3b]/60 flex items-center gap-2 overflow-x-auto text-[10px] font-mono text-zinc-400">
              <span className="text-zinc-600 font-bold uppercase tracking-wider">{lang === 'ru' ? 'Разделы:' : 'Categories:'}</span>
              <button onClick={() => setQuery('рейд')} className="hover:text-[#ff2a4d] hover:underline cursor-pointer">#Рейд</button>
              <button onClick={() => setQuery('бинд')} className="hover:text-blue-400 hover:underline cursor-pointer">#Бинды</button>
              <button onClick={() => setQuery('ошибка')} className="hover:text-amber-400 hover:underline cursor-pointer">#Ошибки</button>
              <button onClick={() => setQuery('чай')} className="hover:text-emerald-400 hover:underline cursor-pointer">#Чай</button>
              <button onClick={() => setQuery('отдача')} className="hover:text-purple-400 hover:underline cursor-pointer">#Оружие</button>
              <button onClick={() => setQuery('монумент')} className="hover:text-cyan-400 hover:underline cursor-pointer">#Монументы</button>
            </div>

            {/* Results List */}
            <div className="max-h-[380px] overflow-y-auto p-2 divide-y divide-[#2a2f3b]/30">
              {filtered.length === 0 ? (
                <div className="p-8 text-center text-zinc-500 font-mono text-xs">
                  {lang === 'ru' ? 'Ничего не найдено по запросу' : 'No results found for'} "{query}"
                </div>
              ) : (
                filtered.map((item, idx) => {
                  const isSelected = idx === selectedIndex;
                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        onSelectTab(item.tab, item.actionPayload);
                        onClose();
                      }}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`p-3 flex items-center justify-between cursor-pointer transition-colors font-mono ${
                        isSelected
                          ? 'bg-[#ff2a4d]/15 text-white border-l-4 border-[#ff2a4d]'
                          : 'hover:bg-white/5 text-zinc-300'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="p-2 bg-black/40 border border-[#2a2f3b] shrink-0">
                          {item.icon}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold truncate text-white">{item.title}</span>
                            <span className="text-[9px] px-1.5 py-0.2 bg-white/5 border border-white/10 text-zinc-400 shrink-0 uppercase">
                              {item.category}
                            </span>
                          </div>
                          <p className="text-[11px] text-zinc-400 truncate mt-0.5 font-sans">
                            {item.subtitle}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0 ml-3 text-[10px] text-zinc-500">
                        {isSelected && (
                          <span className="flex items-center gap-1 text-[#ff2a4d] font-bold">
                            <span>{lang === 'ru' ? 'Перейти' : 'Select'}</span>
                            <CornerDownLeft size={12} />
                          </span>
                        )}
                        <ArrowRight size={14} className={isSelected ? 'text-[#ff2a4d]' : 'text-zinc-600'} />
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="p-2.5 bg-[#0a0c10] border-t border-[#2a2f3b] flex items-center justify-between text-[10px] font-mono text-zinc-500">
              <div className="flex items-center gap-3">
                <span>↑↓ {lang === 'ru' ? 'Выбор' : 'Navigate'}</span>
                <span>↵ {lang === 'ru' ? 'Открыть' : 'Open'}</span>
                <span>ESC {lang === 'ru' ? 'Закрыть' : 'Close'}</span>
              </div>
              <div className="text-[#ff2a4d] font-bold">RUSTY.LUB GLOBAL FINDER</div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
