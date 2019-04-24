

import { appEvents } from 'grafana/app/core/core';


class ModalCreator {
  constructor(t) {
    this.t = t;
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
  }

  /**
	 * Spawns modal to set tresholds for a node.
	 * @param{string} name of the node to show tresholds
	 * */
  showTresholdModal(node) {
    if (this.t.panel.monitoring === true) {
      this.showMessageModal('Impossibile cambiare i dati mentre è sotto monitoraggio.', 'Errore');
      return;
    }

    if (this.t.panel.collegatoAlDB !== true) {
      this.showMessageModal('Impossibile cambiare soglie senza aver selezionato un database.', 'Errore');
      return;
    }
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
  }

  checkMonitoring(){
    if (this.t.panel.monitoring === true) {
      this.showMessageModal('Impossibile cambiare i dati mentre è sotto monitoraggio.', 'Errore');
      return true;
    }
    else {
      return false;
    }
  }

  checkDB(){
    if (this.t.panel.collegatoAlDB !== true) {
      this.showMessageModal('Impossibile impostare politica temporale aver selezionato un database.', 'Errore');
      return true;
    }
    else{
      return false;
    }
  }

  /**
	 * Spawns modal to set temporal policy
	 * */
  selectTemporalPolicy() {
    if (this.checkMonitoring() === true){
      return;
    }

    if (this.checkDB() === true){
      return;
    }

    const modalScope = this.t.$scope.$new(true);

    modalScope.panel = this.t.panel;
    modalScope.modalCreator = this.t.modalCreator;
    modalScope.pluginId = this.t.pluginId;

    appEvents.emit('show-modal', {
      src: `/public/plugins/${this.t.pluginId}/partials/TemporalPolicyModal.html`,
      modalClass: 'confirm-modal',
      scope: modalScope,
    });
  }
}

module.exports = ModalCreator;
