const fs = require('fs');
let code = fs.readFileSync('src/main.tsx', 'utf-8');
code = code.replace(
  "import App from './App.tsx';",
  `import App from './App.tsx';\nconst originalConsoleError = console.error;\nconsole.error = (...args) => {\n  if (args[0] && typeof args[0] === "string" && args[0].includes("same key")) {\n    originalConsoleError("DUPLICATE_KEY_FOUND_ARGS:", JSON.stringify(args));\n  }\n  originalConsoleError(...args);\n};`
);
fs.writeFileSync('src/main.tsx', code);
