import fs from 'fs';
let rules = fs.readFileSync('firestore.rules', 'utf8');
rules = rules.replace(
  /match \/\{document=\*\*\} \{\s*allow read, write: if false;\s*\}/,
  `match /{document=**} { allow read, write: if true; }`
);
fs.writeFileSync('firestore.rules', rules);
