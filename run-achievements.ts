import { adminAuth, adminDb } from './src/lib/firebase-admin';

async function main() {
  const email = 'misterzet556@gmail.com';
  let userRecord;
  try {
    userRecord = await adminAuth.getUserByEmail(email);
  } catch (e) {
    console.error("User not found:", e);
    process.exit(1);
  }
  
  const uid = userRecord.uid;
  console.log("Found user:", uid);
  
  // Get all achievements except scammer
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
  
  const userRef = adminDb.collection('users').doc(uid);
  await userRef.set({
    achievements: allAchievements
  }, { merge: true });
  
  console.log("Achievements updated.");
}

main().catch(console.error);
