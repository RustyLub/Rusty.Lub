import React, { useState } from 'react';
import { 
  Crosshair, 
  Eye, 
  Sliders, 
  Layers, 
  Clock, 
  ShieldAlert, 
  Sparkles, 
  Copy, 
  Check, 
  Play, 
  Radio, 
  Monitor, 
  Zap,
  RotateCcw,
  Sun,
  Moon,
  Compass
} from 'lucide-react';

interface LauncherOverlayTabProps {
  lang: 'ru' | 'en';
  appTheme: 'light' | 'dark';
  onOpenOverlayModal: () => void;
  onToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export const LauncherOverlayTab: React.FC<LauncherOverlayTabProps> = ({
  lang,
  appTheme,
  onOpenOverlayModal,
  onToast
}) => {
  const isLight = appTheme === 'light';

  // Crosshair state
  const [crosshairType, setCrosshairType] = useState<'dot' | 'cross' | 'circle' | 'dot_circle' | 't_shape'>('cross');
  const [crosshairColor, setCrosshairColor] = useState<string>('#00ff66');
  const [crosshairSize, setCrosshairSize] = useState<number>(14);
  const [crosshairThickness, setCrosshairThickness] = useState<number>(2);
  const [crosshairGap, setCrosshairGap] = useState<number>(4);
  const [crosshairOpacity, setCrosshairOpacity] = useState<number>(1);
  const [previewBg, setPreviewBg] = useState<'day' | 'night' | 'monument'>('day');
  const [copiedF1, setCopiedF1] = useState(false);

  // Overlay widget toggles
  const [showRaidAlarm, setShowRaidAlarm] = useState(true);
  const [showOilrigTimer, setShowOilrigTimer] = useState(true);
  const [showCargoTimer, setShowCargoTimer] = useState(true);
  const [showFpsCounter, setShowFpsCounter] = useState(true);
  const [hotkey, setHotkey] = useState('Alt + O');

  // Predefined colors
  const colorPalette = [
    { name: 'Neon Green', hex: '#00ff66' },
    { name: 'Laser Red', hex: '#ff2244' },
    { name: 'Cyber Cyan', hex: '#00e5ff' },
    { name: 'Rust Orange', hex: '#ff7700' },
    { name: 'Bright Yellow', hex: '#ffe600' },
    { name: 'Clean White', hex: '#ffffff' },
    { name: 'Neon Purple', hex: '#cc00ff' },
  ];

  const handleCopyF1Crosshair = () => {
    const cmd = `crosshair.enabled 1; crosshair.color "${crosshairColor}"; crosshair.size ${crosshairSize}`;
    navigator.clipboard.writeText(cmd);
    setCopiedF1(true);
    onToast(lang === 'ru' ? 'F1 команда прицела скопирована!' : 'F1 crosshair command copied!', 'success');
    setTimeout(() => setCopiedF1(false), 2000);
  };

  const handleResetCrosshair = () => {
    setCrosshairType('cross');
    setCrosshairColor('#00ff66');
    setCrosshairSize(14);
    setCrosshairThickness(2);
    setCrosshairGap(4);
    setCrosshairOpacity(1);
    onToast(lang === 'ru' ? 'Параметры прицела сброшены' : 'Crosshair settings reset', 'info');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 font-sans">
      {/* Top Banner */}
      <div className="relative rounded-2xl p-6 sm:p-8 overflow-hidden border border-red-600/40 bg-gradient-to-r from-[#0b0e14] via-[#141824] to-[#1c0f0f] shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="rust-bracket-tl" />
        <div className="rust-bracket-tr" />
        <div className="rust-bracket-bl" />
        <div className="rust-bracket-br" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-mono font-bold uppercase tracking-wider">
              <Crosshair size={14} className="text-red-500 animate-spin-slow" />
              <span>{lang === 'ru' ? 'ТАКТИЧЕСКИЙ ДИСПЛЕЙ & ОВЕРЛЕЙ' : 'TACTICAL HUD & CROSSHAIR SUITE'}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black font-teko uppercase tracking-wide text-white">
              {lang === 'ru' ? 'Центр Управления HUD Оверлеем' : 'In-Game HUD Overlay Command'}
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-normal">
              {lang === 'ru'
                ? 'Настройка прозрачного наэкранного слоя для игры в Rust: кастомное перекрестие, таймеры монументов и мгновенные сигналы рейдов. Работает поверх игры в режиме Borderless.'
                : 'Configure transparent screen overlays for Rust: custom crosshair, monument respawn timers, and instant raid alert monitors. Seamless Borderless Window support.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              onClick={onOpenOverlayModal}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 transition-all cursor-pointer group"
            >
              <Zap size={16} className="text-amber-300 group-hover:scale-110 transition-transform" />
              <span>{lang === 'ru' ? 'ОТКРЫТЬ HUD ОВЕРЛЕЙ' : 'LAUNCH HUD OVERLAY'}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/40 font-mono text-amber-300">
                {hotkey}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Crosshair Designer + Widgets Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Crosshair Designer (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className={`p-6 rounded-2xl border transition-colors shadow-lg ${
            isLight ? 'bg-white border-neutral-200' : 'bg-[#0a0d14] border-[#1a2233]'
          }`}>
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-red-600/10 text-red-500 border border-red-500/20 flex items-center justify-center">
                  <Crosshair size={18} />
                </div>
                <div>
                  <h3 className="text-base font-black uppercase font-teko tracking-wider text-white">
                    {lang === 'ru' ? 'Конструктор Прицела (Crosshair)' : 'Custom Crosshair Designer'}
                  </h3>
                  <p className="text-[11px] text-neutral-400 font-mono">
                    {lang === 'ru' ? 'Точное прицеливание от бедра из лука и арбалета' : 'Hipfire accuracy for Bows, Crossbows & Revolvers'}
                  </p>
                </div>
              </div>

              <button
                onClick={handleResetCrosshair}
                className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
                title={lang === 'ru' ? 'Сбросить прицел' : 'Reset Crosshair'}
              >
                <RotateCcw size={14} />
              </button>
            </div>

            {/* Interactive Preview Canvas */}
            <div className="mt-5 space-y-3">
              <div className="flex items-center justify-between text-xs text-neutral-400">
                <span className="font-mono text-[11px] uppercase">
                  {lang === 'ru' ? 'Предпросмотр на экране:' : 'Screen Preview:'}
                </span>
                <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-lg border border-neutral-800">
                  <button
                    onClick={() => setPreviewBg('day')}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-all ${
                      previewBg === 'day' ? 'bg-amber-500 text-black' : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    {lang === 'ru' ? 'День' : 'Day'}
                  </button>
                  <button
                    onClick={() => setPreviewBg('night')}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-all ${
                      previewBg === 'night' ? 'bg-indigo-600 text-white' : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    {lang === 'ru' ? 'Ночь' : 'Night'}
                  </button>
                  <button
                    onClick={() => setPreviewBg('monument')}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-all ${
                      previewBg === 'monument' ? 'bg-red-600 text-white' : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    {lang === 'ru' ? 'Радгород' : 'Monument'}
                  </button>
                </div>
              </div>

              {/* Viewport Box */}
              <div className={`relative h-64 rounded-xl border-2 border-dashed border-red-500/30 overflow-hidden flex items-center justify-center select-none shadow-inner transition-colors ${
                previewBg === 'day'
                  ? 'bg-gradient-to-b from-[#2e4c63] via-[#486b7f] to-[#6d8a7d]'
                  : previewBg === 'night'
                    ? 'bg-[#03060a]'
                    : 'bg-gradient-to-tr from-[#1b1512] via-[#2f1f1a] to-[#472e22]'
              }`}>
                {/* Distance rangefinder lines overlay */}
                <div className="absolute inset-0 pointer-events-none opacity-20">
                  <div className="w-full h-full border-t border-b border-white/20 top-1/2 -translate-y-1/2 absolute" />
                  <div className="h-full w-full border-l border-r border-white/20 left-1/2 -translate-x-1/2 absolute" />
                </div>

                {/* THE RENDERED CROSSHAIR */}
                <div 
                  style={{ opacity: crosshairOpacity }}
                  className="relative flex items-center justify-center transition-all"
                >
                  {/* DOT */}
                  {crosshairType === 'dot' && (
                    <div 
                      style={{ 
                        width: `${crosshairSize}px`, 
                        height: `${crosshairSize}px`, 
                        backgroundColor: crosshairColor,
                        boxShadow: `0 0 8px ${crosshairColor}`
                      }} 
                      className="rounded-full"
                    />
                  )}

                  {/* STANDARD CROSS */}
                  {crosshairType === 'cross' && (
                    <div className="relative flex items-center justify-center" style={{ width: `${crosshairSize * 2}px`, height: `${crosshairSize * 2}px` }}>
                      {/* Top */}
                      <div 
                        style={{ 
                          width: `${crosshairThickness}px`, 
                          height: `${crosshairSize}px`, 
                          backgroundColor: crosshairColor,
                          top: `-${crosshairGap + crosshairSize / 2}px`,
                          boxShadow: `0 0 6px ${crosshairColor}`
                        }} 
                        className="absolute" 
                      />
                      {/* Bottom */}
                      <div 
                        style={{ 
                          width: `${crosshairThickness}px`, 
                          height: `${crosshairSize}px`, 
                          backgroundColor: crosshairColor,
                          bottom: `-${crosshairGap + crosshairSize / 2}px`,
                          boxShadow: `0 0 6px ${crosshairColor}`
                        }} 
                        className="absolute" 
                      />
                      {/* Left */}
                      <div 
                        style={{ 
                          height: `${crosshairThickness}px`, 
                          width: `${crosshairSize}px`, 
                          backgroundColor: crosshairColor,
                          left: `-${crosshairGap + crosshairSize / 2}px`,
                          boxShadow: `0 0 6px ${crosshairColor}`
                        }} 
                        className="absolute" 
                      />
                      {/* Right */}
                      <div 
                        style={{ 
                          height: `${crosshairThickness}px`, 
                          width: `${crosshairSize}px`, 
                          backgroundColor: crosshairColor,
                          right: `-${crosshairGap + crosshairSize / 2}px`,
                          boxShadow: `0 0 6px ${crosshairColor}`
                        }} 
                        className="absolute" 
                      />
                    </div>
                  )}

                  {/* CIRCLE */}
                  {crosshairType === 'circle' && (
                    <div 
                      style={{ 
                        width: `${crosshairSize * 2}px`, 
                        height: `${crosshairSize * 2}px`, 
                        borderColor: crosshairColor,
                        borderWidth: `${crosshairThickness}px`,
                        boxShadow: `0 0 8px ${crosshairColor}`
                      }} 
                      className="rounded-full border"
                    />
                  )}

                  {/* DOT + CIRCLE */}
                  {crosshairType === 'dot_circle' && (
                    <div className="relative flex items-center justify-center">
                      <div 
                        style={{ 
                          width: `${crosshairThickness * 2}px`, 
                          height: `${crosshairThickness * 2}px`, 
                          backgroundColor: crosshairColor,
                          boxShadow: `0 0 4px ${crosshairColor}`
                        }} 
                        className="rounded-full"
                      />
                      <div 
                        style={{ 
                          width: `${crosshairSize * 2}px`, 
                          height: `${crosshairSize * 2}px`, 
                          borderColor: crosshairColor,
                          borderWidth: `${crosshairThickness}px`,
                          boxShadow: `0 0 8px ${crosshairColor}`
                        }} 
                        className="absolute rounded-full border"
                      />
                    </div>
                  )}

                  {/* T-SHAPE */}
                  {crosshairType === 't_shape' && (
                    <div className="relative flex items-center justify-center" style={{ width: `${crosshairSize * 2}px`, height: `${crosshairSize * 2}px` }}>
                      {/* Bottom */}
                      <div 
                        style={{ 
                          width: `${crosshairThickness}px`, 
                          height: `${crosshairSize}px`, 
                          backgroundColor: crosshairColor,
                          bottom: `-${crosshairGap + crosshairSize / 2}px`,
                          boxShadow: `0 0 6px ${crosshairColor}`
                        }} 
                        className="absolute" 
                      />
                      {/* Left */}
                      <div 
                        style={{ 
                          height: `${crosshairThickness}px`, 
                          width: `${crosshairSize}px`, 
                          backgroundColor: crosshairColor,
                          left: `-${crosshairGap + crosshairSize / 2}px`,
                          boxShadow: `0 0 6px ${crosshairColor}`
                        }} 
                        className="absolute" 
                      />
                      {/* Right */}
                      <div 
                        style={{ 
                          height: `${crosshairThickness}px`, 
                          width: `${crosshairSize}px`, 
                          backgroundColor: crosshairColor,
                          right: `-${crosshairGap + crosshairSize / 2}px`,
                          boxShadow: `0 0 6px ${crosshairColor}`
                        }} 
                        className="absolute" 
                      />
                    </div>
                  )}
                </div>

                {/* Tactical coordinates watermark */}
                <div className="absolute bottom-2 left-3 font-mono text-[9px] text-white/50">
                  FOV_CENTER [X: 960, Y: 540] • SCALE 100%
                </div>
              </div>
            </div>

            {/* Crosshair Controls & Sliders */}
            <div className="mt-6 space-y-4">
              {/* Type Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-300 uppercase tracking-wide">
                  {lang === 'ru' ? 'Тип формы:' : 'Crosshair Style:'}
                </label>
                <div className="grid grid-cols-5 gap-1.5 text-xs font-mono font-bold">
                  {[
                    { id: 'cross', label: 'CROSS' },
                    { id: 'dot', label: 'DOT' },
                    { id: 'circle', label: 'CIRCLE' },
                    { id: 'dot_circle', label: 'DOT+RING' },
                    { id: 't_shape', label: 'T-SHAPE' },
                  ].map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setCrosshairType(s.id as any)}
                      className={`py-2 rounded-lg border uppercase transition-all cursor-pointer ${
                        crosshairType === s.id
                          ? 'bg-red-600 text-white border-red-500 shadow-md shadow-red-600/30'
                          : 'bg-black/30 border-white/10 hover:bg-white/10 text-neutral-400'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Palette */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-300 uppercase tracking-wide">
                  {lang === 'ru' ? 'Цвет прицела:' : 'Crosshair Color:'}
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  {colorPalette.map((c) => (
                    <button
                      key={c.hex}
                      onClick={() => setCrosshairColor(c.hex)}
                      style={{ backgroundColor: c.hex }}
                      className={`w-7 h-7 rounded-lg border-2 transition-transform cursor-pointer ${
                        crosshairColor === c.hex ? 'scale-115 border-white shadow-lg' : 'border-transparent hover:scale-105'
                      }`}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>

              {/* Sliders Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3 bg-black/40 rounded-xl border border-neutral-800 space-y-1">
                  <div className="flex justify-between text-[11px] font-mono text-neutral-400">
                    <span>{lang === 'ru' ? 'Размер:' : 'Size:'}</span>
                    <span className="text-amber-400 font-bold">{crosshairSize}px</span>
                  </div>
                  <input
                    type="range"
                    min="4"
                    max="32"
                    value={crosshairSize}
                    onChange={(e) => setCrosshairSize(parseInt(e.target.value))}
                    className="w-full accent-red-500 cursor-pointer"
                  />
                </div>

                <div className="p-3 bg-black/40 rounded-xl border border-neutral-800 space-y-1">
                  <div className="flex justify-between text-[11px] font-mono text-neutral-400">
                    <span>{lang === 'ru' ? 'Толщина:' : 'Thickness:'}</span>
                    <span className="text-amber-400 font-bold">{crosshairThickness}px</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="6"
                    value={crosshairThickness}
                    onChange={(e) => setCrosshairThickness(parseInt(e.target.value))}
                    className="w-full accent-red-500 cursor-pointer"
                  />
                </div>

                <div className="p-3 bg-black/40 rounded-xl border border-neutral-800 space-y-1">
                  <div className="flex justify-between text-[11px] font-mono text-neutral-400">
                    <span>{lang === 'ru' ? 'Зазор (Gap):' : 'Gap:'}</span>
                    <span className="text-amber-400 font-bold">{crosshairGap}px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="16"
                    value={crosshairGap}
                    onChange={(e) => setCrosshairGap(parseInt(e.target.value))}
                    className="w-full accent-red-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* F1 Console Command Export */}
              <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between gap-3">
                <div className="text-[11px] text-neutral-400 font-mono truncate">
                  {lang === 'ru' ? 'Консольная команда для Rust F1:' : 'Native Rust F1 console bind:'}
                </div>
                <button
                  onClick={handleCopyF1Crosshair}
                  className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                >
                  {copiedF1 ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                  <span>{copiedF1 ? (lang === 'ru' ? 'СКОПИРОВАНО' : 'COPIED') : (lang === 'ru' ? 'КОПИРОВАТЬ F1' : 'COPY F1')}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Overlay Behavior & Widgets Config (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Widgets Config Card */}
          <div className={`p-6 rounded-2xl border transition-colors shadow-lg space-y-4 ${
            isLight ? 'bg-white border-neutral-200' : 'bg-[#0a0d14] border-[#1a2233]'
          }`}>
            <div className="flex items-center gap-2.5 pb-3 border-b border-neutral-800">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center">
                <Sliders size={18} />
              </div>
              <div>
                <h3 className="text-base font-black uppercase font-teko tracking-wider text-white">
                  {lang === 'ru' ? 'Виджеты на Оверлее' : 'HUD Screen Widgets'}
                </h3>
                <p className="text-[11px] text-neutral-400 font-mono">
                  {lang === 'ru' ? 'Что показывать во время сессии' : 'Active tactical telemetry elements'}
                </p>
              </div>
            </div>

            <div className="space-y-2.5">
              {[
                { 
                  id: 'raid', 
                  titleRu: 'Сигнализация рейда (Rust+ Alerts)', 
                  titleEn: 'Raid Siren Alerts (Rust+)', 
                  descRu: 'Мигающий индикатор при повреждении базы', 
                  descEn: 'Flashing HUD alert on wall breach',
                  active: showRaidAlarm, 
                  toggle: () => setShowRaidAlarm(!showRaidAlarm),
                  icon: <ShieldAlert size={14} className="text-red-500" />
                },
                { 
                  id: 'oilrig', 
                  titleRu: 'Таймер респауна Нефтянки (30 мин)', 
                  titleEn: 'Large & Small Oil Rig Timer', 
                  descRu: 'Отсчет до повторного взлома крейтов', 
                  descEn: '30m hack crate cooldown tracker',
                  active: showOilrigTimer, 
                  toggle: () => setShowOilrigTimer(!showOilrigTimer),
                  icon: <Clock size={14} className="text-amber-400" />
                },
                { 
                  id: 'cargo', 
                  titleRu: 'Оповещение о Карго (Cargo Ship)', 
                  titleEn: 'Cargo Ship Event Tracker', 
                  descRu: 'Индикатор захода корабля на карту', 
                  descEn: 'Sound cue when ship horn sounds',
                  active: showCargoTimer, 
                  toggle: () => setShowCargoTimer(!showCargoTimer),
                  icon: <Compass size={14} className="text-sky-400" />
                },
                { 
                  id: 'fps', 
                  titleRu: 'Компактный счетчик FPS / Ping', 
                  titleEn: 'Minimal FPS & Ping Telemetry', 
                  descRu: 'В углу экрана с нулевой задержкой', 
                  descEn: 'Corner hardware telemetry stream',
                  active: showFpsCounter, 
                  toggle: () => setShowFpsCounter(!showFpsCounter),
                  icon: <Monitor size={14} className="text-emerald-400" />
                },
              ].map((w) => (
                <div
                  key={w.id}
                  onClick={w.toggle}
                  className="p-3 rounded-xl bg-black/40 border border-neutral-800 hover:border-neutral-700 transition-all cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    {w.icon}
                    <div>
                      <div className="text-xs font-bold text-white">
                        {lang === 'ru' ? w.titleRu : w.titleEn}
                      </div>
                      <div className="text-[10px] text-neutral-400 font-mono">
                        {lang === 'ru' ? w.descRu : w.descEn}
                      </div>
                    </div>
                  </div>

                  <input
                    type="checkbox"
                    checked={w.active}
                    onChange={w.toggle}
                    className="w-4 h-4 accent-red-600 rounded cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Hotkey & Launch Mode Card */}
          <div className={`p-6 rounded-2xl border transition-colors shadow-lg space-y-4 ${
            isLight ? 'bg-white border-neutral-200' : 'bg-[#0a0d14] border-[#1a2233]'
          }`}>
            <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-400">
              {lang === 'ru' ? 'Параметры запуска окна:' : 'Window & Hook Settings:'}
            </h4>

            <div className="p-3 rounded-xl bg-black/50 border border-neutral-800 flex items-center justify-between text-xs">
              <span className="text-neutral-300 font-bold">
                {lang === 'ru' ? 'Горячая клавиша переключения:' : 'Global Overlay Toggle Hotkey:'}
              </span>
              <span className="px-2.5 py-1 rounded-md bg-red-600/20 text-red-400 border border-red-500/30 font-mono font-black">
                {hotkey}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300 space-y-1">
              <div className="font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles size={12} />
                <span>{lang === 'ru' ? 'Рекомендация по настройке Rust' : 'Rust Video Mode Tip'}</span>
              </div>
              <p className="text-neutral-400 leading-relaxed font-sans">
                {lang === 'ru'
                  ? 'Для корректной работы оверлея поверх игры включите в настройках графики Rust режим "Окно без рамки" (Borderless Windowed).'
                  : 'For smooth transparent rendering, set your Rust display mode to "Borderless Windowed" in graphics settings.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LauncherOverlayTab;
