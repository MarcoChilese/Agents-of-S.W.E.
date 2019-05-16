/*
 * File: GetApiGrafana.test.js
 * Creation date: 2019-03-24
 * Author: Diego Mazzalovo
 * Type: ECMAScript 6
 * Author e-mail: diego.mazzalovo@studenti.unipd.it
 * Version: 0.0.1
 * Changelog:
 * 0.0.1 || Diego Mazzalovo || 2019-03-24 || Sviluppo file
 */

import { appEvents } from 'grafana/app/core/core';

class ModalCreator {
  constructor(t) {
    this.t = t;
  }

  /**
   * Checks if network is monitoring
   * @param{string} error message to show
   * @return{boolean} true if monitoring
   * */
  checkMonitoring(message) {
    if (this.t.panel.monitoring === true) {
      this.showMessageModal(message, 'Errore');
      return true;
    }
    return false;
  }

  /**
   * Checks if a database has been selected
   * @return{boolean} true if selected a dbs
   * */
  checkDB(message) {
    if (this.t.panel.collegatoAlDB !== true) {
      this.showMessageModal(message, 'Errore');
      return false;
    }
    return true;
  }

  /**
	 * Spawns modal to show messages
	 * */
  showMessageModal(message, title) {
    const modalScope = this.t.$scope.$new(true);

    modalScope.message = message;
    modalScope.title = title;

    appEvents.emit('show-modal', {
      src: `/public/plugins/${this.t.pluginId}/partials/MessageModal.html`,
      modalClass: 'confirm-modal',
      scope: modalScope,
    });
    return true;
  }

  /**
	 * Spawns modal to set tresholds for a node.
	 * @param{string} name of the node to show tresholds
   * @return{boolean} true if ok
	 * */
  showTresholdModal(node) {
    if (this.checkMonitoring('Impossibile cambiare i dati mentre la rete è sotto monitoraggio.')) { return false; }
    if (!this.checkDB('Impossibile cambiare soglie senza aver selezionato un database.')) { return false; }

    const modalScope = this.t.$scope.$new(true);
    modalScope.actualNode = node;
    modalScope.panel = this.t.panel;
    modalScope.modalCreator = this.t.modalCreator;
    modalScope.pluginId = this.t.pluginId;

    appEvents.emit('show-modal', {
      src: `/public/plugins/${this.t.pluginId}/partials/tresholdModal.html`,
      modalClass: 'confirm-modal',
      scope: modalScope,
    });
    return true;
  }

  /**
	 * Spawns modal to set temporal policy
	 * */
  selectTemporalPolicy() {
    if (this.checkMonitoring('Impossibile cambiare i dati mentre è sotto monitoraggio.')) { return false; }
    if (!this.checkDB('Impossibile impostare la politica temporale senza aver selezionato un database.')) { return false; }

    const modalScope = this.t.$scope.$new(true);
    modalScope.panel = this.t.panel;
    modalScope.modalCreator = this.t.modalCreator;
    modalScope.pluginId = this.t.pluginId;

    appEvents.emit('show-modal', {
      src: `/public/plugins/${this.t.pluginId}/partials/TemporalPolicyModal.html`,
      modalClass: 'confirm-modal',
      scope: modalScope,
    });
    return true;
  }
}

module.exports = ModalCreator;
