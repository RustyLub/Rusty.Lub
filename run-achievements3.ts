import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import fs from 'fs';

const firebaseConfig = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function main() {
  const usersRef = collection(db, 'users');
  const snapshot = await getDocs(usersRef);
  
  if (snapshot.empty) {
    console.log("No users found.");
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
    console.log("Found user:", userDoc.id, "email:", data.email);
    await updateDoc(doc(db, 'users', userDoc.id), {
      achievements: allAchievements
    });
    console.log("Achievements updated for", userDoc.id);
  }
  
  console.log("All done.");
  process.exit(0);
}

main().catch(console.error);
