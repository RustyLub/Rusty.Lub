import { db, doc, getDoc, collection, getDocs } from './src/lib/firebase-client-on-server';
async function test() {
  try {
    await getDoc(doc(db, 'chat_users', 'serustqs'));
    console.log('Success chat_users');
    await getDocs(collection(db, 'presence'));
    console.log('Success presence');
  } catch(e: any) {
    console.error('FAILED:', e.message);
  }
  process.exit(0);
}
test();
