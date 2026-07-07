import { useState } from 'react';
import fandomIcons from './fandom_icons.json';

const LOCAL_ITEMS = new Set([
  'ak47', 'lr300', 'mp5', 'thompson', 'custom', 'sar', 'hmlmg', 'm249', 'bolt',
  'pump_shotgun', 'm92', 'python', 'sap', 'revolver', 'm16a2', 'crossbow',
  'm39', 'l96', 'double_barrel', 'waterpipe', 'spas12',
  'c4', 'rocket', 'satchel', 'explosive_ammo', 'beancan',
  'high_stone_wall', 'high_wood_wall', 'wood_door', 'sheet_door', 'garage_door', 
  'armored_door', 'armored_hatch', 'tc', 'auto_turret', 'guntrap', 'flametrap',
  'wood_wall', 'stone_wall', 'sheet_wall', 'armored_wall',
  'scrap', 'metal_fragments', 'high_quality_metal', 'cloth', 'leather', 'rope', 
  'wood', 'gears', 'metal_pipe', 'sewing_kit', 'sheet_metal', 'road_signs', 
  'tech_trash', 'metal_blade', 'tarp', 'propane_tank', 'metal_spring', 
  'smg_body', 'semi_body', 'rifle_body', 'fuse', 'large_battery'
]);

export const getRustLabsIconUrl = (id: string): string => {
  if (LOCAL_ITEMS.has(id)) {
    return new URL(`../assets/images/${id}.webp`, import.meta.url).href;
  }
  return (fandomIcons as Record<string, string>)[id] || `https://wiki.rustclash.com/img/items180/${id}.png`;
};

interface ItemImageOrFallbackProps {
  id: string;
  lang: 'ru' | 'en';
  fallback?: React.ComponentType<{ size?: number }> | (() => React.JSX.Element);
  size?: number;
  className?: string;
  icon?: string;
}

export function ItemImageOrFallback({ id, lang, fallback: Fallback, size = 44, className = '', icon }: ItemImageOrFallbackProps) {
  const [hasError, setHasError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const iconUrl = getRustLabsIconUrl(id);

  if (!hasError) {
    return (
      <div className={`relative flex items-center justify-center shrink-0 ${className}`} style={{ width: size, height: size }}>
        {!loaded && (
          <div className="absolute inset-0 bg-zinc-950/20 animate-pulse flex items-center justify-center rounded-sm">
            {Fallback ? (
              <div className="opacity-40 scale-75">
                <Fallback size={size * 0.8} />
              </div>
            ) : (
              <span className="text-zinc-600 font-mono text-[9px]">...</span>
            )}
          </div>
        )}
        <img
          src={iconUrl}
          alt={id}
          referrerPolicy="no-referrer"
          className={`object-contain transition-opacity duration-200 ${loaded ? 'opacity-100' : 'opacity-0'}`}
          style={{ width: size * 0.95, height: size * 0.95 }}
          onLoad={() => setLoaded(true)}
          onError={() => setHasError(true)}
        />
      </div>
    );
  }

  // Fallback if image fails to load
  if (Fallback) {
    return <Fallback size={size} />;
  }

  return (
    <div className="text-xl flex items-center justify-center" style={{ width: size, height: size }}>
      {icon || '📦'}
    </div>
  );
}
