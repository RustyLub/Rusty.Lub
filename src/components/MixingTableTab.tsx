import React, { useState } from 'react';
import { FlaskConical, Sparkles, Sprout, ShieldCheck, Flame, RefreshCw, Info, Check, Copy } from 'lucide-react';
import { logUserActivity } from '../services/activityLogger';

interface MixingTableTabProps {
  lang: 'ru' | 'en';
  onToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}

type BerryColor = 'yellow' | 'red' | 'blue' | 'white' | 'green';

interface TeaRecipe {
  id: string;
  name: { ru: string; en: string };
  desc: { ru: string; en: string };
  effect: { ru: string; en: string };
  berries: { type: BerryColor; count: number }[];
  slotOrder: BerryColor[];
  scrapCost: number;
  pureYield: string;
  advancedYield: string;
  basicYield: string;
  duration: { basic: string; advanced: string; pure: string };
  iconBg: string;
}

const TEA_RECIPES: TeaRecipe[] = [
  {
    id: 'scrap_tea',
    name: { ru: 'Чай на скрап', en: 'Scrap Tea' },
    desc: { ru: 'Повышает количество скрапа из бочек.', en: 'Increases scrap gained from barrels.' },
    effect: { ru: '+100% скрапа (Basic)', en: '+100% scrap (Basic)' },
    berries: [{ type: 'yellow', count: 2 }, { type: 'white', count: 2 }],
    slotOrder: ['yellow', 'white', 'yellow', 'white'],
    scrapCost: 0,
    pureYield: 'Pure: эффект ослаблен обновлением 5 ноября 2026; точное новое значение не опубликовано.',
    advancedYield: 'Advanced: эффект ослаблен обновлением 5 ноября 2026; точное новое значение не опубликовано.',
    basicYield: 'Basic: +100% скрапа из бочек.',
    duration: { basic: '30 мин', advanced: '45 мин', pure: '60 мин' },
    iconBg: 'from-amber-500/20 to-yellow-500/20 text-amber-400'
  },
  {
    id: 'ore_tea',
    name: { ru: 'Чай на руду', en: 'Ore Tea' },
    desc: { ru: 'Повышает добычу руды из каменных, серных и металлических узлов.', en: 'Increases ore yield from stone, sulfur and metal nodes.' },
    effect: { ru: '+20% руды (Basic)', en: '+20% ore (Basic)' },
    berries: [{ type: 'yellow', count: 2 }, { type: 'blue', count: 2 }],
    slotOrder: ['yellow', 'blue', 'yellow', 'blue'],
    scrapCost: 0,
    pureYield: 'Pure: эффект ослаблен обновлением 5 ноября 2026; точное новое значение не опубликовано.',
    advancedYield: 'Advanced: эффект ослаблен обновлением 5 ноября 2026; точное новое значение не опубликовано.',
    basicYield: 'Basic: +20% добычи руды.',
    duration: { basic: '30 мин', advanced: '30 мин', pure: '30 мин' },
    iconBg: 'from-red-500/20 to-orange-500/20 text-red-400'
  },
  {
    id: 'wood_tea',
    name: { ru: 'Чай на дерево', en: 'Wood Tea' },
    desc: { ru: 'Повышает количество древесины при рубке деревьев.', en: 'Increases wood gained from chopping trees.' },
    effect: { ru: '+50% дерева (Basic)', en: '+50% wood (Basic)' },
    berries: [{ type: 'red', count: 2 }, { type: 'blue', count: 2 }],
    slotOrder: ['red', 'blue', 'red', 'blue'],
    scrapCost: 0,
    pureYield: 'Pure: эффект ослаблен обновлением 5 ноября 2026; точное новое значение не опубликовано.',
    advancedYield: 'Advanced: эффект ослаблен обновлением 5 ноября 2026; точное новое значение не опубликовано.',
    basicYield: 'Basic: +50% древесины.',
    duration: { basic: '30 мин', advanced: '30 мин', pure: '30 мин' },
    iconBg: 'from-emerald-500/20 to-green-500/20 text-emerald-400'
  },
  {
    id: 'max_health_tea',
    name: { ru: 'Чай на максимальное здоровье', en: 'Max Health Tea' },
    desc: { ru: 'Увеличивает максимальный запас здоровья.', en: 'Increases maximum player health.' },
    effect: { ru: '+5% максимального HP (Basic)', en: '+5% max HP (Basic)' },
    berries: [{ type: 'red', count: 3 }, { type: 'yellow', count: 1 }],
    slotOrder: ['red', 'red', 'red', 'yellow'],
    scrapCost: 0,
    pureYield: 'Pure: эффект ослаблен обновлением 5 ноября 2026; точное новое значение не опубликовано.',
    advancedYield: 'Advanced: эффект ослаблен обновлением 5 ноября 2026; точное новое значение не опубликовано.',
    basicYield: 'Basic: +5% максимального HP.',
    duration: { basic: '20 мин', advanced: '20 мин', pure: '20 мин' },
    iconBg: 'from-blue-500/20 to-cyan-500/20 text-blue-400'
  },
  {
    id: 'healing_tea',
    name: { ru: 'Лечебный чай', en: 'Healing Tea' },
    desc: { ru: 'Восстанавливает здоровье постепенно; усиленные уровни также дают мгновенное лечение.', en: 'Restores health over time; higher tiers also heal instantly.' },
    effect: { ru: '30 HP за 30 секунд (Basic)', en: '30 HP over 30 seconds (Basic)' },
    berries: [{ type: 'red', count: 4 }],
    slotOrder: ['red', 'red', 'red', 'red'],
    scrapCost: 0,
    pureYield: 'Pure: 10 HP сразу + 75 HP за 30 секунд.',
    advancedYield: 'Advanced: 5 HP сразу + 50 HP за 30 секунд.',
    basicYield: 'Basic: 30 HP за 30 секунд.',
    duration: { basic: '30 сек', advanced: '30 сек', pure: '30 сек' },
    iconBg: 'from-purple-500/20 to-pink-500/20 text-purple-400'
  },
  {
    id: 'radiation_tea',
    name: { ru: 'Чай сопротивления радиации', en: 'Anti-Rad Tea' },
    desc: { ru: 'Повышает сопротивление радиации.', en: 'Increases radiation resistance.' },
    effect: { ru: '+15% сопротивления радиации (Basic)', en: '+15% radiation resistance (Basic)' },
    berries: [{ type: 'red', count: 2 }, { type: 'green', count: 2 }],
    slotOrder: ['red', 'red', 'green', 'green'],
    scrapCost: 0,
    pureYield: 'Pure: эффект ослаблен обновлением 5 ноября 2026; точное новое значение не опубликовано.',
    advancedYield: 'Advanced: эффект ослаблен обновлением 5 ноября 2026; точное новое значение не опубликовано.',
    basicYield: 'Basic: +15% сопротивления радиации.',
    duration: { basic: '30 мин', advanced: '30 мин', pure: '30 мин' },
    iconBg: 'from-zinc-500/20 to-slate-500/20 text-zinc-300'
  },
  {
    id: 'warming_tea',
    name: { ru: 'Согревающий чай', en: 'Warming Tea' },
    desc: { ru: 'Повышает согревание в холодном биоме.', en: 'Provides warmth in cold environments.' },
    effect: { ru: 'Согревание 5 (Basic)', en: 'Warming 5 (Basic)' },
    berries: [{ type: 'white', count: 2 }, { type: 'yellow', count: 2 }],
    slotOrder: ['white', 'white', 'yellow', 'yellow'],
    scrapCost: 0,
    pureYield: 'Pure: эффект ослаблен обновлением 5 ноября 2026; точное новое значение не опубликовано.',
    advancedYield: 'Advanced: эффект ослаблен обновлением 5 ноября 2026; точное новое значение не опубликовано.',
    basicYield: 'Basic: согревание 5.',
    duration: { basic: '20 мин', advanced: '45 мин', pure: '60 мин' },
    iconBg: 'from-orange-500/20 to-amber-500/20 text-orange-400'
  },
  {
    id: 'cooling_tea',
    name: { ru: 'Охлаждающий чай', en: 'Cooling Tea' },
    desc: { ru: 'Помогает переносить жару.', en: 'Helps resist hot environments.' },
    effect: { ru: 'Охлаждение 10 (Basic)', en: 'Cooling 10 (Basic)' },
    berries: [{ type: 'white', count: 2 }, { type: 'blue', count: 2 }],
    slotOrder: ['white', 'white', 'blue', 'blue'],
    scrapCost: 0,
    pureYield: 'Pure: эффект ослаблен обновлением 5 ноября 2026; точное новое значение не опубликовано.',
    advancedYield: 'Advanced: эффект ослаблен обновлением 5 ноября 2026; точное новое значение не опубликовано.',
    basicYield: 'Basic: охлаждение 10.',
    duration: { basic: '20 мин', advanced: '45 мин', pure: '60 мин' },
    iconBg: 'from-cyan-500/20 to-blue-500/20 text-cyan-400'
  },
  {
    id: 'harvesting_tea',
    name: { ru: 'Чай собирателя', en: 'Harvesting Tea' },
    desc: { ru: 'Увеличивает количество ресурсов, получаемых с трупов животных.', en: 'Increases resources harvested from animal corpses.' },
    effect: { ru: '+35% с трупов (Basic)', en: '+35% from corpses (Basic)' },
    berries: [{ type: 'yellow', count: 1 }, { type: 'green', count: 3 }],
    slotOrder: ['yellow', 'green', 'green', 'green'],
    scrapCost: 0,
    pureYield: 'Pure: эффект ослаблен обновлением 5 ноября 2026; точное новое значение не опубликовано.',
    advancedYield: 'Advanced: эффект ослаблен обновлением 5 ноября 2026; точное новое значение не опубликовано.',
    basicYield: 'Basic: +35% добычи с трупов.',
    duration: { basic: '20 мин', advanced: '20 мин', pure: '20 мин' },
    iconBg: 'from-lime-500/20 to-green-500/20 text-lime-400'
  },
  {
    id: 'crafting_quality_tea',
    name: { ru: 'Чай качества крафта', en: 'Crafting Quality Tea' },
    desc: { ru: 'Повышает качество крафта и шанс дополнительных слотов вставок брони.', en: 'Improves crafting quality and the chance of extra armor-insert slots.' },
    effect: { ru: '+50% качества крафта (Basic)', en: '+50% crafting quality (Basic)' },
    berries: [{ type: 'green', count: 3 }, { type: 'white', count: 1 }],
    slotOrder: ['green', 'green', 'green', 'white'],
    scrapCost: 0,
    pureYield: 'Pure: +85% качества крафта.',
    advancedYield: 'Advanced: +75% качества крафта.',
    basicYield: 'Basic: +50% качества крафта.',
    duration: { basic: '3 мин 20 сек', advanced: '5 мин', pure: '6 мин 40 сек' },
    iconBg: 'from-violet-500/20 to-fuchsia-500/20 text-violet-400'
  }
];

export default function MixingTableTab({ lang, onToast }: MixingTableTabProps) {
  const [selectedTea, setSelectedTea] = useState<string>('scrap_tea');
  const [berryInput, setBerryInput] = useState<{ red: number; yellow: number; blue: number; white: number; green: number }>({
    red: 20,
    yellow: 20,
    blue: 10,
    white: 10,
    green: 10
  });

  const activeTea = TEA_RECIPES.find(t => t.id === selectedTea) || TEA_RECIPES[0];

  // One Basic tea consumes exactly four berries in the recipe's fixed slot order.
  // Four Basic teas make one Advanced; four Advanced make one Pure (64 berries total).
  const calculateMixResult = () => {
    const basicTeaCount = Math.min(
      ...activeTea.berries.map(({ type, count }) => Math.floor(Math.max(0, berryInput[type]) / count))
    );
    const advancedTeaCount = Math.floor(basicTeaCount / 4);
    const pureTeaCount = Math.floor(advancedTeaCount / 4);

    if (pureTeaCount > 0) {
      return { grade: lang === 'ru' ? 'Pure (Чистый)' : 'Pure', multiplier: `${pureTeaCount} ${lang === 'ru' ? 'шт.' : 'pcs'}`, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' };
    }
    if (advancedTeaCount > 0) {
      return { grade: lang === 'ru' ? 'Advanced (Улучшенный)' : 'Advanced', multiplier: `${advancedTeaCount} ${lang === 'ru' ? 'шт.' : 'pcs'}`, color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' };
    }
    if (basicTeaCount > 0) {
      return { grade: lang === 'ru' ? 'Basic (Базовый)' : 'Basic', multiplier: `${basicTeaCount} ${lang === 'ru' ? 'шт.' : 'pcs'}`, color: 'text-blue-400 bg-blue-500/10 border-blue-500/30' };
    }
    return { grade: lang === 'ru' ? 'Недостаточно ягод' : 'Not enough berries', multiplier: '0', color: 'text-zinc-500 bg-zinc-800/50 border-zinc-700' };
  };

  const mixResult = calculateMixResult();

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header banner */}
      <div className="bg-[#14171e] border border-[#2a2f3b] p-6 rounded-none space-y-4 rust-metal-pattern relative overflow-hidden">
        <div className="rust-bracket-tl" />
        <div className="rust-bracket-tr" />
        <div className="rust-bracket-bl" />
        <div className="rust-bracket-br" />
        <div className="absolute top-0 left-0 right-0 h-1 rust-hazard" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[9px] font-mono font-black uppercase tracking-wider">
                {lang === 'ru' ? 'АЛХИМИЯ И ФЕРМЕРСТВО' : 'ALCHEMY & FARMING'}
              </span>
              <span className="text-[10px] font-mono text-zinc-400">RUST MIXING TABLE</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-wider font-teko">
              {lang === 'ru' ? 'Стол Смешивания и Калькулятор Чаев' : 'Mixing Table & Tea Calculator'}
            </h2>
          </div>
          <p className="text-xs text-zinc-400 font-sans leading-relaxed max-w-xl">
            {lang === 'ru'
              ? 'Проверяйте точный порядок четырёх ягод, рассчитывайте Basic, Advanced и Pure и планируйте объём урожая для фермы.'
              : 'Check the exact four-slot berry order, calculate Basic, Advanced and Pure tea quantities, and plan farm output.'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Tea Selection */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#14171e] border border-[#2a2f3b] p-5 rounded-none space-y-4 rust-metal-pattern">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <FlaskConical className="text-[#cd412b]" size={16} />
              <span>{lang === 'ru' ? 'Выберите рецепт чая' : 'Select Tea Recipe'}</span>
            </h3>

            <div className="space-y-2">
              {TEA_RECIPES.map((tea) => {
                const isSelected = selectedTea === tea.id;
                return (
                  <button
                    key={tea.id}
                    onClick={() => {
                      setSelectedTea(tea.id);
                      logUserActivity({ action: 'mixing_table_select', tab: 'mixing', details: `Selected tea: ${tea.id}` });
                    }}
                    className={`w-full text-left p-3.5 transition-all cursor-pointer border rounded-none flex items-center justify-between group ${
                      isSelected
                        ? 'bg-[#cd412b]/15 border-[#cd412b] text-white shadow-md'
                        : 'bg-[#1b1e26] border-[#2a2f3b] text-zinc-300 hover:border-zinc-600 hover:bg-[#222632]'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black uppercase font-sans tracking-wide">
                          {tea.name[lang]}
                        </span>
                      </div>
                      <span className="text-[10px] text-zinc-400 font-mono block">
                        {tea.effect[lang]}
                      </span>
                    </div>
                    <span className={`text-[10px] font-mono px-2 py-1 rounded-none uppercase font-bold border ${isSelected ? 'bg-[#cd412b] text-white border-[#cd412b]' : 'bg-black/40 text-zinc-400 border-zinc-700'}`}>
                      {isSelected ? (lang === 'ru' ? 'Выбрано' : 'Active') : (lang === 'ru' ? 'Выбрать' : 'Select')}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Recipe Details & Mixing Simulation */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-[#14171e] border border-[#2a2f3b] p-6 rounded-none space-y-6 rust-metal-pattern relative">
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#cd412b]" />

            <div className="space-y-2 border-b border-[#2a2f3b] pb-4">
              <h3 className="text-xl font-bold text-white uppercase font-teko tracking-wider flex items-center gap-2">
                <Sparkles className="text-amber-400" size={18} />
                <span>{activeTea.name[lang]}</span>
              </h3>
              <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                {activeTea.desc[lang]}
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-[9px] text-zinc-500 uppercase font-mono">{lang === 'ru' ? 'Порядок слотов:' : 'Slot order:'}</span>
                {activeTea.slotOrder.map((berry, index) => {
                  const berryNames = {
                    red: { ru: 'Красная', en: 'Red' },
                    yellow: { ru: 'Жёлтая', en: 'Yellow' },
                    blue: { ru: 'Синяя', en: 'Blue' },
                    white: { ru: 'Белая', en: 'White' },
                    green: { ru: 'Зелёная', en: 'Green' }
                  };
                  const berryColors = {
                    red: 'bg-red-500/15 border-red-500/40 text-red-300',
                    yellow: 'bg-yellow-500/15 border-yellow-500/40 text-yellow-300',
                    blue: 'bg-blue-500/15 border-blue-500/40 text-blue-300',
                    white: 'bg-zinc-200/10 border-zinc-200/40 text-zinc-100',
                    green: 'bg-green-500/15 border-green-500/40 text-green-300'
                  };
                  return <span key={index} className={`px-2 py-1 border text-[9px] font-mono ${berryColors[berry]}`}>{index + 1}. {berryNames[berry][lang]}</span>;
                })}
              </div>
            </div>

            {/* Yield tiers breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-[#1b1e26] border border-emerald-500/30 p-3.5 space-y-1 text-center">
                <span className="text-[9px] font-mono font-bold uppercase text-emerald-400 block">
                  {lang === 'ru' ? 'Чистый (Pure)' : 'Pure Tier'}
                </span>
                <span className="text-xs font-black text-white font-mono block">
                  {activeTea.pureYield}
                </span>
                <span className="text-[8px] text-zinc-500 block">{lang === 'ru' ? 'Длительность:' : 'Duration:'} {activeTea.duration.pure}</span>
              </div>

              <div className="bg-[#1b1e26] border border-amber-500/30 p-3.5 space-y-1 text-center">
                <span className="text-[9px] font-mono font-bold uppercase text-amber-400 block">
                  {lang === 'ru' ? 'Улучшенный (Adv)' : 'Advanced Tier'}
                </span>
                <span className="text-xs font-black text-white font-mono block">
                  {activeTea.advancedYield}
                </span>
                <span className="text-[8px] text-zinc-500 block">{lang === 'ru' ? 'Длительность:' : 'Duration:'} {activeTea.duration.advanced}</span>
              </div>

              <div className="bg-[#1b1e26] border border-blue-500/30 p-3.5 space-y-1 text-center">
                <span className="text-[9px] font-mono font-bold uppercase text-blue-400 block">
                  {lang === 'ru' ? 'Базовый (Basic)' : 'Basic Tier'}
                </span>
                <span className="text-xs font-black text-white font-mono block">
                  {activeTea.basicYield}
                </span>
                <span className="text-[8px] text-zinc-500 block">{lang === 'ru' ? 'Длительность:' : 'Duration:'} {activeTea.duration.basic}</span>
              </div>
            </div>

            {/* Berry Stock Simulator */}
            <div className="bg-[#1b1e26] border border-[#2a2f3b] p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-white uppercase font-mono flex items-center gap-2">
                  <Sprout className="text-emerald-400" size={14} />
                  <span>{lang === 'ru' ? 'Симулятор ягод в инвентаре' : 'Inventory Berry Simulator'}</span>
                </h4>
                <span className={`text-[10px] font-mono font-bold px-2.5 py-1 border ${mixResult.color}`}>
                  {mixResult.grade} ({mixResult.multiplier})
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-red-400 font-bold block">
                    {lang === 'ru' ? 'Красные ягоды' : 'Red Berries'}
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={500}
                    value={berryInput.red}
                    onChange={(e) => setBerryInput({ ...berryInput, red: Math.max(0, parseInt(e.target.value) || 0) })}
                    className="w-full bg-[#14171e] border border-[#2a2f3b] px-3 py-1.5 text-xs text-white font-mono text-center focus:border-[#cd412b] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-yellow-400 font-bold block">
                    {lang === 'ru' ? 'Желтые ягоды' : 'Yellow Berries'}
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={500}
                    value={berryInput.yellow}
                    onChange={(e) => setBerryInput({ ...berryInput, yellow: Math.max(0, parseInt(e.target.value) || 0) })}
                    className="w-full bg-[#14171e] border border-[#2a2f3b] px-3 py-1.5 text-xs text-white font-mono text-center focus:border-[#cd412b] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-blue-400 font-bold block">
                    {lang === 'ru' ? 'Синие ягоды' : 'Blue Berries'}
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={500}
                    value={berryInput.blue}
                    onChange={(e) => setBerryInput({ ...berryInput, blue: Math.max(0, parseInt(e.target.value) || 0) })}
                    className="w-full bg-[#14171e] border border-[#2a2f3b] px-3 py-1.5 text-xs text-white font-mono text-center focus:border-[#cd412b] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-zinc-200 font-bold block">
                    {lang === 'ru' ? 'Белые ягоды' : 'White Berries'}
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={500}
                    value={berryInput.white}
                    onChange={(e) => setBerryInput({ ...berryInput, white: Math.max(0, parseInt(e.target.value) || 0) })}
                    className="w-full bg-[#14171e] border border-[#2a2f3b] px-3 py-1.5 text-xs text-white font-mono text-center focus:border-[#cd412b] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-purple-400 font-bold block">
                    {lang === 'ru' ? 'Зеленые ягоды' : 'Green Berries'}
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={500}
                    value={berryInput.green}
                    onChange={(e) => setBerryInput({ ...berryInput, green: Math.max(0, parseInt(e.target.value) || 0) })}
                    className="w-full bg-[#14171e] border border-[#2a2f3b] px-3 py-1.5 text-xs text-white font-mono text-center focus:border-[#cd412b] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Mixing Table rules tip */}
            <div className="bg-black/30 border border-zinc-800 p-4 space-y-2 text-xs text-zinc-400 font-sans">
              <div className="flex items-center gap-2 text-amber-400 font-bold font-mono">
                <Info size={14} />
                <span>{lang === 'ru' ? 'Важные правила Стола Смешивания:' : 'Important Mixing Table Rules:'}</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-[11px] text-zinc-300">
                <li>{lang === 'ru' ? 'Один рецепт Basic Tea требует ровно 4 ягоды в указанном порядке слотов; цикл занимает 5 секунд.' : 'One Basic Tea recipe requires exactly 4 berries in the displayed slot order; the cycle takes 5 seconds.'}</li>
                <li>{lang === 'ru' ? '4 Basic Tea смешиваются в 1 Advanced, а 4 Advanced — в 1 Pure. Для одного Pure нужно 64 ягоды.' : '4 Basic teas make 1 Advanced; 4 Advanced make 1 Pure. One Pure therefore takes 64 berries.'}</li>
                <li>{lang === 'ru' ? 'В обновлении 5 ноября 2026 эффекты Advanced и Pure большинства чаёв были ослаблены. Новые точные значения не опубликованы, поэтому они отмечены как неподтверждённые.' : 'The November 5, 2026 update weakened Advanced and Pure effects for most teas. Exact new values have not been published, so they are marked as unconfirmed.'}</li>
                <li>{lang === 'ru' ? 'Чаи разных типов действуют одновременно; новый чай того же типа заменяет предыдущий.' : 'Different tea types can be active together; a new tea of the same type replaces the previous one.'}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
