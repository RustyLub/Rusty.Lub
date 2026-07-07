import { useState } from 'react';
import { Search, Crosshair, HelpCircle, ChevronRight, CornerDownRight, Shield, Award, Sparkles, Gauge, Compass, Sliders, ListFilter } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import fandomIcons from './fandom_icons.json';
import { ItemImageOrFallback } from './IconUtils';

// --- GAME ACCURATE WEAPON SVG ILLUSTRATIONS ---

const AK47SVG = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
    {/* AK-47 Assault Rifle with wooden stock and handguard */}
    <g transform="translate(5, 5)">
      {/* Wooden Stock */}
      <path d="M5,45 C5,40 15,38 25,40 C30,41 32,45 32,48 L28,62 C28,65 18,65 10,65 C5,65 5,50 5,45 Z" fill="#b45309" stroke="#451a03" strokeWidth="2" />
      <path d="M5,45 C15,45 20,48 25,48" stroke="#451a03" strokeWidth="1" />
      
      {/* Receiver and Dust Cover */}
      <rect x="30" y="42" width="28" height="15" fill="#1f2937" stroke="#111827" strokeWidth="2" />
      <path d="M30,42 L52,42 L54,48 L30,48 Z" fill="#374151" stroke="#111827" strokeWidth="1.5" />
      
      {/* Pistol Grip */}
      <path d="M35,57 L42,75 L48,73 L42,57 Z" fill="#b45309" stroke="#451a03" strokeWidth="1.5" />
      
      {/* Curved Magazine (30 rounds) */}
      <path d="M48,57 C50,65 56,76 66,80 L72,75 C64,71 58,62 55,57 Z" fill="#374151" stroke="#111827" strokeWidth="2" />
      <line x1="50" y1="62" x2="54" y2="61" stroke="#111827" strokeWidth="1.5" />
      <line x1="52" y1="69" x2="57" y2="67" stroke="#111827" strokeWidth="1.5" />
      
      {/* Wooden Handguard */}
      <path d="M58,45 C58,45 72,45 74,49 L74,56 C74,56 64,57 58,57 Z" fill="#92400e" stroke="#451a03" strokeWidth="1.5" />
      
      {/* Gas Block & Barrel */}
      <rect x="58" y="39" width="22" height="4" fill="#1f2937" />
      <rect x="58" y="45" width="30" height="3" fill="#1f2937" />
      <line x1="74" y1="39" x2="82" y2="45" stroke="#1f2937" strokeWidth="2" />
      
      {/* Barrel tip and muzzle brake */}
      <line x1="88" y1="46.5" x2="94" y2="46.5" stroke="#111827" strokeWidth="2" />
      
      {/* Front and Rear Sights */}
      <path d="M84,39 L88,39 L88,46" stroke="#111827" strokeWidth="1.5" />
      <rect x="35" y="39" width="3" height="3" fill="#111827" />
    </g>
  </svg>
);

const LR300SVG = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
    {/* LR-300 Tactical Rifle with sliding stock & grey handguard, based on real model */}
    <g transform="translate(5, 5)">
      {/* Skeletonized Adjustable Stock (Black/Dark grey) */}
      <path d="M4,48 L15,48 M4,60 L24,53" stroke="#111827" strokeWidth="2.5" strokeLinecap="round" />
      <rect x="2" y="46" width="3" height="16" rx="1" fill="#1f2937" stroke="#111827" strokeWidth="1.5" />
      <line x1="12" y1="48" x2="12" y2="58" stroke="#111827" strokeWidth="1.5" />
      <path d="M12,48 L24,48 L24,53" stroke="#1f2937" strokeWidth="2" fill="none" />
      
      {/* Buffer tube */}
      <rect x="18" y="47" width="12" height="4" fill="#374151" stroke="#111827" strokeWidth="1" />
      
      {/* Tactical Receiver */}
      <rect x="28" y="42" width="26" height="14" rx="1" fill="#1f2937" stroke="#111827" strokeWidth="2.5" />
      <rect x="32" y="39" width="20" height="3" fill="#4b5563" /> {/* Top Rail */}
      
      {/* Pistol Grip */}
      <path d="M34,56 L39,72 L45,70 L39,56 Z" fill="#111827" stroke="#1f2937" strokeWidth="1.5" />
      
      {/* PMAG-style slightly curved tactical magazine */}
      <path d="M45,56 L49,76 L59,74 L51,56 Z" fill="#374151" stroke="#111827" strokeWidth="2" />
      <line x1="47" y1="62" x2="53" y2="61" stroke="#111827" strokeWidth="1.5" />
      <line x1="48" y1="68" x2="55" y2="66" stroke="#111827" strokeWidth="1.5" />
      
      {/* Grey Handguard with ventilation holes */}
      <path d="M54,43 L78,43 L78,53 L54,53 Z" fill="#6b7280" stroke="#374151" strokeWidth="2" />
      <circle cx="59" cy="48" r="1.5" fill="#111827" />
      <circle cx="65" cy="48" r="1.5" fill="#111827" />
      <circle cx="71" cy="48" r="1.5" fill="#111827" />
      
      {/* Heavy Barrel and Gas Tube */}
      <rect x="78" y="46" width="12" height="3" fill="#374151" stroke="#111827" strokeWidth="1" />
      {/* Muzzle flash hider */}
      <rect x="90" y="45" width="4" height="5" rx="0.5" fill="#111827" />
      
      {/* Flip up sight posts */}
      <path d="M30,39 L32,35 L34,39 Z" fill="#111827" />
      <path d="M75,43 L77,37 L79,43 Z" fill="#111827" />
    </g>
  </svg>
);

const MP5SVG = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
    {/* MP5A4 submachine gun */}
    <g transform="translate(5, 5)">
      {/* Fixed polymer stock */}
      <path d="M4,44 C4,40 10,40 22,44 L22,56 C12,56 4,56 4,52 Z" fill="#111827" stroke="#1f2937" strokeWidth="1.5" />
      <path d="M22,44 L28,47 L28,53 L22,56 Z" fill="#374151" />
      
      {/* Receiver and Handguard */}
      <rect x="28" y="42" width="24" height="12" fill="#1f2937" stroke="#111827" strokeWidth="2.5" />
      
      {/* Curved 9mm Magazine */}
      <path d="M42,54 C40,64 36,73 28,78 L33,81 C42,75 46,65 47,54 Z" fill="#111827" stroke="#374151" strokeWidth="1.5" />
      
      {/* Polymer Ribbed Handguard */}
      <path d="M52,43 C52,43 70,41 72,47 L70,53 C70,53 58,54 52,54 Z" fill="#111827" stroke="#1f2937" strokeWidth="2" />
      <line x1="56" y1="46" x2="68" y2="46" stroke="#374151" strokeWidth="1.5" />
      <line x1="56" y1="50" x2="68" y2="50" stroke="#374151" strokeWidth="1.5" />
      
      {/* Pistol Grip */}
      <path d="M32,54 L35,70 L41,68 L37,54 Z" fill="#111827" stroke="#1f2937" strokeWidth="1.5" />
      
      {/* Barrel & Hooded front sight */}
      <rect x="72" y="46" width="10" height="3" fill="#374151" stroke="#111827" strokeWidth="1" />
      <circle cx="78" cy="42" r="3.5" stroke="#111827" strokeWidth="1.5" fill="none" />
      <line x1="78" y1="42" x2="78" y2="46" stroke="#111827" strokeWidth="1.5" />
    </g>
  </svg>
);

const ThompsonSVG = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
    {/* Thompson submachine gun */}
    <g transform="translate(5, 5)">
      {/* Classic Wood Stock */}
      <path d="M2,44 C4,40 14,41 24,47 C24,47 25,55 24,59 C14,59 4,58 2,52 Z" fill="#78350f" stroke="#451a03" strokeWidth="2" />
      
      {/* Metal Receiver */}
      <rect x="24" y="44" width="28" height="13" fill="#1f2937" stroke="#111827" strokeWidth="2.5" />
      <rect x="28" y="41" width="18" height="3" fill="#374151" />
      
      {/* Foregrip wood */}
      <path d="M52,49 C52,49 68,49 70,51 L68,56 C68,56 58,56 52,55 Z" fill="#92400e" stroke="#451a03" strokeWidth="1.5" />
      
      {/* Straight Stick Magazine */}
      <rect x="42" y="57" width="6" height="24" rx="0.5" fill="#111827" stroke="#374151" strokeWidth="1.5" />
      
      {/* Pistol Grip */}
      <path d="M28,57 L31,73 L37,71 L33,57 Z" fill="#78350f" stroke="#451a03" strokeWidth="1.5" />
      
      {/* Fin cooled barrel and sight */}
      <rect x="70" y="47" width="16" height="3.5" fill="#1f2937" stroke="#111827" strokeWidth="1" />
      {/* Cooling fins */}
      <line x1="72" y1="46" x2="72" y2="51.5" stroke="#111827" strokeWidth="1" />
      <line x1="75" y1="46" x2="75" y2="51.5" stroke="#111827" strokeWidth="1" />
      <line x1="78" y1="46" x2="78" y2="51.5" stroke="#111827" strokeWidth="1" />
      <line x1="81" y1="46" x2="81" y2="51.5" stroke="#111827" strokeWidth="1" />
      
      {/* Blade front sight */}
      <path d="M82,47 L85,42 L85,47 Z" fill="#111827" />
    </g>
  </svg>
);

const CustomSMGSVG = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
    {/* Custom SMG constructed from scrap metal and wire stock */}
    <g transform="translate(5, 5)">
      {/* Wireframe skeletal stock */}
      <path d="M2,52 L15,52 M15,52 L26,50 L26,55" stroke="#4b5563" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M2,52 L8,68 L14,68" stroke="#4b5563" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      
      {/* Receiver box (highly raw scrap metal with welds) */}
      <rect x="26" y="44" width="25" height="12" fill="#374151" stroke="#111827" strokeWidth="2" />
      {/* Red wire wrap or electrical tape */}
      <rect x="32" y="43" width="5" height="14" fill="#dc2626" rx="0.5" opacity="0.9" />
      
      {/* Bent barrel tube */}
      <rect x="51" y="47" width="22" height="4" fill="#4b5563" stroke="#111827" strokeWidth="1.5" />
      {/* Crude sight welded on front */}
      <path d="M68,47 L70,41 L72,47 Z" fill="#b45309" />
      
      {/* Scrap handle wrapped in tape */}
      <path d="M28,56 L31,72 L37,70 L34,56 Z" fill="#1e293b" stroke="#111827" strokeWidth="1.5" />
      <line x1="29" y1="62" x2="35" y2="60" stroke="#f59e0b" strokeWidth="1.5" /> {/* yellow tape highlights */}
      
      {/* Mismatched curved mag */}
      <path d="M42,56 C44,64 42,74 34,79 L39,82 C48,77 50,66 48,56 Z" fill="#4b5563" stroke="#111827" strokeWidth="1.5" />
    </g>
  </svg>
);

const SARSVG = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
    {/* Semi-Automatic Rifle (SAR) - skeletal wood spade stock */}
    <g transform="translate(5, 5)">
      {/* Spade handle wooden stock */}
      <path d="M2,46 L18,46 L18,58 L2,58 Z" fill="#78350f" stroke="#451a03" strokeWidth="2" />
      {/* Cutout hole in the spade stock */}
      <circle cx="10" cy="52" r="4.5" fill="#14171e" />
      
      {/* Steel pipes connecting stock to receiver */}
      <line x1="18" y1="48" x2="28" y2="48" stroke="#374151" strokeWidth="3" />
      <line x1="18" y1="56" x2="28" y2="56" stroke="#374151" strokeWidth="3" />
      
      {/* Scrap metal Receiver */}
      <rect x="28" y="43" width="26" height="14" fill="#4b5563" stroke="#111827" strokeWidth="2" />
      
      {/* Skinny long pipe barrel */}
      <rect x="54" y="47" width="32" height="3.5" fill="#374151" stroke="#111827" strokeWidth="1.2" />
      {/* Hose clamp on barrel */}
      <rect x="66" y="46.5" width="2" height="4.5" fill="#ca8a04" />
      
      {/* Wooden foregrip (crude scrap board) */}
      <path d="M46,52 L62,52 L62,57 L48,57 Z" fill="#92400e" stroke="#451a03" strokeWidth="1.5" />
      
      {/* Small straight 16rd magazine */}
      <rect x="36" y="57" width="5.5" height="15" fill="#1f2937" stroke="#111827" strokeWidth="1.5" />
      
      {/* Pistol Grip (crude wooden block) */}
      <path d="M30,57 L32,71 L37,70 L34,57 Z" fill="#78350f" stroke="#451a03" strokeWidth="1.5" />
    </g>
  </svg>
);

const HMLMGSVG = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
    {/* Handmade LMG (HMLMG) with shovel handle stock */}
    <g transform="translate(5, 5)">
      {/* Shovel handle rear stock */}
      <path d="M2,52 L16,52" stroke="#4b5563" strokeWidth="4" strokeLinecap="round" />
      <rect x="2" y="45" width="2" height="14" rx="0.5" fill="#78350f" stroke="#451a03" strokeWidth="1.5" />
      <line x1="10" y1="52" x2="14" y2="62" stroke="#4b5563" strokeWidth="2.5" />
      
      {/* Industrial Receiver body */}
      <rect x="22" y="43" width="30" height="15" fill="#374151" stroke="#111827" strokeWidth="2.5" />
      <rect x="26" y="40" width="18" height="3" fill="#dc2626" /> {/* warning label spray */}
      
      {/* Large 60rd ammo drum magazine */}
      <circle cx="36" cy="67" r="11" fill="#1e293b" stroke="#111827" strokeWidth="2.5" />
      <circle cx="36" cy="67" r="5" fill="#334155" />
      
      {/* Coarse perforated barrel heat shield */}
      <rect x="52" y="46" width="26" height="7" rx="1.5" fill="#4b5563" stroke="#111827" strokeWidth="1.5" />
      <circle cx="56" cy="49.5" r="1" fill="#111827" />
      <circle cx="62" cy="49.5" r="1" fill="#111827" />
      <circle cx="68" cy="49.5" r="1" fill="#111827" />
      <circle cx="74" cy="49.5" r="1" fill="#111827" />
      
      {/* Long gun barrel */}
      <rect x="78" y="48" width="12" height="3" fill="#111827" />
    </g>
  </svg>
);

const M249SVG = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
    {/* M249 Military LMG with folded bipod and green magazine box, based on real model */}
    <g transform="translate(5, 5)">
      {/* Solid tactical stock */}
      <path d="M2,44 C2,40 10,40 22,44 L22,55 C12,55 2,54 2,49 Z" fill="#1f2937" stroke="#111827" strokeWidth="2" />
      
      {/* Heavy military receiver */}
      <rect x="22" y="42" width="32" height="14" fill="#374151" stroke="#111827" strokeWidth="2.5" />
      <path d="M26,38 L48,38 L50,42 L24,42 Z" fill="#1f2937" stroke="#111827" strokeWidth="1.5" /> {/* Top feed cover */}
      
      {/* Bipod folded back under handguard */}
      <line x1="56" y1="52" x2="38" y2="57" stroke="#9ca3af" strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="38" cy="57" r="1.2" fill="#4b5563" />
      
      {/* Distinct Olive Green Box Magazine hanging under center */}
      <rect x="34" y="56" width="18" height="19" rx="2" fill="#3f6212" stroke="#14532d" strokeWidth="2.5" />
      {/* Diagonal reinforce line on magazine box */}
      <line x1="36" y1="59" x2="50" y2="72" stroke="#14532d" strokeWidth="2" />
      
      {/* Handguard */}
      <rect x="54" y="45" width="16" height="9" fill="#1f2937" stroke="#111827" strokeWidth="1.5" />
      
      {/* Long Heavy barrel */}
      <rect x="70" y="47" width="18" height="3.5" fill="#374151" stroke="#111827" strokeWidth="1" />
      {/* Carry handle folded */}
      <path d="M46,38 Q52,28 58,38" stroke="#111827" strokeWidth="2" fill="none" />
      
      {/* Front sight post */}
      <path d="M80,47 L82,40 L85,47 Z" fill="#111827" />
    </g>
  </svg>
);

const BoltActionSVG = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
    {/* Bolt Action Sniper Rifle with high-power scope and bolt handle */}
    <g transform="translate(5, 5)">
      {/* Classic long sniper rifle wooden stock */}
      <path d="M2,46 C4,42 16,42 26,45 L36,49 L54,49 C58,49 60,54 50,56 L2,56 Z" fill="#78350f" stroke="#451a03" strokeWidth="2" />
      
      {/* Receiver and bolt mechanism */}
      <rect x="34" y="42" width="22" height="9" fill="#1f2937" stroke="#111827" strokeWidth="2" />
      {/* Bolt handle sticking out and back */}
      <path d="M42,47 L38,42 L34,42" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" fill="none" />
      <circle cx="34" cy="42" r="1.5" fill="#111827" />
      
      {/* Mounted High-Power Scope (8x/16x) */}
      <rect x="36" y="32" width="18" height="5.5" fill="#111827" stroke="#374151" strokeWidth="1.5" />
      {/* Scope bells */}
      <polygon points="36,31 36,38 31,40 31,29" fill="#1f2937" stroke="#111827" strokeWidth="1" />
      <polygon points="54,31 54,38 59,39 59,30" fill="#1f2937" stroke="#111827" strokeWidth="1" />
      {/* Scope mounts */}
      <line x1="39" y1="37" x2="39" y2="42" stroke="#111827" strokeWidth="2" />
      <line x1="51" y1="37" x2="51" y2="42" stroke="#111827" strokeWidth="2" />
      {/* Lens reflection shine */}
      <line x1="56" y1="32" x2="58" y2="37" stroke="#38bdf8" strokeWidth="1" opacity="0.8" />
      
      {/* Trigger guard and trigger */}
      <path d="M34,56 Q40,62 44,56" stroke="#111827" strokeWidth="1.5" fill="none" />
      <line x1="38" y1="52" x2="36" y2="55" stroke="#111827" strokeWidth="1.5" />
      
      {/* Extremely long high accuracy sniper barrel */}
      <rect x="56" y="45" width="34" height="3" fill="#1f2937" stroke="#111827" strokeWidth="1" />
    </g>
  </svg>
);

const PumpShotgunSVG = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
    <rect x="10" y="45" width="80" height="10" fill="#374151" />
  </svg>
);

interface Attachment {
  name: { ru: string; en: string };
  desc: { ru: string; en: string };
  effect: { ru: string; en: string };
  icon: string;
}

interface WeaponGuide {
  id: string;
  name: { ru: string; en: string };
  category: 'rifles' | 'smgs' | 'shotguns' | 'pistols' | 'snipers' | 'special';
  categoryLabel: { ru: string; en: string };
  icon: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'veteran';
  difficultyLabel: { ru: string; en: string };
  difficultyColor: string;
  optimalMin: number; // in meters
  optimalMax: number; // in meters
  stats: {
    damage: number;
    fireRate: number; // RPM
    velocity: number; // m/s
    magazine: number;
    range: number; // Meters
    accuracy: number; // 0-100
  };
  recoilDesc: { ru: string; en: string };
  tip: { ru: string; en: string };
  attachments: Attachment[];
}

const attachmentsDb: Record<string, Attachment> = {
  holosight: {
    name: { ru: 'Голографический прицел', en: 'Holosight' },
    desc: { ru: 'Уменьшает разброс и качание оружия, делая зажим более кучным.', en: 'Reduces bullet spread and weapon sway, making sprays much tighter.' },
    effect: { ru: '-20% Отдача & Колебание', en: '-20% Aim Sway & Spread' },
    icon: '🎯'
  },
  laser: {
    name: { ru: 'Лазерный целеуказатель', en: 'Tactical Laser' },
    desc: { ru: 'Значительно снижает разброс при стрельбе от бедра и качание прицела.', en: 'Greatly reduces hip-fire spread and aim sway when aiming.' },
    effect: { ru: '-15% Шатание ствола', en: '-15% Aim Sway' },
    icon: '🚨'
  },
  silencer: {
    name: { ru: 'Глушитель', en: 'Silencer' },
    desc: { ru: 'Скрывает трассеры пуль и приглушает звук выстрела, убирает дульную вспышку.', en: 'Hides bullet tracers, muffles gunshot sounds, and eliminates muzzle flash.' },
    effect: { ru: 'Скрытность • -10% Урон', en: '100% Stealth • -10% Damage' },
    icon: '🔌'
  },
  muzzle_brake: {
    name: { ru: 'Дульный тормоз', en: 'Muzzle Brake' },
    desc: { ru: 'Сильно облегчает вертикальную отдачу, но увеличивает случайный разброс пуль.', en: 'Significantly reduces vertical recoil, but slightly increases random bullet spread.' },
    effect: { ru: '-50% Вертикальная отдача', en: '-50% Vertical Recoil' },
    icon: '🔩'
  },
  scope8x: {
    name: { ru: 'Оптический прицел x8', en: '8x Zoom Scope' },
    desc: { ru: 'Мощное оптическое увеличение для стрельбы на средние и дальние дистанции.', en: 'Powerful optical magnification for medium to long-range engagements.' },
    effect: { ru: '8x Увеличение', en: '8x Optical Zoom' },
    icon: '🔭'
  },
  scope16x: {
    name: { ru: 'Оптический прицел x16', en: '16x Zoom Scope' },
    desc: { ru: 'Экстремальное снайперское приближение для сверхдальнего огня.', en: 'Extreme sniper magnification for ultra-long-range sniping.' },
    effect: { ru: '16x Увеличение', en: '16x Optical Zoom' },
    icon: '🔍'
  },
  flashlight: {
    name: { ru: 'Оружейный фонарик', en: 'Weapon Flashlight' },
    desc: { ru: 'Освещает темные места и ослепляет противников в ночных перестрелках.', en: 'Illuminates dark areas and temporarily blinds opponents in night fights.' },
    effect: { ru: 'Ослепление противника ночью', en: 'Target Blinding in Dark' },
    icon: '🔦'
  }
};

const weaponsDatabase: WeaponGuide[] = [
  {
    id: 'ak47',
    name: { ru: 'Штурмовая винтовка (Assault Rifle)', en: 'Assault Rifle (AK-47)' },
    category: 'rifles',
    categoryLabel: { ru: 'Автоматы / Винтовки', en: 'Rifles' },
    icon: '🔫',
    difficulty: 'hard',
    difficultyLabel: { ru: 'Высокая (S-образная)', en: 'High (S-Pattern)' },
    difficultyColor: 'text-rose-500 border-rose-500/20 bg-rose-500/5',
    optimalMin: 20,
    optimalMax: 125,
    stats: { damage: 50, fireRate: 450, velocity: 375, magazine: 30, range: 100, accuracy: 80 },
    recoilDesc: {
      ru: 'Первые 5 патронов летят вертикально вверх с легким уклоном вправо. После этого ствол резко уводит влево до 10-го патрона, затем идет плавное смещение вправо. Требует мышечной памяти.',
      en: 'The first 5 bullets travel vertically upwards with a slight right tilt. Then, the barrel pulls sharply left until the 10th bullet, followed by a smooth sway right. Requires active muscle memory.'
    },
    tip: {
      ru: 'Всегда начинайте зажим из положения приседа — это снижает базовую отдачу на 50%. Плавно уводите мышь вниз-влево на старте зажима, а затем компенсируйте горизонтальное смещение зеркально.',
      en: 'Always initiate firing sequences from a crouched state to instantly mitigate basic recoil values by 50%. Pull your mouse down-left on start, then counter horizontal drift.'
    },
    attachments: [attachmentsDb.holosight, attachmentsDb.laser, attachmentsDb.silencer]
  },
  {
    id: 'lr300',
    name: { ru: 'LR-300 Assault Rifle', en: 'LR-300 Assault Rifle' },
    category: 'rifles',
    categoryLabel: { ru: 'Автоматы / Винтовки', en: 'Rifles' },
    icon: '💥',
    difficulty: 'medium',
    difficultyLabel: { ru: 'Средняя (Простая)', en: 'Medium (Easy)' },
    difficultyColor: 'text-amber-500 border-amber-500/20 bg-amber-500/5',
    optimalMin: 30,
    optimalMax: 150,
    stats: { damage: 40, fireRate: 500, velocity: 375, magazine: 30, range: 100, accuracy: 85 },
    recoilDesc: {
      ru: 'Очень простая, почти линейная отдача с минимальным горизонтальным уводом. Ствол плавно движется вверх и слегка вправо. Легко поддается контролю даже без опыта.',
      en: 'Highly predictable, near-linear vertical recoil with minor horizontal sway. The barrel glides upwards and slightly right. Very easy to control even for beginners.'
    },
    tip: {
      ru: 'LR-300 идеальна для зажима с оптикой x8 на средних и дальних дистанциях. С лазером и голографом винтовка превращается в лазерный луч с минимальным разбросом.',
      en: 'LR-300 is perfectly tailored for long-range beaming with an 8x scope. Equipped with a laser and holosight, bullet spread is virtually eliminated.'
    },
    attachments: [attachmentsDb.scope8x, attachmentsDb.holosight, attachmentsDb.laser]
  },
  {
    id: 'mp5',
    name: { ru: 'Пистолет-пулемет MP5A4', en: 'MP5A4 SMG' },
    category: 'smgs',
    categoryLabel: { ru: 'Пистолеты-пулеметы', en: 'SMGs' },
    icon: '⚡',
    difficulty: 'hard',
    difficultyLabel: { ru: 'Высокая (Горизонтальная)', en: 'High (Horizontal)' },
    difficultyColor: 'text-rose-400 border-rose-400/20 bg-rose-400/5',
    optimalMin: 10,
    optimalMax: 55,
    stats: { damage: 35, fireRate: 600, velocity: 300, magazine: 30, range: 50, accuracy: 70 },
    recoilDesc: {
      ru: 'Высокий темп стрельбы создает агрессивную горизонтальную тряску. Первые 4 патрона идут вверх, затем начинается резкий зигзагообразный увод влево и вправо.',
      en: 'The blistering rate of fire triggers high-frequency horizontal wobble. The first 4 rounds climb straight up, followed by a tight zig-zag shift left and right.'
    },
    tip: {
      ru: 'Голографический прицел критически важен на MP5, так как он программно снижает амплитуду шатания камеры при стрельбе на 20%. Старайтесь вести бой в упор.',
      en: 'A Holosight is absolutely mandatory for the MP5; it curtails visual screen shake by 20% in active firing. Aim for tight, close-quarter interactions.'
    },
    attachments: [attachmentsDb.holosight, attachmentsDb.laser, attachmentsDb.flashlight]
  },
  {
    id: 'thompson',
    name: { ru: 'Пистолет-пулемет Томпсона', en: 'Thompson SMG' },
    category: 'smgs',
    categoryLabel: { ru: 'Пистолеты-пулеметы', en: 'SMGs' },
    icon: '🥁',
    difficulty: 'easy',
    difficultyLabel: { ru: 'Легкая (Умеренная)', en: 'Easy (Moderate)' },
    difficultyColor: 'text-emerald-400 border-emerald-400/20 bg-emerald-400/5',
    optimalMin: 10,
    optimalMax: 65,
    stats: { damage: 38, fireRate: 462, velocity: 300, magazine: 20, range: 45, accuracy: 65 },
    recoilDesc: {
      ru: 'Умеренная вертикальная отдача и очень слабый горизонтальный увод. Оружие предсказуемо поднимается вверх-вправо, что легко компенсируется легким движением вниз-влево.',
      en: 'Mild vertical drift paired with comfortable horizontal shake. The barrel smoothly rises up and right, easily offset by a steady pull down-left.'
    },
    tip: {
      ru: 'Превосходное оружие для ранних стадий вайпа. С лазером Thompson отлично стреляет "от бедра" при агрессивных рашах.',
      en: 'A superb early-to-mid wipe choice. Equipped with a tactical laser, the Thompson dominates in close-range run-and-gun hip-fire rushes.'
    },
    attachments: [attachmentsDb.holosight, attachmentsDb.laser, attachmentsDb.silencer]
  },
  {
    id: 'custom',
    name: { ru: 'Custom SMG (Кустарный ПП)', en: 'Custom SMG' },
    category: 'smgs',
    categoryLabel: { ru: 'Пистолеты-пулеметы', en: 'SMGs' },
    icon: '⚙️',
    difficulty: 'easy',
    difficultyLabel: { ru: 'Легкая (Вертикальная)', en: 'Easy (Vertical)' },
    difficultyColor: 'text-emerald-400 border-emerald-400/20 bg-emerald-400/5',
    optimalMin: 5,
    optimalMax: 40,
    stats: { damage: 32, fireRate: 600, velocity: 240, magazine: 24, range: 35, accuracy: 60 },
    recoilDesc: {
      ru: 'Высокая частота выстрелов быстро задирает ствол вверх, но горизонтальный увод почти отсутствует. Достаточно тянуть мышку строго вниз.',
      en: 'The rapid cycling rate quickly pushes the barrel straight up, but horizontal drift is nearly non-existent. Simply pull the mouse directly down.'
    },
    tip: {
      ru: 'Custom SMG имеет самую низкую скорость полета пули, поэтому стрельба по бегущим целям далее 45 метров малоэффективна. Идеально раскрывается в засадах с глушителем.',
      en: 'The Custom SMG suffers from slow bullet velocity, making lead shots past 45m highly unreliable. Excels beautifully in stealth ambushes using a silencer.'
    },
    attachments: [attachmentsDb.silencer, attachmentsDb.laser, attachmentsDb.flashlight]
  },
  {
    id: 'sar',
    name: { ru: 'Полуавтоматическая винтовка (SAR)', en: 'Semi-Automatic Rifle (SAR)' },
    category: 'rifles',
    categoryLabel: { ru: 'Автоматы / Винтовки', en: 'Rifles' },
    icon: '🏹',
    difficulty: 'easy',
    difficultyLabel: { ru: 'Легкая (Одиночная)', en: 'Easy (Semi-Auto)' },
    difficultyColor: 'text-emerald-400 border-emerald-400/20 bg-emerald-400/5',
    optimalMin: 25,
    optimalMax: 100,
    stats: { damage: 40, fireRate: 343, velocity: 375, magazine: 16, range: 80, accuracy: 75 },
    recoilDesc: {
      ru: 'Оружие стреляет одиночными. При быстром кликанье ствол совершает короткие скачки вверх, которые быстро затухают самостоятельно.',
      en: 'Fires semi-automatically. Rapid spam trigger pulls cause brief vertical jumps which settle quickly on their own.'
    },
    tip: {
      ru: 'Не пытайтесь кликать со всей скоростью на дальней дистанции. Делайте паузы в 0.3 секунды между выстрелами, чтобы прицельная марка успевала вернуться в исходную точку.',
      en: 'Do not spam-click at maximum frequency at a distance. Maintain 0.3s intervals between shots to let your ironsights or red dot settle for 100% accuracy.'
    },
    attachments: [attachmentsDb.holosight, attachmentsDb.laser, attachmentsDb.flashlight]
  },
  {
    id: 'hmlmg',
    name: { ru: 'Ручной пулемет (HMLMG)', en: 'Handmade LMG' },
    category: 'special',
    categoryLabel: { ru: 'Спец. оружие / Пулеметы', en: 'Heavy Weapons / LMGs' },
    icon: '🛠️',
    difficulty: 'hard',
    difficultyLabel: { ru: 'Очень высокая (Хаотичная)', en: 'Very High (Chaotic)' },
    difficultyColor: 'text-rose-500 border-rose-500/20 bg-rose-500/5',
    optimalMin: 40,
    optimalMax: 120,
    stats: { damage: 45, fireRate: 500, velocity: 375, magazine: 60, range: 110, accuracy: 80 },
    recoilDesc: {
      ru: 'Обладает массивной вертикальной отдачей и хаотичным боковым биением из стороны в сторону. Контролировать полный магазин без модулей практически невозможно.',
      en: 'Features immense vertical climb coupled with randomized lateral shaking. Controlling a full spray without attachments is an extreme challenge.'
    },
    tip: {
      ru: 'Для гашения дикого горизонтального шатания всегда используйте Дульный тормоз в паре с Голографом. Это режет отдачу на 50% и упрощает стрельбу из укрытия сидя.',
      en: 'To neutralize chaotic side-to-side recoil, always combine a Muzzle Brake with a Holosight. This slashes recoil values by 50% for comfortable crouch spraying.'
    },
    attachments: [attachmentsDb.muzzle_brake, attachmentsDb.holosight, attachmentsDb.laser]
  },
  {
    id: 'm249',
    name: { ru: 'Военный пулемет M249', en: 'M249 LMG' },
    category: 'special',
    categoryLabel: { ru: 'Спец. оружие / Пулеметы', en: 'Heavy Weapons / LMGs' },
    icon: '👑',
    difficulty: 'veteran',
    difficultyLabel: { ru: 'Легендарная (Вертикальная)', en: 'Legendary (Vertical)' },
    difficultyColor: 'text-purple-500 border-purple-500/20 bg-purple-500/5',
    optimalMin: 50,
    optimalMax: 200,
    stats: { damage: 65, fireRate: 500, velocity: 488, magazine: 100, range: 120, accuracy: 85 },
    recoilDesc: {
      ru: 'Самая тяжелая вертикальная отдача в игре, буквально уносящая ствол в небо за секунду, но полное отсутствие горизонтального разброса при стрельбе сидя.',
      en: 'Features the most aggressive vertical climb in the game, rapidly pulling the gun skyward, but exhibits zero horizontal sway when crouched.'
    },
    tip: {
      ru: 'НИКОГДА не зажимайте из M249 стоя. Обязательно приседайте перед выстрелом — сидя пулемет превращается в идеальный инструмент защиты базы с нулевой горизонтальной отдачей.',
      en: 'NEVER try to spray the M249 while standing. Always crouch before shooting; doing so turns this LMG into the ultimate base-defense laser with zero horizontal spread.'
    },
    attachments: [attachmentsDb.scope8x, attachmentsDb.holosight, attachmentsDb.laser]
  },
  {
    id: 'bolt',
    name: { ru: 'Снайперская винтовка (Bolt Action)', en: 'Bolt Action Rifle' },
    category: 'special',
    categoryLabel: { ru: 'Спец. оружие / Пулеметы', en: 'Heavy Weapons / LMGs' },
    icon: '🎯',
    difficulty: 'medium',
    difficultyLabel: { ru: 'Снайперская (Баллистика)', en: 'Sniper (Ballistics)' },
    difficultyColor: 'text-amber-400 border-amber-400/20 bg-amber-400/5',
    optimalMin: 100,
    optimalMax: 300,
    stats: { damage: 80, fireRate: 40, velocity: 656, magazine: 4, range: 150, accuracy: 95 },
    recoilDesc: {
      ru: 'Автоматическая отдача отсутствует из-за продольно-скользящего затвора. Основная сложность — расчет баллистического падения пули на сверхдальних дистанциях.',
      en: 'Recoil control is non-applicable due to single bolt-action cycling. The core difficulty lies in compensating for bullet drop at extreme distances.'
    },
    tip: {
      ru: 'Всегда заряжайте Скоростные патроны (HV Ammo), чтобы минимизировать падение пули и увеличить скорость её полета. Лазерный целеуказатель стабилизирует перекрестие в прицеле.',
      en: 'Always load High Velocity (HV) ammunition to flatten bullet trajectory and speed. A tactical laser is valuable for settling reticle shake on high magnification scopes.'
    },
    attachments: [attachmentsDb.scope8x, attachmentsDb.scope16x, attachmentsDb.laser]
  },
  {
    id: 'revolver',
    name: { ru: 'Револьвер', en: 'Revolver' },
    category: 'pistols',
    categoryLabel: { ru: 'Пистолеты', en: 'Pistols' },
    icon: '🔫',
    difficulty: 'medium',
    difficultyLabel: { ru: 'Средняя', en: 'Medium' },
    difficultyColor: 'text-amber-500 border-amber-500/20 bg-amber-500/5',
    optimalMin: 5,
    optimalMax: 50,
    stats: { damage: 35, fireRate: 240, velocity: 200, magazine: 8, range: 50, accuracy: 60 },
    recoilDesc: { ru: 'Сильный подброс.', en: 'Strong recoil.' },
    tip: { ru: 'Неплохо в начале вайпа.', en: 'Decent early wipe.' },
    attachments: []
  },
  {
    id: 'sap',
    name: { ru: 'Полуавтоматический пистолет (SAP)', en: 'Semi-Automatic Pistol (SAP)' },
    category: 'pistols',
    categoryLabel: { ru: 'Пистолеты', en: 'Pistols' },
    icon: '🔫',
    difficulty: 'easy',
    difficultyLabel: { ru: 'Легкая', en: 'Easy' },
    difficultyColor: 'text-emerald-400 border-emerald-400/20 bg-emerald-400/5',
    optimalMin: 10,
    optimalMax: 60,
    stats: { damage: 35, fireRate: 450, velocity: 240, magazine: 10, range: 60, accuracy: 75 },
    recoilDesc: { ru: 'Стандартная вертикальная отдача.', en: 'Standard vertical recoil.' },
    tip: { ru: 'Хороший стартовый вариант.', en: 'Good starter weapon.' },
    attachments: [attachmentsDb.laser]
  },
  {
    id: 'pump_shotgun',
    name: { ru: 'Помповый дробовик', en: 'Pump Shotgun' },
    category: 'shotguns',
    categoryLabel: { ru: 'Дробовики', en: 'Shotguns' },
    icon: '💥',
    difficulty: 'easy',
    difficultyLabel: { ru: 'Легкая', en: 'Easy' },
    difficultyColor: 'text-emerald-400 border-emerald-400/20 bg-emerald-400/5',
    optimalMin: 5,
    optimalMax: 30,
    stats: { damage: 100, fireRate: 60, velocity: 225, magazine: 6, range: 30, accuracy: 50 },
    recoilDesc: { ru: 'Средняя отдача.', en: 'Medium recoil.' },
    tip: { ru: 'Отличен в упор.', en: 'Great at close range.' },
    attachments: [attachmentsDb.laser]
  },
  {
    id: 'm92',
    name: { ru: 'Пистолет M92', en: 'M92 Beretta' },
    category: 'pistols',
    categoryLabel: { ru: 'Пистолеты', en: 'Pistols' },
    icon: '🔫',
    difficulty: 'easy',
    difficultyLabel: { ru: 'Легкая', en: 'Easy' },
    difficultyColor: 'text-emerald-400 border-emerald-400/20 bg-emerald-400/5',
    optimalMin: 10,
    optimalMax: 50,
    stats: { damage: 35, fireRate: 400, velocity: 300, magazine: 15, range: 50, accuracy: 70 },
    recoilDesc: { ru: 'Низкая отдача.', en: 'Low recoil.' },
    tip: { ru: 'Хороший пистолет.', en: 'Good pistol.' },
    attachments: [attachmentsDb.laser]
  },
  {
    id: 'python',
    name: { ru: 'Револьвер Питон', en: 'Python Revolver' },
    category: 'pistols',
    categoryLabel: { ru: 'Пистолеты', en: 'Pistols' },
    icon: '🔫',
    difficulty: 'hard',
    difficultyLabel: { ru: 'Высокая', en: 'Hard' },
    difficultyColor: 'text-rose-500 border-rose-500/20 bg-rose-500/5',
    optimalMin: 20,
    optimalMax: 70,
    stats: { damage: 60, fireRate: 200, velocity: 300, magazine: 6, range: 70, accuracy: 80 },
    recoilDesc: { ru: 'Сильная отдача.', en: 'Strong recoil.' },
    tip: { ru: 'Убийственный урон.', en: 'Deadly damage.' },
    attachments: [attachmentsDb.holosight]
  },
  {
    id: 'm16a2',
    name: { ru: 'M16A2', en: 'M16A2' },
    category: 'rifles',
    categoryLabel: { ru: 'Винтовки', en: 'Rifles' },
    icon: '🔫',
    difficulty: 'medium',
    difficultyLabel: { ru: 'Средняя', en: 'Medium' },
    difficultyColor: 'text-amber-500 border-amber-500/20 bg-amber-500/5',
    optimalMin: 20,
    optimalMax: 100,
    stats: { damage: 45, fireRate: 450, velocity: 350, magazine: 30, range: 100, accuracy: 80 },
    recoilDesc: { ru: 'Стандартная отдача.', en: 'Standard recoil.' },
    tip: { ru: 'Хороша на средних.', en: 'Good for medium range.' },
    attachments: [attachmentsDb.laser]
  },
  {
    id: 'm39',
    name: { ru: 'Винтовка M39', en: 'M39 Rifle' },
    category: 'rifles',
    categoryLabel: { ru: 'Винтовки', en: 'Rifles' },
    icon: '🔫',
    difficulty: 'medium',
    difficultyLabel: { ru: 'Средняя', en: 'Medium' },
    difficultyColor: 'text-amber-500 border-amber-500/20 bg-amber-500/5',
    optimalMin: 50,
    optimalMax: 150,
    stats: { damage: 55, fireRate: 300, velocity: 400, magazine: 20, range: 150, accuracy: 90 },
    recoilDesc: { ru: 'Низкая отдача.', en: 'Low recoil.' },
    tip: { ru: 'Для точной стрельбы.', en: 'For precision.' },
    attachments: [attachmentsDb.scope8x, attachmentsDb.laser]
  },
  {
    id: 'l96',
    name: { ru: 'Винтовка L96', en: 'L96 Rifle' },
    category: 'snipers',
    categoryLabel: { ru: 'Снайперки', en: 'Snipers' },
    icon: '🎯',
    difficulty: 'hard',
    difficultyLabel: { ru: 'Высокая', en: 'Hard' },
    difficultyColor: 'text-rose-500 border-rose-500/20 bg-rose-500/5',
    optimalMin: 100,
    optimalMax: 500,
    stats: { damage: 90, fireRate: 30, velocity: 800, magazine: 5, range: 500, accuracy: 98 },
    recoilDesc: { ru: 'Затворная.', en: 'Bolt action.' },
    tip: { ru: 'Летальный исход.', en: 'Deadly.' },
    attachments: [attachmentsDb.scope16x, attachmentsDb.laser]
  },
  {
    id: 'double_barrel',
    name: { ru: 'Двуствольный дробовик', en: 'Double Barrel Shotgun' },
    category: 'shotguns',
    categoryLabel: { ru: 'Дробовики', en: 'Shotguns' },
    icon: '💥',
    difficulty: 'easy',
    difficultyLabel: { ru: 'Легкая', en: 'Easy' },
    difficultyColor: 'text-emerald-400 border-emerald-400/20 bg-emerald-400/5',
    optimalMin: 0,
    optimalMax: 15,
    stats: { damage: 120, fireRate: 100, velocity: 200, magazine: 2, range: 15, accuracy: 40 },
    recoilDesc: { ru: 'Высокая.', en: 'High.' },
    tip: { ru: 'Идеален для засад.', en: 'Great for ambushes.' },
    attachments: [attachmentsDb.laser]
  },
  {
    id: 'waterpipe',
    name: { ru: 'Самодельный дробовик', en: 'Waterpipe Shotgun' },
    category: 'shotguns',
    categoryLabel: { ru: 'Дробовики', en: 'Shotguns' },
    icon: '💥',
    difficulty: 'easy',
    difficultyLabel: { ru: 'Легкая', en: 'Easy' },
    difficultyColor: 'text-emerald-400 border-emerald-400/20 bg-emerald-400/5',
    optimalMin: 0,
    optimalMax: 10,
    stats: { damage: 100, fireRate: 20, velocity: 150, magazine: 1, range: 10, accuracy: 30 },
    recoilDesc: { ru: 'Средняя.', en: 'Medium.' },
    tip: { ru: 'Дешево и сердито.', en: 'Cheap and dirty.' },
    attachments: []
  },
  {
    id: 'spas12',
    name: { ru: 'Дробовик Spas-12', en: 'Spas-12 Shotgun' },
    category: 'shotguns',
    categoryLabel: { ru: 'Дробовики', en: 'Shotguns' },
    icon: '💥',
    difficulty: 'medium',
    difficultyLabel: { ru: 'Средняя', en: 'Medium' },
    difficultyColor: 'text-amber-500 border-amber-500/20 bg-amber-500/5',
    optimalMin: 0,
    optimalMax: 25,
    stats: { damage: 90, fireRate: 80, velocity: 250, magazine: 6, range: 25, accuracy: 55 },
    recoilDesc: { ru: 'Средняя.', en: 'Medium.' },
    tip: { ru: 'Автоматический дробовик.', en: 'Semi-auto shotgun.' },
    attachments: [attachmentsDb.laser]
  }
];

export default function WeaponGuidesTab({ lang }: { lang: 'ru' | 'en' }) {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'rifles' | 'smgs' | 'special'>('all');
  const [selectedWeapon, setSelectedWeapon] = useState<WeaponGuide | null>(null);

  const weaponSvgMap: Record<string, React.FC<{ size?: number }>> = {
    'ak47': AK47SVG,
    'lr300': LR300SVG,
    'mp5': MP5SVG,
    'thompson': ThompsonSVG,
    'custom': CustomSMGSVG,
    'sar': SARSVG,
    'hmlmg': HMLMGSVG,
    'm249': M249SVG,
    'bolt': BoltActionSVG,
    'm16a2': AK47SVG,
    'm39': SARSVG,
    'l96': BoltActionSVG,
    'double_barrel': PumpShotgunSVG, // Assuming I need to add PumpShotgunSVG
    'waterpipe': PumpShotgunSVG,
    'spas12': PumpShotgunSVG,
  };

  const WeaponIcon = ({ id, size = 24 }: { id: string; size?: number }) => {
    const Svg = weaponSvgMap[id] || AK47SVG;
    return (
      <ItemImageOrFallback id={id} lang={lang} fallback={Svg} size={size} />
    );
  };

  const filteredWeapons = weaponsDatabase.filter((w) => {
    const matchesCategory = categoryFilter === 'all' || w.category === categoryFilter;
    const matchesSearch =
      w.name[lang].toLowerCase().includes(search.toLowerCase()) ||
      w.recoilDesc[lang].toLowerCase().includes(search.toLowerCase()) ||
      w.categoryLabel[lang].toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-4">
      {/* Header and Controls */}
      <div className="flex flex-col xl:flex-row gap-3 justify-between items-stretch xl:items-center bg-[#14171e] p-4 border border-[#cd412b]/50 shadow-[0_0_10px_rgba(205,65,43,0.3),_0_0_10px_rgba(59,130,246,0.3)]">
        {/* Search */}
        <div className="relative flex-1 max-w-lg">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={lang === 'ru' ? "Поиск..." : "Search..."}
            className="w-full bg-[#0c0d10] border border-[#2a2f3b] text-[#e1e1e6] placeholder-gray-600 pl-10 pr-3 py-2 rounded text-sm outline-none transition-all"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-1">
          {[
            { id: 'all', label: lang === 'ru' ? 'Все' : 'All' },
            { id: 'rifles', label: lang === 'ru' ? 'Винтовки' : 'Rifles' },
            { id: 'smgs', label: lang === 'ru' ? 'ПП' : 'SMGs' },
            { id: 'shotguns', label: lang === 'ru' ? 'Дробовики' : 'Shotguns' },
            { id: 'pistols', label: lang === 'ru' ? 'Пистолеты' : 'Pistols' },
            { id: 'snipers', label: lang === 'ru' ? 'Снайперки' : 'Snipers' },
            { id: 'special', label: lang === 'ru' ? 'Спец' : 'Special' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id as any)}
              className={`px-3 py-1.5 text-xs uppercase ${
                categoryFilter === cat.id
                  ? 'bg-[#cd412b] text-white'
                  : 'text-gray-400 hover:text-white bg-[#1b1e26]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* WEAPONS LIST */}
        <div className={`${selectedWeapon ? 'lg:col-span-6' : 'lg:col-span-12'} grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3`}>
          <AnimatePresence mode="popLayout">
            {filteredWeapons.map((weapon, idx) => {
              const isSelected = selectedWeapon?.id === weapon.id;
              return (
                <motion.div
                  key={weapon.id}
                  layout
                  onClick={() => setSelectedWeapon(weapon)}
                  className={`p-4 bg-[#14171e] border cursor-pointer flex flex-col justify-between h-36 transition-all ${
                    isSelected ? 'border-[#cd412b]' : 'border-[#2a2f3b] hover:border-gray-600'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] text-gray-500 uppercase">{weapon.categoryLabel[lang]}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 flex items-center justify-center bg-[#1b1e26] border border-[#cd412b]/30">
                      {WeaponIcon({ id: weapon.id, size: 30 })}
                    </div>
                    <h3 className="text-sm font-bold text-white uppercase">{weapon.name[lang]}</h3>
                  </div>
                  <div className="text-[10px] text-gray-500">{weapon.recoilDesc[lang]}</div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>


        {/* DETAILED PANEL VIEW */}
        {selectedWeapon && (
          <div className="lg:col-span-6 space-y-4">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="bg-[#14171e]/95 border-2 border-[#cd412b] p-6 rounded-none relative overflow-hidden shadow-2xl shadow-[0_0_20px_rgba(205,65,43,0.5)] space-y-6"
            >
              {/* Corner tactical brackets */}
              <div className="rust-bracket-tl" />
              <div className="rust-bracket-tr" />
              <div className="rust-bracket-bl" />
              <div className="rust-bracket-br" />
              
              {/* Top orange hazard stripe */}
              <div className="absolute top-0 left-0 right-0 h-1.5 rust-hazard" />

              {/* Title Section */}
              <div className="flex justify-between items-start border-b border-[#2a2f3b] pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 flex items-center justify-center bg-[#1b1e26] border border-[#2a2f3b] select-none p-1">
                    <WeaponIcon id={selectedWeapon.id} size={56} />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-[#cd412b] font-bold uppercase tracking-widest block">
                      {selectedWeapon.categoryLabel[lang]}
                    </span>
                    <h2 className="text-xl font-black text-white uppercase font-mono tracking-wide">
                      {selectedWeapon.name[lang]}
                    </h2>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedWeapon(null)}
                  className="px-2 py-1 bg-[#1b1e26] hover:bg-[#cd412b] hover:text-white border border-[#2a2f3b] text-gray-400 transition-all font-mono text-[10px] uppercase font-bold cursor-pointer"
                >
                  {lang === 'ru' ? 'Закрыть' : 'Close'}
                </button>
              </div>

              {/* Statistics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { label: lang === 'ru' ? 'Урон' : 'Damage', value: selectedWeapon.stats.damage, suffix: 'HP', icon: <Crosshair size={12} className="text-[#cd412b]" /> },
                  { label: lang === 'ru' ? 'Темп стрельбы' : 'Fire Rate', value: selectedWeapon.stats.fireRate, suffix: 'RPM', icon: <Gauge size={12} className="text-[#cd412b]" /> },
                  { label: lang === 'ru' ? 'Скорость пули' : 'Velocity', value: selectedWeapon.stats.velocity, suffix: 'm/s', icon: <Compass size={12} className="text-[#cd412b]" /> },
                  { label: lang === 'ru' ? 'Магазин' : 'Magazine', value: selectedWeapon.stats.magazine, suffix: lang === 'ru' ? 'патр.' : 'rds', icon: <Sliders size={12} className="text-[#cd412b]" /> },
                  { label: lang === 'ru' ? 'Дистанция' : 'Range', value: selectedWeapon.stats.range, suffix: 'm', icon: <Compass size={12} className="text-[#cd412b]" /> },
                  { label: lang === 'ru' ? 'Точность' : 'Accuracy', value: selectedWeapon.stats.accuracy, suffix: '%', icon: <Crosshair size={12} className="text-[#cd412b]" /> }
                ].map((stat, i) => (
                  <div key={i} className="bg-[#0c0d10] border border-[#2a2f3b] p-3 text-center relative">
                    <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-gray-600" />
                    <div className="absolute top-0.5 right-0.5 w-1 h-1 bg-gray-600" />
                    <div className="flex items-center justify-center gap-1.5 mb-1">
                      {stat.icon}
                      <span className="text-[9px] text-gray-500 uppercase font-mono font-bold">{stat.label}</span>
                    </div>
                    <span className="text-sm font-black text-white font-mono">{stat.value}</span>
                    <span className="text-[9px] text-gray-400 font-mono ml-0.5">{stat.suffix}</span>
                  </div>
                ))}
              </div>

              {/* VISUALIZED OPTIMAL RANGE SLIDER */}
              <div className="space-y-3 bg-[#0c0d10]/60 p-4 border border-[#2a2f3b] relative">
                <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-gray-600" />
                <div className="absolute top-0.5 right-0.5 w-1 h-1 bg-gray-600" />
                <div className="flex justify-between items-center text-[10.5px] font-mono">
                  <span className="text-gray-400 font-black uppercase flex items-center gap-1">
                    <Gauge size={12} className="text-[#cd412b]" />
                    {lang === 'ru' ? 'Оптимальная дистанция ведения огня' : 'Optimal Engagement Distance'}
                  </span>
                  <span className="text-[#cd412b] font-black">{selectedWeapon.optimalMin}м - {selectedWeapon.optimalMax}м</span>
                </div>

                {/* Range Gauge visual bar */}
                <div className="relative pt-2 pb-5">
                  <div className="w-full h-2 bg-[#1b1e26] border border-[#2a2f3b] relative rounded-none">
                    {/* Highlighted section */}
                    <div
                      className="absolute h-full bg-gradient-to-r from-[#cd412b]/70 to-[#cd412b] shadow-[0_0_8px_rgba(205,65,43,0.4)]"
                      style={{
                        left: `${(selectedWeapon.optimalMin / 300) * 100}%`,
                        width: `${((selectedWeapon.optimalMax - selectedWeapon.optimalMin) / 300) * 100}%`
                      }}
                    />
                    {/* Interactive dots representing current boundaries */}
                    <div
                      className="absolute -top-1 w-4 h-4 rounded-full bg-[#cd412b] border border-white flex items-center justify-center text-[8px] font-black text-white shadow-md cursor-default select-none"
                      style={{ left: `calc(${(selectedWeapon.optimalMin / 300) * 100}% - 8px)` }}
                    >
                      M
                    </div>
                    <div
                      className="absolute -top-1 w-4 h-4 rounded-full bg-[#cd412b] border border-white flex items-center justify-center text-[8px] font-black text-white shadow-md cursor-default select-none"
                      style={{ left: `calc(${(selectedWeapon.optimalMax / 300) * 100}% - 8px)` }}
                    >
                      X
                    </div>
                  </div>

                  {/* Tick Marks for m */}
                  <div className="absolute bottom-0 inset-x-0 flex justify-between text-[8.5px] font-mono text-gray-500 pt-1 select-none">
                    <span>0м</span>
                    <span>50м</span>
                    <span>100м</span>
                    <span>150м</span>
                    <span>200м</span>
                    <span>300м+</span>
                  </div>
                </div>
              </div>

              {/* Recoil Spray Pattern Description */}
              <div className="space-y-2 bg-[#0c0d10]/60 p-4 border border-[#2a2f3b] relative">
                <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-gray-600" />
                <div className="absolute top-0.5 right-0.5 w-1 h-1 bg-gray-600" />
                <div className="flex items-center gap-1.5 text-xs font-black uppercase text-gray-200 font-mono">
                  <Crosshair size={12} className="text-[#cd412b]" />
                  <span>{lang === 'ru' ? 'Паттерн поведения отдачи' : 'Recoil Spray Pattern Profile'}</span>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed font-sans font-medium">
                  {selectedWeapon.recoilDesc[lang]}
                </p>
              </div>

              {/* RECOMMENDED ATTACHMENTS */}
              <div className="space-y-3">
                <span className="text-[10.5px] font-mono font-black uppercase text-gray-400 tracking-wider block flex items-center gap-1.5">
                  <Sliders size={12} className="text-[#cd412b]" />
                  {lang === 'ru' ? 'Рекомендуемые модули для контроля' : 'Recommended Recoil-Control Attachments'}
                </span>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {selectedWeapon.attachments.map((attach, idx) => (
                    <div
                      key={idx}
                      className="bg-[#1b1e26]/90 border border-[#2a2f3b] p-3.5 hover:border-[#cd412b]/50 transition-colors flex flex-col justify-between relative"
                    >
                      <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-gray-600" />
                      <div className="absolute top-0.5 right-0.5 w-1 h-1 bg-gray-600" />
                      
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xl bg-black/40 w-8 h-8 flex items-center justify-center border border-[#2a2f3b]">
                            {attach.icon}
                          </span>
                          <span className="text-[11.5px] font-black text-white font-mono uppercase tracking-wide leading-none">
                            {attach.name[lang]}
                          </span>
                        </div>
                        <p className="text-[10px] text-gray-400 font-sans leading-normal">
                          {attach.desc[lang]}
                        </p>
                      </div>

                      <div className="mt-3 text-[9px] font-mono font-bold uppercase text-[#cd412b] bg-[#cd412b]/5 border border-[#cd412b]/20 py-1 px-2 text-center">
                        {attach.effect[lang]}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* EAC Leader Pro Tip */}
              <div className="relative overflow-hidden bg-emerald-950/20 border border-emerald-500/20 p-4">
                <div className="absolute top-0 right-0 w-2 h-full bg-emerald-500 opacity-20" />
                <div className="flex items-start gap-3">
                  <div className="bg-emerald-500/10 text-emerald-400 p-1.5 border border-emerald-500/20 mt-0.5 text-xs">
                    <Award size={14} className="animate-pulse" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-[10px] font-black tracking-widest text-emerald-400 uppercase font-mono leading-none">
                      {lang === 'ru' ? '🏆 СОВЕТ ЛИДЕРА КЛАНА [EAC]' : '🏆 LEADER PRO-TIP [EAC]'}
                    </h4>
                    <p className="text-[11px] text-emerald-100/80 leading-relaxed font-sans font-medium">
                      {selectedWeapon.tip[lang]}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>

      {/* FOOTER METADATA SUMMARY CARD */}
      <div className="bg-[#14171e]/90 border border-[#2a2f3b] rounded-none p-5 text-left relative overflow-hidden">
        <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-gray-600" />
        <div className="absolute top-0.5 right-0.5 w-1 h-1 bg-gray-600" />
        <div className="flex items-start gap-3">
          <div className="bg-[#cd412b]/10 text-[#cd412b] p-1.5 border border-[#cd412b]/20 mt-0.5 text-xs">
            <HelpCircle size={14} />
          </div>
          <div className="space-y-1">
            <h4 className="text-[10px] font-black tracking-widest text-[#cd412b] uppercase font-mono leading-none">
              {lang === 'ru' ? '⚠️ ИНФОРМАЦИЯ ПО ТРЕНИРОВКАМ' : '⚠️ SPRAY TRAINING DISCLOSURE'}
            </h4>
            <p className="text-[11px] text-gray-400 leading-relaxed font-sans font-medium">
              {lang === 'ru'
                ? 'Отдача в Rust симулируется на стороне сервера. Рекомендуется использовать официальные тренировочные карты (например, UKN, RTG, Rustoria Spray), чтобы отточить мышечную память до 100% точности. Никакое стороннее ПО (скрипты/макросы) не приветствуется и карается мгновенным баном EAC.'
                : 'Recoil simulation in Rust is purely server-authoritative. It is highly recommended to practice on official spray servers (like UKN, RTG, Rustoria Spray) to cement your physical muscle memory. Third-party scripting utilities are strictly blacklisted and lead to permanent EAC game bans.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
