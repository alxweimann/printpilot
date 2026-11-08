// Controlled repair: only links the existing reusable display policy to the exact PrintPilot staging Access app.
// It never creates/deletes apps, policies, identity providers, or touches other Workers.
const token=String(process.env.CF_PRINTPILOT_ACCESS_TOKEN||'').trim();
const account=String(process.env.CF_PRINTPILOT_ACCOUNT_ID||'').trim();
if(!token.startsWith('cfat_')||!/^[a-f0-9]{32}$/i.test(account)) throw new Error('Expected active account API token and account ID.');
const base='https://api.cloudflare.com/client/v4/accounts/'+account;
async function api(path, options={}){
  const response=await fetch(base+path,{...options,headers:{Authorization:'Bearer '+token,Accept:'application/json','Content-Type':'application/json',...(options.headers||{})}});
  const data=await response.json().catch(()=>({}));
  if(!response.ok||!data.success) throw new Error('Cloudflare API '+response.status+' for '+path);
  return data.result;
}
const appName='printpilot-mini-v2-staging - Cloudflare Workers';
const apps=await api('/access/apps');
const matches=apps.filter(x=>x.name===appName);
if(matches.length!==1) throw new Error('Expected exactly one staging Access app.');
const app=matches[0];
const linked=await api('/access/apps/'+encodeURIComponent(app.id)+'/policies');
if(!Array.isArray(linked)||linked.length!==1||linked[0].name!=='Cloudflare account members')
  throw new Error('Refusing: linked policy state differs from the diagnosed staging-only state.');
const allPolicies=await api('/access/policies');
const displays=allPolicies.filter(x=>x.name==='PrintPilot – Anzeige');
if(displays.length!==1) throw new Error('Expected exactly one reusable display policy.');
const display=displays[0];
const existing=linked[0];
await api('/access/apps/'+encodeURIComponent(app.id),{method:'PUT',body:JSON.stringify({policies:[
  {id:existing.id,account_id:account,precedence:1},
  {id:display.id,account_id:account,precedence:2}
]})});
const verified=await api('/access/apps/'+encodeURIComponent(app.id)+'/policies');
const ids=new Set(verified.map(x=>x.id));
if(verified.length!==2||!ids.has(existing.id)||!ids.has(display.id)) throw new Error('Cloudflare response did not verify both linked policies.');
console.log('Staging display policy linked: true');
console.log('Linked policies verified: 2');
