/*
 * File: TemporalPolicyCtrl.js
 * Creation date: 2019-03-26
 * Author: Diego Mazzalovo
 * Type: ES6
 * Author e-mail: diego.mazzalovo@studenti.unipd.it
 * Version: 0.0.1
 *
 * Changelog:
 * 0.0.1 || Diego Mazzalovo || 2019-03-26 || Creazione Controller
 */

import { coreModule } from 'grafana/app/core/core';

export class TemporalPolicyCtrl {
  constructor() {
    this.panel = {};
  }

  /**
   * Sets temporal politic not confirmed
   * */
  setConfirmationToFalse() {
    this.panel.temporalPolicyConfirmed = false;
  }

  /**
   * Check if data are correctly defined
   * @return{boolean} true if ok
   * */
  checkCorrectData() {
    if (this.panel.temporalPolicy.seconds < 0) {
      this.modalCreator.showMessageModal('Impossibile impostare secondi < 0.', 'Errore');
      return false;
    }
    if (this.panel.temporalPolicy.seconds > 59) {
      this.modalCreator.showMessageModal('Impossibile impostare secondi > 59.', 'Errore');
      return false;
    }
    if (this.panel.temporalPolicy.minutes < 0) {
      this.modalCreator.showMessageModal('Impossibile impostare minuti < 0.', 'Errore');
      return false;
    }
    if (this.panel.temporalPolicy.minutes > 59) {
      this.modalCreator.showMessageModal('Impossibile impostare minuti > 59.', 'Errore');
      return false;
    }
    if (this.panel.temporalPolicy.hours < 0) {
      this.modalCreator.showMessageModal('Impossibile impostare ore < 0.', 'Errore');
      return false;
    }
    return true;
  }

  /**
   * method used to confirm changes
   * @return{boolean} true if ok
   * */
  setConfirmationToTrue() {
    if (!this.checkCorrectData()) return false;
    this.panel.temporalPolicyConfirmed = true;
    this.modalCreator.showMessageModal('Politica temporale impostata correttamente.', 'Successo');
    return true;
  }
}
coreModule.controller('TemporalPolicyCtrl', TemporalPolicyCtrl);

TemporalPolicyCtrl.scrollable = true;
