import test from 'node:test';
import assert from 'node:assert/strict';
import {runInNewContext} from 'node:vm';
import worker from '../src/index.js';
import {dashboardHtml} from '../src/dashboard.js';

const sample={id:'TEST-001',customer:'Muster',product:'Flyer',date:'2026-11-09',status:'Daten fehlen',steps:[],quantity:'500'};
function makeDb(role='admin'){
 return {prepare(sql){
   return {bind(...args){return {
     first:async()=>sql.startsWith('SELECT role')?{role}:sql.startsWith('SELECT * FROM jobs')?{id:sample.id,payload:JSON.stringify(sample),revision:2,archived:0,position:0,updated_at:'2026-11-08'}:null
   };},all:async()=>({results:[]})};
 }};
}
const ctx={access:{getIdentity:async()=>({email:'Tester@Example.com'})}};
function request(path,opts={}){return new Request('https://v2.example'+path,opts);}
test('staging page and API both fail closed without Access',async()=>{
 const env={DB:makeDb()};
 assert.equal((await worker.fetch(request('/'),env,{})).status,403);
 assert.equal((await worker.fetch(request('/api/v2/jobs'),env,{})).status,403);
});
test('authenticated worker serves protected staging page',async()=>{
 const response=await worker.fetch(request('/'),{DB:makeDb()},ctx);
 assert.equal(response.status,200);
 assert.match(await response.text(),/id="editForm"/);
 assert.match(response.headers.get('content-security-policy'),/frame-ancestors/);
});
test('display role cannot edit jobs via API',async()=>{
 const response=await worker.fetch(request('/api/v2/jobs',{method:'POST',headers:{'Content-Type':'application/json','X-Requested-With':'PrintPilotMini'},body:JSON.stringify(sample)}),{DB:makeDb('display')},ctx);
 assert.equal(response.status,403);
});
test('stale job revision rejected without any database mutation',async()=>{
 const response=await worker.fetch(request('/api/v2/jobs/TEST-001',{method:'PUT',headers:{'Content-Type':'application/json','X-Requested-With':'PrintPilotMini'},body:JSON.stringify({...sample,revision:1})}),{DB:makeDb()},ctx);
 assert.equal(response.status,409);
});
test('unauthorized edit request without CSRF protection rejected',async()=>{
 const response=await worker.fetch(request('/api/v2/jobs/TEST-001',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({...sample,revision:2})}),{DB:makeDb()},ctx);
 assert.equal(response.status,415);
});
test('inline staging script parses cleanly',()=>{
 const js=dashboardHtml.split('<script>')[1]?.split('</script>')[0];
 assert.ok(js);
 assert.doesNotThrow(()=>new Function(js));
});
