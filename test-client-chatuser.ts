import { db, doc, getDoc } from './src/lib/firebase-client-on-server';
async function test() {
  try {
    const snap = await getDoc(doc(db, 'chat_users', 'serustqs'));
    console.log('Success get chat_users', snap.exists() ? 'exists' : 'not found');
  } catch(e: any) {
    console.error('FAILED chat_users:', e.message);
  }
  process.exit(0);
}
test();
