// Run with: node --test test/*.test.mjs (copy source .js to .mjs or set "type":"module")
import test from 'node:test';
import assert from 'node:assert/strict';
import {PrintPilotApi,PrintPilotApiError} from '../src/api-client.js';
import {prepareLegacyImport} from '../src/migration.js';
test('API requires expected mutation header and revision',async()=>{
 let last;
 const api=new PrintPilotApi({fetchImpl:async(url,init)=>{last={url,init};return {ok:true,json:async()=>({job:{id:'1',revision:2}})};}});
 await api.updateJob({id:'1',revision:1});
 assert.equal(last.url,'/api/v2/jobs/1');
 assert.equal(last.init.method,'PUT');
 assert.equal(last.init.headers['X-Requested-With'],'PrintPilotMini');
 await assert.rejects(()=>api.updateJob({id:'1'}),/Revision/);
});
test('409 never silently retries',async()=>{
 let calls=0;
 const api=new PrintPilotApi({fetchImpl:async()=>{calls++;return {ok:false,status:409,json:async()=>({error:'Konflikt'})};}});
 await assert.rejects(()=>api.updateJob({id:'1',revision:1}),e=>e instanceof PrintPilotApiError&&e.conflict);
 assert.equal(calls,1);
});
test('legacy migration preview preserves original records',()=>{
 const original={id:'A-1',customer:'Muster',product:'Flyer',date:'2026-11-09',notes:'Wichtig'};
 const preview=prepareLegacyImport([original]);
 assert.equal(preview.validCount,1);
 assert.equal(preview.jobs[0].original.notes,'Wichtig');
 assert.equal(preview.canImport,true);
 original.notes='Nachträglich geändert';
 assert.equal(preview.jobs[0].original.notes,'Wichtig');
});
test('duplicates block entire legacy import',()=>{
 const base={id:'A',customer:'K',product:'P',date:'2026-11-09'};
 const preview=prepareLegacyImport([base,{...base}]);
 assert.equal(preview.invalidCount,1);
 assert.equal(preview.canImport,false);
});
