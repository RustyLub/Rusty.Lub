import fs from 'fs';
let rules = fs.readFileSync('firestore.rules', 'utf8');
rules = rules.replace(
  /match \/tracked_players\/\{playerId\} \{[\s\S]*?\}/,
  `match /tracked_players/{playerId} { allow read, write: if true; }`
);
fs.writeFileSync('firestore.rules', rules);
