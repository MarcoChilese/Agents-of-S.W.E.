/*
 * File: TemporalPolicyCtrl.test.js
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
import { TemporalPolicyCtrl } from '../src/TemporalPolicyCtrl';
import ModalCreator from '../src/ModalCreator';

jest.mock('../src/ModalCreator');
const temp = new TemporalPolicyCtrl();
const modal = new ModalCreator();

describe('TemporalPolicyCtrl::setConfirmationToFalse', () => {
  beforeEach(() => {
    temp.panel.temporalPolicy = {
      seconds: 0,
      minutes: 0,
      hours: 0,
    };
    temp.modalCreator = modal;
  });

  // setConfirmationToFalse
  it('TemporalPolicyCtrl::setConfirmationToFalse', () => {
    temp.panel.temporalPolicyConfirmed = true;
    temp.setConfirmationToFalse();
    expect(temp.panel.temporalPolicyConfirmed).toBe(false);
  });

  // set second >= 60
  it('TemporalPolicyCtrl::setConfirmationToTrue::return false', () => {
    temp.panel.temporalPolicy.seconds = 61;
    expect(temp.setConfirmationToTrue()).toBe(false);
  });

  // set seconds < 0
  it('TemporalPolicyCtrl::setConfirmationToTrue::return false', () => {
    temp.panel.temporalPolicy.seconds = -1;
    expect(temp.setConfirmationToTrue()).toBe(false);
  });

  // set minutes >= 60
  it('TemporalPolicyCtrl::setConfirmationToTrue::return false', () => {
    temp.panel.temporalPolicy.minutes = 61;
    expect(temp.setConfirmationToTrue()).toBe(false);
  });


  // set minutes < 0
  it('TemporalPolicyCtrl::setConfirmationToTrue::return false', () => {
    temp.panel.temporalPolicy.minutes = -1;
    expect(temp.setConfirmationToTrue()).toBe(false);
  });

  // set hours < 0
  it('TemporalPolicyCtrl::setConfirmationToTrue::return false', () => {
    temp.panel.temporalPolicy.hours = -1;
    expect(temp.setConfirmationToTrue()).toBe(false);
  });

  // set seconds < 60
  it('TemporalPolicyCtrl::setConfirmationToTrue::return true', () => {
    temp.panel.temporalPolicy.seconds = 10;
    expect(temp.setConfirmationToTrue()).toBe(true);
  });

  // set minutes < 60
  it('TemporalPolicyCtrl::setConfirmationToTrue::return true', () => {
    temp.panel.temporalPolicy.minutes = 10;
    expect(temp.setConfirmationToTrue()).toBe(true);
  });

  // set hours
  it('TemporalPolicyCtrl::setConfirmationToTrue::return true', () => {
    temp.panel.temporalPolicy.hours = 10;
    expect(temp.setConfirmationToTrue()).toBe(true);
  });
});
