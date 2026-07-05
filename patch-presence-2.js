import fs from 'fs';
let rules = fs.readFileSync('firestore.rules', 'utf8');
rules = rules.replace(
  /match \/presence\/\{userId\} \{[\s\S]*?\}/,
  `match /presence/{userId} { allow read, write: if true; }`
);
fs.writeFileSync('firestore.rules', rules);
