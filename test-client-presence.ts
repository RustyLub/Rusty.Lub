import { db, collection, getDocs } from './src/lib/firebase-client-on-server';
async function test() {
  try {
    const snap = await getDocs(collection(db, 'presence'));
    console.log('Success presence, docs:', snap.docs.length);
  } catch(e: any) {
    console.error('FAILED presence:', e.message);
  }
  process.exit(0);
}
test();
