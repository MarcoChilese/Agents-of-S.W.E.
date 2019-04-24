export const templateSrvMock = {
  replace: jest.fn().mockImplementation(query => query),
};

export const backendSrvMock = {
  datasourceRequest: jest.fn(),
};

export const datasourceSrvMock = {
  loadDatasource: jest.fn(),
  getAll: jest.fn(),
};

export const timeSrvMock = {
  timeRange: jest.fn().mockReturnValue({ from: '', to: '' }),
};

const databases = ['uno', 'due'];

export const getData = function () {
  return new Promise((resolve, reject) => {
    resolve(databases);
    reject('no databases');
  });
}






const defaultExports = {
  templateSrvMock,
  backendSrvMock,
  datasourceSrvMock,
  timeSrvMock,
  getData,

};

export default defaultExports;
