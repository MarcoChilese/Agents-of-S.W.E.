/*
 * File: GetApiGrafanaMock.js
 * Creation date: 2019-04-21
 * Author: Diego Mazzalovo
 * Type: ECMAScript 6
 * Author e-mail: diego.mazzalovo8@studenti.unipd.it
 * Version: 0.0.4
 *
 * Changelog:
 * 0.0.1 || Diego Mazzalovo || 2019-04-21 || Prima stesura
 */


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
export default class GetApiGrafana {
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
    if (this.db.name === 'PerEccezione') throw new Error('Error');
    if (this.db.name === 'TestData DB') throw new Error('Error');
    return {
      Tabella1: ['Flusso', 'Flusso1', 'Flusso2'], Tabella2: ['f1', 'f2', 'f3'],
    };
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
    return [
      {
        id: 5,
        name: 'cloudflare',
      },
      {
        id: 3,
        name: 'TestData DB',
      },
    ];
  }
}
module.exports = GetApiGrafana;
