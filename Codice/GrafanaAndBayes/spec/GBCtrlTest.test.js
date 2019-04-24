
import mocks from '../src/testSetup/mocks';
import TresholdCtrl from '../src/TresholdsCtrl';
import ModalCreator from '../src/ModalCreator';
import ConnectServer from '../src/js/ConnectServer';
import { GBCtrl } from '../src/GBCtrl';

const gb = require('../src/GBCtrl');

jest.mock('../src/js/GetApiGrafana');
jest.mock('../src/ModalCreator');
jest.mock('../src/js/ConnectServer');


let g;
describe('generic tests', () => {
  // constructor
  it('GBCtrl::constructor', () => {
    g = new gb.GBCtrl();
    expect(g).not.toBe(undefined);
  });

  // calculateSeconds
  it('GBCtrl::calculateSeconds', () => {
    const policy = { seconds: 50, minutes: 20, hours: 3 };
    expect(g.calculateSeconds(policy)).toEqual(12050);
  });

  // buildDataToSend
  it('GBCtrl::buildDataToSend', () => {
    expect(g.buildDataToSend()).not.toEqual({});
  });


  // panelpath
  it('GBCtrl::panelpath::(path = undefined)', () => {
    g._panelPath = undefined;
    expect(g.panelPath).toBe('/public/plugins/undefined/'); // TO CHECK
  });

  it('GBCtrl::panelpath::(path !== undefined)', () => {
    expect(g.panelPath).toBe('/public/plugins/undefined/'); // TO CHECK
  });

  // onInitEditMode
  it('GBCtrl::onInitEditMode', () => {
    expect(g.onInitEditMode()).toBe(true);
  });
});

describe('server connection', () => {
  beforeEach(() => {
    g.server.connected = false;
    g.server.port = 8600;
    g.panel.availableNetworksToLoad = [
      {
        name: 'Alarm',
        monitoring: true,
      },
      {
        name: 'Sachs',
        monitoring: true,
      },
      {
        name: 'Viaggio_in_asia',
        monitoring: false,
      }];
    g.panel.monitoringNetworks = [];
  });

  // splitMonitoringNetworks
  it('GBCtrl::splitMonitoringNetworks', () => {
    expect(g.splitMonitoringNetworks()).toEqual(['Alarm', 'Sachs']);
  });

  // requestNetworks
  it('GBCtrl::requestNetworks::true', async () => {
    g.testServer = new ConnectServer();
    expect(await g.requestNetworks()).toBe(true);
  });

  // requestNetworks
  it('GBCtrl::requestNetworks::false', async () => {
    g.testServer = new ConnectServer(1, 5000);
    expect(await g.requestNetworks()).toBe(false);
  });

  // tryConnectServer
  it('GBCtrl::tryConnectServer::true', async () => {
    g.testServer = new ConnectServer();
    expect(await g.tryConnectServer()).toBe(true);
    expect(g.server.connected).toBe(true);
  });

  it('GBCtrl::tryConnectServer::false', async () => {
    g.server.port = 5000;
    expect(await g.tryConnectServer()).toBe(false);
    expect(g.server.connected).toBe(false);
  });

  describe('need splitMonitoringNetworks', () => {
    beforeEach(() => {
      g.panel.monitoringNetworks = g.splitMonitoringNetworks();
    });
    // checkIfNetworkIsDeletable
    it('GBCtrl::checkIfNetworkIsDeletable::true', async () => {
      expect(g.checkIfNetworkIsDeletable('Viaggio_in_asia')).toBe(true);
    });

    it('GBCtrl::checkIfNetworkIsDeletable::false(monitoring = true)', async () => {
      expect(g.checkIfNetworkIsDeletable('Alarm')).toBe(false);
    });

    it('GBCtrl::checkIfNetworkIsDeletable::false(net undefined)', () => {
      expect(g.checkIfNetworkIsDeletable(undefined)).toBe(false);
    });
  });

  describe('need splitMonitoringNetworks and tryConnectServer', () => {
    beforeEach(() => {
      g.panel.calculatedProbabilities = {};
      g.tryConnectServer();
      g.panel.monitoringNetworks = g.splitMonitoringNetworks();
    });
    afterEach(() => {
      clearInterval(g.interval);
    });
    // requestNetworkDelete
    it('GBCtrl::requestNetworkDelete::true', async () => {
      expect(await g.requestNetworkDelete('Viaggio_in_asia')).toBe(true);
    });

    it('GBCtrl::requestNetworkDelete::false', async () => {
      expect(await g.requestNetworkDelete('Alarm')).toBe(false);
    });

    // updateProbs
    it('GBCtrl::updateProbs::true', async () => {
      g.panel.actuallyVisualizingMonitoring = 'Alarm';
      expect(await g.updateProbs()).toBe(true);
      expect(g.panel.calculatedProbabilities).toEqual({
        stato1: [0.05, 0.95],
        stato2: [0.8, 0.2],
        stato3: [0.7, 0.3],
      });
      clearInterval(g.interval);
    });

    it('GBCtrl::updateProbs::false', async () => {
      g.panel.actuallyVisualizingMonitoring = 'notValid';
      expect(await g.updateProbs()).toBe(false);
      expect(g.panel.calculatedProbabilities).toEqual({});
      expect(g.interval).toBe(undefined);
    });

    // changeNetworkToVisualizeMonitoring
    it('GBCtrl::changeNetworkToVisualizeMonitoring::true', async () => {
      g.panel.actuallyVisualizingMonitoring = 'Alarm';
      expect(await g.changeNetworkToVisualizeMonitoring()).toBe(true);
      expect(g.interval).not.toBe(undefined);
    });

    it('GBCtrl::changeNetworkToVisualizeMonitoring::false', async () => {
      g.panel.actuallyVisualizingMonitoring = 'notValid';
      expect(await g.changeNetworkToVisualizeMonitoring()).toBe(false);
    });

    // loadNetworkToServer
    it('GBCtrl::loadNetworkToServer::true', async () => {
      const net = { name: 'net' };
      expect(await g.loadNetworkToServer(net)).toBe(true);
    });

    it('GBCtrl::loadNetworkToServer::false', async () => {
      const net = { name: 'Sachs' };
      expect(await g.loadNetworkToServer(net)).toBe(false);
    });

    // saveActualChanges
    it('GBCtrl::saveActualChanges::true(name = "", collegatoAlDB = false)', async () => {
      g.panel.name = '';
      g.panel.collegatoAlDB = false;
      expect(await g.saveActualChanges()).toBe(true);
    });

    it('GBCtrl::saveActualChanges::true(name = "", collegatoAlDB = true)', async () => {
      g.panel.name = '';
      g.panel.collegatoAlDB = true;
      expect(await g.saveActualChanges()).toBe(true);
    });

    it('GBCtrl::saveActualChanges::true(name = "net", collegatoAlDB = false)', async () => {
      g.panel.name = 'net';
      g.panel.collegatoAlDB = false;
      expect(await g.saveActualChanges()).toBe(true);
    });

    it('GBCtrl::saveActualChanges::true(name = "net", collegatoAlDB = true)', async () => {
      g.panel.name = 'net';
      g.panel.collegatoAlDB = true;
      expect(await g.saveActualChanges()).toBe(true);
    });

    it('GBCtrl::saveActualChanges::true(name = "Sachs", collegatoAlDB = true)', async () => {
      g.panel.name = 'Sachs';
      g.panel.collegatoAlDB = true;
      expect(await g.saveActualChanges()).toBe(false);
    });
  });
});


describe('need database', () => {
  const viaggioInAsia = {
    name: 'Viaggio in asia',
    nodes: ['Viaggio in Asia', 'Tubercolosi', 'Fuma', 'Cancro', 'Bronchite', 'TBC o Cancro', 'Dispnea', 'Risultati sui raggi X'],
    states: {
      'Viaggio in Asia': ['true', 'false'],
      Tubercolosi: ['true', 'false'],
      Fuma: ['true', 'false'],
      Cancro: ['true', 'false'],
      Bronchite: ['true', 'false'],
      'TBC o Cancro': ['true', 'false'],
      Dispnea: ['true', 'false'],
      'Risultati sui raggi X': ['true', 'false'],
    },
    parents: {
      'Viaggio in Asia': [],
      Tubercolosi: ['Viaggio in Asia'],
      Fuma: [],
      Cancro: ['Fuma'],
      Bronchite: ['Fuma'],
      'TBC o Cancro': ['Tubercolosi', 'Cancro'],
      Dispnea: ['TBC o Cancro', 'Bronchite'],
      'Risultati sui raggi X': ['TBC o Cancro'],
    },
    probabilities: {
      'Viaggio in Asia': [[0.01, 0.99]],
      Tubercolosi: [[0.05, 0.95], [0.01, 0.99]],
      Fuma: [[0.5, 0.5]],
      Cancro: [[0.1, 0.9], [0.01, 0.99]],
      Bronchite: [[0.6, 0.4], [0.3, 0.7]],
      'TBC o Cancro': [[1.0, 0.0], [1.0, 0.0], [1.0, 0.0], [0.0, 1.0]],
      Dispnea: [[0.9, 0.1], [0.8, 0.2], [0.7, 0.3], [0.1, 0.9]],
      'Risultati sui raggi X': [[0.98, 0.02], [0.05, 0.95]],
    },
  };
  g = new GBCtrl();
  beforeEach(() => {
    g.panel.availableDatabases = {
      DB1: {
        id: 1,
        name: 'DB1',
        password: 'pwd',
        type: 'influxdb',
        url: 'http://142.93.102.115:8086',
        user: 'USER',
      },
      DB2: {
        id: 2,
        name: 'TestData DB',
        password: '',
        type: 'testdata',
        url: 'http://localhost:8086',
        user: '',
      },
      DB3: {
        id: 3,
        name: 'PerEccezione',
        password: '',
        type: 'influxdb',
        url: 'http://localhost:8086',
        user: '',
      },
    };
    g.panel.selectedDB = 'DB1';
  });

  // getDatabases
  it('GBCtrl::getDatabases', async () => {
    await g.getDatabases();
    expect(g.panel.availableDatabases).toEqual({
      cloudflare: {
        id: 5,
        name: 'cloudflare',
      },
      'TestData DB': {
        id: 3,
        name: 'TestData DB',
      },
    });
  });

  // resetData
  it('GBCtrl::resetData', () => {
    expect(g.resetData()).toBe(true);
  });

  // checkIfConnectableToDB
  it('GBCtrl::checkIfConnectableToDB::true', () => {
    g.panel.monitoring = false;
    expect(g.checkIfConnectableToDB()).toBe(true);
  });

  it('GBCtrl::checkIfConnectableToDB::false(monitoring = true)', () => {
    g.panel.monitoring = true;
    expect(() => { g.checkIfConnectableToDB(); }).toThrow('Impossibile cambiare database mentre è sotto monitoraggio.');
    g.panel.monitoring = false;
  });

  it('GBCtrl::checkIfConnectableToDB::false(selectedDB = null)', () => {
    g.panel.selectedDB = null;
    expect(() => { g.checkIfConnectableToDB(); }).toThrow('Nessun database selezionato.');
  });

  it('GBCtrl::checkIfConnectableToDB::false(database.type !== influxdb)', () => {
    g.panel.selectedDB = 'DB2';
    expect(() => { g.checkIfConnectableToDB(); }).toThrow('Non è possibile utilizzare database non influx.');
  });

  // getConnectionToDB
  it('GBCtrl::getConnectionToDB::true', () => {
    expect(g.getConnectionToDb()).toBe(true);
    expect(g.db).not.toBe(undefined);
  });

  it('GBCtrl::getConnectionToDB::throw', () => {
    g.panel.selectedDB = 'notValid';
    expect(() => { g.getConnectionToDb(); }).toThrow('Error');
  });

  // getFlushes
  it('GBCtrl::getFlushes::true(collegatoAlDB = false, loadingNet = false)', async () => {
    g.getConnectionToDb();
    g.panel.collegatoAlDB = false;
    g.panel.loadingNet = false;
    expect(await g.getFlushes()).toBe(true);
    expect(g.panel.flussi).toEqual({
      Tabella1: ['Flusso', 'Flusso1', 'Flusso2'], Tabella2: ['f1', 'f2', 'f3'],
    });
    expect(g.panel.collegatoAlDB).toBe(true);
  });

  it('GBCtrl::getFlushes::true(collegatoAlDB = false, loadingNet = true)', async () => {
    g.getConnectionToDb();
    g.panel.collegatoAlDB = false;
    g.panel.loadingNet = true;
    expect(await g.getFlushes()).toBe(true);
    expect(g.panel.flussi).toEqual({
      Tabella1: ['Flusso', 'Flusso1', 'Flusso2'], Tabella2: ['f1', 'f2', 'f3'],
    });
    expect(g.panel.collegatoAlDB).toBe(true);
  });

  it('GBCtrl::getFlushes::true(collegatoAlDB = true, loadingNet = false)', async () => {
    g.getConnectionToDb();
    g.panel.collegatoAlDB = true;
    g.panel.loadingNet = false;
    expect(await g.getFlushes()).toBe(true);
    expect(g.panel.flussi).toEqual({
      Tabella1: ['Flusso', 'Flusso1', 'Flusso2'], Tabella2: ['f1', 'f2', 'f3'],
    });
    expect(g.panel.collegatoAlDB).toBe(true);
  });

  it('GBCtrl::getFlushes::true(collegatoAlDB = true, loadingNet = true)', async () => {
    g.getConnectionToDb();
    g.panel.collegatoAlDB = true;
    g.panel.loadingNet = true;
    expect(await g.getFlushes()).toBe(true);
    expect(g.panel.flussi).toEqual({
      Tabella1: ['Flusso', 'Flusso1', 'Flusso2'], Tabella2: ['f1', 'f2', 'f3'],
    });
    expect(g.panel.collegatoAlDB).toBe(true);
  });

  it('GBCtrl::getFlushes::true', async () => {
    g.getConnectionToDb();
    expect(await g.getFlushes()).toBe(true);
    expect(g.panel.flussi).toEqual({
      Tabella1: ['Flusso', 'Flusso1', 'Flusso2'], Tabella2: ['f1', 'f2', 'f3'],
    });
    expect(g.panel.collegatoAlDB).toBe(true);
  });

  it('GBCtrl::getFlushes::false', async () => {
    g.panel.selectedDB = 'DB2';
    g.getConnectionToDb();
    expect(await g.getFlushes()).toBe(false);
    expect(g.panel.collegatoAlDB).toBe(false);
  });

  // connectToDB
  it('GBCtrl::connectToDB::true', async () => {
    expect(await g.connectToDB()).toBe(true);
  });

  it('GBCtrl::connectToDB::false', async () => {
    g.panel.selectedDB = 'DB2';
    expect(await g.connectToDB()).toBe(false);
  });

  it('GBCtrl::connectToDB::false(exception)', async () => {
    g.panel.selectedDB = 'DB3';
    expect(await g.connectToDB()).toBe(false);
  });

  // showTresholdModal
  it('GBCtrl::showTresholdModal', () => {
    expect(g.showTresholdModal('uno')).toBe(true);
  });

  // selectTemporalPolicy
  it('GBCtrl::selectTemporalPolicy', () => {
    expect(g.selectTemporalPolicy()).toBe(true);
  });

  // visualizeSettings
  it('GBCtrl::visualizeMonitoring', () => {
    g.visualizeMonitoring();
    expect(g.panel.visualizingMonitoring).toBe(true);
  });

  // visualizeSettings
  it('GBCtrl::visualizeSettings', () => {
    g.visualizeSettings();
    expect(g.panel.visualizingMonitoring).toBe(false);
  });

  // loadNetworkFromSaved
  it('GBCtrl::loadNetworkFromSaved::true', async () => {
    const net = {
      name: 'name',
      nodes: [],
      parents: {},
      states: {},
      probabilities: {},
      temporalPolicy: {},
      temporalPolicyConfirmed: false,
      canStartComputation: false,
      collegatoAlDB: false,
      selectedDB: 'DB1',
      database: 'DB1',
      databaseSelected: 'DB1',
      flushesAssociations: {},
      monitoring: false,
      tresholdLinked: {},
      tresholds: {},
    };
    net.flushesAssociations = { uno: { table: 'Tabella1', flush: 'Flusso' } };
    expect(await g.loadNetworkFromSaved(net)).toBe(true);
  });

  it('GBCtrl::loadNetworkFromSaved::true(tresholds defined)', async () => {
    const net = {
      name: 'name',
      nodes: [],
      parents: {},
      states: {},
      probabilities: {},
      temporalPolicy: {},
      temporalPolicyConfirmed: false,
      canStartComputation: false,
      collegatoAlDB: false,
      selectedDB: 'DB1',
      database: 'DB1',
      databaseSelected: 'DB1',
      flushesAssociations: {},
      monitoring: false,
      tresholdLinked: {},
      tresholds: {
        uno:
          [{
            state: 's1', sign: '>=', value: 0, critical: false, name: 0,
          }],
      },
    };
    expect(await g.loadNetworkFromSaved(net)).toBe(true);
  });

  // requestNetworkToServer
  it('GBCtrl::requestNetworkToServer::true', async () => {
    g.server.connected = false;
    g.server.port = 8600;
    g.panel.name = 'net';
    g.panel.collegatoAlDB = true;
    g.server.connected = await g.tryConnectServer();
    expect(await g.requestNetworkToServer('data')).toBe(true);
  });

  it('GBCtrl::requestNetworkToServer::false', async () => {
    g.server.connected = false;
    g.server.port = 8600;
    g.panel.name = 'Sachs';
    g.server.connected = await g.tryConnectServer();
    expect(await g.requestNetworkToServer('Sachs')).toBe(false);
  });

  // loadNetwork
  it('GBCtrl::loadNetwork::false', async () => {
    viaggioInAsia.name = 'Sachs';
    g.panel.collegatoAlDB = true;
    g.panel.name = 'Sachs';
    g.server.port = 8600;
    g.server.connected = await g.tryConnectServer();
    expect(await g.loadNetwork(viaggioInAsia)).toBe(false);
  });

  it('GBCtrl::loadNetwork::true(selectedDB = null)', async () => {
    viaggioInAsia.name = 'viaggio';
    g.panel.collegatoAlDB = true;
    g.panel.name = '';
    g.server.port = 8600;
    g.panel.selectedDB = null;
    g.server.connected = await g.tryConnectServer();
    expect(await g.loadNetwork(viaggioInAsia)).toBe(true);
  });

  it('GBCtrl::loadNetwork::true(selectedDB !== null)', async () => {
    viaggioInAsia.name = 'viaggio';
    g.panel.collegatoAlDB = true;
    g.panel.name = '';
    g.server.port = 8600;
    g.panel.selectedDB = 'DB1';
    g.server.connected = await g.tryConnectServer();
    expect(await g.loadNetwork(viaggioInAsia)).toBe(true);
  });
});

describe('needed tresholds', () => {
  let tresh;
  beforeEach(() => {
    g.panel.nodes = ['uno', 'due', 'tre'];
    tresh = new TresholdCtrl();
    g.panel.flussi = { Tabella1: ['Flusso', 'Flusso1', 'Flusso2'], Tabella2: ['f1', 'f2', 'f3'] };
    g.panel.tresholds = { uno: [] };
    tresh.panel = g.panel;
    tresh.modalCreator = new ModalCreator();
    tresh.addTreshold('uno', 's1');
    tresh.panel.actualTable = 'Tabella1';
    tresh.panel.actualFlush = 'Flusso';
    tresh.confirmTresholdsChanges('uno');
  });
  afterEach(() => {
    tresh.panel.flushesAssociations = {};
    tresh.panel.tresholdLinked = { uno: false, due: false, tre: false };
    g.freeAllFlushes();
  });

  it('GBCtrl::resetTresholds', () => {
    g.resetTresholds();
    expect(g.panel.tresholds).toEqual({ due: [], tre: [], uno: [] });
    expect(g.panel.tresholdLinked).toEqual({ due: false, tre: false, uno: false });
    tresh.panel.flussi.Tabella1.push('Flusso');
    g.freeAllFlushes();
  });

  it('GBCtrl::checkIfAtLeastOneTresholdDefined::true', () => {
    expect(g.checkIfAtLeastOneTresholdDefined()).toBe(true);
  });

  it('GBCtrl::checkIfAtLeastOneTresholdDefined::false', () => {
    g.resetTresholds();
    expect(g.checkIfAtLeastOneTresholdDefined()).toBe(false);
  });

  it('GBCtrl::deleteLinkToFlush::true', () => {
    expect(g.deleteLinkToFlush('uno')).toBe(true);
    expect(tresh.panel.flussi).toEqual({ Tabella1: ['Flusso', 'Flusso1', 'Flusso2'], Tabella2: ['f1', 'f2', 'f3'] });
    expect(g.panel.tresholdLinked.uno).toBe(false);
    expect(g.panel.tresholds.uno).toEqual([]);
  });

  it('GBCtrl::deleteLinkToFlush::false', () => {
    g.panel.monitoring = true;
    expect(g.deleteLinkToFlush('uno')).toBe(false);
    g.panel.monitoring = false;
  });

  it('GBCtrl::freeAllFlushes', () => {
    tresh.panel.tresholds = { uno: [], due: [] };
    tresh.addTreshold('due', 's1');
    tresh.panel.actualTable = 'Tabella2';
    tresh.panel.actualFlush = 'f2';
    tresh.confirmTresholdsChanges('due');
    g.freeAllFlushes();
    expect(g.panel.flussi).toEqual({ Tabella1: ['Flusso', 'Flusso1', 'Flusso2'], Tabella2: ['f1', 'f2', 'f3'] });
  });
});

describe('computation', () => {
  let tresh;
  beforeEach(() => {
    g = new GBCtrl();
    g.panel.availableDatabases = {
      DB1: {
        id: 1,
        name: 'DB1',
        password: 'pwd',
        type: 'influxdb',
        url: 'http://142.93.102.115:8086',
        user: 'USER',
      },
      DB2: {
        id: 2,
        name: 'TestData DB',
        password: '',
        type: 'testdata',
        url: 'http://localhost:8086',
        user: '',
      },
    };
    g.panel.databaseSelected = 'DB1';
    g.panel.name = 'Esempio';
    g.panel.selectedDB = 'DB1';
    g.server.connected = false;
    g.server.port = 8600;
    g.tryConnectServer();
    g.connectToDB();
    g.panel.nodes = ['uno', 'due', 'tre'];
    tresh = new TresholdCtrl();
    g.panel.flussi = { Tabella1: ['Flusso', 'Flusso1', 'Flusso2'], Tabella2: ['f1', 'f2', 'f3'] };
    g.panel.tresholds = { uno: [] };
    tresh.panel = g.panel;
    tresh.modalCreator = new ModalCreator();
    tresh.addTreshold('uno', 's1');
    tresh.panel.actualTable = 'Tabella1';
    tresh.panel.actualFlush = 'Flusso';
    tresh.confirmTresholdsChanges('uno');
    g.panel.temporalPolicy = { seconds: 10, minute: 1, hours: 0 };
    g.panel.temporalPolicyConfirmed = true;
  });

  // checkIfCanStartComputation
  it('GBCtrl::checkIfCanStartComputation::true', () => {
    expect(g.checkIfCanStartComputation()).toBe(true);
  });

  it('GBCtrl::checkIfCanStartComputation::false(selectedDB = null, collegatoAlDB = false)', () => {
    g.panel.selectedDB = null;
    g.panel.collegatoAlDB = false;
    expect(g.checkIfCanStartComputation()).toBe(false);
  });

  it('GBCtrl::checkIfCanStartComputation::false(selectedDB = null, collegatoAlDB = true)', () => {
    g.panel.selectedDB = null;
    g.panel.collegatoAlDB = true;
    expect(g.checkIfCanStartComputation()).toBe(false);
  });

  it('GBCtrl::checkIfCanStartComputation::false(selectedDB != null, collegatoAlDB = false)', () => {
    g.panel.selectedDB = 'DB1';
    g.panel.collegatoAlDB = false;
    expect(g.checkIfCanStartComputation()).toBe(false);
  });

  it('GBCtrl::checkIfCanStartComputation::false(selectedDB != null, collegatoAlDB = true)', () => {
    g.panel.selectedDB = 'DB1';
    g.panel.collegatoAlDB = true;
    g.panel.temporalPolicyConfirmed = false;
    expect(g.checkIfCanStartComputation()).toBe(false);
  });

  it('GBCtrl::checkIfCanStartComputation::false(no tresholds defined)', () => {
    g.resetTresholds();
    expect(g.checkIfCanStartComputation()).toBe(false);
  });

  it('GBCtrl::checkIfCanStartComputation::false(temporalPolicyConfirmed = false)', () => {
    g.panel.temporalPolicyConfirmed = false;
    expect(g.checkIfCanStartComputation()).toBe(false);
  });

  // startComputation
  it('GBCtrl::startComputation::true', async () => {
    g.panel.name = 'net';
    expect(await g.startComputation()).toBe(true);
  });

  it('GBCtrl::startComputation::false(temporalPolicyConfirmed = false)', async () => {
    g.panel.temporalPolicyConfirmed = false;
    expect(await g.startComputation()).toBe(false);
  });

  it('GBCtrl::startComputation::false(exception)', async () => {
    g.panel.name = 'Sachs';
    expect(await g.startComputation()).toBe(false);
  });

  // closeComputation
  it('GBCtrl::closeComputation::true', async () => {
    g.panel.name = 'net';
    g.panel.monitoring = true;
    expect(await g.closeComputation()).toBe(true);
    expect(g.panel.monitoring).toBe(false);
  });

  it('GBCtrl::closeComputation::false', async () => {
    g.panel.name = 'Sachs';
    g.panel.monitoring = true;
    expect(await g.closeComputation()).toBe(false);
    expect(g.panel.monitoring).toBe(true);
  });
});
