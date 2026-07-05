import { db, collection, getDocs, query, where } from './src/lib/firebase-client-on-server';
async function test() {
  try {
    const snap = await getDocs(collection(db, 'news'));
    console.log('Success news, docs:', snap.docs.length);
  } catch(e: any) {
    console.error('FAILED news:', e.message);
  }
  process.exit(0);
}
test();
