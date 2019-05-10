/*
 * File: ConnectServer.js
 * Creation date: 2019-03-28
 * Author: Favaro Marco
 * Type: JS6
 * Author e-mail: marco.favaro.8@studenti.unipd.it
 * Version: 0.0.1
 *
 */


export default class ConnectServer {
  constructor(host, port) {
    this.host = host;
    this.port = port;
  }

  /**
   *  Function testing if server  is alive
   * @returns boolean: true if server is alive, else false
   */
  async alive() {
    if (this.port === 5000) throw new Error('Error');
    return { date: 'Mon Apr 22 2019 15:24:22 GMT+0000 (Coordinated Universal Time)', port: 8600 };
  }

  /**
   * Function return a list of all networks if this.query value is '/networks'
   * else this.port value is '/getnetwork/:name' return a json of network passing
   * @returns json : networks or one network selected
   */
  async networks() {
    if (this.port === 5000) throw new Error('Error');
    return [{ name: 'Alarm', monitoring: true }, { name: 'Sachs', monitoring: false }];
  }

  /**
   * This function upload a network
   * @param net
   * @returns return true if operation is done else false
   */
  async uploadnetwork(net) {
    // eslint-disable-next-line no-param-reassign
    net = JSON.parse(net);
    const e = new Error('');
    if (net.name === 'Sachs') {
      e.status = 404;
    }
    if (net.name === 'net') {
      e.status = 200;
    }
    throw e;
  }

  /**
   * This function delete a network
   * @param net
   * @returns return true if operation is done else false
   */
  async deletenetwork(net) {
    const e = new Error('');
    e.status = 200;
    if (net === 'nope') { e.status = 404; }
    throw e;
  }

  /**
   * Function to request calculated probabilities to server
   * @param{net} name of the net
   * @returns{json}
   */
  async getnetworkprob(net) {
    // eslint-disable-next-line eqeqeq
    if (net === 'notValid') throw new Error('');
    return {
      stato1: [0.05, 0.95],
      stato2: [0.8, 0.2],
      stato3: [0.7, 0.3],
    };
  }

  async getnetwork(net) {
    if (net === 'Alarm') {
      return {
        temporalPolicy: { seconds: 10, minutes: 1, hours: 0 },
      };
    }

    if (net === 'data') {
      return {
        name: 'name',
        nodes: [],
        parents: {},
        states: {},
        probabilities: {},
        temporalPolicy: {},
        temporalPolicyConfirmed: false,
        canStartComputation: false,
        collegatoAlDB: false,
        selectedDB: 'DB1',
        database: 'DB1',
        databaseSelected: 'DB1',
        flushesAssociations: {},
        monitoring: false,
        tresholdLinked: {},
        tresholds: {},
      };
    }
  }
}

module.exports = ConnectServer;
