import { db, collection, getDocs } from './src/lib/firebase-client-on-server';
async function test() {
  const snap = await getDocs(collection(db, 'chat_users'));
  console.log('Users found:', snap.size);
  snap.forEach(doc => {
    console.log(doc.id, doc.data().displayName);
  });
  process.exit(0);
}
test();
