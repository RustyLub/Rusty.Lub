import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

async function test() {
  const app = initializeApp({ credential: applicationDefault() });
  
  // Try custom db
  try {
    const db = getFirestore(app, 'ai-studio-rustylub-2e66bd8d-85dd-4eba-bb83-f354ddc97d59');
    await db.listCollections();
    console.log('Successfully accessed custom DB');
  } catch (e: any) {
    console.log('Failed to access custom DB:', e.message);
  }

  // Try default db
  try {
    const db = getFirestore(app);
    await db.listCollections();
    console.log('Successfully accessed default DB');
  } catch (e: any) {
    console.log('Failed to access default DB:', e.message);
  }

  process.exit(0);
}
test();
