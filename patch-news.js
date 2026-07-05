import fs from 'fs';
let rules = fs.readFileSync('firestore.rules', 'utf8');
rules = rules.replace(
  /match \/news\/\{newsId\} \{[\s\S]*?allow read: if true;/g,
  `match /news/{newsId} { allow read: if false;`
);
fs.writeFileSync('firestore.rules', rules);
