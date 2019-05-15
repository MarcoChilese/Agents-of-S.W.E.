/*
 * File: TresholdsCtrl.test.js
 * Creation date: 2019-04-23
 * Author: Marco Favaro
 * Type: ES6
 * Author e-mail: marco.favaro.8@studenti.unipd.it
 * Version: 0.0.1
 *
 * Changelog:
 * 0.0.1 || Marco Favaro || 2019-04-23 || Prima stesura
 */

import { coreModule } from 'grafana/app/core/core';
import TresholdCtrl from '../src/TresholdsCtrl';
import ModalCreator from '../src/ModalCreator';

jest.mock('../src/ModalCreator');

/**
 * Funzione utile a settare una soglia a proprio piacimento per eseguire test
 * @param tresh
 * @param node
 * @param state
 * @param sig
 * @param val
 */
function setTreshold(tresh, node, state, sig, val) {
  tresh.panel.tresholds.uno.push(
    {
      state,
      sign: sig,
      value: val,
      critical: false,
      name: tresh.panel.tresholds[node].length,
    },
  );
}

describe('TresholdsCtrl::confirmTresholdsChanges', () => {
  const tresh = new TresholdCtrl();
  beforeEach(() => {
    tresh.panel.nodes = ['uno', 'due', 'tre'];
    tresh.panel.flussi = { Tabella1: ['Flusso', 'Flusso1', 'Flusso2'], Tabella2: ['f1', 'f2', 'f3'] };
    tresh.panel.tresholds = { uno: [] };
    tresh.modalCreator = new ModalCreator();
    tresh.panel.actualTable = undefined;
    tresh.panel.actualFlush = null;
    tresh.panel.flushesAssociations = {};
  });

  /**
   * Check se è selezionata una tabella
   */
  it('TresholdsCtrl::checkIfTherIsAtLeastOneTreshold::CheckTableSelect::false', () => {
    tresh.panel.actualTable = undefined;
    expect(tresh.checkIfTherIsAtLeastOneTreshold('uno')).toBe(false);
  });

  /**
   * Check se è selezionato un flusso
   */
  it('TresholdsCtrl::checkIfTherIsAtLeastOneTreshold::CheckFluxSelect::false', () => {
    tresh.panel.actualTable = 'Tabella1';
    tresh.panel.actualFlush = null;
    expect(tresh.checkIfTherIsAtLeastOneTreshold('uno')).toBe(false);
  });

  /**
   * Check se è settata nessuna soglia
   */
  it('TresholdsCtrl::checkIfTherIsAtLeastOneTreshold::CheckTresholdSelect::false', () => {
    tresh.panel.actualTable = 'Tabella1';
    tresh.panel.actualFlush = 'Flusso';
    expect(tresh.checkIfTherIsAtLeastOneTreshold('uno')).toBe(false);
  });

  /**
   * Check se ho settato due soglie uguali
   */
  it('TresholdsCtrl::checkNotRepeatedTresholds::CheckMultipleTresholdSelect::false', () => {
    tresh.panel.actualTable = 'Tabella1';
    tresh.panel.actualFlush = 'Flusso';
    setTreshold(tresh, 'uno', 's1', '<', 2);
    setTreshold(tresh, 'uno', 's1', '<', 2);

    expect(tresh.checkNotRepeatedTresholds('uno')).toBe(false);
  });

  /**
   * Check se sono settate soglie con valori contrastanti, in questo esempio s1 < 2 e s2 >= 1
   */
  it('TresholdsCtrl::confirmTresholdsChanges::CheckIncorrectTresholdSettings::false', () => {
    tresh.panel.actualTable = 'Tabella1';
    tresh.panel.actualFlush = 'Flusso';

    setTreshold(tresh, 'uno', 's1', '<', 2);
    setTreshold(tresh, 'uno', 's2', '>=', 1);

    expect(tresh.checkConflicts(tresh.splitForSign('uno'))).toBe(false);
  });

  /**
   * Check se sono settate soglie con valori contrastanti, in questo esempio s1 <= 2 e s2 >= 1
   */
  it('TresholdsCtrl::confirmTresholdsChanges::CheckIncorrectTresholdSettings::false', () => {
    tresh.panel.actualTable = 'Tabella1';
    tresh.panel.actualFlush = 'Flusso';

    setTreshold(tresh, 'uno', 's1', '<=', 2);
    setTreshold(tresh, 'uno', 's2', '>=', 1);

    expect(tresh.checkConflicts(tresh.splitForSign('uno'))).toBe(false);
  });

  /**
   * Check se sono settate soglie con valori contrastanti, in questo esempio s1 <= 2 e s2 > 1
   */
  it('TresholdsCtrl::confirmTresholdsChanges::CheckIncorrectTresholdSettings::false', () => {
    tresh.panel.actualTable = 'Tabella1';
    tresh.panel.actualFlush = 'Flusso';

    setTreshold(tresh, 'uno', 's1', '<=', 2);
    setTreshold(tresh, 'uno', 's2', '>', 1);

    expect(tresh.checkConflicts(tresh.splitForSign('uno'))).toBe(false);
  });

  /**
   * Check se sono settate soglie con valori contrastanti, in questo esempio s1 < 2 e s2 > 1
   */
  it('TresholdsCtrl::confirmTresholdsChanges::CheckIncorrectTresholdSettings::false', () => {
    tresh.panel.actualTable = 'Tabella1';
    tresh.panel.actualFlush = 'Flusso';

    setTreshold(tresh, 'uno', 's1', '<', 2);
    setTreshold(tresh, 'uno', 's2', '>', 1);

    expect(tresh.checkConflicts(tresh.splitForSign('uno'))).toBe(false);
  });

  /**
   * Check se la soglia viene settata con successo
   */
  it('TresholdsCtrl::confirmTresholdsChanges::CheckSetTreshold::true', () => {
    tresh.panel.actualTable = 'Tabella1';
    tresh.panel.actualFlush = 'Flusso';
    tresh.panel.flushesAssociations = {};
    tresh.panel.tresholdLinked = {};
    tresh.panel.canStartComputation = false;

    setTreshold(tresh, 'uno', 's1', '>=', 2);
    setTreshold(tresh, 'uno', 's1', '<', 1);
    setTreshold(tresh, 'uno', 's2', '>=', 5);
    setTreshold(tresh, 'uno', 's2', '<', 2);

    expect(tresh.confirmTresholdsChanges('uno')).toBe(true);
  });

  /**
   * delete treshold by node and index
   * per verificarlo basta eseguire un console.log delle treshold prima e dopo la chiamata della delete
   */

  it('TresholdsCtrl::confirmTresholdsChanges::CheckDeleteTreshold::true', () => {
    setTreshold(tresh, 'uno', 's1', '>=', 2);
    setTreshold(tresh, 'uno', 's1', '<', 1);
    expect(tresh.deleteTreshold('uno', tresh.panel.tresholds.uno['0'].name)).toBe(true);
  });


  /**
   * Taking branch else in function checkConflictMin
   * all < are minor than > and >=
   * */
  it('TresholdsCtrl::checkConflictMin::true', () => {
    setTreshold(tresh, 'uno', 's1', '>', 2);
    setTreshold(tresh, 'uno', 's1', '<', 1);
    const data = tresh.splitForSign('uno');
    expect(tresh.checkConflictMin(data.mi, data.ma, data.mae)).toBe(true);
  });

  /**
   * Taking branch else in function checkConflictMine
   * all <= are minor than > and >=
   * */
  it('TresholdsCtrl::checkConflictMine::true', () => {
    setTreshold(tresh, 'uno', 's1', '>', 2);
    setTreshold(tresh, 'uno', 's1', '>=', 3);
    setTreshold(tresh, 'uno', 's1', '<=', 1);
    const data = tresh.splitForSign('uno');
    expect(tresh.checkConflictMine(data.mie, data.ma, data.mae)).toBe(true);
  });


  /**
   * verify that if 2 tresholds have same value returns false
   * */
  it('TresholdsCtrl::checkConflictSameSign::false', () => {
    setTreshold(tresh, 'uno', 's1', '>=', 1);
    setTreshold(tresh, 'uno', 's1', '>=', 21);
    setTreshold(tresh, 'uno', 's1', '<=', 21);
    const data = tresh.splitForSign('uno');
    expect(tresh.checkConflictSameSign(data.mie, data.mae, '<=', '>=')).toBe(false);
  });


  /**
   * verify that if a < and a <= tresholds have same value return false
   * */
  it('TresholdsCtrl::checkConflicts::false', () => {
    setTreshold(tresh, 'uno', 's1', '<', 1);
    setTreshold(tresh, 'uno', 's1', '<=', 1);
    const data = tresh.splitForSign('uno');
    expect(tresh.checkConflicts(data)).toBe(false);
  });


  /**
   * verify that if a > and a >= tresholds have same value return false
   * */
  it('TresholdsCtrl::checkConflicts::false', () => {
    setTreshold(tresh, 'uno', 's1', '>', 1);
    setTreshold(tresh, 'uno', 's1', '>=', 1);
    const data = tresh.splitForSign('uno');
    expect(tresh.checkConflicts(data)).toBe(false);
  });

  /**
   * verify that if a <= and a >= tresholds have same value return false
   * */
  it('TresholdsCtrl::checkConflicts::false', () => {
    setTreshold(tresh, 'uno', 's1', '<=', 1);
    setTreshold(tresh, 'uno', 's1', '>=', 1);
    const data = tresh.splitForSign('uno');
    expect(tresh.checkConflicts(data)).toBe(false);
  });

  /**
   * verify that if a node is already linked to a flush, associate method re-adds the flush
   * previously linked to available
   * */
  it('TresholdsCtrl::associate::readd flush', () => {
    tresh.panel.actualTable = 'Tabella1';
    tresh.panel.actualFlush = 'Flusso';
    tresh.panel.flushesAssociations = {};
    tresh.panel.tresholdLinked = {};
    tresh.panel.canStartComputation = false;

    setTreshold(tresh, 'uno', 's1', '>=', 2);
    setTreshold(tresh, 'uno', 's1', '<', 1);
    setTreshold(tresh, 'uno', 's2', '>=', 5);
    setTreshold(tresh, 'uno', 's2', '<', 2);

    tresh.confirmTresholdsChanges('uno');
    tresh.panel.actualFlush = 'Flusso2';
    tresh.confirmTresholdsChanges('uno');
    expect(tresh.panel.flussi).toEqual({ Tabella1: ['Flusso1', 'Flusso'], Tabella2: ['f1', 'f2', 'f3'] });
  });

  /**
   * verify that if no tresholds are defined returns false
   * */
  it('TresholdsCtrl::confirmTresholdsChanges::false(no trehsolds)', () => {
    tresh.panel.actualTable = 'Tabella1';
    tresh.panel.actualFlush = 'Flusso';
    expect(tresh.confirmTresholdsChanges('uno')).toBe(false);
  });

  /**
   * verify that if there are repeated tresholds returns false
   * */
  it('TresholdsCtrl::confirmTresholdsChanges::false(tresholds repeated)', () => {
    tresh.panel.actualTable = 'Tabella1';
    tresh.panel.actualFlush = 'Flusso';
    setTreshold(tresh, 'uno', 's2', '<', 2);
    setTreshold(tresh, 'uno', 's2', '<', 2);
    expect(tresh.confirmTresholdsChanges('uno')).toBe(false);
  });

  /**
   * verify that if there are conflicts in tresholds returns false
   * */
  it('TresholdsCtrl::confirmTresholdsChanges::false(conflicts)', () => {
    tresh.panel.actualTable = 'Tabella1';
    tresh.panel.actualFlush = 'Flusso';
    setTreshold(tresh, 'uno', 's2', '<', 3);
    setTreshold(tresh, 'uno', 's2', '>', 2);
    expect(tresh.confirmTresholdsChanges('uno')).toBe(false);
  });

  /**
   * verify that deleteTreshold returns false if doesn't find the treshold to delete
   * */
  it('TresholdsCtrl::deleteTreshold::false(not found)', () => {
    tresh.panel.actualTable = 'Tabella1';
    tresh.panel.actualFlush = 'Flusso';
    setTreshold(tresh, 'uno', 's2', '>', 3);
    setTreshold(tresh, 'uno', 's2', '>', 2);
    expect(tresh.deleteTreshold('uno', 5)).toBe(false);
    expect(tresh.panel.tresholds.uno).toEqual(
      [{
        state: 's2', sign: '>', value: 3, critical: false, name: 0,
      },
      {
        state: 's2', sign: '>', value: 2, critical: false, name: 1,
      }],
    );
  });

  /**
  * verify that setNotLinked deletes the link
  * */
  it('TresholdsCtrl::setNotLinked', () => {
    tresh.panel.actualTable = 'Tabella1';
    tresh.panel.actualFlush = 'Flusso';
    setTreshold(tresh, 'uno', 's2', '>', 3);
    tresh.panel.flushesAssociations = {};
    tresh.panel.tresholdLinked = {};
    tresh.confirmTresholdsChanges('uno');
    tresh.setNotLinked('uno');
    expect(tresh.panel.tresholdLinked.uno).toBe(false);
    expect(tresh.panel.flussi).toEqual(
      { Tabella1: ['Flusso', 'Flusso1', 'Flusso2'], Tabella2: ['f1', 'f2', 'f3'] },
    );
    expect(tresh.panel.flushesAssociations.uno).toBe(undefined);
  });

  /**
   * verify that setNotLinked  doesn't re-add flush if node wasn't linked
   * */
  it('TresholdsCtrl::setNotLinked::doesn\'t re-add', () => {
    tresh.panel.flushesAssociations = {};
    tresh.panel.tresholdLinked = {};
    tresh.setNotLinked('uno');
    expect(tresh.panel.tresholdLinked.uno).toBe(false);
    expect(tresh.panel.flussi).toEqual(
      { Tabella1: ['Flusso', 'Flusso1', 'Flusso2'], Tabella2: ['f1', 'f2', 'f3'] },
    );
    expect(tresh.panel.flushesAssociations.uno).toBe(undefined);
  });

  /**
   * Verfify tablesName to return correct values
   * */
  it('TresholdsCtrl::tablesName', () => {
    expect(tresh.tablesName()).toEqual(
      ['Tabella1', 'Tabella2'],
    );
  });
});
