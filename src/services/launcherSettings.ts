/**
 * Windows Desktop Launcher Settings & State Service for Rusty.Lub
 * Manages game execution parameters, HUD overlay configuration,
 * Steam launch protocol, audio siren options and performance optimizations.
 */

export interface FavoriteServer {
  id: string;
  name: string;
  ip: string;
  port: number;
  region: string;
  type: string;
  players?: string;
  ping?: number;
}

export interface LauncherSettings {
  // Rust Client & Launching
  rustPath: string;
  launchArgs: string;
  launchPreset: 'fps' | 'stream' | 'lowpc' | 'custom';
  onLaunchBehavior: 'minimize_tray' | 'open_hud' | 'keep_open';
  autoStartWindows: boolean;
  runAsAdmin: boolean;
  
  // Game & Server Quick Connect
  favoriteServers: FavoriteServer[];
  selectedServerId: string;
  steamProtocolEnabled: boolean;

  // HUD Overlay Configuration
  hudHotkey: string; // 'Alt+O' | 'Ctrl+F1' | 'F12' | 'F8' | 'Alt+H'
  hudDefaultOpacity: number; // 30 - 100
  hudAlwaysOnTop: boolean;
  hudSoundEffects: boolean;
  hudStartSection: 'raid' | 'weapons' | 'binds' | 'alerts';
  hudPosition: 'center' | 'top_right' | 'left';
  clickThroughEnabled: boolean;

  // Notifications & Audio
  nativeNotifications: boolean;
  raidSirenVolume: number; // 0 - 100
  raidSirenType: 'tactical' | 'siren' | 'radar';
  wipeAlertsEnabled: boolean;

  // Optimization & Performance
  fpsLimit: number; // 60, 144, 240, 0 (unlimited)
  backgroundFpsLimit: number; // 30, 60
  hardwareAcceleration: boolean;
  companionMode: boolean; // Second screen mode

  // Version & Updates
  appVersion: string;
  channel: 'stable' | 'beta';
  autoCheckUpdates: boolean;
  lastCheckDate?: string;
}

export const LAUNCH_PRESETS: Record<'fps' | 'stream' | 'lowpc', { labelRu: string; labelEn: string; args: string }> = {
  fps: {
    labelRu: 'Максимальный FPS (Competitive)',
    labelEn: 'Max FPS (Competitive)',
    args: '-high -maxMem=16384 -malloc=system -force-feature-level-11-0 -cpuCount=8 -window-mode exclusive -rate 144'
  },
  stream: {
    labelRu: 'Стриминг и Запись (Borderless)',
    labelEn: 'Streaming & Recording (Borderless)',
    args: '-high -maxMem=12288 -window-mode borderless -rate 144 -gc.buffer 4096'
  },
  lowpc: {
    labelRu: 'Для слабых ПК (Low-End Hardware)',
    labelEn: 'Budget / Low-End Hardware',
    args: '-low -maxMem=8192 -malloc=system -force-d3d11-no-singlethreaded -gc.buffer 2048'
  }
};

export const DEFAULT_FAVORITE_SERVERS: FavoriteServer[] = [
  {
    id: 'magic-rust-1',
    name: 'Magic Rust #1 [Max 5 | Wipe Mon/Fri]',
    ip: '185.189.255.45',
    port: 28015,
    region: 'RU / EU',
    type: '2x Vanilla',
    players: '280/300',
    ping: 18
  },
  {
    id: 'rustafied-eu-trio',
    name: 'Rustafied.com EU Trio Main',
    ip: '145.239.205.152',
    port: 28015,
    region: 'EU West',
    type: '1x Official',
    players: '200/200',
    ping: 34
  },
  {
    id: 'stevious-2x',
    name: 'Stevious 2x Small Solo/Duo/Trio',
    ip: '147.135.30.82',
    port: 28015,
    region: 'EU Central',
    type: '2x Modded',
    players: '175/200',
    ping: 42
  },
  {
    id: 'rustylub-training',
    name: 'Rusty.Lub Aim & Raid Training Ground',
    ip: '127.0.0.1',
    port: 28015,
    region: 'Local / Dedicated',
    type: 'Training Sandbox',
    players: 'Solo Practice',
    ping: 1
  }
];

export const DEFAULT_LAUNCHER_SETTINGS: LauncherSettings = {
  rustPath: 'C:\\Program Files (x86)\\Steam\\steamapps\\common\\Rust\\RustClient.exe',
  launchArgs: LAUNCH_PRESETS.fps.args,
  launchPreset: 'fps',
  onLaunchBehavior: 'open_hud',
  autoStartWindows: false,
  runAsAdmin: true,
  
  favoriteServers: DEFAULT_FAVORITE_SERVERS,
  selectedServerId: 'magic-rust-1',
  steamProtocolEnabled: true,

  hudHotkey: 'Alt+O',
  hudDefaultOpacity: 92,
  hudAlwaysOnTop: true,
  hudSoundEffects: true,
  hudStartSection: 'raid',
  hudPosition: 'center',
  clickThroughEnabled: false,

  nativeNotifications: true,
  raidSirenVolume: 80,
  raidSirenType: 'tactical',
  wipeAlertsEnabled: true,

  fpsLimit: 144,
  backgroundFpsLimit: 30,
  hardwareAcceleration: true,
  companionMode: false,

  appVersion: '3.0.2',
  channel: 'stable',
  autoCheckUpdates: true,
  lastCheckDate: new Date().toLocaleDateString()
};

const STORAGE_KEY = 'rustylub_launcher_settings_v2';

export function getLauncherSettings(): LauncherSettings {
  if (typeof window === 'undefined') return DEFAULT_LAUNCHER_SETTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_LAUNCHER_SETTINGS;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_LAUNCHER_SETTINGS,
      ...parsed,
      // The app version is shipped with the build, not user-editable state.
      appVersion: DEFAULT_LAUNCHER_SETTINGS.appVersion,
      favoriteServers: parsed.favoriteServers?.length ? parsed.favoriteServers : DEFAULT_FAVORITE_SERVERS
    };
  } catch {
    return DEFAULT_LAUNCHER_SETTINGS;
  }
}

export function saveLauncherSettings(patch: Partial<LauncherSettings>): LauncherSettings {
  const current = getLauncherSettings();
  const updated: LauncherSettings = { ...current, ...patch };
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save launcher settings:', e);
    }
  }
  return updated;
}

export function resetLauncherSettings(): LauncherSettings {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }
  return DEFAULT_LAUNCHER_SETTINGS;
}

/**
 * Execute Rust Launch via Steam Protocol or Direct Server Connection
 */
export function launchRustGame(
  settings: LauncherSettings, 
  customServer?: { ip: string; port: number }
): { 
  success: boolean; 
  url: string; 
  messageRu: string; 
  messageEn: string;
} {
  try {
    let steamUrl = 'steam://run/252490';

    if (customServer && customServer.ip && customServer.port) {
      steamUrl = `steam://connect/${customServer.ip}:${customServer.port}`;
    } else if (settings.selectedServerId) {
      const server = settings.favoriteServers.find(s => s.id === settings.selectedServerId);
      if (server && server.ip !== '127.0.0.1') {
        steamUrl = `steam://connect/${server.ip}:${server.port}`;
      }
    }

    // Trigger URL via browser navigation or invisible anchor
    if (typeof window !== 'undefined') {
      const anchor = document.createElement('a');
      anchor.href = steamUrl;
      anchor.style.display = 'none';
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
    }

    return {
      success: true,
      url: steamUrl,
      messageRu: customServer || settings.selectedServerId 
        ? `Запуск Rust и подключение к серверу через Steam protocol (${steamUrl})...`
        : 'Запуск Rust Client через Steam (App ID 252490)...',
      messageEn: customServer || settings.selectedServerId
        ? `Launching Rust and connecting to server via Steam (${steamUrl})...`
        : 'Launching Rust Client via Steam protocol (App ID 252490)...'
    };
  } catch (err: any) {
    return {
      success: false,
      url: '',
      messageRu: `Ошибка запуска: ${err?.message || 'Не удалось передать команду в Steam'}`,
      messageEn: `Launch error: ${err?.message || 'Failed to dispatch command to Steam'}`
    };
  }
}

/**
 * Clear Launcher Temporary Files and Web Cache
 */
export async function clearLauncherCache(): Promise<boolean> {
  try {
    if (typeof window !== 'undefined') {
      // Clear non-settings storage
      const keysToKeep = [STORAGE_KEY, 'rustylub_theme', 'rustylub_lang'];
      const allKeys = Object.keys(localStorage);
      for (const k of allKeys) {
        if (!keysToKeep.includes(k) && !k.startsWith('firebase')) {
          localStorage.removeItem(k);
        }
      }
      if ('caches' in window) {
        const cacheNames = await window.caches.keys();
        await Promise.all(cacheNames.map(name => window.caches.delete(name)));
      }
    }
    return true;
  } catch {
    return false;
  }
}
