import { db, collection, getDocs, query, where } from './src/lib/firebase-client-on-server';
async function test() {
  try {
    const snap = await getDocs(collection(db, 'tracked_players'));
    console.log('Success no where, docs:', snap.docs.length);
  } catch(e: any) {
    console.error('FAILED no where:', e.message);
  }
  process.exit(0);
}
test();
