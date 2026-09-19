import { useState, useEffect } from 'react';
import { bindsDatabase, adminCommandsDatabase } from '../data';
import { BindItem, AdminCommandItem } from '../types';
import { db, collection, addDoc } from '../firebase';
import { Search, Copy, Terminal, Shield, Plus, Zap, Heart, RotateCw, Info, Wrench, Settings, Download, FileCode, Sparkles, Bookmark, Check, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { bindsTranslationMap, bindsCategoryMap } from '../translations';

interface BindsTabProps {
  onCopy: (text: string) => void;
  lang: 'ru' | 'en';
  onOpenConfigExporter?: () => void;
  user?: any;
  onRequireAuth?: () => void;
  onToast?: (msg: string, type: 'success' | 'warning' | 'error') => void;
}

export default function BindsTab({ onCopy, lang, onOpenConfigExporter, user, onRequireAuth, onToast }: BindsTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [bindsMode, setBindsMode] = useState<'player' | 'admin'>('player');
  const [savedBindKeys, setSavedBindKeys] = useState<string[]>([]);
  const [showCreateBindModal, setShowCreateBindModal] = useState(false);
  const [newBindKey, setNewBindKey] = useState('');
  const [newBindCommand, setNewBindCommand] = useState('');
  const [newBindDesc, setNewBindDesc] = useState('');
  const [isSavingCustomBind, setIsSavingCustomBind] = useState(false);

  useEffect(() => {
    if (user?.uid) {
      try {
        const localKey = `saved_binds_${user.uid}`;
        const raw = localStorage.getItem(localKey);
        if (raw) {
          const list = JSON.parse(raw);
          setSavedBindKeys(list.map((b: any) => b.command || b.cmd));
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, [user]);

  const handleSaveBindToProfile = async (bind: BindItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      if (onRequireAuth) onRequireAuth();
      return;
    }

    try {
      const payload = {
        userId: user.uid,
        name: bindsTranslationMap[bind.cmd]?.[lang]?.desc || bind.desc,
        command: bind.cmd,
        key: bind.key || 'Custom',
        category: bind.category,
        createdAt: new Date().toISOString()
      };

      const localKey = `saved_binds_${user.uid}`;
      const existing = JSON.parse(localStorage.getItem(localKey) || '[]');
      if (!existing.some((b: any) => (b.command || b.cmd) === bind.cmd)) {
        const updated = [{ ...payload, id: 'local_' + Date.now() }, ...existing];
        localStorage.setItem(localKey, JSON.stringify(updated));
        setSavedBindKeys(prev => [...prev, bind.cmd]);
      }

      await addDoc(collection(db, 'saved_binds'), payload);
      if (onToast) onToast(lang === 'ru' ? 'Бинд сохранен в ваш профиль!' : 'Bind saved to your cabinet!', 'success');
    } catch (err) {
      console.error(err);
      if (onToast) onToast(lang === 'ru' ? 'Бинд сохранен локально' : 'Bind saved locally', 'success');
    }
  };

  const handleCreateCustomBind = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      if (onRequireAuth) onRequireAuth();
      return;
    }

    if (!newBindCommand.trim() || !newBindDesc.trim()) {
      if (onToast) onToast(lang === 'ru' ? 'Заполните команду и описание!' : 'Fill command and description!', 'warning');
      return;
    }

    setIsSavingCustomBind(true);
    try {
      const fullCmd = newBindKey.trim() 
        ? `bind ${newBindKey.trim().toLowerCase()} "${newBindCommand.trim()}"`
        : newBindCommand.trim();

      const payload = {
        userId: user.uid,
        name: newBindDesc.trim(),
        command: fullCmd,
        key: newBindKey.trim() || 'Custom',
        category: 'Пользовательские',
        createdAt: new Date().toISOString()
      };

      const localKey = `saved_binds_${user.uid}`;
      const existing = JSON.parse(localStorage.getItem(localKey) || '[]');
      localStorage.setItem(localKey, JSON.stringify([{ ...payload, id: 'local_' + Date.now() }, ...existing]));

      await addDoc(collection(db, 'saved_binds'), payload);
      setSavedBindKeys(prev => [...prev, fullCmd]);
      setShowCreateBindModal(false);
      setNewBindKey('');
      setNewBindCommand('');
      setNewBindDesc('');
      if (onToast) onToast(lang === 'ru' ? 'Свой бинд создан и сохранен в кабинет!' : 'Custom bind created & saved to cabinet!', 'success');
    } catch (err) {
      console.error(err);
      if (onToast) onToast(lang === 'ru' ? 'Бинд сохранен в профиль' : 'Bind saved to profile', 'success');
      setShowCreateBindModal(false);
    } finally {
      setIsSavingCustomBind(false);
    }
  };

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
      {/* Quick 1-Click Config Export Banner */}
      {onOpenConfigExporter && (
        <div className="bg-gradient-to-r from-[#cd412b]/20 via-[#181c28] to-[#14171e] border border-[#cd412b]/50 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#cd412b]/30 text-[#cd412b] border border-[#cd412b]/50">
              <FileCode size={20} />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-black uppercase text-white font-mono flex items-center gap-2">
                <span>{lang === 'en' ? 'One-Click Config Export (autoexec.cfg)' : 'Экспорт конфигурации в один клик'}</span>
                <span className="text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-1.5 py-0.2 font-mono">1-CLICK</span>
              </h3>
              <p className="text-[11px] text-gray-400 font-sans">
                {lang === 'en'
                  ? 'Generate & download ready autoexec.cfg with all essential PvP binds, FOV zoom, fast med & FPS tweaks.'
                  : 'Сгенерируйте и скачайте готовый autoexec.cfg со всеми макро-биндами, быстрым шприцом, FOV зумом и FPS бустом.'}
              </p>
            </div>
          </div>
          <button
            onClick={onOpenConfigExporter}
            className="px-4 py-2 bg-[#cd412b] hover:bg-[#b03522] text-white font-mono font-bold text-xs uppercase transition-all shadow-[0_0_15px_rgba(205,65,43,0.4)] flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <Download size={14} />
            <span>{lang === 'en' ? 'Export CFG' : 'Экспортировать CFG'}</span>
          </button>
        </div>
      )}

      {/* Mode Switcher & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1e2633] pb-2">
        <div className="flex gap-2">
          <button
            onClick={() => handleModeChange('player')}
            className={`px-4 py-2 text-xs uppercase transition-all cursor-pointer font-bold font-mono ${
              bindsMode === 'player'
                ? 'text-[#f97316] border-b-2 border-[#f97316]'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            {lang === 'en' ? 'Player Binds' : 'Обычные бинды'}
          </button>
          <button
            onClick={() => handleModeChange('admin')}
            className={`px-4 py-2 text-xs uppercase transition-all cursor-pointer font-bold font-mono ${
              bindsMode === 'admin'
                ? 'text-[#f97316] border-b-2 border-[#f97316]'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            {lang === 'en' ? 'Admin Panel' : 'Для админов'}
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (!user) {
                if (onRequireAuth) onRequireAuth();
                return;
              }
              setShowCreateBindModal(true);
            }}
            className="btn-orange text-xs py-1.5 px-3 flex items-center gap-1.5"
          >
            <Plus size={13} />
            <span>{lang === 'ru' ? 'Свой бинд' : 'New Bind'}</span>
          </button>
        </div>
      </div>

      {/* Search and Filters Header */}
      <div className="flex flex-col xl:flex-row gap-3 bg-[#12161e] p-4 border border-[#1e2633]">
        {/* Smart Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
          <input
            type="text"
            id="binds-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={lang === 'en' ? "Search..." : "Поиск..."}
            className="w-full bg-[#08090c] border border-[#1e2633] text-[#eef2f7] placeholder-zinc-600 pl-10 pr-3 py-2 text-xs outline-none font-mono focus:border-[#f97316]"
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
              className={`px-3 py-1.5 text-xs uppercase font-mono transition-all ${
                activeCategory === cat.id
                  ? 'bg-[#f97316] text-white font-bold'
                  : 'text-zinc-400 hover:text-white bg-[#0d1016] border border-[#1e2633]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Info Notice */}
      <div className="bg-[#12161e] border border-[#1e2633] text-white p-4 flex gap-3">
        <Info size={18} className="text-[#f97316] mt-0.5 flex-shrink-0" />
        <div className="text-xs space-y-1">
          <p className="font-bold text-[#f97316] uppercase font-mono">
            {bindsMode === 'player'
              ? (lang === 'en' ? 'How to install?' : 'Как установить?')
              : (lang === 'en' ? 'How to use admin commands?' : 'Как использовать админ-команды?')
            }
          </p>
          <p className="text-zinc-400">
            {bindsMode === 'player' ? (
              lang === 'en' ? 'Click on card to copy command, in Rust open console (F1), paste (Ctrl+V) and press Enter. Click bookmark icon to save to cabinet.' : 'Кликните по карточке, чтобы скопировать. В Rust откройте консоль (F1), вставьте (Ctrl+V) и нажмите Enter. Нажмите значок закладки, чтобы сохранить в кабинет.'
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
          const isSaved = savedBindKeys.includes(bind.cmd);

          return (
            <div
              key={bind.cmd}
              onClick={() => onCopy(bind.cmd)}
              className="tactical-card p-4 cursor-pointer flex flex-col justify-between group hover:border-[#f97316]/60 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] text-zinc-500 font-mono uppercase">{bindsCategoryMap[bind.category]?.[lang] || bind.category}</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={(e) => handleSaveBindToProfile(bind, e)}
                      title={isSaved ? (lang === 'ru' ? 'Сохранено в профиле' : 'Saved in profile') : (lang === 'ru' ? 'Сохранить в профиль' : 'Save to profile')}
                      className={`p-1 transition-colors ${isSaved ? 'text-[#f97316]' : 'text-zinc-500 hover:text-white'}`}
                    >
                      <Bookmark size={13} className={isSaved ? 'fill-[#f97316]' : ''} />
                    </button>
                    <Copy size={12} className="text-zinc-500 group-hover:text-white transition-colors" />
                  </div>
                </div>

                <h4 className="text-sm font-bold text-white mb-1 uppercase font-sans">{trans.desc}</h4>
                {trans.explanation && (
                  <p className="text-xs text-zinc-400 mb-3 font-sans leading-relaxed">{trans.explanation}</p>
                )}

                {adminItem.example && (
                  <div className="mb-3 bg-[#08090c] p-2 border border-[#1e2633] text-[10px] font-mono text-amber-500">
                    {lang === 'en' ? 'Example: ' : 'Пример: '}{adminItem.example}
                  </div>
                )}
              </div>

              <div className="mt-2 bg-[#08090c] border border-[#1e2633] p-2 text-xs font-mono text-[#f97316] truncate">
                {bind.cmd}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Create Custom Bind */}
      {showCreateBindModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <form onSubmit={handleCreateCustomBind} className="bg-[#12161e] border border-[#1e2633] max-w-md w-full p-5 space-y-4 shadow-2xl relative">
            <div className="hud-corner-tl" />
            <div className="hud-corner-tr" />
            <div className="hud-corner-bl" />
            <div className="hud-corner-br" />

            <h3 className="text-sm font-black text-white uppercase font-mono tracking-wider flex items-center gap-2">
              <Plus size={15} className="text-[#f97316]" />
              <span>{lang === 'ru' ? 'СОЗДАТЬ СВОЙ БИНД' : 'CREATE CUSTOM BIND'}</span>
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-mono uppercase text-zinc-400 mb-1">
                  {lang === 'ru' ? 'Клавиша (например: mouse4, z, f2)' : 'Key (e.g. mouse4, z, f2)'}
                </label>
                <input
                  type="text"
                  value={newBindKey}
                  onChange={(e) => setNewBindKey(e.target.value)}
                  placeholder="mouse4"
                  className="w-full px-3 py-2 text-xs bg-[#08090c] border border-[#1e2633] text-white focus:outline-none focus:border-[#f97316] font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-zinc-400 mb-1">
                  {lang === 'ru' ? 'Команда / Действие' : 'Command / Action'}
                </label>
                <input
                  type="text"
                  value={newBindCommand}
                  onChange={(e) => setNewBindCommand(e.target.value)}
                  placeholder="+attack;+duck"
                  required
                  className="w-full px-3 py-2 text-xs bg-[#08090c] border border-[#1e2633] text-white focus:outline-none focus:border-[#f97316] font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-zinc-400 mb-1">
                  {lang === 'ru' ? 'Описание бинда' : 'Description'}
                </label>
                <input
                  type="text"
                  value={newBindDesc}
                  onChange={(e) => setNewBindDesc(e.target.value)}
                  placeholder={lang === 'ru' ? 'Авто-атака с приседом' : 'Auto-attack crouch'}
                  required
                  className="w-full px-3 py-2 text-xs bg-[#08090c] border border-[#1e2633] text-white focus:outline-none focus:border-[#f97316] font-sans"
                />
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowCreateBindModal(false)}
                className="btn-ghost text-xs py-1.5 px-3"
              >
                {lang === 'ru' ? 'Отмена' : 'Cancel'}
              </button>
              <button
                type="submit"
                disabled={isSavingCustomBind}
                className="btn-orange text-xs py-1.5 px-4 flex items-center gap-1.5"
              >
                <Save size={13} />
                <span>{isSavingCustomBind ? (lang === 'ru' ? 'Сохранение...' : 'Saving...') : (lang === 'ru' ? 'Сохранить' : 'Save')}</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
