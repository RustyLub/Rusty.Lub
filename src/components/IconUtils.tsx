import { useState, useEffect } from 'react';
import fandomIcons from './fandom_icons.json';

// Import all image assets eagerly so Vite provides valid static URLs
const localImages = import.meta.glob<{ default: string }>('../assets/images/*.(webp|png|jpg|jpeg|svg)', { eager: true });

const ID_ALIASES: Record<string, string> = {
  assault_rifle: 'rifle.ak',
  custom_smg: 'smg.2',
  rifle_ak: 'rifle.ak',
  ak47: 'rifle.ak',
  smg_2: 'smg.2',
  rifle_semiauto: 'rifle.semiauto',
  sar: 'rifle.semiauto',
  lmg_m249: 'lmg.m249',
  m249: 'lmg.m249',
  rifle_bolt: 'rifle.bolt',
  bolt: 'rifle.bolt',
  shotgun_pump: 'shotgun.pump',
  pump_shotgun: 'shotgun.pump',
  pistol_m92: 'pistol.m92',
  pistol_python: 'pistol.python',
  pistol_semiauto: 'pistol.semiauto',
  pistol_revolver: 'pistol.revolver',
  rifle_m16a2: 'rifle.m16a2',
  rifle_m39: 'rifle.m39',
  rifle_l96: 'rifle.l96',
  shotgun_double: 'shotgun.double',
  double_barrel: 'shotgun.double',
  shotgun_waterpipe: 'shotgun.waterpipe',
  waterpipe: 'shotgun.waterpipe',
  shotgun_spas12: 'shotgun.spas12',
  timed_explosive: 'explosive.timed',
  'timed.explosive': 'explosive.timed',
  c4: 'explosive.timed',
  ammo_rocket_basic: 'ammo.rocket.basic',
  rocket: 'ammo.rocket.basic',
  explosive_satchel: 'explosive.satchel',
  satchel: 'explosive.satchel',
  ammo_rifle_explosive: 'ammo.rifle.explosive',
  grenade_beancan: 'grenade.beancan',
  wall_external_high_stone: 'wall.external.high.stone',
  wall_external_high_wood: 'high_wood_wall',
  door_hinged_wood: 'door.hinged.wood',
  door_hinged_metal: 'door.hinged.metal',
  wall_frame_garagedoor: 'wall.frame.garagedoor',
  door_hinged_toptier: 'door.hinged.toptier',
  floor_ladder_hatch: 'floor.ladder.hatch',
  cupboard_tool: 'cupboard.tool',
  'cupboard.tool': 'cupboard.tool',
  tc: 'cupboard.tool',
  autoturret: 'autoturret',
  shotgun_trap: 'guntrap',
  flamethrower_turret: 'flametrap',
  'generator.wind': 'generator.wind.scrap',
  'generator.wind.scrap': 'generator.wind.scrap',
  wind_turbine: 'generator.wind.scrap',
  mixing_table: 'mixingtable',
  'mixing.table': 'mixingtable',
  'seed.hemp': 'seed.hemp',
  hemp: 'seed.hemp',
  clone_hemp: 'clone.hemp',
  'clone.hemp': 'clone.hemp',
  pager: 'rf_pager',
  'rf.pager': 'rf_pager',
  rf_pager: 'rf_pager',
  smart_alarm: 'smart.alarm',
  'smart.alarm': 'smart.alarm',
  smart_switch: 'smart.switch',
  'smart.switch': 'smart.switch',
  code_lock: 'lock.code',
  'lock.code': 'lock.code',
  computer_station: 'computerstation',
  'computer.station': 'computerstation',
  computerstation: 'computerstation',
  keycard_red: 'keycard_red',
  'keycard.red': 'keycard_red',
  keycard_blue: 'keycard_blue',
  'keycard.blue': 'keycard_blue',
  keycard_green: 'keycard_green',
  'keycard.green': 'keycard_green',
  box_wooden_large: 'box.wooden.large',
  'box.wooden.large': 'box.wooden.large',
  recycler: 'scrap'
};

const CACHE_KEY = 'rust_icon_cache_v1';

export const getIconCache = (): Record<string, string> => {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
};

export const setCachedIconUrl = (id: string, url: string) => {
  try {
    const cache = getIconCache();
    cache[id] = url;
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch (e) {
    // Ignore quota errors if storage full
  }
};

export const clearIconCache = () => {
  try {
    localStorage.removeItem(CACHE_KEY);
  } catch (e) {}
};

// Converts image to Base64 Data URL if CORS allows, otherwise saves verified working URL
export const cacheImageAsBase64 = (id: string, url: string) => {
  if (!url || url.startsWith('data:')) {
    if (url) setCachedIconUrl(id, url);
    return;
  }
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = () => {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth || 64;
      canvas.height = img.naturalHeight || 64;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        const dataUrl = canvas.toDataURL('image/png');
        setCachedIconUrl(id, dataUrl);
      } else {
        setCachedIconUrl(id, url);
      }
    } catch (err) {
      // CORS restricted, save working URL
      setCachedIconUrl(id, url);
    }
  };
  img.onerror = () => {
    setCachedIconUrl(id, url);
  };
  img.src = url;
};

// Returns an array of candidate URLs to try sequentially in case of image load failure
export const getRustLabsIconUrls = (id: string): string[] => {
  const targetId = ID_ALIASES[id] || id;
  const urls: string[] = [];

  // Check if saved in localStorage
  const cache = getIconCache();
  const cachedUrl = cache[id] || cache[targetId];
  if (cachedUrl) {
    urls.push(cachedUrl);
  }

  // 1. Direct verified mapping from comprehensive dictionary
  const mappedFandom = (fandomIcons as Record<string, string>)[id] || (fandomIcons as Record<string, string>)[targetId];
  if (mappedFandom) {
    urls.push(mappedFandom);
  }

  // 2. Official RustLabs high-resolution 180x180 item icon mirror
  urls.push(`https://wiki.rustclash.com/img/items180/${targetId}.png`);

  // 3. Check local images bundled in Vite
  const localWebp = `../assets/images/${targetId}.webp`;
  if (localImages[localWebp]) {
    urls.push(localImages[localWebp].default);
  }
  const localPng = `../assets/images/${targetId}.png`;
  if (localImages[localPng]) {
    urls.push(localImages[localPng].default);
  }

  // 4. Secondary CDN fallbacks
  urls.push(`https://cdn.rustlabs.com/img/items180/${targetId}.png`);
  urls.push(`https://www.rust-items.com/images/${targetId}.png`);

  // Remove duplicates while preserving order
  return Array.from(new Set(urls));
};

export const getRustLabsIconUrl = (id: string): string => {
  return getRustLabsIconUrls(id)[0] || `https://www.rust-items.com/images/${id}.png`;
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
  const candidateUrls = getRustLabsIconUrls(id);
  const [urlIndex, setUrlIndex] = useState(0);
  const [hasError, setHasError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setUrlIndex(0);
    setHasError(false);
    setLoaded(false);
  }, [id]);

  const currentUrl = candidateUrls[urlIndex];

  const handleImgError = () => {
    if (urlIndex + 1 < candidateUrls.length) {
      setUrlIndex(prev => prev + 1);
      setLoaded(false);
    } else {
      setHasError(true);
    }
  };

  if (!hasError && currentUrl) {
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
          key={currentUrl}
          src={currentUrl}
          alt={id}
          referrerPolicy="no-referrer"
          className={`object-contain transition-opacity duration-200 ${loaded ? 'opacity-100' : 'opacity-0'}`}
          style={{ width: size * 0.95, height: size * 0.95 }}
          onLoad={() => {
            setLoaded(true);
            if (currentUrl) {
              cacheImageAsBase64(id, currentUrl);
            }
          }}
          onError={handleImgError}
        />
      </div>
    );
  }

  // Fallback if image fails to load across all candidate URLs
  if (Fallback) {
    return <Fallback size={size} />;
  }

  return (
    <div className="text-xl flex items-center justify-center" style={{ width: size, height: size }}>
      {icon || '📦'}
    </div>
  );
}

