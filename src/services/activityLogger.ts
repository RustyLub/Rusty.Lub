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
  module?: string;
  requiredRole?: string;
  isSecurityAlert?: boolean;
  details?: string;
  timestamp?: any;
  device?: string;
  userAgent?: string;
}

// Global throttle cache to avoid log spamming for continuous events
const lastLoggedMap = new Map<string, number>();

export async function logSecurityAccessAttempt(params: {
  module: string;
  requiredRole: 'vip' | 'owner' | 'admin';
  currentUser?: CustomUser | null;
  moduleIcon?: string;
  throttleSeconds?: number;
}) {
  try {
    const { module, requiredRole, currentUser, throttleSeconds = 8 } = params;

    const userUid = currentUser?.uid || auth.currentUser?.uid || 'guest';
    const throttleKey = `sec_attempt_${userUid}_${module}`;
    const now = Date.now();
    const lastTime = lastLoggedMap.get(throttleKey) || 0;
    if (now - lastTime < throttleSeconds * 1000) {
      return;
    }
    lastLoggedMap.set(throttleKey, now);

    const displayName = currentUser?.displayName || auth.currentUser?.displayName || (currentUser ? 'User' : 'Unauthenticated Guest');
    const email = currentUser?.email || auth.currentUser?.email || '';
    const photoURL = currentUser?.photoURL || auth.currentUser?.photoURL || '';
    const userRole = currentUser?.role || 'guest';
    const isVip = Boolean(currentUser?.isVip);
    const userAgent = typeof window !== 'undefined' ? window.navigator.userAgent : 'Unknown';

    const securityEntry: Record<string, any> = {
      uid: userUid,
      displayName,
      email,
      photoURL,
      role: userRole,
      isVip,
      module,
      requiredRole,
      action: 'unauthorized_access_attempt',
      isSecurityAlert: true,
      tab: module,
      details: `Попытка несанкционированного доступа к модулю "${module}". Требуемая роль: ${requiredRole.toUpperCase()}. Текущий статус: ${userRole}${isVip ? ' [VIP]' : ''}`,
      timestamp: serverTimestamp(),
      userAgent
    };

    // Write to both activity_logs (for unified audit trail) and security_logs (for dedicated security records)
    const writePromises = [
      addDoc(collection(db, 'activity_logs'), securityEntry),
      addDoc(collection(db, 'security_logs'), securityEntry)
    ];

    await Promise.allSettled(writePromises);
  } catch (err) {
    console.warn('Security logging warning:', err);
  }
}

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
      email: auth.currentUser.email || '',
      photoURL: auth.currentUser.photoURL || '',
      role: 'user'
    } : null);

    const logEntry: Record<string, any> = {
      uid: user?.uid || 'anonymous',
      displayName: user?.displayName || (auth.currentUser?.isAnonymous ? 'Guest Survivor' : 'Anonymous User'),
      role: user?.role || 'user',
      action,
      tab: tab || 'general',
      details: details || '',
      timestamp: serverTimestamp(),
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'Unknown'
    };

    const userEmail = user?.email || auth.currentUser?.email;
    if (userEmail) logEntry.email = userEmail;

    const userPhoto = user?.photoURL || auth.currentUser?.photoURL;
    if (userPhoto) logEntry.photoURL = userPhoto;

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

export function subscribeToSecurityLogs(
  onUpdate: (logs: UserActivityLog[]) => void,
  maxCount: number = 200
) {
  const q = query(
    collection(db, 'security_logs'),
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
    console.error('Error fetching security logs:', err);
  });
}

export async function clearAllSecurityLogs(): Promise<number> {
  const q = query(collection(db, 'security_logs'), limit(500));
  const snapshot = await getDocs(q);
  const batch = writeBatch(db);
  
  snapshot.docs.forEach((docSnap) => {
    batch.delete(docSnap.ref);
  });

  await batch.commit();
  return snapshot.size;
}

