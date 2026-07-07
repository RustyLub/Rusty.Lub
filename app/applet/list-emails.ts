import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import fs from 'fs';

const firebaseConfig = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function main() {
  const usersRef = collection(db, 'chat_users');
  const snapshot = await getDocs(usersRef);
  
  for (const userDoc of snapshot.docs) {
    const data = userDoc.data();
    console.log(`ID: "${userDoc.id}", Email: "${data.email}", DisplayName: "${data.displayName}"`);
  }
  process.exit(0);
}

main().catch(console.error);
