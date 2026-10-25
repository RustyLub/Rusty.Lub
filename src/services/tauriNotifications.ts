/**
 * Windows Native Notifications & Sound Service for Rusty.Lub Tauri 2
 */

export async function requestNotificationPermissions(): Promise<boolean> {
  if (typeof window === 'undefined') return false;

  // Try Web Notifications API as universal fallback
  if ('Notification' in window) {
    if (Notification.permission === 'granted') {
      return true;
    } else if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
  }
  return false;
}

export async function sendWindowsNotification(
  title: string,
  body: string,
  type: 'raid' | 'radar' | 'system' | 'update' = 'system'
): Promise<boolean> {
  if (typeof window === 'undefined') return false;

  const isTauri = '__TAURI_INTERNALS__' in window || '__TAURI__' in window;

  // 1. Play audio alarm if it's a raid alarm or radar alert
  if (type === 'raid' || type === 'radar') {
    playNotificationAudio(type);
  }

  // 2. Try Tauri 2 Notification plugin if available
  if (isTauri) {
    try {
      // Dynamic import to avoid build errors if plugin is absent
      const { sendNotification, isPermissionGranted, requestPermission } = await import('@tauri-apps/plugin-notification' as any);
      let permissionGranted = await isPermissionGranted();
      if (!permissionGranted) {
        const permission = await requestPermission();
        permissionGranted = permission === 'granted';
      }
      if (permissionGranted) {
        sendNotification({ title: `[RUSTY.LUB] ${title}`, body });
        return true;
      }
    } catch (err) {
      console.warn('Tauri native notification plugin fallback:', err);
    }
  }

  // 3. Fallback to Web Notification API
  if ('Notification' in window && Notification.permission === 'granted') {
    try {
      new Notification(`RUSTY.LUB • ${title}`, {
        body,
        icon: '/favicon.ico',
        tag: `rustylub-${type}-${Date.now()}`
      });
      return true;
    } catch (e) {
      console.warn('Web notification error:', e);
    }
  }

  return false;
}

/**
 * Synthesizes a high-contrast tactical audio chime for Rust raid alarms and radar alerts
 */
export function playNotificationAudio(type: 'raid' | 'radar' | 'system' = 'raid') {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'raid') {
      // Alarm siren pattern (alternating 880Hz and 587Hz)
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.3);
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.35);
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.7);

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.85);
    } else if (type === 'radar') {
      // Submarine radar ping (high frequency pulse)
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1600, ctx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.45);
    } else {
      // Gentle system ping
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.1);

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.3);
    }
  } catch (err) {
    console.warn('Audio synthesis alert error:', err);
  }
}
