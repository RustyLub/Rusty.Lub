import fs from 'fs';
let code = fs.readFileSync('src/lib/firebase-admin.ts', 'utf8');
code = code.replace(/const dbId = undefined; \/\/ Force default DB/, `const dbId = "ai-studio-rustylub-2e66bd8d-85dd-4eba-bb83-f354ddc97d59"; // Force specific DB`);
fs.writeFileSync('src/lib/firebase-admin.ts', code);
