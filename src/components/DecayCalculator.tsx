import { useState, useEffect } from 'react';
import { APP_VERSION } from '../types';
import { 
  ShieldAlert, 
  Clock, 
  HelpCircle, 
  Flame, 
  AlertTriangle, 
  Info,
  ChevronRight,
  Heart,
  TrendingDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Gorgeous custom SVGs for materials to match the professional Rusty.Lub style
const WoodIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]">
    <rect x="10" y="15" width="80" height="70" rx="4" fill="#854d0e" stroke="#451a03" strokeWidth="3" />
    <line x1="10" y1="35" x2="90" y2="35" stroke="#451a03" strokeWidth="3" />
    <line x1="10" y1="55" x2="90" y2="55" stroke="#451a03" strokeWidth="3" />
    <line x1="10" y1="75" x2="90" y2="75" stroke="#451a03" strokeWidth="3" />
    <path d="M25,25 Q45,28 35,45" stroke="#a16207" strokeWidth="2" fill="none" />
    <path d="M70,45 Q50,48 60,65" stroke="#78350f" strokeWidth="2" fill="none" />
  </svg>
);

const StoneIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]">
    <rect x="10" y="10" width="80" height="80" rx="6" fill="#4b5563" stroke="#1f2937" strokeWidth="4" />
    <rect x="20" y="20" width="30" height="25" rx="2" fill="#6b7280" stroke="#1f2937" strokeWidth="2" />
    <rect x="55" y="20" width="25" height="25" rx="2" fill="#374151" stroke="#1f2937" strokeWidth="2" />
    <rect x="20" y="55" width="25" height="25" rx="2" fill="#374151" stroke="#1f2937" strokeWidth="2" />
    <rect x="50" y="55" width="30" height="25" rx="2" fill="#6b7280" stroke="#1f2937" strokeWidth="2" />
  </svg>
);

const MetalIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]">
    <rect x="10" y="10" width="80" height="80" fill="#334155" stroke="#0f172a" strokeWidth="4" />
    <line x1="26" y1="10" x2="26" y2="90" stroke="#1e293b" strokeWidth="2" />
    <line x1="42" y1="10" x2="42" y2="90" stroke="#1e293b" strokeWidth="2" />
    <line x1="58" y1="10" x2="58" y2="90" stroke="#1e293b" strokeWidth="2" />
    <line x1="74" y1="10" x2="74" y2="90" stroke="#1e293b" strokeWidth="2" />
    <path d="M15,20 L35,45" stroke="#92400e" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
    <path d="M50,60 L75,85" stroke="#b45309" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
  </svg>
);

const ArmoredIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]">
    <rect x="10" y="10" width="80" height="80" rx="4" fill="#1e293b" stroke="#ca8a04" strokeWidth="4" />
    <rect x="22" y="22" width="56" height="56" fill="#0f172a" stroke="#ca8a04" strokeWidth="2" />
    <circle cx="22" cy="22" r="3.5" fill="#ca8a04" />
    <circle cx="78" cy="22" r="3.5" fill="#ca8a04" />
    <circle cx="22" cy="78" r="3.5" fill="#ca8a04" />
    <circle cx="78" cy="78" r="3.5" fill="#ca8a04" />
    <line x1="30" y1="35" x2="70" y2="35" stroke="#475569" strokeWidth="3" />
    <line x1="30" y1="50" x2="70" y2="50" stroke="#475569" strokeWidth="3" />
    <line x1="30" y1="65" x2="70" y2="65" stroke="#475569" strokeWidth="3" />
  </svg>
);

const TwigsIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]">
    <line x1="15" y1="20" x2="85" y2="80" stroke="#a16207" strokeWidth="5" strokeLinecap="round" />
    <line x1="85" y1="20" x2="15" y2="80" stroke="#a16207" strokeWidth="5" strokeLinecap="round" />
    <line x1="10" y1="50" x2="90" y2="50" stroke="#854d0e" strokeWidth="4" strokeLinecap="round" />
    <line x1="50" y1="10" x2="50" y2="90" stroke="#854d0e" strokeWidth="4" strokeLinecap="round" />
  </svg>
);

interface MaterialInfo {
  id: 'twigs' | 'wood' | 'stone' | 'metal' | 'armored';
  nameRU: string;
  nameEN: string;
  decayTime: number; // in hours
  maxHp: number;
  resourceNameRU: string;
  resourceNameEN: string;
  icon: React.ReactNode;
}

const materialsData: MaterialInfo[] = [
  {
    id: 'twigs',
    nameRU: 'Солома (Ветки)',
    nameEN: 'Twigs',
    decayTime: 1,
    maxHp: 10,
    resourceNameRU: 'Дерево',
    resourceNameEN: 'Wood',
    icon: <TwigsIcon size={24} />
  },
  {
    id: 'wood',
    nameRU: 'Дерево',
    nameEN: 'Wood',
    decayTime: 3,
    maxHp: 250,
    resourceNameRU: 'Дерево',
    resourceNameEN: 'Wood',
    icon: <WoodIcon size={24} />
  },
  {
    id: 'stone',
    nameRU: 'Камень',
    nameEN: 'Stone',
    decayTime: 4,
    maxHp: 500,
    resourceNameRU: 'Камень',
    resourceNameEN: 'Stone',
    icon: <StoneIcon size={24} />
  },
  {
    id: 'metal',
    nameRU: 'Листовой металл',
    nameEN: 'Sheet Metal',
    decayTime: 8,
    maxHp: 1000,
    resourceNameRU: 'Фрагменты металла',
    resourceNameEN: 'Metal Fragments',
    icon: <MetalIcon size={24} />
  },
  {
    id: 'armored',
    nameRU: 'Броня (МВК)',
    nameEN: 'Armored (HQM)',
    decayTime: 12,
    maxHp: 2000,
    resourceNameRU: 'МВК (HQM)',
    resourceNameEN: 'High Quality Metal',
    icon: <ArmoredIcon size={24} />
  }
];

export default function DecayCalculator({ lang }: { lang: 'ru' | 'en' }) {
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialInfo>(materialsData[2]); // Default to Stone
  const [currentHp, setCurrentHp] = useState<number>(materialsData[2].maxHp);

  // Sync current HP when material tier changes
  const handleMaterialChange = (material: MaterialInfo) => {
    setSelectedMaterial(material);
    setCurrentHp(material.maxHp);
  };

  const currentPercent = selectedMaterial.maxHp > 0 
    ? Math.round((currentHp / selectedMaterial.maxHp) * 100) 
    : 0;

  // Remaining time in hours
  const remainingHours = (currentHp / selectedMaterial.maxHp) * selectedMaterial.decayTime;

  // Rate calculations
  const hpLossPerHour = selectedMaterial.maxHp / selectedMaterial.decayTime;
  const hpLossPerMin = hpLossPerHour / 60;

  const formatHours = (h: number) => {
    if (h === 0) return lang === 'ru' ? 'Разрушено' : 'Destroyed';
    const totalMinutes = Math.round(h * 60);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    const parts = [];
    if (hours > 0) {
      parts.push(lang === 'ru' ? `${hours} ч.` : `${hours} h.`);
    }
    if (minutes > 0 || hours === 0) {
      parts.push(lang === 'ru' ? `${minutes} м.` : `${minutes} m.`);
    }

    return parts.join(' ');
  };

  const handleSliderChange = (percent: number) => {
    const hp = Math.round((percent / 100) * selectedMaterial.maxHp);
    setCurrentHp(hp);
  };

  const handleHpInputChange = (val: number) => {
    const clamped = Math.max(0, Math.min(selectedMaterial.maxHp, val || 0));
    setCurrentHp(clamped);
  };

  const applyPreset = (percent: number) => {
    const hp = Math.round((percent / 100) * selectedMaterial.maxHp);
    setCurrentHp(hp);
  };

  return (
    <div className="space-y-6">
      {/* Header with quick instructions */}
      <div className="bg-[#14171e]/90 p-5 rounded-none border border-[#2a2f3b] flex flex-col sm:flex-row justify-between items-center gap-4 shadow-xl relative overflow-hidden">
        <div className="rust-bracket-tl" />
        <div className="rust-bracket-tr" />
        <div className="rust-bracket-bl" />
        <div className="rust-bracket-br" />

        <div className="flex items-center gap-3">
          <span className="p-2.5 bg-[#cd412b]/10 border border-[#cd412b]/30">
            <Clock size={20} className="text-[#cd412b] animate-pulse" />
          </span>
          <div>
            <h2 className="text-sm font-black text-white uppercase tracking-wider font-mono">
              {lang === 'ru' ? 'КАЛЬКУЛЯТОР ГНИЕНИЯ ПОСТРОЕК' : 'DECAY TIME CALCULATOR'}
            </h2>
            <p className="text-[10px] text-zinc-500 font-mono mt-0.5 uppercase">
              {lang === 'ru' 
                ? 'Узнайте точное время до обрушения стены или фундамента при отсутствии ресурсов в шкафу' 
                : 'Find out the exact remaining duration before structure collapse when TC is empty'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-zinc-500 font-mono uppercase">
          <span className="bg-zinc-800/40 px-2 py-0.5 border border-zinc-800 text-[10px]">RUST {APP_VERSION}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left Column: Input Panel */}
        <div className="xl:col-span-8 space-y-6">
          <div className="bg-[#14171e]/90 p-5 rounded-none border border-[#2a2f3b] space-y-6 relative overflow-hidden">
            <div className="rust-bracket-tl" />
            <div className="rust-bracket-tr" />
            <div className="rust-bracket-bl" />
            <div className="rust-bracket-br" />

            <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#cd412b]" />

            {/* Material Selector Row */}
            <div className="space-y-3">
              <label className="text-[10px] font-mono font-black text-zinc-400 uppercase tracking-widest block">
                {lang === 'ru' ? 'Выберите материал постройки:' : 'Select Structure Material:'}
              </label>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {materialsData.map((mat) => {
                  const isSelected = selectedMaterial.id === mat.id;
                  return (
                    <button
                      key={mat.id}
                      onClick={() => handleMaterialChange(mat)}
                      className={`p-3 border flex flex-col items-center justify-center gap-2 transition-all relative group cursor-pointer ${
                        isSelected
                          ? 'bg-[#cd412b]/10 border-[#cd412b] text-white shadow-[inset_0_0_15px_rgba(205,65,43,0.15)]'
                          : 'bg-[#1b1e26] border-[#2a2f3b] hover:border-zinc-500 text-zinc-400 hover:text-white'
                      }`}
                    >
                      <span className={`p-1.5 rounded-none border transition-all ${
                        isSelected ? 'bg-black/40 border-[#cd412b]/50' : 'bg-black/20 border-zinc-800'
                      }`}>
                        {mat.icon}
                      </span>
                      <span className="text-[10px] font-bold font-mono uppercase tracking-wider text-center">
                        {lang === 'ru' ? mat.nameRU : mat.nameEN}
                      </span>
                      <span className="text-[8px] font-mono text-zinc-500 mt-0.5 block">
                        {mat.maxHp} HP
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Durability HP Input & Slider Row */}
            <div className="space-y-4 pt-2 border-t border-zinc-800/50">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <label className="text-[10px] font-mono font-black text-zinc-400 uppercase tracking-widest block">
                    {lang === 'ru' ? 'Прочность конструкции (HP):' : 'Structure Durability (HP):'}
                  </label>
                  <p className="text-[9px] text-zinc-500 font-mono uppercase">
                    {lang === 'ru' ? 'Перетащите ползунок или укажите точное здоровье' : 'Drag slider or type exact numeric durability health'}
                  </p>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <input
                    type="number"
                    min="0"
                    max={selectedMaterial.maxHp}
                    value={currentHp}
                    onChange={(e) => handleHpInputChange(parseInt(e.target.value) || 0)}
                    className="w-24 bg-[#0c0d10] border border-[#2a2f3b] py-1.5 px-2.5 font-mono text-xs text-white outline-none focus:border-[#cd412b]/50 text-center"
                  />
                  <span className="text-xs font-bold font-mono text-zinc-500 uppercase">
                    / {selectedMaterial.maxHp} HP
                  </span>
                </div>
              </div>

              {/* Slider Controller */}
              <div className="bg-[#1b1e26] p-4 border border-[#2a2f3b] space-y-4">
                <div className="relative pt-1">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={currentPercent}
                    onChange={(e) => handleSliderChange(parseInt(e.target.value) || 0)}
                    className="w-full h-1.5 bg-[#0c0d10] border border-zinc-800 rounded-none appearance-none cursor-pointer accent-[#cd412b]"
                  />
                </div>

                <div className="flex justify-between text-[9px] font-mono text-zinc-500 uppercase">
                  <span>0% ({lang === 'ru' ? 'Разрушено' : 'Collapsed'})</span>
                  <span className="text-glow-amber text-zinc-300 font-bold">{currentPercent}% HP ({currentHp} HP)</span>
                  <span>100% ({lang === 'ru' ? 'Целое' : 'Pristine'})</span>
                </div>
              </div>

              {/* Quick Presets Buttons */}
              <div className="flex flex-wrap gap-2 pt-1">
                <span className="text-[9px] font-mono text-zinc-500 uppercase self-center mr-1">
                  {lang === 'ru' ? 'Пресеты здоровья:' : 'Durability Presets:'}
                </span>
                {[100, 75, 50, 25, 10].map((percent) => (
                  <button
                    key={percent}
                    onClick={() => applyPreset(percent)}
                    className="px-2.5 py-1 bg-[#1b1e26] hover:bg-zinc-800 border border-[#2a2f3b] hover:border-zinc-500 text-zinc-400 hover:text-white font-mono text-[10px] font-black cursor-pointer transition-all"
                  >
                    {percent}%
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Calculations Diagnostic */}
        <div className="xl:col-span-4 space-y-6">
          <div className="bg-[#14171e]/90 p-5 rounded-none border border-[#2a2f3b] relative overflow-hidden space-y-5 shadow-xl">
            <div className="rust-bracket-tl" />
            <div className="rust-bracket-tr" />
            <div className="rust-bracket-bl" />
            <div className="rust-bracket-br" />

            <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#cd412b]" />

            <h3 className="text-xs font-bold text-white uppercase tracking-widest border-b border-[#2a2f3b] pb-2 flex items-center gap-1.5 font-mono">
              <ShieldAlert size={14} className="text-[#cd412b] animate-pulse" />
              <span>{lang === 'ru' ? 'ДИАГНОСТИКА РАЗРУШЕНИЯ' : 'DECAY LIFETIME ESTIMATE'}</span>
            </h3>

            {/* Display Countdown Timer */}
            <div className="p-5 bg-zinc-900/90 border border-zinc-800 text-center relative overflow-hidden">
              <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                {lang === 'ru' ? 'Конструкция полностью сгниет за:' : 'Structure collapses in:'}
              </div>
              <div className={`text-3xl font-black font-mono mt-2 tracking-tight ${
                currentHp === 0 
                  ? 'text-red-500 text-glow-red' 
                  : remainingHours <= (selectedMaterial.decayTime * 0.2)
                    ? 'text-red-500 text-glow-red animate-pulse'
                    : remainingHours <= (selectedMaterial.decayTime * 0.5)
                      ? 'text-amber-500'
                      : 'text-emerald-400'
              }`}>
                {currentHp === 0 ? (
                  lang === 'ru' ? 'РАЗРУШЕНО' : 'COLLAPSED'
                ) : (
                  formatHours(remainingHours)
                )}
              </div>

              {/* Progress bar visual indicator */}
              <div className="mt-4 h-1.5 w-full bg-black border border-zinc-800 relative overflow-hidden">
                <motion.div
                  className={`h-full ${
                    currentPercent <= 20 
                      ? 'bg-red-500 shadow-[0_0_10px_#ef4444]' 
                      : currentPercent <= 50 
                        ? 'bg-amber-500' 
                        : 'bg-emerald-400'
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${currentPercent}%` }}
                  transition={{ duration: 0.2 }}
                />
              </div>

              {currentHp > 0 && currentPercent <= 20 && (
                <div className="mt-3 text-[9px] font-mono font-bold text-red-400 bg-red-950/20 border border-red-900/30 py-1 uppercase tracking-wider flex items-center justify-center gap-1">
                  <AlertTriangle size={10} />
                  {lang === 'ru' ? 'КРИТИЧЕСКИЙ УРОВЕНЬ ПРОЧНОСТИ!' : 'CRITICAL WALL INTEGRITY STATUS!'}
                </div>
              )}
            </div>

            {/* Detailed Stats Block */}
            <div className="space-y-3.5 pt-1">
              <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block border-b border-zinc-800/60 pb-1 flex items-center gap-1">
                <Info size={11} className="text-[#cd412b]" />
                <span>{lang === 'ru' ? 'ХАРАКТЕРИСТИКИ ГНИЕНИЯ' : 'DECAY RATE PARAMETERS'}</span>
              </div>

              <div className="space-y-2.5">
                {/* Max decay time */}
                <div className="flex items-center justify-between p-2.5 bg-black/40 border border-[#2a2f3b] text-xs font-mono">
                  <span className="text-zinc-500 text-[10px] uppercase">{lang === 'ru' ? 'Базовое время (100%):' : 'Full Decay Time:'}</span>
                  <span className="text-zinc-300 font-bold">{selectedMaterial.decayTime} {lang === 'ru' ? 'ч.' : 'hrs'}</span>
                </div>

                {/* HP loss per hour */}
                <div className="flex items-center justify-between p-2.5 bg-black/40 border border-[#2a2f3b] text-xs font-mono">
                  <span className="text-zinc-500 text-[10px] uppercase">{lang === 'ru' ? 'Скорость в час:' : 'Loss per hour:'}</span>
                  <span className="text-amber-500 font-black">-{hpLossPerHour.toFixed(1)} HP</span>
                </div>

                {/* HP loss per minute */}
                <div className="flex items-center justify-between p-2.5 bg-black/40 border border-[#2a2f3b] text-xs font-mono">
                  <span className="text-zinc-500 text-[10px] uppercase">{lang === 'ru' ? 'Скорость в минуту:' : 'Loss per minute:'}</span>
                  <span className="text-amber-600 font-bold">-{hpLossPerMin.toFixed(2)} HP</span>
                </div>

                {/* Resource needed */}
                <div className="flex items-center justify-between p-2.5 bg-black/40 border border-[#2a2f3b] text-xs font-mono">
                  <span className="text-zinc-500 text-[10px] uppercase">{lang === 'ru' ? 'Ресурс защиты:' : 'Required Resource:'}</span>
                  <span className="text-zinc-300 font-bold uppercase">{lang === 'ru' ? selectedMaterial.resourceNameRU : selectedMaterial.resourceNameEN}</span>
                </div>
              </div>
            </div>

            {/* Context/Lore Footnote */}
            <div className="text-[8.5px] font-mono text-zinc-600 bg-black/20 p-2.5 border border-zinc-900 leading-normal">
              {lang === 'ru' ? (
                `Гниение (Decay) в Rust — автоматический процесс разрушения элементов базы, находящихся снаружи или при пустом шкафу. Износ идет непрерывно изнутри наружу.`
              ) : (
                `Decay in Rust is a server-wide automated erosion mechanism that slowly consumes structures from the inside out when required upkeep materials are depleted or absent in the Tool Cupboard.`
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
