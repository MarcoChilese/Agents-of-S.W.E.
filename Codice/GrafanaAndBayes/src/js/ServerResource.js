
export default class ServerResource {
  constructor(host, port) {
    this.host = host;
    this.port = port;
  }

  /**
   *  Function testing if server  is alive
   * @returns boolean: true if server is alive, else false
   */
  async alive() { }

  /**
   * Function return a list of all networks if this.query value is '/networks'
   * else this.port value is '/getnetwork/:name' return a json of network passing
   * @returns json : networks or one network selected
   */
  async networks() { }

  /**
   * This function upload a network
   * @param net
   * @returns return true if operation is done else false
   */
  async uploadnetwork(net) { }

  /**
   * This function delete a network
   * @param net
   * @returns return true if operation is done else false
   */
  async deletenetwork(net) { }

  /**
   * Function to request calculated probabilities to server
   * @param{net} name of the net
   * @returns{json}
   */
  async getnetworkprob(net) { }

  async getnetwork(net) { }
}
module.exports = ServerResource;
