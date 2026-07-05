import { adminDb } from './src/lib/firebase-admin';
async function test() {
  try {
    const snap = await adminDb.collection('chat_users').get();
    console.log('Success admin chat, docs:', snap.docs.length);
  } catch(e: any) {
    console.error('FAILED admin chat:', e.message);
  }
  process.exit(0);
}
test();
