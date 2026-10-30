import type { Express } from 'express';
import { initializeApp, cert, applicationDefault, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import crypto from 'node:crypto';
import { adminDb as legacyAdminDb } from '../lib/firebase-admin';

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
  // One-time legacy profile migration. The old password is verified on the server
  // against the legacy Firestore record; no password/hash is copied to the new project.
  app.post('/api/rustylub-auth/migrate-legacy-profile', async (req: any, res: any) => {
    try {
      const header = String(req.headers.authorization || '');
      if (!header.startsWith('Bearer ')) return res.status(401).json({ message: 'Требуется авторизация нового аккаунта.' });
      const { auth, db } = getServices();
      const identity = await auth.verifyIdToken(header.slice(7), true);
      const email = String(identity.email || '').trim().toLowerCase();
      if (identity.email_verified !== true || email !== 'cheater.cooperation@inbox.ru') {
        return res.status(403).json({ message: 'Перенос доступен только подтверждённому аккаунту владельца.' });
      }

      const legacyUsername = String(req.body?.legacyUsername || '').trim().toLowerCase();
      const legacyPassword = String(req.body?.legacyPassword || '');
      if (legacyUsername !== 'serustqs' || !legacyPassword || legacyPassword.length > 128) {
        return res.status(400).json({ message: 'Укажите действующие данные старого аккаунта.' });
      }

      const legacyRef = legacyAdminDb.collection('chat_users').doc('serustqs');
      const legacySnap = await legacyRef.get();
      if (!legacySnap.exists) return res.status(404).json({ message: 'Старый профиль не найден.' });
      const legacy = legacySnap.data() || {};
      let passwordValid = false;
      if (legacy.passwordAlgorithm === 'PBKDF2-SHA256' && legacy.passwordHash && legacy.passwordSalt) {
        const salt = Buffer.from(String(legacy.passwordSalt), 'hex');
        const actual = crypto.pbkdf2Sync(legacyPassword, salt, 210000, 32, 'sha256');
        const expected = Buffer.from(String(legacy.passwordHash), 'hex');
        passwordValid = actual.length === expected.length && crypto.timingSafeEqual(actual, expected);
      } else if (typeof legacy.passwordHash === 'string' && typeof legacy.passwordSalt === 'string') {
        // Legacy server accounts use scrypt; keep compatibility with the old auth route.
        const actual = crypto.scryptSync(legacyPassword, legacy.passwordSalt, 64);
        const expected = Buffer.from(legacy.passwordHash, 'hex');
        passwordValid = actual.length === expected.length && crypto.timingSafeEqual(actual, expected);
      } else if (typeof legacy.password === 'string') {
        passwordValid = legacy.password === legacyPassword;
      }
      if (!passwordValid || legacy.isBlocked === true) {
        return res.status(401).json({ message: 'Старый логин или пароль неверен, либо аккаунт заблокирован.' });
      }

      const profileRef = db.collection('auth_users').doc(identity.uid);
      const profileSnap = await profileRef.get();
      if (!profileSnap.exists) return res.status(409).json({ message: 'Сначала завершите регистрацию нового аккаунта и подтвердите email.' });
      const profile = profileSnap.data() || {};
      if (String(profile.email || '').toLowerCase() !== email || profile.username !== 'serustqs') {
        return res.status(409).json({ message: 'Новый профиль не соответствует целевой учётной записи.' });
      }

      // A completed migration is immutable from this endpoint: retries are safe and
      // cannot overwrite newer edits the owner made to the destination profile.
      if (profile.legacyProfileMigrated === true) {
        const existingProfile = Object.fromEntries([
          'photoURL', 'avatarClass', 'gender', 'bio', 'clanTag', 'hoursPlayed',
          'playstyle', 'favoriteWeapon', 'steamId', 'steamName', 'steamAvatar', 'customTheme'
        ].filter((key) => profile[key] !== undefined).map((key) => [key, profile[key]]));
        return res.json({ success: true, alreadyMigrated: true, profile: existingProfile });
      }

      const migrated = {
        photoURL: typeof legacy.photoURL === 'string' ? legacy.photoURL.slice(0, 2048) : '',
        avatarClass: typeof legacy.avatarClass === 'string' ? legacy.avatarClass.slice(0, 80) : 'whiteout',
        gender: legacy.gender === 'female' ? 'female' : 'male',
        bio: typeof legacy.bio === 'string' ? legacy.bio.slice(0, 500) : '',
        clanTag: typeof legacy.clanTag === 'string' ? legacy.clanTag.slice(0, 24) : '',
        hoursPlayed: Number.isFinite(Number(legacy.hoursPlayed)) ? Math.max(0, Math.min(100000, Number(legacy.hoursPlayed))) : 0,
        playstyle: typeof legacy.playstyle === 'string' ? legacy.playstyle.slice(0, 500) : '',
        favoriteWeapon: typeof legacy.favoriteWeapon === 'string' ? legacy.favoriteWeapon.slice(0, 80) : '',
        steamId: typeof legacy.steamId === 'string' ? legacy.steamId.slice(0, 32) : '',
        steamName: typeof legacy.steamName === 'string' ? legacy.steamName.slice(0, 80) : '',
        steamAvatar: typeof legacy.steamAvatar === 'string' ? legacy.steamAvatar.slice(0, 2048) : '',
        customTheme: typeof legacy.customTheme === 'string' ? legacy.customTheme.slice(0, 40) : 'default',
        legacyProfileMigrated: true,
        legacyProfileMigratedAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp()
      };
      // Privileged role, VIP flags, block/scam state and all credentials are intentionally excluded.
      await profileRef.update(migrated);
      const publicProfile = Object.fromEntries(
        Object.entries(migrated).filter(([key]) => !key.endsWith('At') && key !== 'updatedAt')
      );
      return res.json({
        success: true,
        alreadyMigrated: false,
        profile: publicProfile,
        migratedFields: Object.keys(publicProfile)
      });
    } catch (error) {
      console.error('[RustyLub auth] Legacy profile migration failed:', error instanceof Error ? error.message : 'unknown');
      return res.status(500).json({ message: 'Не удалось перенести профиль. Проверьте серверную конфигурацию Firebase.' });
    }
  });

}
