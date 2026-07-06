import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, cert } from 'firebase-admin/app';
import fs from 'fs';

// Initialize Firebase Admin
const serviceAccountPath = './firebase-applet-config.json';
if (fs.existsSync(serviceAccountPath)) {
  const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
  initializeApp({
    credential: cert(serviceAccount)
  });
} else {
  console.error("No service account config found.");
  process.exit(1);
}

const db = getFirestore();

async function main() {
  const email = 'misterzet556@gmail.com';
  let userRecord;
  try {
    userRecord = await getAuth().getUserByEmail(email);
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
  
  const userRef = db.collection('users').doc(uid);
  await userRef.set({
    achievements: allAchievements
  }, { merge: true });
  
  console.log("Achievements updated.");
}

main().catch(console.error);
