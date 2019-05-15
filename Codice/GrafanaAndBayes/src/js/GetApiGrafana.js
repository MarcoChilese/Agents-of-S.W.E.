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
   * splits data received to have correct variables
   * */
  initialize() {
    // divide data
    const s = this.db.url.split(':');
    s[1] = s[1].substring(2, s[1].length);
    this.host = s[1];
    this.port = s[s.length - 1];
  }

  /**
   * gets all fields from all tables
   * @param{json} tables
   * @return{array} an array with all fields of all tables in order
   * */
  async getFields(tables) {
    const ris = [];
    // fetch all fields of tables
    for (const table in tables) {
      ris.push(this.backend.get(`api/datasources/proxy/${this.db.id}/query?db=${this.db.database}&q=show%20field%20keys%20on%20${this.db.database}%20from%20${tables[table]}`));
    }
    // wait until all tables are fetched
    await Promise.all(ris);
    return ris;
  }

  /**
   * gets all tables from database
   * @return{json} all tables fetched from database
   * */
  async getTables() {
    // fetch all tables from database
    const tables = await this.backend.get(`/api/datasources/proxy/${this.db.id}/query?db=${this.db.database}&q=show%20measurements`);
    return tables.results[0].series[0].values;
  }

  /**
   * splits tables' fields
   * @param{json} json with tables and fields bad formatted
   * @return{json} json with tables and fields well formatted
   * */
  divideFields(elements) {
    const ris = {};
    // divide fields
    for (const el in elements) {
      const { name } = elements[el].$$state.value.results[0].series[0];
      ris[name] = [];
      for (const field in elements[el].$$state.value.results[0].series[0].values)
        ris[name].push(elements[el].$$state.value.results[0].series[0].values[field][0]);
    }
    return ris;
  }

  /**
   * The function return a JSON with all the available tables in the current database
   * @return {JSON} contains JSON with all the available tables and fields
   */
  async getDatasources() {
    this.initialize();
    return this.divideFields(await this.getFields(await this.getTables()));
  }

  /**
   * The function returns a json file containing information related to grafana by API
   *  @returns {JSON} json file with response
   */
  async getData() {
    const data = await this.queryAPI();
    const map = {};
    for (const el in data) { map[data[el].name] = data[el]; }
    return map;
  }

  /**
   * The function send a request to Grafana API and return a Promise
   * @returns {Promise} Promise object represents the API response in JSON format
   */
  async queryAPI() {
    return this.backend.get('/api/datasources');
  }
}

module.exports = GetApiGrafana;
