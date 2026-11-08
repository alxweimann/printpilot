// Staging-only read view, returned only after Cloudflare Access and role checks.
export const dashboardHtml=`<!doctype html>
<html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex,nofollow">
<title>PrintPilot Mini 2.0 – Testanzeige</title>
<style>
:root{font-family:Inter,system-ui,Arial,sans-serif;color:#dff0f9;background:#0e2030}
*{box-sizing:border-box}body{margin:0;padding:24px}main{max-width:1250px;margin:auto}header{display:flex;justify-content:space-between;align-items:center;gap:14px;flex-wrap:wrap}
h1{font-size:23px;margin:2px 0 4px}.muted{color:#a4bdcb;font-size:13px}button{background:#d9f2fa;color:#104c6b;border:0;border-radius:8px;padding:11px 14px;font-weight:700;cursor:pointer}
.summary{display:flex;gap:12px;flex-wrap:wrap;margin:20px 0}.metric{padding:13px 18px;border-radius:12px;background:#20374b}
.week{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:10px}.day{border-radius:11px;overflow:hidden;min-width:0;background:#193a57}.day:nth-child(2){background:#193e34}.day:nth-child(3){background:#322747}.day:nth-child(4){background:#45263c}.day:nth-child(5){background:#493521}
.day h2{font-size:15px;padding:12px;margin:0;background:#237ccb}.day:nth-child(2) h2{background:#238e60}.day:nth-child(3) h2{background:#7951b8}.day:nth-child(4) h2{background:#b73585}.day:nth-child(5) h2{background:#c76d24}
.cards{padding:7px;display:grid;align-content:start;gap:7px}.card{background:#263f53;padding:10px;border-radius:7px;overflow-wrap:anywhere}.number{font-size:15px;font-weight:850}.customer{color:#9fe0ee;font-weight:650;font-size:13px;margin:2px 0 9px}.product{font-size:12px}.status{font-size:11px;color:#f6d994;margin-top:8px}.notes{color:#ffedb3;font-size:12px;margin-top:6px;white-space:pre-wrap}.empty{padding:12px;font-size:13px;color:#c1d7e4}
#error{color:#ffd4d4;padding:12px 0}.tag{font-size:11px;background:#3c6074;padding:5px 9px;border-radius:6px}
@media(max-width:900px){.week{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:520px){.week{grid-template-columns:1fr}body{padding:12px}}

dialog{background:#fff;color:#203243;border:0;border-radius:14px;width:min(660px,96vw);max-height:92vh;overflow:auto;padding:24px;box-shadow:0 20px 70px #0008}
dialog::backdrop{background:#061421b3}
dialog h2{margin-top:0}dialog label{font-size:13px;font-weight:700;display:grid;gap:5px}
dialog input,dialog select,dialog textarea{min-width:0;width:100%;padding:9px;border:1px solid #c5d8e4;border-radius:7px;font:inherit;background:#fff;color:#203243}
dialog .checkbox{display:flex;align-items:center;gap:7px}dialog .checkbox input{width:auto}
dialog textarea{min-height:75px;resize:vertical}
.formgrid{display:grid;grid-template-columns:1fr 1fr;gap:12px}.formgrid .wide{grid-column:1/-1}
.formactions{display:flex;justify-content:flex-end;gap:8px;margin-top:14px}
#saveError{color:#af2a36;font-size:13px;min-height:18px}
.card-actions{display:flex;gap:5px;flex-wrap:wrap;margin-top:8px}
.card-actions button{font-size:11px;padding:6px 8px;border-radius:6px}
@media(max-width:540px){.formgrid{grid-template-columns:1fr}.formgrid .wide{grid-column:auto}}

.view-title{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap}
.view-title h2{margin:14px 0}
.day-title{width:100%;font-size:15px;padding:12px;margin:0;background:#237ccb;color:#fff;border-radius:0;text-align:left}
.day-title:hover{filter:brightness(1.13)}
.day:nth-child(2) .day-title{background:#238e60}
.day:nth-child(3) .day-title{background:#7951b8}
.day:nth-child(4) .day-title{background:#b73585}
.day:nth-child(5) .day-title{background:#c76d24}
.week.single-day{grid-template-columns:repeat(2,minmax(0,1fr))}
.week.single-day .day{grid-column:1/-1}
.week.single-day .cards{grid-template-columns:repeat(2,minmax(0,1fr));padding:12px;gap:12px}
.week.single-day .card{padding:15px}
.week.single-day .number{font-size:20px}
.week.single-day .customer{font-size:17px}
.week.single-day .product,.week.single-day .notes,.week.single-day .status{font-size:15px}
.archive{margin:24px 0 12px;border:1px solid #507186;border-radius:12px;overflow:hidden}
.archive summary{cursor:pointer;padding:14px 17px;font-weight:750}
.archive summary span{padding:2px 8px;border-radius:10px;background:#29475e;margin-left:5px}
.archive-row{display:flex;gap:12px;justify-content:space-between;align-items:center;padding:10px 17px;border-top:1px solid #294a60}
.archive-details{display:flex;flex-direction:column;gap:4px}
.archive-details small{color:#a4bdcb}
.danger{background:#ffdddd;color:#813030}
@media(max-width:700px){.week.single-day .cards{grid-template-columns:1fr}.archive-row{flex-direction:column;align-items:flex-start}}

.day.day-0 .day-title{background:#237ccb}
.day.day-1 .day-title{background:#238e60}
.day.day-2 .day-title{background:#7951b8}
.day.day-3 .day-title{background:#b73585}
.day.day-4 .day-title{background:#c76d24}
.day.day-0{background:#193a57}
.day.day-1{background:#193e34}
.day.day-2{background:#322747}
.day.day-3{background:#45263c}
.day.day-4{background:#493521}

#boardLock[aria-pressed="false"]{background:#ffe4b8;color:#6a4009}
#boardLock[aria-pressed="true"]{background:#c7f1d8;color:#205739}
.move-target{border:1px solid #b5dae9;border-radius:6px;padding:6px;color:#19465d;background:#f4fbff;min-width:0;max-width:100%;font-size:11px}
</style></head><body><main>
<header><div><div class="muted">PRINTPILOT / STAGING – NUR ANZEIGE</div><h1>Produktionsplan 2.0</h1><div id="identity" class="muted">Anmeldung wird geprüft …</div></div>
<div><button id="prev" type="button" aria-label="Vorige Woche">←</button> <button id="next" type="button" aria-label="Nächste Woche">→</button> <button id="reload" type="button">Aktualisieren</button> <button id="newJob" type="button" hidden>＋ Auftrag</button> <button id="boardLock" type="button" aria-pressed="false" hidden>🔒 Gesperrt</button></div></header>
<div id="stats" class="summary"></div><div class="view-title"><h2 id="weekTitle"></h2><button id="backWeek" type="button" hidden>← Wochenansicht</button></div><div id="error" role="alert"></div><div class="week" id="week"></div>
<details class="archive" id="archive"><summary>✓ Erledigte Aufträge <span id="archiveCount">0</span></summary><div id="archivedRows"></div></details>
<p class="muted">Geschützte D1-Testumgebung · automatische Aktualisierung alle 15 Sekunden · kein Import aus bisherigen Browserdaten</p>
</main>
<dialog id="editDialog"><form id="editForm">
<h2 id="editTitle">Auftrag</h2>
<div class="formgrid">
<label>Auftragsnummer <input name="id" required maxlength="40"></label>
<label>Fertigstellung <input name="date" type="date" required></label>
<label>Kunde <input name="customer" required maxlength="120"></label>
<label>Produkt <input name="product" required maxlength="160"></label>
<label>Auflage <input name="quantity" maxlength="50"></label>
<label>Maschine <input name="machine" maxlength="120"></label>
<label>Status <select name="status"></select></label>
<label class="checkbox"><input name="fixed" type="checkbox"> Fixtermin</label>
<label class="wide">Verarbeitung (Komma getrennt) <input name="steps"></label>
<label class="wide">Notiz <textarea name="notes" maxlength="500"></textarea></label>
</div><p id="saveError" role="alert"></p>
<div class="formactions"><button id="cancelEdit" type="button">Abbrechen</button><button id="saveEdit" type="submit">Speichern</button></div>
</form></dialog>
<script>
(function(){'use strict';
 const $=id=>document.getElementById(id);
 function iso(d){return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-');}
 function monday(d){const x=new Date(d);x.setHours(12,0,0,0);x.setDate(x.getDate()-((x.getDay()+6)%7));return x;}
 function fmt(d){return d.toLocaleDateString('de-DE',{day:'2-digit',month:'2-digit'});}
 let start=monday(new Date()),jobs=[],userRole='display',editingId=null,editingRevision=null,editBusy=false,selectedDay=null,boardUnlocked=false;
 async function api(path,method='GET',payload){const headers={Accept:'application/json'};if(method!=='GET'){headers['Content-Type']='application/json';headers['X-Requested-With']='PrintPilotMini';}const res=await fetch('/api/v2/'+path,{method,credentials:'same-origin',cache:'no-store',headers,body:method==='GET'?undefined:JSON.stringify(payload||{})});
  if(!res.ok){let info={};try{info=await res.json()}catch(_){}const msg=info.error||('API-Fehler '+res.status);throw Error(res.status===409?msg+' – Zwischenzeitlich geändert. Bitte neu laden.':res.status===403?'Keine Berechtigung':msg);}return res.json();}
 function text(tag,cls,value){const el=document.createElement(tag);if(cls)el.className=cls;el.textContent=String(value??'');return el;}
 function render(){
  const until=new Date(start);until.setDate(start.getDate()+4);
  $('weekTitle').textContent=selectedDay===null?'Woche '+fmt(start)+' – '+fmt(until):(['Montag','Dienstag','Mittwoch','Donnerstag','Freitag'][selectedDay]+' · '+fmt(new Date(start.getFullYear(),start.getMonth(),start.getDate()+selectedDay,12)));
  $('backWeek').hidden=selectedDay===null;
  $('week').classList.toggle('single-day',selectedDay!==null);
  const root=$('week');root.replaceChildren();
  for(let i=0;i<5;i++){
   if(selectedDay!==null&&selectedDay!==i)continue;
   const dt=new Date(start);dt.setDate(start.getDate()+i);const day=document.createElement('section');day.className='day day-'+i;
   const heading=text('button','day-title',['Mo','Di','Mi','Do','Fr'][i]+' · '+fmt(dt)+(selectedDay===null?'  ⤢':''));
   heading.type='button';heading.title='Tag groß anzeigen';heading.onclick=()=>{selectedDay=i;render();};
   day.appendChild(heading);
   const cards=text('div','cards','');const rows=jobs.filter(j=>!j.archived&&j.date===iso(dt));
   if(!rows.length)cards.appendChild(text('div','empty','Keine Aufträge'));
   for(const j of rows){
    const c=text('article','card','');c.append(text('div','number',j.id),text('div','customer',j.customer),text('div','product',j.product+' · '+(j.quantity||'—')),text('div','status',j.status));
    if(j.notes)c.appendChild(text('div','notes','Notiz: '+j.notes));
    if(userRole!=='display'){const actions=text('div','card-actions','');
     if(boardUnlocked){
      const move=text('select','move-target','');
      move.setAttribute('aria-label','Auftrag '+j.id+' auf anderen Wochentag verschieben');
      const selected=text('option','','Verschieben nach …');selected.value='';move.appendChild(selected);
      for(let offset=0;offset<5;offset++){
       const date=new Date(start);date.setDate(start.getDate()+offset);const target=iso(date);
       if(target===j.date)continue;
       const option=text('option','',['Mo','Di','Mi','Do','Fr'][offset]+' · '+fmt(date));option.value=target;move.appendChild(option);
      }
      move.onchange=async()=>{const target=move.value;move.value='';if(target)await moveJob(j,target);};
      actions.appendChild(move);
      const ordered=rows;
      const index=ordered.findIndex(x=>x.id===j.id);
      for(const delta of [-1,1]){if(index+delta<0||index+delta>=ordered.length)continue;
       const b=text('button','',delta===-1?'↑ Hoch':'↓ Runter');b.type='button';
       b.onclick=()=>reorderWithinDay(j,ordered[index+delta],delta>0);actions.appendChild(b);
      }
     }
     const edit=text('button','','Bearbeiten');edit.type='button';edit.onclick=()=>openEditor(j.id);actions.appendChild(edit);if(j.status==='Fertig'&&!j.archived){const archive=text('button','','✓ Ablegen');archive.type='button';archive.onclick=()=>archiveJob(j);actions.appendChild(archive);}c.appendChild(actions);}cards.appendChild(c);
   }
   day.appendChild(cards);root.appendChild(day);
  }
  const active=jobs.filter(j=>!j.archived);const archived=jobs.filter(j=>j.archived);
  $('stats').replaceChildren(text('div','metric','Aktive Aufträge: '+active.length),text('div','metric','Archiviert: '+archived.length));
  $('archiveCount').textContent=String(archived.length);
  const area=$('archivedRows');area.replaceChildren();
  if(!archived.length)area.appendChild(text('div','empty','Noch keine abgeschlossenen Aufträge im Archiv.'));
  for(const j of archived){
   const row=text('div','archive-row','');
   const info=text('div','archive-details','');info.append(text('strong','',j.id+' · '+j.customer),text('small','',j.product+' · '+j.date));
   row.appendChild(info);
   if(userRole!=='display'){
    const controls=text('div','card-actions','');
    const restore=text('button','','Wiederherstellen');restore.type='button';restore.onclick=()=>archiveAction(j,'restore');
    controls.appendChild(restore);
    if(userRole==='admin'){
     const del=text('button','','Endgültig löschen');del.type='button';del.className='danger';del.onclick=()=>deleteArchived(j);controls.appendChild(del);
    }
    row.appendChild(controls);
   }
   area.appendChild(row);
  }
 }
 async function refresh(){try{const [me,listed]=await Promise.all([api('me'),api('jobs')]);if(!Array.isArray(listed.jobs))throw Error('Ungültige Auftragsliste');
  jobs=listed.jobs;userRole=me.role;$('newJob').hidden=userRole==='display';$('boardLock').hidden=userRole==='display';if(userRole==='display')boardUnlocked=false;renderLock();$('identity').textContent=me.email+' · '+me.role;$('error').textContent='';render();
 }catch(e){$('error').textContent=e.message+' – letzte erfolgreiche Anzeige bleibt bestehen.';}}
 function renderLock(){const btn=$('boardLock');btn.textContent=boardUnlocked?'🔓 Entsperrt':'🔒 Gesperrt';btn.setAttribute('aria-pressed',String(boardUnlocked));}
 async function moveJob(j,date,relativeId=null,after=true){
  if(!boardUnlocked||userRole==='display')return;
  const confirmFixedMove=Boolean(j.fixed&&j.date!==date&&confirm('Fixtermin '+j.id+' wirklich verschieben?'));
  if(j.fixed&&j.date!==date&&!confirmFixedMove)return;
  try{await api('jobs/'+encodeURIComponent(j.id)+'/move','POST',{revision:j.revision,date,relativeId,after,confirmFixedMove});await refresh();}
  catch(e){$('error').textContent=e.message+' – Die Position wurde nicht verändert.';}
 }
 async function reorderWithinDay(j,neighbor,after){return moveJob(j,j.date,neighbor.id,after);}
 const statuses=['Neu / ungeprüft','Daten fehlen','Auftragstasche fehlt','In Korrektur','Wartet auf Freigabe','Freigegeben','In Produktion','Weiterverarbeitung','Fertig','Problem / Verzögerung'];
 const form=$('editForm');
 for(const value of statuses){const opt=document.createElement('option');opt.value=value;opt.textContent=value;form.elements.namedItem('status').appendChild(opt);}
 function field(name){return form.elements.namedItem(name);}
 function openEditor(id){
  if(userRole==='display')return;
  const job=id?jobs.find(x=>x.id===id):null;if(id&&!job)return;
  editingId=id||null;editingRevision=job?.revision??null;$('editTitle').textContent=job?'Auftrag bearbeiten':'Neuer Auftrag';
  for(const name of ['id','date','customer','product','quantity','machine','notes'])field(name).value=job?.[name]||'';
  field('id').readOnly=Boolean(job);field('date').value=job?.date||iso(new Date());
  field('status').value=job?.status||statuses[0];field('fixed').checked=Boolean(job?.fixed);
  field('steps').value=(job?.steps||[]).join(', ');$('saveError').textContent='';$('editDialog').showModal();
 }
 async function archiveAction(job,action){
  if(userRole==='display')return;
  if(!confirm(action==='archive'?'Fertigen Auftrag '+job.id+' archivieren?':'Auftrag '+job.id+' wiederherstellen?'))return;
  try{await api('jobs/'+encodeURIComponent(job.id)+'/'+action,'POST',{revision:job.revision});await refresh();}
  catch(e){$('error').textContent=e.message;}
 }
 async function archiveJob(job){return archiveAction(job,'archive');}
 async function deleteArchived(job){
  if(userRole!=='admin'||!job.archived)return;
  if(!confirm('Auftrag '+job.id+' ENDGÜLTIG löschen? Diese Aktion kann nicht rückgängig gemacht werden.'))return;
  try{await api('jobs/'+encodeURIComponent(job.id),'DELETE',{revision:job.revision});await refresh();}
  catch(e){$('error').textContent=e.message;}
 }
 form.addEventListener('submit',async event=>{
  event.preventDefault();if(editBusy||userRole==='display')return;
  const old=editingId?jobs.find(j=>j.id===editingId):null;if(editingId&&!old)return;
  const job={id:field('id').value.trim(),date:field('date').value,customer:field('customer').value.trim(),product:field('product').value.trim(),
   quantity:field('quantity').value.trim(),machine:field('machine').value,status:field('status').value,fixed:field('fixed').checked,
   steps:field('steps').value.split(',').map(x=>x.trim()).filter(Boolean),notes:field('notes').value.trim()};
  if(old){job.revision=editingRevision;if(old.fixed&&old.date!==job.date){if(!confirm('Fixtermin von '+old.date+' auf '+job.date+' verschieben?'))return;job.confirmFixedMove=true;}}
  editBusy=true;$('saveEdit').disabled=true;$('saveError').textContent='';
  try{await api(old?'jobs/'+encodeURIComponent(old.id):'jobs',old?'PUT':'POST',job);$('editDialog').close();await refresh();}
  catch(e){$('saveError').textContent=e.message;}
  finally{editBusy=false;$('saveEdit').disabled=false;}
 });
 $('newJob').onclick=()=>openEditor(null);
 $('boardLock').onclick=()=>{if(userRole==='display')return;boardUnlocked=!boardUnlocked;renderLock();render();};
 $('backWeek').onclick=()=>{selectedDay=null;render();};
 $('editDialog').addEventListener('cancel',e=>{if(editBusy)e.preventDefault();});
 $('cancelEdit').onclick=()=>{if(!editBusy)$('editDialog').close()};
 $('prev').onclick=()=>{start.setDate(start.getDate()-7);render();};
 $('next').onclick=()=>{start.setDate(start.getDate()+7);render();};
 $('reload').onclick=refresh;
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)refresh()});
 setInterval(()=>{if(!document.hidden&&!$('editDialog').open)refresh()},15000);refresh();
})();
</script></body></html>`;
