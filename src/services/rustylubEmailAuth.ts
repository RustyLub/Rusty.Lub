import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  reload,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithCustomToken,
  signOut,
  type User
} from 'firebase/auth';
import {
  doc,
  getDoc,
  type Firestore
} from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import { rustylubAuth } from '../lib/rustylub-auth/firebase';

const DATABASE_ID = 'ai-studio-rustylub-2e66bd8d-85dd-4eba-bb83-f354ddc97d59';
const rustylubDb: Firestore = getFirestore(rustylubAuth.app, DATABASE_ID);

export interface RustyLubEmailProfile {
  uid: string;
  username: string;
  displayName: string;
  email: string;
  role: 'user' | 'admin';
  isBlocked: boolean;
  photoURL?: string;
  avatarClass?: string;
  isVip?: boolean;
  isChatVip?: boolean;
  vipUntil?: string;
  gender?: 'male' | 'female';
  bio?: string;
  clanTag?: string;
  hoursPlayed?: number;
  playstyle?: string;
  favoriteWeapon?: string;
  steamId?: string;
  steamName?: string;
  steamAvatar?: string;
  customTheme?: string;
  legacyProfileMigrated?: boolean;
}

async function requireSignedInUser(user: User) {
  await user.getIdToken(true);
}

function profileRef(uid: string) {
  return doc(rustylubDb, 'auth_users', uid);
}

export async function completeRegistration(
  user: User,
  username: string,
  displayName: string,
  termsLanguage: 'ru' | 'en'
) {
  await reload(user);
  if (!user.emailVerified) {
    throw new Error('Подтвердите email по ссылке из письма, затем нажмите кнопку завершения регистрации.');
  }
  const token = await user.getIdToken(true);
  const apiBase = String(import.meta.env.VITE_RUSTYLUB_AUTH_API_BASE || 'https://us-central1-rustylub.cloudfunctions.net/apiServer').replace(/\/+$/, '');
  const response = await fetch(`${apiBase}/api/rustylub-auth/profile`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    cache: 'no-store',
    body: JSON.stringify({
      username: username.trim().toLowerCase(),
      displayName: displayName.trim(),
      termsAccepted: true,
      termsVersion: '2.7',
      termsLanguage
    })
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || !payload.profile) {
    throw new Error(typeof payload.message === 'string' ? payload.message : 'Не удалось завершить регистрацию.');
  }
  return payload as { success: boolean; profile: RustyLubEmailProfile };
}

export async function registerWithEmail(email: string, password: string) {
  let user: User;
  try {
    const credential = await createUserWithEmailAndPassword(rustylubAuth, email.trim().toLowerCase(), password);
    user = credential.user;
  } catch (error: any) {
    if (error?.code !== 'auth/email-already-in-use') throw error;
    const credential = await signInWithEmailAndPassword(rustylubAuth, email.trim().toLowerCase(), password);
    user = credential.user;
  }
  await reload(user);
  if (!user.emailVerified) {
    await sendEmailVerification(user);
  }
  return user;
}

export async function getEmailAuthProfile(user: User) {
  await reload(user);
  if (!user.emailVerified) return null;
  await requireSignedInUser(user);
  const snapshot = await getDoc(profileRef(user.uid));
  if (!snapshot.exists()) return null;

  const profile = snapshot.data() as RustyLubEmailProfile;
  if (profile.isBlocked === true) {
    await signOut(rustylubAuth);
    return null;
  }
  return profile;
}

export async function loginWithEmail(email: string, password: string) {
  const credential = await signInWithEmailAndPassword(rustylubAuth, email.trim().toLowerCase(), password);
  await reload(credential.user);
  if (!credential.user.emailVerified) {
    await signOut(rustylubAuth);
    throw new Error('Подтвердите email по ссылке из письма, прежде чем входить в аккаунт.');
  }
  await requireSignedInUser(credential.user);
  const snapshot = await getDoc(profileRef(credential.user.uid));
  if (!snapshot.exists()) {
    await signOut(rustylubAuth);
    throw new Error('Профиль не найден. Если вы только зарегистрировались, завершите регистрацию.');
  }
  const profile = snapshot.data() as RustyLubEmailProfile;
  if (profile.isBlocked === true) {
    await signOut(rustylubAuth);
    throw new Error('Аккаунт заблокирован.');
  }
  return { firebaseUser: credential.user, profile };
}

export async function requestPasswordReset(email: string) {
  await sendPasswordResetEmail(rustylubAuth, email.trim().toLowerCase());
}

export async function logoutFromRustyLub() {
  await signOut(rustylubAuth);
}

export { rustylubAuth };


export async function loginWithUsername(login: string, password: string) {
  const authApiBase = (import.meta.env.VITE_AUTH_API_URL || 'https://rustylub-auth.unityzeusn1.workers.dev').replace(/\/$/, '');
  const response = await fetch(`${authApiBase}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
    body: JSON.stringify({ login: login.trim(), password })
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok || typeof payload.customToken !== 'string') {
    throw new Error(typeof payload.message === 'string' ? payload.message : 'Не удалось выполнить вход.');
  }

  const credential = await signInWithCustomToken(rustylubAuth, payload.customToken);
  return {
    firebaseUser: credential.user,
    profile: payload.profile as {
      uid: string;
      login: string;
      nickname: string;
      role: string;
      status: string;
    }
  };
}


export async function registerWithUsername(login: string, password: string, nickname: string) {
  const authApiBase = (import.meta.env.VITE_AUTH_API_URL || 'https://rustylub-auth.unityzeusn1.workers.dev').replace(/\/$/, '');
  const response = await fetch(`${authApiBase}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
    body: JSON.stringify({ login: login.trim(), password, nickname: nickname.trim() })
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || typeof payload.customToken !== 'string') {
    throw new Error(typeof payload.message === 'string' ? payload.message : 'Не удалось создать аккаунт.');
  }
  const credential = await signInWithCustomToken(rustylubAuth, payload.customToken);
  return { firebaseUser: credential.user, profile: payload.profile as { uid: string; login: string; nickname: string; role: string; status: string } };
}
