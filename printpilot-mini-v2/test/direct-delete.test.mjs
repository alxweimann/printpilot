import test from 'node:test';
import assert from 'node:assert/strict';
import worker from '../src/index.js';
import {productionHtml} from '../src/production-ui.js';

const job={id:'DEL-001',customer:'Muster',product:'Testdruck',date:'2026-11-09',status:'Neu / ungeprüft',steps:[]};
const headers={'Content-Type':'application/json','X-Requested-With':'PrintPilotMini'};
const request=(payload,method='DELETE')=>new Request('https://test.example/api/v2/jobs/DEL-001',{method,headers,body:JSON.stringify(payload)});
function fixture(role='admin',archived=false){
 let mutationCount=0,lastSql='',parameters=[],forceConflict=false;
 const db={
  prepare(sql){
   return {bind(...args){this.args=args;return this},
    async first(){
     if(sql.startsWith('SELECT role FROM users'))return {role};
     if(sql.startsWith('SELECT * FROM jobs WHERE id='))return {id:job.id,payload:JSON.stringify(job),revision:3,archived:archived?1:0,position:1024};
     return null;
    }};
  },
  async batch(statements){
   mutationCount++;lastSql=statements[0].args===undefined?'':statements[0].sql||'';
   parameters=statements[0].args||[];
   return [{meta:{changes:forceConflict?0:1}},{meta:{changes:1}}];
  }
 };
 // SQL probe without changing application behavior.
 const original=db.prepare;
 db.prepare=function(sql){const statement=original(sql);statement.sql=sql;return statement};
 const ctx={access:{getIdentity:async()=>({email:'admin@example.com'})}};
 return {db,ctx,get mutations(){return mutationCount},get sql(){return lastSql},get args(){return parameters},conflict(){forceConflict=true}};
}
test('admin can delete active job after explicit ID confirmation and optimistic lock',async()=>{
 const x=fixture();
 const res=await worker.fetch(request({revision:3,confirmPermanentDelete:true,confirmId:'DEL-001'}),{DB:x.db},x.ctx);
 assert.equal(res.status,200);
 assert.equal(x.mutations,1);
 assert.match(x.sql,/DELETE FROM jobs WHERE id=\? AND revision=\?/);
 assert.doesNotMatch(x.sql,/archived=1/);
 assert.deepEqual(x.args,['DEL-001',3]);
});
test('direct delete rejects missing exact ID confirmation, without mutations',async()=>{
 for(const payload of [{revision:3},{revision:3,confirmPermanentDelete:true,confirmId:'WRONG'},{revision:3,confirmPermanentDelete:false,confirmId:'DEL-001'}]){
  const x=fixture(),res=await worker.fetch(request(payload),{DB:x.db},x.ctx);
  assert.equal(res.status,422);
  assert.equal(x.mutations,0);
 }
});
test('direct delete rejects stale revision, without mutations',async()=>{
 const x=fixture();
 const res=await worker.fetch(request({revision:2,confirmPermanentDelete:true,confirmId:'DEL-001'}),{DB:x.db},x.ctx);
 assert.equal(res.status,409);
 assert.equal(x.mutations,0);
});
test('display cannot delete even with full confirmation, without mutations',async()=>{
 const x=fixture('display');
 const res=await worker.fetch(request({revision:3,confirmPermanentDelete:true,confirmId:'DEL-001'}),{DB:x.db},x.ctx);
 assert.equal(res.status,403);
 assert.equal(x.mutations,0);
});
test('archived records retain administrator delete ability',async()=>{
 const x=fixture('admin',true);
 const res=await worker.fetch(request({revision:3,confirmPermanentDelete:true,confirmId:'DEL-001'}),{DB:x.db},x.ctx);
 assert.equal(res.status,200);
 assert.equal(x.mutations,1);
});
test('database version conflict prevents delete success',async()=>{
 const x=fixture();x.conflict();
 const res=await worker.fetch(request({revision:3,confirmPermanentDelete:true,confirmId:'DEL-001'}),{DB:x.db},x.ctx);
 assert.equal(res.status,409);
});
test('edit dialog shows admin-only delete with typed job ID confirmation',()=>{
 assert.match(productionHtml,/id="deleteBtn">Auftrag löschen/);
 assert.match(productionHtml,/classList\.toggle\('hide',!j\|\|remoteRole!=='admin'\)/);
 assert.match(productionHtml,/const confirmed=prompt\('Bitte zur Sicherheit die Auftragsnummer eingeben:/);
 assert.match(productionHtml,/confirmPermanentDelete:true,confirmId:id/);
});
