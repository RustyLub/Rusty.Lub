import express from 'express';
import { onRequest } from 'firebase-functions/v2/https';
import { registerRustyLubEmailAuthRoutes } from '../src/server/rustylubEmailAuth';

const app = express();

app.disable('x-powered-by');
app.use(express.json({ limit: '32kb' }));

app.get('/api/health', (_req, res) => {
  res.set('Cache-Control', 'no-store');
  res.status(200).json({ service: 'rustylub-api', status: 'ok' });
});

registerRustyLubEmailAuthRoutes(app);

// The old profile is stored in a separate Firebase project. The runtime service
// account must be granted access to that project's Firestore database.
export const apiServer = onRequest(
  {
    region: 'us-central1',
    cors: [
      'https://rusty-lub.ru',
      'https://www.rusty-lub.ru',
      'https://rusty-lub.online',
      'https://www.rusty-lub.online'
    ],
    timeoutSeconds: 60,
    memory: '256MiB'
  },
  app
);
