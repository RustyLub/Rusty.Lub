import { addDoc, collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

const VISITOR_KEY = 'rustylub_analytics_visitor';
const SESSION_KEY = 'rustylub_analytics_session';

function getId(key: string) {
  try {
    let value = localStorage.getItem(key);
    if (!value) {
      value = typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
      localStorage.setItem(key, value);
    }
    return value;
  } catch {
    return 'ephemeral-' + Math.random().toString(36).slice(2);
  }
}

export async function trackSiteEvent(
  event: 'page_view' | 'login' | 'registration',
  details: { page?: string; uid?: string; source?: string } = {}
) {
  try {
    const visitorId = getId(VISITOR_KEY);
    const sessionId = getId(SESSION_KEY);
    const now = Date.now();
    await addDoc(collection(db, 'site_analytics_events'), {
      event,
      page: details.page || '',
      uid: details.uid || '',
      visitorId,
      sessionId,
      source: details.source || (document.referrer ? new URL(document.referrer).hostname : 'direct'),
      createdAt: serverTimestamp(),
      createdAtMs: now,
      userAgent: navigator.userAgent.slice(0, 180)
    });
    await setDoc(doc(db, 'site_analytics_presence', visitorId), {
      visitorId,
      uid: details.uid || '',
      lastSeenAt: serverTimestamp(),
      lastSeenAtMs: now,
      page: details.page || ''
    }, { merge: true });
  } catch (error) {
    // Analytics must never interrupt normal site functionality.
    console.debug('Site analytics unavailable:', error);
  }
}
