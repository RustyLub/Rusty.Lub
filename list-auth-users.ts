import { adminAuth } from './src/lib/firebase-admin';

async function main() {
  const listUsers = await adminAuth.listUsers();
  for (const user of listUsers.users) {
    console.log("Auth User: uid:", user.uid, "email:", user.email, "displayName:", user.displayName);
  }
}

main().catch(console.error);
