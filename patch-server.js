import fs from 'fs';
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(/await adminDb\.collection\('chat_users'\)\.doc\((.*?)\)\.get\(\)/g, "await clientGetDoc(clientDoc(clientDb, 'chat_users', $1))");
code = code.replace(/await adminDb\.collection\('users'\)\.doc\((.*?)\)\.get\(\)/g, "await clientGetDoc(clientDoc(clientDb, 'users', $1))");
code = code.replace(/await adminDb\.collection\('users'\)\.doc\((.*?)\)\.set\((.*?)\)/g, "await clientSetDoc(clientDoc(clientDb, 'users', $1), $2)");
code = code.replace(/FieldValue\.serverTimestamp\(\)/g, "clientServerTimestamp()");
code = code.replace(/snap\.exists/g, "snap.exists()");

fs.writeFileSync('server.ts', code);
