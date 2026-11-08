import test from 'node:test';
import assert from 'node:assert/strict';
import worker from '../src/index.js';

// Every write attempt is rejected before any D1 job/machine mutation is prepared.
function fixture(role='display', identity=true, active=true) {
  let mutations=0;
  const db={
    prepare(sql) {
      if (/^(?:INSERT|UPDATE|DELETE|REPLACE)\\b/i.test(sql)) mutations++;
      return {bind(){return this}, async first(){
        if (sql.startsWith('SELECT role FROM users')) return active?{role}:null;
        return null;
      }, async all(){return {results:[]}}};
    },
    async batch(){mutations++;return []}
  };
  const ctx=identity?{access:{getIdentity:async()=>({email:'TESTER@example.com'})}}:{};
  return {db,ctx,get mutations(){return mutations}};
}
const base='https://printpilot-v2.example';
const jsonHeaders={'Content-Type':'application/json','X-Requested-With':'PrintPilotMini'};
function req(path,method='GET',body) {
  return new Request(base+path,{method,headers:method==='GET'?undefined:jsonHeaders,body:method==='GET'?undefined:JSON.stringify(body??{})});
}
const sample={id:'AUTH-TEST',customer:'Muster',product:'Flyer',date:'2026-11-09',status:'Daten fehlen',revision:1};
const writeCases=[
  ['POST','/api/v2/jobs',sample],
  ['PUT','/api/v2/jobs/AUTH-TEST',sample],
  ['DELETE','/api/v2/jobs/AUTH-TEST',{revision:1}],
  ['POST','/api/v2/jobs/AUTH-TEST/move',{revision:1,date:'2026-11-10'}],
  ['POST','/api/v2/jobs/AUTH-TEST/archive',{revision:1}],
  ['POST','/api/v2/jobs/AUTH-TEST/restore',{revision:1}],
  ['POST','/api/v2/machines',{name:'Testmaschine'}],
  ['PUT','/api/v2/machines/Testmaschine',{name:'Neu'}],
  ['DELETE','/api/v2/machines/Testmaschine',{}]
];
for(const [method,path,payload] of writeCases) {
  test('display cannot execute '+method+' '+path+'; zero mutations',async()=>{
    const x=fixture();
    const response=await worker.fetch(req(path,method,payload),{DB:x.db},x.ctx);
    assert.equal(response.status,403);
    assert.equal(x.mutations,0);
  });
}
test('display may access own identity and read-only views',async()=>{
  for(const path of ['/api/v2/me','/api/v2/jobs','/api/v2/machines','/classic','/']) {
    const x=fixture();
    const response=await worker.fetch(req(path),{DB:x.db},x.ctx);
    assert.equal(response.status,200,path);
    assert.equal(x.mutations,0);
  }
});
test('display cannot retrieve administrator audit log',async()=>{
  const x=fixture();
  assert.equal((await worker.fetch(req('/api/v2/audit'),{DB:x.db},x.ctx)).status,403);
});
test('legacy production role is rejected entirely even if still in D1',async()=>{
  const x=fixture('production');
  for(const request of [req('/api/v2/jobs'),req('/api/v2/jobs','POST',sample)]) {
    const response=await worker.fetch(request,{DB:x.db},x.ctx);
    assert.equal(response.status,403);
  }
  assert.equal(x.mutations,0);
});
test('no Access identity is rejected, including spoofed email headers',async()=>{
  const x=fixture('admin',false);
  const response=await worker.fetch(new Request(base+'/api/v2/jobs',{headers:{'Cf-Access-Authenticated-User-Email':'tester@example.com'}}),{DB:x.db},x.ctx);
  assert.equal(response.status,403);
  assert.equal(x.mutations,0);
});
test('deactivated account is rejected',async()=>{
  const x=fixture('admin',true,false);
  assert.equal((await worker.fetch(req('/api/v2/jobs'),{DB:x.db},x.ctx)).status,403);
  assert.equal(x.mutations,0);
});
test('admin is identified as administrator and has access to audit endpoint',async()=>{
  const x=fixture('admin');
  const me=await worker.fetch(req('/api/v2/me'),{DB:x.db},x.ctx);
  assert.equal(me.status,200);
  assert.deepEqual(await me.json(),{email:'tester@example.com',role:'admin'});
  const audit=await worker.fetch(req('/api/v2/audit'),{DB:x.db},x.ctx);
  assert.equal(audit.status,200);
});
