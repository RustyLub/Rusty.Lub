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
 * Clean mobile-style notification tones for desktop and radar alerts.
 * Sounds are synthesized locally; no external recordings are required.
 */
export function playNotificationAudio(type: 'raid' | 'radar' | 'system' = 'raid') {
  if (typeof window === 'undefined') return;

  const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioCtx) return;

  let ctx: AudioContext | null = null;
  try {
    ctx = new AudioCtx();
    const audio = ctx;
    const master = audio.createGain();
    master.gain.value = 0.42;
    master.connect(audio.destination);

    const tone = (frequency: number, offset: number, duration: number, level = 0.2) => {
      const oscillator = audio.createOscillator();
      const envelope = audio.createGain();
      const at = audio.currentTime + 0.025 + offset;
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(frequency, at);
      envelope.gain.setValueAtTime(0.0001, at);
      envelope.gain.exponentialRampToValueAtTime(level, at + 0.012);
      envelope.gain.exponentialRampToValueAtTime(0.0001, at + duration);
      oscillator.connect(envelope);
      envelope.connect(master);
      oscillator.start(at);
      oscillator.stop(at + duration + 0.02);
    };

    if (type === 'raid') {
      // Distinct paired alert, urgent without the abrasive synthetic siren.
      [0, 0.22, 0.72, 0.94].forEach((offset, index) => {
        tone(index % 2 === 0 ? 880 : 1174.66, offset, 0.18, 0.24);
      });
    } else if (type === 'radar') {
      // A subtle two-part ping with a short, clear decay.
      tone(987.77, 0, 0.16, 0.18);
      tone(1318.51, 0.11, 0.24, 0.16);
    } else {
      // Gentle double chime for general app events.
      tone(880, 0, 0.19, 0.18);
      tone(1174.66, 0.095, 0.28, 0.16);
    }

    const delay = type === 'raid' ? 1300 : 550;
    const closeContext = () => { void audio.close().catch(() => undefined); };
    if (audio.state === 'suspended') {
      void audio.resume().then(() => window.setTimeout(closeContext, delay)).catch(() => undefined);
    } else {
      window.setTimeout(closeContext, delay);
    }
  } catch (err) {
    if (ctx && ctx.state !== 'closed') void ctx.close().catch(() => undefined);
    console.warn('Audio notification playback error:', err);
  }
}
