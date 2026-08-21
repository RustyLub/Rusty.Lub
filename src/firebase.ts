import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GithubAuthProvider, 
  signInWithPopup, 
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInAnonymously,
  User
} from 'firebase/auth';
import { 
  initializeFirestore,
  getFirestore, 
  setLogLevel,
  collection, 
  addDoc, 
  query, 
  where,
  orderBy, 
  limit, 
  onSnapshot, 
  serverTimestamp,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  writeBatch,
  Timestamp,
  updateDoc,
  increment,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';

const firebaseConfig: any = {
  "projectId": "psychic-origin-5kpr3",
  "appId": "1:739344973051:web:329ad00b8b4f1e1385c45e",
  "apiKey": "AIzaSyCKBAhIPVmCFhg8hom5G91VEbY3kaxNhGQ",
  "authDomain": "psychic-origin-5kpr3.firebaseapp.com",
  "firestoreDatabaseId": "ai-studio-rustylub-2e66bd8d-85dd-4eba-bb83-f354ddc97d59",
  "storageBucket": "psychic-origin-5kpr3.firebasestorage.app",
  "messagingSenderId": "739344973051",
  "measurementId": ""
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Use custom database ID with auto long-polling to prevent connection drops in sandboxed iframe environments
const firestoreDbId = firebaseConfig.firestoreDatabaseId === "(default)" ? undefined : firebaseConfig.firestoreDatabaseId;

let dbInstance;
try {
  dbInstance = initializeFirestore(app, {
    experimentalAutoDetectLongPolling: true,
  }, firestoreDbId);
} catch {
  dbInstance = getFirestore(app, firestoreDbId);
}
const db = dbInstance;

// Set Firestore log level to error to avoid noisy connection retry warnings when offline
try {
  setLogLevel('error');
} catch {
  // ignore
}

const githubProvider = new GithubAuthProvider();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errMsg = error instanceof Error ? error.message : String(error);
  const isOfflineOrUnavailable = errMsg.toLowerCase().includes('offline') || 
                                 errMsg.toLowerCase().includes('unavailable') ||
                                 errMsg.toLowerCase().includes('network');

  const errInfo: FirestoreErrorInfo = {
    error: errMsg,
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };

  if (isOfflineOrUnavailable) {
    console.warn('Firestore connectivity notification (offline/reconnecting):', JSON.stringify(errInfo));
    return;
  }

  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export { 
  auth, 
  db, 
  githubProvider, 
  signInWithPopup, 
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInAnonymously,
  collection,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  writeBatch,
  Timestamp,
  updateDoc,
  increment,
  arrayUnion,
  arrayRemove,
  type User
};
