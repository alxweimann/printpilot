// Read-only Access diagnostics. Never print credentials, e-mails or policy rules.
// Deliberately does not modify Access settings or other Workers.
const token=String(process.env.CF_PRINTPILOT_ACCESS_TOKEN||process.env.CF_PRINTPILOT_TOKEN||'').trim().replace(/^Bearer\s+/i,'').replace(/^['\"]|['\"]$/g,'').trim();
const account=process.env.CF_PRINTPILOT_ACCOUNT_ID;
if(!token||!/^[a-f0-9]{32}$/i.test(account||'')){
  throw new Error('Missing Access token or account ID (configure GitHub Actions secrets).');
}
const verifyUrl=token.startsWith('cfat_')
 ? 'https://api.cloudflare.com/client/v4/accounts/'+account+'/tokens/verify'
 : 'https://api.cloudflare.com/client/v4/user/tokens/verify';
const verify=await fetch(verifyUrl,{headers:{Authorization:'Bearer '+token,Accept:'application/json'}});
let verifyResult={};try{verifyResult=await verify.json()}catch(_){}
console.log('Access-capable token secret present: '+Boolean(token));
console.log('Access-capable token format plausible: '+(/^[A-Za-z0-9_-]{20,200}$/.test(token)));
console.log('Token verification endpoint: '+(token.startsWith('cfat_')?'account':'user'));
console.log('Token verification HTTP status: '+verify.status);
console.log('Token verification success: '+Boolean(verifyResult.success));
console.log('Token verification state: '+String(verifyResult.result?.status||'unavailable'));
if(!verify.ok||!verifyResult.success)throw new Error('Cloudflare token verification failed; inspect GitHub secret, token validity, or access.');
const origin='https://api.cloudflare.com/client/v4/accounts/'+account;
async function get(url) {
  const response=await fetch(origin+url,{headers:{Authorization:'Bearer '+token,Accept:'application/json'}});
  if(!response.ok){
    let detail='';
    try {const error=await response.json();detail=(error.errors||[]).slice(0,2).map(e=>String(e.code)+': '+String(e.message).slice(0,140)).join('; ')}
    catch(_){}
    throw new Error('Cloudflare API HTTP '+response.status+' for '+url.split('?')[0]+(detail?' — '+detail:''));
  }
  const data=await response.json();
  if(!data.success)throw new Error('Cloudflare API reported an error for '+url.split('?')[0]);
  return data.result;
}
const appName='printpilot-mini-v2-staging - Cloudflare Workers';
const apps=await get('/access/apps');
const matches=apps.filter(a=>a.name===appName);
if(matches.length!==1)throw new Error('Expected one exact staging Access app; found '+matches.length+'. No changes attempted.');
const app=matches[0];
// The Cloudflare Workers application uses worker_id destinations, not necessarily a hostname.
if(Array.isArray(app.destinations))console.log('Worker-scoped destinations: '+app.destinations.length);
let policies=app.policies||[];
try{const linked=await get('/access/apps/'+encodeURIComponent(app.id)+'/policies');if(Array.isArray(linked))policies=linked}
catch(e){console.log('Linked policy detail endpoint unavailable: '+e.message);}
const display=policies.find(p=>p.id==='8a921393-c7e0-4fc0-8380-7f354c0700b0'||p.name==='PrintPilot – Anzeige');
const cloudflare=policies.find(p=>p.name==='Cloudflare account members');
let idps=[];
try{idps=await get('/access/identity_providers')}catch(e){console.log('Identity provider listing unavailable: '+e.message)}
const types=idps.map(i=>i.type).sort();
const selected=app.allowed_idps||[];
const pinProviders=idps.filter(i=>/one.?time.?pin/i.test(String(i.type||'')));
const pinAllowed=pinProviders.some(p=>selected.includes(p.id))||(!selected.length&&pinProviders.length>0);
console.log('Staging Access app exists: yes');
console.log('Access policies linked: '+policies.length);
console.log('Display policy linked: '+Boolean(display));
console.log('Cloudflare member policy linked: '+Boolean(cloudflare));
console.log('Available identity provider types: '+(types.join(', ')||'not returned'));
console.log('Application selects specific identity providers: '+Boolean(selected.length));
console.log('One-time PIN provider allowed by application: '+(idps.length?pinAllowed:'UNVERIFIED'));
console.log('Automatic identity redirect: '+Boolean(app.auto_redirect_to_identity));
console.log('READ-ONLY check completed. No changes made.');
