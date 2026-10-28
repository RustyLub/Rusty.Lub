import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Flame, 
  Keyboard, 
  Copy, 
  Check, 
  Bell, 
  ShieldAlert, 
  Zap, 
  Volume2, 
  Sparkles,
  Sliders,
  Target,
  Pin,
  Radio,
  Clock,
  Layers,
  Crosshair,
  Shield,
  HelpCircle,
  FileCode,
  Download,
  Terminal,
  Activity,
  Settings
} from 'lucide-react';
import { sendWindowsNotification, playNotificationAudio } from '../services/tauriNotifications';
import { ItemImageOrFallback } from './IconUtils';
import { getLauncherSettings } from '../services/launcherSettings';

interface QuickOverlayModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'ru' | 'en';
  appTheme: 'light' | 'dark';
  onCopyBind: (code: string) => void;
  onOpenFullRaid: () => void;
  onOpenSettings?: () => void;
}

type TargetType = 
  | 'wood_wall' 
  | 'stone_wall' 
  | 'metal_wall' 
  | 'armored_wall' 
  | 'wood_door' 
  | 'metal_door' 
  | 'garage_door' 
  | 'armored_door' 
  | 'high_external_stone' 
  | 'auto_turret' 
  | 'sam_site';

export const QuickOverlayModal: React.FC<QuickOverlayModalProps> = ({
  isOpen,
  onClose,
  lang,
  appTheme,
  onCopyBind,
  onOpenFullRaid,
  onOpenSettings
}) => {
  const launcherSettings = getLauncherSettings();
  const [activeTab, setActiveTab] = useState<'raid' | 'weapons' | 'binds' | 'alerts'>(
    launcherSettings.hudStartSection || 'raid'
  );
  const [selectedTarget, setSelectedTarget] = useState<TargetType>('garage_door');
  const [targetCount, setTargetCount] = useState<number>(1);
  const [opacity, setOpacity] = useState<number>(
    launcherSettings.hudDefaultOpacity ? launcherSettings.hudDefaultOpacity / 100 : 0.92
  );
  const [isPinned, setIsPinned] = useState<boolean>(launcherSettings.hudAlwaysOnTop ?? true);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [selectedWeapon, setSelectedWeapon] = useState<'ak' | 'mp5' | 'thompson' | 'bolt'>('ak');

  if (!isOpen) return null;

  const isLight = appTheme === 'light';

  // Comprehensive Raid Matrix Data for Rust
  const raidTargets: Record<TargetType, {
    nameRu: string;
    nameEn: string;
    iconId: string;
    rockets: number;
    c4: number;
    satchels: number;
    expAmmo: number;
    sulfur: number;
    gunpowder: number;
    charcoal: number;
  }> = {
    wood_wall: { nameRu: 'Деревянная стена', nameEn: 'Wood Wall', iconId: 'wall.frame', rockets: 2, c4: 1, satchels: 3, expAmmo: 49, sulfur: 2800, gunpowder: 1400, charcoal: 4200 },
    stone_wall: { nameRu: 'Каменная стена', nameEn: 'Stone Wall', iconId: 'wall.stone', rockets: 4, c4: 2, satchels: 10, expAmmo: 185, sulfur: 5600, gunpowder: 2800, charcoal: 8400 },
    metal_wall: { nameRu: 'Металлическая стена', nameEn: 'Sheet Metal Wall', iconId: 'wall.metal', rockets: 8, c4: 4, satchels: 23, expAmmo: 400, sulfur: 11200, gunpowder: 5600, charcoal: 16800 },
    armored_wall: { nameRu: 'МВК стена', nameEn: 'Armored Wall', iconId: 'wall.armored', rockets: 15, c4: 8, satchels: 46, expAmmo: 799, sulfur: 21000, gunpowder: 10500, charcoal: 31500 },
    wood_door: { nameRu: 'Деревянная дверь', nameEn: 'Wood Door', iconId: 'door.hinged.wood', rockets: 1, c4: 1, satchels: 2, expAmmo: 18, sulfur: 1200, gunpowder: 600, charcoal: 1800 },
    metal_door: { nameRu: 'Дверь из листового металла', nameEn: 'Sheet Metal Door', iconId: 'door.hinged.metal', rockets: 2, c4: 1, satchels: 4, expAmmo: 63, sulfur: 2800, gunpowder: 1400, charcoal: 4200 },
    garage_door: { nameRu: 'Гаражная дверь', nameEn: 'Garage Door', iconId: 'wall.frame.garagedoor', rockets: 3, c4: 2, satchels: 9, expAmmo: 150, sulfur: 4200, gunpowder: 2100, charcoal: 6300 },
    armored_door: { nameRu: 'МВК дверь', nameEn: 'Armored Door', iconId: 'door.hinged.armored', rockets: 5, c4: 3, satchels: 12, expAmmo: 250, sulfur: 7000, gunpowder: 3500, charcoal: 10500 },
    high_external_stone: { nameRu: 'Высокие каменные ворота', nameEn: 'High External Stone Wall', iconId: 'wall.external.high.stone', rockets: 6, c4: 3, satchels: 18, expAmmo: 300, sulfur: 8400, gunpowder: 4200, charcoal: 12600 },
    auto_turret: { nameRu: 'Авто-Турель', nameEn: 'Auto Turret', iconId: 'autoturret', rockets: 2, c4: 1, satchels: 4, expAmmo: 115, sulfur: 2800, gunpowder: 1400, charcoal: 4200 },
    sam_site: { nameRu: 'ПВО ЗРК (SAM Site)', nameEn: 'SAM Site', iconId: 'samsite', rockets: 4, c4: 2, satchels: 10, expAmmo: 185, sulfur: 5600, gunpowder: 2800, charcoal: 8400 }
  };

  const currentTarget = raidTargets[selectedTarget];

  // Weapon Stats Matrix
  const weaponMatrix = {
    ak: {
      name: 'Assault Rifle (AK-47)',
      iconId: 'rifle.ak',
      damage: 50,
      fireRate: '450 RPM',
      ammo: '5.56mm',
      recoilDiff: lang === 'ru' ? 'Высокая (S-образная)' : 'High (S-curve)',
      headshotsHazmat: 2,
      headshotsFullMetal: 3,
      recommended: lang === 'ru' ? 'Глушитель + Голограф' : 'Holosight + Silencer'
    },
    mp5: {
      name: 'MP5A4',
      iconId: 'smg.mp5',
      damage: 35,
      fireRate: '600 RPM',
      ammo: '9mm',
      recoilDiff: lang === 'ru' ? 'Средняя (Вертикальная)' : 'Medium (Vertical)',
      headshotsHazmat: 3,
      headshotsFullMetal: 4,
      recommended: lang === 'ru' ? 'Лазерный указ + Надульник' : 'Laser Sight + Muzzle Brake'
    },
    thompson: {
      name: 'Thompson SMG',
      iconId: 'smg.thompson',
      damage: 37,
      fireRate: '462 RPM',
      ammo: '9mm',
      recoilDiff: lang === 'ru' ? 'Низкая (Очень легкая)' : 'Low (Very Easy)',
      headshotsHazmat: 3,
      headshotsFullMetal: 4,
      recommended: lang === 'ru' ? 'Голографический прицел' : 'Holosight'
    },
    bolt: {
      name: 'Bolt Action Rifle',
      iconId: 'rifle.bolt',
      damage: 80,
      fireRate: '34 RPM',
      ammo: '5.56mm HV',
      recoilDiff: lang === 'ru' ? 'Одиночные выстрелы' : 'Single Shot',
      headshotsHazmat: 1,
      headshotsFullMetal: 2,
      recommended: lang === 'ru' ? 'Прицел 8x / 16x + Сошки' : '8x / 16x Scope + Bipod'
    }
  };

  const currentWeapon = weaponMatrix[selectedWeapon];

  // Quick Binds Library
  const bindCategories = [
    {
      categoryRu: '⚔️ БОЕВЫЕ МАКРОСЫ',
      categoryEn: '⚔️ COMBAT MACROS',
      items: [
        { key: 'duck_shoot', titleRu: 'Стрельба сидя (Crouch Shoot)', titleEn: 'Crouch Shoot', code: 'bind mouse1 +attack;+duck' },
        { key: 'quick_syringe', titleRu: 'Быстрый Шприц в слот 6', titleEn: 'Quick Syringe Slot 6', code: 'bind 6 +slot6;+attack' },
        { key: 'fov_zoom', titleRu: 'Переключение FOV 60-90 (Зум)', titleEn: 'FOV 60-90 Zoom Toggle', code: 'bind c "graphics.fov 60;graphics.fov 90"' },
        { key: 'combat_crosshair', titleRu: 'Вкл/Выкл прицел на экране', titleEn: 'Toggle Crosshair', code: 'bind x "crosshair.enabled 1;crosshair.enabled 0"' }
      ]
    },
    {
      categoryRu: '⛏️ АВТО-ФАРМ И ДВИЖЕНИЕ',
      categoryEn: '⛏️ AUTO FARM & MOVEMENT',
      items: [
        { key: 'auto_attack', titleRu: 'Авто-атака (Фарм руды/дерева)', titleEn: 'Auto Attack Ore/Wood', code: 'bind z attack;duck' },
        { key: 'auto_run', titleRu: 'Авто-бег вперед', titleEn: 'Auto Run', code: 'bind q forward;sprint' },
        { key: 'hover_loot', titleRu: 'Быстрый Hover-Loot (Зажим)', titleEn: 'Quick Hover Loot', code: 'bind h +hoverloot' },
        { key: 'jump_crouch', titleRu: 'Прыжок с поджатием ног', titleEn: 'Jump Crouch', code: 'bind space +jump;+duck' }
      ]
    },
    {
      categoryRu: '🛠️ КЛИЕНТ И ОЧИСТКА',
      categoryEn: '🛠️ CLIENT & GRAPHICS',
      items: [
        { key: 'clear_decals', titleRu: 'Очистить кровь и следы пуль', titleEn: 'Clear Blood & Bullet Decals', code: 'bind shift "+speed;global.cleardecals"' },
        { key: 'fps_counter', titleRu: 'Счетчик FPS (Level 2)', titleEn: 'FPS Counter Level 2', code: 'bind f10 "perf 2;perf 0"' },
        { key: 'fast_disconnect', titleRu: 'Мгновенный выход с сервера', titleEn: 'Instant Server Disconnect', code: 'bind f9 "disconnect"' }
      ]
    }
  ];

  const handleCopy = (code: string, key: string) => {
    onCopyBind(code);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleTestRaidNotification = () => {
    sendWindowsNotification(
      lang === 'ru' ? '⚠️ ТРЕВОГА РЕЙДА БАЗЫ' : '⚠️ BASE RAID ALERT',
      lang === 'ru' ? 'Сработал сенсор Rust+: повреждена стена на квадрате K14!' : 'Rust+ sensor triggered: Wall destroyed at K14!',
      'raid'
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 pointer-events-auto select-none">
      {/* Semi-transparent backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-black/65 backdrop-blur-xs transition-opacity"
      />

      {/* Main HUD Window Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 15 }}
        style={{ opacity }}
        className={`relative w-full max-w-2xl rounded-2xl border-2 shadow-2xl overflow-hidden z-10 transition-opacity font-mono rust-metal-pattern ${
          isLight
            ? 'bg-white/95 border-red-500/60 shadow-[0_15px_50px_rgba(220,38,38,0.25)] text-neutral-900'
            : 'bg-[#080b10]/98 border-red-600/70 shadow-[0_15px_50px_rgba(0,0,0,0.95)] text-[#eef2f7]'
        }`}
      >
        {/* Tactical Corner Brackets */}
        <div className="rust-bracket-tl" />
        <div className="rust-bracket-tr" />
        <div className="rust-bracket-bl" />
        <div className="rust-bracket-br" />

        {/* Hazard top stripe */}
        <div className="h-1 rust-hazard w-full" />

        {/* Header Bar */}
        <div 
          data-tauri-drag-region
          className="px-4 py-2.5 bg-gradient-to-r from-red-700 via-red-600 to-amber-600 text-white flex items-center justify-between shadow-md select-none cursor-move"
        >
          <div className="flex items-center gap-2.5 min-w-0" data-tauri-drag-region>
            <div className="w-5 h-5 rounded bg-black/40 flex items-center justify-center font-black text-[10px] text-amber-400 shrink-0">
              HUD
            </div>
            <span className="font-black text-sm sm:text-base tracking-wider font-teko uppercase truncate">
              RUSTY.LUB IN-GAME HUD OVERLAY ({launcherSettings.hudHotkey || 'ALT + O'})
            </span>
            <span className="hidden sm:inline-block text-[9px] px-1.5 py-0.2 rounded font-bold bg-black/30 text-amber-300 border border-white/20">
              v{launcherSettings.appVersion || '2.6.4'}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Launcher Settings Button */}
            {onOpenSettings && (
              <button
                onClick={onOpenSettings}
                className="p-1.5 rounded transition-all cursor-pointer hover:bg-black/30 text-white/80 hover:text-amber-400"
                title={lang === 'ru' ? 'Настройки оверлея и лаунчера' : 'Overlay & Launcher Settings'}
              >
                <Settings size={13} />
              </button>
            )}

            {/* Window Pin Toggle */}
            <button
              onClick={() => setIsPinned(!isPinned)}
              className={`p-1.5 rounded transition-all cursor-pointer ${
                isPinned ? 'bg-black/40 text-amber-400' : 'hover:bg-black/30 text-white/70'
              }`}
              title={isPinned ? 'Pin Window On Top' : 'Unpin Window'}
            >
              <Pin size={13} className={isPinned ? 'rotate-45 text-amber-400' : ''} />
            </button>

            {/* Opacity slider toggle */}
            <div className="flex items-center gap-1.5 bg-black/30 px-2 py-1 rounded text-[10px]">
              <Sliders size={12} className="text-amber-300 shrink-0" />
              <input
                type="range"
                min="0.35"
                max="1.0"
                step="0.05"
                value={opacity}
                onChange={(e) => setOpacity(parseFloat(e.target.value))}
                className="w-16 accent-amber-400 cursor-pointer"
                title={lang === 'ru' ? 'Прозрачность оверлея' : 'Overlay Transparency'}
              />
              <span className="text-[9px] font-bold text-amber-300">{Math.round(opacity * 100)}%</span>
            </div>

            <button
              onClick={onClose}
              className="p-1 hover:bg-black/30 rounded cursor-pointer transition-colors text-white"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Tab Selector Bar */}
        <div className="flex border-b border-red-500/30 bg-black/50 px-2.5 py-2 gap-1.5 text-xs overflow-x-auto no-scrollbar">
          {[
            { id: 'raid', labelRu: 'Рейды & Серы', labelEn: 'Raid Matrix', icon: <Flame size={13} className="text-orange-500" /> },
            { id: 'weapons', labelRu: 'Оружие & TTK', labelEn: 'Weapons TTK', icon: <Target size={13} className="text-red-400" /> },
            { id: 'binds', labelRu: 'Бинды F1', labelEn: 'F1 Binds', icon: <Keyboard size={13} className="text-amber-400" /> },
            { id: 'alerts', labelRu: 'Сирена & Трей', labelEn: 'Alarm & Tray', icon: <Bell size={13} className="text-sky-400" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg font-bold uppercase transition-all cursor-pointer flex items-center gap-1.5 shrink-0 border ${
                activeTab === tab.id
                  ? 'bg-red-600 text-white border-red-600 shadow-md shadow-red-600/30 font-black'
                  : 'bg-black/30 hover:bg-white/10 text-neutral-400 border-white/5'
              }`}
            >
              {tab.icon}
              <span>{lang === 'ru' ? tab.labelRu : tab.labelEn}</span>
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="p-4 space-y-4 max-h-[65vh] overflow-y-auto no-scrollbar">
          {/* TAB 1: RAID MATRIX */}
          {activeTab === 'raid' && (
            <div className="space-y-4">
              {/* Target Type Selector Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-[11px]">
                {[
                  { id: 'garage_door', label: 'Garage Door' },
                  { id: 'armored_door', label: 'Armored Door' },
                  { id: 'stone_wall', label: 'Stone Wall' },
                  { id: 'metal_wall', label: 'Metal Wall' },
                  { id: 'armored_wall', label: 'Armored Wall' },
                  { id: 'high_external_stone', label: 'High Ext Stone' },
                  { id: 'auto_turret', label: 'Auto Turret' },
                  { id: 'sam_site', label: 'SAM Site' }
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedTarget(s.id as any)}
                    className={`p-2 rounded-lg font-bold uppercase text-left border transition-all cursor-pointer truncate ${
                      selectedTarget === s.id
                        ? 'bg-amber-500 text-black border-amber-400 font-black shadow-md'
                        : 'bg-black/40 border-white/10 hover:bg-white/10 text-neutral-300'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              {/* Quantity Multiplier Slider */}
              <div className="p-3 bg-black/50 border border-neutral-800 rounded-xl space-y-2">
                <div className="flex justify-between items-center text-xs font-bold text-neutral-300">
                  <span className="flex items-center gap-1.5">
                    <Layers size={13} className="text-amber-400" />
                    <span>{lang === 'ru' ? 'Количество целей:' : 'Target Quantity:'}</span>
                  </span>
                  <span className="text-amber-400 font-black text-base">{targetCount}x</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={targetCount}
                  onChange={(e) => setTargetCount(parseInt(e.target.value))}
                  className="w-full accent-red-500 cursor-pointer"
                />
              </div>

              {/* Main Target Calculation Summary Card */}
              <div className="p-4 rounded-xl bg-black/70 border border-red-500/40 space-y-3 relative overflow-hidden">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-neutral-900 border border-neutral-700 flex items-center justify-center shrink-0 overflow-hidden">
                      <ItemImageOrFallback id={currentTarget.iconId} lang={lang} size={32} />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white uppercase">
                        {targetCount}x {lang === 'ru' ? currentTarget.nameRu : currentTarget.nameEn}
                      </div>
                      <div className="text-[10px] text-neutral-400 font-mono">
                        {lang === 'ru' ? 'Расчет затрат ресурсов' : 'Total Explosive Requirements'}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-base font-black text-emerald-400">
                      ~{(currentTarget.sulfur * targetCount).toLocaleString()} {lang === 'ru' ? 'Серы' : 'Sulfur'}
                    </div>
                    <div className="text-[10px] text-amber-400 font-bold">
                      ~{(currentTarget.gunpowder * targetCount).toLocaleString()} {lang === 'ru' ? 'Пороха' : 'Gunpowder'} • ~{(currentTarget.charcoal * targetCount).toLocaleString()} {lang === 'ru' ? 'Угля' : 'Charcoal'}
                    </div>
                  </div>
                </div>

                {/* Explosive Options Matrix */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                  <div className="p-2.5 rounded-lg bg-red-950/70 border border-red-500/30 space-y-0.5">
                    <div className="text-[9px] text-red-400 font-bold uppercase">🚀 ROCKETS</div>
                    <div className="text-lg font-black text-white">{currentTarget.rockets * targetCount}</div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-amber-950/70 border border-amber-500/30 space-y-0.5">
                    <div className="text-[9px] text-amber-400 font-bold uppercase">💣 C4</div>
                    <div className="text-lg font-black text-white">{currentTarget.c4 * targetCount}</div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-orange-950/70 border border-orange-500/30 space-y-0.5">
                    <div className="text-[9px] text-orange-400 font-bold uppercase">🧨 SATCHELS</div>
                    <div className="text-lg font-black text-white">{currentTarget.satchels * targetCount}</div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-neutral-900 border border-neutral-700 space-y-0.5">
                    <div className="text-[9px] text-neutral-400 font-bold uppercase">💥 EXP AMMO</div>
                    <div className="text-lg font-black text-white">{currentTarget.expAmmo * targetCount}</div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => { onClose(); onOpenFullRaid(); }}
                className="w-full py-2.5 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-md text-center block"
              >
                {lang === 'ru' ? 'Открыть Полную Базу Калькуляторов ➔' : 'Open Full Raid Calculator ➔'}
              </button>
            </div>
          )}

          {/* TAB 2: WEAPONS MATRIX */}
          {activeTab === 'weapons' && (
            <div className="space-y-3">
              <div className="grid grid-cols-4 gap-1.5 text-xs font-bold">
                {[
                  { id: 'ak', label: 'AK-47' },
                  { id: 'mp5', label: 'MP5A4' },
                  { id: 'thompson', label: 'Thompson' },
                  { id: 'bolt', label: 'Bolt Action' }
                ].map((w) => (
                  <button
                    key={w.id}
                    onClick={() => setSelectedWeapon(w.id as any)}
                    className={`py-2 rounded-lg uppercase border transition-all cursor-pointer ${
                      selectedWeapon === w.id
                        ? 'bg-red-600 text-white border-red-500 font-black shadow-md'
                        : 'bg-black/40 border-white/10 hover:bg-white/10 text-neutral-300'
                    }`}
                  >
                    {w.label}
                  </button>
                ))}
              </div>

              {/* Weapon Stats Display Card */}
              <div className="p-4 rounded-xl bg-black/70 border border-red-500/30 space-y-3">
                <div className="flex items-center gap-3 border-b border-neutral-800 pb-3">
                  <div className="w-12 h-12 rounded-lg bg-neutral-900 border border-neutral-700 flex items-center justify-center shrink-0 overflow-hidden">
                    <ItemImageOrFallback id={currentWeapon.iconId} lang={lang} size={40} />
                  </div>
                  <div>
                    <h4 className="text-base font-black text-white font-teko uppercase">{currentWeapon.name}</h4>
                    <div className="text-[10px] text-amber-400 font-mono font-bold">
                      {lang === 'ru' ? 'Патроны' : 'Ammo'}: {currentWeapon.ammo} • {currentWeapon.fireRate}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 bg-neutral-900 border border-neutral-800 rounded-lg">
                    <div className="text-[9px] text-neutral-400 font-bold">{lang === 'ru' ? 'УРОН' : 'DAMAGE'}</div>
                    <div className="text-base font-black text-red-500">{currentWeapon.damage} HP</div>
                  </div>

                  <div className="p-2 bg-neutral-900 border border-neutral-800 rounded-lg">
                    <div className="text-[9px] text-neutral-400 font-bold">{lang === 'ru' ? 'ГОЛОВА HAZMAT' : 'HEAD HAZMAT'}</div>
                    <div className="text-base font-black text-amber-400">{currentWeapon.headshotsHazmat}x Shot</div>
                  </div>

                  <div className="p-2 bg-neutral-900 border border-neutral-800 rounded-lg">
                    <div className="text-[9px] text-neutral-400 font-bold">{lang === 'ru' ? 'ГОЛОВА МВК' : 'HEAD FULL METAL'}</div>
                    <div className="text-base font-black text-sky-400">{currentWeapon.headshotsFullMetal}x Shots</div>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-black/40 border border-neutral-800 text-xs flex items-center justify-between">
                  <span className="text-neutral-400 font-bold">{lang === 'ru' ? 'Модули:' : 'Recommended:'}</span>
                  <span className="text-emerald-400 font-bold">{currentWeapon.recommended}</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CATEGORIZED F1 BINDS */}
          {activeTab === 'binds' && (
            <div className="space-y-4">
              {bindCategories.map((cat, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="text-[10px] font-bold text-amber-400 uppercase tracking-widest font-mono">
                    {lang === 'ru' ? cat.categoryRu : cat.categoryEn}
                  </div>

                  <div className="space-y-1.5">
                    {cat.items.map((b) => (
                      <div
                        key={b.key}
                        onClick={() => handleCopy(b.code, b.key)}
                        className="p-2.5 rounded-xl bg-black/60 border border-neutral-800 hover:border-red-500/50 flex items-center justify-between cursor-pointer transition-all group"
                      >
                        <div className="min-w-0 pr-2">
                          <div className="text-xs font-bold text-white group-hover:text-red-400 transition-colors">
                            {lang === 'ru' ? b.titleRu : b.titleEn}
                          </div>
                          <div className="text-[10px] text-neutral-400 font-mono truncate select-all">
                            {b.code}
                          </div>
                        </div>

                        <button className="px-2.5 py-1 bg-red-600/20 text-red-400 group-hover:bg-red-600 group-hover:text-white rounded text-[10px] font-bold uppercase transition-all shrink-0 flex items-center gap-1">
                          {copiedKey === b.key ? (
                            <>
                              <Check size={12} className="text-emerald-400" />
                              <span>COPIED</span>
                            </>
                          ) : (
                            <>
                              <Copy size={12} />
                              <span>COPY</span>
                            </>
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: ALERTS & SIREN TEST */}
          {activeTab === 'alerts' && (
            <div className="space-y-3 text-xs">
              <div className="p-4 rounded-xl bg-black/60 border border-neutral-800 space-y-3">
                <div className="font-bold text-amber-400 flex items-center gap-2">
                  <ShieldAlert size={16} />
                  <span>{lang === 'ru' ? 'Проверка звука тревоги и уведомлений' : 'Raid Alert Sound & Native Notifications'}</span>
                </div>
                <p className="text-[11px] text-neutral-400 leading-relaxed">
                  {lang === 'ru' 
                    ? 'Проверка отдельного звука тревоги и системных уведомлений Windows через Tauri 2.' 
                    : 'Test distinct raid alert sounds and native Windows notifications via Tauri 2.'}
                </p>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button
                    onClick={handleTestRaidNotification}
                    className="py-2.5 px-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all cursor-pointer text-center text-xs flex items-center justify-center gap-1.5"
                  >
                    <Bell size={13} />
                    <span>{lang === 'ru' ? 'Всплывающее Окно' : 'Windows Toast Alert'}</span>
                  </button>

                  <button
                    onClick={() => playNotificationAudio('raid')}
                    className="py-2.5 px-3 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-xl transition-all cursor-pointer text-center text-xs flex items-center justify-center gap-1.5"
                  >
                    <Volume2 size={13} />
                    <span>{lang === 'ru' ? 'Тест звука рейда' : 'Test Raid Sound'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 bg-black/90 border-t border-neutral-800 flex justify-between items-center text-[10px] text-neutral-500 font-mono">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>RUSTY.LUB HUD OVERLAY • PRESS ALT + O TO TOGGLE</span>
          </span>
          <span className="text-amber-400 font-bold">TAURI 2.0 WINDOWS READY</span>
        </div>
      </motion.div>
    </div>
  );
};

export default QuickOverlayModal;
