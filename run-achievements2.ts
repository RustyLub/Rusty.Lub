import { adminDb } from './src/lib/firebase-admin';

async function main() {
  const usersSnapshot = await adminDb.collection('users').get();
  
  if (usersSnapshot.empty) {
    console.log("No users found.");
    return;
  }
  
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
  
  for (const doc of usersSnapshot.docs) {
    const data = doc.data();
    console.log("Found user:", doc.id, "email:", data.email);
    await doc.ref.set({
      achievements: allAchievements
    }, { merge: true });
    console.log("Achievements updated for", doc.id);
  }
  
}

main().catch(console.error);
