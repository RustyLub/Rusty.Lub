import { db, doc, setDoc } from './src/lib/firebase-client-on-server';
async function test() {
  try {
    await setDoc(doc(db, 'users', 'test-uid'), { test: true });
    console.log('Success write');
  } catch(e: any) {
    console.error('FAILED write:', e.message);
  }
  process.exit(0);
}
test();
