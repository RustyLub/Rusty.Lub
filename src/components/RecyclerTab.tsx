import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ItemImageOrFallback } from './IconUtils';
import fandomIcons from './fandom_icons.json';
import { 
  Search, 
  Trash2, 
  Plus, 
  Minus, 
  HelpCircle, 
  RotateCcw, 
  Settings, 
  TrendingUp, 
  Layers, 
  Hammer, 
  Gauge, 
  Sparkles,
  Info
} from 'lucide-react';

// --- VISUAL RUST-ACCURATE INLINE SVGS ---

export const ScrapSVG = ({ size = 32 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">
    {/* Pile background shadow */}
    <ellipse cx="50" cy="75" rx="35" ry="15" fill="#000000" opacity="0.3" />
    {/* Rusty bolts, scrap iron, scrap gears */}
    <path d="M25,65 L45,50 L55,70 L35,80 Z" fill="#b45309" stroke="#451a03" strokeWidth="2" />
    <path d="M50,45 L75,60 L60,80 L35,65 Z" fill="#78350f" stroke="#451a03" strokeWidth="2" />
    {/* Gear wheel piece */}
    <circle cx="50" cy="55" r="16" fill="#ca8a04" stroke="#451a03" strokeWidth="2" />
    <circle cx="50" cy="55" r="6" fill="#1e293b" stroke="#451a03" strokeWidth="2" />
    <path d="M50,34 L50,38 M50,72 L50,76 M34,55 L38,55 M72,55 L76,55 M39,44 L42,47 M61,66 L64,69 M39,66 L42,63 M61,44 L64,47" stroke="#451a03" strokeWidth="3" strokeLinecap="round" />
    {/* Random metal plate */}
    <rect x="25" y="60" width="18" height="18" rx="2" transform="rotate(15 25 60)" fill="#4b5563" stroke="#1f2937" strokeWidth="1.5" />
    <circle cx="33" cy="67" r="1.5" fill="#ca8a04" />
    <circle cx="43" cy="73" r="1.5" fill="#ca8a04" />
    {/* Highlighting rust */}
    <path d="M48,52 L53,52" stroke="#ea580c" strokeWidth="2" strokeLinecap="round" />
    <path d="M58,68 L68,74" stroke="#ea580c" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const MetalFragmentsSVG = ({ size = 32 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">
    <ellipse cx="50" cy="75" rx="35" ry="12" fill="#000000" opacity="0.3" />
    {/* Sharp silver/grey chunks of iron fragments */}
    <path d="M20,70 L40,45 L50,75 Z" fill="#9ca3af" stroke="#374151" strokeWidth="2" />
    <path d="M35,65 L55,35 L65,70 L45,80 Z" fill="#d1d5db" stroke="#374151" strokeWidth="2" />
    <path d="M55,60 L75,40 L85,75 Z" fill="#6b7280" stroke="#1f2937" strokeWidth="2" />
    {/* Shading/Metallic facets */}
    <path d="M35,65 L55,35 L45,80 Z" fill="#e5e7eb" opacity="0.4" />
    <path d="M20,70 L35,50 L50,75 Z" fill="#f3f4f6" opacity="0.3" />
    {/* Little bits of rust */}
    <path d="M42,50 Q48,52 46,65" stroke="#b45309" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.8" />
  </svg>
);

export const HQMSVG = ({ size = 32 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">
    <ellipse cx="50" cy="80" rx="38" ry="12" fill="#000000" opacity="0.4" />
    {/* Sleek titanium block with glowing dark yellow lines */}
    <path d="M15,55 L50,25 L85,55 L50,85 Z" fill="#1e293b" stroke="#0f172a" strokeWidth="3" />
    {/* Top bevel */}
    <path d="M15,55 L50,25 L85,55 L50,45 Z" fill="#334155" stroke="#0f172a" strokeWidth="1.5" />
    {/* Left bevel side */}
    <path d="M15,55 L50,85 L50,45 Z" fill="#141c2f" stroke="#0f172a" strokeWidth="1.5" />
    {/* Right bevel side */}
    <path d="M85,55 L50,85 L50,45 Z" fill="#0f172a" stroke="#0f172a" strokeWidth="1.5" />
    {/* High tech circuits/etchings (Gold) */}
    <path d="M35,40 L45,40 L50,45" stroke="#ca8a04" strokeWidth="2" strokeLinecap="round" fill="none" />
    <path d="M65,40 L55,40 L50,45" stroke="#ca8a04" strokeWidth="2" strokeLinecap="round" fill="none" />
    <path d="M50,45 L50,70" stroke="#ca8a04" strokeWidth="2" strokeLinecap="round" />
    <circle cx="50" cy="45" r="3" fill="#eab308" />
    <circle cx="35" cy="40" r="2" fill="#eab308" />
    <circle cx="65" cy="40" r="2" fill="#eab308" />
    {/* Glint highlights */}
    <path d="M45,30 L55,27" stroke="#ffffff" strokeWidth="1.5" opacity="0.7" strokeLinecap="round" />
  </svg>
);

export const ClothSVG = ({ size = 32 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">
    <ellipse cx="50" cy="78" rx="35" ry="10" fill="#000000" opacity="0.3" />
    {/* Folded bundle of blue/tan canvas cloths */}
    <rect x="20" y="35" width="60" height="36" rx="4" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="2.5" transform="rotate(-5 50 53)" />
    <rect x="18" y="42" width="62" height="32" rx="4" fill="#93c5fd" stroke="#1d4ed8" strokeWidth="2" transform="rotate(3 50 58)" />
    {/* Strap wrapping around */}
    <rect x="42" y="32" width="14" height="48" fill="#d97706" stroke="#78350f" strokeWidth="1.5" />
    {/* Thread lines/crosshatch details */}
    <line x1="28" y1="46" x2="28" y2="68" stroke="#1e40af" strokeWidth="1" strokeDasharray="2 2" />
    <line x1="34" y1="45" x2="34" y2="69" stroke="#1e40af" strokeWidth="1" strokeDasharray="2 2" />
    <line x1="66" y1="47" x2="66" y2="69" stroke="#1e40af" strokeWidth="1" strokeDasharray="2 2" />
  </svg>
);

export const LeatherSVG = ({ size = 32 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">
    <ellipse cx="50" cy="78" rx="36" ry="10" fill="#000000" opacity="0.3" />
    {/* Rolled brown animal hide */}
    <path d="M22,35 C35,33 65,33 78,35 C83,35 83,65 78,65 C65,67 35,67 22,65 C17,65 17,35 22,35 Z" fill="#7c2d12" stroke="#451a03" strokeWidth="3" />
    {/* Spiral roll side indicator */}
    <ellipse cx="22" cy="50" rx="6" ry="15" fill="#451a03" />
    <path d="M22,40 C19,42 18,50 22,58 C25,56 25,44 22,40 Z" fill="#9a3412" />
    {/* Straps on roll */}
    <rect x="36" y="32" width="6" height="34" fill="#f59e0b" stroke="#78350f" strokeWidth="1.5" />
    <rect x="62" y="32" width="6" height="34" fill="#f59e0b" stroke="#78350f" strokeWidth="1.5" />
    {/* Rough leather texture details */}
    <circle cx="48" cy="45" r="1" fill="#451a03" opacity="0.6" />
    <circle cx="54" cy="55" r="1.2" fill="#451a03" opacity="0.6" />
    <circle cx="68" cy="48" r="1" fill="#451a03" opacity="0.6" />
  </svg>
);

export const RopeSVG = ({ size = 32 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">
    <ellipse cx="50" cy="78" rx="34" ry="11" fill="#000000" opacity="0.3" />
    {/* Coiled jute hemp rope */}
    <circle cx="50" cy="50" r="26" fill="none" stroke="#b45309" strokeWidth="8" />
    <circle cx="50" cy="50" r="18" fill="none" stroke="#d97706" strokeWidth="7" />
    <circle cx="50" cy="50" r="10" fill="none" stroke="#78350f" strokeWidth="5" />
    {/* Bind knot across */}
    <rect x="42" y="20" width="16" height="60" rx="3" fill="#78350f" stroke="#451a03" strokeWidth="2" transform="rotate(35 50 50)" />
    {/* Rope thread lines */}
    <path d="M30,35 Q35,30 45,35 M55,35 Q65,30 70,35" stroke="#f59e0b" strokeWidth="1.5" fill="none" opacity="0.5" />
  </svg>
);

export const WoodSVG = ({ size = 32 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">
    <ellipse cx="50" cy="80" rx="36" ry="10" fill="#000000" opacity="0.3" />
    {/* Stack of logs */}
    <rect x="15" y="52" width="60" height="18" rx="3" fill="#854d0e" stroke="#451a03" strokeWidth="2" />
    <rect x="25" y="36" width="56" height="18" rx="3" fill="#a16207" stroke="#451a03" strokeWidth="2" />
    <rect x="20" y="22" width="50" height="16" rx="3" fill="#78350f" stroke="#451a03" strokeWidth="2" />
    {/* Log ring textures */}
    <circle cx="18" cy="61" r="5" fill="#ca8a04" stroke="#451a03" strokeWidth="1.5" />
    <circle cx="28" cy="45" r="5" fill="#ca8a04" stroke="#451a03" strokeWidth="1.5" />
    <circle cx="23" cy="30" r="4.5" fill="#ca8a04" stroke="#451a03" strokeWidth="1.5" />
    {/* Log ends highlights */}
    <circle cx="18" cy="61" r="2" fill="#eab308" />
    <circle cx="28" cy="45" r="2" fill="#eab308" />
  </svg>
);

// Helper for dynamic SVGs / general items
export const ItemPlaceholderSVG = ({ color = '#cd412b', icon = '🔧', size = 32 }: { color?: string; icon?: string; size?: number }) => (
  <div 
    className="rounded-none border flex items-center justify-center relative shadow-inner shrink-0"
    style={{ 
      width: size, 
      height: size, 
      backgroundColor: `${color}15`, 
      borderColor: `${color}40`,
    }}
  >
    <div className="absolute top-0.5 left-0.5 w-1 h-1" style={{ backgroundColor: color }} />
    <div className="absolute top-0.5 right-0.5 w-1 h-1" style={{ backgroundColor: color }} />
    <span className="text-xl filter drop-shadow-[0_2px_3px_rgba(0,0,0,0.4)]">{icon}</span>
  </div>
);

// Detailed SVG illustrations for main components:
export const GearSVG = ({ size = 32 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">
    <circle cx="50" cy="50" r="32" fill="#d97706" stroke="#451a03" strokeWidth="3" />
    <circle cx="50" cy="50" r="14" fill="#1e293b" stroke="#451a03" strokeWidth="3" />
    <path d="M50,10 L50,18 M50,82 L50,90 M10,50 L18,50 M82,50 L90,50 M22,22 L28,28 M72,72 L78,78 M22,72 L28,66 M72,22 L78,28" stroke="#451a03" strokeWidth="8" strokeLinecap="round" />
    <circle cx="50" cy="50" r="6" fill="#111827" />
  </svg>
);

export const MetalPipeSVG = ({ size = 32 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">
    <g transform="rotate(-25 50 50)">
      <rect x="20" y="38" width="60" height="24" rx="2" fill="#475569" stroke="#1e293b" strokeWidth="3" />
      <ellipse cx="20" cy="50" rx="5" ry="12" fill="#1e293b" stroke="#0f172a" strokeWidth="1.5" />
      <ellipse cx="80" cy="50" rx="5" ry="12" fill="#64748b" stroke="#1e293b" strokeWidth="1.5" />
      <line x1="28" y1="42" x2="72" y2="42" stroke="#94a3b8" strokeWidth="1.5" opacity="0.6" />
      {/* Rust spots */}
      <circle cx="38" cy="48" r="2.5" fill="#ca8a04" opacity="0.8" />
      <circle cx="62" cy="52" r="3" fill="#ca8a04" opacity="0.8" />
    </g>
  </svg>
);

export const SewingKitSVG = ({ size = 32 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">
    <rect x="25" y="25" width="50" height="50" rx="8" fill="#d97706" stroke="#78350f" strokeWidth="3" />
    <line x1="25" y1="45" x2="75" y2="45" stroke="#fef08a" strokeWidth="4" />
    <line x1="25" y1="55" x2="75" y2="55" stroke="#fef08a" strokeWidth="4" />
    {/* Silver sewing needles */}
    <line x1="32" y1="18" x2="68" y2="82" stroke="#94a3b8" strokeWidth="3.5" strokeLinecap="round" />
    <line x1="68" y1="18" x2="32" y2="82" stroke="#e2e8f0" strokeWidth="3.5" strokeLinecap="round" />
    <circle cx="34" cy="22" r="1.5" fill="#111827" />
    <circle cx="66" cy="22" r="1.5" fill="#111827" />
  </svg>
);

export const SheetMetalSVG = ({ size = 32 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">
    <rect x="15" y="20" width="70" height="60" rx="2" fill="#64748b" stroke="#1e293b" strokeWidth="3" transform="rotate(5 50 50)" />
    {/* Corrugated ribs */}
    <line x1="28" y1="32" x2="28" y2="68" stroke="#334155" strokeWidth="4" strokeLinecap="round" />
    <line x1="42" y1="32" x2="42" y2="68" stroke="#334155" strokeWidth="4" strokeLinecap="round" />
    <line x1="56" y1="32" x2="56" y2="68" stroke="#334155" strokeWidth="4" strokeLinecap="round" />
    <line x1="70" y1="32" x2="70" y2="68" stroke="#334155" strokeWidth="4" strokeLinecap="round" />
    {/* Rust on borders */}
    <path d="M18,25 Q32,23 25,35" stroke="#ea580c" strokeWidth="3" fill="none" opacity="0.9" />
    <path d="M72,62 Q80,72 65,74" stroke="#ea580c" strokeWidth="3" fill="none" opacity="0.9" />
  </svg>
);

export const RoadSignsSVG = ({ size = 32 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">
    {/* Triangular warning road sign */}
    <path d="M50,15 L90,80 L10,80 Z" fill="#e11d48" stroke="#4c0519" strokeWidth="4" strokeLinejoin="round" />
    <path d="M50,24 L80,75 L20,75 Z" fill="#ffffff" />
    {/* Rusted cross inside sign */}
    <path d="M44,40 L56,64 M56,40 L44,64" stroke="#ea580c" strokeWidth="6" strokeLinecap="round" />
    {/* Mounting hole and rust */}
    <circle cx="50" cy="30" r="2.5" fill="#374151" />
    <path d="M50,32 Q54,42 46,50" stroke="#ea580c" strokeWidth="2.5" fill="none" />
  </svg>
);

export const TechTrashSVG = ({ size = 32 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">
    <rect x="20" y="20" width="60" height="60" rx="4" fill="#065f46" stroke="#064e3b" strokeWidth="3" />
    {/* Copper trace lines */}
    <path d="M30,30 L45,30 L45,45 L60,45 L60,65" stroke="#f59e0b" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    <path d="M70,30 L55,30 L55,40" stroke="#f59e0b" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    <circle cx="30" cy="30" r="3" fill="#ea580c" />
    <circle cx="70" cy="30" r="3" fill="#ea580c" />
    {/* Chips */}
    <rect x="35" y="52" width="16" height="16" fill="#111827" stroke="#374151" strokeWidth="1" />
    <rect x="58" y="28" width="10" height="10" fill="#111827" stroke="#374151" strokeWidth="1" />
    {/* Capacitor */}
    <circle cx="34" cy="42" r="4.5" fill="#3b82f6" />
    <circle cx="34" cy="42" r="1.5" fill="#ffffff" />
  </svg>
);

// --- STATIC DEFINITIONS OF ALL RECYCLABLE ITEMS IN RUST ---

export interface RecyclerItem {
  id: string;
  name: Record<'ru' | 'en', string>;
  category: 'components' | 'weapons' | 'armor' | 'utilities';
  icon: string;
  color: string;
  // Yield rates at 100% efficiency
  yields: {
    scrap?: number;
    metal_fragments?: number;
    high_quality_metal?: number;
    cloth?: number;
    leather?: number;
    rope?: number;
    wood?: number;
    metal_spring?: number;
    road_signs?: number;
    tech_trash?: number;
    smg_body?: number;
    semi_body?: number;
    rifle_body?: number;
    metal_pipe?: number;
    sewing_kit?: number;
    tarp?: number;
  };
  svgComponent?: React.ComponentType<{ size?: number }>;
}

export const RECYCLER_ITEMS_LIST: RecyclerItem[] = [
  // COMPONENTS
  {
    id: 'gears',
    name: { ru: 'Шестерёнка', en: 'Gears' },
    category: 'components',
    icon: '⚙️',
    color: '#d97706',
    yields: { scrap: 10, metal_fragments: 13 },
    svgComponent: GearSVG
  },
  {
    id: 'metal_pipe',
    name: { ru: 'Металлическая труба', en: 'Metal Pipe' },
    category: 'components',
    icon: '🧪',
    color: '#475569',
    yields: { scrap: 5, high_quality_metal: 1 },
    svgComponent: MetalPipeSVG
  },
  {
    id: 'sewing_kit',
    name: { ru: 'Набор для шитья', en: 'Sewing Kit' },
    category: 'components',
    icon: '🧵',
    color: '#b45309',
    yields: { cloth: 10, rope: 2 },
    svgComponent: SewingKitSVG
  },
  {
    id: 'sheet_metal',
    name: { ru: 'Листовой металл', en: 'Sheet Metal' },
    category: 'components',
    icon: '📦',
    color: '#64748b',
    yields: { scrap: 8, high_quality_metal: 1, metal_fragments: 40 },
    svgComponent: SheetMetalSVG
  },
  {
    id: 'road_signs',
    name: { ru: 'Дорожные знаки', en: 'Road Signs' },
    category: 'components',
    icon: '⚠️',
    color: '#e11d48',
    yields: { scrap: 5, high_quality_metal: 1 },
    svgComponent: RoadSignsSVG
  },
  {
    id: 'tech_trash',
    name: { ru: 'Технический мусор', en: 'Tech Trash' },
    category: 'components',
    icon: '💾',
    color: '#065f46',
    yields: { scrap: 20, high_quality_metal: 1 },
    svgComponent: TechTrashSVG
  },
  {
    id: 'metal_blade',
    name: { ru: 'Металлическое лезвие', en: 'Metal Blade' },
    category: 'components',
    icon: '🔪',
    color: '#64748b',
    yields: { scrap: 2, metal_fragments: 15 },
    svgComponent: () => <ItemPlaceholderSVG color="#64748b" icon="🔪" size={44} />
  },
  {
    id: 'tarp',
    name: { ru: 'Брезент', en: 'Tarp' },
    category: 'components',
    icon: '⛺',
    color: '#2563eb',
    yields: { cloth: 50 },
    svgComponent: () => <ItemPlaceholderSVG color="#2563eb" icon="⛺" size={44} />
  },
  {
    id: 'propane_tank',
    name: { ru: 'Баллон пропана', en: 'Propane Tank' },
    category: 'components',
    icon: '🎈',
    color: '#b91c1c',
    yields: { scrap: 1, metal_fragments: 50 },
    svgComponent: () => <ItemPlaceholderSVG color="#b91c1c" icon="🛑" size={44} />
  },
  {
    id: 'fuse',
    name: { ru: 'Предохранитель', en: 'Electric Fuse' },
    category: 'components',
    icon: '🔌',
    color: '#ca8a04',
    yields: { scrap: 20 },
    svgComponent: () => <ItemPlaceholderSVG color="#ca8a04" icon="🔌" size={44} />
  },
  {
    id: 'metal_spring',
    name: { ru: 'Металлическая пружина', en: 'Metal Spring' },
    category: 'components',
    icon: '🌀',
    color: '#475569',
    yields: { scrap: 10, high_quality_metal: 1 },
    svgComponent: () => <ItemPlaceholderSVG color="#475569" icon="🌀" size={44} />
  },
  {
    id: 'smg_body',
    name: { ru: 'Корпус пистолета-пулемета', en: 'SMG Body' },
    category: 'components',
    icon: '🔫',
    color: '#1e293b',
    yields: { scrap: 15, high_quality_metal: 2, metal_spring: 1 },
    svgComponent: () => <ItemPlaceholderSVG color="#1e293b" icon="🔫" size={44} />
  },
  {
    id: 'semi_body',
    name: { ru: 'Корпус полуавтомата', en: 'Semi-Auto Body' },
    category: 'components',
    icon: '🛠️',
    color: '#1e293b',
    yields: { scrap: 15, high_quality_metal: 2, metal_spring: 1 },
    svgComponent: () => <ItemPlaceholderSVG color="#3b4252" icon="⚙️" size={44} />
  },
  {
    id: 'rifle_body',
    name: { ru: 'Корпус винтовки', en: 'Rifle Body' },
    category: 'components',
    icon: '🎯',
    color: '#111827',
    yields: { scrap: 40, high_quality_metal: 2, metal_spring: 2 },
    svgComponent: () => <ItemPlaceholderSVG color="#111827" icon="🎯" size={44} />
  },

  // WEAPONS
  {
    id: 'assault_rifle',
    name: { ru: 'Штурмовая винтовка (АК-47)', en: 'Assault Rifle (AK)' },
    category: 'weapons',
    icon: '🔫',
    color: '#3f6212',
    yields: { high_quality_metal: 25, rifle_body: 1, metal_spring: 2 },
    svgComponent: () => <ItemPlaceholderSVG color="#3f6212" icon="🪵" size={44} />
  },
  {
    id: 'sar',
    name: { ru: 'Полуавтомат. винтовка (SAR)', en: 'Semi-Auto Rifle (SAR)' },
    category: 'weapons',
    icon: '🎯',
    color: '#7c2d12',
    yields: { metal_fragments: 225, semi_body: 1, metal_spring: 1 },
    svgComponent: () => <ItemPlaceholderSVG color="#7c2d12" icon="🔫" size={44} />
  },
  {
    id: 'thompson',
    name: { ru: 'Томпсон', en: 'Thompson SMG' },
    category: 'weapons',
    icon: '🔫',
    color: '#854d0e',
    yields: { high_quality_metal: 5, wood: 50, smg_body: 1, metal_spring: 1 },
    svgComponent: () => <ItemPlaceholderSVG color="#854d0e" icon="🪵" size={44} />
  },
  {
    id: 'custom_smg',
    name: { ru: 'Custom SMG', en: 'Custom SMG' },
    category: 'weapons',
    icon: '🔫',
    color: '#475569',
    yields: { high_quality_metal: 10, smg_body: 1, metal_spring: 1 },
    svgComponent: () => <ItemPlaceholderSVG color="#475569" icon="🛠️" size={44} />
  },
  {
    id: 'revolver',
    name: { ru: 'Револьвер', en: 'Revolver' },
    category: 'weapons',
    icon: '🔫',
    color: '#78350f',
    yields: { metal_fragments: 125, metal_pipe: 1 },
    svgComponent: () => <ItemPlaceholderSVG color="#78350f" icon="🔫" size={44} />
  },
  {
    id: 'double_barrel',
    name: { ru: 'Двуствольное ружье', en: 'Double Barrel Shotgun' },
    category: 'weapons',
    icon: '💥',
    color: '#4b5563',
    yields: { metal_fragments: 125, metal_pipe: 1 },
    svgComponent: () => <ItemPlaceholderSVG color="#4b5563" icon="🔥" size={44} />
  },
  {
    id: 'waterpipe',
    name: { ru: 'Водопроводный дробовик', en: 'Waterpipe Shotgun' },
    category: 'weapons',
    icon: '🪵',
    color: '#7c2d12',
    yields: { metal_fragments: 50, wood: 100 },
    svgComponent: () => <ItemPlaceholderSVG color="#7c2d12" icon="🪠" size={44} />
  },
  {
    id: 'crossbow',
    name: { ru: 'Арбалет', en: 'Crossbow' },
    category: 'weapons',
    icon: '🏹',
    color: '#b45309',
    yields: { wood: 100, metal_fragments: 37, rope: 1 },
    svgComponent: () => <ItemPlaceholderSVG color="#b45309" icon="🏹" size={44} />
  },

  // ARMOR
  {
    id: 'metal_facemask',
    name: { ru: 'Металлическая маска', en: 'Metal Facemask' },
    category: 'armor',
    icon: '👺',
    color: '#b91c1c',
    yields: { high_quality_metal: 8, sewing_kit: 3 },
    svgComponent: () => <ItemPlaceholderSVG color="#b91c1c" icon="👺" size={44} />
  },
  {
    id: 'metal_chestplate',
    name: { ru: 'Металлический нагрудник', en: 'Metal Chestplate' },
    category: 'armor',
    icon: '🛡️',
    color: '#b91c1c',
    yields: { high_quality_metal: 13, sewing_kit: 4 },
    svgComponent: () => <ItemPlaceholderSVG color="#b91c1c" icon="🛡️" size={44} />
  },
  {
    id: 'roadsign_jacket',
    name: { ru: 'Броня из дорожных знаков', en: 'Road Sign Jacket' },
    category: 'armor',
    icon: '👕',
    color: '#e11d48',
    yields: { road_signs: 2, sewing_kit: 2 },
    svgComponent: () => <ItemPlaceholderSVG color="#e11d48" icon="⚠️" size={44} />
  },
  {
    id: 'roadsign_kilt',
    name: { ru: 'Юбка из дорожных знаков', en: 'Road Sign Kilt' },
    category: 'armor',
    icon: '👖',
    color: '#e11d48',
    yields: { road_signs: 1, sewing_kit: 2 },
    svgComponent: () => <ItemPlaceholderSVG color="#e11d48" icon="👖" size={44} />
  },
  {
    id: 'hazmat_suit',
    name: { ru: 'Химкостюм (Hazmat)', en: 'Hazmat Suit' },
    category: 'armor',
    icon: '☣️',
    color: '#ea580c',
    yields: { tarp: 1, sewing_kit: 2, high_quality_metal: 4 },
    svgComponent: () => <ItemPlaceholderSVG color="#ea580c" icon="☣️" size={44} />
  },
  {
    id: 'coffee_helmet',
    name: { ru: 'Шлем из кофейной банки', en: 'Coffee Can Helmet' },
    category: 'armor',
    icon: '🪖',
    color: '#7c2d12',
    yields: { metal_fragments: 100, sewing_kit: 1 },
    svgComponent: () => <ItemPlaceholderSVG color="#7c2d12" icon="🪣" size={44} />
  },

  // UTILITIES
  {
    id: 'auto_turret',
    name: { ru: 'Авто-турель', en: 'Auto Turret' },
    category: 'utilities',
    icon: '🤖',
    color: '#3b82f6',
    yields: { high_quality_metal: 10, tech_trash: 1 },
    svgComponent: () => <ItemPlaceholderSVG color="#3b82f6" icon="🤖" size={44} />
  },
  {
    id: 'large_battery',
    name: { ru: 'Большой аккумулятор', en: 'Large Battery' },
    category: 'utilities',
    icon: '🔋',
    color: '#059669',
    yields: { high_quality_metal: 5, tech_trash: 1 },
    svgComponent: () => <ItemPlaceholderSVG color="#059669" icon="🔋" size={44} />
  },
  {
    id: 'wind_turbine',
    name: { ru: 'Ветрогенератор', en: 'Wind Turbine' },
    category: 'utilities',
    icon: '🌀',
    color: '#0284c7',
    yields: { high_quality_metal: 15, tech_trash: 2 },
    svgComponent: () => <ItemPlaceholderSVG color="#0284c7" icon="🌀" size={44} />
  }
];

// OUTPUT RAW RESOURCE STYLING / MAPPING
export interface RawResource {
  id: string;
  name: Record<'ru' | 'en', string>;
  svgComponent: React.ComponentType<{ size?: number }>;
  color: string;
}

export const RAW_RESOURCES_MAP: Record<string, RawResource> = {
  scrap: {
    id: 'scrap',
    name: { ru: 'Металлолом (Scrap)', en: 'Scrap' },
    svgComponent: ScrapSVG,
    color: '#ca8a04'
  },
  metal_fragments: {
    id: 'metal_fragments',
    name: { ru: 'Фрагменты металла', en: 'Metal Fragments' },
    svgComponent: MetalFragmentsSVG,
    color: '#9ca3af'
  },
  high_quality_metal: {
    id: 'high_quality_metal',
    name: { ru: 'МВК (HQM)', en: 'High Quality Metal' },
    svgComponent: HQMSVG,
    color: '#eab308'
  },
  cloth: {
    id: 'cloth',
    name: { ru: 'Ткань', en: 'Cloth' },
    svgComponent: ClothSVG,
    color: '#3b82f6'
  },
  leather: {
    id: 'leather',
    name: { ru: 'Кожа', en: 'Leather' },
    svgComponent: LeatherSVG,
    color: '#7c2d12'
  },
  rope: {
    id: 'rope',
    name: { ru: 'Верёвка', en: 'Rope' },
    svgComponent: RopeSVG,
    color: '#b45309'
  },
  wood: {
    id: 'wood',
    name: { ru: 'Дерево', en: 'Wood' },
    svgComponent: WoodSVG,
    color: '#854d0e'
  },
  // Recycled intermediates:
  metal_spring: {
    id: 'metal_spring',
    name: { ru: 'Пружина', en: 'Metal Spring' },
    svgComponent: () => <ItemPlaceholderSVG color="#475569" icon="🌀" size={32} />,
    color: '#475569'
  },
  road_signs: {
    id: 'road_signs',
    name: { ru: 'Дорожный знак', en: 'Road Sign' },
    svgComponent: RoadSignsSVG,
    color: '#e11d48'
  },
  tech_trash: {
    id: 'tech_trash',
    name: { ru: 'Техно-мусор', en: 'Tech Trash' },
    svgComponent: TechTrashSVG,
    color: '#065f46'
  },
  smg_body: {
    id: 'smg_body',
    name: { ru: 'Корпус SMG', en: 'SMG Body' },
    svgComponent: () => <ItemPlaceholderSVG color="#1e293b" icon="🔫" size={32} />,
    color: '#1e293b'
  },
  semi_body: {
    id: 'semi_body',
    name: { ru: 'Полуавтомат корпус', en: 'Semi Body' },
    svgComponent: () => <ItemPlaceholderSVG color="#3b4252" icon="⚙️" size={32} />,
    color: '#3b4252'
  },
  rifle_body: {
    id: 'rifle_body',
    name: { ru: 'Корпус винтовки', en: 'Rifle Body' },
    svgComponent: () => <ItemPlaceholderSVG color="#111827" icon="🎯" size={32} />,
    color: '#111827'
  },
  metal_pipe: {
    id: 'metal_pipe',
    name: { ru: 'Металлическая труба', en: 'Metal Pipe' },
    svgComponent: MetalPipeSVG,
    color: '#475569'
  },
  sewing_kit: {
    id: 'sewing_kit',
    name: { ru: 'Набор для шитья', en: 'Sewing Kit' },
    svgComponent: SewingKitSVG,
    color: '#d97706'
  },
  tarp: {
    id: 'tarp',
    name: { ru: 'Брезент', en: 'Tarp' },
    svgComponent: () => <ItemPlaceholderSVG color="#0284c7" icon="⛺" size={32} />,
    color: '#0284c7'
  }
};

// QUICK PRESETS
export const RECYCLER_PRESETS = [
  {
    id: 'elite',
    name: { ru: '📦 Лут Элитного Ящика (Средний)', en: '📦 Elite Crate Loot (Avg)' },
    items: {
      tech_trash: 2,
      road_signs: 2,
      metal_pipe: 3,
      gears: 2,
      sheet_metal: 1,
      metal_spring: 2
    }
  },
  {
    id: 'military',
    name: { ru: '🛢️ Лут Военного Ящика (x3)', en: '🛢️ Military Crate Loot (x3)' },
    items: {
      gears: 4,
      sewing_kit: 6,
      metal_pipe: 5,
      road_signs: 3,
      semi_body: 2,
      propane_tank: 2
    }
  },
  {
    id: 'oil_rig',
    name: { ru: '🚁 Забег на Нефтевышку (Компоненты)', en: '🚁 Oil Rig Run (Components)' },
    items: {
      tech_trash: 12,
      gears: 15,
      sewing_kit: 24,
      metal_pipe: 18,
      sheet_metal: 10,
      road_signs: 14,
      tarp: 8,
      smg_body: 4,
      semi_body: 6,
      rifle_body: 2
    }
  },
  {
    id: 'scrap_farm',
    name: { ru: '🚗 Фарм дороги (Полный рюкзак)', en: '🚗 Road Farm (Full Inventory)' },
    items: {
      propane_tank: 10,
      metal_blade: 15,
      tarp: 6,
      sewing_kit: 12,
      road_signs: 8,
      gears: 8,
      metal_pipe: 12,
      sheet_metal: 6,
      fuse: 2
    }
  }
];

interface RecyclerTabProps {
  lang: 'ru' | 'en';
}

export default function RecyclerTab({ lang }: RecyclerTabProps) {
  // Queue stores item IDs mapped to quantity: { [id]: number }
  const [queue, setQueue] = useState<Record<string, number>>({});
  const [activeCategory, setActiveCategory] = useState<'all' | 'components' | 'weapons' | 'armor' | 'utilities'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [efficiency, setEfficiency] = useState<80 | 100>(100); // 100% monument vs 80% safezone tax

  // Filter items based on search and category
  const filteredItems = useMemo(() => {
    return RECYCLER_ITEMS_LIST.filter(item => {
      const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        item.name.en.toLowerCase().includes(query) || 
        item.name.ru.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  // Handle adding an item from the grid
  const handleAddItem = (itemId: string, count: number = 1) => {
    setQueue(prev => {
      const current = prev[itemId] || 0;
      return {
        ...prev,
        [itemId]: Math.max(0, current + count)
      };
    });
  };

  // Set absolute quantity for an item
  const handleSetQuantity = (itemId: string, qty: number) => {
    setQueue(prev => {
      const finalQty = Math.max(0, qty);
      const newQueue = { ...prev };
      if (finalQty === 0) {
        delete newQueue[itemId];
      } else {
        newQueue[itemId] = finalQty;
      }
      return newQueue;
    });
  };

  // Reset/Clear everything
  const handleClear = () => {
    setQueue({});
  };

  // Load preset items
  const handleLoadPreset = (presetItems: Record<string, number>) => {
    setQueue(presetItems);
  };

  // Calculate real-time output yields
  const yieldsCalculation = useMemo(() => {
    const rawResults: Record<string, number> = {};

    Object.entries(queue).forEach(([itemId, qty]) => {
      const itemConfig = RECYCLER_ITEMS_LIST.find(i => i.id === itemId);
      if (!itemConfig) return;

      // For each yield material
      Object.entries(itemConfig.yields).forEach(([materialId, baseYield]) => {
        if (!baseYield) return;
        
        // Calculate with efficiency tax (e.g. 100% monument vs 80% Safe Zone)
        const adjustedYield = efficiency === 100 ? baseYield : baseYield * 0.8;
        const totalMaterialYield = adjustedYield * qty;

        // If it's a fractional result, in Rust it usually rounds or floats but lets use floor to be safe & realistic
        const roundedYield = Math.floor(totalMaterialYield);

        if (roundedYield > 0) {
          rawResults[materialId] = (rawResults[materialId] || 0) + roundedYield;
        }
      });
    });

    return rawResults;
  }, [queue, efficiency]);

  // Categories helper
  const categoriesList = [
    { id: 'all', label: { ru: 'Все предметы', en: 'All Items' } },
    { id: 'components', label: { ru: 'Компоненты', en: 'Components' } },
    { id: 'weapons', label: { ru: 'Оружие', en: 'Weapons' } },
    { id: 'armor', label: { ru: 'Броня', en: 'Armor' } },
    { id: 'utilities', label: { ru: 'Электрика / Устройства', en: 'Utilities' } }
  ] as const;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-[#14171e]/90 border border-[#2a2f3b] p-6 relative overflow-hidden rust-metal-pattern">
        <div className="rust-bracket-tl" />
        <div className="rust-bracket-tr" />
        <div className="rust-bracket-bl" />
        <div className="rust-bracket-br" />

        <div className="absolute top-0 right-0 w-32 h-32 rust-hazard-dark opacity-10 pointer-events-none" />

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-mono text-[#cd412b] font-black tracking-widest uppercase">
              <span className="w-2 h-2 bg-[#cd412b] animate-ping rounded-full" />
              <span>{lang === 'ru' ? 'ТАКТИЧЕСКИЙ УТИЛИЗАТОР' : 'TACTICAL RECYCLING CALCULATOR'}</span>
            </div>
            <h1 className="text-3xl font-black text-white tracking-wider font-teko uppercase mt-1">
              {lang === 'ru' ? 'Калькулятор Утилизатора' : 'Recycling Tool'}
            </h1>
            <p className="text-xs text-zinc-400 mt-1 max-w-2xl font-sans font-medium">
              {lang === 'ru' 
                ? 'Рассчитывайте выработку ресурсов из компонентов и оружия в режиме реального времени. Сравнивайте выход на монументах (100%) и в безопасных зонах (80% с налогом).' 
                : 'Instantly calculate scrap, high-quality metal, and raw resource yields from components or gear. Compare Monument (100%) versus Safe Zone (80% with tax) rates.'}
            </p>
          </div>

          {/* Efficiency Toggle (Monument 100% vs Safe Zone 80%) */}
          <div className="bg-black/40 border border-zinc-800/80 p-2.5 flex items-center gap-3 shrink-0">
            <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider">
              {lang === 'ru' ? 'ЛОКАЦИЯ УТИЛИЗАТОРА:' : 'RECYCLER LOCATION:'}
            </span>
            <div className="flex font-mono text-[10.5px]">
              <button
                onClick={() => setEfficiency(100)}
                className={`px-3 py-1.5 font-bold uppercase transition-all cursor-pointer flex items-center gap-1.5 ${
                  efficiency === 100
                    ? 'bg-[#cd412b] text-white'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <TrendingUp size={12} />
                <span>{lang === 'ru' ? 'РТ / Монумент (100%)' : 'Monument (100%)'}</span>
              </button>
              <button
                onClick={() => setEfficiency(80)}
                className={`px-3 py-1.5 font-bold uppercase transition-all cursor-pointer flex items-center gap-1.5 ${
                  efficiency === 80
                    ? 'bg-[#cd412b] text-white'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <Settings size={12} />
                <span>{lang === 'ru' ? 'Мирный Город (80%)' : 'Safe Zone (80%)'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Inputs vs Outputs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: ACTIVE RECYCLER BENCH & SEARCH (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Active Recycler Slots Panel (The visual bench) */}
          <div className="bg-[#14171e]/90 border border-zinc-800/80 p-5 relative rust-metal-pattern">
            <div className="flex justify-between items-center mb-4 border-b border-zinc-800/80 pb-3">
              <div className="flex items-center gap-2">
                <Layers size={16} className="text-[#cd412b]" />
                <h3 className="text-sm font-black text-white tracking-widest font-mono uppercase">
                  {lang === 'ru' ? 'АКТИВНЫЕ СЛОТЫ УТИЛИЗАТОРА' : 'ACTIVE RECYCLER SLOTS'}
                </h3>
              </div>
              
              {Object.keys(queue).length > 0 && (
                <button
                  onClick={handleClear}
                  className="px-2.5 py-1 text-[10.5px] font-mono font-bold text-red-400 hover:text-white hover:bg-red-950/40 border border-red-900/30 hover:border-red-500/50 flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Trash2 size={12} />
                  <span>{lang === 'ru' ? 'ОЧИСТИТЬ ВСЁ' : 'RESET ALL'}</span>
                </button>
              )}
            </div>

            {/* Simulated 6-Slot In-game Recycler View */}
            {Object.keys(queue).length === 0 ? (
              <div className="border-2 border-dashed border-zinc-800/60 p-8 text-center bg-black/20">
                <span className="text-3xl block filter drop-shadow-md mb-2">📦</span>
                <p className="text-xs text-zinc-400 font-mono uppercase tracking-wider">
                  {lang === 'ru' 
                    ? 'Утилизатор пуст. Кликните по компонентам ниже, чтобы загрузить их!' 
                    : 'Recycler is empty. Click any item below to load it into the bench!'}
                </p>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {RECYCLER_PRESETS.map(preset => (
                    <button
                      key={preset.id}
                      onClick={() => handleLoadPreset(preset.items)}
                      className="px-2.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white font-mono text-[9.5px] font-bold uppercase transition-colors"
                    >
                      {preset.name[lang]}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-3.5">
                {/* Scrollable list of loaded items */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[280px] overflow-y-auto pr-1">
                  <AnimatePresence>
                    {Object.entries(queue).map(([itemId, qty]) => {
                      const item = RECYCLER_ITEMS_LIST.find(i => i.id === itemId);
                      if (!item) return null;

                      const SvgIcon = item.svgComponent;

                      return (
                        <motion.div
                          key={item.id}
                          layout
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="flex items-center justify-between p-2 bg-black/40 border border-zinc-800/80 hover:border-zinc-700/80 transition-colors"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-11 h-11 shrink-0 bg-black/60 border border-zinc-800 flex items-center justify-center p-1 overflow-hidden relative">
                              <img 
                                src={(fandomIcons as Record<string, string>)[item.id] || `https://rustlabs.com/img/items180/${item.id}.png`} 
                                alt={item.id} 
                                className="object-contain w-full h-full absolute inset-0 z-10"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                              {SvgIcon && <SvgIcon size={34} />}
                            </div>
                            <div className="min-w-0">
                              <span className="text-[11px] font-mono font-bold text-white block truncate uppercase">
                                {item.name[lang]}
                              </span>
                              <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider block">
                                {item.category}
                              </span>
                            </div>
                          </div>

                          {/* Interactive Adjuster */}
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              onClick={() => handleAddItem(item.id, -1)}
                              className="w-6 h-6 bg-zinc-950 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 flex items-center justify-center font-bold text-xs transition-colors cursor-pointer"
                            >
                              <Minus size={11} />
                            </button>
                            
                            <input
                              type="number"
                              value={qty}
                              onChange={(e) => handleSetQuantity(item.id, parseInt(e.target.value) || 0)}
                              className="w-12 h-6 bg-black border border-zinc-800 text-center text-xs font-mono font-bold text-[#cd412b] focus:outline-none focus:border-[#cd412b]/60"
                              min="1"
                            />

                            <button
                              onClick={() => handleAddItem(item.id, 1)}
                              className="w-6 h-6 bg-zinc-950 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 flex items-center justify-center font-bold text-xs transition-colors cursor-pointer"
                            >
                              <Plus size={11} />
                            </button>

                            <button
                              onClick={() => handleSetQuantity(item.id, 0)}
                              className="w-6 h-6 bg-zinc-950 hover:bg-red-950/40 text-zinc-500 hover:text-red-400 border border-zinc-800 hover:border-red-900/40 flex items-center justify-center transition-colors cursor-pointer ml-1"
                              title={lang === 'ru' ? 'Удалить из утилизатора' : 'Remove item'}
                            >
                              <Trash2 size={11} />
                            </button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>

                {/* Micro Yield Summary inside inputs */}
                <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500 bg-black/20 p-2 border border-zinc-900">
                  <span className="uppercase">
                    {lang === 'ru' ? 'Всего различных компонентов:' : 'Total component types:'} {Object.keys(queue).length}
                  </span>
                  <span className="uppercase">
                    {lang === 'ru' ? 'Общее количество:' : 'Total item volume:'} {Object.values(queue).reduce((a, b) => a + b, 0)} шт
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Preset Buttons Quick Bar */}
          <div className="bg-[#14171e]/50 border border-zinc-800/80 p-4 space-y-2.5">
            <div className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles size={11} className="text-amber-500" />
              <span>{lang === 'ru' ? 'ТАКТИЧЕСКИЕ НАБОРЫ ЛУТА' : 'TACTICAL LOOT PRESETS'}</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {RECYCLER_PRESETS.map(preset => {
                const isActive = JSON.stringify(queue) === JSON.stringify(preset.items);
                return (
                  <button
                    key={preset.id}
                    onClick={() => handleLoadPreset(preset.items)}
                    className={`px-2 py-2.5 font-mono text-[9.5px] font-bold uppercase transition-all cursor-pointer text-center truncate border ${
                      isActive
                        ? 'bg-[#cd412b]/15 text-white border-[#cd412b]/50'
                        : 'bg-zinc-900/60 hover:bg-zinc-800/60 text-zinc-400 hover:text-white border-zinc-800/60 hover:border-zinc-700/60'
                    }`}
                  >
                    {preset.name[lang]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ITEM SELECTOR GRID SECTION */}
          <div className="bg-[#14171e]/90 border border-zinc-800/80 p-5 space-y-4 relative rust-metal-pattern">
            <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
              <div className="flex items-center gap-2">
                <Hammer size={16} className="text-[#cd412b]" />
                <h3 className="text-sm font-black text-white tracking-widest font-mono uppercase">
                  {lang === 'ru' ? 'КАТАЛОГ ПРЕДМЕТОВ ДЛЯ УТИЛИЗАЦИИ' : 'ITEMS DIRECTORY'}
                </h3>
              </div>

              {/* Instant Search */}
              <div className="relative w-full sm:w-60">
                <input
                  type="text"
                  placeholder={lang === 'ru' ? 'Поиск предмета...' : 'Search item name...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-black/40 border border-zinc-800 focus:border-[#cd412b]/60 rounded-none py-1.5 pl-8 pr-3 text-xs font-mono focus:outline-none text-white placeholder-zinc-500 uppercase"
                />
                <Search size={12} className="absolute left-2.5 top-2.5 text-zinc-500" />
              </div>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex flex-wrap gap-1.5 border-b border-zinc-800/80 pb-3">
              {categoriesList.map(cat => {
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-3 py-1.5 font-mono text-[9.5px] font-bold uppercase tracking-wider cursor-pointer border ${
                      isActive
                        ? 'bg-[#cd412b] text-white border-[#cd412b]'
                        : 'bg-black/20 hover:bg-zinc-900 text-zinc-400 hover:text-white border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    {cat.label[lang]}
                  </button>
                );
              })}
            </div>

            {/* Items Cards Grid */}
            {filteredItems.length === 0 ? (
              <div className="text-center py-12 text-zinc-500 font-mono text-xs uppercase">
                {lang === 'ru' ? 'Нет подходящих предметов.' : 'No matching items found.'}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {filteredItems.map(item => {
                  const SvgIcon = item.svgComponent;
                  const currentInQueue = queue[item.id] || 0;

                  return (
                    <div
                      key={item.id}
                      onClick={() => handleAddItem(item.id, 1)}
                      className={`group p-2.5 bg-black/20 hover:bg-black/40 border transition-all duration-150 relative cursor-pointer flex flex-col items-center text-center select-none ${
                        currentInQueue > 0
                          ? 'border-[#cd412b]/60 shadow-[0_0_12px_rgba(205,65,43,0.06)]'
                          : 'border-zinc-800/80 hover:border-zinc-700/80'
                      }`}
                    >
                      {/* Active count badge */}
                      {currentInQueue > 0 && (
                        <div className="absolute top-1 right-1 bg-[#cd412b] text-white font-mono text-[9px] font-black px-1.5 py-0.5 leading-none">
                          x{currentInQueue}
                        </div>
                      )}

                      {/* Graphic Icon */}
                      <div className="w-14 h-14 bg-black/60 border border-zinc-800 flex items-center justify-center p-1.5 group-hover:scale-105 transition-transform overflow-hidden">
                        <ItemImageOrFallback id={item.id} lang={lang} fallback={SvgIcon} size={44} icon={item.icon} />
                      </div>

                      <span className="text-[10px] font-mono font-bold text-zinc-300 group-hover:text-white mt-2 leading-tight uppercase block max-w-full truncate">
                        {item.name[lang]}
                      </span>

                      {/* Display of single-yield breakdown on hover */}
                      <div className="mt-1 flex items-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                        {Object.entries(item.yields).slice(0, 2).map(([resId, amt]) => {
                          const resConfig = RAW_RESOURCES_MAP[resId];
                          return (
                            <span key={resId} className="text-[8.5px] font-mono text-zinc-400">
                              {resConfig?.name[lang].split(' ')[0]}: <strong className="text-zinc-200">{amt}</strong>
                            </span>
                          );
                        })}
                      </div>

                      {/* Quick Multiplier Buttons overlay */}
                      <div className="absolute bottom-1 right-1 left-1 opacity-0 group-hover:opacity-100 flex gap-0.5 transition-all bg-black/90 p-0.5 border border-zinc-800">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddItem(item.id, 1);
                          }}
                          className="flex-1 py-0.5 text-[8.5px] font-mono font-bold bg-zinc-900 hover:bg-zinc-800 text-zinc-300"
                        >
                          +1
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddItem(item.id, 10);
                          }}
                          className="flex-1 py-0.5 text-[8.5px] font-mono font-bold bg-zinc-900 hover:bg-zinc-800 text-zinc-300"
                        >
                          +10
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddItem(item.id, 50);
                          }}
                          className="flex-1 py-0.5 text-[8.5px] font-mono font-bold bg-zinc-900 hover:bg-zinc-800 text-zinc-300"
                        >
                          +50
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: CALCULATED TOTAL YIELD OUTPUTS (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#14171e]/95 border-2 border-[#cd412b]/35 p-5 relative overflow-hidden shadow-2xl rust-metal-pattern">
            <div className="absolute top-0 left-0 right-0 h-1 rust-hazard" />
            
            <div className="rust-bracket-tl" />
            <div className="rust-bracket-tr" />
            <div className="rust-bracket-bl" />
            <div className="rust-bracket-br" />

            <div className="border-b border-zinc-800/80 pb-3.5 mb-4">
              <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-400 font-bold tracking-wider uppercase">
                <Gauge size={13} className="text-[#cd412b]" />
                <span>{lang === 'ru' ? 'ВЫРАБОТКА МАТЕРИАЛОВ' : 'RECOVERY STATEMENT'}</span>
              </div>
              <h2 className="text-xl font-black text-white tracking-widest font-teko uppercase mt-1">
                {lang === 'ru' ? 'Общий Выход' : 'TOTAL YIELD'}
              </h2>
            </div>

            {Object.keys(yieldsCalculation).length === 0 ? (
              <div className="text-center py-16 text-zinc-500 font-mono space-y-3">
                <span className="text-4xl block animate-pulse">⛏️</span>
                <p className="text-[10px] uppercase tracking-wider leading-relaxed">
                  {lang === 'ru' 
                    ? 'Загрузите детали в утилизатор слева для расчета ресурсов.' 
                    : 'Assemble components on the left bench to compute resource output.'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Outpost/Tax warnings */}
                {efficiency === 80 && (
                  <div className="bg-amber-500/10 border border-amber-500/20 p-2.5 font-mono space-y-1">
                    <span className="text-[9.5px] font-black text-amber-500 uppercase block tracking-wider">
                      ⚠️ {lang === 'ru' ? 'НАЛОГ МИРНОЙ ЗОНЫ' : 'SAFE ZONE TAX APPLIED'}
                    </span>
                    <p className="text-[8.5px] text-zinc-400 leading-normal uppercase">
                      {lang === 'ru'
                        ? 'Утилизаторы в Городе НПС взимают 20% комиссию. Вы получаете на 20% меньше ресурсов.'
                        : 'Recyclers inside Safe Zones have a 20% tax. Yields are rounded down.'}
                    </p>
                  </div>
                )}

                {/* Outputs List */}
                <div className="space-y-2.5">
                  {Object.entries(yieldsCalculation).map(([materialId, amount]) => {
                    const resource = RAW_RESOURCES_MAP[materialId];
                    if (!resource) return null;

                    const ResSvg = resource.svgComponent;

                    return (
                      <div
                        key={materialId}
                        className="flex items-center justify-between p-2.5 bg-black/40 border border-zinc-800 hover:border-zinc-700 transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 shrink-0 bg-black/60 border border-zinc-800 flex items-center justify-center p-1 overflow-hidden relative">
                            <img 
                              src={(fandomIcons as Record<string, string>)[materialId] || `https://rustlabs.com/img/items180/${materialId}.png`} 
                              alt={materialId} 
                              className="object-contain w-full h-full absolute inset-0 z-10"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                            {ResSvg && <ResSvg size={30} />}
                          </div>
                          <div className="min-w-0">
                            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block leading-tight">
                              {lang === 'ru' ? 'МАТЕРИАЛ' : 'RAW MATERIAL'}
                            </span>
                            <span className="text-[11px] font-mono font-bold text-white uppercase block truncate">
                              {resource.name[lang]}
                            </span>
                          </div>
                        </div>

                        {/* Quantity yield */}
                        <div className="text-right shrink-0">
                          <span className="text-[8.5px] font-mono text-[#cd412b] font-bold block uppercase leading-none">
                            {lang === 'ru' ? 'ВЫРАБОТАНО' : 'YIELDED'}
                          </span>
                          <span className="text-xl font-black text-white font-mono tracking-tight leading-none mt-1 inline-block">
                            +{amount}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Quick Info Box */}
                <div className="bg-black/30 border border-zinc-900 p-3 space-y-2 font-mono text-[9px] text-zinc-500 uppercase leading-relaxed mt-4">
                  <div className="flex items-start gap-1.5">
                    <Info size={11} className="text-[#cd412b] shrink-0 mt-0.5" />
                    <span>
                      {lang === 'ru'
                        ? '💡 Все расчеты на 100% соответствуют формулам Rust. Инструменты и оружие утилизируются в объёме 50% от их крафт-стоимости.'
                        : '💡 Calculations follow exact Rust game engine yield rules. Weapons/tools yield 50% of their base materials cost.'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
