/*
 * File: ConnectServer.js
 * Creation date: 2019-03-28
 * Author: Favaro Marco
 * Type: JS6
 * Author e-mail: marco.favaro.8@studenti.unipd.it
 * Version: 0.0.1
 *
 */

import $ from 'jquery';

export default class ConnectServer {
  constructor(host, port) {
    this.host = host;
    this.port = port;
  }

  /**
   *  Function testing if server  is alive
   * @returns{boolean} true if server is alive, else false
   */
  async alive() {
    return $.ajax({
      url: `http://${this.host}:${this.port}/alive`,
      type: 'GET',
      cache: false,
      crossDomain: true,
      contentType: 'application/json; charset=utf-8',
      headers: { 'Access-Control-Allow-Origin': '*' },
    });
  }

  /**
   * Function return a list of all networks if this.query value is '/networks'
   * else this.port value is '/getnetwork/:name' return a json of network passing
   * @returns{json} networks or one network selected
   */
  async networks() {
    return $.ajax({
      url: `http://${this.host}:${this.port}/networks`,
      type: 'GET',
      crossDomain: true,
      cache: false,
      contentType: 'application/json; charset=utf-8',
      headers: { 'Access-Control-Allow-Origin': '*' },
    });
  }

  /**
   * This function upload a network
   * @param{json} network to save
   * @returns{boolean} true if operation is done else false
   */
  async uploadnetwork(net) {
    return $.ajax({
      url: `http://${this.host}:${this.port}/uploadnetwork`,
      type: 'POST',
      data: net,
      dataType: 'json',
      cache: false,
      contentType: 'application/json; charset=utf-8',
      crossDomain: true,
      headers: { 'Access-Control-Allow-Origin': '*' },
    });
  }

  /**
   * This function delete a network
   * @param{string} network to delete
   * @returns{boolean} true if operation is done else false
   */
  async deletenetwork(net) {
    return $.ajax({
      url: `http://${this.host}:${this.port}/deletenetwork/${net}`,
      type: 'GET',
      data: net,
      cache: false,
      dataType: 'json',
      contentType: 'application/json; charset=utf-8',
      crossDomain: true,
      headers: { 'Access-Control-Allow-Origin': '*' },
    });
  }

  /**
   * Function to request calculated probabilities to server
   * @param{string} name of the net
   * @returns{json} probabilities
   */
  async getnetworkprob(net) {
    return $.ajax({
      url: `http://${this.host}:${this.port}/getnetworkprob/${net}`,
      type: 'GET',
      data: net,
      cache: false,
      dataType: 'json',
      contentType: 'application/json; charset=utf-8',
      crossDomain: true,
      headers: { 'Access-Control-Allow-Origin': '*' },
    });
  }

  /**
   * get a network from server
   * @param{string} network's name
   * @return{json} the network
   * */
  async getnetwork(net) {
    return $.ajax({
      url: `http://${this.host}:${this.port}/getnetwork/${net}`,
      type: 'GET',
      dataType: 'json',
      cache: false,
      contentType: 'application/json; charset=utf-8',
      crossDomain: true,
      headers: { 'Access-Control-Allow-Origin': '*' },
    });
  }
}

module.exports = ConnectServer;
