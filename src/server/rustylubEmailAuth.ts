import type { Express } from 'express';
import { initializeApp, cert, applicationDefault, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

const PROJECT_ID = 'rustylub';
const DATABASE_ID = 'ai-studio-rustylub-2e66bd8d-85dd-4eba-bb83-f354ddc97d59';

function getRustyLubAdmin() {
  const existing = getApps().find((app) => app.name === 'rustylub-auth-admin');
  if (existing) return existing;

  const rawCredentials = process.env.RUSTYLUB_FIREBASE_SERVICE_ACCOUNT;
  const app = rawCredentials
    ? initializeApp({
        credential: cert(JSON.parse(rawCredentials)),
        projectId: PROJECT_ID
      }, 'rustylub-auth-admin')
    : initializeApp({
        credential: applicationDefault(),
        projectId: PROJECT_ID
      }, 'rustylub-auth-admin');

  return app;
}

function getServices() {
  const app = getRustyLubAdmin();
  return {
    auth: getAuth(app),
    db: getFirestore(app, DATABASE_ID)
  };
}

export function registerRustyLubEmailAuthRoutes(app: Express) {
  app.get('/api/rustylub-auth/health', (_req, res) => {
    const configured = Boolean(process.env.RUSTYLUB_FIREBASE_SERVICE_ACCOUNT || process.env.GOOGLE_APPLICATION_CREDENTIALS);
    res.json({ service: 'rustylub-email-auth', configured });
  });

  app.get('/api/rustylub-auth/profile', async (req: any, res: any) => {
    try {
      const header = String(req.headers.authorization || '');
      if (!header.startsWith('Bearer ')) return res.status(401).json({ message: 'Требуется авторизация Firebase.' });
      const { auth, db } = getServices();
      const identity = await auth.verifyIdToken(header.slice(7), true);
      if (!identity.email || identity.email_verified !== true) return res.status(403).json({ message: 'Сначала подтвердите email.' });
      const snap = await db.collection('auth_users').doc(identity.uid).get();
      if (!snap.exists) return res.status(404).json({ message: 'Профиль ещё не создан. Завершите регистрацию.' });
      const profile = snap.data() || {};
      if (profile.isBlocked === true) return res.status(403).json({ message: 'Аккаунт заблокирован.' });
      return res.json({ profile: { uid: identity.uid, ...profile } });
    } catch (error) {
      console.error('[RustyLub auth] Profile read failed:', error instanceof Error ? error.message : 'unknown');
      return res.status(401).json({ message: 'Не удалось подтвердить сессию. Войдите снова.' });
    }
  });

  app.post('/api/rustylub-auth/profile', async (req: any, res: any) => {
    try {
      const header = String(req.headers.authorization || '');
      if (!header.startsWith('Bearer ')) return res.status(401).json({ message: 'Требуется авторизация Firebase.' });
      const { auth, db } = getServices();
      const identity = await auth.verifyIdToken(header.slice(7), true);
      if (!identity.email || identity.email_verified !== true) return res.status(403).json({ message: 'Сначала подтвердите email.' });

      const username = String(req.body?.username || '').trim().toLowerCase();
      const displayName = String(req.body?.displayName || '').trim();
      if (!/^[a-z0-9_-]{3,20}$/.test(username) || username === 'serustqs') {
        return res.status(400).json({ message: 'Логин должен содержать 3–20 символов. Этот логин зарезервирован.' });
      }
      if (displayName.length < 2 || displayName.length > 40 || /[<>]/.test(displayName)) {
        return res.status(400).json({ message: 'Никнейм должен содержать 2–40 допустимых символов.' });
      }

      const profileRef = db.collection('auth_users').doc(identity.uid);
      const usernameRef = db.collection('auth_usernames').doc(username);
      let conflict = false;
      await db.runTransaction(async (transaction) => {
        const [profileSnap, usernameSnap] = await Promise.all([
          transaction.get(profileRef),
          transaction.get(usernameRef)
        ]);
        if (profileSnap.exists) return;
        if (usernameSnap.exists) {
          conflict = true;
          return;
        }
        transaction.create(usernameRef, { uid: identity.uid, createdAt: FieldValue.serverTimestamp() });
        transaction.create(profileRef, {
          uid: identity.uid,
          username,
          displayName,
          email: identity.email!.toLowerCase(),
          role: 'user',
          isBlocked: false,
          createdAt: FieldValue.serverTimestamp(),
          updatedAt: FieldValue.serverTimestamp()
        });
      });
      if (conflict) return res.status(409).json({ message: 'Этот логин уже занят.' });
      const saved = await profileRef.get();
      return res.status(201).json({ success: true, profile: { uid: identity.uid, ...(saved.data() || {}) } });
    } catch (error) {
      console.error('[RustyLub auth] Profile creation failed:', error instanceof Error ? error.message : 'unknown');
      return res.status(500).json({ message: 'Не удалось создать профиль. Проверьте настройки серверного Firebase.' });
    }
  });
}
