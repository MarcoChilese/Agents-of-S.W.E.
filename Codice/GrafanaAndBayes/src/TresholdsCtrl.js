/*
 * File: TresholdsCtrl.js
 * Creation date: 2019-03-25
 * Author: Diego Mazzalovo
 * Type: ES6
 * Author e-mail: diego.mazzalovo@studenti.unipd.it
 * Version: 0.0.1
 *
 * Changelog:
 * 0.0.1 || Diego Mazzalovo || 2019-03-25 || Creazione Controller
 */

import { coreModule } from 'grafana/app/core/core';

export class TresholdsCtrl {
  constructor() {
    this.panel = [];
    this.actualNode = undefined;
  }

  /**
   * Method that checks if user defined at least one treshold
   * @return{boolean} true if so
   * */
  checkIfTherIsAtLeastOneTreshold(node) {
    if (this.panel.actualTable === undefined) {
      this.modalCreator.showMessageModal('E\' necessario selezionare una tabella per poter confermare le soglie.', 'Errore');
      return false;
    }
    if (this.panel.actualFlush === null) {
      this.modalCreator.showMessageModal('E\' necessario selezionare un flusso per poter confermare le soglie.', 'Errore');
      return false;
    }
    if (this.panel.tresholds[node].length === 0) {
      this.modalCreator.showMessageModal('E\' necessario impostare almeno una soglia.', 'Errore');
      return false;
    }
    return true;
  }

  /**
   * Checks if there are repeated tresholds
   * @param[string} node's name
   * @return{boolean} false if there are
   * */
  checkNotRepeatedTresholds(node) {
    // check if defining multiple time same treshold
    for (let el = 1; el < this.panel.tresholds[node].length; el++) {
      if (this.panel.tresholds[node][el].value === this.panel.tresholds[node][el - 1].value
        && this.panel.tresholds[node][el].sign === this.panel.tresholds[node][el - 1].sign) {
        this.panel.canStartComputation = false;
        this.modalCreator.showMessageModal('Non è possibile impostare 2 volte la stessa soglia.', 'Errore');
        return false;
      }
    }
    return true;
  }

  /**
   * Checks each treshold's sign and put it in right array
   * @param{string} node's name
   * @return{JSON} structure with split based on tresholds' sign
   * */
  splitForSign(node) {
    const min = [];
    const maj = [];
    const mine = [];
    const maje = [];

    // split tresholds based on sign
    for (const el in this.panel.tresholds[node]) {
      if (this.panel.tresholds[node][el].sign === '>=') {
        maje.push(this.panel.tresholds[node][el]);
      } else if (this.panel.tresholds[node][el].sign === '>') {
        maj.push(this.panel.tresholds[node][el]);
      } else if (this.panel.tresholds[node][el].sign === '<') {
        min.push(this.panel.tresholds[node][el]);
      } else {
        mine.push(this.panel.tresholds[node][el]);
      }
    }
    return {
      mi: min,
      ma: maj,
      mie: mine,
      mae: maje,
    };
  }

  /**
   * Set canStartComputation to false and spawns an error
   * @param{integer} first value
   * @param{integer} second value
   * @param{string} first sign
   * @param{string} second sign
   * */
  setError(value1, value2, sign1, sign2) {
    this.panel.canStartComputation = false;
    this.modalCreator.showMessageModal(`Non è possibile dichiarare entrambe le soglie : ${sign1} ${value1} e ${sign2} ${value2}.`, 'Errore');
  }


  /**
   * Checks if minor tresholds conflicts with majors
   * @param{Array} minor values
   * @param{Array} major values
   * @param{Array} major or equal valuea
   * @return{boolean} true if ok, false if conflicts are detected
   * */
  checkConflictMin(min, maj, maje) {
    for (const mi in min) {
      for (const ma in maj) if (min[mi].value > maj[ma].value) { this.setError(min[mi].value, maj[ma].value, '<', '>'); return false; }
      for (const ma in maje) if (min[mi].value > maje[ma].value) { this.setError(min[mi].value, maje[ma].value, '<', '>='); return false; }
    }
    return true;
  }

  /**
   * Checks if minor or equals tresholds conflicts with majors
   * @param{Array} minor or equals values
   * @param{Array} major values
   * @param{Array} major or equal valuea
   * @return{boolean} true if ok, false if conflicts are detected
   * */
  checkConflictMine(mine, maj, maje) {
    for (const mi in mine) {
      for (const ma in maj) if (mine[mi].value > maj[ma].value) { this.setError(mine[mi].value, maj[ma].value, '<=', '>'); return false; }
      for (const ma in maje) if (mine[mi].value > maje[ma].value) { this.setError(mine[mi].value, maje[ma].value, '<=', '>='); return false; }
    }
    return true;
  }

  /**
   * Checks if there are equal values in different arrays
   * @param{Array} first array values
   * @param{Array} second array values
   * @param{string} first sign
   * @param{string} second sign
   * @return{boolean} true if ok, false if conflicts are detected
   * */
  checkConflictSameSign(arr1, arr2, sign1, sign2) {
    for (const e1 in arr1) {
      for (const e2 in arr2) if (arr1[e1].value === arr2[e2].value) {
        this.setError(arr1[e1].value, arr2[e2].value, sign1, sign2);
        return false;
      }
    }
    return true;
  }

  /**
   * Checks if there are conflicts in tresholds
   * @param{JSON} data with arrays
   * @return{boolean} true if there aren't conflicts
   * */
  checkConflicts(data) {
    const min = data.mi;
    const mine = data.mie;
    const maj = data.ma;
    const maje = data.mae;
    if (!this.checkConflictMin(min, maj, maje)) return false;
    if (!this.checkConflictMine(mine, maj, maje)) return false;
    if (!this.checkConflictSameSign(min, mine, '<', '<=')) return false;
    if (!this.checkConflictSameSign(maj, maje, '>', '>=')) return false;
    if (!this.checkConflictSameSign(maje, mine, '>=', '<=')) return false;
    return true;
  }

  /**
   * Method that creates the association between node and flush
   * @param{string} node's name
   * */
  associate(node) {
    // if already linked to a flush add the flush to available flushes again
    if (this.panel.flushesAssociations[node] !== undefined) {
      this.panel.flussi[this.panel.flushesAssociations[node].table].push(this.panel.flushesAssociations[node].flush);
    }
    this.panel.flushesAssociations[node] = {
      table: this.panel.actualTable,
      flush: this.panel.actualFlush,
    };
    // remove linked flush to possible flush selection
    this.panel.flussi[this.panel.actualTable].splice(this.panel.flussi[this.panel.actualTable].indexOf(this.panel.actualFlush), 1);
    this.setLinked(node);
  }

  /**
	 * 	Method used when an user confirm tresholds for a node.
	 * 	It check for the right definition of the tresholds.
	 * 	Then, assign to locale variables tresholds and the link between node and data flush.
	 * 	@param {string} name of the node
	 * 	@return {boolean} true if all tresholds are correctly defined, otherwise false.
	 * */
  confirmTresholdsChanges(node) {
    // order tresholds based on value
    this.panel.tresholds[node].sort((a, b) => a.value - b.value);

    if (!this.checkIfTherIsAtLeastOneTreshold(node)) return false;
    if (!this.checkNotRepeatedTresholds(node)) return false;
    if (!this.checkConflicts(this.splitForSign(node))) return false;
    this.associate(node);

    // computation can start because at least one treshold is defined
    this.panel.canStartComputation = true;
    this.modalCreator.showMessageModal('Soglie settate correttamente.', 'Successo');
    return true;
  }


  /**
	 * Adds a node's treshold to lacale variable.
	 * @param{string} node's name.
	 * @param{state} node's state-
	 * */
  addTreshold(node, state) {
    this.panel.tresholds[node].push(
      {
        state,
        sign: '>=',
        value: 0,
        critical: false,
        name: this.panel.tresholds[node].length,
      },
    );
  }

  /**
	 * Deletes a treshold from node
	 * @return{boolean} true if all ok
	 * */
  deleteTreshold(node, name) {
    for (const tresh in this.panel.tresholds[node]) {
      // check which treshold is the one to delete
      if (this.panel.tresholds[node][tresh].name === name) {
        this.panel.tresholds[node].splice(tresh, 1);
        return true;
      }
    }
    return false;
  }

  /**
   * Sets to not linked the node and re-add the flush to available
   * @param{string} node's name.
   * */
  setNotLinked(node) {
    this.panel.tresholdLinked[node] = false;
    if (this.panel.flushesAssociations[node] !== undefined) {
      this.panel.flussi[this.panel.flushesAssociations[node].table].push(this.panel.flushesAssociations[node].flush);
      // order flushes
      this.panel.flussi[this.panel.flushesAssociations[node].table].sort();
    }
    delete this.panel.flushesAssociations[node];
  }

  /**
   * Sets to linked the node
   * @param{string} node's name.
   * */
  setLinked(node) {
    this.panel.tresholdLinked[node] = true;
  }

  /**
   * @return{Array} table's names.
   * */
  tablesName() {
    const ris = [];
    for (const el in this.panel.flussi) { ris.push(el); }
    return ris;
  }
}
coreModule.controller('TresholdsCtrl', TresholdsCtrl);
module.exports = TresholdsCtrl;
