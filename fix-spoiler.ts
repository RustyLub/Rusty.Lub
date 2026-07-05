import { db } from './src/lib/firebase-client-on-server';
import { doc, setDoc } from 'firebase/firestore';

async function fixSpoiler() {
    await setDoc(doc(db, 'site_settings', 'jungle_fever_spoiler'), { jungleFeverSpoiler: true }, { merge: true });
    console.log('Spoiler enabled');
    process.exit(0);
}
fixSpoiler();
