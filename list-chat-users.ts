import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import fs from 'fs';

const firebaseConfig = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function main() {
  const usersRef = collection(db, 'chat_users');
  const snapshot = await getDocs(usersRef);
  
  if (snapshot.empty) {
    console.log("No users found in chat_users.");
    return;
  }
  
  const allAchievements = [
    'premium_host',
    'diamond_survivor',
    'legendary_raider',
    'first_beacon',
    'steam_linked',
    'veteran',
    'radio_operator',
    'sponsor'
  ];
  
  for (const userDoc of snapshot.docs) {
    const data = userDoc.data();
    console.log("User:", userDoc.id, data.displayName);
    await updateDoc(doc(db, 'chat_users', userDoc.id), {
      achievements: allAchievements
    });
  }
  console.log("Done updating chat_users");
  process.exit(0);
}

main().catch(console.error);
