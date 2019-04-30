/*
 * File: hello_ctrl.js
 * Creation date: 2019-02-22
 * Author: Bogdan Stanciu
 * Type: JS6
 * Author e-mail: bogdan.stanciu@studenti.unipd.it
 * Version: 0.0.1
 *
 * Changelog:
 * 0.0.2 || Bogdan Stanciu || 2019-02-23 || Implementazione salvataggio/caricamento rete from LocalStorage
 * 0.0.1 || Bogdan Stanciu || 2019-02-22 || Creazione controller
 */
import { PanelCtrl } from 'grafana/app/plugins/sdk';
import _ from 'lodash';
import $ from 'jquery';
import jsbayesviz from 'better-jsbayes-viz';
import Parser from './js/parser';
import GetApiGrafana from './js/GetApiGrafana';
import ModalCreator from './ModalCreator';
import ConnectServer from './js/ConnectServer';

export class GBCtrl extends PanelCtrl {
  /** @ngInject * */
  constructor($scope, $injector, backendSrv) {
    super($scope, $injector);
    this.backendSrv = backendSrv;

    const panelDefaults = {
      visualizingMonitoring: false,
      actuallyVisualizingMonitoring: undefined,
      selectedDB: null,
      monitoring: false,
      loadingNet: false,
      name: '',
      nodes: {},
      states: {},
      database: undefined,
      tresholds: {},
      availableDatabases: {},
      collegatoAlDB: false,
      flussi: [],
      actualFlush: null,
      actualTable: undefined,
      flushesAssociations: {},
      tresholdLinked: {},
      db: undefined,
      temporalPolicy: {
        seconds: 0,
        minutes: 0,
        hours: 0,
      },
      temporalPolicyConfirmed: false,
      selectedNetworkToOpen: undefined,
      availableNetworksToLoad: undefined,
      monitoringNetworks: undefined,
      calculatedProbabilities: {},
    };

    this.server = {
      port: '8600',
      IP: '142.93.102.115',
      connected: false,
    };
    this.serverConnection = null;

    this.modalCreator = new ModalCreator(this);
    // needed to send data to server
    this.databaseSelected = undefined;

    _.defaults(this.panel, panelDefaults);

    // connects to grafana
    this.getDatabases().then();
    this.events.on('init-edit-mode', this.onInitEditMode.bind(this));
    this.resetData();
  }

  /**
	 * onInitEditMode: initializes tabs
	 */
  onInitEditMode() {
    this.addEditorTab('Server Settings', `/public/plugins/${this.pluginId}/partials/ServerTab.html`, 2);
    return true;
  }

  /**
	 * Method used to set all data to start values.
	 * @return{boolean} true
	 * */
  resetData() {
    this.panel.canStartComputation = false;
    this.panel.flushesAssociations = {};
    this.panel.monitoring = false;
    this.panel.name = '';
    this.panel.nodes = [];
    this.panel.parents = {};
    this.panel.states = {};
    this.panel.probabilities = {};
    this.panel.temporalPolicy = {
      seconds: 0,
      minutes: 0,
      hours: 0,
    };
    this.panel.temporalPolicyConfirmed = false;
    this.panel.collegatoAlDB = false;
    this.databaseSelected = null;
    this.panel.selectedDB = null;
    this.db = undefined;
    return true;
  }

  /**
	* Resets all tresholds
 	* Prepare tresholds json to store new tresholds
	* */
  resetTresholds() {
    this.panel.tresholds = {};
    this.panel.tresholdLinked = {};
    for (const n in this.panel.nodes) {
      this.panel.tresholds[this.panel.nodes[n]] = [];
      this.panel.tresholdLinked[this.panel.nodes[n]] = false;
    }
  }

  /**
	* Check if user has defined at least 1 treshold
	 * @return{boolean} if positive
	* */
  checkIfAtLeastOneTresholdDefined() {
    for (const el in this.panel.nodes) {
      if (this.panel.tresholdLinked[this.panel.nodes[el]] === true) { return true; }
    }
    return false;
  }

  /**
	 * Method invoked when the users want to delete a node's link to a flush.
	 * @param{string} node's name.
   * @return{boolean}
	 * */
  deleteLinkToFlush(node) {
    if (this.panel.monitoring === true) {
      this.modalCreator.showMessageModal('Impossibile scollegare nodi durante il monitoraggio.');
      return false;
    }
    // re-add flush to available and order the array
    this.panel.flussi[this.panel.flushesAssociations[node].table].push(this.panel.flushesAssociations[node].flush);
    this.panel.flussi[this.panel.flushesAssociations[node].table].sort();
    // delete the connection
    delete this.panel.flushesAssociations[node];
    this.panel.tresholdLinked[node] = false;
    this.panel.tresholds[node] = [];
    return true;
  }

  /**
	 * Function needed when loading a new network.
	 * For each  flush actually linked, re-add it to selectable flushes
	 * */
  freeAllFlushes() {
    for (const flush in this.panel.flushesAssociations) {
      if (!this.panel.flussi[this.panel.flushesAssociations[flush].table].includes(this.panel.flushesAssociations[flush].flush)) {
        this.panel.flussi[this.panel.flushesAssociations[flush].table].push(this.panel.flushesAssociations[flush].flush);
        this.panel.flussi[this.panel.flushesAssociations[flush].table].sort();
      }
    }
  }

  /**
	 * Method used to get available databases.
	 * After, calls the getSource method which retrieves available databases.
	 * */
  async getDatabases() {
    const gr = new GetApiGrafana(this.backendSrv);
    // request list of databases
    this.panel.availableDatabases = await gr.getData();
  }

  /**
   * Instantiate proxy to db
   * @return{Boolean} true
   * */
  getConnectionToDb() {
    const db = this.panel.availableDatabases[this.panel.selectedDB];
    if (db === undefined) throw new Error('Error');
    this.panel.database = db;
    const s = db.url.split(':');
    s[1] = s[1].substring(2, s[1].length);
    this.db = new GetApiGrafana(this.backendSrv, db);
    return true;
  }

  /**
   * Method that checks if persists conditions to not connect to a database
   * @return{boolean} true if no condition persist
   * @throws{error} if monitoring
   * @throws{error} if not selected a db
   * @throws{error} if selected a not influxdb
   * */
  checkIfConnectableToDB() {
    if (this.panel.monitoring === true) {
      throw new Error('Impossibile cambiare database mentre è sotto monitoraggio.');
    }
    // check if selected a db and it's a influxdb DB
    if (this.panel.selectedDB === null) {
      throw new Error('Nessun database selezionato.');
    }
    if (this.panel.availableDatabases[this.panel.selectedDB].type !== 'influxdb') {
      throw new Error('Non è possibile utilizzare database non influx.');
    }
    return true;
  }

  /**
   * Method used to retrieve available databases' data flushes.
   * stores in locale variable panel.flussi databases flushes.
   * @return{boolean} true if all went ok
   * */
  async getFlushes() {
    let ds;
    try {
      // call database to obtain all available flushes and tables
      ds = await this.db.getDatasources();
      this.panel.flussi = ds;
      // if not loading a network resets tresholds because only one database is usable by a network
      if (this.panel.collegatoAlDB === true && !this.panel.loadingNet) { this.resetTresholds(); }

      // set connection to true
      this.databaseSelected = this.panel.selectedDB;
      this.panel.collegatoAlDB = true;
      return true;
    } catch (e) {
      this.panel.collegatoAlDB = false;
      return false;
    }
  }

  /**
	 * Method used to connect to database.
	 * Calls methods getConnectionToDB and getFlushes to retrieve available flushes.
   * @return{boolean}
	 * */
  async connectToDB() {
    try {
      this.checkIfConnectableToDB();
      // connects to db
      this.getConnectionToDb();
      // delete all existing tresholds
      this.resetTresholds();
      // get all available flushes
      if (await this.getFlushes()) {
        this.modalCreator.showMessageModal('Database collegato correttamente.', 'Successo');
      } else {
        throw new Error('Impossibile connettersi al database.');
      }
      return true;
    } catch (e) {
      this.modalCreator.showMessageModal(e, 'Errore');
      return false;
    }
  }

  /**
	 * Spawns modal to set tresholds for a node.
	 * @param{string} name of the node to show tresholds
   * @return{boolean} true
	 * */
  showTresholdModal(node) {
  	this.modalCreator.showTresholdModal(node);
  	return true;
  }

  /**
   * Spawns modal to set temporal politic
   * @return{boolean} true
   * */
  selectTemporalPolicy() {
  	this.modalCreator.selectTemporalPolicy();
  	return true;
  }

  /**
   * Method to change visualization in the panel. Switches from settings to visualize monitoring
   * */
  visualizeMonitoring() {
    this.panel.visualizingMonitoring = true;
  }

  /**
   * Method to change visualization in the panel. Switches from visualize monitoring to settings
   * */
  visualizeSettings() {
    this.panel.visualizingMonitoring = false;
  }

  /**
   * Checks in all networks which is monitoring data.
   * @return{array} all monitoring networks.
   * */
  splitMonitoringNetworks() {
    const res = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const net in this.panel.availableNetworksToLoad) {
      // eslint-disable-next-line max-len
      if (this.panel.availableNetworksToLoad[net].monitoring) { res.push(this.panel.availableNetworksToLoad[net].name); }
    }
    return res;
  }

  /**
   * Function use a method of ConnectServer class that return all net from server
   * @return{boolean} true
   */
  async requestNetworks() {
    try {
      // ask server all networks
      this.panel.availableNetworksToLoad = await this.testServer.networks();
      // check which network is monitoring
      this.panel.monitoringNetworks = this.splitMonitoringNetworks();
      return true;
    } catch (e) {
      this.modalCreator.showMessageModal('Impossibile collegarsi al server per aggiornare la lista delle reti salvate.', 'Errore');
      return false;
    }
  }

  /**
   * Test if server is alive using a ConnectServer function
   * @return{boolean}
   */
  async tryConnectServer() {
    try {
      // connects to server
      this.testServer = new ConnectServer(this.server.IP, this.server.port);
      this.server.connected = await this.testServer.alive() !== undefined;
      // check if correctly connected
      // if (this.server.connected) {
      // ask server list of all stored networks
      await this.requestNetworks();
      this.modalCreator.showMessageModal('Connesso al server.', 'Successo');
      // }
    } catch (e) {
      this.modalCreator.showMessageModal('Il server non è online su questa porta. Prova a cambiare porta e/o IP.', 'Errore');
      this.server.connected = false;
      return false;
    }
    return true;
  }

  /**
   * Function that check if is possible to delete a specific network
   * @param {string} net to delete
   * @var{boolean} : true if is deletable
   */

  checkIfNetworkIsDeletable(net) {
    if (net === undefined) {
      this.modalCreator.showMessageModal('Selezionare una rete da eliminare.', 'Errore');
      return false;
    }
    if (this.panel.monitoringNetworks.includes(net)) {
      this.modalCreator.showMessageModal('Impossibile eliminare una rete durante il monitoraggio.', 'Errore');
      return false;
    }
    return true;
  }

  /**
   * Function delete a net into server by name
   * @param {string} net to delete
   * @return{Boolean} : if x is true, the network has been successfully deleted else false
   */
  async requestNetworkDelete(net) {
    try {
      if (!this.checkIfNetworkIsDeletable(net)) { return false; }
      await this.testServer.deletenetwork(net);
    } catch (e) {
      if (e.status === 200) {
        await this.requestNetworks();
        this.modalCreator.showMessageModal('Rete eliminata correttamente.', 'Successo');
      } else {
        this.modalCreator.showMessageModal('Impossibile eliminare la rete. Controllare la connessione al server.', 'Errore');
        return false;
      }
    }
    return true;
  }

  /**
   * @param{temporalPolicy}
   * @return{int} temporal politic in seconds
   * */
  calculateSeconds(temp) {
    return temp.seconds + temp.minutes * 60 + temp.hours * 3600;
  }

  /**
   * Method that updates local calculated probabilities
   * @param{string} network to update probabilities
   * @return{boolean}
   * */
  async updateProbs() {
    try {
      const g = jsbayesviz.fromGraph(await this.testServer.getnetworkprob(this.panel.actuallyVisualizingMonitoring), 'netImage');
      $('#netImage').empty();
      jsbayesviz.draw({
        id: '#netImage',
        width: 3000,
        height: 2000,
        graph: g,
        samples: 15000,
      });
      $('svg').css('background', 'floralwhite');
      this.$timeout({}, 100);
    } catch (e) {
      clearInterval(this.interval);
      return false;
    }
    return true;
  }

  /**
   * Method that sets up to change monitored probabilities
   * @param{string} name of the network
   * @return{boolean}
   * */
  async changeNetworkToVisualizeMonitoring() {
    try {
      clearInterval(this.interval);
      this.panel.calculatedProbabilities = {};
      const n = await this.testServer.getnetwork(this.panel.actuallyVisualizingMonitoring);
      await this.updateProbs();
      this.interval = setInterval(this.updateProbs.bind(this), this.calculateSeconds(n.temporalPolicy) * 1000);
      this.modalCreator.showMessageModal('Aggiornata visualizzazione.', 'Successo');
    } catch (e) {
      this.modalCreator.showMessageModal('Impossibile ottenere le probabilità dal server.', 'Errore');
      return false;
    }
    return true;
  }

  /**
   * Method called when need to send data to server
   * @return{array} packet containing all data needed to server
   * */
  buildDataToSend() {
    const dataToSend = {};
    dataToSend.canStartComputation = this.panel.canStartComputation;
    dataToSend.collegatoAlDB = this.panel.collegatoAlDB;
    dataToSend.database = this.panel.database;
    dataToSend.databaseSelected = this.panel.databaseSelected;
    dataToSend.flushesAssociations = this.panel.flushesAssociations;
    dataToSend.monitoring = this.panel.monitoring;
    dataToSend.name = this.panel.name;
    dataToSend.nodes = this.panel.nodes;
    dataToSend.parents = this.panel.parents;
    dataToSend.states = this.panel.states;
    dataToSend.probabilities = this.panel.probabilities;
    dataToSend.temporalPolicy = this.panel.temporalPolicy;
    dataToSend.temporalPolicyConfirmed = this.panel.temporalPolicyConfirmed;
    dataToSend.tresholdLinked = this.panel.tresholdLinked;
    dataToSend.tresholds = this.panel.tresholds;
    dataToSend.selectedDB = this.panel.selectedDB;
    return dataToSend;
  }

  /**
   * Method used to send a network to server
   * @param{string} name of the network.
   * */
  async loadNetworkToServer(net) {
    // send network to server to store it
    try {
      await this.testServer.uploadnetwork(JSON.stringify(net));
    } catch (e) {
      if (e.status === 200) {
        // refresh list of networks
        await this.requestNetworks();
        this.modalCreator.showMessageModal('Rete caricata con successo.', 'Successo');
      } else { return false; }
    }
    return true;
  }

  /**
   * Method invoked when needed to see if  it's needed to save changes
   * @return{boolean} false if can't connect to server to save network
   * */
  async saveActualChanges() {
    if (this.panel.name !== '' && this.panel.collegatoAlDB === true) {
      const dataToSend = this.buildDataToSend();
      dataToSend.monitoring = this.panel.monitoring === true;
      if (await this.loadNetworkToServer(dataToSend) === false) {
        return false;
      }
    }
    return true;
  }


  /**
   * Method used to load information from a network saved
   * Stores in local variables all data.
   * @param{json} all data from server
   * @return{boolean} true if ok
   * */
  async loadNetworkFromSaved(net) {
    this.panel.loadingNet = true;
    this.panel.name = net.name;
    this.panel.nodes = net.nodes;
    this.panel.parents = net.parents;
    this.panel.states = net.states;
    this.panel.probabilities = net.probabilities;
    this.panel.temporalPolicy = net.temporalPolicy;
    this.panel.temporalPolicyConfirmed = net.temporalPolicyConfirmed;

    this.panel.canStartComputation = net.canStartComputation;
    this.panel.collegatoAlDB = net.collegatoAlDB;
    this.panel.selectedDB = net.selectedDB;
    this.panel.database = net.database;
    this.panel.databaseSelected = net.databaseSelected;

    // connect to right database
    this.getConnectionToDb();
    await this.getFlushes();

    this.panel.flushesAssociations = net.flushesAssociations;
    this.panel.monitoring = net.monitoring;
    this.panel.tresholdLinked = net.tresholdLinked;
    this.panel.tresholds = net.tresholds;
    // if no tresholds were defined, need to reset the data
    if (Object.keys(this.panel.tresholds).length === 0) this.resetTresholds();

    // removing used flushes from all
    for (const el in this.panel.flushesAssociations) {
      this.panel.flussi[this.panel.flushesAssociations[el].table].splice(
        this.panel.flussi[this.panel.flushesAssociations[el].table]
          .indexOf(this.panel.flushesAssociations[el].flush), 1,
      );
    }

    this.panel.loadingNet = false;
    this.modalCreator.showMessageModal('Rete caricata correttamente.', 'Successo');
    return true;
  }

  /**
	 * Function use a method of ConnectServer class that return the network by name
	 * @param{net} name of net selected from user
   * @return{boolean} true if ok
	 */
  // tested
  async requestNetworkToServer(net) {
    try {
      if (await this.saveActualChanges() === false) throw new Error('');
      // ask network to the server
      const n = await this.testServer.getnetwork(net);
      // load data from network
      this.resetData();
      this.resetTresholds();
      await this.loadNetworkFromSaved(n);
      return true;
    } catch (e) {
      this.modalCreator.showMessageModal('Impossibile caricare la rete selezionata.', 'Errore');
      return false;
    }
  }

  /**
	 * method called when it's needed to load a network from a JSON file.
	 * Stores data in local variables
	 * @param {string} .JSON string file
   * @return {boolean} true if ok
	 * */
  async loadNetwork(data) {
    try {
      // save changes
      if (!await this.saveActualChanges()) throw new Error('');
      if (this.panel.selectedDB !== null) {
        // reconnect to db
        this.getConnectionToDb();
        await this.getFlushes();
      }
      this.resetData();
      // call parser to validate the network
      const parser = new Parser(data);
      parser.validateNet();
      // assign parameters got from network
      this.panel.name = data.name;
      this.panel.nodes = data.nodes;
      this.panel.states = data.states;
      this.panel.parents = data.parents;
      this.panel.probabilities = data.probabilities;

      this.modalCreator.showMessageModal('Rete caricata con successo.', 'Successo');
      // delete all tresholds and prepare to store new ones
      this.resetTresholds();
      return true;
    } catch (e) {
      this.modalCreator.showMessageModal(e.message, 'Errore');
      return false;
    }
  }

  /**
   * Method used to get panel's path
   * @return{string} the path
   * */
  get panelPath() {
    if (this._panelPath === undefined) {
      this._panelPath = `/public/plugins/${this.pluginId}/`;
    }
    return this._panelPath;
  }

  /**
   * Method used to see if computation can start
   * Spawns modal error if something persists
   * @return{boolean} true if can start
   * */
  checkIfCanStartComputation() {
    // check if connected to a DB and defined at least one treshold and confirmed temporal politic
    try {
      if (this.panel.selectedDB === null || this.panel.collegatoAlDB === false) { throw new Error('Nessun database collegato.'); }
      if (this.checkIfAtLeastOneTresholdDefined() === false) { throw new Error('Nessuna soglia impostata. Per iniziare il monitoraggio è necessario collegare almeno un nodo definendone almeno una soglia.'); }
      if (this.panel.temporalPolicyConfirmed === false) { throw new Error('E\' necessario impostare la politica temporale per iniziare il monitoarggio.'); }
    } catch (e) {
      this.modalCreator.showMessageModal(e, 'Errore');
      return false;
    }
    return true;
  }

  /**
   * Method used to check if the network is in right conditions to start computation.
   * It checks if user defined at least 1 treshold, user linked a database and confirmed temporal politic.
   * Builds data to send to server
   * @return{boolean} true if all went ok
   * */
  async startComputation() {
    if (!this.checkIfCanStartComputation()) return false;
    try {
      this.panel.monitoring = true;
      // build data to send to server
      const dataToSend = this.buildDataToSend();
      if (!await this.loadNetworkToServer(dataToSend)) throw new Error('');
      await this.requestNetworks();
      this.modalCreator.showMessageModal('Monitoraggio iniziato correttamente.', 'Successo');
    } catch (e) {
      this.modalCreator.showMessageModal('Impossibile iniziare il monitoraggio.', 'Errore');
      this.panel.monitoring = false;
      return false;
    }
    return true;
  }


  /** *
   * Method used to close computation.
   * @return{boolean} true if computation ends correctly
   */
  async closeComputation() {
    this.panel.monitoring = false;
    const dataToSend = this.buildDataToSend();
    // send to server
    try {
      if (!await this.loadNetworkToServer(dataToSend)) throw new Error('');
      await this.requestNetworks();
    } catch (e) {
      this.modalCreator.showMessageModal('Errore nell\'interruzione del monitoraggio. Controllare la connessione al server.', 'Errore');
      this.panel.monitoring = true;
      return false;
    }
    this.modalCreator.showMessageModal('Monitoraggio interrotto correttamente.', 'Successo');
    return true;
  }
}

GBCtrl.scrollable = true;
GBCtrl.templateUrl = 'partials/index.html';
