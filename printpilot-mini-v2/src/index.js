import {dashboardHtml} from './dashboard.js';
// PrintPilot Mini 2.0 — isolated staging API. Fail closed without Cloudflare Access.
const STATUSES = new Set(['Neu / ungeprüft','Daten fehlen','Auftragstasche fehlt','In Korrektur','Wartet auf Freigabe','Freigegeben','In Produktion','Weiterverarbeitung','Fertig','Problem / Verzögerung']);
const ROLES = new Set(['admin','production','display']);
const WRITE_HEADERS = {'content-type':'application/json; charset=utf-8','cache-control':'no-store'};
function reply(data,status=200){return new Response(JSON.stringify(data),{status,headers:WRITE_HEADERS});}
function failure(status,message){return reply({error:message},status);}
function safeJson(str){try{return JSON.parse(str)}catch{return null}}
function validDate(v){if(typeof v!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(v))return false;const d=new Date(v+'T12:00:00Z');return !Number.isNaN(d.getTime())&&d.toISOString().slice(0,10)===v;}
function normalizeJob(data){
 if(!data||typeof data!=='object'||Array.isArray(data))return null;
 const id=String(data.id??'').trim(),customer=String(data.customer??'').trim(),product=String(data.product??'').trim(),date=data.date;
 if(!id||id.length>40||!customer||customer.length>120||!product||product.length>160||!validDate(date))return null;
 if(typeof data.status!=='string'||!STATUSES.has(data.status))return null;
 const steps=data.steps??[];
 if(!Array.isArray(steps)||steps.length>30||steps.some(v=>typeof v!=='string'||v.length>80))return null;
 const quantity=String(data.quantity??''),machine=String(data.machine??''),notes=String(data.notes??'');
 if(quantity.length>50||machine.length>120||notes.length>500)return null;
 return {id,customer,product,date,status:data.status,steps,quantity,machine,notes,fixed:data.fixed===true};
}
function rowToJob(row){return {...safeJson(row.payload),revision:row.revision,archived:Boolean(row.archived),position:row.position,updatedAt:row.updated_at};}
function audit(db,actor,action,id,before,after){return db.prepare('INSERT INTO audit_log(event_id,actor,action,entity_type,entity_id,before_json,after_json) SELECT ?,?,?,?,?,?,? WHERE changes()=1').bind(crypto.randomUUID(),actor,action,'job',id,before?JSON.stringify(before):null,after?JSON.stringify(after):null);}
async function body(request){const raw=await request.text();if(raw.length>25000)throw new Error('Payload zu groß');const data=safeJson(raw);if(!data||typeof data!=='object'||Array.isArray(data))throw new Error('Ungültiges JSON');return data;}
async function checkedIdentity(ctx,db){
 if(!ctx.access)return null; // no header trust, Access-attested context only
 const identity=await ctx.access.getIdentity();
 const email=String(identity?.email??'').trim().toLowerCase();
 if(!email||email.length>254)return null;
 const user=await db.prepare('SELECT role FROM users WHERE email=? AND active=1').bind(email).first();
 if(!user||!ROLES.has(user.role))return null;
 return {email,role:user.role};
}
export default {
 async fetch(request,env,ctx){
  const url=new URL(request.url);
  if(url.pathname!=='/'&&!url.pathname.startsWith('/api/v2/'))return failure(404,'Nicht gefunden');
  if(!env.DB)return failure(503,'Datenbank nicht konfiguriert');
  let user;
  try{user=await checkedIdentity(ctx,env.DB)}catch(e){return failure(503,'Authentifizierung nicht verfügbar')}
  if(!user)return failure(403,'Zugriff verweigert');
  const {method}=request;
  if(method!=='GET'){
   if(user.role==='display')return failure(403,'Nur Lesezugriff');
   if(request.headers.get('X-Requested-With')!=='PrintPilotMini'||!/^application\/json(?:\s*;|$)/i.test(request.headers.get('content-type')||''))return failure(415,'JSON-Anfrage mit Schutzheader erforderlich');
  }
  const path=url.pathname,db=env.DB;
  if(path==='/'&&method==='GET')return new Response(dashboardHtml,{headers:{'content-type':'text/html; charset=utf-8','cache-control':'no-store','content-security-policy':"default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; connect-src 'self'; img-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'none'",'x-content-type-options':'nosniff','referrer-policy':'no-referrer'}});
  try{
   if(path==='/api/v2/me'&&method==='GET')return reply(user);
   if(path==='/api/v2/jobs'&&method==='GET'){
    const rows=await db.prepare('SELECT * FROM jobs ORDER BY archived ASC, planned_date ASC, position ASC, id ASC LIMIT 5000').all();
    return reply({jobs:(rows.results||[]).map(rowToJob)});
   }
   if(path==='/api/v2/machines'&&method==='GET'){
    const rows=await db.prepare('SELECT name FROM machines ORDER BY name').all();
    return reply({machines:(rows.results||[]).map(x=>x.name)});
   }
   if(path==='/api/v2/audit'&&method==='GET'){
    if(user.role!=='admin')return failure(403,'Nur Administrator');
    const rows=await db.prepare('SELECT event_id,timestamp,actor,action,entity_type,entity_id FROM audit_log ORDER BY timestamp DESC LIMIT 100').all();
    return reply({events:rows.results||[]});
   }
   if(path==='/api/v2/jobs'&&method==='POST'){
    const data=await body(request),j=normalizeJob(data);
    if(!j)return failure(422,'Pflichtfelder, Datum oder Status ungültig');
    if(await db.prepare('SELECT id FROM jobs WHERE id=?').bind(j.id).first())return failure(409,'Auftragsnummer existiert bereits');
    const next=(await db.prepare('SELECT COALESCE(MAX(position),0)+1 AS p FROM jobs WHERE planned_date=?').bind(j.date).first()).p;
    const batch=await db.batch([
     db.prepare('INSERT OR IGNORE INTO jobs(id,payload,planned_date,status,position,updated_by) VALUES(?,?,?,?,?,?)').bind(j.id,JSON.stringify(j),j.date,j.status,next,user.email),
     audit(db,user.email,'create',j.id,null,j)
    ]);
    if(batch[0].meta?.changes!==1)return failure(409,'Auftragsnummer wurde bereits vergeben');
    return reply({job:{...j,revision:1,archived:false,position:next}},201);
   }
   const match=path.match(/^\/api\/v2\/jobs\/([^/]+)(?:\/(archive|restore|move))?$/);
   if(!match)return failure(404,'Nicht gefunden');
   const id=decodeURIComponent(match[1]),action=match[2];
   if(id.length>40)return failure(400,'Ungültige Auftragsnummer');
   const beforeRow=await db.prepare('SELECT * FROM jobs WHERE id=?').bind(id).first();
   if(!beforeRow)return failure(404,'Auftrag nicht gefunden');
   const previous=rowToJob(beforeRow);
   if(action==='move'&&method==='POST'){
    const data=await body(request);
    if(!Number.isSafeInteger(data.revision)||data.revision!==beforeRow.revision)return failure(409,'Auftrag wurde zwischenzeitlich geändert');
    if(previous.archived)return failure(409,'Archivierte Aufträge können nicht verschoben werden');
    if(!validDate(data.date))return failure(422,'Ungültiges Zieldatum');
    if(previous.fixed&&data.date!==previous.date&&data.confirmFixedMove!==true)return failure(409,'Fixtermin: Verschieben muss ausdrücklich bestätigt werden');
    const relativeId=data.relativeId===null||data.relativeId===undefined?null:String(data.relativeId);
    if(relativeId!==null&&(relativeId.length>40||relativeId===id))return failure(422,'Ungültiger Bezug');
    const targetRows=await db.prepare('SELECT id,position FROM jobs WHERE planned_date=? AND archived=0 AND id<>? ORDER BY position ASC,id ASC').bind(data.date,id).all();
    const target=targetRows.results||[];
    let index=target.length;
    if(relativeId!==null){
      const i=target.findIndex(x=>x.id===relativeId);
      if(i<0)return failure(409,'Zielauftrag nicht mehr vorhanden');
      index=i+(data.after===true?1:0);
    }
    const prev=index>0?Number(target[index-1].position):null;
    const next=index<target.length?Number(target[index].position):null;
    // Real-valued midpoint allows insertion without shifting other jobs.
    // If precision is exhausted, require controlled reindexing rather than
    // silently changing any unrelated record.
    const position=prev===null&&next===null?1024:
      prev===null?next-1024:next===null?prev+1024:(prev+next)/2;
    if(!Number.isFinite(position)||(prev!==null&&position<=prev)||(next!==null&&position>=next))
      return failure(409,'Sortierung benötigt eine Neuordnung. Keine Daten verändert.');
    const rev=beforeRow.revision+1;
    const batch=await db.batch([
      db.prepare('UPDATE jobs SET planned_date=?,position=?,revision=?,updated_at=CURRENT_TIMESTAMP,updated_by=? WHERE id=? AND revision=? AND archived=0').bind(data.date,position,rev,user.email,id,beforeRow.revision),
      audit(db,user.email,'move',id,previous,{...previous,date:data.date,position,revision:rev})
    ]);
    if(batch[0].meta?.changes!==1)return failure(409,'Auftrag wurde zwischenzeitlich geändert');
    return reply({ok:true,revision:rev,date:data.date,position});
   }
   if(action&&method==='POST'){
    const data=await body(request);
    if(!Number.isSafeInteger(data.revision)||data.revision!==beforeRow.revision)return failure(409,'Auftrag wurde zwischenzeitlich geändert');
    if(action==='archive'&&(previous.status!=='Fertig'||previous.archived))return failure(409,'Nur fertige aktive Aufträge können abgelegt werden');
    if(action==='restore'&&!previous.archived)return failure(409,'Auftrag ist nicht archiviert');
    const newArchived=action==='archive'?1:0,newRev=beforeRow.revision+1;
    const batch=await db.batch([
      db.prepare('UPDATE jobs SET archived=?,revision=?,updated_at=CURRENT_TIMESTAMP,updated_by=? WHERE id=? AND revision=?').bind(newArchived,newRev,user.email,id,beforeRow.revision),
      audit(db,user.email,action,id,previous,{...previous,archived:Boolean(newArchived),revision:newRev})
    ]);
    if(batch[0].meta?.changes!==1)return failure(409,'Auftrag wurde zwischenzeitlich geändert');
    return reply({ok:true,revision:newRev});
   }
   if(!action&&method==='PUT'){
    const data=await body(request);
    if(!Number.isSafeInteger(data.revision)||data.revision!==beforeRow.revision)return failure(409,'Auftrag wurde zwischenzeitlich geändert');
    const next=normalizeJob(data);
    if(!next||next.id!==id)return failure(422,'Auftragsdaten ungültig');
    if(previous.fixed&&next.date!==previous.date&&data.confirmFixedMove!==true)return failure(409,'Fixtermin: Verschieben muss ausdrücklich bestätigt werden');
    const nextRev=beforeRow.revision+1;
    const batch=await db.batch([
     db.prepare('UPDATE jobs SET payload=?,planned_date=?,status=?,revision=?,updated_at=CURRENT_TIMESTAMP,updated_by=? WHERE id=? AND revision=?').bind(JSON.stringify(next),next.date,next.status,nextRev,user.email,id,beforeRow.revision),
     audit(db,user.email,'update',id,previous,{...next,revision:nextRev,archived:previous.archived})
    ]);
    if(batch[0].meta?.changes!==1)return failure(409,'Auftrag wurde zwischenzeitlich geändert');
    return reply({job:{...next,revision:nextRev,archived:previous.archived}});
   }
   if(!action&&method==='DELETE'){
    if(user.role!=='admin')return failure(403,'Nur Administrator darf endgültig löschen');
    const data=await body(request);
    if(!Number.isSafeInteger(data.revision)||data.revision!==beforeRow.revision)return failure(409,'Auftrag wurde zwischenzeitlich geändert');
    if(!previous.archived)return failure(409,'Vor dem Löschen archivieren');
    const batch=await db.batch([
     db.prepare('DELETE FROM jobs WHERE id=? AND revision=? AND archived=1').bind(id,beforeRow.revision),
     audit(db,user.email,'delete',id,previous,null)
    ]);
    if(batch[0].meta?.changes!==1)return failure(409,'Auftrag wurde zwischenzeitlich geändert');
    return reply({ok:true});
   }
   return failure(405,'Methode nicht erlaubt');
  }catch(e){
   if(e.message==='Payload zu groß')return failure(413,e.message);
   if(e.message==='Ungültiges JSON')return failure(400,e.message);
   return failure(500,'Interner Fehler');
  }
 }
};