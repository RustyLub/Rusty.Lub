import { initializeApp, cert, getApps, applicationDefault } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import fs from 'fs';
import path from 'path';

let firebaseConfig: any = null;
const configPath = path.join(process.cwd(), 'firebase-applet-config.json');
const logPath = path.join(process.cwd(), 'firebase-init-log.txt');

function log(msg: string) {
  const line = `[${new Date().toISOString()}] ${msg}\n`;
  console.log(msg);
  try {
    fs.appendFileSync(logPath, line);
  } catch (e) {}
}

log('Firebase Admin: Starting initialization');
log(`Firebase Admin: CWD: ${process.cwd()}`);
log(`Firebase Admin: Config Path: ${configPath}`);

if (fs.existsSync(configPath)) {
  try {
    firebaseConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    log(`Firebase Admin: Config loaded for project: ${firebaseConfig?.projectId}`);
    log(`Firebase Admin: Database ID: ${firebaseConfig?.firestoreDatabaseId}`);
  } catch (err: any) {
    log(`Error reading firebase-applet-config.json: ${err.message}`);
  }
} else {
  log('Firebase Admin: firebase-applet-config.json not found');
}

  if (!getApps().length) {
    try {
      log('Firebase Admin: Initializing with Application Default Credentials');
      const app = initializeApp({
        credential: applicationDefault(),
        projectId: firebaseConfig?.projectId
      });
      log(`Firebase Admin: initializeApp called successfully. Project ID: ${app.options.projectId}`);
    } catch (error: any) {
      log(`Firebase Admin init error: ${error.message}`);
    }
  }

  let db: any;
  let auth: any;

  try {
    const app = getApps()[0];
    const rawDbId = firebaseConfig?.firestoreDatabaseId;
    const dbId = rawDbId === "(default)" ? undefined : rawDbId;
    log(`Firebase Admin: Getting Firestore instance for database: ${dbId || '(default)'}`);
    db = getFirestore(app, dbId);
    log('Firebase Admin: Firestore instance obtained');
  } catch (e: any) {
    log(`Firebase Admin: Error getting Firestore: ${e.message}`);
  }

try {
  log('Firebase Admin: Getting Auth instance');
  auth = getAuth();
  log('Firebase Admin: Auth instance obtained');
} catch (e: any) {
  log(`Firebase Admin: Error getting Auth: ${e.message}`);
}

export const adminDb = db;
export const adminAuth = auth;
