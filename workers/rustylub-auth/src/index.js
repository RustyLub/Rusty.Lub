const PROJECT_ID = 'rustylub';
const DATABASE_ID = 'ai-studio-rustylub-2e66bd8d-85dd-4eba-bb83-f354ddc97d59';
const WEB_API_KEY = 'AIzaSyAdWMYqPO1mgx2h2DO3Iw8XZxEyZJQitO0';
const ALLOWED_ORIGINS = new Set(['https://rusty-lub.ru','https://www.rusty-lub.ru','https://rustylub.github.io']);

function b64url(input) {
  const bytes = typeof input === 'string' ? new TextEncoder().encode(input) : input;
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}
function pemToBytes(pem) {
  const body = pem.replace(/-----BEGIN PRIVATE KEY-----|-----END PRIVATE KEY-----|\s/g, '');
  const binary = atob(body);
  return Uint8Array.from(binary, c => c.charCodeAt(0));
}
async function importSigningKey(pem) {
  return crypto.subtle.importKey('pkcs8', pemToBytes(pem), { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['sign']);
}
async function signJwt(claims, key) {
  const unsigned = b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' })) + '.' + b64url(JSON.stringify(claims));
  const signature = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', key, new TextEncoder().encode(unsigned));
  return unsigned + '.' + b64url(new Uint8Array(signature));
}
async function googleAccessToken(account, key) {
  const now = Math.floor(Date.now()/1000);
  const assertion = await signJwt({ iss:account.client_email, sub:account.client_email, aud:account.token_uri||'https://oauth2.googleapis.com/token', scope:'https://www.googleapis.com/auth/datastore', iat:now, exp:now+3600 }, key);
  const response = await fetch(account.token_uri||'https://oauth2.googleapis.com/token', { method:'POST', headers:{'Content-Type':'application/x-www-form-urlencoded'}, body:new URLSearchParams({ grant_type:'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion }) });
  if (!response.ok) throw new Error('Google service authorization failed');
  const data = await response.json();
  if (!data.access_token) throw new Error('Google access token missing');
  return data.access_token;
}
async function firestoreDocument(token, collection, id) {
  const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/${DATABASE_ID}/documents/${collection}/${encodeURIComponent(id)}`;
  const response = await fetch(url,{headers:{Authorization:`Bearer ${token}`}});
  if(response.status===404) return null;
  if(!response.ok) throw new Error('Firestore read failed');
  const doc=await response.json(), out={};
  for(const [k,v] of Object.entries(doc.fields||{})){
    if('stringValue' in v) out[k]=v.stringValue;
    else if('booleanValue' in v) out[k]=v.booleanValue;
    else if('integerValue' in v) out[k]=Number(v.integerValue);
  }
  return out;
}
function firestoreValue(value) {
  if(typeof value==='string') return {stringValue:value};
  if(typeof value==='boolean') return {booleanValue:value};
  if(typeof value==='number') return {integerValue:String(value)};
  return {nullValue:null};
}
async function saveRegistration(token, uid, login, nickname, email) {
  const root=`projects/${PROJECT_ID}/databases/${DATABASE_ID}/documents`;
  const fields=(obj)=>Object.fromEntries(Object.entries(obj).map(([k,v])=>[k,firestoreValue(v)]));
  const response=await fetch(`https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/${DATABASE_ID}/documents:commit`,{
    method:'POST',headers:{Authorization:`Bearer ${token}`,'Content-Type':'application/json'},
    body:JSON.stringify({writes:[
      {update:{name:`${root}/auth_usernames/${login}`,fields:fields({uid,username:login})},currentDocument:{exists:false}},
      {update:{name:`${root}/auth_users/${uid}`,fields:fields({uid,username:login,displayName:nickname,nickname,email,role:'user',isBlocked:false,status:'active'})},currentDocument:{exists:false}}
    ]})
  });
  if(response.status===409 || response.status===400) {
    const details=await response.text();
    if(/ALREADY_EXISTS|exists|precondition/i.test(details)) throw new Error('Этот логин уже занят.');
  }
  if(!response.ok) throw new Error('Не удалось сохранить профиль в базе данных.');
}
async function deleteAuthUser(idToken) {
  await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:delete?key=${encodeURIComponent(WEB_API_KEY)}`,{
    method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({idToken})
  });
}
async function issueCustomToken(account,key,uid) {
  const now=Math.floor(Date.now()/1000);
  return signJwt({iss:account.client_email,sub:account.client_email,aud:'https://identitytoolkit.googleapis.com/google.identity.identitytoolkit.v1.IdentityToolkit',iat:now,exp:now+3600,uid},key);
}
function json(data,status,origin) {
  const headers={'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store, max-age=0','Pragma':'no-cache','Vary':'Origin'};
  if(origin&&ALLOWED_ORIGINS.has(origin)){headers['Access-Control-Allow-Origin']=origin;headers['Access-Control-Allow-Methods']='POST, OPTIONS';headers['Access-Control-Allow-Headers']='Content-Type';headers['Access-Control-Max-Age']='86400';}
  return new Response(JSON.stringify(data),{status,headers});
}
export default {
 async fetch(request,env) {
  const origin=request.headers.get('Origin')||'', path=new URL(request.url).pathname;
  if(request.method==='OPTIONS'){
   if(!ALLOWED_ORIGINS.has(origin)) return new Response(null,{status:403});
   return new Response(null,{status:204,headers:{'Access-Control-Allow-Origin':origin,'Access-Control-Allow-Methods':'POST, OPTIONS','Access-Control-Allow-Headers':'Content-Type','Access-Control-Max-Age':'86400','Vary':'Origin'}});
  }
  if(request.method!=='POST'||!['/api/auth/login','/api/auth/register'].includes(path)) return json({message:'Not found'},404,origin);
  if(origin&&!ALLOWED_ORIGINS.has(origin)) return json({message:'Origin not allowed'},403,origin);
  if(Number(request.headers.get('Content-Length')||0)>8192) return json({message:'Request too large'},413,origin);
  let createdIdToken='';
  try {
   const body=await request.json();
   const login=String(body?.login||'').trim().toLowerCase();
   const password=typeof body?.password==='string'?body.password:'';
   if(!/^[a-z0-9_-]{3,20}$/.test(login)||password.length<1||password.length>128) return json({message:'Проверьте логин и пароль.'},400,origin);
   if(!env.FIREBASE_SERVICE_ACCOUNT_JSON) throw new Error('Missing service account secret');
   const account=JSON.parse(env.FIREBASE_SERVICE_ACCOUNT_JSON);
   if(account.project_id!==PROJECT_ID||!account.client_email||!account.private_key) throw new Error('Invalid service account configuration');
   const key=await importSigningKey(account.private_key);
   const accessToken=await googleAccessToken(account,key);

   if(path==='/api/auth/register') {
    const nickname=String(body?.nickname||'').trim();
    if(password.length<8) return json({message:'Пароль должен содержать минимум 8 символов.'},400,origin);
    if(nickname.length<2||nickname.length>40||/[<>]/.test(nickname)) return json({message:'Никнейм должен содержать 2–40 символов.'},400,origin);
    if(login==='serustqs') return json({message:'Этот логин зарезервирован.'},409,origin);
    if(await firestoreDocument(accessToken,'auth_usernames',login)||await firestoreDocument(accessToken,'usernames',login)) return json({message:'Этот логин уже занят.'},409,origin);
    const email=`${login}@accounts.rusty-lub.invalid`;
    const signup=await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${encodeURIComponent(WEB_API_KEY)}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,password,returnSecureToken:true})});
    const accountData=await signup.json().catch(()=>({}));
    if(!signup.ok) return json({message:accountData.error?.message==='EMAIL_EXISTS'?'Этот логин уже зарегистрирован.':'Не удалось создать аккаунт. Проверьте данные.'},409,origin);
    createdIdToken=accountData.idToken;
    try { await saveRegistration(accessToken,accountData.localId,login,nickname,email); }
    catch(error) { await deleteAuthUser(createdIdToken); createdIdToken=''; throw error; }
    const customToken=await issueCustomToken(account,key,accountData.localId);
    return json({customToken,profile:{uid:accountData.localId,login,nickname,role:'user',status:'active'}},201,origin);
   }

   const usernameDoc=(await firestoreDocument(accessToken,'usernames',login))||await firestoreDocument(accessToken,'auth_usernames',login);
   if(!usernameDoc?.uid) return json({message:'Неверный логин или пароль.'},401,origin);
   const uid=String(usernameDoc.uid);
   const profile=(await firestoreDocument(accessToken,'Users',uid))||await firestoreDocument(accessToken,'auth_users',uid);
   const profileLogin=String(profile?.normalizedLogin||profile?.login||profile?.username||'').toLowerCase();
   if(!profile||profile.uid!==uid||profileLogin!==login||(profile.status&&profile.status!=='active')||profile.isBlocked===true) return json({message:'Неверный логин или пароль.'},401,origin);
   const email=(typeof profile.email==='string'&&profile.email)||`${login}@accounts.rusty-lub.invalid`;
   const verify=await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${encodeURIComponent(WEB_API_KEY)}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,password,returnSecureToken:true})});
   if(!verify.ok) return json({message:'Неверный логин или пароль.'},401,origin);
   const verified=await verify.json();
   if(verified.localId!==uid) return json({message:'Неверный логин или пароль.'},401,origin);
   const customToken=await issueCustomToken(account,key,uid);
   return json({customToken,profile:{uid,login:String(profile.login||profile.username||login),nickname:String(profile.nickname||profile.displayName||profile.login||login),role:String(profile.role||'user'),status:String(profile.status||'active')}},200,origin);
  } catch(error) {
   console.error('Rusty.Lub auth error:',error instanceof Error?error.message:'unknown');
   return json({message:error instanceof Error&&error.message?error.message:'Авторизация временно недоступна. Попробуйте позже.'},503,origin);
  }
 }
};
