

export const backendSrvMock = {
  get: (param) => {
    if (param === '/api/datasources/proxy/6/query?db=DB1&q=show%20measurements') {
      return {
        results: [
          {
            series: [
              {
                name: 'measurements',
                columns: ['name'],
                values: [['cpu'], ['disk']],
              }],
          }],
      };
    }
    if (param === 'api/datasources/proxy/6/query?db=DB1&q=show%20field%20keys%20on%20DB1%20from%20cpu') {
      return {
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
                                columns: ['fieldKey', 'fieldType'],
                                values: [['usage_guest', 'float'], ['usage_guest_nice', 'float'], ['usage_idle', 'float']],
                              },
                            ],
                        },
                      ],
                  },
                processScheduled: false,
                pur: true,
              },
      };
    }
    if (param === 'api/datasources/proxy/6/query?db=DB1&q=show%20field%20keys%20on%20DB1%20from%20disk') {
      return {
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
                                [['free', 'integer'], ['inodes_free', 'integer'], ['inodes_total', 'integer'],
                                ],
                            },
                          ],
                      },
                    ],
                },
              processScheduled: false,
              pur: true,
            },
      };
    }
    if (param === '/api/datasources') {
      return [
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
      ];
    }
    return false;
  },
};

export const thisMock = {
  panel: {},
  modalCreator: {},
  pluginId: 1,
  $scope: { $new() { return {}; } },
};


const defaultExports = {
  backendSrvMock,
  thisMock,

};

export default defaultExports;
