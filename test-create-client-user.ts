import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import fs from 'fs';

const config = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(config);
const auth = getAuth(app);

async function test() {
  try {
    const cred = await createUserWithEmailAndPassword(auth, 'server-worker@rust-radar.local', 'SecretServerPassword123!');
    console.log('User created via client:', cred.user.uid);
  } catch (e: any) {
    if (e.code === 'auth/email-already-in-use') {
      const cred = await signInWithEmailAndPassword(auth, 'server-worker@rust-radar.local', 'SecretServerPassword123!');
      console.log('User signed in via client:', cred.user.uid);
    } else {
      console.error('Error:', e.message);
    }
  }
}
test();
