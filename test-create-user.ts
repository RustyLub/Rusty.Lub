import { adminAuth } from './src/lib/firebase-admin';
async function test() {
  try {
    const user = await adminAuth.createUser({
      email: 'server-worker@rust-radar.local',
      password: 'SecretServerPassword123!',
      displayName: 'Server Worker'
    });
    console.log('User created:', user.uid);
  } catch (e: any) {
    console.error('Error:', e.message);
    if (e.code === 'auth/email-already-exists') {
        const user = await adminAuth.getUserByEmail('server-worker@rust-radar.local');
        console.log('User already exists:', user.uid);
    }
  }
}
test();
