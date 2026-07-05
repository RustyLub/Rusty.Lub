import fs from 'fs';
let code = fs.readFileSync('src/firebase.ts', 'utf8');
const config = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf8'));

code = code.replace(/const firebaseConfig: any = \{[\s\S]*?\};/, `const firebaseConfig: any = ${JSON.stringify(config, null, 2)};`);
fs.writeFileSync('src/firebase.ts', code);
