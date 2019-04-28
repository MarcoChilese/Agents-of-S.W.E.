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
import { backendSrvMock } from '../src/testSetup/mocks';
import GetApiGrafana from '../src/js/GetApiGrafana';

describe('GetApiGrafana test', () => {
  let api;
  beforeEach(() => {
    const database = {
      database: 'DB1',
      id: 6,
      name: 'InfluxDB',
      type: 'influxdb',
      url: 'http://localhost:8086',
      user: 'user',
    };

    api = new GetApiGrafana(backendSrvMock, database);
    api.host = null;
    api.port = null;
  });

  /**
   * Method getTables, it must return an array and not the json that returns grafana
   * */
  test('GetApiGrafana::getTables', async () => {
    expect(await api.getTables()).toEqual([['cpu'], ['disk']]);
  });

  /**
   * Method getFields, it must return a json with all fields of all tables
   * */
  test('GetApiGrafana::getFields', async () => {
    expect(await api.getFields(await api.getTables())).toEqual(
      [
        {
          $$state:
            {
              status: 1,
              value:
                {
                  results:
                    [
                      {
                        series:
                          [
                            {
                              name: 'cpu',
                              columns:
                                ['fieldKey', 'fieldType'],
                              values:
                                [
                                  ['usage_guest', 'float'],
                                  ['usage_guest_nice', 'float'],
                                  ['usage_idle', 'float'],
                                ],
                            },
                          ],
                      },
                    ],
                },
              processScheduled: false,
              pur: true,
            },
        },
        {
          $$state:
            {
              status: 1,
              value:
                {
                  results:
                    [
                      {
                        series:
                          [
                            {
                              name: 'disk',
                              columns:
                                ['fieldKey', 'fieldType'],
                              values:
                                [
                                  ['free', 'integer'],
                                  ['inodes_free', 'integer'],
                                  ['inodes_total', 'integer'],
                                ],
                            },
                          ],
                      },
                    ],
                },
              processScheduled: false,
              pur: true,
            },
        },
      ],
    );
  });

  /**
   * verify that method divideFields return data correctly structured
   * */
  test('GetApiGrafana::divideFields', async () => {
    expect(api.divideFields(await api.getFields(await api.getTables()))).toEqual(
      {
        cpu: ['usage_guest', 'usage_guest_nice', 'usage_idle'],
        disk: ['free', 'inodes_free', 'inodes_total'],
      },
    );
  });

  /**
   * verify that method initialize correctly sets the variables
   * */
  test('GetApiGrafana::initialize', () => {
    expect(api.host).toEqual(null);
    expect(api.port).toEqual(null);
    api.initialize();
    expect(api.host).toEqual('localhost');
    expect(api.port).toEqual('8086');
  });

  /**
   * verify that getDatasources returns correct values and set variables
   * */
  test('GetApiGrafana::getDatasources', async () => {
    expect(api.host).toEqual(null);
    expect(api.port).toEqual(null);
    expect(await api.getDatasources()).toEqual(
      {
        cpu: ['usage_guest', 'usage_guest_nice', 'usage_idle'],
        disk: ['free', 'inodes_free', 'inodes_total'],
      },
    );
    expect(api.host).toEqual('localhost');
    expect(api.port).toEqual('8086');
  });

  /**
   * verify that queryAPI makes correct call and structures data correctly
   * */
  test('GetApiGrafana::queryAPI', async () => {
    expect(await api.queryAPI()).toEqual([
      {
        database: 'DB1',
        id: 6,
        name: 'InfluxDB',
        type: 'influxdb',
        url: 'http://localhost:8086',
        user: 'user',
      },
      {
        database: 'DB2',
        id: 6,
        name: 'InfluxDB2',
        type: 'influxdb',
        url: 'http://localhost:8086',
        user: 'user',
      },
    ]);
  });

  /**
   * verify that getData makes correct call
   * */
  test('GetApiGrafana::getData', async () => {
    expect(await api.getData()).toEqual(
      {
        InfluxDB:
          {
            database: 'DB1',
            id: 6,
            name: 'InfluxDB',
            type: 'influxdb',
            url: 'http://localhost:8086',
            user: 'user',
          },
        InfluxDB2:
          {
            database: 'DB2',
            id: 6,
            name: 'InfluxDB2',
            type: 'influxdb',
            url: 'http://localhost:8086',
            user: 'user',
          },
      },
    );
  });
});
