const fs = require('fs');
const content = fs.readFileSync('src/components/RecyclerTab.tsx', 'utf-8');
const match = content.match(/export const RECYCLER_ITEMS_LIST: RecyclerItem\[\] = \[(.*?)\];/s);
if (match) {
  const ids = [...match[1].matchAll(/id:\s*'([^']+)'/g)].map(m => m[1]);
  const counts = {};
  ids.forEach(id => counts[id] = (counts[id] || 0) + 1);
  for (const [id, count] of Object.entries(counts)) {
    if (count > 1) console.log('Duplicate:', id);
  }
}
