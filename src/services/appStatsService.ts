import { db } from '../firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  onSnapshot, 
  query, 
  limit,
  serverTimestamp,
  increment,
  getDoc
} from 'firebase/firestore';

export interface GlobalAppStats {
  totalUsers: number;
  totalInstalls: number;
  onlineNow: number;
  activeToday: number;
}

// Generate or retrieve persistent unique Installation UUID for desktop Tauri application
function getOrCreateInstallationId(): string {
  try {
    let installId = localStorage.getItem('rustylub_desktop_install_id');
    if (!installId) {
      installId = 'inst_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now();
      localStorage.setItem('rustylub_desktop_install_id', installId);
    }
    return installId;
  } catch {
    return 'inst_guest_' + Date.now();
  }
}

/**
 * Non-blocking background tracking for desktop installation / app launch in Firestore
 */
export async function trackDesktopInstallation(): Promise<void> {
  // Execute asynchronously in background without blocking initial render
  setTimeout(async () => {
    try {
      const installId = getOrCreateInstallationId();
      const isTauri = typeof window !== 'undefined' && ('__TAURI_INTERNALS__' in window || '__TAURI__' in window);
      const installRef = doc(db, 'desktop_installs', installId);
      
      const docSnap = await getDoc(installRef);
      if (!docSnap.exists()) {
        await setDoc(installRef, {
          installId,
          installedAt: serverTimestamp(),
          lastLaunchAt: serverTimestamp(),
          isTauri,
          platform: isTauri ? 'Windows Desktop (Tauri 2)' : 'Web Client',
          version: '2.6.0',
          userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'Unknown'
        });

        // Increment global counter in site_settings
        const statsRef = doc(db, 'site_settings', 'global_stats');
        await setDoc(statsRef, {
          totalInstalls: increment(1)
        }, { merge: true });
      } else {
        await setDoc(installRef, {
          lastLaunchAt: serverTimestamp(),
          isTauri
        }, { merge: true });
      }
    } catch (err) {
      console.warn('Track installation background note:', err);
    }
  }, 100);
}

/**
 * Real-time subscription to global app stats:
 * Non-blocking, instant fallback callback so UI renders in <10ms
 */
export function subscribeToGlobalAppStats(onUpdate: (stats: GlobalAppStats) => void) {
  let totalUsers = 1280;
  let totalInstalls = 3850;
  let onlineNow = 1;
  let activeToday = 48;

  // Immediately fire default stats so component renders in 0ms
  onUpdate({ totalUsers, totalInstalls, onlineNow, activeToday });

  // 1. Subscribe to registered users count (limited for ultra-fast response)
  const qUsers = query(collection(db, 'chat_users'), limit(50));
  const unsubUsers = onSnapshot(qUsers, (snapshot) => {
    const registeredCount = snapshot.size;
    totalUsers = Math.max(0, registeredCount);
    onUpdate({ totalUsers, totalInstalls, onlineNow, activeToday });
  }, (err) => {
    console.warn('Users stat subscription warning:', err);
  });

  // 2. Subscribe to global_stats doc (installs)
  const unsubStats = onSnapshot(doc(db, 'site_settings', 'global_stats'), (docSnap) => {
    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data.totalInstalls) {
        totalInstalls = Number(data.totalInstalls);
      }
    }
    onUpdate({ totalUsers, totalInstalls, onlineNow, activeToday });
  }, (err) => {
    console.warn('Global stats doc subscription warning:', err);
  });

  // 3. Subscribe to active presence (limited query)
  const qPresence = query(collection(db, 'presence'), limit(50));
  const unsubPresence = onSnapshot(qPresence, (snapshot) => {
    const now = Date.now();
    let activeCount = 0;
    let todayCount = 0;

    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      if (data.lastActive) {
        const lastMs = data.lastActive.toDate ? data.lastActive.toDate().getTime() : new Date(data.lastActive).getTime();
        if (now - lastMs < 120000) {
          activeCount++;
        }
        if (now - lastMs < 86400000) {
          todayCount++;
        }
      }
    });

    onlineNow = activeCount;
    activeToday = todayCount;
    onUpdate({ totalUsers, totalInstalls, onlineNow, activeToday });
  }, (err) => {
    console.warn('Presence stat subscription warning:', err);
  });

  // Trigger non-blocking install tracking
  trackDesktopInstallation();

  return () => {
    unsubUsers();
    unsubStats();
    unsubPresence();
  };
}
