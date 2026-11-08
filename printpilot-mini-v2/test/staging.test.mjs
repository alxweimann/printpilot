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

test('existing metadata is preserved, while unsolicited client fields are rejected',async()=>{
 const original={...sample,notes:'Sonderhinweis',legacyReference:'ALT-88',demo:true};
 let update=null;
 const db={
  prepare(sql){let args=[];return{
   bind(...values){args=values;return this},
   async first(){
    if(sql.startsWith('SELECT role'))return {role:'admin'};
    if(sql.startsWith('SELECT * FROM jobs'))return {id:original.id,payload:JSON.stringify(original),revision:2,archived:0,position:1200,updated_at:'2026-11-08'};
    return null;
   },
   get params(){return args}
  }},
  async batch(statements){update=statements[0].params;return [{meta:{changes:1}},{meta:{changes:1}}]}
 };
 const changed={...sample,customer:'Neuer Kunde',notes:'Andere Notiz',revision:2,legacyReference:'GEFÄLSCHT',extraField:'unerlaubt'};
 const response=await worker.fetch(request('/api/v2/jobs/TEST-001',{
  method:'PUT',headers:{'Content-Type':'application/json','X-Requested-With':'PrintPilotMini'},
  body:JSON.stringify(changed)}),{DB:db},ctx);
 assert.equal(response.status,200);
 const saved=JSON.parse(update[0]);
 assert.equal(saved.customer,'Neuer Kunde');
 assert.equal(saved.notes,'Andere Notiz');
 assert.equal(saved.legacyReference,'ALT-88');
 assert.equal(saved.demo,true);
 assert.equal(saved.extraField,undefined);
});
test('staging editor offers explicit conflict review without silently merging',()=>{
 assert.match(dashboardHtml,/id="conflictReview"/);
 assert.match(dashboardHtml,/id="loadServerVersion"/);
 assert.match(dashboardHtml,/ungespeicherten Eingaben verwerfen/);
 assert.match(dashboardHtml,/editingRevision=latest.revision/);
});

test('ordinary form date change assigns queue position on target day',async()=>{
 const original={...sample,date:'2026-11-09',legacyReference:'OLD-100'};
 let changed=null;
 const db={
  prepare(sql){let params=[];return{
   bind(...values){params=values;return this},
   async first(){
    if(sql.startsWith('SELECT role'))return {role:'admin'};
    if(sql.startsWith('SELECT * FROM jobs'))return {id:original.id,payload:JSON.stringify(original),revision:5,archived:0,position:1024,updated_at:'2026-11-08'};
    if(sql.startsWith('SELECT COALESCE(MAX(position),0)+1024'))return {p:4096};
    return null;
   },
   get params(){return params}
  }},
  async batch(statements){changed=statements[0].params;return [{meta:{changes:1}},{meta:{changes:1}}]}
 };
 const response=await worker.fetch(request('/api/v2/jobs/TEST-001',{
  method:'PUT',headers:{'Content-Type':'application/json','X-Requested-With':'PrintPilotMini'},
  body:JSON.stringify({...sample,date:'2026-11-10',revision:5})}),{DB:db},ctx);
 assert.equal(response.status,200);
 assert.equal(changed[3],4096);
 assert.equal(JSON.parse(changed[0]).date,'2026-11-10');
 assert.equal(JSON.parse(changed[0]).legacyReference,'OLD-100');
 assert.equal((await response.json()).job.position,4096);
});
test('central job list rejects silent truncation at 5000 records',async()=>{
 const sampleRow={id:sample.id,payload:JSON.stringify(sample),revision:1,archived:0,position:1};
 const db={prepare(sql){return{
  bind(){return this},
  async first(){return {role:'display'}},
  async all(){assert.match(sql,/LIMIT 5001/);return {results:Array.from({length:5001},()=>sampleRow)}}
 }}};
 const response=await worker.fetch(request('/api/v2/jobs'),{DB:db},ctx);
 assert.equal(response.status,409);
 assert.match(await response.text(),/vollständige Liste/);
});
