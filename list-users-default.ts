import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import fs from 'fs';

const config = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
// Override to default
const app = initializeApp(config);
const db = getFirestore(app); // Defaults to (default)

async function test() {
  try {
    const snap = await getDocs(collection(db, 'chat_users'));
    console.log('Users found in (default):', snap.size);
    snap.forEach(doc => {
      console.log(doc.id, doc.data().displayName);
    });
  } catch(e: any) {
    console.error('FAILED:', e.message);
  }
  process.exit(0);
}
test();
