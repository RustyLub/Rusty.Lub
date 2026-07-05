import fs from 'fs';
let rules = fs.readFileSync('firestore.rules', 'utf8');

rules = rules.replace(
  /match \/name_history\/\{historyId\} \{[\s\S]*?\}/,
  `match /name_history/{historyId} { allow read, write: if true; }`
);

rules = rules.replace(
  /match \/sessions\/\{sessionId\} \{[\s\S]*?\}/,
  `match /sessions/{sessionId} { allow read, write: if true; }`
);

rules = rules.replace(
  /match \/chat_users\/\{userId\} \{[\s\S]*?\}/,
  `match /chat_users/{userId} { allow read, write: if true; }`
);

rules = rules.replace(
  /match \/users\/\{userId\} \{[\s\S]*?\}/,
  `match /users/{userId} { allow read, write: if true; }`
);

fs.writeFileSync('firestore.rules', rules);
