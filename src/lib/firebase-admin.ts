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

const appName = 'rustylub-legacy-admin';
const existingApp = getApps().find((item) => item.name === appName);

function initializeAdminApp() {
  if (existingApp) return existingApp;

  const rawServiceAccount = process.env.RUSTYLUB_FIREBASE_SERVICE_ACCOUNT;
  if (rawServiceAccount) {
    let serviceAccount: Record<string, unknown>;
    try {
      serviceAccount = JSON.parse(rawServiceAccount);
    } catch {
      throw new Error('RUSTYLUB_FIREBASE_SERVICE_ACCOUNT must contain valid JSON.');
    }

    return initializeApp({
      credential: cert(serviceAccount as any),
      projectId
    }, appName);
  }

  return initializeApp({
    credential: applicationDefault(),
    projectId
  }, appName);
}

const adminApp = initializeAdminApp();

// Bind Auth and Firestore to the same explicitly named project app. Do not
// silently use whichever Firebase Admin app happened to initialize first.
export const adminDb = getFirestore(adminApp, databaseId);
export const adminAuth = getAuth(adminApp);
