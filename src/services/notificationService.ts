/**
 * Notification and Alert Service for Rusty.Lub
 * Supports:
 * - Desktop Windows notifications via Tauri IPC / plugin
 * - Web Browser Notification API (Notification.requestPermission / new Notification)
 * - Tactical Rust Web Audio API synthesized alarm chimes
 * - Browser title flash alerts
 */

export interface NotificationPayload {
  title: string;
  body: string;
  icon?: string;
  sound?: boolean;
}

// Detect if running inside Tauri (Windows / Desktop app wrapper)
export function isTauriApp(): boolean {
  if (typeof window === 'undefined') return false;
  const w = window as any;
  return Boolean(w.__TAURI__ || w.__TAURI_INTERNALS__);
}

/**
 * Request notification permission across Browser and Tauri environments
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (typeof window === 'undefined') return false;

  // 1. Check Tauri notification permissions if running in Tauri
  const w = window as any;
  if (w.__TAURI__?.notification) {
    try {
      if (typeof w.__TAURI__.notification.isPermissionGranted === 'function') {
        const isGranted = await w.__TAURI__.notification.isPermissionGranted();
        if (isGranted) return true;
      }
      if (typeof w.__TAURI__.notification.requestPermission === 'function') {
        const res = await w.__TAURI__.notification.requestPermission();
        return res === 'granted' || res === true;
      }
    } catch (e) {
      console.warn('Tauri permission check error:', e);
    }
  }

  // 2. Standard Web Notification API
  if ('Notification' in window) {
    if (Notification.permission === 'granted') {
      return true;
    }
    if (Notification.permission !== 'denied') {
      try {
        const permission = await Notification.requestPermission();
        return permission === 'granted';
      } catch (err) {
        console.warn('Notification.requestPermission error:', err);
      }
    }
  }

  return false;
}

/**
 * Play a tactical Rust smart-alarm electronic chime via Web Audio API
 * Works reliably without external audio files or network requests
 */
export function playRustAlarmSound(): void {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;

    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    // Sequence of 4 urgent electronic warning beeps
    const tones = [
      { freq: 784, time: 0.0, dur: 0.12 },  // G5
      { freq: 1046, time: 0.15, dur: 0.15 }, // C6
      { freq: 880, time: 0.35, dur: 0.12 },  // A5
      { freq: 1318, time: 0.50, dur: 0.25 }, // E6
      { freq: 1046, time: 0.85, dur: 0.12 }, // C6
      { freq: 1318, time: 1.00, dur: 0.35 }  // E6 sustain
    ];

    tones.forEach((tone) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(tone.freq, now + tone.time);

      gain.gain.setValueAtTime(0.001, now + tone.time);
      gain.gain.linearRampToValueAtTime(0.25, now + tone.time + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + tone.time + tone.dur);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + tone.time);
      osc.stop(now + tone.time + tone.dur);
    });

    // Close context after playback completes
    setTimeout(() => {
      ctx.close().catch(() => {});
    }, 2000);
  } catch (e) {
    console.warn('Web Audio alarm playback warning:', e);
  }
}

let titleFlashInterval: any = null;
let originalTitle = '';

/**
 * Flashes page title tab in the browser for high visibility
 */
export function flashPageTitle(alertText: string, durationMs = 12000): void {
  if (typeof document === 'undefined') return;

  if (titleFlashInterval) {
    clearInterval(titleFlashInterval);
  } else {
    originalTitle = document.title;
  }

  let toggle = false;
  titleFlashInterval = setInterval(() => {
    document.title = toggle ? `⚠️ ${alertText}` : originalTitle;
    toggle = !toggle;
  }, 800);

  setTimeout(() => {
    if (titleFlashInterval) {
      clearInterval(titleFlashInterval);
      titleFlashInterval = null;
      document.title = originalTitle;
    }
  }, durationMs);
}

/**
 * Main dispatcher to send Decay Timer Notifications
 * Tries Tauri native Windows desktop notification, fallback to Web Notification,
 * and plays audible alarm sound.
 */
export async function sendDecayNotification(payload: NotificationPayload): Promise<{
  tauriSent: boolean;
  browserSent: boolean;
  soundPlayed: boolean;
}> {
  const result = {
    tauriSent: false,
    browserSent: false,
    soundPlayed: false
  };

  const { title, body, icon = '/rust_lfg_bot.png', sound = true } = payload;
  const w = window as any;

  // 1. Play synthesized tactical alarm
  if (sound) {
    playRustAlarmSound();
    result.soundPlayed = true;
  }

  // 2. Flash page title
  flashPageTitle(title);

  // 3. Attempt Windows / Tauri Desktop Notification
  if (isTauriApp()) {
    try {
      // Direct Tauri plugin notification API
      if (w.__TAURI__?.notification?.sendNotification) {
        w.__TAURI__.notification.sendNotification({
          title,
          body,
          icon
        });
        result.tauriSent = true;
      } 
      // Tauri invoke fallback
      else if (w.__TAURI_INTERNALS__?.invoke) {
        await w.__TAURI_INTERNALS__.invoke('plugin:notification|notify', {
          options: {
            title,
            body,
            icon
          }
        });
        result.tauriSent = true;
      }
    } catch (tauriErr) {
      console.warn('Tauri notification dispatch failed, falling back:', tauriErr);
    }
  }

  // 4. Web Notification API (Supported in both Chrome/Firefox/Edge and Tauri's WebView2)
  if ('Notification' in window) {
    try {
      if (Notification.permission === 'granted') {
        const notif = new Notification(title, {
          body,
          icon,
          badge: icon,
          requireInteraction: true,
          silent: false,
          tag: 'rusty-decay-alert'
        });
        notif.onclick = () => {
          window.focus();
          notif.close();
        };
        result.browserSent = true;
      } else if (Notification.permission !== 'denied') {
        const perm = await Notification.requestPermission();
        if (perm === 'granted') {
          new Notification(title, {
            body,
            icon,
            badge: icon,
            requireInteraction: true,
            tag: 'rusty-decay-alert'
          });
          result.browserSent = true;
        }
      }
    } catch (webNotifErr) {
      console.warn('Web Notification error:', webNotifErr);
    }
  }

  // 5. Fallback dialog inside Tauri if system toast was not delivered
  if (isTauriApp() && !result.tauriSent && !result.browserSent) {
    try {
      if (w.__TAURI__?.dialog?.message) {
        w.__TAURI__.dialog.message(body, { title, kind: 'warning' });
      } else if (w.__TAURI_INTERNALS__?.invoke) {
        w.__TAURI_INTERNALS__.invoke('plugin:dialog|message', {
          title,
          message: body
        });
      }
    } catch (diagErr) {
      console.warn('Tauri dialog fallback error:', diagErr);
    }
  }

  return result;
}
