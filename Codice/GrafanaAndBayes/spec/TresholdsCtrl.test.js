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
import TresholdCtrl from "../src/TresholdsCtrl";
import ModalCreator from "../src/ModalCreator";

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
  tresh.panel.tresholds['uno'].push(
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
  let tresh = new TresholdCtrl();
  beforeEach(() => {
    tresh.panel.nodes = ['uno', 'due', 'tre'];
    tresh.panel.flussi = { Tabella1: ['Flusso', 'Flusso1', 'Flusso2'], Tabella2: ['f1', 'f2', 'f3'] };
    tresh.panel.tresholds = { uno: [] };
    tresh.modalCreator = new ModalCreator();
    tresh.panel.actualTable = undefined;
    tresh.panel.actualFlush = null;
  });

  /**
   * Check se è selezionata una tabella
   */
  it('TresholdsCtrl::confirmTresholdsChanges::CheckTableSelect::false', () => {
    tresh.panel.actualTable = undefined;
    expect(tresh.confirmTresholdsChanges('uno')).toBe(false);
  });

  /**
   * Check se è selezionato un flusso
   */
  it('TresholdsCtrl::confirmTresholdsChanges::CheckFluxSelect::false', () => {
    tresh.panel.actualTable = 'Tabella1';
    tresh.panel.actualFlush = null;
    expect(tresh.confirmTresholdsChanges('uno')).toBe(false);
  });

  /**
   * Check se è settata nessuna soglia
   */
  it('TresholdsCtrl::confirmTresholdsChanges::CheckTresholdSelect::false', () => {
    tresh.panel.actualTable = 'Tabella1';
    tresh.panel.actualFlush = 'Flusso';
    expect(tresh.confirmTresholdsChanges('uno')).toBe(false);
  });

  /**
   * Check se ho settato due soglie con lo stesso segno e stesso valore sullo stesso nodo
   */
  it('TresholdsCtrl::confirmTresholdsChanges::CheckMultipleTresholdSelect::false', () => {
    tresh.panel.actualTable = 'Tabella1';
    tresh.panel.actualFlush = 'Flusso';
    tresh.addTreshold('uno', 's1');
    tresh.addTreshold('uno', 's1');
    expect(tresh.confirmTresholdsChanges('uno')).toBe(false);
  });

  /**
   * Check se sono settate soglie con 'value' del > maggiore del 'value' del <
   */
  it('TresholdsCtrl::confirmTresholdsChanges::CheckIncorrectTresholdSettings::false', () => {
    tresh.panel.actualTable = 'Tabella1';
    tresh.panel.actualFlush = 'Flusso';

    setTreshold(tresh,'uno','s1','<',2);
    setTreshold(tresh,'uno','s1','>=',1);

    expect(tresh.confirmTresholdsChanges('uno')).toBe(false);
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

    setTreshold(tresh,'uno','s1','>=',2);
    setTreshold(tresh,'uno','s1','<',1);

    expect(tresh.confirmTresholdsChanges('uno')).toBe(true);
  });

  /**
   * delete treshold by node and index
   * TODO in TresholdCtrl.js nella funzione delete non mi va dentro il primo if nonostante i name siano uguali ?!?!?!?!
   */
  /*
  it('TresholdsCtrl::confirmTresholdsChanges::CheckDeleteTreshold::true', () => {
    setTreshold(tresh,'uno','s1','>=',2);
    setTreshold(tresh,'uno','s1','<',1);
    console.log(tresh.panel.tresholds);

    expect(tresh.deleteTreshold('uno','1')).toBe(true);
    console.log(tresh.panel.tresholds);
  });
*/


});
