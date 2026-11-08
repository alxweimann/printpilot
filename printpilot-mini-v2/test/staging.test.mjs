import test from 'node:test';
import assert from 'node:assert/strict';
import {runInNewContext} from 'node:vm';
import worker from '../src/index.js';
import {dashboardHtml} from '../src/dashboard.js';

const sample={id:'TEST-001',customer:'Muster',product:'Flyer',date:'2026-11-09',status:'Daten fehlen',steps:[],quantity:'500'};
function makeDb(role='admin',selectedJob=sample){
 return {prepare(sql){
   return {bind(...args){return {
     first:async()=>sql.startsWith('SELECT role')?{role}:sql.startsWith('SELECT * FROM jobs')?{id:sample.id,payload:JSON.stringify(selectedJob),revision:2,archived:0,position:0,updated_at:'2026-11-08'}:null
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


test('fixed deadline cannot move without explicit confirmation',async()=>{
 const fixed={...sample,fixed:true};
 const env={DB:makeDb('admin',fixed)};
 const moved={...fixed,date:'2026-11-10',revision:2};
 const response=await worker.fetch(request('/api/v2/jobs/TEST-001',{method:'PUT',headers:{'Content-Type':'application/json','X-Requested-With':'PrintPilotMini'},body:JSON.stringify(moved)}),env,ctx);
 assert.equal(response.status,409);
 assert.match(await response.text(),/Fixtermin/);
});
test('staging HTML contains single-day navigation and completed archive controls',()=>{
 assert.match(dashboardHtml,/id="backWeek"/);
 assert.match(dashboardHtml,/id="archivedRows"/);
 assert.match(dashboardHtml,/editingRevision/);
});

test('move endpoint updates payload and ordering with accepted fixed-date confirmation',async()=>{
 const current={...sample,fixed:true};
 let updated=null;
 const db={
  prepare(sql){let bound=[];return {
   bind(...args){bound=args;return this},
   async first(){
    if(sql.startsWith('SELECT role'))return {role:'admin'};
    if(sql.startsWith('SELECT * FROM jobs'))return {id:current.id,payload:JSON.stringify(current),revision:2,archived:0,position:2048,updated_at:'2026-11-08'};
    return null;
   },
   async all(){return {results:[{id:'SECOND',position:1024},{id:'THIRD',position:2048}]}},
   get params(){return bound}
  }},
  async batch(statements){updated=statements[0].params;return [{meta:{changes:1}},{meta:{changes:1}}]}
 };
 const moved={revision:2,date:'2026-11-10',relativeId:'SECOND',after:true,confirmFixedMove:true};
 const response=await worker.fetch(request('/api/v2/jobs/TEST-001/move',{
  method:'POST',headers:{'Content-Type':'application/json','X-Requested-With':'PrintPilotMini'},
  body:JSON.stringify(moved)}),{DB:db},ctx);
 assert.equal(response.status,200);
 assert.equal(JSON.parse(updated[0]).date,'2026-11-10');
 assert.equal(updated[2],1536);
});
test('move endpoint rejects missing target and does not alter database',async()=>{
 let batches=0;
 const db={
  prepare(sql){return {bind(){return this},async first(){
    if(sql.startsWith('SELECT role'))return {role:'admin'};
    if(sql.startsWith('SELECT * FROM jobs'))return {id:sample.id,payload:JSON.stringify(sample),revision:2,archived:0,position:1024};
    return null;
   },async all(){return {results:[]}}}},
  async batch(){batches++;return []}
 };
 const response=await worker.fetch(request('/api/v2/jobs/TEST-001/move',{
  method:'POST',headers:{'Content-Type':'application/json','X-Requested-With':'PrintPilotMini'},
  body:JSON.stringify({revision:2,date:'2026-11-10',relativeId:'MISSING',after:true})}),{DB:db},ctx);
 assert.equal(response.status,409);
 assert.equal(batches,0);
});
test('locked staging board has move control only for authorized roles',()=>{
 assert.match(dashboardHtml,/id="boardLock"/);
 assert.match(dashboardHtml,/boardUnlocked=false/);
 assert.match(dashboardHtml,/if\(!boardUnlocked\|\|userRole==='display'\)return/);
});
