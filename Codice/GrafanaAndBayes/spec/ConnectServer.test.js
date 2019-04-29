/*
 * File: ConnectServer.test.js
 * Creation date: 2019-04-24
 * Author: Diego Mazzalovo
 * Type: ES6
 * Author e-mail: diego.mazzalovo@studenti.unipd.it
 * Version: 0.0.1
 *
 * Changelog:
 * 0.0.1 || Diego Mazzalovo || 2019-04-24 || Prima stesura
 */

import jQuery from 'jquery';
import ConnectServer from '../src/js/ConnectServer';


(function ($) {
  $.ajax = function (params) {
    if (params.contentType !== 'application/json; charset=utf-8') { return false; }
    if (JSON.stringify(params.headers) !== JSON.stringify({ 'Access-Control-Allow-Origin': '*' })) { return false; }
    if (params.type !== 'GET' && params.type !== 'POST') { return false; }
    if (params.url === 'http://localhost:8600/alive') { return { date: 'Mon Apr 29 2019 07:50:55 GMT+0000 (Coordinated Universal Time)', port: 8600 }; }
    if (params.url === 'http://localhost:8600/networks') { return { Alarm: true }; }
    if (params.url === 'http://localhost:8600/uploadnetwork') {
      if (params.data === undefined) { return false; } { return true; }
    }
    if (params.url === 'http://localhost:8600/deletenetwork/net') {
      if (params.data !== 'net') { return false; } return true;
    }
    if (params.url === 'http://localhost:8600/getnetworkprob/net') {
      return JSON.stringify([{ node: 'HISTORY', states: ['TRUE', 'FALSE'], prob: [0.062, 0.938] }, { node: 'CVP', states: ['LOW', 'NORMAL', 'HIGH'], prob: [0.105, 0.737, 0.158] }, { node: 'PCWP', states: ['LOW', 'NORMAL', 'HIGH'], prob: [0.11, 0.688, 0.202] }, { node: 'HYPOVOLEMIA', states: ['TRUE', 'FALSE'], prob: [0.178, 0.822] }, { node: 'LVEDVOLUME', states: ['LOW', 'NORMAL', 'HIGH'], prob: [0.085, 0.718, 0.197] }, { node: 'LVFAILURE', states: ['TRUE', 'FALSE'], prob: [0.05, 0.95] }, { node: 'STROKEVOLUME', states: ['LOW', 'NORMAL', 'HIGH'], prob: [0.159, 0.799, 0.042] }, { node: 'ERRLOWOUTPUT', states: ['TRUE', 'FALSE'], prob: [0.051, 0.949] }, { node: 'HRBP', states: ['LOW', 'NORMAL', 'HIGH'], prob: [0.173, 0.062, 0.765] }, { node: 'HREKG', states: ['LOW', 'NORMAL', 'HIGH'], prob: [0.151, 0.084, 0.765] }, { node: 'ERRCAUTER', states: ['TRUE', 'FALSE'], prob: [0.091, 0.909] }, { node: 'HRSAT', states: ['LOW', 'NORMAL', 'HIGH'], prob: [0.152, 0.09, 0.758] }, { node: 'INSUFFANESTH', states: ['TRUE', 'FALSE'], prob: [0.1, 0.9] }, { node: 'ANAPHYLAXIS', states: ['TRUE', 'FALSE'], prob: [0.004, 0.996] }, { node: 'TPR', states: ['LOW', 'NORMAL', 'HIGH'], prob: [0.32, 0.365, 0.315] }, { node: 'EXPCO2', states: ['ZERO', 'LOW', 'NORMAL', 'HIGH'], prob: [0.043, 0.864, 0.059, 0.034] }, { node: 'KINKEDTUBE', states: ['TRUE', 'FALSE'], prob: [0.044, 0.956] }, { node: 'MINVOL', states: ['ZERO', 'LOW', 'NORMAL', 'HIGH'], prob: [0.706, 0.07, 0.029, 0.195] }, { node: 'FIO2', states: ['LOW', 'NORMAL'], prob: [0.041, 0.959] }, { node: 'PVSAT', states: ['LOW', 'NORMAL', 'HIGH'], prob: [0.788, 0.026, 0.186] }, { node: 'SAO2', states: ['LOW', 'NORMAL', 'HIGH'], prob: [0.78, 0.037, 0.183] }, { node: 'PAP', states: ['LOW', 'NORMAL', 'HIGH'], prob: [0.053, 0.887, 0.06] }, { node: 'PULMEMBOLUS', states: ['TRUE', 'FALSE'], prob: [0.007, 0.993] }, { node: 'SHUNT', states: ['TRUE', 'FALSE'], prob: [0.912, 0.088] }, { node: 'INTUBATION', states: ['NORMAL', 'ESOPHAGEAL', 'ONESIDED'], prob: [0.915, 0.041, 0.044] }, { node: 'PRESS', states: ['ZERO', 'LOW', 'NORMAL', 'HIGH'], prob: [0.027, 0.274, 0.217, 0.482] }, { node: 'DISCONNECT', states: ['TRUE', 'FALSE'], prob: [0.089, 0.911] }, { node: 'MINVOLSET', states: ['LOW', 'NORMAL', 'HIGH'], prob: [0.061, 0.885, 0.054] }, { node: 'VENTMACH', states: ['ZERO', 'LOW', 'NORMAL', 'HIGH'], prob: [0.045, 0.065, 0.827, 0.063] }, { node: 'VENTTUBE', states: ['ZERO', 'LOW', 'NORMAL', 'HIGH'], prob: [0.189, 0.728, 0.011, 0.072] }, { node: 'VENTLUNG', states: ['ZERO', 'LOW', 'NORMAL', 'HIGH'], prob: [0.74, 0.226, 0.009, 0.025] }, { node: 'VENTALV', states: ['ZERO', 'LOW', 'NORMAL', 'HIGH'], prob: [0.687, 0.075, 0.042, 0.196] }, { node: 'ARTCO2', states: ['LOW', 'NORMAL', 'HIGH'], prob: [0.181, 0.067, 0.752] }, { node: 'CATECHOL', states: ['NORMAL', 'HIGH'], prob: [0.104, 0.896] }, { node: 'HR', states: ['LOW', 'NORMAL', 'HIGH'], prob: [0.012, 0.156, 0.832] }, { node: 'CO', states: ['LOW', 'NORMAL', 'HIGH'], prob: [0.152, 0.172, 0.676] }, { node: 'BP', states: ['LOW', 'NORMAL', 'HIGH'], prob: [0.393, 0.202, 0.405] }]);
    }
    if (params.url === 'http://localhost:8600/getnetwork/net') {
      return JSON.stringify({
        canStartComputation: true,
        collegatoAlDB: true,
        database: {
          id: 6, orgId: 1, name: 'InfluxDB', type: 'influxdb', typeLogoUrl: 'public/app/plugins/datasource/influxdb/img/influxdb_logo.svg', access: 'proxy', url: 'http://142.93.102.115:8086', password: 'greg', user: 'greg', database: 'telegraf', basicAuth: false, isDefault: false, jsonData: { keepCookies: [] }, readOnly: false,
        },
        flushesAssociations: { uno: { table: 'disk', flush: 'inodes_used' } },
        monitoring: false,
        name: 'altraReteDiEsempio',
        nodes: ['uno', 'due', 'quattro'],
        parents: { uno: [], due: [], quattro: ['uno', 'due'] },
        states: { uno: ['a', 'b'], due: ['c', 'd'], quattro: ['true', 'false'] },
        probabilities: { uno: [[0.25, 0.75]], due: [[0.05, 0.95]], quattro: [[1, 0], [1, 0], [1, 0], [1, 0]] },
        temporalPolicy: { seconds: 4, minutes: 0, hours: 0 },
        temporalPolicyConfirmed: true,
        tresholdLinked: { uno: true, due: false, quattro: false },
        tresholds: {
          uno: [{
            state: 'b', sign: '>=', value: 0, critical: false, name: 1, $$hashKey: 'object:87',
          }, {
            state: 'a', sign: '>=', value: 23, critical: false, name: 0, $$hashKey: 'object:84',
          }],
          due: [],
          quattro: [],
        },
        selectedDB: 'InfluxDB',
      });
    }
  };
}(jQuery));


describe('ConnectServer tests', () => {
  let server;


  beforeEach(() => {
    server = new ConnectServer('localhost', 8600);
  });

  it('ConnectServer::alive', async () => {
    expect(await server.alive()).toEqual({ date: 'Mon Apr 29 2019 07:50:55 GMT+0000 (Coordinated Universal Time)', port: 8600 });
  });

  it('ConnectServer::networks', async () => {
    expect(await server.networks()).toEqual({ Alarm: true });
  });

  it('ConnectServer::uploadnetwork', async () => {
    const net = { name: 'net' };
    expect(await server.uploadnetwork(net)).toBe(true);
  });

  it('ConnectServer::deletenetwork', async () => {
    const net = 'net';
    expect(await server.deletenetwork(net)).toBe(true);
  });

  it('ConnectServer::getnetworkprob/net', async () => {
    const net = 'net';
    expect(await server.getnetworkprob(net)).toEqual(JSON.stringify([{ node: 'HISTORY', states: ['TRUE', 'FALSE'], prob: [0.062, 0.938] }, { node: 'CVP', states: ['LOW', 'NORMAL', 'HIGH'], prob: [0.105, 0.737, 0.158] }, { node: 'PCWP', states: ['LOW', 'NORMAL', 'HIGH'], prob: [0.11, 0.688, 0.202] }, { node: 'HYPOVOLEMIA', states: ['TRUE', 'FALSE'], prob: [0.178, 0.822] }, { node: 'LVEDVOLUME', states: ['LOW', 'NORMAL', 'HIGH'], prob: [0.085, 0.718, 0.197] }, { node: 'LVFAILURE', states: ['TRUE', 'FALSE'], prob: [0.05, 0.95] }, { node: 'STROKEVOLUME', states: ['LOW', 'NORMAL', 'HIGH'], prob: [0.159, 0.799, 0.042] }, { node: 'ERRLOWOUTPUT', states: ['TRUE', 'FALSE'], prob: [0.051, 0.949] }, { node: 'HRBP', states: ['LOW', 'NORMAL', 'HIGH'], prob: [0.173, 0.062, 0.765] }, { node: 'HREKG', states: ['LOW', 'NORMAL', 'HIGH'], prob: [0.151, 0.084, 0.765] }, { node: 'ERRCAUTER', states: ['TRUE', 'FALSE'], prob: [0.091, 0.909] }, { node: 'HRSAT', states: ['LOW', 'NORMAL', 'HIGH'], prob: [0.152, 0.09, 0.758] }, { node: 'INSUFFANESTH', states: ['TRUE', 'FALSE'], prob: [0.1, 0.9] }, { node: 'ANAPHYLAXIS', states: ['TRUE', 'FALSE'], prob: [0.004, 0.996] }, { node: 'TPR', states: ['LOW', 'NORMAL', 'HIGH'], prob: [0.32, 0.365, 0.315] }, { node: 'EXPCO2', states: ['ZERO', 'LOW', 'NORMAL', 'HIGH'], prob: [0.043, 0.864, 0.059, 0.034] }, { node: 'KINKEDTUBE', states: ['TRUE', 'FALSE'], prob: [0.044, 0.956] }, { node: 'MINVOL', states: ['ZERO', 'LOW', 'NORMAL', 'HIGH'], prob: [0.706, 0.07, 0.029, 0.195] }, { node: 'FIO2', states: ['LOW', 'NORMAL'], prob: [0.041, 0.959] }, { node: 'PVSAT', states: ['LOW', 'NORMAL', 'HIGH'], prob: [0.788, 0.026, 0.186] }, { node: 'SAO2', states: ['LOW', 'NORMAL', 'HIGH'], prob: [0.78, 0.037, 0.183] }, { node: 'PAP', states: ['LOW', 'NORMAL', 'HIGH'], prob: [0.053, 0.887, 0.06] }, { node: 'PULMEMBOLUS', states: ['TRUE', 'FALSE'], prob: [0.007, 0.993] }, { node: 'SHUNT', states: ['TRUE', 'FALSE'], prob: [0.912, 0.088] }, { node: 'INTUBATION', states: ['NORMAL', 'ESOPHAGEAL', 'ONESIDED'], prob: [0.915, 0.041, 0.044] }, { node: 'PRESS', states: ['ZERO', 'LOW', 'NORMAL', 'HIGH'], prob: [0.027, 0.274, 0.217, 0.482] }, { node: 'DISCONNECT', states: ['TRUE', 'FALSE'], prob: [0.089, 0.911] }, { node: 'MINVOLSET', states: ['LOW', 'NORMAL', 'HIGH'], prob: [0.061, 0.885, 0.054] }, { node: 'VENTMACH', states: ['ZERO', 'LOW', 'NORMAL', 'HIGH'], prob: [0.045, 0.065, 0.827, 0.063] }, { node: 'VENTTUBE', states: ['ZERO', 'LOW', 'NORMAL', 'HIGH'], prob: [0.189, 0.728, 0.011, 0.072] }, { node: 'VENTLUNG', states: ['ZERO', 'LOW', 'NORMAL', 'HIGH'], prob: [0.74, 0.226, 0.009, 0.025] }, { node: 'VENTALV', states: ['ZERO', 'LOW', 'NORMAL', 'HIGH'], prob: [0.687, 0.075, 0.042, 0.196] }, { node: 'ARTCO2', states: ['LOW', 'NORMAL', 'HIGH'], prob: [0.181, 0.067, 0.752] }, { node: 'CATECHOL', states: ['NORMAL', 'HIGH'], prob: [0.104, 0.896] }, { node: 'HR', states: ['LOW', 'NORMAL', 'HIGH'], prob: [0.012, 0.156, 0.832] }, { node: 'CO', states: ['LOW', 'NORMAL', 'HIGH'], prob: [0.152, 0.172, 0.676] }, { node: 'BP', states: ['LOW', 'NORMAL', 'HIGH'], prob: [0.393, 0.202, 0.405] }]));
  });

  it('ConnectServer::getnetwork/net', async () => {
    const net = 'net';
    expect(await server.getnetwork(net))
      .toEqual(JSON.stringify(
        {
          canStartComputation: true,
          collegatoAlDB: true,
          database: {
            id: 6, orgId: 1, name: 'InfluxDB', type: 'influxdb', typeLogoUrl: 'public/app/plugins/datasource/influxdb/img/influxdb_logo.svg', access: 'proxy', url: 'http://142.93.102.115:8086', password: 'greg', user: 'greg', database: 'telegraf', basicAuth: false, isDefault: false, jsonData: { keepCookies: [] }, readOnly: false,
          },
          flushesAssociations: { uno: { table: 'disk', flush: 'inodes_used' } },
          monitoring: false,
          name: 'altraReteDiEsempio',
          nodes: ['uno', 'due', 'quattro'],
          parents: { uno: [], due: [], quattro: ['uno', 'due'] },
          states: { uno: ['a', 'b'], due: ['c', 'd'], quattro: ['true', 'false'] },
          probabilities: { uno: [[0.25, 0.75]], due: [[0.05, 0.95]], quattro: [[1, 0], [1, 0], [1, 0], [1, 0]] },
          temporalPolicy: { seconds: 4, minutes: 0, hours: 0 },
          temporalPolicyConfirmed: true,
          tresholdLinked: { uno: true, due: false, quattro: false },
          tresholds: {
            uno: [{
              state: 'b', sign: '>=', value: 0, critical: false, name: 1, $$hashKey: 'object:87',
            }, {
              state: 'a', sign: '>=', value: 23, critical: false, name: 0, $$hashKey: 'object:84',
            }],
            due: [],
            quattro: [],
          },
          selectedDB: 'InfluxDB',
        },
      ));
  });
});
