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
    <div className="space-y-4">
      {/* Mode Switcher */}
      <div className="flex gap-1 border-b border-[#2a2f3b] mb-4">
        <button
          onClick={() => handleModeChange('player')}
          className={`px-4 py-2 text-xs uppercase transition-all cursor-pointer ${
            bindsMode === 'player'
              ? 'text-white border-b-2 border-[#cd412b]'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          {lang === 'en' ? 'Player Binds' : 'Обычные бинды'}
        </button>
        <button
          onClick={() => handleModeChange('admin')}
          className={`px-4 py-2 text-xs uppercase transition-all cursor-pointer ${
            bindsMode === 'admin'
              ? 'text-white border-b-2 border-[#cd412b]'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          {lang === 'en' ? 'Admin Panel' : 'Для админов'}
        </button>
      </div>

      {/* Search and Filters Header */}
      <div className="flex flex-col xl:flex-row gap-3 bg-[#14171e] p-4 border border-[#2a2f3b]">
        {/* Smart Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
          <input
            type="text"
            id="binds-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={lang === 'en' ? "Search..." : "Поиск..."}
            className="w-full bg-[#0c0d10] border border-[#2a2f3b] text-[#e1e1e6] placeholder-gray-600 pl-10 pr-3 py-2 rounded text-sm outline-none transition-all"
          />
        </div>

        {/* Categories Tab Pill */}
        <div className="flex flex-wrap gap-1">
          {(bindsMode === 'player'
            ? [
                { id: 'all', label: lang === 'en' ? 'All' : 'Все' },
                { id: 'PVP', label: 'PVP' },
                { id: 'МЕДИЦИНА', label: lang === 'en' ? 'Medical' : 'Медицина' },
                { id: 'ФАРМ', label: lang === 'en' ? 'Farming' : 'Фарм' },
                { id: 'СТРОЙКА', label: lang === 'en' ? 'Building' : 'Стройка' },
                { id: 'УПРАВЛЕНИЕ', label: lang === 'en' ? 'Controls' : 'Управление' },
                { id: 'QOL', label: 'QoL' },
                { id: 'МОДОВЫЕ', label: lang === 'en' ? 'Modded' : 'Модовые' }
              ]
            : [
                { id: 'all', label: lang === 'en' ? 'All' : 'Все' },
                { id: 'ПРАВА', label: lang === 'en' ? 'Perms' : 'Права' },
                { id: 'МОДЕРАЦИЯ', label: lang === 'en' ? 'Mod' : 'Модерация' },
                { id: 'РЕЖИМЫ', label: lang === 'en' ? 'Modes' : 'Режимы' },
                { id: 'ТЕЛЕПОРТ', label: lang === 'en' ? 'TP' : 'Телепорт' },
                { id: 'ВЫДАЧА', label: lang === 'en' ? 'Give' : 'Выдача' },
                { id: 'МИР', label: lang === 'en' ? 'World' : 'Мир' },
                { id: 'СУЩНОСТИ', label: lang === 'en' ? 'Entities' : 'Сущности' },
                { id: 'ИНФО', label: lang === 'en' ? 'Info' : 'Инфо' }
              ]
          ).map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 text-xs uppercase transition-all ${
                activeCategory === cat.id
                  ? 'bg-[#cd412b] text-white'
                  : 'text-gray-400 hover:text-white bg-[#1b1e26]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Info Notice */}
      <div className="bg-[#14171e] border border-[#2a2f3b] text-white p-4 flex gap-3">
        <Info size={18} className="text-[#cd412b] mt-0.5 flex-shrink-0" />
        <div className="text-xs space-y-1">
          <p className="font-bold text-[#cd412b] uppercase">
            {bindsMode === 'player'
              ? (lang === 'en' ? 'How to install?' : 'Как установить?')
              : (lang === 'en' ? 'How to use admin commands?' : 'Как использовать админ-команды?')
            }
          </p>
          <p className="text-gray-400">
            {bindsMode === 'player' ? (
              lang === 'en' ? 'Click to copy, open console (F1) in Rust, paste (Ctrl+V) and Enter.' : 'Кликните, чтобы скопировать. В игре откройте консоль (F1), вставьте (Ctrl+V) и нажмите Enter.'
            ) : (
              lang === 'en' ? 'Click to copy. You need auth level 1/2. Paste in console (F1), replace <ID> with actual value, and Enter.' : 'Кликните, чтобы скопировать. Нужен auth level 1/2. Вставьте в консоль (F1), замените <ID> на нужное значение и нажмите Enter.'
            )}
          </p>
        </div>
      </div>

      {/* Binds Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredBinds.map((bind) => {
          const trans = lang === 'en' && bindsTranslationMap[bind.cmd] ? {
            ...bind,
            desc: bindsTranslationMap[bind.cmd].desc,
            explanation: bindsTranslationMap[bind.cmd].explanation
          } : bind;

          const adminItem = bind as unknown as AdminCommandItem;

          return (
            <div
              key={bind.cmd}
              onClick={() => onCopy(bind.cmd)}
              className="bg-[#14171e] border-2 border-[#cd412b]/50 shadow-[0_0_10px_rgba(205,65,43,0.4),_0_0_10px_rgba(59,130,246,0.4)] p-4 cursor-pointer flex flex-col justify-between transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] text-gray-500 uppercase">{bindsCategoryMap[bind.category]?.[lang] || bind.category}</span>
                  <Copy size={12} className="text-gray-500" />
                </div>

                <h4 className="text-sm font-bold text-white mb-1 uppercase">{trans.desc}</h4>
                {trans.explanation && (
                  <p className="text-xs text-gray-400 mb-3">{trans.explanation}</p>
                )}

                {adminItem.example && (
                  <div className="mb-3 bg-[#0c0d10] p-2 border border-[#2a2f3b] text-[10px] font-mono text-amber-500">
                    {lang === 'en' ? 'Example: ' : 'Пример: '}{adminItem.example}
                  </div>
                )}
              </div>

              <div className="mt-2 bg-[#0c0d10] border border-[#2a2f3b] p-2 text-xs font-mono text-[#cd412b] truncate">
                {bind.cmd}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
