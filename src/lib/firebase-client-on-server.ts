import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  getDocs, 
  getDoc,
  setDoc,
  query, 
  where, 
  doc, 
  updateDoc, 
  addDoc, 
  deleteDoc,
  serverTimestamp, 
  increment,
  orderBy,
  limit
} from 'firebase/firestore';
import fs from 'fs';
import path from 'path';

let firebaseConfig: any = null;
const configPath = path.join(process.cwd(), 'firebase-applet-config.json');

if (fs.existsSync(configPath)) {
  try {
    firebaseConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  } catch (err) {
    console.error('Error reading firebase-applet-config.json:', err);
  }
}

const app = initializeApp(firebaseConfig);
const rawDbId = firebaseConfig?.firestoreDatabaseId;
const dbId = rawDbId === "(default)" ? undefined : rawDbId;
export const db = getFirestore(app, dbId);

export { 
  collection, 
  getDocs, 
  getDoc,
  setDoc,
  query, 
  where, 
  doc, 
  updateDoc, 
  addDoc, 
  deleteDoc,
  serverTimestamp, 
  increment,
  orderBy,
  limit
};
