// Read-only Access diagnostics. Never print credentials, e-mails or policy rules.
// Deliberately does not modify Access settings or other Workers.
const token=process.env.CF_PRINTPILOT_ACCESS_TOKEN;
const account=process.env.CF_PRINTPILOT_ACCOUNT_ID;
if(!token||!/^[a-f0-9]{32}$/i.test(account||'')){
  throw new Error('Missing Access token or account ID (configure GitHub Actions secrets).');
}
const origin='https://api.cloudflare.com/client/v4/accounts/'+account;
async function get(url) {
  const response=await fetch(origin+url,{headers:{Authorization:'Bearer '+token,Accept:'application/json'}});
  if(!response.ok)throw new Error('Cloudflare API HTTP '+response.status+' for '+url.split('?')[0]);
  const data=await response.json();
  if(!data.success)throw new Error('Cloudflare API reported an error for '+url.split('?')[0]);
  return data.result;
}
const appName='printpilot-mini-v2-staging - Cloudflare Workers';
const apps=await get('/access/apps?per_page=1000');
const matches=apps.filter(a=>a.name===appName);
if(matches.length!==1)throw new Error('Expected one exact staging Access app; found '+matches.length+'. No changes attempted.');
const app=matches[0];
if(!String(app.domain||'').includes('printpilot-mini-v2-staging')&&
   !JSON.stringify(app.destinations||[]).includes('printpilot-mini-v2-staging'))
  throw new Error('Staging Worker domain mismatch. Stop.');
const policies=app.policies||[];
const display=policies.find(p=>p.id==='8a921393-c7e0-4fc0-8380-7f354c0700b0'||p.name==='PrintPilot – Anzeige');
const cloudflare=policies.find(p=>p.name==='Cloudflare account members');
const idps=await get('/access/identity_providers');
const types=idps.map(i=>i.type).sort();
const selected=app.allowed_idps||[];
const pinProviders=idps.filter(i=>i.type==='onetimepin'||i.type==='one_time_pin'||i.type==='onetime_pin');
const pinAllowed=pinProviders.some(p=>selected.includes(p.id))||(!selected.length&&pinProviders.length>0);
console.log('Staging Access app exists: yes');
console.log('Access policies linked: '+policies.length);
console.log('Display policy linked: '+Boolean(display));
console.log('Cloudflare member policy linked: '+Boolean(cloudflare));
console.log('Available identity provider types: '+types.join(', '));
console.log('Application selects specific identity providers: '+Boolean(selected.length));
console.log('One-time PIN provider allowed by application: '+pinAllowed);
console.log('Automatic identity redirect: '+Boolean(app.auto_redirect_to_identity));
console.log('READ-ONLY check completed. No changes made.');
