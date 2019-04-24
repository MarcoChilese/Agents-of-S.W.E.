/*
 * File: GetApiGrafana.js
 * Creation date: 2019-02-07
 * Author: Marco Favaro
 * Type: ECMAScript 6
 * Author e-mail: marco.favaro.8@studenti.unipd.it
 * Version: 0.0.4
 *
 * Changelog:
 * 0.0.4 || Marco Favaro                  || 2019-02-19 || Add headers function
 * 0.0.3 || Marco Favaro                  || 2019-02-18 || Creato classe e fix
 * 0.0.2 || Marco Favaro                  || 2019-02-13 || Aggiunto ajax
 * 0.0.1 || Marco Favaro & Bogdan Stanciu || 2019-02-07 || Prima stesura
 */


/**
 *  Class representing a connection to Grafana API
 */
class GetApiGrafana {
  /**
   * Create a connection
   * @param query - API that will return the requested information
   */
  constructor(backend, db) {
    this.backend = backend;
    this.db = db;
  }


  /**
   * The function return a JSON with all the available tables in the current database
   * @return {JSON} contains JSON with all the available tables and fields
   */
  async getDatasources() {
    // divide data
    const s = this.db.url.split(':');
    s[1] = s[1].substring(2, s[1].length);
    this.host = s[1];
    this.port = s[s.length - 1];

    const ris = {};
    // fetch all tables from database
    const tables = await this.backend.get(`/api/datasources/proxy/${this.db.id}/query?db=${this.db.database}&q=show%20measurements`);
    const t = tables.results[0].series[0].values;
    const r = [];
    // fetch all fields of tables
    for (const el in t) {
      r.push(
        this.backend.get(`api/datasources/proxy/${this.db.id}/query?db=${this.db.database}&q=show%20field%20keys%20on%20${this.db.database}%20from%20${t[el]}`),
      );
    }
    // wait until all tables are fetched
    await Promise.all(r);
    // divide fields
    for (const e in r) {
      const { name } = r[e].$$state.value.results[0].series[0];
      ris[name] = [];
      for (const field in r[e].$$state.value.results[0].series[0].values) ris[name].push(r[e].$$state.value.results[0].series[0].values[field][0]);
    }
    return ris;
  }

  /**
   * The function returns a json file containing information related to grafana by API
   *  @async
   *  @returns {JSON} json file with response
   */
  async getData() {
    const data = await this.queryAPI();
    const map = {};
    for (let i = 0; i < data.length; i++) { map[data[i].name] = data[i]; }

    return map;
  }

  /**
   * The function send a request to Grafana API and return a Promise
   * @returns {Promise} Promise object represents the API response in JSON format
   */
  queryAPI() {
    return this.backend.get('/api/datasources').then(data => data);
  }
}
/**      TEST USAGE: */
/*

 const GrafanaConnection = new GetApiGrafana('localhost', '/api/datasources', '8080') ;
 GrafanaConnection.getData();
 /*.then( (x) => {
   x = JSON.parse(x);
   console.log(x[0]);
 }) ;
 */


module.exports = GetApiGrafana;
