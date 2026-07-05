import { db, collection, getDocs } from './src/lib/firebase-client-on-server';
async function test() {
  try {
    const snap = await getDocs(collection(db, 'chat_users'));
    console.log('Success chat_users, docs:', snap.docs.length);
  } catch(e: any) {
    console.error('FAILED chat_users:', e.message);
  }
  process.exit(0);
}
test();
