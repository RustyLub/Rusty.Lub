import { UserActivityItem } from '../types';
import { db, collection, addDoc, serverTimestamp, getDocs, query, where, orderBy, limit, deleteDoc, doc } from '../firebase';

const LOCAL_STORAGE_KEY = 'rust_user_activity_history';

/**
 * Log a user action (e.g. decay timer set, raid calculation, bind saved)
 * Writes to local storage and attempts to sync with Firestore if online.
 */
export async function logUserActivity(
  action: Omit<UserActivityItem, 'id' | 'timestamp'> & { id?: string; timestamp?: number; userId?: string }
): Promise<UserActivityItem> {
  const item: UserActivityItem = {
    id: action.id || `act_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    timestamp: action.timestamp || Date.now(),
    type: action.type,
    title: action.title,
    description: action.description,
    category: action.category,
    userId: action.userId,
    details: action.details || {}
  };

  // 1. Save to LocalStorage
  try {
    const existingRaw = localStorage.getItem(LOCAL_STORAGE_KEY);
    const list: UserActivityItem[] = existingRaw ? JSON.parse(existingRaw) : [];
    
    // Add to top, keep max 120 items
    const updated = [item, ...list.filter(x => x.id !== item.id)].slice(0, 120);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));

    // Also dispatch custom event for instant reactivity in open tabs
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('rusty_activity_logged', { detail: item }));
    }
  } catch (e) {
    console.warn('Failed to save activity to localStorage:', e);
  }

  // 2. Sync to Firestore if userId is present
  if (action.userId && db) {
    try {
      await addDoc(collection(db, 'user_activities'), {
        ...item,
        createdAt: serverTimestamp()
      });
    } catch (err) {
      // Non-fatal, cached in localStorage
      console.warn('Firestore activity sync note (cached locally):', err);
    }
  }

  return item;
}

/**
 * Fetch activity history for a user
 * Merges local storage and Firestore documents, deduplicating by ID.
 */
export async function getUserActivities(userId?: string): Promise<UserActivityItem[]> {
  const itemsMap = new Map<string, UserActivityItem>();

  // 1. Load from LocalStorage
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const localList: UserActivityItem[] = JSON.parse(raw);
      localList.forEach((item) => {
        if (!userId || !item.userId || item.userId === userId) {
          itemsMap.set(item.id, item);
        }
      });
    }
  } catch (e) {
    console.warn('Error reading local activity history:', e);
  }

  // 2. Try Firestore if userId is provided
  if (userId && db) {
    try {
      const q = query(
        collection(db, 'user_activities'),
        where('userId', '==', userId),
        limit(80)
      );
      const snap = await getDocs(q);
      snap.forEach((docSnap) => {
        const data = docSnap.data();
        const item: UserActivityItem = {
          id: docSnap.id,
          userId: data.userId,
          type: data.type || 'decay_timer_start',
          title: data.title || 'Действие',
          description: data.description || '',
          category: data.category || 'decay',
          timestamp: data.timestamp || (data.createdAt?.toMillis ? data.createdAt.toMillis() : Date.now()),
          details: data.details || {}
        };
        itemsMap.set(item.id, item);
      });
    } catch (err) {
      console.warn('Firestore activity fetch warning (using local):', err);
    }
  }

  // Sort newest first
  return Array.from(itemsMap.values()).sort((a, b) => b.timestamp - a.timestamp);
}

/**
 * Clear user activities from local storage and optionally Firestore
 */
export async function clearUserActivities(userId?: string): Promise<void> {
  try {
    if (userId) {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (raw) {
        const list: UserActivityItem[] = JSON.parse(raw);
        const filtered = list.filter(item => item.userId && item.userId !== userId);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered));
      }
    } else {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('rusty_activity_cleared'));
    }
  } catch (e) {
    console.warn('Error clearing activity history:', e);
  }

  // Attempt to delete from Firestore if userId provided
  if (userId && db) {
    try {
      const q = query(
        collection(db, 'user_activities'),
        where('userId', '==', userId),
        limit(100)
      );
      const snap = await getDocs(q);
      const deletions = snap.docs.map(d => deleteDoc(doc(db, 'user_activities', d.id)));
      await Promise.allSettled(deletions);
    } catch (err) {
      console.warn('Firestore clear activities warning:', err);
    }
  }
}
