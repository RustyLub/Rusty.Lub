import { useState } from 'react';
import { Copy, Settings, Zap, Cpu, Monitor, Sliders, Info } from 'lucide-react';
import { motion } from 'motion/react';
import { fpsTranslationMap } from '../translations';

interface FpsTabProps {
  onCopy: (text: string) => void;
  lang: 'ru' | 'en';
}

export default function FpsTab({ onCopy, lang }: FpsTabProps) {
  const [ramSize, setRamSize] = useState<number>(16);

  // Calculate optimized values based on selected RAM size
  const calculateParams = (ram: number) => {
    const memMb = ram * 1024;
    let gcBuffer = 4096;
    if (ram <= 8) gcBuffer = 1024;
    else if (ram <= 12) gcBuffer = 2048;
    else if (ram <= 16) gcBuffer = 4096;
    else gcBuffer = 8192;

    return `-window-mode exclusive -high -maxMem=${memMb} -malloc=system -force-feature-level-11-0 -gc.buffer ${gcBuffer}`;
  };

  const generatedParams = calculateParams(ramSize);

  const f1Commands = [
    {
      cmd: 'graphics.shadowmode 0',
      desc: lang === 'en' ? 'Disable dynamic shadows completely' : 'Полное отключение динамических теней',
      impact: lang === 'en' ? 'Up to +15% FPS' : 'До +15% FPS',
      reason: lang === 'en' ? 'Shadows in Rust consume huge amounts of CPU and GPU rendering throughput.' : 'Тени в Rust отнимают огромное количество вычислительной мощности видеокарты и процессора.'
    },
    {
      cmd: 'global.freezes 0',
      desc: lang === 'en' ? 'Disable UI frame freezes' : 'Отключение системного замерзания интерфейса',
      impact: lang === 'en' ? 'Prevents freezes' : 'Убирает фризы',
      reason: lang === 'en' ? 'Prevents micro-stutters during heavy combat action scenes or raw asset streaming.' : 'Предотвращает мелкие зависания игры во время резких экшн-сцен или загрузки элементов окружения.'
    },
    {
      cmd: 'client.lookatradius 0',
      desc: lang === 'en' ? 'Optimize interactive object hover radius' : 'Ускорение рендеринга объектов при наведении',
      impact: lang === 'en' ? 'Up to +5% FPS' : 'До +5% FPS',
      reason: lang === 'en' ? 'Reduces the precision trace sphere for looking at objects, saving valuable CPU cycles.' : 'Уменьшает радиус детальной прорисовки объектов перед глазами, снижая нагрузку на процессор.'
    },
    {
      cmd: 'physics.steps 60',
      desc: lang === 'en' ? 'Sync physics engine rate with tickrate' : 'Синхронизация физического движка с частотой сервера',
      impact: lang === 'en' ? 'Stability' : 'Стабильность',
      reason: lang === 'en' ? 'Enables smoother traversal over terrain obstacles, climbing, and eliminates rubberbanding.' : 'Помогает плавнее преодолевать преграды, паркурить и избавляет от телепортаций назад.'
    },
    {
      cmd: 'grass.displacement 0',
      desc: lang === 'en' ? 'Disable grass bending on footsteps' : 'Отключение приминания травы ногами',
      impact: lang === 'en' ? 'Up to +3% FPS' : 'До +3% FPS',
      reason: lang === 'en' ? 'Grass blades will no longer run dynamic collision calculations against players.' : 'Трава больше не будет динамически рассчитывать коллизию с моделями игроков.'
    },
    {
      cmd: 'decor.quality 0',
      desc: lang === 'en' ? 'Decorative ground details quality' : 'Качество декораций (мелкие камушки, кусты)',
      impact: lang === 'en' ? 'Up to +7% FPS' : 'До +7% FPS',
      reason: lang === 'en' ? 'Disables rendering of millions of microscopic stones, sticks, and ground clutter.' : 'Отключает рендеринг миллионов мелких бесполезных 3D-объектов на земле.'
    },
    {
      cmd: 'playercull.enabled true',
      desc: lang === 'en' ? 'Enable distance player model culling' : 'Включение скрытия дальних моделей игроков',
      impact: lang === 'en' ? 'Up to +10% FPS' : 'До +10% FPS',
      reason: lang === 'en' ? 'Stops rendering players that are far outside your visual sector or obscured by landscape.' : 'Игра перестает рендерить игроков, находящихся вне вашего поля зрения или слишком далеко.'
    },
    {
      cmd: 'playercull.maxdist 50',
      desc: lang === 'en' ? 'Reduce hidden player render distance' : 'Уменьшение дистанции прорисовки невидимых игроков',
      impact: lang === 'en' ? 'CPU Optimization' : 'Оптимизация ЦП',
      reason: lang === 'en' ? 'Combined with playercull, significantly minimizes CPU frame-time spikes during large raid encounters.' : 'В связке с playercull убирает лаги в крупных клановых баталиях на рейде.'
    }
  ];

  const windowsTweaks = [
    {
      title: fpsTranslationMap.windowsTweak1Title[lang],
      desc: fpsTranslationMap.windowsTweak1Desc[lang]
    },
    {
      title: fpsTranslationMap.windowsTweak2Title[lang],
      desc: fpsTranslationMap.windowsTweak2Desc[lang]
    },
    {
      title: fpsTranslationMap.windowsTweak3Title[lang],
      desc: fpsTranslationMap.windowsTweak3Desc[lang]
    }
  ];

  return (
    <div className="space-y-4">
      {/* Intro Header */}
      <div className="bg-[#14171e] p-4 border border-[#2a2f3b] flex items-center gap-4">
        <Settings size={24} className="text-[#cd412b]" />
        <div className="space-y-1">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            {fpsTranslationMap.title[lang]}
          </h2>
          <p className="text-xs text-gray-400">
            {fpsTranslationMap.desc[lang]}
          </p>
        </div>
      </div>

      {/* Launcher Parameters Generator */}
      <div className="bg-[#14171e] border border-[#2a2f3b] p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Sliders className="text-[#cd412b]" size={16} />
          <h3 className="text-xs font-bold text-white uppercase">
            {fpsTranslationMap.generatorTitle[lang]}
          </h3>
        </div>

        <p className="text-xs text-gray-400">
          {fpsTranslationMap.generatorDesc[lang]}
        </p>

        {/* RAM Selector Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {[8, 12, 16, 24, 32, 64].map((size) => (
            <button
              key={size}
              onClick={() => setRamSize(size)}
              className={`p-2 border text-center transition-all ${
                ramSize === size
                  ? 'bg-[#cd412b] border-[#cd412b] text-white'
                  : 'bg-[#1b1e26] border-[#2a2f3b] text-gray-400 hover:text-white hover:border-gray-500'
              }`}
            >
              <div className="text-xs font-bold">{size} GB</div>
              <div className="text-[9px] uppercase mt-1 text-inherit/60">{fpsTranslationMap.ramLabel[lang]}</div>
            </button>
          ))}
        </div>

        {/* Generated Parameters Display */}
        <div className="space-y-2">
          <div className="text-[10px] font-bold text-gray-500 uppercase">
            {fpsTranslationMap.generatedLabel[lang]}
          </div>
          <div
            onClick={() => onCopy(generatedParams)}
            className="group relative bg-[#0c0d10] border border-[#2a2f3b] p-3 cursor-pointer flex items-center justify-between"
          >
            <div className="font-mono text-xs text-[#cd412b] truncate pr-4">
              {generatedParams}
            </div>
            <Copy size={14} className="text-gray-500" />
          </div>
          <div className="text-[10px] text-gray-500 flex items-center gap-2">
            <Info size={12} className="text-[#cd412b]" />
            <span>
              <strong>{fpsTranslationMap.howToInsert[lang]}</strong> {fpsTranslationMap.howToInsertDesc[lang]}
            </span>
          </div>
        </div>
      </div>

      {/* In-Game Console Commands */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Cpu className="text-[#cd412b]" size={16} />
          <h3 className="text-xs font-bold text-white uppercase">
            {fpsTranslationMap.consoleCommandsTitle[lang]}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {f1Commands.map((item) => (
            <div
              key={item.cmd}
              onClick={() => onCopy(item.cmd)}
              className="bg-[#14171e] border border-[#2a2f3b] hover:border-[#cd412b]/50 p-3 cursor-pointer flex flex-col justify-between transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#cd412b] uppercase">{item.desc}</span>
                <span className="text-[9px] bg-[#cd412b]/10 text-[#cd412b] px-1.5 py-0.5 uppercase">
                  {item.impact}
                </span>
              </div>
              <p className="text-[10px] text-gray-400 mb-2 leading-relaxed">
                {item.reason}
              </p>
              <div className="bg-[#0c0d10] p-2 text-[10px] font-mono text-[#cd412b] truncate">
                {item.cmd}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Windows & Hardware Tweaks */}
      <div className="bg-[#14171e] border border-[#2a2f3b] p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Monitor className="text-[#cd412b]" size={16} />
          <h3 className="text-xs font-bold text-white uppercase">
            {fpsTranslationMap.windowsTitle[lang]}
          </h3>
        </div>

        <div className="space-y-2">
          {windowsTweaks.map((tweak, i) => (
            <div key={i} className="flex gap-3 items-start bg-[#1b1e26] p-3 border border-[#2a2f3b]">
              <div className="w-5 h-5 bg-[#cd412b]/10 text-[#cd412b] font-mono text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                {i + 1}
              </div>
              <div className="space-y-0.5">
                <h4 className="text-[11px] font-bold text-white uppercase">{tweak.title}</h4>
                <p className="text-[10px] text-gray-400">{tweak.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
