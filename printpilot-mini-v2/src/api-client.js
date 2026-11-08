// PrintPilot Mini 2.0 — API client, staging only. No fallback writes to localStorage.
// Import in a module-based UI after Cloudflare Access and D1 have been configured.
export class PrintPilotApiError extends Error {
  constructor(message,status,details=null){super(message);this.name='PrintPilotApiError';this.status=status;this.details=details;}
  get conflict(){return this.status===409;}
  get forbidden(){return this.status===401||this.status===403;}
}
export class PrintPilotApi {
  constructor({baseUrl='',fetchImpl=fetch}={}) {
    // Same-origin only: avoid leaking authenticated actions or data to alternate hosts.
    if(baseUrl && !baseUrl.startsWith('/'))throw new Error('Nur relative API-Pfade zulässig');
    this.baseUrl=baseUrl.replace(/\/$/,'');
    this.fetchImpl=fetchImpl;
  }
  async call(path,{method='GET',payload,signal}={}){
    const init={method,credentials:'same-origin',cache:'no-store',redirect:'error',signal,
      headers:{Accept:'application/json'}};
    if(method!=='GET'){
      init.headers['X-Requested-With']='PrintPilotMini';
      init.headers['Content-Type']='application/json';
      init.body=JSON.stringify(payload??{});
    }
    let response;
    try{response=await this.fetchImpl(this.baseUrl+'/api/v2'+path,init);}
    catch(e){throw new PrintPilotApiError('Verbindung zur PrintPilot-Datenbank fehlgeschlagen. Keine Änderung wurde bestätigt.',0);}
    let json=null;
    try{json=await response.json();}catch(_){}
    if(!response.ok){
      let message=json?.error||('Serverfehler '+response.status);
      if(response.status===409)message+=' – Bitte den neuesten Auftragsstand laden und Änderungen vergleichen.';
      if(response.status===401||response.status===403)message='Keine Berechtigung oder Anmeldung abgelaufen.';
      throw new PrintPilotApiError(message,response.status,json);
    }
    if(!json||typeof json!=='object')throw new PrintPilotApiError('Ungültige Serverantwort. Daten nicht übernehmen.',502);
    return json;
  }
  async identity(){return this.call('/me');}
  async listJobs(){return (await this.call('/jobs')).jobs;}
  async listMachines(){return (await this.call('/machines')).machines;}
  async audit(){return (await this.call('/audit')).events;}
  async createJob(job){return (await this.call('/jobs',{method:'POST',payload:job})).job;}
  async updateJob(job){
    if(!Number.isSafeInteger(job?.revision)||job.revision<1)throw new Error('Zum Speichern ist die aktuelle Revision notwendig');
    return (await this.call('/jobs/'+encodeURIComponent(job.id),{method:'PUT',payload:job})).job;
  }
  async moveJob(job,{date,relativeId=null,after=true,confirmFixedMove=false}={}){
    if(!Number.isSafeInteger(job?.revision)||job.revision<1)throw new Error('Revision fehlt');
    if(!date)throw new Error('Zieldatum fehlt');
    return this.call('/jobs/'+encodeURIComponent(job.id)+'/move',
      {method:'POST',payload:{revision:job.revision,date,relativeId,after,confirmFixedMove}});
  }
  async archiveJob(job){return this._change(job,'archive');}
  async restoreJob(job){return this._change(job,'restore');}
  async _change(job,action){
    if(!Number.isSafeInteger(job?.revision)||job.revision<1)throw new Error('Revision fehlt');
    return this.call('/jobs/'+encodeURIComponent(job.id)+'/'+action,{method:'POST',payload:{revision:job.revision}});
  }
  async deleteArchived(job){
    if(!job?.archived)throw new Error('Nur archivierte Aufträge dürfen endgültig gelöscht werden');
    return this.call('/jobs/'+encodeURIComponent(job.id),{method:'DELETE',payload:{revision:job.revision}});
  }
}
// The UI may poll listJobs() every 15 seconds. Do not silently replace a form
// while the user edits it. On a 409, show current server values side by side
// with unsaved local values; never auto-retry PUT/DELETE.
