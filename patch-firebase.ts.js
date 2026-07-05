import fs from 'fs';
let code = fs.readFileSync('src/firebase.ts', 'utf8');
code = code.replace(/const firestoreDbId = firebaseConfig.firestoreDatabaseId === "\(\default\)" \? undefined : firebaseConfig.firestoreDatabaseId;/, `const firestoreDbId = "ai-studio-rustylub-2e66bd8d-85dd-4eba-bb83-f354ddc97d59";`);
fs.writeFileSync('src/firebase.ts', code);
