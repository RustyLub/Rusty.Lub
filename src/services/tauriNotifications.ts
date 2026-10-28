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

  // 1. Play a distinct sound for every notification category.
  playNotificationAudio(type);

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
 * Play bundled WAV assets for distinct desktop notification categories.
 * Audio files are original tones created for Rusty.Lub, not copied iOS recordings.
 */
export function playNotificationAudio(type: 'raid' | 'radar' | 'system' | 'update' = 'system') {
  if (typeof window === 'undefined') return;

  const files: Record<typeof type, string> = {
    raid: '/sounds/raid.wav',
    radar: '/sounds/radar.wav',
    system: '/sounds/notification.wav',
    update: '/sounds/update.wav',
  };

  try {
    const audio = new Audio(files[type]);
    audio.volume = 0.75;
    audio.preload = 'auto';
    void audio.play().catch((err: unknown) => {
      console.warn('Desktop notification sound playback blocked:', err);
    });
  } catch (err) {
    console.warn('Desktop notification audio error:', err);
  }
}
