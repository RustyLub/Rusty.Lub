import { db, collection, getDocs } from './src/lib/firebase-client-on-server';
async function test() {
  const snap = await getDocs(collection(db, 'news'));
  console.log('News found:', snap.size);
  snap.forEach(doc => {
    console.log(doc.id, doc.data().title);
  });
  process.exit(0);
}
test();
