import { db, collection, getDocs, query, where } from './src/lib/firebase-client-on-server';
async function test() {
  try {
    console.log('Testing clientDb...', db.type);
    const q = query(collection(db, 'tracked_players'), where('isActive', '==', true));
    const snap = await getDocs(q);
    console.log('Success, docs:', snap.docs.length);
  } catch(e: any) {
    console.error('FAILED:', e.message);
  }
  process.exit(0);
}
test();
