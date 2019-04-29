/*
 * File: TresholdsCtrl.test.js
 * Creation date: 2019-04-29
 * Author: Diego Mazzalovo
 * Type: ES6
 * Author e-mail: diego.mazzalovo@studenti.unipd.it
 * Version: 0.0.1
 *
 * Changelog:
 * 0.0.1 || Diego Mazzalovo || 2019-04-29 || Prima stesura
 */

import { thisMock } from '../src/testSetup/mocks';
import ModalCreator from '../src/ModalCreator';

describe('ModalCreator tests', () => {
  let modal;
  beforeEach(() => {
    modal = new ModalCreator(thisMock);
  });

  /**
   * verify that checkMonitoring correctly checks if network is monitoring
   * */
  it('ModalCreator::checkMonitoring::true', () => {
    modal.t.panel.monitoring = true;
    expect(modal.checkMonitoring('errore')).toBe(true);
  });

  /**
   * verify that checkMonitoring correctly checks if network isn't monitoring
   * */
  it('ModalCreator::checkMonitoring::false', () => {
    modal.t.panel.monitoring = false;
    expect(modal.checkMonitoring('errore')).toBe(false);
  });

  /**
   * verify that checkDB correctly checks if is connected to a database
   * */
  it('ModalCreator::checkDB::true', () => {
    modal.t.panel.collegatoAlDB = true;
    expect(modal.checkDB('errore')).toBe(true);
  });

  /**
   * verify that checkDB correctly checks if isn't connected to a database
   * */
  it('ModalCreator::checkDB::false', () => {
    modal.t.panel.collegatoAlDB = false;
    expect(modal.checkDB('errore')).toBe(false);
  });

  /**
   * verify that showMessageModal works correctly
   * */
  it('ModalCreator::showMessageModal::true', () => {
    expect(modal.showMessageModal('messaggio')).toBe(true);
  });

  /**
   * verify that showTresholdModal return true if settings are ok
   * */
  it('ModalCreator::shwoTresholdModal::true', () => {
    modal.t.panel.monitoring = false;
    modal.t.panel.collegatoAlDB = true;
    expect(modal.showTresholdModal('uno')).toBe(true);
  });

  /**
   * verify that showTresholdModal return false if monitoring
   * */
  it('ModalCreator::shwoTresholdModal::false(monitoring = true)', () => {
    modal.t.panel.monitoring = true;
    expect(modal.showTresholdModal('uno')).toBe(false);
  });

  /**
   * verify that showTresholdModal return false if not connected to a db
   * */
  it('ModalCreator::shwoTresholdModal::false(connectedToDB = false)', () => {
    modal.t.panel.monitoring = false;
    modal.t.panel.collegatoAlDB = false;
    expect(modal.showTresholdModal('uno')).toBe(false);
  });

  /**
   * verify that selectTemporalPolicy return true if settings are ok
   * */
  it('ModalCreator::selectTemporalPolicy::true', () => {
    modal.t.panel.monitoring = false;
    modal.t.panel.collegatoAlDB = true;
    expect(modal.selectTemporalPolicy()).toBe(true);
  });

  /**
   * verify that selectTemporalPolicy return false if monitoring
   * */
  it('ModalCreator::selectTemporalPolicy::false(monitoring = true)', () => {
    modal.t.panel.monitoring = true;
    expect(modal.selectTemporalPolicy()).toBe(false);
  });

  /**
   * verify that selectTemporalPolicy return false if not connected to a db
   * */
  it('ModalCreator::selectTemporalPolicy::false(connectedToDB = false)', () => {
    modal.t.panel.monitoring = false;
    modal.t.panel.collegatoAlDB = false;
    expect(modal.selectTemporalPolicy()).toBe(false);
  });




});
