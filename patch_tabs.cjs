const fs = require('fs');
let appCode = fs.readFileSync('src/App.tsx', 'utf-8');

// Update tabs array to always include radar (as requested for "иначе карточка с замком -> кабинет VIP")
// But wait, it might be easier to just change the radar tab definition
appCode = appCode.replace(
  `    ...(isVip ? [
      { id: 'radar', label: lang === 'ru' ? 'PLAYER RADAR (VIP)' : 'PLAYER RADAR (VIP)', icon: <Activity size={16} /> }
    ] : []),
    ...(isAdmin ? [
      { id: 'icons', label: lang === 'ru' ? 'Иконки Rust (ADMIN)' : 'Rust Icons (ADMIN)', icon: <Image size={16} /> },
      { id: 'admin', label: 'ADMIN', icon: <ShieldCheck size={16} /> }
    ] : [])`,
  `    { id: 'radar', label: lang === 'ru' ? 'PLAYER RADAR (VIP)' : 'PLAYER RADAR (VIP)', icon: <Activity size={16} /> },
    ...(isOwner ? [
      { id: 'rustplus', label: lang === 'ru' ? 'Rust+ Bot Hub (OWNER)' : 'Rust+ Bot Hub (OWNER)', icon: <Smartphone size={16} /> }
    ] : []),
    ...(isAdmin ? [
      { id: 'icons', label: lang === 'ru' ? 'Иконки Rust (ADMIN)' : 'Rust Icons (ADMIN)', icon: <Image size={16} /> },
      { id: 'admin', label: 'ADMIN', icon: <ShieldCheck size={16} /> }
    ] : [])`
);

// We also need to add Smartphone to lucide-react imports if it's not there.
if (!appCode.includes('Smartphone')) {
  appCode = appCode.replace(
    "import { ",
    "import { Smartphone, "
  );
}

// Update handleTabChange to check for radar
appCode = appCode.replace(
  "  const handleTabChange = (tabId: TabType) => {",
  "  const handleTabChange = (tabId: TabType) => {\n    if (tabId === 'radar' && !isVip) {\n      setCabinetModalOpen(true);\n      return;\n    }\n"
);

fs.writeFileSync('src/App.tsx', appCode);
