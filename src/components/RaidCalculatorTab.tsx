import { useState } from 'react';
import { raidWeapons, raidTargets } from '../data';
import { RaidWeapon, RaidTarget } from '../types';
import fandomIcons from './fandom_icons.json';
import { ItemImageOrFallback } from './IconUtils';
import { 
  Shield, 
  Hammer, 
  Flame, 
  Trash2, 
  Plus, 
  Minus, 
  Info,
  Bomb,
  Rocket,
  Backpack,
  Zap,
  Layers,
  Grid,
  Fence,
  DoorClosed,
  Warehouse,
  Lock,
  Archive,
  Crosshair,
  ShieldAlert
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { weaponTranslationMap, targetTranslationMap } from '../translations';

// Gorgeous custom wall SVGs for the Raid Calculator
const WoodWallSVG = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
    <rect x="5" y="10" width="90" height="16" rx="2" fill="#854d0e" stroke="#451a03" strokeWidth="3" />
    <rect x="5" y="30" width="90" height="16" rx="2" fill="#a16207" stroke="#451a03" strokeWidth="3" />
    <rect x="5" y="50" width="90" height="16" rx="2" fill="#78350f" stroke="#451a03" strokeWidth="3" />
    <rect x="5" y="70" width="90" height="16" rx="2" fill="#92400e" stroke="#451a03" strokeWidth="3" />
    <line x1="15" y1="18" x2="60" y2="18" stroke="#451a03" strokeWidth="2" strokeLinecap="round" />
    <line x1="25" y1="38" x2="80" y2="38" stroke="#451a03" strokeWidth="2" strokeLinecap="round" />
    <line x1="10" y1="58" x2="50" y2="58" stroke="#451a03" strokeWidth="2" strokeLinecap="round" />
    <line x1="30" y1="78" x2="75" y2="78" stroke="#451a03" strokeWidth="2" strokeLinecap="round" />
    <line x1="20" y1="5" x2="35" y2="95" stroke="#eab308" strokeWidth="3.5" strokeDasharray="3 3" />
    <line x1="80" y1="5" x2="65" y2="95" stroke="#eab308" strokeWidth="3.5" strokeDasharray="3 3" />
  </svg>
);

const StoneWallSVG = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
    <rect x="5" y="5" width="90" height="90" fill="#374151" stroke="#111827" strokeWidth="4" />
    <rect x="10" y="10" width="35" height="20" rx="1" fill="#4b5563" stroke="#1f2937" strokeWidth="2" />
    <rect x="50" y="10" width="40" height="20" rx="1" fill="#6b7280" stroke="#1f2937" strokeWidth="2" />
    <rect x="10" y="34" width="45" height="22" rx="1" fill="#6b7280" stroke="#1f2937" strokeWidth="2" />
    <rect x="60" y="34" width="30" height="22" rx="1" fill="#4b5563" stroke="#1f2937" strokeWidth="2" />
    <rect x="10" y="60" width="30" height="20" rx="1" fill="#4b5563" stroke="#1f2937" strokeWidth="2" />
    <rect x="45" y="60" width="45" height="20" rx="1" fill="#9ca3af" stroke="#1f2937" strokeWidth="2" />
    <rect x="10" y="84" width="80" height="8" fill="#374151" stroke="#1f2937" strokeWidth="2" />
    <path d="M15,15 Q40,40 20,80" stroke="#ca8a04" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    <path d="M85,15 Q60,40 80,80" stroke="#ca8a04" strokeWidth="2.5" fill="none" strokeLinecap="round" />
  </svg>
);

const SheetWallSVG = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
    <rect x="5" y="5" width="90" height="90" fill="#334155" stroke="#0f172a" strokeWidth="4" />
    <rect x="12" y="10" width="12" height="80" fill="#475569" stroke="#1e293b" strokeWidth="2" />
    <rect x="30" y="10" width="12" height="80" fill="#64748b" stroke="#1e293b" strokeWidth="2" />
    <rect x="48" y="10" width="12" height="80" fill="#475569" stroke="#1e293b" strokeWidth="2" />
    <rect x="66" y="10" width="12" height="80" fill="#64748b" stroke="#1e293b" strokeWidth="2" />
    <rect x="84" y="10" width="4" height="80" fill="#475569" stroke="#1e293b" strokeWidth="2" />
    <path d="M 12 15 Q 18 20 15 35" stroke="#b45309" strokeWidth="4" strokeLinecap="round" />
    <path d="M 48 60 Q 55 65 52 80" stroke="#b45309" strokeWidth="4" strokeLinecap="round" />
    <path d="M 66 12 Q 72 25 70 30" stroke="#92400e" strokeWidth="5" strokeLinecap="round" />
    <circle cx="20" cy="50" r="1.5" fill="#ca8a04" />
    <circle cx="75" cy="45" r="2.5" fill="#b45309" />
    <rect x="25" y="45" width="22" height="15" fill="#1e293b" stroke="#0f172a" strokeWidth="1.5" />
    <line x1="25" y1="45" x2="47" y2="60" stroke="#ca8a04" strokeWidth="1.5" />
  </svg>
);

const ArmoredWallSVG = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
    <rect x="5" y="5" width="90" height="90" rx="4" fill="#1e293b" stroke="#ca8a04" strokeWidth="4" />
    <rect x="12" y="12" width="76" height="76" rx="2" fill="#0f172a" stroke="#ca8a04" strokeWidth="1.5" />
    <rect x="18" y="20" width="64" height="16" fill="#334155" stroke="#1e293b" strokeWidth="2" />
    <rect x="18" y="42" width="64" height="16" fill="#1e293b" stroke="#0f172a" strokeWidth="2" />
    <rect x="18" y="64" width="64" height="16" fill="#334155" stroke="#1e293b" strokeWidth="2" />
    <circle cx="16" cy="16" r="3" fill="#ca8a04" stroke="#451a03" strokeWidth="1" />
    <circle cx="84" cy="16" r="3" fill="#ca8a04" stroke="#451a03" strokeWidth="1" />
    <circle cx="16" cy="84" r="3" fill="#ca8a04" stroke="#451a03" strokeWidth="1" />
    <circle cx="84" cy="84" r="3" fill="#ca8a04" stroke="#451a03" strokeWidth="1" />
    <path d="M 30 22 L 35 22 L 25 34 L 20 34 Z" fill="#ca8a04" />
    <path d="M 50 22 L 55 22 L 45 34 L 40 34 Z" fill="#ca8a04" />
    <path d="M 70 22 L 75 22 L 65 34 L 60 34 Z" fill="#ca8a04" />
  </svg>
);

// --- DETAILED GAME-ACCURATE SVG ILLUSTRATIONS ---

const C4WeaponSVG = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
    {/* Rounded brick of plastic explosive (clay/beige-grey) */}
    <rect x="12" y="18" width="76" height="64" rx="10" fill="#dedbd2" stroke="#b0aba0" strokeWidth="2" />
    <rect x="15" y="21" width="70" height="58" rx="8" fill="#e9e6df" />
    
    {/* Shading/texture on the clay block */}
    <path d="M15,50 Q40,65 85,50" stroke="#b0aba0" strokeWidth="2" fill="none" opacity="0.3" />
    <path d="M20,30 Q50,45 80,30" stroke="#b0aba0" strokeWidth="2" fill="none" opacity="0.3" />

    {/* Looped red and green wires poking out from under the tape */}
    <path d="M28,45 C20,25 35,5 45,28" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    <path d="M48,45 C40,25 55,5 65,30" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    <path d="M58,55 C65,35 80,20 70,55" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.8" />

    {/* Vertical Thick Black Tape Bands */}
    {/* Band 1 - Left side */}
    <path d="M22,18 C22,18 20,40 24,82" stroke="#111827" strokeWidth="12" strokeLinecap="butt" fill="none" />
    <path d="M22,18 C22,18 20,40 24,82" stroke="#1f2937" strokeWidth="10" strokeLinecap="butt" fill="none" />
    
    {/* Band 2 - Middle-Right vertical */}
    <path d="M58,19 Q57,50 61,81" stroke="#111827" strokeWidth="12" fill="none" />
    <path d="M58,19 Q57,50 61,81" stroke="#1f2937" strokeWidth="10" fill="none" />

    {/* Horizontal Thick Black Tape Bands */}
    {/* Horizontal Band 1 */}
    <path d="M12,32 Q50,30 88,32" stroke="#111827" strokeWidth="11" fill="none" />
    <path d="M12,32 Q50,30 88,32" stroke="#1f2937" strokeWidth="9" fill="none" />

    {/* Horizontal Band 2 */}
    <path d="M12,62 Q50,64 88,62" stroke="#111827" strokeWidth="11" fill="none" />
    <path d="M12,62 Q50,64 88,62" stroke="#1f2937" strokeWidth="9" fill="none" />

    {/* Diagonal cross wraps */}
    <path d="M25,20 L80,75" stroke="#111827" strokeWidth="8" fill="none" />
    <path d="M25,20 L80,75" stroke="#1f2937" strokeWidth="6" fill="none" />

    {/* Highlights and texture on the black tape */}
    <path d="M25,23 L35,33" stroke="#4b5563" strokeWidth="1" opacity="0.6" />
    <path d="M45,43 L55,53" stroke="#4b5563" strokeWidth="1" opacity="0.6" />
    <path d="M26,32 L26,62" stroke="#4b5563" strokeWidth="1.5" opacity="0.4" />
    <path d="M59,19 L59,81" stroke="#4b5563" strokeWidth="1.5" opacity="0.4" />
    <path d="M12,63 L88,63" stroke="#4b5563" strokeWidth="1.2" opacity="0.4" />
  </svg>
);

const RocketWeaponSVG = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
    {/* Olive Green cylindrical body slanted */}
    <g transform="rotate(-30 50 50)">
      <rect x="25" y="42" width="52" height="16" rx="2" fill="#3f6212" stroke="#14532d" strokeWidth="2.5" />
      {/* Yellow/Black hazard stripe bands on body */}
      <path d="M42,42 L48,58" stroke="#eab308" strokeWidth="2" />
      <path d="M45,42 L51,58" stroke="#000000" strokeWidth="2" />
      <path d="M48,42 L54,58" stroke="#eab308" strokeWidth="2" />
      {/* Silver fuse ring */}
      <rect x="77" y="44" width="3" height="12" rx="0.5" fill="#9ca3af" stroke="#4b5563" strokeWidth="1" />
      {/* Black rounded warhead cone */}
      <path d="M80,40 C90,40 90,60 80,60 Z" fill="#1f2937" stroke="#111827" strokeWidth="2" />
      {/* Red tip */}
      <circle cx="86" cy="50" r="2" fill="#ef4444" />
      {/* Stabilizer fins at the tail */}
      <path d="M25,42 L12,32 L20,42 Z" fill="#111827" stroke="#1f2937" strokeWidth="1.5" />
      <path d="M25,58 L12,68 L20,58 Z" fill="#111827" stroke="#1f2937" strokeWidth="1.5" />
    </g>
  </svg>
);

const SatchelWeaponSVG = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
    {/* Leather Canvas Satchel Bag */}
    <rect x="18" y="25" width="64" height="52" rx="4" fill="#78350f" stroke="#451a03" strokeWidth="3" />
    {/* Silver duct tape wrapping horizontally */}
    <rect x="15" y="40" width="70" height="12" fill="#9ca3af" stroke="#4b5563" strokeWidth="1.5" opacity="0.9" />
    <rect x="15" y="58" width="70" height="10" fill="#9ca3af" stroke="#4b5563" strokeWidth="1.5" opacity="0.9" />
    {/* Canvas straps */}
    <rect x="28" y="10" width="8" height="15" fill="#92400e" stroke="#451a03" strokeWidth="2" />
    <rect x="64" y="10" width="8" height="15" fill="#92400e" stroke="#451a03" strokeWidth="2" />
    {/* Beancan grenade tucked inside visible at top */}
    <rect x="42" y="16" width="16" height="14" rx="1" fill="#4b5563" stroke="#1f2937" strokeWidth="1.5" />
    <rect x="45" y="13" width="10" height="3" fill="#b45309" />
    {/* Sparking / Burning Fuse thread */}
    <path d="M50,13 Q55,2 62,6" stroke="#f59e0b" strokeWidth="2" fill="none" strokeLinecap="round" />
    <path d="M50,13 Q53,-2 58,1" stroke="#f97316" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    <circle cx="58" cy="1" r="3.5" fill="#ef4444" className="animate-pulse" />
    <circle cx="58" cy="1" r="1.5" fill="#fef08a" />
  </svg>
);

const ExplosiveAmmoWeaponSVG = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
    {/* Slanted brass bullet casing */}
    <g transform="rotate(-35 50 50)">
      <rect x="40" y="32" width="20" height="42" rx="1" fill="#ca8a04" stroke="#854d0e" strokeWidth="2.5" />
      <rect x="40" y="74" width="20" height="4" fill="#a16207" stroke="#451a03" strokeWidth="1.5" />
      <path d="M42,32 L46,24 L54,24 L58,32 Z" fill="#b45309" stroke="#78350f" strokeWidth="1.5" />
      <path d="M46,24 C46,12 54,12 54,24 Z" fill="#b45309" stroke="#78350f" strokeWidth="1.5" />
      {/* Red paint tip indicating explosive payload */}
      <path d="M48,15 C48,12 52,12 52,15 Z" fill="#ef4444" />
    </g>
    {/* Action lines for explosive theme */}
    <path d="M72,25 L85,15 M80,35 L95,35 M75,50 L90,60" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
    <path d="M74,27 L80,20 M78,35 L88,35" stroke="#fef08a" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const BeancanWeaponSVG = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
    {/* Rusty baked beans tin can container */}
    <rect x="28" y="25" width="44" height="55" rx="4" fill="#4b5563" stroke="#1f2937" strokeWidth="3" />
    <line x1="28" y1="38" x2="72" y2="38" stroke="#111827" strokeWidth="2.5" />
    <line x1="28" y1="52" x2="72" y2="52" stroke="#111827" strokeWidth="2.5" />
    <line x1="28" y1="66" x2="72" y2="66" stroke="#111827" strokeWidth="2.5" />
    {/* Rust spots */}
    <path d="M30,30 Q38,35 34,45 Z" fill="#b45309" opacity="0.7" />
    <path d="M62,55 Q68,60 60,72 Z" fill="#92400e" opacity="0.8" />
    <path d="M45,26 Q55,30 48,36 Z" fill="#b45309" opacity="0.6" />
    {/* Homemade tie wires */}
    <path d="M28,45 C40,48 60,42 72,45" stroke="#9ca3af" strokeWidth="1.5" fill="none" />
    <rect x="34" y="20" width="32" height="5" fill="#374151" stroke="#111827" strokeWidth="1.5" />
    {/* Fuse burning dynamically */}
    <path d="M50,20 Q40,5 55,-2" stroke="#d97706" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    <path d="M50,20 Q43,7 50,0" stroke="#f59e0b" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    <circle cx="55" cy="-2" r="3.5" fill="#ea580c" className="animate-pulse" />
    <circle cx="55" cy="-2" r="1.5" fill="#fef08a" />
  </svg>
);

const HighStoneWallSVG = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
    {/* Heavy stone fortifying blocks */}
    <rect x="15" y="25" width="70" height="70" fill="#374151" stroke="#111827" strokeWidth="3" />
    <line x1="15" y1="48" x2="85" y2="48" stroke="#111827" strokeWidth="2.5" />
    <line x1="15" y1="72" x2="85" y2="72" stroke="#111827" strokeWidth="2.5" />
    <line x1="50" y1="25" x2="50" y2="48" stroke="#111827" strokeWidth="2" />
    <line x1="32" y1="48" x2="32" y2="72" stroke="#111827" strokeWidth="2" />
    <line x1="68" y1="48" x2="68" y2="72" stroke="#111827" strokeWidth="2" />
    <line x1="50" y1="72" x2="50" y2="95" stroke="#111827" strokeWidth="2" />
    <path d="M22,30 L28,38 L25,44" stroke="#111827" strokeWidth="1.5" fill="none" />
    <path d="M75,55 L70,62 L73,68" stroke="#111827" strokeWidth="1.5" fill="none" />
    {/* Coiled razor barbed wire topping */}
    <circle cx="32" cy="18" r="9" stroke="#9ca3af" strokeWidth="1.5" fill="none" />
    <circle cx="50" cy="18" r="9" stroke="#9ca3af" strokeWidth="1.5" fill="none" />
    <circle cx="68" cy="18" r="9" stroke="#9ca3af" strokeWidth="1.5" fill="none" />
    <path d="M20,18 L80,18" stroke="#78350f" strokeWidth="1" strokeDasharray="3 3" opacity="0.8" />
    <path d="M28,14 L30,12 M34,22 L36,24 M46,14 L48,12 M52,22 L54,24 M64,14 L66,12 M70,22 L72,24" stroke="#4b5563" strokeWidth="1.5" />
  </svg>
);

const HighWoodWallSVG = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
    {/* Thick vertical defensive logs */}
    <rect x="15" y="25" width="17" height="70" rx="3" fill="#78350f" stroke="#451a03" strokeWidth="2.5" />
    <path d="M20,25 L18,20 L28,20 L26,25" fill="#451a03" />
    <rect x="32" y="20" width="17" height="75" rx="3" fill="#92400e" stroke="#451a03" strokeWidth="2.5" />
    <path d="M37,20 L35,15 L45,15 L43,20" fill="#451a03" />
    <rect x="49" y="23" width="18" height="72" rx="3" fill="#78350f" stroke="#451a03" strokeWidth="2.5" />
    <path d="M54,23 L52,18 L62,18 L60,23" fill="#451a03" />
    <rect x="67" y="27" width="17" height="68" rx="3" fill="#92400e" stroke="#451a03" strokeWidth="2.5" />
    <path d="M72,27 L70,22 L80,22 L78,27" fill="#451a03" />
    {/* Iron horizontal stabilization straps */}
    <rect x="10" y="45" width="80" height="10" fill="#a16207" stroke="#451a03" strokeWidth="2" opacity="0.9" />
    <rect x="10" y="75" width="80" height="10" fill="#a16207" stroke="#451a03" strokeWidth="2" opacity="0.9" />
    {/* Rope bindings */}
    <path d="M20,45 L30,55 M30,45 L20,55 M52,45 L62,55 M62,45 L52,55" stroke="#f59e0b" strokeWidth="2" />
    <path d="M37,75 L47,85 M47,75 L37,85 M70,75 L80,85 M80,75 L70,85" stroke="#f59e0b" strokeWidth="2" />
    {/* Log wooden spikes on top */}
    <path d="M15,25 L23.5,10 L32,25 Z" fill="#451a03" stroke="#451a03" />
    <path d="M32,20 L40.5,5 L49,20 Z" fill="#451a03" stroke="#451a03" />
    <path d="M49,23 L58,8 L67,23 Z" fill="#451a03" stroke="#451a03" />
    <path d="M67,27 L75.5,12 L84,27 Z" fill="#451a03" stroke="#451a03" />
  </svg>
);

const WoodDoorSVG = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
    {/* Wood plank rustic door frame */}
    <rect x="15" y="10" width="70" height="80" fill="#451a03" stroke="#1f0700" strokeWidth="3" />
    <rect x="22" y="16" width="56" height="68" fill="#78350f" stroke="#451a03" strokeWidth="2.5" />
    {/* Plank divisions */}
    <line x1="22" y1="30" x2="78" y2="30" stroke="#451a03" strokeWidth="2" />
    <line x1="22" y1="46" x2="78" y2="46" stroke="#451a03" strokeWidth="2" />
    <line x1="22" y1="62" x2="78" y2="62" stroke="#451a03" strokeWidth="2" />
    <path d="M25,20 L75,76" stroke="#92400e" strokeWidth="4.5" strokeLinecap="round" opacity="0.8" />
    <path d="M25,20 L75,76" stroke="#451a03" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
    {/* Heavy key lock metal plate */}
    <rect x="62" y="44" width="12" height="18" rx="1.5" fill="#374151" stroke="#111827" strokeWidth="1.5" />
    <circle cx="68" cy="50" r="2.5" fill="#111827" />
    <line x1="68" y1="50" x2="68" y2="58" stroke="#111827" strokeWidth="2.5" strokeLinecap="round" />
    {/* Brass latch */}
    <circle cx="68" cy="48" r="1" fill="#eab308" />
    <circle cx="65" cy="46" r="0.7" fill="#9ca3af" />
    <circle cx="71" cy="46" r="0.7" fill="#9ca3af" />
    <circle cx="65" cy="60" r="0.7" fill="#9ca3af" />
    <circle cx="71" cy="60" r="0.7" fill="#9ca3af" />
  </svg>
);

const SheetDoorSVG = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
    {/* Outer Frame (Rusty Iron with screws) */}
    <rect x="12" y="8" width="76" height="84" fill="#5c4033" stroke="#2b1d16" strokeWidth="3" />
    <rect x="15" y="11" width="70" height="78" fill="#453229" />

    {/* Screws/Rivets on the Frame */}
    <circle cx="16" cy="12" r="1.5" fill="#a8a29e" />
    <circle cx="50" cy="11" r="1.5" fill="#a8a29e" />
    <circle cx="84" cy="12" r="1.5" fill="#a8a29e" />
    <circle cx="16" cy="50" r="1.5" fill="#a8a29e" />
    <circle cx="84" cy="50" r="1.5" fill="#a8a29e" />
    <circle cx="16" cy="88" r="1.5" fill="#a8a29e" />
    <circle cx="50" cy="89" r="1.5" fill="#a8a29e" />
    <circle cx="84" cy="88" r="1.5" fill="#a8a29e" />

    {/* Overlapping plates in the center */}
    <g>
      {/* Top Section - Rusty corrugated brownish-red */}
      <path d="M18,14 L82,14 L82,34 L18,34 Z" fill="#854d0e" stroke="#451a03" strokeWidth="1" />
      {/* Corrugation lines for Top Section */}
      <line x1="24" y1="14" x2="24" y2="34" stroke="#451a03" strokeWidth="1.5" />
      <line x1="32" y1="14" x2="32" y2="34" stroke="#451a03" strokeWidth="1.5" />
      <line x1="40" y1="14" x2="40" y2="34" stroke="#451a03" strokeWidth="1.5" />
      <line x1="48" y1="14" x2="48" y2="34" stroke="#451a03" strokeWidth="1.5" />
      <line x1="56" y1="14" x2="56" y2="34" stroke="#451a03" strokeWidth="1.5" />
      <line x1="64" y1="14" x2="64" y2="34" stroke="#451a03" strokeWidth="1.5" />
      <line x1="72" y1="14" x2="72" y2="34" stroke="#451a03" strokeWidth="1.5" />
      <line x1="80" y1="14" x2="80" y2="34" stroke="#451a03" strokeWidth="1.5" />

      {/* Middle-Upper Section - Yellow-Orange/Mustard corrugated horizontal plate */}
      <path d="M22,34 L78,34 L78,50 L22,50 Z" fill="#d97706" stroke="#451a03" strokeWidth="1.5" />
      {/* Horizontal corrugation bars */}
      <rect x="25" y="37" width="50" height="3" rx="1" fill="#f59e0b" stroke="#78350f" strokeWidth="0.5" />
      <rect x="25" y="41" width="50" height="3" rx="1" fill="#f59e0b" stroke="#78350f" strokeWidth="0.5" />
      <rect x="25" y="45" width="50" height="3" rx="1" fill="#f59e0b" stroke="#78350f" strokeWidth="0.5" />

      {/* Middle-Lower Section - Blue-Grey corrugated horizontal plate */}
      <path d="M20,50 L78,50 L78,66 L20,66 Z" fill="#475569" stroke="#1e293b" strokeWidth="1.5" />
      {/* Horizontal corrugation bars */}
      <rect x="23" y="53" width="52" height="3" rx="1" fill="#64748b" stroke="#334155" strokeWidth="0.5" />
      <rect x="23" y="57" width="52" height="3" rx="1" fill="#64748b" stroke="#334155" strokeWidth="0.5" />
      <rect x="23" y="61" width="52" height="3" rx="1" fill="#64748b" stroke="#334155" strokeWidth="0.5" />

      {/* Bottom Section - Overlapping dark rusty vertical plates */}
      <path d="M18,66 L82,66 L82,86 L18,86 Z" fill="#5c4033" stroke="#2b1d16" strokeWidth="1" />
      {/* Overlapping seam */}
      <line x1="45" y1="66" x2="45" y2="86" stroke="#1f1511" strokeWidth="2" />
      {/* Rivets on bottom plate seams */}
      <circle cx="25" cy="72" r="1" fill="#a8a29e" />
      <circle cx="45" cy="72" r="1" fill="#a8a29e" />
      <circle cx="65" cy="72" r="1" fill="#a8a29e" />
      <circle cx="35" cy="80" r="1" fill="#a8a29e" />
      <circle cx="55" cy="80" r="1" fill="#a8a29e" />
      <circle cx="75" cy="80" r="1" fill="#a8a29e" />

      {/* Seam Rivets of overlapping plates */}
      <circle cx="24" cy="34" r="1" fill="#f59e0b" />
      <circle cx="76" cy="34" r="1" fill="#f59e0b" />
      <circle cx="22" cy="50" r="1" fill="#a8a29e" />
      <circle cx="78" cy="50" r="1" fill="#a8a29e" />
      <circle cx="20" cy="66" r="1" fill="#a8a29e" />
      <circle cx="80" cy="66" r="1" fill="#a8a29e" />

      {/* Lockbox Housing on the right (Rustic brown/grey panel with handle) */}
      <rect x="68" y="44" width="14" height="18" rx="1" fill="#78716c" stroke="#44403c" strokeWidth="1.5" />
      {/* Handle lock cylinder */}
      <circle cx="75" cy="53" r="2.5" fill="#292524" />
      {/* T-bar Handle */}
      <line x1="71" y1="53" x2="79" y2="53" stroke="#a8a29e" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="75" cy="53" r="1" fill="#1c1917" />
    </g>

    {/* Rusty drips and aging overlay */}
    <path d="M18,14 Q25,25 21,35" stroke="#b45309" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" fill="none" />
    <path d="M78,16 Q73,28 77,40" stroke="#b45309" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" fill="none" />
    <path d="M40,50 Q43,62 38,72" stroke="#7c2d12" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" fill="none" />
  </svg>
);

const GarageDoorSVG = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
    {/* Garage outer framing panel */}
    <rect x="10" y="15" width="80" height="75" fill="#1e293b" stroke="#0f172a" strokeWidth="3" />
    {/* Side guide tracks */}
    <rect x="13" y="18" width="6" height="72" fill="#475569" />
    <rect x="81" y="18" width="6" height="72" fill="#475569" />
    {/* Roll-up segments */}
    <rect x="19" y="18" width="62" height="12" fill="#9ca3af" stroke="#4b5563" strokeWidth="1.5" />
    <rect x="19" y="30" width="62" height="12" fill="#cbd5e1" stroke="#4b5563" strokeWidth="1.5" />
    <rect x="19" y="42" width="62" height="12" fill="#9ca3af" stroke="#4b5563" strokeWidth="1.5" />
    <rect x="19" y="54" width="62" height="12" fill="#cbd5e1" stroke="#4b5563" strokeWidth="1.5" />
    <rect x="19" y="66" width="62" height="12" fill="#9ca3af" stroke="#4b5563" strokeWidth="1.5" />
    <rect x="19" y="78" width="62" height="12" fill="#475569" stroke="#4b5563" strokeWidth="1.5" />
    {/* Gears/Industrial logo spray painted in center */}
    <circle cx="50" cy="48" r="8" stroke="#cd412b" strokeWidth="2" strokeDasharray="3 3" fill="none" opacity="0.75" />
    <circle cx="50" cy="48" r="4" fill="#cd412b" opacity="0.8" />
    {/* Handles on bottom slat */}
    <rect x="30" y="80" width="10" height="3" fill="#111827" />
    <rect x="60" y="80" width="10" height="3" fill="#111827" />
  </svg>
);

const ArmoredDoorSVG = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
    {/* Thick steel frame with hazard warning highlights */}
    <rect x="15" y="10" width="70" height="80" rx="3" fill="#1e293b" stroke="#ca8a04" strokeWidth="3" />
    <rect x="22" y="16" width="56" height="68" rx="1.5" fill="#0f172a" stroke="#ca8a04" strokeWidth="1.5" />
    {/* Circular bulletproof peek window */}
    <circle cx="50" cy="32" r="10" fill="#1e293b" stroke="#475569" strokeWidth="2.5" />
    <circle cx="50" cy="32" r="6" fill="#38bdf8" stroke="#0284c7" strokeWidth="1" opacity="0.8" />
    <path d="M47,28 L53,36" stroke="#ffffff" strokeWidth="1.5" opacity="0.6" />
    {/* Rotary wheel vault mechanism lock */}
    <circle cx="50" cy="56" r="11" stroke="#eab308" strokeWidth="2.5" fill="none" />
    <line x1="50" y1="45" x2="50" y2="67" stroke="#eab308" strokeWidth="2.5" />
    <line x1="39" y1="56" x2="61" y2="56" stroke="#eab308" strokeWidth="2.5" />
    <circle cx="50" cy="56" r="3.5" fill="#ca8a04" stroke="#854d0e" strokeWidth="1.5" />
    {/* Armored rivets */}
    <circle cx="26" cy="20" r="1.5" fill="#ca8a04" />
    <circle cx="74" cy="20" r="1.5" fill="#ca8a04" />
    <circle cx="26" cy="80" r="1.5" fill="#ca8a04" />
    <circle cx="74" cy="80" r="1.5" fill="#ca8a04" />
    <circle cx="26" cy="50" r="1.5" fill="#ca8a04" />
    <circle cx="74" cy="50" r="1.5" fill="#ca8a04" />
  </svg>
);

const TCSvg = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
    {/* Double door wooden Tool Cupboard */}
    <rect x="22" y="15" width="56" height="75" rx="2" fill="#78350f" stroke="#451a03" strokeWidth="3" />
    <line x1="50" y1="15" x2="50" y2="90" stroke="#451a03" strokeWidth="2.5" />
    {/* Corner bracket sheets */}
    <path d="M22,25 L30,15 L22,15 Z" fill="#374151" stroke="#1f2937" strokeWidth="1" />
    <path d="M78,25 L70,15 L78,15 Z" fill="#374151" stroke="#1f2937" strokeWidth="1" />
    <path d="M22,80 L30,90 L22,90 Z" fill="#374151" stroke="#1f2937" strokeWidth="1" />
    <path d="M78,80 L70,90 L78,90 Z" fill="#374151" stroke="#1f2937" strokeWidth="1" />
    {/* Combination Padlock locking system */}
    <rect x="44" y="52" width="12" height="10" rx="1" fill="#ca8a04" stroke="#854d0e" strokeWidth="1" />
    <path d="M46,52 C46,45 54,45 54,52" stroke="#4b5563" strokeWidth="2.5" fill="none" />
    <circle cx="50" cy="57" r="1.5" fill="#ef4444" />
    {/* Grain lines on the wood cabinet */}
    <line x1="30" y1="25" x2="30" y2="75" stroke="#92400e" strokeWidth="1.5" strokeDasharray="15 30" opacity="0.7" />
    <line x1="70" y1="25" x2="70" y2="75" stroke="#92400e" strokeWidth="1.5" strokeDasharray="10 25" opacity="0.7" />
    {/* Upper exhaust ventilation grids */}
    <rect x="30" y="22" width="12" height="3" fill="#1f2937" />
    <rect x="58" y="22" width="12" height="3" fill="#1f2937" />
  </svg>
);

const AutoTurretSVG = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
    {/* Metallic Tripod structure legs */}
    <line x1="50" y1="45" x2="25" y2="90" stroke="#4b5563" strokeWidth="3" strokeLinecap="round" />
    <line x1="50" y1="45" x2="75" y2="90" stroke="#4b5563" strokeWidth="3" strokeLinecap="round" />
    <line x1="50" y1="45" x2="50" y2="85" stroke="#1f2937" strokeWidth="4.5" strokeLinecap="round" />
    {/* Central rotating ball joint */}
    <circle cx="50" cy="45" r="10" fill="#374151" stroke="#111827" strokeWidth="2.5" />
    {/* Ammo drum feeder */}
    <rect x="42" y="52" width="16" height="14" rx="2" fill="#1f2937" stroke="#111827" strokeWidth="1.5" />
    {/* Robotic optic housing block */}
    <rect x="34" y="22" width="32" height="24" rx="4" fill="#0f172a" stroke="#4b5563" strokeWidth="2.5" />
    {/* Active laser eye lens */}
    <circle cx="50" cy="34" r="5.5" fill="#10b981" className="animate-pulse" />
    <circle cx="50" cy="34" r="2.5" fill="#6ee7b7" />
    {/* Auxiliary targeting tracker */}
    <rect x="24" y="28" width="10" height="12" rx="1.5" fill="#374151" stroke="#111827" strokeWidth="1.5" />
    <polygon points="24,30 12,24 12,44 24,38" fill="#fef08a" opacity="0.3" />
    {/* Automatic rifle barrel extension */}
    <rect x="66" y="30" width="22" height="6" fill="#1f2937" stroke="#111827" strokeWidth="1.5" />
    <rect x="88" y="29" width="3" height="8" fill="#ca8a04" />
    {/* Laser warning guide wire */}
    <line x1="50" y1="34" x2="95" y2="34" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="3 3" />
  </svg>
);

const GuntrapSVG = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
    {/* Recycled wooden board frame */}
    <rect x="15" y="20" width="70" height="60" rx="2" fill="#92400e" stroke="#451a03" strokeWidth="3" />
    <circle cx="20" cy="25" r="1.5" fill="#9ca3af" stroke="#4b5563" strokeWidth="0.5" />
    <circle cx="80" cy="25" r="1.5" fill="#9ca3af" stroke="#4b5563" strokeWidth="0.5" />
    <circle cx="20" cy="75" r="1.5" fill="#9ca3af" stroke="#4b5563" strokeWidth="0.5" />
    <circle cx="80" cy="75" r="1.5" fill="#9ca3af" stroke="#4b5563" strokeWidth="0.5" />
    {/* Double barrels cut-off shotguns */}
    <rect x="30" y="38" width="45" height="16" fill="#374151" stroke="#111827" strokeWidth="2" />
    <line x1="30" y1="46" x2="75" y2="46" stroke="#111827" strokeWidth="2.5" />
    {/* Gun muzzle chambers */}
    <circle cx="75" cy="42" r="2.5" fill="#0c0d10" stroke="#111827" strokeWidth="1" />
    <circle cx="75" cy="50" r="2.5" fill="#0c0d10" stroke="#111827" strokeWidth="1" />
    {/* Steel clamp bar */}
    <rect x="42" y="34" width="10" height="24" fill="#4b5563" stroke="#1f2937" strokeWidth="1.5" />
    <circle cx="47" cy="37" r="1" fill="#9ca3af" />
    <circle cx="47" cy="55" r="1" fill="#9ca3af" />
    {/* Tripwire release cord */}
    <path d="M30,50 Q10,58 18,72" stroke="#cbd5e1" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    <path d="M28,40 Q25,30 20,42" stroke="#9ca3af" strokeWidth="1" fill="none" />
  </svg>
);

const FlametrapSVG = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
    {/* Orange pressurized fuel canister cylinder */}
    <rect x="30" y="25" width="40" height="52" rx="10" fill="#ea580c" stroke="#9a3412" strokeWidth="3" />
    <rect x="25" y="42" width="6" height="12" rx="1" fill="#4b5563" stroke="#1f2937" strokeWidth="1.5" />
    <line x1="30" y1="38" x2="70" y2="38" stroke="#9a3412" strokeWidth="2.5" />
    <line x1="30" y1="62" x2="70" y2="62" stroke="#9a3412" strokeWidth="2.5" />
    {/* Tank pressure meter */}
    <circle cx="50" cy="50" r="8" fill="#f3f4f6" stroke="#4b5563" strokeWidth="1.5" />
    <line x1="50" y1="50" x2="54" y2="46" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" />
    {/* Ignition burner pilot head */}
    <rect x="44" y="16" width="12" height="10" fill="#d97706" stroke="#78350f" strokeWidth="2" />
    <path d="M58,25 Q65,15 54,12" stroke="#3b82f6" strokeWidth="1.5" fill="none" />
    {/* Burning flame */}
    <path d="M50,15 C45,5 55,5 50,15 Z" fill="#3b82f6" opacity="0.9" className="animate-pulse" />
    <path d="M50,11 C47,0 53,0 50,11 Z" fill="#f97316" className="animate-pulse" />
    {/* Stand supports */}
    <path d="M34,77 L25,92" stroke="#1f2937" strokeWidth="3.5" strokeLinecap="round" />
    <path d="M66,77 L75,92" stroke="#1f2937" strokeWidth="3.5" strokeLinecap="round" />
  </svg>
);

interface RaidCalculatorTabProps {
  lang: 'ru' | 'en';
}

// Gorgeous custom icon mappers with tailored theme classes and subtle dropshadow glows
const weaponSvgMap: Record<string, React.FC<{ size?: number }>> = {
  'c4': C4WeaponSVG,
  'rocket': RocketWeaponSVG,
  'satchel': SatchelWeaponSVG,
  'explosive_ammo': ExplosiveAmmoWeaponSVG,
  'beancan': BeancanWeaponSVG,
};

const targetSvgMap: Record<string, React.FC<{ size?: number }>> = {
  'wood_wall': WoodWallSVG,
  'stone_wall': StoneWallSVG,
  'sheet_wall': SheetWallSVG,
  'armored_wall': ArmoredWallSVG,
  'high_stone_wall': HighStoneWallSVG,
  'high_wood_wall': HighWoodWallSVG,
  'wood_door': WoodDoorSVG,
  'sheet_door': SheetDoorSVG,
  'garage_door': GarageDoorSVG,
  'armored_door': ArmoredDoorSVG,
  'tc': TCSvg,
  'auto_turret': AutoTurretSVG,
  'guntrap': GuntrapSVG,
  'flametrap': FlametrapSVG,
};

export default function RaidCalculatorTab({ lang }: RaidCalculatorTabProps) {
  const [selectedWeaponId, setSelectedWeaponId] = useState<RaidWeapon['id']>('c4');
  const [activeCategory, setActiveCategory] = useState<'walls' | 'doors' | 'deployables'>('walls');
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const WeaponIcon = ({ id, size = 20 }: { id: string; size?: number }) => {
    const Svg = weaponSvgMap[id] || C4WeaponSVG;
    return (
      <ItemImageOrFallback id={id} lang={lang} fallback={Svg} size={size} />
    );
  };

  const TargetIcon = ({ id, size = 24 }: { id: string; size?: number }) => {
    const Svg = targetSvgMap[id] || WoodWallSVG;
    return (
      <ItemImageOrFallback id={id} lang={lang} fallback={Svg} size={size} />
    );
  };

  const selectedWeapon = raidWeapons.find((w) => w.id === selectedWeaponId)!;

  // Filter targets based on selected tab category
  const filteredTargets = raidTargets.filter((t) => t.category === activeCategory);

  const visualWallIds = ['wood_wall', 'stone_wall', 'sheet_wall', 'armored_wall'];
  const otherTargets = activeCategory === 'walls'
    ? filteredTargets.filter(t => !visualWallIds.includes(t.id))
    : filteredTargets;

  const updateQuantity = (id: string, delta: number) => {
    setQuantities((prev) => {
      const current = prev[id] || 0;
      const next = Math.max(0, current + delta);
      if (next === 0) {
        const { [id]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [id]: next };
    });
  };

  const clearAll = () => {
    setQuantities({});
  };

  // Calculations
  let totalWeaponsNeeded = 0;
  const targetDetailsList: { target: RaidTarget; qty: number; weaponsNeededForTarget: number }[] = [];

  Object.keys(quantities).forEach((targetId) => {
    const qty = quantities[targetId] || 0;
    const target = raidTargets.find((t) => t.id === targetId);
    if (target && qty > 0) {
      // Get requirement for single target
      const weaponsForOne = (target[selectedWeaponId] as number) || 0;
      const totalForThisTarget = weaponsForOne * qty;
      totalWeaponsNeeded += totalForThisTarget;
      targetDetailsList.push({
        target,
        qty,
        weaponsNeededForTarget: totalForThisTarget
      });
    }
  });

  const totalSulfur = totalWeaponsNeeded * selectedWeapon.sulfurPer;
  const totalCharcoal = totalWeaponsNeeded * selectedWeapon.charcoalPer;
  const totalGP = totalWeaponsNeeded * selectedWeapon.gpPer;
  const totalMetal = totalWeaponsNeeded * selectedWeapon.metalPer;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
      {/* Weapon Selector */}
      <div className="xl:col-span-4 bg-[#14171e] p-4 border border-[#2a2f3b] space-y-3 h-fit">
        <h3 className="text-xs font-bold text-white uppercase flex items-center gap-2">
          <span>⚔️</span> {lang === 'en' ? 'Weapon Selection' : 'Выбор Вооружения'}
        </h3>

        <div className="space-y-2">
          {raidWeapons.map((weapon) => {
            const isSelected = selectedWeaponId === weapon.id;
            const wName = weaponTranslationMap[weapon.id]?.[lang] || weapon.name;
            return (
              <button
                key={weapon.id}
                onClick={() => setSelectedWeaponId(weapon.id)}
                className={`w-full flex items-center gap-3 p-3 border text-left transition-all ${
                  isSelected
                    ? 'bg-[#cd412b] border-[#cd412b] text-white'
                    : 'bg-[#1b1e26] border-[#2a2f3b] text-gray-400 hover:text-white hover:border-gray-600'
                }`}
              >
                <div className={`w-10 h-10 flex items-center justify-center ${isSelected ? 'bg-[#14171e]' : 'bg-[#14171e]'}`}>
                  <WeaponIcon id={weapon.id} size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold uppercase truncate">
                    {wName}
                  </h4>
                  <div className={`text-[9px] mt-0.5 ${isSelected ? 'text-white/80' : 'text-gray-500'}`}>
                    {lang === 'en' ? `S:${weapon.sulfurPer} M:${weapon.metalPer}` : `Сера:${weapon.sulfurPer} Металл:${weapon.metalPer}`}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Targets & Calculations */}
      <div className="xl:col-span-8 space-y-4">
        <div className="bg-[#14171e] p-4 border border-[#2a2f3b] flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex gap-1 bg-[#0c0d10] p-0.5 border border-[#2a2f3b] w-full sm:w-auto">
            {[
              { id: 'walls', label: lang === 'en' ? '🧱 Walls' : '🧱 Стены' },
              { id: 'doors', label: lang === 'en' ? '🚪 Doors' : '🚪 Двери' },
              { id: 'deployables', label: lang === 'en' ? '⚙️ Items' : '⚙️ Объекты' }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as any)}
                className={`flex-1 sm:flex-none px-3 py-1.5 text-[10px] font-bold uppercase transition-all ${
                  activeCategory === cat.id
                    ? 'bg-[#cd412b] text-white'
                    : 'text-gray-400 hover:text-white bg-[#14171e]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {Object.keys(quantities).length > 0 && (
            <button
              onClick={clearAll}
              className="px-3 py-1.5 text-[10px] font-bold text-rose-400 hover:text-white hover:bg-rose-500 bg-rose-500/10 border border-rose-500/20 uppercase"
            >
              <Trash2 size={12} className="inline mr-1" />
              {lang === 'en' ? 'Clear' : 'Очистить'}
            </button>
          )}
        </div>
        
        {/* Dynamic Target Quantity Sliders Grid / Custom Visual Wall Tier Selector */}
        {activeCategory === 'walls' && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest font-mono">
              {lang === 'en' ? '🛡️ Choose Structural Wall Tier' : '🛡️ Выберите тип стены (тиры прочности)'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  id: 'wood_wall',
                  nameRU: 'Деревянная стена',
                  nameEN: 'Wood Wall',
                  hp: 250,
                  costRU: '200 Дерева',
                  costEN: '200 Wood',
                  svg: <WoodWallSVG size={48} />,
                  bgColor: 'border-[#854d0e]/30 bg-[#854d0e]/5 hover:bg-[#854d0e]/10'
                },
                {
                  id: 'stone_wall',
                  nameRU: 'Каменная стена',
                  nameEN: 'Stone Wall',
                  hp: 500,
                  costRU: '300 Камня',
                  costEN: '300 Stone',
                  svg: <StoneWallSVG size={48} />,
                  bgColor: 'border-[#4b5563]/30 bg-[#4b5563]/5 hover:bg-[#4b5563]/10'
                },
                {
                  id: 'sheet_wall',
                  nameRU: 'Металлическая стена',
                  nameEN: 'Sheet Metal Wall',
                  hp: 1000,
                  costRU: '200 Фрагментов',
                  costEN: '200 Metal Frags',
                  svg: <SheetWallSVG size={48} />,
                  bgColor: 'border-[#334155]/30 bg-[#334155]/5 hover:bg-[#334155]/10'
                },
                {
                  id: 'armored_wall',
                  nameRU: 'Бронированная стена',
                  nameEN: 'Armored Wall',
                  hp: 2000,
                  costRU: '25 МВК (HQM)',
                  costEN: '25 HQM',
                  svg: <ArmoredWallSVG size={48} />,
                  bgColor: 'border-[#ca8a04]/30 bg-[#ca8a04]/5 hover:bg-[#ca8a04]/10'
                }
              ].map((wall) => {
                const targetObj = raidTargets.find(t => t.id === wall.id);
                if (!targetObj) return null;

                const qty = quantities[wall.id] || 0;
                const singleTargetWeaponNeed = (targetObj[selectedWeaponId] as number) || 0;
                const totalTargetWeaponNeed = singleTargetWeaponNeed * qty;

                return (
                  <motion.div
                    key={wall.id}
                    whileHover={{ scale: 1.02, y: -2 }}
                    className={`border p-4 flex flex-col justify-between relative overflow-hidden transition-all ${
                      qty > 0 ? 'border-[#cd412b] bg-[#cd412b]/5 shadow-lg shadow-[#cd412b]/5' : wall.bgColor
                    }`}
                  >
                    {/* Visual corner indicators */}
                    <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-gray-500/25" />
                    <div className="absolute top-0.5 right-0.5 w-1 h-1 bg-gray-500/25" />
                    <div className="absolute bottom-0.5 left-0.5 w-1 h-1 bg-gray-500/25" />
                    <div className="absolute bottom-0.5 right-0.5 w-1 h-1 bg-gray-500/25" />

                    <div className="space-y-4">
                      {/* Central illustration & label */}
                      <div className="text-center space-y-2">
                        <div className="mx-auto w-16 h-16 flex items-center justify-center bg-[#0c0d10] border border-[#2a2f3b] rounded-none shadow-inner relative">
                          <div className="absolute top-0.5 left-0.5 w-0.5 h-0.5 bg-gray-500/50" />
                          {wall.svg}
                        </div>
                        <div>
                          <h4 className="text-xs font-black tracking-wider text-white uppercase font-sans">
                            {lang === 'ru' ? wall.nameRU : wall.nameEN}
                          </h4>
                          <span className="text-[9px] text-gray-500 font-mono block mt-0.5">
                            {lang === 'ru' ? `Стоимость: ${wall.costRU}` : `Cost: ${wall.costEN}`}
                          </span>
                        </div>
                      </div>

                      {/* HP Bar */}
                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-[9px] font-mono text-gray-400">
                          <span>HP CAPACITY</span>
                          <span>{wall.hp} HP</span>
                        </div>
                        <div className="h-1 bg-gray-900 w-full rounded-none overflow-hidden border border-gray-800">
                          <div 
                            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400"
                            style={{ width: `${(wall.hp / 2000) * 100}%` }}
                          />
                        </div>
                      </div>

                      {/* Ammo count details */}
                      <div className="bg-[#0c0d10]/60 p-2 border border-[#2a2f3b]/50 text-center font-mono">
                        <span className="text-[9px] text-gray-500 block uppercase">
                          {lang === 'ru' ? 'Расход взрывчатки' : 'Explosives Cost'}
                        </span>
                        <div className="flex items-center justify-center gap-1.5 mt-1 text-xs font-black">
                          <WeaponIcon id={selectedWeaponId} size={14} />
                          <span className="text-[#cd412b]">{singleTargetWeaponNeed}</span>
                          <span className="text-gray-500 text-[10px]">x</span>
                          <span className="text-gray-300">{qty || 1}</span>
                          {qty > 0 && (
                            <>
                              <span className="text-gray-500">=</span>
                              <span className="text-emerald-400 font-bold">{totalTargetWeaponNeed}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center justify-between mt-4 bg-[#0c0d10] border border-[#2a2f3b] p-1 rounded-none">
                      <motion.button
                        whileTap={{ scale: 0.8 }}
                        onClick={() => updateQuantity(wall.id, -1)}
                        className="w-8 h-8 rounded-none bg-[#1b1e26] hover:bg-[#cd412b] text-gray-400 hover:text-white border border-[#2a2f3b] flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <Minus size={12} />
                      </motion.button>
                      <span className="text-xs font-mono font-black text-white min-w-[24px] text-center">
                        {qty}
                      </span>
                      <motion.button
                        whileTap={{ scale: 0.8 }}
                        onClick={() => updateQuantity(wall.id, 1)}
                        className="w-8 h-8 rounded-none bg-[#1b1e26] hover:bg-[#cd412b] text-gray-400 hover:text-white border border-[#2a2f3b] flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <Plus size={12} />
                      </motion.button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {otherTargets.length > 0 && (
          <div className="space-y-3">
            {activeCategory === 'walls' && (
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest font-mono pt-2">
                {lang === 'en' ? '🧱 External Walls & Barricades' : '🧱 Внешние стены и баррикады'}
              </h3>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {otherTargets.map((target) => {
                const qty = quantities[target.id] || 0;
                const singleTargetWeaponNeed = (target[selectedWeaponId] as number) || 0;
                const targetName = targetTranslationMap[target.id]?.[lang] || target.name;

                return (
                  <motion.div
                    key={target.id}
                    whileHover={{ scale: 1.02, y: -3 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                    className={`group bg-[#14171e]/90 p-4 rounded-none border flex flex-col justify-between relative overflow-hidden ${
                      qty > 0
                        ? 'border-[#cd412b] bg-[#14171e]/90 shadow-md shadow-[#cd412b]/5'
                        : 'border-[#2a2f3b] hover:border-gray-700'
                    }`}
                  >
                    {/* Tactical Corner Brackets */}
                    <div className="rust-bracket-tl opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="rust-bracket-tr opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="rust-bracket-bl opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="rust-bracket-br opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div className="text-center space-y-2 mb-3 z-10">
                      <div className="bg-[#0c0d10] w-12 h-12 rounded-none mx-auto flex items-center justify-center border border-[#2a2f3b] shadow-inner relative">
                        <div className="absolute top-0.5 left-0.5 w-0.5 h-0.5 bg-gray-500/50" />
                        <TargetIcon id={target.id} size={24} />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-gray-200 font-sans tracking-tight line-clamp-2 min-h-[32px] flex items-center justify-center uppercase font-mono">
                          {targetName}
                        </h4>
                        <span className="inline-block text-[10px] text-gray-500 font-sans mt-1">
                          {lang === 'en' ? (
                            <>HP: {target.hp} | Need: <strong className="text-[#cd412b] font-mono font-bold text-xs">{singleTargetWeaponNeed}</strong> pcs.</>
                          ) : (
                            <>HP: {target.hp} | Надо: <strong className="text-[#cd412b] font-mono font-bold text-xs">{singleTargetWeaponNeed}</strong> шт.</>
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Adjust buttons */}
                    <div className="flex items-center justify-between bg-[#0c0d10] border border-[#2a2f3b] p-1.5 rounded-none z-10">
                      <motion.button
                        whileTap={{ scale: 0.8 }}
                        onClick={() => updateQuantity(target.id, -1)}
                        className="w-8 h-8 rounded-none bg-[#1b1e26] hover:bg-[#cd412b] text-gray-400 hover:text-white border border-[#2a2f3b] flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <Minus size={12} />
                      </motion.button>
                      <span className="text-xs font-mono font-bold text-white min-w-[20px] text-center">
                        {qty}
                      </span>
                      <motion.button
                        whileTap={{ scale: 0.8 }}
                        onClick={() => updateQuantity(target.id, 1)}
                        className="w-8 h-8 rounded-none bg-[#1b1e26] hover:bg-[#cd412b] text-gray-400 hover:text-white border border-[#2a2f3b] flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <Plus size={12} />
                      </motion.button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* Selected Targets Chip Container */}
        <div className="bg-[#14171e]/90 p-5 rounded-none border border-[#2a2f3b] space-y-4 shadow-xl relative overflow-hidden">
          <div className="rust-bracket-tl" />
          <div className="rust-bracket-tr" />
          <div className="rust-bracket-bl" />
          <div className="rust-bracket-br" />

          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 font-mono text-[10px]">
              {lang === 'en' ? 'Selected raid targets:' : 'Выбранные цели для рейда:'}
            </h3>
            {targetDetailsList.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {targetDetailsList.map(({ target, qty, weaponsNeededForTarget }) => {
                  const targetName = targetTranslationMap[target.id]?.[lang] || target.name;
                  return (
                    <span
                      key={target.id}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-none bg-[#1b1e26] border border-[#2a2f3b] text-xs text-gray-300 font-mono uppercase"
                    >
                      <span className="flex items-center justify-center"><TargetIcon id={target.id} size={14} /></span>
                      <span>{targetName}</span>
                      <strong className="text-[#cd412b] font-bold">×{qty}</strong>
                      <span className="text-[10px] text-gray-500 font-mono font-bold lowercase">
                        {lang === 'en' ? `(requires ${weaponsNeededForTarget} pcs.)` : `(требует ${weaponsNeededForTarget} шт.)`}
                      </span>
                    </span>
                  );
                })}
              </div>
            ) : (
              <div className="text-xs text-gray-500 font-sans italic font-medium">
                {lang === 'en' 
                  ? 'No targets selected. Use the "+" buttons above to add raid targets.' 
                  : 'Цели не выбраны. Используйте кнопки "+" выше, чтобы добавить элементы для рейда.'
                }
              </div>
            )}
          </div>

          {/* Results Summary Box */}
          <AnimatePresence mode="popLayout">
            {totalWeaponsNeeded > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="border-t border-[#2a2f3b] pt-5 space-y-4"
              >
                {/* Total Weapon Requirement Header */}
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="text-sm font-bold text-white flex items-center gap-2 font-sans font-medium uppercase">
                    <span>{lang === 'en' ? 'Required for raid:' : 'Потребуется для взрыва:'}</span>
                    <span className="inline-flex items-center gap-1.5 bg-[#cd412b]/10 text-[#cd412b] px-3 py-1 rounded-none border border-[#cd412b]/20 font-mono">
                      <span className="flex items-center justify-center"><WeaponIcon id={selectedWeapon.id} size={14} /></span>
                      <span>{weaponTranslationMap[selectedWeapon.id]?.[lang] || selectedWeapon.name}</span>
                    </span>
                  </div>
                  <div className="text-2xl font-black text-[#cd412b] font-mono">
                    {totalWeaponsNeeded} <span className="text-xs text-gray-400 font-sans font-bold uppercase">{lang === 'en' ? 'pcs.' : 'шт.'}</span>
                  </div>
                </div>

                {/* Raw Ingredients breakdown */}
                <div className="space-y-2">
                  <div className="text-[10px] font-bold text-gray-500 tracking-widest uppercase mb-1 font-mono">
                    {lang === 'en' ? 'Total raw resources for explosive crafting:' : 'Общие сырьевые ресурсы для крафта взрывчатки:'}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {/* Sulfur */}
                    <div className="bg-[#1b1e26] p-3 rounded-none border border-[#2a2f3b] flex flex-col justify-between relative">
                      <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-gray-600/50" />
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-mono">
                        {lang === 'en' ? 'Sulfur' : 'Сера (Sulfur)'}
                      </span>
                      <span className="text-sm font-black text-amber-500 font-mono mt-1">
                        {totalSulfur.toLocaleString()}
                      </span>
                    </div>

                    {/* Charcoal */}
                    <div className="bg-[#1b1e26] p-3 rounded-none border border-[#2a2f3b] flex flex-col justify-between relative">
                      <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-gray-600/50" />
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-mono">
                        {lang === 'en' ? 'Charcoal' : 'Уголь (Charcoal)'}
                      </span>
                      <span className="text-sm font-black text-gray-400 font-mono mt-1">
                        {totalCharcoal.toLocaleString()}
                      </span>
                    </div>

                    {/* Gunpowder */}
                    <div className="bg-[#1b1e26] p-3 rounded-none border border-[#2a2f3b] flex flex-col justify-between relative">
                      <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-gray-600/50" />
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-mono">
                        {lang === 'en' ? 'Gunpowder' : 'Порох (GP)'}
                      </span>
                      <span className="text-sm font-black text-rose-500 font-mono mt-1">
                        {totalGP.toLocaleString()}
                      </span>
                    </div>

                    {/* Metal Fragments */}
                    <div className="bg-[#1b1e26] p-3 rounded-none border border-[#2a2f3b] flex flex-col justify-between relative">
                      <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-gray-600/50" />
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-mono">
                        {lang === 'en' ? 'Metal (Frags)' : 'Металл (Frags)'}
                      </span>
                      <span className="text-sm font-black text-sky-500 font-mono mt-1">
                        {totalMetal.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Info block */}
                <div className="bg-[#1b1e26]/50 p-3 rounded-none border border-[#2a2f3b] flex gap-2 items-start text-[10px] text-gray-500 font-sans leading-relaxed font-medium relative">
                  <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-gray-600/50" />
                  <Info size={14} className="text-[#cd412b] flex-shrink-0 mt-0.5" />
                  <span>
                    {lang === 'en' 
                      ? 'All calculations are based on the official Rust Wiki for 2026. Data includes raw crafting costs only, excluding workbenches and blueprints.'
                      : 'Все расчеты основаны на официальном справочнике Rust Wiki за 2026 год. Данные включают в себя только чистые затраты сырья без учета верстаков и рецептов.'
                    }
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
