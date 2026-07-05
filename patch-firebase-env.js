import fs from 'fs';
let code = fs.readFileSync('src/firebase.ts', 'utf8');
code = code.replace(/firestoreDatabaseId: "\(\default\)"/, `firestoreDatabaseId: "ai-studio-rustylub-2e66bd8d-85dd-4eba-bb83-f354ddc97d59"`);
fs.writeFileSync('src/firebase.ts', code);
