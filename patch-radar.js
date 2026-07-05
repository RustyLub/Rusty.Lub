import fs from 'fs';
let code = fs.readFileSync('src/services/radarService.ts', 'utf8');

code = code.replace(/adminDb\.collection\('tracked_players'\)[\s\n]*\.where\('isActive', '==', true\)[\s\n]*\.get\(\)/g, "clientGetDocs(clientQuery(clientCollection(clientDb, 'tracked_players'), clientWhere('isActive', '==', true)))");
code = code.replace(/adminDb\.collection\('tracked_players'\)\.doc\(playerId\)/g, "clientDoc(clientDb, 'tracked_players', playerId)");

code = code.replace(/await adminDb\.collection\('name_history'\)\.add\(\{/g, "await clientAddDoc(clientCollection(clientDb, 'name_history'), {");

code = code.replace(/FieldValue\.serverTimestamp\(\)/g, "clientServerTimestamp()");

code = code.replace(/await playerDocRef\.update\(\{/g, "await clientSetDoc(playerDocRef, {");
// clientSetDoc with merge: true is equivalent to update
code = code.replace(/await clientSetDoc\(playerDocRef, \{([\s\S]*?)\}\);/g, "await clientSetDoc(playerDocRef, {$1}, { merge: true });");

code = code.replace(/await adminDb\.collection\('sessions'\)\.add\(\{/g, "await clientAddDoc(clientCollection(clientDb, 'sessions'), {");

code = code.replace(/adminDb\.collection\('sessions'\)[\s\n]*\.where\('trackedPlayerId', '==', playerId\)[\s\n]*\.where\('isActive', '==', true\)[\s\n]*\.get\(\)/g, "clientGetDocs(clientQuery(clientCollection(clientDb, 'sessions'), clientWhere('trackedPlayerId', '==', playerId), clientWhere('isActive', '==', true)))");

code = code.replace(/await sessionDoc\.ref\.update\(\{([\s\S]*?)\}\);/g, "await clientSetDoc(sessionDoc.ref, {$1}, { merge: true });");

code = code.replace(/FieldValue\.increment\(/g, "clientIncrement(");

fs.writeFileSync('src/services/radarService.ts', code);
