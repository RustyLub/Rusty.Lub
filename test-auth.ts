import { adminAuth } from './src/lib/firebase-admin';
async function test() {
  try {
    const token = await adminAuth.createCustomToken('test-uid');
    console.log('Success:', token.substring(0, 20) + '...');
  } catch (e) {
    console.error('Error:', e);
  }
}
test();
