import { db, auth } from '../firebase';
import { collection, addDoc, serverTimestamp, query, orderBy, limit, onSnapshot, getDocs, writeBatch, deleteDoc } from 'firebase/firestore';
import { CustomUser } from '../types';

export interface UserActivityLog {
  id?: string;
  uid: string;
  displayName: string;
  email?: string;
  photoURL?: string;
  role?: string;
  action: string;
  tab?: string;
  details?: string;
  timestamp?: any;
  device?: string;
  userAgent?: string;
}

// Global throttle cache to avoid log spamming for continuous events
const lastLoggedMap = new Map<string, number>();

export async function logUserActivity(params: {
  action: string;
  tab?: string;
  details?: string;
  currentUser?: CustomUser | null;
  throttleSeconds?: number;
}) {
  try {
    const { action, tab, details, currentUser, throttleSeconds = 3 } = params;
    
    // Throttle check
    const throttleKey = `${action}_${tab || ''}_${details || ''}`;
    const now = Date.now();
    const lastTime = lastLoggedMap.get(throttleKey) || 0;
    if (now - lastTime < throttleSeconds * 1000) {
      return;
    }
    lastLoggedMap.set(throttleKey, now);

    const user = currentUser || (auth.currentUser ? {
      uid: auth.currentUser.uid,
      displayName: auth.currentUser.displayName || 'Survivor',
      email: auth.currentUser.email || undefined,
      photoURL: auth.currentUser.photoURL || undefined,
      role: 'user'
    } : null);

    const logEntry: Omit<UserActivityLog, 'id'> = {
      uid: user?.uid || 'anonymous',
      displayName: user?.displayName || (auth.currentUser?.isAnonymous ? 'Guest Survivor' : 'Anonymous User'),
      email: user?.email || auth.currentUser?.email || undefined,
      photoURL: user?.photoURL || auth.currentUser?.photoURL || undefined,
      role: user?.role || 'user',
      action,
      tab: tab || 'general',
      details: details || '',
      timestamp: serverTimestamp(),
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'Unknown'
    };

    await addDoc(collection(db, 'activity_logs'), logEntry);
  } catch (err) {
    // Fail silently so UI execution is never interrupted
    console.warn('Activity logging warning:', err);
  }
}

export function subscribeToActivityLogs(
  onUpdate: (logs: UserActivityLog[]) => void,
  maxCount: number = 200
) {
  const q = query(
    collection(db, 'activity_logs'),
    orderBy('timestamp', 'desc'),
    limit(maxCount)
  );

  return onSnapshot(q, (snapshot) => {
    const logs: UserActivityLog[] = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    })) as UserActivityLog[];
    onUpdate(logs);
  }, (err) => {
    console.error('Error fetching activity logs:', err);
  });
}

export async function clearAllActivityLogs(): Promise<number> {
  const q = query(collection(db, 'activity_logs'), limit(500));
  const snapshot = await getDocs(q);
  const batch = writeBatch(db);
  
  snapshot.docs.forEach((docSnap) => {
    batch.delete(docSnap.ref);
  });

  await batch.commit();
  return snapshot.size;
}
