import fs from 'fs';
let config = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf8'));
config.firestoreDatabaseId = '(default)';
fs.writeFileSync('firebase-applet-config.json', JSON.stringify(config, null, 2));

let code = fs.readFileSync('src/firebase.ts', 'utf8');
code = code.replace(/firestoreDatabaseId: ".*?"/, `firestoreDatabaseId: "(default)"`);
fs.writeFileSync('src/firebase.ts', code);
