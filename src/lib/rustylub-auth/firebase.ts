import { initializeApp, getApps } from 'firebase/app';
import {
  initializeAuth,
  getAuth,
  indexedDBLocalPersistence,
  browserLocalPersistence
} from 'firebase/auth';

const config = {
  apiKey: 'AIzaSyAdWMYqPO1mgx2h2DO3Iw8XZxEyZJQitO0',
  authDomain: 'rustylub.firebaseapp.com',
  projectId: 'rustylub',
  storageBucket: 'rustylub.firebasestorage.app',
  messagingSenderId: '835038801032',
  appId: '1:835038801032:web:643113413df82f7af9033d',
  measurementId: 'G-X4W9S6S0LH'
};

const app = getApps().find((item) => item.name === 'rustylub-auth')
  || initializeApp(config, 'rustylub-auth');

/**
 * This application uses Firebase Email/Password authentication only.
 * Omitting popupRedirectResolver prevents Firebase from loading the
 * Google cross-origin iframe (gapi.iframes), which is unnecessary here
 * and can fail under strict tracking protection / third-party storage
 * restrictions, surfacing as auth/internal-error during startup.
 *
 * IndexedDB is preferred for durable sessions; browser local storage
 * is the fallback for browsers where IndexedDB persistence is unavailable.
 */
function createEmailAuth() {
  try {
    return initializeAuth(app, {
      persistence: [indexedDBLocalPersistence, browserLocalPersistence]
    });
  } catch (error) {
    // Reuse an Auth instance if this module is evaluated again by Vite HMR.
    const message = error instanceof Error ? error.message : String(error);
    if (message.toLowerCase().includes('already initialized')) {
      return getAuth(app);
    }
    throw error;
  }
}

export const rustylubAuth = createEmailAuth();
