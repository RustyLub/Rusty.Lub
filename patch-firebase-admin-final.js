import fs from 'fs';
let code = fs.readFileSync('src/lib/firebase-admin.ts', 'utf8');
code = code.replace(/const dbId = rawDbId === "\(\default\)" \? undefined : rawDbId;/, `const dbId = undefined; // Force default DB`);
fs.writeFileSync('src/lib/firebase-admin.ts', code);
