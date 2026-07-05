import { db } from './src/lib/firebase-client-on-server';
import { collection, getDocs } from 'firebase/firestore';

async function test() {
  const c = 'news';
  try {
    const snap = await getDocs(collection(db, c));
    console.log(`${c}: ${snap.size} docs`);
    snap.forEach(doc => {
      console.log(`${doc.id}:`, JSON.stringify(doc.data()));
    });
  } catch(e: any) {
    console.error(`${c}: FAILED - ${e.message}`);
  }
  process.exit(0);
}
test();
