import fs from 'fs';
let code = fs.readFileSync('src/firebase.ts', 'utf8');
code = code.replace(/firestoreDatabaseId: ".*?"/, `firestoreDatabaseId: "(default)"`);
fs.writeFileSync('src/firebase.ts', code);
