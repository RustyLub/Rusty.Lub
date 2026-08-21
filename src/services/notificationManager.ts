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

// Sound Synthesis using Web Audio API for custom tones
export function playNotificationSound(type: 'chime' | 'alarm' | 'wipe' | 'timer' = 'chime', volume = 0.8) {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    if (type === 'alarm') {
      // 🚨 Rust+ Raid Alarm Siren (dual tone frequency sweep)
      const now = ctx.currentTime;
      for (let i = 0; i < 3; i++) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(440, now + i * 0.4);
        osc.frequency.exponentialRampToValueAtTime(880, now + i * 0.4 + 0.2);
        osc.frequency.exponentialRampToValueAtTime(440, now + i * 0.4 + 0.38);

        gain.gain.setValueAtTime(0.3 * volume, now + i * 0.4);
        gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.4 + 0.39);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.4);
        osc.stop(now + i * 0.4 + 0.4);
      }
    } else if (type === 'wipe') {
      // 🚀 Epic Wipe Horn Chime
      const now = ctx.currentTime;
      const notes = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);
        gain.gain.setValueAtTime(0.25 * volume, now + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.6);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + 0.65);
      });
    } else if (type === 'timer') {
      // ⏰ Locked Crate / Event Timer completion beep
      const now = ctx.currentTime;
      [880, 880, 1174.66].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.15);
        gain.gain.setValueAtTime(0.25 * volume, now + idx * 0.15);
        gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.15 + 0.12);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.15);
        osc.stop(now + idx * 0.15 + 0.13);
      });
    } else {
      // Standard pleasant notification chime
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.setValueAtTime(880, now + 0.08); // A5
      gain.gain.setValueAtTime(0.2 * volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.36);
    }
  } catch (err) {
    console.warn('AudioContext playback error:', err);
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
