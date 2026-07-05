import { adminAuth } from './src/lib/firebase-admin';
async function test() {
  try {
    const token = await adminAuth.createCustomToken('test-uid');
    console.log('Success token');
  } catch(e: any) {
    console.error('FAILED token:', e.message);
  }
  process.exit(0);
}
test();
