const PROJECT_ID = 'rustylub';
const DATABASE_ID = 'ai-studio-rustylub-2e66bd8d-85dd-4eba-bb83-f354ddc97d59';
const WEB_API_KEY = 'AIzaSyAdWMYqPO1mgx2h2DO3Iw8XZxEyZJQitO0';
const ALLOWED_ORIGINS = new Set([
  'https://rusty-lub.ru',
  'https://www.rusty-lub.ru',
  'https://rustylub.github.io'
]);

function b64url(input) {
  const bytes = typeof input === 'string' ? new TextEncoder().encode(input) : input;
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function pemToBytes(pem) {
  const body = pem.replace(/-----BEGIN PRIVATE KEY-----|-----END PRIVATE KEY-----|\s/g, '');
  const binary = atob(body);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

async function importSigningKey(pem) {
  return crypto.subtle.importKey(
    'pkcs8',
    pemToBytes(pem),
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign']
  );
}

async function signJwt(claims, key) {
  const header = b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const payload = b64url(JSON.stringify(claims));
  const unsigned = header + '.' + payload;
  const signature = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', key, new TextEncoder().encode(unsigned));
  return unsigned + '.' + b64url(new Uint8Array(signature));
}

async function googleAccessToken(account, key) {
  const now = Math.floor(Date.now() / 1000);
  const assertion = await signJwt({
    iss: account.client_email,
    sub: account.client_email,
    aud: account.token_uri || 'https://oauth2.googleapis.com/token',
    scope: 'https://www.googleapis.com/auth/cloud-platform',
    iat: now,
    exp: now + 3600
  }, key);

  const response = await fetch(account.token_uri || 'https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion
    })
  });
  if (!response.ok) throw new Error('Google service authorization failed');
  const data = await response.json();
  if (typeof data.access_token !== 'string') throw new Error('Google access token missing');
  return data.access_token;
}

async function lookupAuthEmail(accessToken, uid) {
  const response = await fetch(`https://identitytoolkit.googleapis.com/v1/projects/${PROJECT_ID}/accounts:lookup`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ localIds: [uid] })
  });
  if (!response.ok) throw new Error('Firebase Auth account lookup failed');
  const data = await response.json();
  const user = Array.isArray(data.users) ? data.users[0] : null;
  return user && typeof user.email === 'string' ? user.email : '';
}

async function firestoreDocument(accessToken, collection, documentId) {
  const path = documentId.split('/').map(encodeURIComponent).join('/');
  const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/${DATABASE_ID}/documents/${collection}/${path}`;
  const response = await fetch(url, { headers: { Authorization: `Bearer ${accessToken}` } });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error('Firestore read failed');
  const doc = await response.json();
  const result = {};
  for (const [key, value] of Object.entries(doc.fields || {})) {
    if (value && typeof value === 'object') {
      if ('stringValue' in value) result[key] = value.stringValue;
      else if ('booleanValue' in value) result[key] = value.booleanValue;
      else if ('integerValue' in value) result[key] = Number(value.integerValue);
    }
  }
  return result;
}

function json(data, status, origin) {
  const headers = {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store, max-age=0',
    'Pragma': 'no-cache',
    'Vary': 'Origin'
  };
  if (origin && ALLOWED_ORIGINS.has(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
    headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS';
    headers['Access-Control-Allow-Headers'] = 'Content-Type';
    headers['Access-Control-Max-Age'] = '86400';
  }
  return new Response(JSON.stringify(data), { status, headers });
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    if (request.method === 'OPTIONS') {
      if (!ALLOWED_ORIGINS.has(origin)) return new Response(null, { status: 403 });
      return new Response(null, { status: 204, headers: {
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '86400',
        'Vary': 'Origin'
      }});
    }
    if (request.method !== 'POST' || new URL(request.url).pathname !== '/api/auth/login') {
      return json({ message: 'Not found' }, 404, origin);
    }
    if (origin && !ALLOWED_ORIGINS.has(origin)) return json({ message: 'Origin not allowed' }, 403, origin);
    if (Number(request.headers.get('Content-Length') || 0) > 8192) {
      return json({ message: 'Request too large' }, 413, origin);
    }

    try {
      const body = await request.json();
      const login = String(body?.login || '').trim().toLowerCase();
      const password = typeof body?.password === 'string' ? body.password : '';
      if (!/^[a-z0-9._-]{3,32}$/.test(login) || password.length < 1 || password.length > 128) {
        return json({ message: 'Введите логин и пароль.' }, 400, origin);
      }
      if (!env.FIREBASE_SERVICE_ACCOUNT_JSON) throw new Error('Missing service account secret');
      const account = JSON.parse(env.FIREBASE_SERVICE_ACCOUNT_JSON);
      if (account.project_id !== PROJECT_ID || !account.client_email || !account.private_key) {
        throw new Error('Invalid service account configuration');
      }

      const signingKey = await importSigningKey(account.private_key);
      const accessToken = await googleAccessToken(account, signingKey);
      const usernameDoc = await firestoreDocument(accessToken, 'usernames', login);
      if (!usernameDoc?.uid) return json({ message: 'Неверный логин или пароль.' }, 401, origin);

      const uid = String(usernameDoc.uid);
      const profile = await firestoreDocument(accessToken, 'Users', uid);
      if (!profile || profile.uid !== uid ||
          String(profile.normalizedLogin || '').toLowerCase() !== login ||
          profile.status !== 'active') {
        return json({ message: 'Неверный логин или пароль.' }, 401, origin);
      }

      const email = await lookupAuthEmail(accessToken, uid);\n      if (!email) return json({ message: 'Неверный логин или пароль.' }, 401, origin);\n\n      const verify = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${encodeURIComponent(WEB_API_KEY)}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, returnSecureToken: true })
        }
      );
      if (!verify.ok) return json({ message: 'Неверный логин или пароль.' }, 401, origin);
      const verified = await verify.json();
      if (verified.localId !== uid) return json({ message: 'Неверный логин или пароль.' }, 401, origin);

      const now = Math.floor(Date.now() / 1000);
      const customToken = await signJwt({
        iss: account.client_email,
        sub: account.client_email,
        aud: 'https://identitytoolkit.googleapis.com/google.identity.identitytoolkit.v1.IdentityToolkit',
        iat: now,
        exp: now + 3600,
        uid
      }, signingKey);

      return json({
        customToken,
        profile: {
          uid,
          login: String(profile.login || login),
          nickname: String(profile.nickname || profile.login || login),
          role: String(profile.role || 'user'),
          status: String(profile.status || 'active')
        }
      }, 200, origin);
    } catch (error) {
      console.error('Rusty.Lub auth error:', error instanceof Error ? error.message : 'unknown');
      return json({ message: 'Авторизация временно недоступна. Попробуйте позже.' }, 503, origin);
    }
  }
};
