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

// Playback uses bundled original WAV assets with short, polished mobile-style alert tones.
export function playNotificationSound(type: 'chime' | 'alarm' | 'wipe' | 'timer' = 'chime', volume = 0.8) {
  if (typeof window === 'undefined') return;
  const files: Record<typeof type, string> = {
    chime: '/sounds/notification.wav',
    alarm: '/sounds/raid.wav',
    wipe: '/sounds/wipe.wav',
    timer: '/sounds/timer.wav',
  };
  try {
    const audio = new Audio(files[type]);
    audio.volume = Math.max(0, Math.min(1, volume));
    audio.preload = 'auto';
    void audio.play().catch((err: unknown) => {
      console.warn('Notification sound playback blocked by browser:', err);
    });
  } catch (err) {
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
