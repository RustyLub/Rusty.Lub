import axios from 'axios';
import type { Express } from 'express';

const RUST_PRICE_LIST_URL = 'https://lis-skins.com/market_export_json/api_rust_full.json';
const CACHE_TTL_MS = 5 * 60 * 1000;

type LisRustSkin = {
  id: number;
  name: string;
  price: number | null;
  unlock_at?: string | null;
  item_class_id?: string;
  created_at?: string;
  delivery_type?: number;
};

type LisRustResponse = {
  status: string;
  last_update: number;
  items: LisRustSkin[];
};

let cached: LisRustResponse | null = null;
let cachedAt = 0;

async function getRustPriceList(): Promise<{ data: LisRustResponse; stale: boolean }> {
  if (cached && Date.now() - cachedAt < CACHE_TTL_MS) {
    return { data: cached, stale: false };
  }

  const response = await axios.get<LisRustResponse>(RUST_PRICE_LIST_URL, {
    timeout: 15000,
    headers: { Accept: 'application/json', 'User-Agent': 'Rusty.Lub/3.0' },
    responseType: 'json'
  });

  const payload = response.data;
  if (
    !payload ||
    payload.status !== 'success' ||
    !Array.isArray(payload.items) ||
    !Number.isFinite(Number(payload.last_update))
  ) {
    throw new Error('LIS-SKINS returned an unexpected Rust price-list response.');
  }

  const validItems = payload.items.filter((item) =>
    Number.isFinite(Number(item.id)) &&
    typeof item.name === 'string' &&
    (item.price === null || Number.isFinite(Number(item.price)))
  );

  cached = { ...payload, items: validItems };
  cachedAt = Date.now();
  return { data: cached, stale: false };
}

export function registerLisSkinsRoutes(app: Express) {
  app.get('/api/skins/rust', async (_req, res) => {
    try {
      const result = await getRustPriceList();
      res.setHeader('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
      return res.json({
        source: 'LIS-SKINS',
        sourceUrl: RUST_PRICE_LIST_URL,
        currency: null,
        currencyNote: 'The public Rust JSON price-list documentation does not specify a currency.',
        lastUpdate: result.data.last_update,
        fetchedAt: new Date(cachedAt).toISOString(),
        count: result.data.items.length,
        items: result.data.items
      });
    } catch (error) {
      console.error('LIS-SKINS Rust catalogue request failed:', error);
      return res.status(502).json({
        source: 'LIS-SKINS',
        message: 'Не удалось получить каталог Rust от LIS-SKINS. Попробуйте обновить позже.'
      });
    }
  });
}
