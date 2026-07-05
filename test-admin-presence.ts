import { adminDb } from './src/lib/firebase-admin';
async function test() {
  try {
    await adminDb.collection('presence').doc('test').set({ active: true });
    console.log('Success admin presence');
    const snap = await adminDb.collection('presence').get();
    console.log('Docs:', snap.docs.length);
  } catch(e: any) {
    console.error('FAILED admin presence:', e.message);
  }
  process.exit(0);
}
test();
