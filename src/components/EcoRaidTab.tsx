import React, { useState } from 'react';
import { Pickaxe, ShieldAlert, Zap, Clock, AlertTriangle, Search, ChevronRight, Info, Sparkles, Flame, Hammer, Layers, Compass, Crosshair } from 'lucide-react';
import { ItemImageOrFallback } from './IconUtils';

interface EcoRaidTabProps {
  lang: 'ru' | 'en';
}

export interface BuildingStructure {
  id: string;
  name: { ru: string; en: string };
  category: 'wall' | 'door' | 'external' | 'hatch';
  maxHp: number;
  iconId: string;
}

export interface EcoTool {
  id: string;
  name: { ru: string; en: string };
  iconId: string;
  category: 'melee' | 'fire' | 'firearm';
  craftCost: { ru: string; en: string };
  // Damage per hit on soft vs hard side
  // rates for calculating items needed
  rates: Record<string, {
    softDmgPerHit?: number;
    hardDmgPerHit?: number;
    softItemsNeeded?: number;
    hardItemsNeeded?: number;
    softTimeSeconds?: number;
    hardTimeSeconds?: number;
    softNotes?: { ru: string; en: string };
    hardNotes?: { ru: string; en: string };
  }>;
}

const STRUCTURES: BuildingStructure[] = [
  { id: 'wood_wall', name: { ru: 'Деревянная Стена / Потолок', en: 'Wooden Wall / Ceiling' }, category: 'wall', maxHp: 500, iconId: 'wood' },
  { id: 'stone_wall', name: { ru: 'Каменная Стена / Потолок', en: 'Stone Wall / Ceiling' }, category: 'wall', maxHp: 500, iconId: 'stone' },
  { id: 'metal_wall', name: { ru: 'Металлическая Стена (Sheet Metal)', en: 'Sheet Metal Wall' }, category: 'wall', maxHp: 1000, iconId: 'metal.fragments' },
  { id: 'armored_wall', name: { ru: 'Бронированная Стена (Armored/HQM)', en: 'Armored Wall' }, category: 'wall', maxHp: 2000, iconId: 'metal.refined' },
  { id: 'wood_door', name: { ru: 'Деревянная Дверь', en: 'Wooden Door' }, category: 'door', maxHp: 200, iconId: 'door.hinged.wood' },
  { id: 'metal_door', name: { ru: 'Металлическая Дверь', en: 'Sheet Metal Door' }, category: 'door', maxHp: 250, iconId: 'door.hinged.metal' },
  { id: 'garage_door', name: { ru: 'Гаражная Дверь (Garage Door)', en: 'Garage Door' }, category: 'door', maxHp: 600, iconId: 'wall.frame.garagedoor' },
  { id: 'armored_door', name: { ru: 'Бронированная Дверь', en: 'Armored Door' }, category: 'door', maxHp: 800, iconId: 'door.hinged.toptier' },
  { id: 'high_wood_wall', name: { ru: 'Высокая Внешняя Деревянная Стена', en: 'High External Wooden Wall' }, category: 'external', maxHp: 500, iconId: 'wall.external.high.wood' },
  { id: 'high_stone_wall', name: { ru: 'Высокая Внешняя Каменная Стена', en: 'High External Stone Wall' }, category: 'external', maxHp: 1000, iconId: 'wall.external.high.stone' },
  { id: 'ladder_hatch', name: { ru: 'Люк с Лестницей (Ladder Hatch)', en: 'Ladder Hatch' }, category: 'hatch', maxHp: 250, iconId: 'floor.ladder.hatch' },
];

const TOOLS: EcoTool[] = [
  {
    id: 'jackhammer',
    name: { ru: 'Отбойный Молот (Jackhammer)', en: 'Jackhammer' },
    iconId: 'jackhammer',
    category: 'melee',
    craftCost: { ru: '150 Скрапа в Outpost (Бесплатный ремонт на верстаке)', en: '150 Scrap at Outpost (Free refill on Workbench)' },
    rates: {
      stone_wall: {
        softItemsNeeded: 1.2,
        softTimeSeconds: 250,
        softNotes: { ru: 'Самый эффективный эко-рейд камня! Перезаряжается бесплатно на верстаке.', en: 'Best stone eco raid tool! Refill for free on workbench.' },
        hardItemsNeeded: 6,
        hardTimeSeconds: 1250,
      },
      metal_wall: {
        softItemsNeeded: 8,
        softTimeSeconds: 1600,
        hardItemsNeeded: 40,
        hardTimeSeconds: 8000,
      },
      armored_wall: {
        softItemsNeeded: 32,
        softTimeSeconds: 6400,
      }
    }
  },
  {
    id: 'pickaxe',
    name: { ru: 'Каменное / Железное Кило (Pickaxe)', en: 'Pickaxe' },
    iconId: 'pickaxe',
    category: 'melee',
    craftCost: { ru: '125 Дерева + 250 Металла', en: '125 Wood + 250 Metal Frags' },
    rates: {
      stone_wall: {
        softItemsNeeded: 7,
        softTimeSeconds: 1500,
        softNotes: { ru: 'Классический «софт-сайд» долбёж стены 2-3 игроками (25 минут).', en: 'Classic weak side picking by 2-3 players (25 minutes).' },
        hardItemsNeeded: 35,
        hardTimeSeconds: 7500,
      },
      wood_wall: {
        softItemsNeeded: 8,
        softTimeSeconds: 600,
        hardItemsNeeded: 27,
        hardTimeSeconds: 2100,
      }
    }
  },
  {
    id: 'spear_wood',
    name: { ru: 'Деревянное Копье (Wooden Spear)', en: 'Wooden Spear' },
    iconId: 'spear.wooden',
    category: 'melee',
    craftCost: { ru: '300 Дерева за штуку', en: '300 Wood each' },
    rates: {
      wood_wall: {
        softItemsNeeded: 59,
        softTimeSeconds: 900,
        softNotes: { ru: 'Самый дешевый старт для новичков. Тратится ~17,700 Дерева.', en: 'Cheapest starter method. Requires ~17,700 Wood.' },
        hardItemsNeeded: 238,
        hardTimeSeconds: 3600,
      },
      wood_door: {
        softItemsNeeded: 24,
        softTimeSeconds: 360,
        hardItemsNeeded: 24,
        hardTimeSeconds: 360,
      }
    }
  },
  {
    id: 'molotov',
    name: { ru: 'Коктейль Молотова (Molotov Cocktail)', en: 'Molotov Cocktail' },
    iconId: 'grenade.molotov',
    category: 'fire',
    craftCost: { ru: '50 ТНК + 10 Ткани + 1 Тканевая бутылка', en: '50 Low Grade Fuel + 10 Cloth' },
    rates: {
      wood_door: {
        softItemsNeeded: 1.5,
        softTimeSeconds: 30,
        softNotes: { ru: '1.5 Молотова (или 2 штуки) полностью сжигают деревянную дверь за 30 секунд!', en: '1.5 Molotovs completely burn down a wooden door in 30 seconds!' },
        hardItemsNeeded: 1.5,
        hardTimeSeconds: 30,
      },
      wood_wall: {
        softItemsNeeded: 2,
        softTimeSeconds: 45,
        hardItemsNeeded: 4,
        hardTimeSeconds: 90,
      },
      high_wood_wall: {
        softItemsNeeded: 6,
        softTimeSeconds: 120,
        hardItemsNeeded: 6,
        hardTimeSeconds: 120,
      }
    }
  },
  {
    id: 'fire_arrow',
    name: { ru: 'Огненная Стрела (Fire Arrow)', en: 'Fire Arrow' },
    iconId: 'arrow.fire',
    category: 'fire',
    craftCost: { ru: '1 Стрела + 10 ТНК + 2 Пороха', en: '1 Arrow + 10 LGF + 2 Gunpowder' },
    rates: {
      wood_door: {
        softItemsNeeded: 18,
        softTimeSeconds: 60,
        hardItemsNeeded: 18,
        hardTimeSeconds: 60,
      },
      wood_wall: {
        softItemsNeeded: 45,
        softTimeSeconds: 180,
        hardItemsNeeded: 90,
        hardTimeSeconds: 360,
      },
      high_wood_wall: {
        softItemsNeeded: 120,
        softTimeSeconds: 450,
        hardItemsNeeded: 120,
        hardTimeSeconds: 450,
      }
    }
  },
  {
    id: 'salvaged_sword',
    name: { ru: 'Самодельный Меч (Salvaged Sword)', en: 'Salvaged Sword' },
    iconId: 'salvaged.sword',
    category: 'melee',
    craftCost: { ru: '15 Металла + 1 Лезвие (Blade)', en: '15 Metal Frags + 1 Metal Blade' },
    rates: {
      wood_wall: {
        softItemsNeeded: 18,
        softTimeSeconds: 240,
        softNotes: { ru: 'Очень быстрая зачистка мягкого дерева за пару минут!', en: 'Super fast wooden soft-side destruction in a couple minutes!' },
        hardItemsNeeded: 72,
        hardTimeSeconds: 960,
      },
      wood_door: {
        softItemsNeeded: 8,
        softTimeSeconds: 110,
        hardItemsNeeded: 8,
        hardTimeSeconds: 110,
      }
    }
  },
  {
    id: 'exp_ammo',
    name: { ru: 'Разрывные Патроны 5.56 (Explosive Ammo)', en: 'Explosive 5.56 Ammo' },
    iconId: 'ammo.rifle.explosive',
    category: 'firearm',
    craftCost: { ru: '10 Металла + 10 Серы + 20 Пороха за 2 шт.', en: '10 Metal + 10 Sulfur + 20 Gunpowder per 2x' },
    rates: {
      wood_door: {
        softItemsNeeded: 19,
        softTimeSeconds: 15,
        hardItemsNeeded: 19,
        hardTimeSeconds: 15,
      },
      metal_door: {
        softItemsNeeded: 63,
        softTimeSeconds: 30,
        hardItemsNeeded: 63,
        hardTimeSeconds: 30,
      },
      garage_door: {
        softItemsNeeded: 150,
        softTimeSeconds: 60,
        hardItemsNeeded: 150,
        hardTimeSeconds: 60,
      },
      stone_wall: {
        softItemsNeeded: 184,
        softTimeSeconds: 80,
        hardItemsNeeded: 184,
        hardTimeSeconds: 80,
      },
      metal_wall: {
        softItemsNeeded: 400,
        softTimeSeconds: 160,
        hardItemsNeeded: 400,
        hardTimeSeconds: 160,
      }
    }
  }
];

export default function EcoRaidTab({ lang }: EcoRaidTabProps) {
  const [selectedStructureId, setSelectedStructureId] = useState<string>('stone_wall');
  const [side, setSide] = useState<'soft' | 'hard'>('soft');
  const [currentHp, setCurrentHp] = useState<number>(500);

  const selectedStructure = STRUCTURES.find(s => s.id === selectedStructureId) || STRUCTURES[1];

  // Update currentHp when structure changes
  const handleSelectStructure = (struct: BuildingStructure) => {
    setSelectedStructureId(struct.id);
    setCurrentHp(struct.maxHp);
  };

  const hpRatio = Math.max(0.01, Math.min(1, currentHp / selectedStructure.maxHp));

  return (
    <div className="space-y-6 text-gray-200 font-sans">
      {/* Header Banner */}
      <div className="bg-[#14171e]/90 border border-[#2a2f3b] p-5 sm:p-6 relative overflow-hidden rust-metal-pattern shadow-xl">
        <div className="rust-bracket-tl" />
        <div className="rust-bracket-tr" />
        <div className="rust-bracket-bl" />
        <div className="rust-bracket-br" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-[#cd412b]/20 text-[#cd412b] border border-[#cd412b]/40 rounded-sm">
                <Pickaxe size={18} />
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white font-sans uppercase tracking-tight">
                {lang === 'ru' ? 'Эко-Рейд & Soft Side Матрица' : 'Eco-Raid & Weak Side Calculator'}
              </h2>
            </div>
            <p className="text-xs text-gray-400 font-sans leading-relaxed max-w-3xl">
              {lang === 'ru'
                ? 'Калькулятор бешпатронного и бюджетного рейда через Мягкую (Soft Side) и Твердкю (Hard Side) стороны стен, дверей и луков. Расчет деревянных копий, кирок, отбойных молотков, мечей и молотовых.'
                : 'Budget & silent raiding tool calculator for Soft Side and Hard Side wall / door picking. Calculate exact spears, pickaxes, jackhammers, molotovs, and craft costs.'}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <span className="px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/30 rounded-sm flex items-center gap-1.5">
              <Crosshair size={12} />
              <span>{lang === 'ru' ? 'Точные Коэффициенты Rust' : 'Exact Rust Multipliers'}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Grid Layout: Structure Selector & Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Target Building Block Selector */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#14171e] border border-[#2a2f3b] p-4 space-y-3">
            <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2 border-b border-[#2a2f3b] pb-2">
              <Layers size={14} className="text-[#cd412b]" />
              <span>{lang === 'ru' ? 'Выберите Цель Для Рейда:' : 'Select Target Structure:'}</span>
            </h3>

            <div className="space-y-1.5 max-h-[420px] overflow-y-auto pr-1 custom-scrollbar">
              {STRUCTURES.map(s => {
                const isSelected = s.id === selectedStructureId;
                return (
                  <button
                    key={s.id}
                    onClick={() => handleSelectStructure(s)}
                    className={`w-full p-2.5 border text-left transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-[#1c202b] border-[#cd412b] shadow-md'
                        : 'bg-[#0c0d10] border-[#2a2f3b] hover:border-[#cd412b]/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-black/50 border border-[#2a2f3b] flex items-center justify-center shrink-0">
                        <ItemImageOrFallback id={s.iconId} lang={lang} size={24} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white font-sans">{s.name[lang]}</p>
                        <p className="text-[10px] font-mono text-gray-400">MAX HP: {s.maxHp}</p>
                      </div>
                    </div>
                    <ChevronRight size={14} className={isSelected ? 'text-[#cd412b]' : 'text-gray-600'} />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Col: Parameters & Tool Breakdown */}
        <div className="lg:col-span-7 space-y-5">
          <div className="bg-[#14171e] border border-[#2a2f3b] p-5 space-y-5">
            {/* Soft / Hard Side Toggle */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2a2f3b] pb-4">
              <div>
                <h3 className="text-sm font-bold text-white font-sans uppercase">
                  {selectedStructure.name[lang]}
                </h3>
                <p className="text-xs text-gray-400 font-mono mt-0.5">
                  {lang === 'ru' ? 'Прочность объекта:' : 'Current HP:'} {currentHp} / {selectedStructure.maxHp} HP
                </p>
              </div>

              {/* Side Buttons */}
              <div className="flex items-center gap-1.5 bg-[#0c0d10] p-1 border border-[#2a2f3b]">
                <button
                  onClick={() => setSide('soft')}
                  className={`px-3 py-1.5 text-xs font-mono font-bold uppercase rounded-xs transition-all cursor-pointer flex items-center gap-1.5 ${
                    side === 'soft'
                      ? 'bg-[#cd412b] text-white shadow-md'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Sparkles size={12} />
                  <span>{lang === 'ru' ? 'Мягкая Сторона (Soft Side)' : 'Soft Side (Weak)'}</span>
                </button>

                <button
                  onClick={() => setSide('hard')}
                  className={`px-3 py-1.5 text-xs font-mono font-bold uppercase rounded-xs transition-all cursor-pointer flex items-center gap-1.5 ${
                    side === 'hard'
                      ? 'bg-stone-700 text-white shadow-md'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <ShieldAlert size={12} />
                  <span>{lang === 'ru' ? 'Твердая Сторона (Hard Side)' : 'Hard Side'}</span>
                </button>
              </div>
            </div>

            {/* Custom HP Slider */}
            <div className="space-y-2 bg-[#0c0d10] border border-[#2a2f3b] p-3">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-gray-400">{lang === 'ru' ? 'Текущая прочность цели (HP):' : 'Adjust target damage HP:'}</span>
                <span className="text-amber-400 font-bold">{currentHp} HP</span>
              </div>
              <input
                type="range"
                min={1}
                max={selectedStructure.maxHp}
                value={currentHp}
                onChange={(e) => setCurrentHp(Number(e.target.value))}
                className="w-full accent-[#cd412b] cursor-pointer"
              />
            </div>

            {/* Eco Tool Matrix */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
                <Hammer size={14} className="text-amber-400" />
                <span>
                  {lang === 'ru'
                    ? `Доступные Эко-Инструменты (${side === 'soft' ? 'Мягкая Сторона' : 'Твердая Сторона'}):`
                    : `Available Eco Tools (${side === 'soft' ? 'Soft Side' : 'Hard Side'}):`}
                </span>
              </h4>

              <div className="space-y-3">
                {TOOLS.map(tool => {
                  const rateData = tool.rates[selectedStructure.id];
                  if (!rateData) return null;

                  const rawNeeded = side === 'soft' ? rateData.softItemsNeeded : rateData.hardItemsNeeded;
                  if (!rawNeeded) return null;

                  const actualNeeded = (rawNeeded * hpRatio).toFixed(1);
                  const rawTime = side === 'soft' ? rateData.softTimeSeconds : rateData.hardTimeSeconds;
                  const actualTimeSec = rawTime ? Math.round(rawTime * hpRatio) : 0;
                  const minutes = Math.floor(actualTimeSec / 60);
                  const seconds = actualTimeSec % 60;
                  const notes = side === 'soft' ? rateData.softNotes : rateData.hardNotes;

                  return (
                    <div key={tool.id} className="bg-[#1c202b] border border-[#2a2f3b] p-3.5 space-y-2.5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#2a2f3b]/60 pb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-black/60 border border-[#2a2f3b] flex items-center justify-center shrink-0">
                            <ItemImageOrFallback id={tool.iconId} lang={lang} size={32} />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-white font-sans">{tool.name[lang]}</p>
                            <p className="text-[10px] text-gray-400 font-mono">{tool.craftCost[lang]}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-xs font-mono self-end sm:self-auto">
                          <div className="text-right">
                            <p className="text-[10px] text-gray-500 uppercase">{lang === 'ru' ? 'Количество' : 'Needed'}</p>
                            <p className="text-sm font-black text-amber-400">{actualNeeded}x</p>
                          </div>

                          <div className="text-right">
                            <p className="text-[10px] text-gray-500 uppercase">{lang === 'ru' ? 'Время' : 'Time'}</p>
                            <p className="text-sm font-black text-emerald-400">
                              {minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`}
                            </p>
                          </div>
                        </div>
                      </div>

                      {notes && (
                        <p className="text-[11px] text-gray-300 font-sans leading-relaxed flex items-start gap-1.5 bg-[#0c0d10] p-2 border border-[#2a2f3b]">
                          <Info size={13} className="text-sky-400 shrink-0 mt-0.5" />
                          <span>{notes[lang]}</span>
                        </p>
                      )}
                    </div>
                  );
                })}

                {/* If no tool found for this wall type */}
                {!TOOLS.some(t => t.rates[selectedStructure.id] && (side === 'soft' ? t.rates[selectedStructure.id].softItemsNeeded : t.rates[selectedStructure.id].hardItemsNeeded)) && (
                  <div className="bg-[#0c0d10] border border-[#2a2f3b] p-6 text-center text-xs font-mono text-gray-400">
                    {lang === 'ru'
                      ? 'Для этой конструкции не предусмотрен обычный эко-рейд через инструменты (требуется C4, Ракеты или Сатчели).'
                      : 'No non-explosive eco-raid method available for this structure (Requires C4, Rockets or Satchels).'}
                  </div>
                )}
              </div>
            </div>

            {/* Pro Tips Section */}
            <div className="bg-[#0c0d10] border border-[#2a2f3b] p-4 space-y-2 text-xs font-sans">
              <h5 className="font-bold text-amber-400 font-mono uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle size={14} />
                <span>{lang === 'ru' ? 'Лайфхаки Эко-Рейда в Rust:' : 'Rust Eco-Raid Pro Tips:'}</span>
              </h5>
              <ul className="list-disc list-inside space-y-1 text-gray-300 text-[11px] leading-relaxed">
                <li>
                  {lang === 'ru'
                    ? 'Отбойный молоток (Jackhammer) можно БЕСПЛАТНО чинить на любом Верстаке (Workbench 1, 2, 3), не тратя ресурсы!'
                    : 'Jackhammers can be REPAIRED FOR FREE at any Workbench without consuming any resources!'}
                </li>
                <li>
                  {lang === 'ru'
                    ? 'Мягкая сторона дверных проемов или стен смотрит внутрь постройки. Для потолка софт-сайд смотрит СНИЗУ вверх.'
                    : 'Weak/soft side of walls and doorframes face inside the building. Ceiling soft-side is underneath.'}
                </li>
                <li>
                  {lang === 'ru'
                    ? 'Деревянные копья можно крафтить прямо на ходу, выбрасывая сломанные.'
                    : 'Wooden spears can be continuously crafted on the go while dropping broken ones.'}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
