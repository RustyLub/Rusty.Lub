import React, { useState } from 'react';
import { Pickaxe, Cpu, Fuel, Flame, Clock, ShieldAlert, Zap, Compass, Info, Check, ArrowRight, Layers, BarChart3, AlertTriangle, HelpCircle } from 'lucide-react';
import { ItemImageOrFallback } from './IconUtils';

interface MiningQuarryTabProps {
  lang: 'ru' | 'en';
}

interface ExcavatorResource {
  id: string;
  name: { ru: string; en: string };
  iconId: string;
  yieldPerDiesel: number;
  unit: { ru: string; en: string };
  smeltYield?: {
    refinedIconId: string;
    ratio: number;
    refinedName: { ru: string; en: string };
  };
}

const EXCAVATOR_YIELDS: ExcavatorResource[] = [
  {
    id: 'hqm_ore',
    name: { ru: 'МВК Руда (High Quality Metal Ore)', en: 'High Quality Metal Ore' },
    iconId: 'hq.metal.ore',
    yieldPerDiesel: 100, // Official Vanilla rate: 100 HQM Ore per 1 Diesel Fuel
    unit: { ru: 'руды', en: 'ore' },
    smeltYield: {
      refinedIconId: 'metal.refined',
      ratio: 1, // 1 ore = 1 refined HQM
      refinedName: { ru: 'Чистый МВК (Refined HQM)', en: 'Refined HQM' }
    }
  },
  {
    id: 'sulfur_ore',
    name: { ru: 'Серная Руда (Sulfur Ore)', en: 'Sulfur Ore' },
    iconId: 'sulfur.ore',
    yieldPerDiesel: 2000, // Vanilla rate: 2,000 Sulfur Ore per 1 Diesel Fuel
    unit: { ru: 'руды', en: 'ore' },
    smeltYield: {
      refinedIconId: 'sulfur',
      ratio: 1, // 1 ore = 1 sulfur
      refinedName: { ru: 'Очищенная Сера (Clean Sulfur)', en: 'Refined Sulfur' }
    }
  },
  {
    id: 'metal_ore',
    name: { ru: 'Металлическая Руда (Metal Ore)', en: 'Metal Ore' },
    iconId: 'metal.ore',
    yieldPerDiesel: 10000, // Vanilla rate: 10,000 Metal Ore per 1 Diesel Fuel
    unit: { ru: 'руды', en: 'ore' },
    smeltYield: {
      refinedIconId: 'metal.fragments',
      ratio: 1,
      refinedName: { ru: 'Фрагменты Металла (Metal Frags)', en: 'Metal Fragments' }
    }
  },
  {
    id: 'stones',
    name: { ru: 'Камень (Stones)', en: 'Stones' },
    iconId: 'stone',
    yieldPerDiesel: 20000, // Vanilla rate: 20,000 Stones per 1 Diesel Fuel
    unit: { ru: 'камня', en: 'stone' }
  }
];

const DIESEL_LOCATIONS = [
  { name: { ru: 'Нефтяные Вышки (Oil Rigs)', en: 'Oil Rigs (Large & Small)' }, count: '3 - 7 шт.', risk: { ru: 'Высокий', en: 'High' }, note: { ru: 'Спавнятся в синих и красных картах, на палубе.', en: 'Spawns on decks and card rooms.' } },
  { name: { ru: 'Сфера (The Dome)', en: 'The Dome' }, count: '2 - 4 шт.', risk: { ru: 'Средний', en: 'Medium' }, note: { ru: 'На самом верху Купола рядом с зелеными ящиками.', en: 'At the top of the Dome near military crates.' } },
  { name: { ru: 'Аэродром (Airfield)', en: 'Airfield' }, count: '2 - 3 шт.', risk: { ru: 'Средний', en: 'Medium' }, note: { ru: 'В подземных бункерах и возле ВПП.', en: 'In underground tunnels & runway sheds.' } },
  { name: { ru: 'Свалка (Junkyard)', en: 'Junkyard' }, count: '1 - 2 шт.', risk: { ru: 'Низкий', en: 'Low' }, note: { ru: 'Возле измельчителя магнита.', en: 'Near the magnet crane and shredder.' } },
  { name: { ru: 'Мирный Город (Outpost)', en: 'Outpost Buying' }, count: 'Безлимит', risk: { ru: 'Безопасно', en: 'Safe' }, note: { ru: 'Покупка у торговца: 300 ТНК за 1 Дизель.', en: 'Buy from Vending Machine: 300 LGF per 1 Diesel.' } },
];

export default function MiningQuarryTab({ lang }: MiningQuarryTabProps) {
  const [dieselCount, setDieselCount] = useState<number>(10);
  const [selectedResourceType, setSelectedResourceType] = useState<string>('hqm_ore');
  const [serverRate, setServerRate] = useState<number>(1);

  // Excavator Calculations
  // 1 Diesel Fuel burns for 120 seconds (2 minutes) at Giant Excavator
  const excavationTimeSec = dieselCount * 120;
  const excavationMinutes = Math.floor(excavationTimeSec / 60);
  const excavationHours = (excavationMinutes / 60).toFixed(1);

  const selectedExcavatorRes = EXCAVATOR_YIELDS.find(r => r.id === selectedResourceType) || EXCAVATOR_YIELDS[0];
  const totalRawYield = dieselCount * selectedExcavatorRes.yieldPerDiesel * serverRate;
  const totalRefinedYield = selectedExcavatorRes.smeltYield ? totalRawYield * selectedExcavatorRes.smeltYield.ratio : totalRawYield;

  // Smelting calculations (Large Furnace: ~100 wood per 1000 sulfur / metal ore)
  const woodForSmelting = selectedResourceType === 'stones' ? 0 : Math.ceil(totalRawYield * 0.1);
  const coalGenerated = Math.ceil(woodForSmelting * 0.75);

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
                <Cpu size={18} />
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white font-sans uppercase tracking-tight">
                {lang === 'ru' ? 'Калькулятор Карьеров & Гигантского Экскаватора' : 'Mining Quarry & Giant Excavator Calculator'}
              </h2>
            </div>
            <p className="text-xs text-gray-400 font-sans leading-relaxed max-w-3xl">
              {lang === 'ru'
                ? 'Официальный калькулятор добычи ресурсов с помощью Дизельного Топлива (Diesel Fuel) на Гигантском Экскаваторе (1 Дизель = 100 МВК / 2000 Серы / 10000 Металла / 20000 Камня). Поддержка рейтов серверов (1x, 2x, 3x, 5x).'
                : 'Official yield & time calculator for Giant Excavator & Mining Quarries using Diesel Fuel (1 Diesel = 100 HQM / 2000 Sulfur / 10000 Metal / 20000 Stone). Supports server rates (1x-5x).'}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <span className="px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/30 rounded-sm flex items-center gap-1.5">
              <Fuel size={12} className="text-[#cd412b]" />
              <span>{lang === 'ru' ? '1 Дизель = 2 Мин Работы' : '1 Diesel = 2 Min Duration'}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Diesel Input & Overview */}
      <div className="bg-[#14171e] border border-[#2a2f3b] p-5 sm:p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#2a2f3b] pb-4">
          <div>
            <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
              <Fuel size={16} className="text-[#cd412b]" />
              <span>{lang === 'ru' ? 'Количество Дизельного Топлива (Diesel Fuel):' : 'Diesel Fuel Quantity:'}</span>
            </h3>
            <p className="text-xs text-gray-400 font-sans mt-0.5">
              {lang === 'ru' ? 'Укажите сколько банок дизеля вы планируете запустить и выберите рейты сервера.' : 'Set total diesel barrels and select your server rate.'}
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Server Rate Selector */}
            <div className="flex items-center gap-1 bg-[#0c0d10] p-1 border border-[#2a2f3b]">
              <span className="text-[10px] font-mono text-gray-400 px-2 uppercase">{lang === 'ru' ? 'Рейт:' : 'Rate:'}</span>
              {[1, 2, 3, 5].map(rate => (
                <button
                  key={rate}
                  onClick={() => setServerRate(rate)}
                  className={`px-2.5 py-1 text-xs font-mono font-bold cursor-pointer transition-colors ${
                    serverRate === rate
                      ? 'bg-[#cd412b] text-white'
                      : 'text-gray-400 hover:text-white hover:bg-[#1a1d26]'
                  }`}
                >
                  {rate}x
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                max={500}
                value={dieselCount}
                onChange={(e) => setDieselCount(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-24 bg-[#0c0d10] border border-[#2a2f3b] px-3 py-2 text-base font-mono font-bold text-amber-400 text-center focus:outline-none focus:border-[#cd412b]"
              />
              <span className="text-xs font-mono text-gray-400 uppercase">{lang === 'ru' ? 'Банок' : 'Barrels'}</span>
            </div>
          </div>
        </div>

        {/* Diesel Slider */}
        <div className="space-y-2">
          <input
            type="range"
            min={1}
            max={100}
            value={dieselCount}
            onChange={(e) => setDieselCount(Number(e.target.value))}
            className="w-full accent-[#cd412b] cursor-pointer"
          />
          <div className="flex justify-between text-[11px] font-mono text-gray-500">
            <span>1 Diesel</span>
            <span>25 Diesel</span>
            <span>50 Diesel</span>
            <span>75 Diesel</span>
            <span>100 Diesel</span>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-[#0c0d10] border border-[#2a2f3b] p-3 text-center">
            <span className="block text-xs font-mono text-gray-400 uppercase">{lang === 'ru' ? 'Время работы' : 'Operation Time'}</span>
            <span className="block text-xl font-black text-white font-mono mt-1">
              {excavationMinutes >= 60 ? `${excavationHours} ч` : `${excavationMinutes} мин`}
            </span>
          </div>

          <div className="bg-[#0c0d10] border border-[#2a2f3b] p-3 text-center">
            <span className="block text-xs font-mono text-gray-400 uppercase">{lang === 'ru' ? 'Стоимость в ТНК' : 'Value in LGF'}</span>
            <span className="block text-xl font-black text-amber-400 font-mono mt-1">
              {(dieselCount * 300).toLocaleString()} LGF
            </span>
          </div>

          <div className="bg-[#0c0d10] border border-[#2a2f3b] p-3 text-center">
            <span className="block text-xs font-mono text-gray-400 uppercase">{lang === 'ru' ? 'Сигналов Радио' : 'Radio Signals'}</span>
            <span className="block text-xl font-black text-rose-400 font-mono mt-1">
              {dieselCount} {lang === 'ru' ? 'сигналов' : 'broadcasts'}
            </span>
          </div>

          <div className="bg-[#0c0d10] border border-[#2a2f3b] p-3 text-center">
            <span className="block text-xs font-mono text-gray-400 uppercase">{lang === 'ru' ? 'Уровень Опасности' : 'Risk Factor'}</span>
            <span className="block text-xl font-black text-red-500 font-mono mt-1 uppercase">
              {lang === 'ru' ? 'Высокий' : 'High Pk'}
            </span>
          </div>
        </div>
      </div>

      {/* Resource Selector & Giant Excavator Yield Calculator */}
      <div className="bg-[#14171e] border border-[#2a2f3b] p-5 sm:p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-[#2a2f3b] pb-3">
          <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
            <Cpu size={16} className="text-amber-400" />
            <span>{lang === 'ru' ? 'Добыча на Гигантском Экскаваторе (Giant Excavator):' : 'Giant Excavator Output Matrix:'}</span>
          </h3>
        </div>

        {/* Buttons for choosing resource */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {EXCAVATOR_YIELDS.map(res => {
            const isSelected = res.id === selectedResourceType;
            return (
              <button
                key={res.id}
                onClick={() => setSelectedResourceType(res.id)}
                className={`p-3 border text-left transition-all cursor-pointer flex items-center gap-3 ${
                  isSelected
                    ? 'bg-[#1c202b] border-[#cd412b] shadow-md'
                    : 'bg-[#0c0d10] border-[#2a2f3b] hover:border-[#cd412b]/50'
                }`}
              >
                <div className="w-10 h-10 bg-black/60 border border-[#2a2f3b] flex items-center justify-center shrink-0">
                  <ItemImageOrFallback id={res.iconId} lang={lang} size={30} />
                </div>
                <div>
                  <p className="text-xs font-bold text-white font-sans">{res.name[lang]}</p>
                  <p className="text-[10px] font-mono text-amber-400">
                    +{res.yieldPerDiesel.toLocaleString()} / {lang === 'ru' ? 'дизель' : 'diesel'}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Output Card */}
        <div className="bg-[#0c0d10] border border-[#2a2f3b] p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2a2f3b] pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-black/80 border border-[#cd412b]/50 flex items-center justify-center">
                <ItemImageOrFallback id={selectedExcavatorRes.iconId} lang={lang} size={40} />
              </div>
              <div>
                <h4 className="text-base font-bold text-white font-sans">{selectedExcavatorRes.name[lang]}</h4>
                <p className="text-xs text-gray-400 font-mono">
                  {lang === 'ru' ? 'Итоговая непереработанная сырая руда' : 'Total raw unrefined ore'}
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right font-mono">
              <span className="text-[10px] text-gray-500 uppercase block">{lang === 'ru' ? 'Добыто Руды' : 'Total Ore'}</span>
              <span className="text-2xl font-black text-amber-400">{totalRawYield.toLocaleString()} {selectedExcavatorRes.unit[lang]}</span>
            </div>
          </div>

          {/* Refined Result if applicable */}
          {selectedExcavatorRes.smeltYield && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#14171e] p-4 border border-[#2a2f3b]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-black/80 border border-emerald-500/40 flex items-center justify-center">
                  <ItemImageOrFallback id={selectedExcavatorRes.smeltYield.refinedIconId} lang={lang} size={32} />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-emerald-400 font-sans">{selectedExcavatorRes.smeltYield.refinedName[lang]}</h5>
                  <p className="text-[10px] text-gray-400 font-mono">
                    {lang === 'ru' ? 'После выплавки в печи (1 к 1)' : 'After smelting in furnace (1:1 conversion)'}
                  </p>
                </div>
              </div>

              <div className="text-left sm:text-right font-mono">
                <span className="text-[10px] text-gray-500 uppercase block">{lang === 'ru' ? 'Чистый Ресурс' : 'Clean Refined'}</span>
                <span className="text-xl font-black text-emerald-400">{totalRefinedYield.toLocaleString()} шт.</span>
              </div>
            </div>
          )}

          {/* Smelting Requirements */}
          {selectedResourceType !== 'stones' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs font-mono">
              <div className="bg-[#14171e] border border-[#2a2f3b] p-3 flex items-center justify-between">
                <span className="text-gray-400">{lang === 'ru' ? 'Дерева на выплавку (Большая печь):' : 'Wood required (Large Furnace):'}</span>
                <span className="font-bold text-amber-300">~{woodForSmelting.toLocaleString()} Wood</span>
              </div>
              <div className="bg-[#14171e] border border-[#2a2f3b] p-3 flex items-center justify-between">
                <span className="text-gray-400">{lang === 'ru' ? 'Угля будет получено:' : 'Coal produced:'}</span>
                <span className="font-bold text-gray-200">~{coalGenerated.toLocaleString()} Charcoal</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Comparison: Excavator vs Standard Mining Quarries */}
      <div className="bg-[#14171e] border border-[#2a2f3b] p-5 sm:p-6 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2 border-b border-[#2a2f3b] pb-3">
          <BarChart3 size={16} className="text-sky-400" />
          <span>{lang === 'ru' ? 'Сравнение: Экскаватор vs Каркасные Карьеры (Quarries)' : 'Comparison: Excavator vs Standard Mining Quarries'}</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono border-collapse border border-[#2a2f3b]">
            <thead>
              <tr className="bg-[#0c0d10] text-gray-400 uppercase border-b border-[#2a2f3b]">
                <th className="p-3 border-r border-[#2a2f3b]">{lang === 'ru' ? 'Объект Добычи' : 'Mining Facility'}</th>
                <th className="p-3 border-r border-[#2a2f3b]">{lang === 'ru' ? 'Расход Дизеля' : 'Diesel Rate'}</th>
                <th className="p-3 border-r border-[#2a2f3b]">МВК (HQM) / {dieselCount} Diesel</th>
                <th className="p-3 border-r border-[#2a2f3b]">Сера / {dieselCount} Diesel</th>
                <th className="p-3 border-r border-[#2a2f3b]">Металл / {dieselCount} Diesel</th>
                <th className="p-3">{lang === 'ru' ? 'Безопасность / Pk' : 'Safety / Pk'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a2f3b] text-gray-200">
              <tr className="bg-[#1c202b]">
                <td className="p-3 font-bold text-amber-400 border-r border-[#2a2f3b]">
                  {lang === 'ru' ? 'Гигантский Экскаватор' : 'Giant Excavator'}
                </td>
                <td className="p-3 border-r border-[#2a2f3b]">1 Diesel / 2 мин</td>
                <td className="p-3 text-emerald-400 font-bold border-r border-[#2a2f3b]">{(dieselCount * 100 * serverRate).toLocaleString()}</td>
                <td className="p-3 text-amber-300 font-bold border-r border-[#2a2f3b]">{(dieselCount * 2000 * serverRate).toLocaleString()}</td>
                <td className="p-3 text-gray-300 font-bold border-r border-[#2a2f3b]">{(dieselCount * 10000 * serverRate).toLocaleString()}</td>
                <td className="p-3 text-red-400 font-bold">{lang === 'ru' ? 'Опасно (Сигнал на всю карту)' : 'High Risk (Radio signal)'}</td>
              </tr>
              <tr className="bg-[#0c0d10]">
                <td className="p-3 font-bold text-white border-r border-[#2a2f3b]">
                  {lang === 'ru' ? 'HQM Карьер (HQM Quarry)' : 'HQM Quarry'}
                </td>
                <td className="p-3 border-r border-[#2a2f3b]">1 Diesel / 2.5 мин</td>
                <td className="p-3 text-emerald-400 font-bold border-r border-[#2a2f3b]">{(dieselCount * 30 * serverRate).toLocaleString()}</td>
                <td className="p-3 text-gray-500 border-r border-[#2a2f3b]">0</td>
                <td className="p-3 text-gray-300 border-r border-[#2a2f3b]">{(dieselCount * 1000 * serverRate).toLocaleString()}</td>
                <td className="p-3 text-amber-400">{lang === 'ru' ? 'Забор / Замок' : 'Fenced Base'}</td>
              </tr>
              <tr className="bg-[#14171e]">
                <td className="p-3 font-bold text-white border-r border-[#2a2f3b]">
                  {lang === 'ru' ? 'Серный Карьер (Sulfur Quarry)' : 'Sulfur Quarry'}
                </td>
                <td className="p-3 border-r border-[#2a2f3b]">1 Diesel / 2.5 мин</td>
                <td className="p-3 text-gray-500 border-r border-[#2a2f3b]">0</td>
                <td className="p-3 text-amber-300 font-bold border-r border-[#2a2f3b]">{(dieselCount * 1000 * serverRate).toLocaleString()}</td>
                <td className="p-3 text-gray-500 border-r border-[#2a2f3b]">0</td>
                <td className="p-3 text-amber-400">{lang === 'ru' ? 'Забор / Замок' : 'Fenced Base'}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Guide: Where to find Diesel Fuel & CCTV */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 bg-[#14171e] border border-[#2a2f3b] p-4 space-y-3">
          <h4 className="text-xs font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2 border-b border-[#2a2f3b] pb-2">
            <Fuel size={14} className="text-[#cd412b]" />
            <span>{lang === 'ru' ? 'Где искать Дизельное Топливо (Diesel Fuel):' : 'Where to Find Diesel Fuel:'}</span>
          </h4>

          <div className="space-y-2">
            {DIESEL_LOCATIONS.map((loc, i) => (
              <div key={i} className="bg-[#0c0d10] border border-[#2a2f3b] p-2.5 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-white font-sans">{loc.name[lang]}</p>
                  <p className="text-[10px] text-gray-400 font-sans">{loc.note[lang]}</p>
                </div>
                <div className="text-right font-mono">
                  <span className="text-amber-400 font-bold block">{loc.count}</span>
                  <span className="text-[10px] text-gray-500">{loc.risk[lang]}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-6 bg-[#14171e] border border-[#2a2f3b] p-4 space-y-3">
          <h4 className="text-xs font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2 border-b border-[#2a2f3b] pb-2">
            <AlertTriangle size={14} className="text-amber-400" />
            <span>{lang === 'ru' ? 'Советы по зачистке Экскаватора:' : 'Giant Excavator Defense Guide:'}</span>
          </h4>

          <ul className="list-disc list-inside space-y-2 text-xs text-gray-300 leading-relaxed font-sans">
            <li>
              <strong className="text-white font-mono">Радиовещание:</strong> {lang === 'ru' ? 'При включении Экскаватора по всей карте передается радиосигнал! Соседние кланы сразу поймут что монумент запущен.' : 'Activating Excavator sends an automated radio alert across the entire map! Nearby clans will hear it.'}
            </li>
            <li>
              <strong className="text-white font-mono">CCTV Камеры:</strong> {lang === 'ru' ? 'Используйте коды EXCAVATOR1 и EXCAVATOR2 на компьютерной станции для мониторинга выходов.' : 'Use EXCAVATOR1 & EXCAVATOR2 on Computer Station to watch bucket wheel drop points.'}
            </li>
            <li>
              <strong className="text-white font-mono">Ученые (Scientists):</strong> {lang === 'ru' ? 'На монументе заспавнено около 12-15 Ученых с LR-300 и MP5. Берите минимум медикаменты и броню 30%+' : '12-15 heavy scientists spawn armed with LR-300s. Bring 30%+ projectile protection.'}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
