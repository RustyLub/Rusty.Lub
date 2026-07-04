import { useState } from 'react';
import { bindsDatabase, adminCommandsDatabase } from '../data';
import { BindItem, AdminCommandItem } from '../types';
import { Search, Copy, Terminal, Shield, Plus, Zap, Heart, RotateCw, Info, Wrench, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { bindsTranslationMap, bindsCategoryMap } from '../translations';

interface BindsTabProps {
  onCopy: (text: string) => void;
  lang: 'ru' | 'en';
}

export default function BindsTab({ onCopy, lang }: BindsTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const [bindsMode, setBindsMode] = useState<'player' | 'admin'>('player');

  const handleModeChange = (mode: 'player' | 'admin') => {
    setBindsMode(mode);
    setActiveCategory('all');
    setSearchQuery('');
  };

  const filteredBinds = (bindsMode === 'player' ? bindsDatabase : (adminCommandsDatabase as unknown as BindItem[])).filter((bind) => {
    const matchesCategory = activeCategory === 'all' || bind.category === activeCategory;
    const trans = lang === 'en' && bindsTranslationMap[bind.cmd] ? {
      ...bind,
      desc: bindsTranslationMap[bind.cmd].desc,
      explanation: bindsTranslationMap[bind.cmd].explanation
    } : bind;

    const matchesSearch =
      bind.cmd.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trans.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (trans.explanation && trans.explanation.toLowerCase().includes(searchQuery.toLowerCase())) ||
      bind.category.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'PVP':
        return <Shield size={12} className="text-rose-400" />;
      case 'МЕДИЦИНА':
        return <Heart size={12} className="text-emerald-400" />;
      case 'ФАРМ':
        return <Zap size={12} className="text-amber-400" />;
      case 'СТРОЙКА':
        return <Plus size={12} className="text-sky-400" />;
      case 'УПРАВЛЕНИЕ':
        return <RotateCw size={12} className="text-indigo-400" />;
      case 'QOL':
        return <Terminal size={12} className="text-teal-400" />;
      case 'МОДОВЫЕ':
        return <Wrench size={12} className="text-fuchsia-400" />;
      // Admin Categories
      case 'ПРАВА':
        return <Settings size={12} className="text-yellow-400" />;
      case 'МОДЕРАЦИЯ':
        return <Shield size={12} className="text-red-400" />;
      case 'РЕЖИМЫ':
        return <Zap size={12} className="text-purple-400" />;
      case 'ТЕЛЕПОРТ':
        return <RotateCw size={12} className="text-blue-400" />;
      case 'ВЫДАЧА':
        return <Plus size={12} className="text-emerald-400" />;
      case 'МИР':
        return <RotateCw size={12} className="text-cyan-400" />;
      case 'СУЩНОСТИ':
        return <Wrench size={12} className="text-orange-400" />;
      case 'ИНФО':
        return <Terminal size={12} className="text-pink-400" />;
      default:
        return <Info size={12} className="text-gray-400" />;
    }
  };

  const getCategoryClass = (category: string) => {
    switch (category) {
      case 'PVP':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      case 'МЕДИЦИНА':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'ФАРМ':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'СТРОЙКА':
        return 'bg-sky-500/10 text-sky-400 border-sky-500/20';
      case 'УПРАВЛЕНИЕ':
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
      case 'QOL':
        return 'bg-teal-500/10 text-teal-400 border-teal-500/20';
      case 'МОДОВЫЕ':
        return 'bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20';
      // Admin Categories
      case 'ПРАВА':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'МОДЕРАЦИЯ':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'РЕЖИМЫ':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'ТЕЛЕПОРТ':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'ВЫДАЧА':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'МИР':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
      case 'СУЩНОСТИ':
        return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      case 'ИНФО':
        return 'bg-pink-500/10 text-pink-400 border-pink-500/20';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Mode Switcher */}
      <div className="flex bg-[#0c0d10] p-1 rounded-none border border-[#2a2f3b] max-w-xs">
        <button
          onClick={() => handleModeChange('player')}
          className={`flex-1 py-2 text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
            bindsMode === 'player'
              ? 'bg-[#cd412b] text-white font-black'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          {lang === 'en' ? 'Player Binds' : 'Обычные бинды'}
        </button>
        <button
          onClick={() => handleModeChange('admin')}
          className={`flex-1 py-2 text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
            bindsMode === 'admin'
              ? 'bg-[#cd412b] text-white font-black'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          {lang === 'en' ? 'Admin Panel' : 'Для админов'}
        </button>
      </div>

      {/* Search and Filters Header */}
      <div className="flex flex-col xl:flex-row gap-4 justify-between items-stretch xl:items-center bg-[#14171e]/90 p-5 rounded-none border border-[#2a2f3b] shadow-md relative overflow-hidden">
        <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-gray-600" />
        <div className="absolute top-0.5 right-0.5 w-1 h-1 bg-gray-600" />
        
        {/* Smart Search */}
        <div className="relative flex-1 max-w-lg">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
          <input
            type="text"
            id="binds-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              bindsMode === 'player'
                ? (lang === 'en' ? "Search binds (e.g. syringe, loot, fov)..." : "Поиск по биндам (например: шприц, лут, fov)...")
                : (lang === 'en' ? "Search commands (e.g. ban, spawn, weather)..." : "Поиск команд (например: бан, спавн, погода)...")
            }
            className="w-full bg-[#0c0d10] border border-[#2a2f3b] focus:border-[#cd412b]/70 focus:ring-1 focus:ring-[#cd412b]/30 text-[#e1e1e6] placeholder-gray-500 pl-11 pr-4 py-3 rounded-none outline-none transition-all text-sm font-sans font-medium"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-[10px] font-bold px-2 py-1 rounded-none bg-gray-800"
            >
              {lang === 'en' ? 'Reset' : 'Сброс'}
            </button>
          )}
        </div>

        {/* Categories Tab Pill */}
        <div className="flex flex-wrap gap-1 bg-[#0c0d10] p-1.5 rounded-none border border-[#2a2f3b]">
          {(bindsMode === 'player'
            ? [
                { id: 'all', label: lang === 'en' ? 'All Binds' : 'Все бинды' },
                { id: 'PVP', label: 'PVP' },
                { id: 'МЕДИЦИНА', label: lang === 'en' ? 'Medical' : 'Медицина' },
                { id: 'ФАРМ', label: lang === 'en' ? 'Farming' : 'Фарм' },
                { id: 'СТРОЙКА', label: lang === 'en' ? 'Building' : 'Стройка' },
                { id: 'УПРАВЛЕНИЕ', label: lang === 'en' ? 'Controls' : 'Управление' },
                { id: 'QOL', label: lang === 'en' ? 'QoL / Comfort' : 'QoL / Комфорт' },
                { id: 'МОДОВЫЕ', label: lang === 'en' ? 'Modded' : 'Модовые' }
              ]
            : [
                { id: 'all', label: lang === 'en' ? 'All Commands' : 'Все команды' },
                { id: 'ПРАВА', label: lang === 'en' ? 'Permissions' : '👑 Права' },
                { id: 'МОДЕРАЦИЯ', label: lang === 'en' ? 'Moderation' : '🚨 Модерация' },
                { id: 'РЕЖИМЫ', label: lang === 'en' ? 'Modes' : '🧙‍♂️ Режимы' },
                { id: 'ТЕЛЕПОРТ', label: lang === 'en' ? 'Teleport' : '💫 Телепорт' },
                { id: 'ВЫДАЧА', label: lang === 'en' ? 'Give Items' : '🎁 Выдача' },
                { id: 'МИР', label: lang === 'en' ? 'World' : '🌦️ Мир' },
                { id: 'СУЩНОСТИ', label: lang === 'en' ? 'Entities' : '⚙️ Сущности' },
                { id: 'ИНФО', label: lang === 'en' ? 'Info' : '📢 Инфо' }
              ]
          ).map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-none text-xs font-bold transition-all cursor-pointer font-mono uppercase ${
                activeCategory === cat.id
                  ? 'bg-[#cd412b] text-white font-black'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Info Notice */}
      <div className="bg-[#14171e]/90 border-l-4 border-l-[#cd412b] border-y border-r border-[#2a2f3b] text-white rounded-none p-4 flex items-start gap-3 relative overflow-hidden">
        {/* Tactical Corner Brackets */}
        <div className="rust-bracket-tr" />
        <div className="rust-bracket-br" />
        
        <Info size={18} className="text-[#cd412b] mt-0.5 flex-shrink-0" />
        <div className="text-xs space-y-1 font-sans z-10">
          <p className="font-bold text-[#cd412b] uppercase tracking-wider font-mono text-[11px]">
            {bindsMode === 'player'
              ? (lang === 'en' ? 'How to install a bind?' : 'Как установить бинд?')
              : (lang === 'en' ? 'How to use admin commands?' : 'Как использовать админ-команды?')
            }
          </p>
          <p className="text-gray-300 font-medium">
            {bindsMode === 'player' ? (
              lang === 'en' ? (
                <>Click on any card to copy the command. Launch Rust, open the developer console by pressing <strong className="font-mono text-white bg-[#0c0d10] border border-[#2a2f3b] px-1 py-0.5 rounded-none">F1</strong>, paste the copied bind via <strong className="font-mono text-white bg-[#0c0d10] border border-[#2a2f3b] px-1 py-0.5 rounded-none">Ctrl + V</strong> and press <strong className="font-mono text-white bg-[#0c0d10] border border-[#2a2f3b] px-1 py-0.5 rounded-none">Enter</strong>.</>
              ) : (
                <>Кликните по любой карточке, чтобы скопировать команду. Зайдите в игру Rust, откройте консоль разработчика на клавишу <strong className="font-mono text-white bg-[#0c0d10] border border-[#2a2f3b] px-1 py-0.5 rounded-none">F1</strong>, вставьте скопированный бинд через <strong className="font-mono text-white bg-[#0c0d10] border border-[#2a2f3b] px-1 py-0.5 rounded-none">Ctrl + V</strong> и нажмите <strong className="font-mono text-white bg-[#0c0d10] border border-[#2a2f3b] px-1 py-0.5 rounded-none">Enter</strong>.</>
              )
            ) : (
              lang === 'en' ? (
                <>Click on any command to copy it. You must have admin or moderator permissions (auth level 1 or 2) on the server. Open the console via <strong className="font-mono text-white bg-[#0c0d10] border border-[#2a2f3b] px-1 py-0.5 rounded-none">F1</strong>, paste via <strong className="font-mono text-white bg-[#0c0d10] border border-[#2a2f3b] px-1 py-0.5 rounded-none">Ctrl + V</strong>, replace brackets like <code className="text-amber-400 font-bold font-mono">&lt;ID&gt;</code> with real values, and press <strong className="font-mono text-white bg-[#0c0d10] border border-[#2a2f3b] px-1 py-0.5 rounded-none">Enter</strong>.</>
              ) : (
                <>Кликните по команде, чтобы скопировать её. У вас должны быть права администратора или модератора на сервере. Откройте консоль на <strong className="font-mono text-white bg-[#0c0d10] border border-[#2a2f3b] px-1 py-0.5 rounded-none">F1</strong>, вставьте через <strong className="font-mono text-white bg-[#0c0d10] border border-[#2a2f3b] px-1 py-0.5 rounded-none">Ctrl + V</strong>, замените параметры в скобках <code className="text-amber-400 font-bold font-mono">&lt;ID&gt;</code> на реальные значения и нажмите <strong className="font-mono text-white bg-[#0c0d10] border border-[#2a2f3b] px-1 py-0.5 rounded-none">Enter</strong>.</>
              )
            )}
          </p>
        </div>
      </div>

      {/* Binds Grid */}
      <AnimatePresence mode="popLayout">
        {filteredBinds.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBinds.map((bind) => {
              const trans = lang === 'en' && bindsTranslationMap[bind.cmd] ? {
                ...bind,
                desc: bindsTranslationMap[bind.cmd].desc,
                explanation: bindsTranslationMap[bind.cmd].explanation
              } : bind;

              // Check if it's an admin command and has an example
              const adminItem = bind as unknown as AdminCommandItem;

              return (
                <motion.div
                  key={bind.cmd}
                  layout="position"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  onClick={() => onCopy(bind.cmd)}
                  className="group relative bg-[#14171e]/90 hover:bg-[#1b1e26] border border-[#2a2f3b] hover:border-[#cd412b]/50 rounded-none p-5 cursor-pointer flex flex-col justify-between shadow-lg overflow-hidden animate-fade-in"
                >
                  {/* Tactical Corner Brackets */}
                  <div className="rust-bracket-tl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="rust-bracket-tr opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="rust-bracket-bl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="rust-bracket-br opacity-0 group-hover:opacity-100 transition-opacity" />

                  {/* Subtle hover hazard or line indicator */}
                  <div className="absolute top-0 left-0 w-full h-0.5 bg-[#cd412b] scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-none text-[9px] font-bold border uppercase font-mono ${getCategoryClass(bind.category)}`}>
                        {getCategoryIcon(bind.category)}
                        {bindsCategoryMap[bind.category]?.[lang] || bind.category}
                      </span>
                      <Copy size={12} className="text-gray-500 group-hover:text-[#cd412b] opacity-60 group-hover:opacity-100 transition-all" />
                    </div>

                    <h4 className="text-sm font-bold text-gray-200 group-hover:text-[#cd412b] font-sans tracking-tight mb-2 uppercase">
                      {trans.desc}
                    </h4>

                    {trans.explanation && (
                      <p className="text-xs text-gray-400 leading-relaxed font-sans mb-3 font-medium">
                        {trans.explanation}
                      </p>
                    )}

                    {/* Example block if exists */}
                    {adminItem.example && (
                      <div className="mt-2 mb-4 bg-[#0c0d10]/60 p-2.5 border border-[#2a2f3b] rounded-none">
                        <div className="text-[10px] font-mono font-bold text-amber-500/80 uppercase mb-1">
                          {lang === 'en' ? 'Example:' : 'Пример:'}
                        </div>
                        <div className="text-xs font-mono text-gray-300 break-all select-all">
                          {adminItem.example}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Command Block */}
                  <div className="mt-auto bg-[#0c0d10] border border-[#2a2f3b] group-hover:border-[#cd412b]/30 p-3 rounded-none text-xs font-mono text-[#cd412b] break-all select-all flex items-center justify-between">
                    <span className="truncate mr-2">{bind.cmd}</span>
                    <span className="text-[9px] text-gray-500 group-hover:text-[#cd412b]/90 uppercase font-bold font-mono flex-shrink-0 ml-2">
                      {lang === 'en' ? 'click to copy' : 'клик для копирования'}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-12 text-center bg-[#14171e]/90 border border-[#2a2f3b] rounded-sm"
          >
            <div className="text-gray-600 text-4xl mb-3">⌨️</div>
            <h3 className="text-gray-400 font-bold mb-1 font-mono uppercase tracking-wider">
              {bindsMode === 'player'
                ? (lang === 'en' ? 'Bind not found' : 'Такой бинд не найден')
                : (lang === 'en' ? 'Command not found' : 'Такая команда не найдена')
              }
            </h3>
            <p className="text-xs text-gray-600 font-mono">{lang === 'en' ? 'Try entering another keyword' : 'Попробуйте ввести другое ключевое слово'}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
