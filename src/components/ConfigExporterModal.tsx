import React, { useState, useMemo } from 'react';
import {
  Download,
  Copy,
  Check,
  FileCode,
  Sliders,
  Sparkles,
  Zap,
  Shield,
  Layers,
  Cpu,
  Monitor,
  CheckCircle2,
  X,
  FolderOpen,
  Terminal,
  HelpCircle
} from 'lucide-react';

interface ConfigExporterModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'ru' | 'en';
  onToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

type ConfigPreset = 'pvp_esports' | 'balanced' | 'potato' | 'binds_only' | 'admin';

export default function ConfigExporterModal({
  isOpen,
  onClose,
  lang,
  onToast
}: ConfigExporterModalProps) {
  const [preset, setPreset] = useState<ConfigPreset>('pvp_esports');
  const [sensitivity, setSensitivity] = useState<number>(0.35);
  const [adsSensitivity, setAdsSensitivity] = useState<number>(0.85);
  const [targetFps, setTargetFps] = useState<number>(144);
  const [fov, setFov] = useState<number>(90);
  const [ramGb, setRamGb] = useState<number>(16);

  // Module Toggles
  const [includeFpsTweaks, setIncludeFpsTweaks] = useState(true);
  const [includeCombatBinds, setIncludeCombatBinds] = useState(true);
  const [includeQolBinds, setIncludeQolBinds] = useState(true);
  const [includeAudioTweaks, setIncludeAudioTweaks] = useState(true);

  const [copiedCfg, setCopiedCfg] = useState(false);
  const [copiedLaunch, setCopiedLaunch] = useState(false);

  // When changing presets, update modules appropriately
  const handlePresetChange = (newPreset: ConfigPreset) => {
    setPreset(newPreset);
    if (newPreset === 'binds_only') {
      setIncludeFpsTweaks(false);
      setIncludeCombatBinds(true);
      setIncludeQolBinds(true);
      setIncludeAudioTweaks(false);
    } else if (newPreset === 'potato') {
      setIncludeFpsTweaks(true);
      setIncludeCombatBinds(true);
      setIncludeQolBinds(true);
      setIncludeAudioTweaks(true);
    } else {
      setIncludeFpsTweaks(true);
      setIncludeCombatBinds(true);
      setIncludeQolBinds(true);
      setIncludeAudioTweaks(true);
    }
  };

  // Steam Launch Options Generator
  const steamLaunchOptions = useMemo(() => {
    const memMb = ramGb * 1024;
    let gcBuffer = 4096;
    if (ramGb <= 8) gcBuffer = 1024;
    else if (ramGb <= 12) gcBuffer = 2048;
    else if (ramGb <= 16) gcBuffer = 4096;
    else gcBuffer = 8192;

    return `-window-mode exclusive -high -maxMem=${memMb} -malloc=system -force-feature-level-11-0 -gc.buffer ${gcBuffer} -nolog`;
  }, [ramGb]);

  // Generate CFG content based on preset and options
  const generatedCfgContent = useMemo(() => {
    const lines: string[] = [];

    lines.push('// ===================================================================');
    lines.push('// RUSTY.LUB ULTIMATE CONFIGURATION FILE (autoexec.cfg)');
    lines.push(`// Generated for preset: [${preset.toUpperCase()}] | Date: 2026`);
    lines.push('// Place this file in: Steam/steamapps/common/Rust/cfg/autoexec.cfg');
    lines.push('// ===================================================================\n');

    // General & Input
    lines.push('// --- INPUT & SENSITIVITY ---');
    lines.push(`input.sensitivity ${sensitivity.toFixed(2)}`);
    lines.push(`input.ads_sensitivity ${adsSensitivity.toFixed(2)}`);
    lines.push(`graphics.fov ${fov}`);
    lines.push(`fps.limit ${targetFps}`);
    lines.push('client.lookatradius 0');
    lines.push('physics.steps 60\n');

    // FPS Engine Tweaks
    if (includeFpsTweaks) {
      lines.push('// --- GRAPHICS & FPS BOOST TWEAKS ---');
      if (preset === 'potato') {
        lines.push('graphics.shadowmode 0');
        lines.push('graphics.shadowdistance 0');
        lines.push('graphics.shadowlights 0');
        lines.push('decor.quality 0');
        lines.push('grass.displacement 0');
        lines.push('grass.distance 100');
        lines.push('terrain.quality 0');
        lines.push('water.quality 0');
        lines.push('water.reflections 0');
        lines.push('effects.maxgibdist 0');
        lines.push('mesh.quality 0');
        lines.push('playercull.enabled true');
        lines.push('playercull.maxdist 30');
      } else if (preset === 'pvp_esports') {
        lines.push('graphics.shadowmode 0');
        lines.push('decor.quality 0');
        lines.push('grass.displacement 0');
        lines.push('effects.maxgibdist 50');
        lines.push('global.freezes 0');
        lines.push('playercull.enabled true');
        lines.push('playercull.maxdist 50');
        lines.push('tree.meshes 50');
      } else {
        // Balanced
        lines.push('graphics.shadowmode 1');
        lines.push('decor.quality 10');
        lines.push('grass.displacement 0');
        lines.push('global.freezes 0');
        lines.push('playercull.enabled true');
        lines.push('playercull.maxdist 60');
      }
      lines.push('culling.world true');
      lines.push('culling.entity true\n');
    }

    // Combat Binds
    if (includeCombatBinds) {
      lines.push('// --- COMBAT & MOVEMENT MACRO-BINDS ---');
      lines.push('// Auto-Run toggle on Key Z');
      lines.push('bind z forward;sprint');
      lines.push('// Fast Combat Syringe on Mouse Button 4 (Slot 6)');
      lines.push('bind mouse3 "+slot6;+attack2;-attack2"');
      lines.push('// Duck Jump for smooth parkour on Spacebar');
      lines.push('bind space "+jump;+duck"');
      lines.push('// Auto-Attack (Farming / Raiding) toggle on Key X');
      lines.push('bind x attack');
      lines.push('// Combat Crouch Zoom (FOV 70) on Left Control');
      lines.push('bind leftcontrol "+duck;+graphics.fov 70;-graphics.fov 90"\n');
    }

    // QoL Binds
    if (includeQolBinds) {
      lines.push('// --- QUALITY OF LIFE (QOL) BINDS ---');
      lines.push('// Fast Combat Log toggle on F2');
      lines.push('bind f2 "consoletoggle;combatlog"');
      lines.push('// Fast Console toggle on F1');
      lines.push('bind f1 consoletoggle');
      lines.push('// Clear blood decals / impacts on attack');
      lines.push('bind mouse0 "+attack;combatlog.clear"');
      lines.push('// Quick Craft Bandages on Key C');
      lines.push('bind c "craft.add -2072273936 1"');
      lines.push('// Mute Voice Chat toggle on Key M');
      lines.push('bind m "voice.loopback 0;chat.say /mute"\n');
    }

    // Audio Tweaks
    if (includeAudioTweaks) {
      lines.push('// --- AUDIO SETTINGS ---');
      lines.push('audio.master 1');
      lines.push('audio.game 1');
      lines.push('audio.musicvolume 0');
      lines.push('audio.voices 1');
      lines.push('audio.instruments 0\n');
    }

    // Admin Tools if Admin preset
    if (preset === 'admin') {
      lines.push('// --- ADMIN & MODERATION TOOLS ---');
      lines.push('bind l noclip');
      lines.push('bind k vanish');
      lines.push('bind j god');
      lines.push('bind [ "env.time 12"');
      lines.push('bind ] "env.time 0"\n');
    }

    lines.push('// Configuration loaded successfully.');
    lines.push('echo [RUSTY.LUB] Configuration loaded successfully! Good luck on the wipe.');

    return lines.join('\n');
  }, [
    preset,
    sensitivity,
    adsSensitivity,
    targetFps,
    fov,
    includeFpsTweaks,
    includeCombatBinds,
    includeQolBinds,
    includeAudioTweaks
  ]);

  if (!isOpen) return null;

  // Download CFG file handler
  const handleDownloadCfg = (filename = 'autoexec.cfg') => {
    try {
      const blob = new Blob([generatedCfgContent], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      onToast(
        lang === 'ru' ? `✅ Файл ${filename} успешно скачан!` : `✅ File ${filename} downloaded!`,
        'success'
      );
    } catch (e) {
      onToast(lang === 'ru' ? 'Ошибка скачивания файла' : 'Download error', 'error');
    }
  };

  const handleCopyCfg = () => {
    navigator.clipboard.writeText(generatedCfgContent);
    setCopiedCfg(true);
    setTimeout(() => setCopiedCfg(false), 2000);
    onToast(lang === 'ru' ? 'Весь конфиг скопирован в буфер!' : 'Full config copied to clipboard!', 'success');
  };

  const handleCopyLaunch = () => {
    navigator.clipboard.writeText(steamLaunchOptions);
    setCopiedLaunch(true);
    setTimeout(() => setCopiedLaunch(false), 2000);
    onToast(
      lang === 'ru' ? 'Параметры запуска Steam скопированы!' : 'Steam Launch options copied!',
      'success'
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#12151d] border-2 border-[#cd412b]/70 w-full max-w-3xl shadow-[0_0_50px_rgba(205,65,43,0.35)] relative flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#cd412b] to-[#8a1d0d] p-4 flex items-center justify-between text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-black/30 rounded-sm">
              <FileCode size={22} className="text-white" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black uppercase font-mono tracking-wider flex items-center gap-2">
                <span>{lang === 'ru' ? 'Экспорт Конфигурации (autoexec.cfg)' : 'Config Exporter (autoexec.cfg)'}</span>
                <span className="text-[10px] bg-black/50 px-2 py-0.5 border border-white/20">1-CLICK</span>
              </h3>
              <p className="text-[11px] text-white/80 font-sans">
                {lang === 'ru'
                  ? 'Генератор готового файла настроек с биндами, FPS бустом и сенсой'
                  : 'Ready-to-use config generator with binds, FPS tweaks, and sensitivity'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/70 hover:text-white hover:bg-black/30 transition-all rounded-sm cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5 font-sans text-gray-200 flex-1">
          {/* Preset Selector */}
          <div className="space-y-2">
            <label className="text-xs font-mono font-bold uppercase tracking-wider text-gray-300 flex items-center gap-2">
              <Sparkles size={14} className="text-amber-400" />
              <span>{lang === 'ru' ? 'Выберите Готовый Пресет:' : 'Select Configuration Preset:'}</span>
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 font-mono text-[11px]">
              <button
                onClick={() => handlePresetChange('pvp_esports')}
                className={`p-2.5 border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  preset === 'pvp_esports'
                    ? 'bg-[#cd412b] text-white border-white shadow-lg'
                    : 'bg-[#181c27] text-gray-300 border-[#2a2f3b] hover:border-gray-500'
                }`}
              >
                <div className="font-black uppercase flex items-center gap-1">
                  <Zap size={12} className={preset === 'pvp_esports' ? 'text-white' : 'text-amber-400'} />
                  <span>PvP Max FPS</span>
                </div>
                <span className="text-[9px] opacity-80 mt-1 block leading-tight">
                  {lang === 'ru' ? 'Турнирный Pro' : 'Tournament Pro'}
                </span>
              </button>

              <button
                onClick={() => handlePresetChange('balanced')}
                className={`p-2.5 border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  preset === 'balanced'
                    ? 'bg-[#cd412b] text-white border-white shadow-lg'
                    : 'bg-[#181c27] text-gray-300 border-[#2a2f3b] hover:border-gray-500'
                }`}
              >
                <div className="font-black uppercase flex items-center gap-1">
                  <Sliders size={12} className={preset === 'balanced' ? 'text-white' : 'text-sky-400'} />
                  <span>Balanced</span>
                </div>
                <span className="text-[9px] opacity-80 mt-1 block leading-tight">
                  {lang === 'ru' ? 'Баланс FPS/Графика' : 'FPS & Visuals'}
                </span>
              </button>

              <button
                onClick={() => handlePresetChange('potato')}
                className={`p-2.5 border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  preset === 'potato'
                    ? 'bg-[#cd412b] text-white border-white shadow-lg'
                    : 'bg-[#181c27] text-gray-300 border-[#2a2f3b] hover:border-gray-500'
                }`}
              >
                <div className="font-black uppercase flex items-center gap-1">
                  <Cpu size={12} className={preset === 'potato' ? 'text-white' : 'text-rose-400'} />
                  <span>Potato PC</span>
                </div>
                <span className="text-[9px] opacity-80 mt-1 block leading-tight">
                  {lang === 'ru' ? 'Для слабых ПК' : 'Low-End Hardcore'}
                </span>
              </button>

              <button
                onClick={() => handlePresetChange('binds_only')}
                className={`p-2.5 border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  preset === 'binds_only'
                    ? 'bg-[#cd412b] text-white border-white shadow-lg'
                    : 'bg-[#181c27] text-gray-300 border-[#2a2f3b] hover:border-gray-500'
                }`}
              >
                <div className="font-black uppercase flex items-center gap-1">
                  <Layers size={12} className={preset === 'binds_only' ? 'text-white' : 'text-emerald-400'} />
                  <span>Binds Only</span>
                </div>
                <span className="text-[9px] opacity-80 mt-1 block leading-tight">
                  {lang === 'ru' ? 'Только бинды' : 'Keybinds only'}
                </span>
              </button>

              <button
                onClick={() => handlePresetChange('admin')}
                className={`p-2.5 border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  preset === 'admin'
                    ? 'bg-[#cd412b] text-white border-white shadow-lg'
                    : 'bg-[#181c27] text-gray-300 border-[#2a2f3b] hover:border-gray-500'
                }`}
              >
                <div className="font-black uppercase flex items-center gap-1">
                  <Shield size={12} className={preset === 'admin' ? 'text-white' : 'text-purple-400'} />
                  <span>Admin Set</span>
                </div>
                <span className="text-[9px] opacity-80 mt-1 block leading-tight">
                  {lang === 'ru' ? 'Для админов' : 'Moderator tools'}
                </span>
              </button>
            </div>
          </div>

          {/* Sliders & Parameters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-[#0c0e14] border border-[#2a2f3b] p-4">
            {/* Sensitivity */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-gray-400 uppercase">{lang === 'ru' ? 'Сенса (Sens):' : 'Sensitivity:'}</span>
                <span className="text-amber-400 font-bold">{sensitivity.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="1.5"
                step="0.01"
                value={sensitivity}
                onChange={(e) => setSensitivity(parseFloat(e.target.value))}
                className="w-full accent-[#cd412b]"
              />
            </div>

            {/* ADS Sensitivity */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-gray-400 uppercase">{lang === 'ru' ? 'ADS Сенса:' : 'ADS Sens:'}</span>
                <span className="text-amber-400 font-bold">{adsSensitivity.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1.5"
                step="0.05"
                value={adsSensitivity}
                onChange={(e) => setAdsSensitivity(parseFloat(e.target.value))}
                className="w-full accent-[#cd412b]"
              />
            </div>

            {/* Target FPS / FOV */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-gray-400 uppercase">{lang === 'ru' ? 'Лимит FPS:' : 'FPS Limit:'}</span>
                <span className="text-amber-400 font-bold">{targetFps === 0 ? 'Unlimited' : targetFps}</span>
              </div>
              <div className="flex gap-1 font-mono text-[10px]">
                {[60, 144, 240, 0].map((fpsVal) => (
                  <button
                    key={fpsVal}
                    onClick={() => setTargetFps(fpsVal)}
                    className={`flex-1 py-1 border transition-all ${
                      targetFps === fpsVal
                        ? 'bg-[#cd412b] text-white border-[#cd412b]'
                        : 'bg-[#181c27] text-gray-400 border-[#2a2f3b]'
                    }`}
                  >
                    {fpsVal === 0 ? 'Max' : fpsVal}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Module Inclusions */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase text-gray-400 block font-bold">
              {lang === 'ru' ? 'ВКЛЮЧЕННЫЕ МОДУЛИ В ФАЙЛ CFG:' : 'INCLUDED MODULES IN CFG:'}
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[11px]">
              <label className="flex items-center gap-2 p-2 bg-[#171b26] border border-[#2a2f3b] cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeFpsTweaks}
                  onChange={(e) => setIncludeFpsTweaks(e.target.checked)}
                  className="accent-[#cd412b]"
                />
                <span>FPS Tweaks</span>
              </label>
              <label className="flex items-center gap-2 p-2 bg-[#171b26] border border-[#2a2f3b] cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeCombatBinds}
                  onChange={(e) => setIncludeCombatBinds(e.target.checked)}
                  className="accent-[#cd412b]"
                />
                <span>Combat Binds</span>
              </label>
              <label className="flex items-center gap-2 p-2 bg-[#171b26] border border-[#2a2f3b] cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeQolBinds}
                  onChange={(e) => setIncludeQolBinds(e.target.checked)}
                  className="accent-[#cd412b]"
                />
                <span>QoL Binds</span>
              </label>
              <label className="flex items-center gap-2 p-2 bg-[#171b26] border border-[#2a2f3b] cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeAudioTweaks}
                  onChange={(e) => setIncludeAudioTweaks(e.target.checked)}
                  className="accent-[#cd412b]"
                />
                <span>Audio Tweaks</span>
              </label>
            </div>
          </div>

          {/* Live Code Preview */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-gray-400 uppercase flex items-center gap-1.5">
                <Terminal size={14} className="text-[#cd412b]" />
                <span>{lang === 'ru' ? 'Предпросмотр autoexec.cfg:' : 'autoexec.cfg Preview:'}</span>
              </span>
              <button
                onClick={handleCopyCfg}
                className="text-[11px] text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer"
              >
                {copiedCfg ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                <span>{copiedCfg ? (lang === 'ru' ? 'Скопировано!' : 'Copied!') : (lang === 'ru' ? 'Скопировать все' : 'Copy All')}</span>
              </button>
            </div>

            <div className="bg-[#090b10] border border-[#2a2f3b] p-3 rounded-none max-h-48 overflow-y-auto font-mono text-[11px] text-emerald-400/90 whitespace-pre leading-relaxed select-all">
              {generatedCfgContent}
            </div>
          </div>

          {/* Steam Launch Options Box */}
          <div className="bg-[#151923] border border-[#2a2f3b] p-4 space-y-2.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Monitor size={16} className="text-sky-400" />
                <h4 className="text-xs font-mono font-bold uppercase text-white">
                  {lang === 'ru' ? 'Параметры запуска Steam:' : 'Steam Launch Options:'}
                </h4>
              </div>

              {/* RAM Selector */}
              <div className="flex items-center gap-1.5 font-mono text-[10px]">
                <span className="text-gray-400 uppercase">{lang === 'ru' ? 'ОЗУ:' : 'RAM:'}</span>
                {[8, 16, 32].map((gb) => (
                  <button
                    key={gb}
                    onClick={() => setRamGb(gb)}
                    className={`px-2 py-0.5 border ${
                      ramGb === gb
                        ? 'bg-sky-600 text-white border-sky-400'
                        : 'bg-[#0c0e14] text-gray-400 border-[#2a2f3b]'
                    }`}
                  >
                    {gb}GB
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={steamLaunchOptions}
                className="w-full bg-[#0a0c12] border border-[#2a2f3b] text-gray-200 text-xs font-mono p-2 select-all outline-none"
              />
              <button
                onClick={handleCopyLaunch}
                className="px-3 py-2 bg-[#1b1e26] hover:bg-[#262c3b] border border-[#2a2f3b] text-white text-xs font-mono font-bold uppercase transition-all shrink-0 flex items-center gap-1.5 cursor-pointer"
              >
                {copiedLaunch ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                <span>{copiedLaunch ? 'OK' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Installation Path Instructions */}
          <div className="bg-[#0d1017] border-l-2 border-amber-500 p-3 text-xs space-y-1 font-sans">
            <div className="font-bold text-amber-400 uppercase font-mono flex items-center gap-1.5 text-[11px]">
              <FolderOpen size={14} />
              <span>{lang === 'ru' ? 'Куда закидывать файл autoexec.cfg?' : 'Where to install autoexec.cfg?'}</span>
            </div>
            <p className="text-gray-400 text-[11px]">
              {lang === 'ru' ? (
                <>
                  Поместите скачанный файл в папку игры:{' '}
                  <span className="text-gray-200 font-mono bg-black/60 px-1 py-0.5">
                    Steam\steamapps\common\Rust\cfg\autoexec.cfg
                  </span>
                  . Игра будет автоматически применять все бинды и команды при каждом запуске!
                </>
              ) : (
                <>
                  Place the downloaded file into your Rust directory:{' '}
                  <span className="text-gray-200 font-mono bg-black/60 px-1 py-0.5">
                    Steam\steamapps\common\Rust\cfg\autoexec.cfg
                  </span>
                  . Rust will execute all binds and tweaks automatically on startup!
                </>
              )}
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-[#0c0d12] border-t border-[#2a2f3b] p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 bg-[#1b1e26] hover:bg-[#252a36] border border-[#2a2f3b] text-white text-xs font-mono font-bold uppercase transition-all cursor-pointer text-center"
          >
            {lang === 'ru' ? 'Закрыть' : 'Close'}
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleCopyCfg}
              className="flex-1 sm:flex-none px-4 py-2.5 bg-[#1f2433] hover:bg-[#2b3247] border border-[#2a2f3b] text-gray-200 text-xs font-mono font-bold uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Copy size={14} />
              <span>{lang === 'ru' ? 'Скопировать' : 'Copy'}</span>
            </button>

            <button
              onClick={() => handleDownloadCfg('autoexec.cfg')}
              className="flex-1 sm:flex-none px-5 py-2.5 bg-[#cd412b] hover:bg-[#b03522] text-white text-xs font-mono font-black uppercase transition-all shadow-[0_0_20px_rgba(205,65,43,0.5)] flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download size={15} />
              <span>{lang === 'ru' ? 'Скачать autoexec.cfg' : 'Download autoexec.cfg'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
