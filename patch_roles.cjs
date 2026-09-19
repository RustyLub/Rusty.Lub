const fs = require('fs');
let appCode = fs.readFileSync('src/App.tsx', 'utf-8');

appCode = appCode.replace(
  "const isAdmin = (currentUser?.uid === 'serustqs' || currentUser?.email === 'misterzet556@gmail.com' || currentUser?.role === 'admin');",
  "const isAdmin = (currentUser?.uid === 'serustqs' || currentUser?.email === 'misterzet556@gmail.com' || currentUser?.role === 'admin');\n  const isOwner = (currentUser?.uid === 'serustqs' || currentUser?.email === 'misterzet556@gmail.com' || currentUser?.role === 'owner');"
);

appCode = appCode.replace(
  "<ToolsHubTab lang={lang} onNavigate={(tab) => handleTabChange(tab)} />",
  "<ToolsHubTab lang={lang} onNavigate={(tab) => handleTabChange(tab)} isVip={isVip} isAdmin={isAdmin} isOwner={isOwner} onOpenVip={() => setCabinetModalOpen(true)} />"
);

fs.writeFileSync('src/App.tsx', appCode);
