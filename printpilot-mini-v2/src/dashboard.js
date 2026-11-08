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
</style></head><body><main>
<header><div><div class="muted">PRINTPILOT / STAGING – NUR ANZEIGE</div><h1>Produktionsplan 2.0</h1><div id="identity" class="muted">Anmeldung wird geprüft …</div></div>
<div><button id="prev" type="button" aria-label="Vorige Woche">←</button> <button id="next" type="button" aria-label="Nächste Woche">→</button> <button id="reload" type="button">Aktualisieren</button></div></header>
<div id="stats" class="summary"></div><h2 id="weekTitle"></h2><div id="error" role="alert"></div><div class="week" id="week"></div>
<p class="muted">Geschützte D1-Testanzeige · automatische Aktualisierung alle 15 Sekunden · noch keine Bearbeitungsfunktion · keine Übernahme von Browserdaten</p>
</main><script>
(function(){'use strict';
 const $=id=>document.getElementById(id);
 function iso(d){return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-');}
 function monday(d){const x=new Date(d);x.setHours(12,0,0,0);x.setDate(x.getDate()-((x.getDay()+6)%7));return x;}
 function fmt(d){return d.toLocaleDateString('de-DE',{day:'2-digit',month:'2-digit'});}
 let start=monday(new Date()),jobs=[];
 async function api(path){const res=await fetch('/api/v2/'+path,{credentials:'same-origin',cache:'no-store',headers:{Accept:'application/json'}});
  if(!res.ok)throw Error(res.status===403?'Keine Berechtigung':('API-Fehler '+res.status));return res.json();}
 function text(tag,cls,value){const el=document.createElement(tag);if(cls)el.className=cls;el.textContent=String(value??'');return el;}
 function render(){
  const until=new Date(start);until.setDate(start.getDate()+4);
  $('weekTitle').textContent='Woche '+fmt(start)+' – '+fmt(until);
  const root=$('week');root.replaceChildren();
  for(let i=0;i<5;i++){
   const dt=new Date(start);dt.setDate(start.getDate()+i);const day=document.createElement('section');day.className='day';
   day.appendChild(text('h2','',['Mo','Di','Mi','Do','Fr'][i]+' · '+fmt(dt)));
   const cards=text('div','cards','');const rows=jobs.filter(j=>!j.archived&&j.date===iso(dt));
   if(!rows.length)cards.appendChild(text('div','empty','Keine Aufträge'));
   for(const j of rows){
    const c=text('article','card','');c.append(text('div','number',j.id),text('div','customer',j.customer),text('div','product',j.product+' · '+(j.quantity||'—')),text('div','status',j.status));
    if(j.notes)c.appendChild(text('div','notes','Notiz: '+j.notes));cards.appendChild(c);
   }
   day.appendChild(cards);root.appendChild(day);
  }
  const active=jobs.filter(j=>!j.archived);$('stats').replaceChildren(text('div','metric','Aktive Aufträge: '+active.length),text('div','metric','Archiviert: '+(jobs.length-active.length)));
 }
 async function refresh(){try{const [me,listed]=await Promise.all([api('me'),api('jobs')]);if(!Array.isArray(listed.jobs))throw Error('Ungültige Auftragsliste');
  jobs=listed.jobs;$('identity').textContent=me.email+' · '+me.role;$('error').textContent='';render();
 }catch(e){$('error').textContent=e.message+' – letzte erfolgreiche Anzeige bleibt bestehen.';}}
 $('prev').onclick=()=>{start.setDate(start.getDate()-7);render();};
 $('next').onclick=()=>{start.setDate(start.getDate()+7);render();};
 $('reload').onclick=refresh;
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)refresh()});
 setInterval(()=>{if(!document.hidden)refresh()},15000);refresh();
})();
</script></body></html>`;
