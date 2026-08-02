import React, { useState } from 'react';
import { FlaskConical, Sparkles, Sprout, ShieldCheck, Flame, RefreshCw, Info, Check, Copy } from 'lucide-react';
import { logUserActivity } from '../services/activityLogger';

interface MixingTableTabProps {
  lang: 'ru' | 'en';
  onToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}

interface TeaRecipe {
  id: string;
  name: { ru: string; en: string };
  desc: { ru: string; en: string };
  effect: { ru: string; en: string };
  berries: { type: 'yellow' | 'red' | 'blue' | 'white' | 'black' | 'green'; count: number; secondaryType?: 'yellow' | 'red' | 'blue' | 'white' | 'black' | 'green'; secondaryCount?: number }[];
  scrapCost: number;
  pureYield: string;
  advancedYield: string;
  basicYield: string;
  iconBg: string;
}

const TEA_RECIPES: TeaRecipe[] = [
  {
    id: 'scrap_tea',
    name: { ru: 'Чай на Скрап (Scrap Tea)', en: 'Scrap Tea' },
    desc: { 
      ru: 'Увеличивает получаемый скрап от бочек, ящиков и мусорок.', 
      en: 'Increases scrap yield from barrels, crates, and junk piles.' 
    },
    effect: { ru: '+50% Скрапа (Чистый)', en: '+50% Scrap (Pure)' },
    berries: [
      { type: 'yellow', count: 10, secondaryType: 'yellow', secondaryCount: 1 }
    ],
    scrapCost: 0,
    pureYield: 'Pure Scrap Tea (+50% Scrap)',
    advancedYield: 'Advanced Scrap Tea (+30% Scrap)',
    basicYield: 'Basic Scrap Tea (+15% Scrap)',
    iconBg: 'from-amber-500/20 to-yellow-500/20 text-amber-400'
  },
  {
    id: 'ore_tea',
    name: { ru: 'Чай на Руду (Ore Tea)', en: 'Ore Tea' },
    desc: { 
      ru: 'Увеличивает количество добываемой руды (МВК, Сера, Металл, Камень) из рудных нод.', 
      en: 'Increases ore yield (HQM, Sulfur, Metal, Stone) from mining nodes.' 
    },
    effect: { ru: '+50% Руды (Чистый)', en: '+50% Ore (Pure)' },
    berries: [
      { type: 'red', count: 10 }
    ],
    scrapCost: 0,
    pureYield: 'Pure Ore Tea (+50% Ore)',
    advancedYield: 'Advanced Ore Tea (+30% Ore)',
    basicYield: 'Basic Ore Tea (+15% Ore)',
    iconBg: 'from-red-500/20 to-orange-500/20 text-red-400'
  },
  {
    id: 'wood_tea',
    name: { ru: 'Чай на Дерево (Wood Tea)', en: 'Wood Tea' },
    desc: { 
      ru: 'Увеличивает количество получаемой древесины при рубке деревьев топором или бензопилой.', 
      en: 'Increases wood harvested from cutting down trees.' 
    },
    effect: { ru: '+50% Дерева (Чистый)', en: '+50% Wood (Pure)' },
    berries: [
      { type: 'red', count: 5, secondaryType: 'blue', secondaryCount: 5 }
    ],
    scrapCost: 0,
    pureYield: 'Pure Wood Tea (+50% Wood)',
    advancedYield: 'Advanced Wood Tea (+30% Wood)',
    basicYield: 'Basic Wood Tea (+15% Wood)',
    iconBg: 'from-emerald-500/20 to-green-500/20 text-emerald-400'
  },
  {
    id: 'max_health_tea',
    name: { ru: 'Чай на Здоровье (Max Health Tea)', en: 'Max Health Tea' },
    desc: { 
      ru: 'Увеличивает максимальный запас здоровья персонажа (до 200 HP на чистом чае).', 
      en: 'Increases maximum player health pool (up to 200 HP with Pure Tea).' 
    },
    effect: { ru: 'До 200 Макс. HP', en: 'Up to 200 Max HP' },
    berries: [
      { type: 'blue', count: 10 }
    ],
    scrapCost: 0,
    pureYield: 'Pure Max Health Tea (200 HP)',
    advancedYield: 'Advanced Max Health Tea (150 HP)',
    basicYield: 'Basic Max Health Tea (125 HP)',
    iconBg: 'from-blue-500/20 to-cyan-500/20 text-blue-400'
  },
  {
    id: 'healing_tea',
    name: { ru: 'Чай на Регенерацию (Healing Tea)', en: 'Healing Tea' },
    desc: { 
      ru: 'Дает постепенное или мгновенное восстановление здоровья при ранениях.', 
      en: 'Provides continuous health regeneration over time.' 
    },
    effect: { ru: 'Регенерация HP', en: 'Health Regen' },
    berries: [
      { type: 'green', count: 10 }
    ],
    scrapCost: 0,
    pureYield: 'Pure Healing Tea',
    advancedYield: 'Advanced Healing Tea',
    basicYield: 'Basic Healing Tea',
    iconBg: 'from-purple-500/20 to-pink-500/20 text-purple-400'
  },
  {
    id: 'radiation_tea',
    name: { ru: 'Антирадиационный чай (Anti-Rad Tea)', en: 'Anti-Radiation Tea' },
    desc: { 
      ru: 'Повышает сопротивляемость радиации и снимает радиационное заражение.', 
      en: 'Increases radiation resistance and slowly removes radiation.' 
    },
    effect: { ru: 'Защита от Радиации', en: 'Radiation Resistance' },
    berries: [
      { type: 'white', count: 10 }
    ],
    scrapCost: 0,
    pureYield: 'Pure Anti-Rad Tea',
    advancedYield: 'Advanced Anti-Rad Tea',
    basicYield: 'Basic Anti-Rad Tea',
    iconBg: 'from-zinc-500/20 to-slate-500/20 text-zinc-300'
  }
];

export default function MixingTableTab({ lang, onToast }: MixingTableTabProps) {
  const [selectedTea, setSelectedTea] = useState<string>('scrap_tea');
  const [berryInput, setBerryInput] = useState<{ red: number; yellow: number; blue: number; white: number; green: number }>({
    red: 20,
    yellow: 20,
    blue: 10,
    white: 0,
    green: 0
  });

  const activeTea = TEA_RECIPES.find(t => t.id === selectedTea) || TEA_RECIPES[0];

  // Calculate estimated tea grade based on berry counts in mixing table (Max 10 berries per mix slot)
  const calculateMixResult = () => {
    let totalBerries = 0;
    if (selectedTea === 'scrap_tea') totalBerries = berryInput.yellow;
    else if (selectedTea === 'ore_tea') totalBerries = berryInput.red;
    else if (selectedTea === 'wood_tea') totalBerries = berryInput.red + berryInput.blue;
    else if (selectedTea === 'max_health_tea') totalBerries = berryInput.blue;
    else if (selectedTea === 'healing_tea') totalBerries = berryInput.green;
    else if (selectedTea === 'radiation_tea') totalBerries = berryInput.white;

    // Pure requires 10+ same high-grade berries or specific combinations in mixing table
    if (totalBerries >= 10) {
      return { grade: 'Pure (Чистый)', multiplier: '+50%', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' };
    } else if (totalBerries >= 5) {
      return { grade: 'Advanced (Улучшенный)', multiplier: '+30%', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' };
    } else if (totalBerries >= 1) {
      return { grade: 'Basic (Базовый)', multiplier: '+15%', color: 'text-blue-400 bg-blue-500/10 border-blue-500/30' };
    }
    return { grade: 'Недостаточно ягод', multiplier: '0%', color: 'text-zinc-500 bg-zinc-800/50 border-zinc-700' };
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
              ? 'Рассчитывайте рецепты алхимии за Столом Смешивания (Mixing Table), количество ягод для получения чистых чаев (+50% Скрапа, Руды, Дерева и Здоровья) и планируйте ферму.'
              : 'Calculate Mixing Table recipes, required berry quantities for Pure Teas (+50% Scrap, Ore, Wood, HP), and plan your farm output.'}
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
                <span className="text-[8px] text-zinc-500 block">10+ ягод в слоте</span>
              </div>

              <div className="bg-[#1b1e26] border border-amber-500/30 p-3.5 space-y-1 text-center">
                <span className="text-[9px] font-mono font-bold uppercase text-amber-400 block">
                  {lang === 'ru' ? 'Улучшенный (Adv)' : 'Advanced Tier'}
                </span>
                <span className="text-xs font-black text-white font-mono block">
                  {activeTea.advancedYield}
                </span>
                <span className="text-[8px] text-zinc-500 block">5 - 9 ягод в слоте</span>
              </div>

              <div className="bg-[#1b1e26] border border-blue-500/30 p-3.5 space-y-1 text-center">
                <span className="text-[9px] font-mono font-bold uppercase text-blue-400 block">
                  {lang === 'ru' ? 'Базовый (Basic)' : 'Basic Tier'}
                </span>
                <span className="text-xs font-black text-white font-mono block">
                  {activeTea.basicYield}
                </span>
                <span className="text-[8px] text-zinc-500 block">1 - 4 ягоды в слоте</span>
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

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-red-400 font-bold block">
                    {lang === 'ru' ? 'Красные ягоды' : 'Red Berries'}
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={500}
                    value={berryInput.red}
                    onChange={(e) => setBerryInput({ ...berryInput, red: parseInt(e.target.value) || 0 })}
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
                    onChange={(e) => setBerryInput({ ...berryInput, yellow: parseInt(e.target.value) || 0 })}
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
                    onChange={(e) => setBerryInput({ ...berryInput, blue: parseInt(e.target.value) || 0 })}
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
                    onChange={(e) => setBerryInput({ ...berryInput, green: parseInt(e.target.value) || 0 })}
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
                <li>{lang === 'ru' ? 'Время одного цикла смешивания на столе составляет ровно 30 секунд.' : 'One mixing cycle takes exactly 30 seconds.'}</li>
                <li>{lang === 'ru' ? 'Для получения Pure (Чистого) чая необходимо положить в слот ровно или более 10 одинаковых ягод.' : 'To get Pure tea, place 10 or more of the correct berries in the mixing slot.'}</li>
                <li>{lang === 'ru' ? 'Вы можете скрещивать ягоды на грядках для получения идеального гена (YYYGG или HHHG).' : 'You can crossbreed berries in planters to achieve ideal genes (YYYGG or HHHG).'}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
