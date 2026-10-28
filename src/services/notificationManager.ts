// Notification Manager Service for Web Push, Sound Synthesis, and Alarm Subscriptions

export interface NotificationSettings {
  enabled: boolean;
  forceWipe: boolean;
  gameUpdates: boolean;
  rustPlusAlarms: boolean;
  eventTimers: boolean;
  soundAlerts: boolean;
  soundVolume: number;
}

const STORAGE_KEY = 'rust_web_push_settings_v1';

export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  enabled: false,
  forceWipe: true,
  gameUpdates: true,
  rustPlusAlarms: true,
  eventTimers: true,
  soundAlerts: true,
  soundVolume: 0.8,
};

export function getNotificationSettings(): NotificationSettings {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return { ...DEFAULT_NOTIFICATION_SETTINGS, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.warn('Failed to parse notification settings:', e);
  }
  return { ...DEFAULT_NOTIFICATION_SETTINGS };
}

export function saveNotificationSettings(settings: NotificationSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (e) {
    console.warn('Failed to save notification settings:', e);
  }
}

export function isPushNotificationSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

export function getNotificationPermission(): NotificationPermission {
  if (!isPushNotificationSupported()) return 'denied';
  return Notification.permission;
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!isPushNotificationSupported()) return 'denied';
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const current = getNotificationSettings();
      saveNotificationSettings({ ...current, enabled: true });
    }
    return permission;
  } catch (err) {
    console.error('Error requesting notification permission:', err);
    return 'denied';
  }
}

// Short, polished notification tones inspired by the concise feel of mobile alerts.
// Original Web Audio synthesis; no external audio files or copyrighted iOS recordings.
export function playNotificationSound(type: 'chime' | 'alarm' | 'wipe' | 'timer' = 'chime', volume = 0.8) {
  if (typeof window === 'undefined') return;

  const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtx) return;

  let ctx: AudioContext | null = null;
  try {
    ctx = new AudioCtx();
    const audio = ctx;
    const master = audio.createGain();
    master.gain.value = Math.max(0, Math.min(1, volume)) * 0.55;
    master.connect(audio.destination);

    const tone = (frequency: number, at: number, duration: number, level = 0.22, wave: OscillatorType = 'sine') => {
      const oscillator = audio.createOscillator();
      const envelope = audio.createGain();
      oscillator.type = wave;
      oscillator.frequency.setValueAtTime(frequency, at);
      envelope.gain.setValueAtTime(0.0001, at);
      envelope.gain.exponentialRampToValueAtTime(Math.max(0.001, level), at + 0.012);
      envelope.gain.exponentialRampToValueAtTime(0.0001, at + duration);
      oscillator.connect(envelope);
      envelope.connect(master);
      oscillator.start(at);
      oscillator.stop(at + duration + 0.02);
    };

    const now = audio.currentTime + 0.025;
    if (type === 'alarm') {
      // Noticeable, but clean and non-harsh: two paired alert pulses.
      [0, 0.22, 0.72, 0.94].forEach((offset, index) => {
        tone(index % 2 === 0 ? 880 : 1174.66, now + offset, 0.18, 0.24);
      });
    } else if (type === 'wipe') {
      // Positive ascending three-note announcement.
      [659.25, 783.99, 987.77].forEach((frequency, index) => {
        tone(frequency, now + index * 0.13, 0.32, 0.19);
      });
    } else if (type === 'timer') {
      // Clear completion signal: a compact three-note chime.
      [783.99, 987.77, 1174.66].forEach((frequency, index) => {
        tone(frequency, now + index * 0.16, 0.24, 0.2);
      });
    } else {
      // Soft, bright double chime reminiscent of a modern phone notification.
      tone(880, now, 0.19, 0.2);
      tone(1174.66, now + 0.095, 0.28, 0.18);
    }

    const finishAfter = type === 'alarm' ? 1.25 : type === 'wipe' ? 0.75 : type === 'timer' ? 0.7 : 0.5;
    const closeContext = () => { void audio.close().catch(() => undefined); };
    if (audio.state === 'suspended') {
      void audio.resume().then(() => window.setTimeout(closeContext, finishAfter * 1000 + 150)).catch(() => undefined);
    } else {
      window.setTimeout(closeContext, finishAfter * 1000 + 150);
    }
  } catch (err) {
    if (ctx && ctx.state !== 'closed') void ctx.close().catch(() => undefined);
    console.warn('Audio notification playback error:', err);
  }
}

export function sendWebNotification(
  title: string,
  options?: NotificationOptions & { soundType?: 'chime' | 'alarm' | 'wipe' | 'timer' }
): boolean {
  const settings = getNotificationSettings();

  // Play audio alert if enabled
  if (settings.soundAlerts) {
    playNotificationSound(options?.soundType || 'chime', settings.soundVolume);
  }

  if (!isPushNotificationSupported() || Notification.permission !== 'granted') {
    return false;
  }

  try {
    const notification = new Notification(title, {
      icon: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=200&auto=format&fit=crop',
      badge: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=96&auto=format&fit=crop',
      tag: options?.tag || 'rust-notification',
      ...options,
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
    };

    return true;
  } catch (err) {
    console.warn('Failed to dispatch native notification:', err);
    return false;
  }
}
