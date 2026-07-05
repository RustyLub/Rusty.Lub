import fs from 'fs';
let rules = fs.readFileSync('firestore.rules', 'utf8');
rules = rules.replace(
  /match \/presence\/\{userId\} \{[\s\n]*allow read: if isSignedIn\(\);/g,
  `match /presence/{userId} {
      allow read: if true;`
);
fs.writeFileSync('firestore.rules', rules);
