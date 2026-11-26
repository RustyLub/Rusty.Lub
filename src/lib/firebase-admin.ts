import { initializeApp, cert, getApps, applicationDefault } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import fs from 'node:fs';
import path from 'node:path';

type FirebaseRuntimeConfig = {
  projectId?: string;
  firestoreDatabaseId?: string;
};

const configPath = path.join(process.cwd(), 'firebase-applet-config.json');
let fileConfig: FirebaseRuntimeConfig = {};

if (fs.existsSync(configPath)) {
  try {
    fileConfig = JSON.parse(fs.readFileSync(configPath, 'utf8')) as FirebaseRuntimeConfig;
  } catch (error) {
    throw new Error(
      `Firebase Admin configuration file is invalid: ${error instanceof Error ? error.message : 'unknown error'}`
    );
  }
}

const projectId = process.env.FIREBASE_PROJECT_ID || fileConfig.projectId;
const rawDatabaseId = process.env.FIRESTORE_DATABASE_ID || fileConfig.firestoreDatabaseId;
const databaseId = rawDatabaseId && rawDatabaseId !== '(default)' ? rawDatabaseId : undefined;

if (!projectId) {
  throw new Error('Firebase Admin is not configured: set FIREBASE_PROJECT_ID or provide firebase-applet-config.json.');
}

function getCredential() {
  const rawServiceAccount = process.env.RUSTYLUB_FIREBASE_SERVICE_ACCOUNT;
  if (!rawServiceAccount) return applicationDefault();

  let serviceAccount: Record<string, unknown>;
  try {
    serviceAccount = JSON.parse(rawServiceAccount);
  } catch {
    throw new Error('RUSTYLUB_FIREBASE_SERVICE_ACCOUNT must contain valid JSON.');
  }
  return cert(serviceAccount as any);
}

function getOrInitializeApp(name: string, targetProjectId: string) {
  const existing = getApps().find((item) => item.name === name);
  if (existing) {
    if (existing.options.projectId && existing.options.projectId !== targetProjectId) {
      throw new Error(
        `Firebase Admin app "${name}" is already initialized for project "${existing.options.projectId}", expected "${targetProjectId}".`
      );
    }
    return existing;
  }

  return initializeApp({
    credential: getCredential(),
    projectId: targetProjectId
  }, name);
}

// Destination project: new Rusty.Lub authentication and profiles.
const adminApp = getOrInitializeApp('rustylub-destination-admin', projectId);
export const adminDb = getFirestore(adminApp, databaseId);
export const adminAuth = getAuth(adminApp);

// Legacy project: old chat_users records. It is deliberately a separate Admin
// app so a migration can never accidentally read the destination database.
// Grant the function runtime service account roles/datastore.user in this project.
const legacyProjectId = process.env.FIREBASE_LEGACY_PROJECT_ID || 'psychic-origin-5kpr3';
const legacyRawDatabaseId =
  process.env.FIREBASE_LEGACY_DATABASE_ID ||
  'ai-studio-rustylub-2e66bd8d-85dd-4eba-bb83-f354ddc97d59';
const legacyDatabaseId =
  legacyRawDatabaseId && legacyRawDatabaseId !== '(default)' ? legacyRawDatabaseId : undefined;

const legacyApp = getOrInitializeApp('rustylub-legacy-source-admin', legacyProjectId);
export const legacyAdminDb = getFirestore(legacyApp, legacyDatabaseId);
