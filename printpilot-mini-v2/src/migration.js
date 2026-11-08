// PrintPilot Mini 2.0 — pure, read-only preparation of existing v1 browser data.
// This deliberately NEVER uploads or modifies records. Confirmation is a separate action.
export function prepareLegacyImport(rawJobs,rawMachines=[]){
 if(!Array.isArray(rawJobs)||!Array.isArray(rawMachines))throw new Error('Ungültige Sicherungsdatei');
 const issues=[],seen=new Set(),jobs=[];
 for(let index=0;index<rawJobs.length;index++){
  const job=rawJobs[index],at=index+1;
  if(!job||typeof job!=='object'||Array.isArray(job)){issues.push({row:at,reason:'Ungültiger Datensatz'});continue;}
  const id=String(job.id??'').trim();
  if(!id){issues.push({row:at,reason:'Auftragsnummer fehlt'});continue;}
  if(seen.has(id)){issues.push({row:at,id,reason:'Doppelte Auftragsnummer'});continue;}
  seen.add(id);
  if(!/^\d{4}-\d{2}-\d{2}$/.test(job.date||'')){issues.push({row:at,id,reason:'Ungültiges Datum'});continue;}
  if(!String(job.customer??'').trim()||!String(job.product??'').trim()){issues.push({row:at,id,reason:'Kunde oder Produkt fehlt'});continue;}
  jobs.push({sourceIndex:index,original:structuredClone(job),id,customer:job.customer,product:job.product,date:job.date,
   status:job.status,quantity:job.quantity??'',machine:job.machine??'',steps:Array.isArray(job.steps)?job.steps:[],notes:job.notes??'',fixed:job.fixed===true});
 }
 const machines=rawMachines.filter(x=>typeof x==='string'&&x.trim()).map(x=>x.trim());
 return {sourceCount:rawJobs.length,validCount:jobs.length,invalidCount:issues.length,issues,
  jobs,machines:[...new Set(machines)],canImport:issues.length===0};
}
