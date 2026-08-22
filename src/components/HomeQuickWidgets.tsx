import React, { useState } from 'react';
import { 
  Flame, Keyboard, Sparkles, Copy, Check, ArrowRight,
  FlaskConical, Pickaxe, Zap, MapPin, Shield,
  Clock, Skull, Crosshair, HelpCircle, BookOpen
} from 'lucide-react';
import { raidTargets } from '../data';

interface HomeQuickWidgetsProps {
  onNavigateTab: (tab: string, payload?: any) => void;
  onCopy: (text: string) => void;
  lang: 'ru' | 'en';
}

export const HomeQuickWidgets: React.FC<HomeQuickWidgetsProps> = ({
  onNavigateTab,
  onCopy,
  lang
}) => {
  // Quick Raid state
  const popularTargetIds = ['wood_door', 'sheet_metal_door', 'garage_door', 'armored_door', 'stone_wall', 'sheet_wall', 'armored_wall'];
  const [selectedTargetId, setSelectedTargetId] = useState<string>('sheet_metal_door');
  const [copiedBindIdx, setCopiedBindIdx] = useState<number | null>(null);

  const currentTarget = raidTargets.find(t => t.id === selectedTargetId) || raidTargets[0];

  // Essential binds for quick copy
  const quickBinds = [
    {
      nameRu: 'Hover Loot (Быстрый сбор)',
      nameEn: 'Hover Loot (Fast Grab)',
      command: 'bind f +hoverloot',
      descRu: 'Зажмите F и водите курсором для мгновенного сбора предметов',
      descEn: 'Hold F and move cursor to instantly vacuum items'
    },
    {
      nameRu: 'Автоатака / Авто-Фарм',
      nameEn: 'Auto-Attack / Auto-Farm',
      command: 'bind z attack;duck',
      descRu: 'Бесконечная добыча дерева/камня или долбёжка стен сидя',
      descEn: 'Infinite hit + duck for pickaxing weak sides or farming'
    },
    {
      nameRu: 'Быстрый Шприц / Медкит',
      nameEn: 'Quick Syringe / Medkit',
      command: 'bind mouse4 +slot6;+attack',
      descRu: 'Мгновенно активирует шприц в 6-м слоте по кнопке мыши',
      descEn: 'Instantly applies syringe in slot 6 via mouse button'
    },
    {
      nameRu: 'Прыжок с приседом (Duck Jump)',
      nameEn: 'Duck Jump (High Jumps)',
      command: 'bind space +jump;+duck',
      descRu: 'Позволяет запрыгивать в высокие оконные проемы и скалы',
      descEn: 'Allows jumping into high window frames and cliffs easily'
    },
    {
      nameRu: 'CombatLog в консоли (F2)',
      nameEn: 'CombatLog on F2',
      command: 'bind f2 "consoletoggle;combatlog"',
      descRu: 'Мгновенно открывает лог боя и попаданий после перестрелки',
      descEn: 'Instant damage combatlog viewer after firefights'
    },
    {
      nameRu: 'Скрыть чат / Мут токсиков',
      nameEn: 'Toggle Voice Mute',
      command: 'bind m "voice.toggle"',
      descRu: 'Быстрое включение/отключение голосового чата',
      descEn: 'Quickly mute / unmute all voice chat in game'
    }
  ];

  const handleCopyBind = (command: string, idx: number) => {
    onCopy(command);
    setCopiedBindIdx(idx);
    setTimeout(() => setCopiedBindIdx(null), 2000);
  };

  const explosiveTypes = [
    { key: 'rocket', name: lang === 'ru' ? 'Ракета' : 'Rocket', sulfur: 1400, charcoal: 1950, count: currentTarget?.rocket },
    { key: 'c4', name: lang === 'ru' ? 'С4 (Таймер)' : 'Timed C4', sulfur: 2200, charcoal: 3000, count: currentTarget?.c4 },
    { key: 'satchel', name: lang === 'ru' ? 'Сачель' : 'Satchel Charge', sulfur: 480, charcoal: 720, count: currentTarget?.satchel },
    { key: 'explosive_ammo', name: lang === 'ru' ? 'Разрывные' : 'Explosive Ammo', sulfur: 25, charcoal: 30, count: currentTarget?.explosive_ammo }
  ];

  return (
    <div className="space-y-6">
      {/* SECTION 1: Quick Action Grid (Most used tools) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          {
            tab: 'raid',
            icon: <Flame size={20} className="text-[#ff2a4d]" />,
            title: lang === 'ru' ? 'Калькулятор Рейда' : 'Raid Calculator',
            subtitle: lang === 'ru' ? 'Расчет серы & C4' : 'Sulfur & C4 costs',
            accent: 'border-[#ff2a4d]/40 hover:border-[#ff2a4d] hover:bg-[#ff2a4d]/10'
          },
          {
            tab: 'binds',
            icon: <Keyboard size={20} className="text-blue-400" />,
            title: lang === 'ru' ? 'Макро-Бинды' : 'Tactical Binds',
            subtitle: lang === 'ru' ? 'F1 команды & конфиги' : 'F1 binds & configs',
            accent: 'border-blue-500/40 hover:border-blue-400 hover:bg-blue-500/10'
          },
          {
            tab: 'errors',
            icon: <BookOpen size={20} className="text-amber-400" />,
            title: lang === 'ru' ? 'Решение Ошибок' : 'Error Fixer',
            subtitle: lang === 'ru' ? 'EAC, Краши & FPS' : 'EAC, crashes & FPS',
            accent: 'border-amber-500/40 hover:border-amber-400 hover:bg-amber-500/10'
          },
          {
            tab: 'mixing',
            icon: <FlaskConical size={20} className="text-emerald-400" />,
            title: lang === 'ru' ? 'Рецепты Чая' : 'Tea & Mixing',
            subtitle: lang === 'ru' ? 'Руда, дерево, скрап' : 'Ore, scrap, wood teas',
            accent: 'border-emerald-500/40 hover:border-emerald-400 hover:bg-emerald-500/10'
          },
          {
            tab: 'ecoraid',
            icon: <Pickaxe size={20} className="text-orange-400" />,
            title: lang === 'ru' ? 'Эко-Рейд' : 'Eco-Raiding',
            subtitle: lang === 'ru' ? 'Soft sides & копья' : 'Weak sides & picks',
            accent: 'border-orange-500/40 hover:border-orange-400 hover:bg-orange-500/10'
          },
          {
            tab: 'electrical',
            icon: <Zap size={20} className="text-yellow-400" />,
            title: lang === 'ru' ? 'Электрика' : 'Electrical',
            subtitle: lang === 'ru' ? 'Схемы & Турели' : 'Turrets & Circuits',
            accent: 'border-yellow-500/40 hover:border-yellow-400 hover:bg-yellow-500/10'
          }
        ].map(item => (
          <button
            key={item.tab}
            onClick={() => onNavigateTab(item.tab)}
            className={`p-3 bg-[#11141b]/90 border text-left flex flex-col justify-between transition-all duration-200 cursor-pointer shadow-md group relative overflow-hidden ${item.accent}`}
          >
            <div className="flex items-center justify-between w-full mb-2">
              <div className="p-1.5 bg-black/40 border border-white/10 group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <ArrowRight size={14} className="text-zinc-600 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
            </div>
            <div>
              <div className="text-xs font-black uppercase tracking-wider text-white font-sans truncate">
                {item.title}
              </div>
              <div className="text-[10px] text-zinc-400 font-mono truncate mt-0.5">
                {item.subtitle}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* SECTION 2: Quick Interactive Raid Mini-Calculator + Quick Binds Side-by-Side */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Quick Raid Cost Finder */}
        <div className="lg:col-span-7 bg-[#11141b]/95 border-2 border-[#ff2a4d]/40 p-5 shadow-xl relative overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#2a2f3b] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-[#ff2a4d]/10 border border-[#ff2a4d]/30 text-[#ff2a4d]">
                <Flame size={16} />
              </div>
              <div>
                <h3 className="text-sm font-black uppercase tracking-wider text-white font-mono">
                  {lang === 'ru' ? '⚡ БЫСТРЫЙ РАСЧЕТ РАСХОДОВ НА РЕЙД' : '⚡ INSTANT RAID COST CALCULATOR'}
                </h3>
                <p className="text-[10px] text-zinc-400 font-sans">
                  {lang === 'ru' ? 'Выберите объект для моментального расчета взрывчатки и серы' : 'Select structure to instantly calculate explosive count and sulfur'}
                </p>
              </div>
            </div>

            <button
              onClick={() => onNavigateTab('raid')}
              className="hidden sm:flex items-center gap-1 text-[10px] font-mono text-[#ff2a4d] hover:text-white uppercase font-bold border border-[#ff2a4d]/30 hover:bg-[#ff2a4d] px-2.5 py-1 transition-all cursor-pointer"
            >
              <span>{lang === 'ru' ? 'ПОЛНЫЙ КАЛЬКУЛЯТОР' : 'FULL CALCULATOR'}</span>
              <ArrowRight size={12} />
            </button>
          </div>

          {/* Target Selection Pills */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 mb-4">
            {popularTargetIds.map(targetId => {
              const target = raidTargets.find(t => t.id === targetId);
              if (!target) return null;
              const isSelected = target.id === selectedTargetId;
              return (
                <button
                  key={target.id}
                  onClick={() => setSelectedTargetId(target.id)}
                  className={`p-2 text-center border font-mono transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#ff2a4d] text-white border-[#ff2a4d] shadow-[0_0_10px_rgba(255,42,77,0.4)] font-bold'
                      : 'bg-[#151922] text-zinc-400 hover:text-white border-[#2a2f3b] hover:bg-[#1f2430]'
                  }`}
                >
                  <div className="text-[11px] font-black uppercase truncate">
                    {target.name.split(' ')[0]}
                  </div>
                  <div className="text-[9px] opacity-80 mt-0.5">
                    {target.hp} HP
                  </div>
                </button>
              );
            })}
          </div>

          {/* Selected Target Stats Display */}
          {currentTarget && (
            <div className="space-y-4">
              <div className="p-3 bg-[#0a0c10] border border-[#2a2f3b] flex items-center justify-between">
                <div>
                  <span className="text-xs font-black text-white uppercase font-mono">
                    {currentTarget.name}
                  </span>
                  <div className="text-[10px] text-zinc-400 font-sans">
                    {lang === 'ru' ? 'Категория:' : 'Category:'} <span className="text-zinc-200">{currentTarget.category}</span> • {lang === 'ru' ? 'Прочность:' : 'Health:'} <span className="text-emerald-400 font-bold">{currentTarget.hp} HP</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-zinc-500 font-mono uppercase block">{lang === 'ru' ? 'ОПТИМАЛЬНО' : 'OPTIMAL'}</span>
                  <span className="text-xs font-black text-[#ff2a4d] font-mono">
                    {currentTarget.c4} C4 / {currentTarget.rocket} ROCKETS
                  </span>
                </div>
              </div>

              {/* Methods Table */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {explosiveTypes.map(exp => {
                  if (!exp.count) return null;
                  const totalSulfur = exp.count * exp.sulfur;
                  const totalCharcoal = exp.count * exp.charcoal;

                  return (
                    <div
                      key={exp.key}
                      className="p-2.5 bg-[#151922] border border-[#2a2f3b] flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] font-bold text-white font-mono uppercase truncate">
                          {exp.name}
                        </span>
                        <span className="text-sm font-black text-amber-400 font-mono">
                          x{exp.count}
                        </span>
                      </div>

                      <div className="text-[10px] font-mono space-y-0.5 pt-1.5 border-t border-[#2a2f3b]/60">
                        <div className="flex justify-between text-zinc-400">
                          <span>{lang === 'ru' ? 'Сера:' : 'Sulfur:'}</span>
                          <span className="text-[#ff2a4d] font-bold">{totalSulfur.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-zinc-500">
                          <span>{lang === 'ru' ? 'Уголь:' : 'Charcoal:'}</span>
                          <span>{totalCharcoal.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Mobile Quick Action Link */}
              <button
                onClick={() => onNavigateTab('raid')}
                className="w-full sm:hidden py-2 bg-[#ff2a4d] text-white text-xs font-black font-mono uppercase tracking-wider flex items-center justify-center gap-1.5"
              >
                <span>{lang === 'ru' ? 'ОТКРЫТЬ ПОЛНЫЙ КАЛЬКУЛЯТОР' : 'OPEN FULL CALCULATOR'}</span>
                <ArrowRight size={14} />
              </button>
            </div>
          )}
        </div>

        {/* Right: Quick Tactical Binds Copy Hub */}
        <div className="lg:col-span-5 bg-[#11141b]/95 border-2 border-blue-500/40 p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#2a2f3b] pb-3 mb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-500/10 border border-blue-500/30 text-blue-400">
                  <Keyboard size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wider text-white font-mono">
                    {lang === 'ru' ? '🎯 ТОПОВЫЕ БИНДЫ (В 1 КЛИК)' : '🎯 1-CLICK TACTICAL BINDS'}
                  </h3>
                  <p className="text-[10px] text-zinc-400 font-sans">
                    {lang === 'ru' ? 'Нажмите для копирования и вставьте в консоль F1' : 'Click to copy and paste directly into F1 console'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => onNavigateTab('binds')}
                className="text-[10px] font-mono text-blue-400 hover:text-white uppercase font-bold border border-blue-500/30 hover:bg-blue-600 px-2 py-1 transition-all cursor-pointer"
              >
                <span>{lang === 'ru' ? 'ВСЕ' : 'ALL'}</span>
              </button>
            </div>

            <div className="space-y-2">
              {quickBinds.slice(0, 4).map((b, idx) => {
                const isCopied = copiedBindIdx === idx;
                return (
                  <div
                    key={idx}
                    onClick={() => handleCopyBind(b.command, idx)}
                    className="p-2.5 bg-[#0a0c10] hover:bg-[#151922] border border-[#2a2f3b] hover:border-blue-500/60 transition-all cursor-pointer flex items-center justify-between group"
                  >
                    <div className="min-w-0 pr-2">
                      <div className="text-xs font-bold text-white font-mono truncate group-hover:text-blue-400 transition-colors">
                        {lang === 'ru' ? b.nameRu : b.nameEn}
                      </div>
                      <div className="text-[10px] text-zinc-400 font-sans truncate">
                        {lang === 'ru' ? b.descRu : b.descEn}
                      </div>
                      <code className="text-[9px] text-blue-300 font-mono block truncate mt-0.5 opacity-80">
                        {b.command}
                      </code>
                    </div>

                    <button
                      className={`p-2 border transition-all shrink-0 ${
                        isCopied
                          ? 'bg-emerald-600 border-emerald-400 text-white'
                          : 'bg-white/5 hover:bg-blue-600 border-white/10 hover:border-blue-400 text-zinc-300 hover:text-white'
                      }`}
                    >
                      {isCopied ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-[#2a2f3b]/60 flex items-center justify-between text-[10px] font-mono text-zinc-400 mt-4">
            <span>{lang === 'ru' ? 'Откройте F1 в игре и нажмите Ctrl+V' : 'Open F1 in Rust & press Ctrl+V'}</span>
            <button
              onClick={() => onNavigateTab('binds')}
              className="text-blue-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>{lang === 'ru' ? 'Перейти в раздел биндов' : 'Go to Binds database'}</span>
              <ArrowRight size={12} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
