import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  type User
} from 'firebase/auth';
import {
  doc,
  getDoc,
  runTransaction,
  serverTimestamp,
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
}

async function requireSignedInUser(user: User) {
  await user.getIdToken(true);
}

function profileRef(uid: string) {
  return doc(rustylubDb, 'auth_users', uid);
}

export async function registerWithEmail(email: string, password: string, _username: string, _displayName: string) {
  const credential = await createUserWithEmailAndPassword(rustylubAuth, email.trim().toLowerCase(), password);
  return credential.user;
}

export async function completeRegistration(user: User, username: string, displayName: string) {
  await requireSignedInUser(user);
  const cleanUsername = username.trim().toLowerCase();
  const cleanDisplayName = displayName.trim();
  if (!/^[a-z0-9_-]{3,20}$/.test(cleanUsername) || (cleanUsername === 'serustqs' && (user.email || '').trim().toLowerCase() !== 'cheater.cooperation@inbox.ru')) {
    throw new Error('Логин должен содержать 3–20 символов. Этот логин зарезервирован.');
  }
  if (cleanDisplayName.length < 2 || cleanDisplayName.length > 40 || /[<>]/.test(cleanDisplayName)) {
    throw new Error('Никнейм должен содержать 2–40 допустимых символов.');
  }

  const userRef = profileRef(user.uid);
  const usernameRef = doc(rustylubDb, 'auth_usernames', cleanUsername);
  await runTransaction(rustylubDb, async (transaction) => {
    const [profileSnap, usernameSnap] = await Promise.all([
      transaction.get(userRef),
      transaction.get(usernameRef)
    ]);
    if (profileSnap.exists()) return;
    if (usernameSnap.exists()) throw new Error('Этот логин уже занят.');
    transaction.set(usernameRef, {
      uid: user.uid,
      createdAt: serverTimestamp()
    });
    transaction.set(userRef, {
      uid: user.uid,
      username: cleanUsername,
      displayName: cleanDisplayName,
      email: (user.email || '').trim().toLowerCase(),
      role: 'user',
      isBlocked: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  });
  const saved = await getDoc(userRef);
  if (!saved.exists()) throw new Error('Не удалось сохранить профиль.');
  return { profile: saved.data() as RustyLubEmailProfile };
}

export async function getEmailAuthProfile(user: User) {
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
