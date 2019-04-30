// JSHint options
/* globals global: false */
import { JSDOM } from 'jsdom';
import { PanelCtrl } from './panelMock';

// Mock Grafana modules that are not available outside of the core project
// Required for loading module.js
jest.mock('angular', () => ({
  module() {
    return {
      directive() {},
      service() {},
      factory() {},
    };
  },
}), { virtual: true });

const mockPanelCtrl = PanelCtrl;
jest.mock('grafana/app/plugins/sdk', () => ({
  QueryCtrl: null,
  loadPluginCss: () => {},
  PanelCtrl: mockPanelCtrl,
}), { virtual: true });


jest.mock('grafana/app/core/config', () => ({
  buildInfo: { env: 'development' },
}), { virtual: true });

jest.mock('grafana/app/core/core', () => ({
  coreModule: { controller() {} },
  appEvents: { emit() {} },
}), { virtual: true });


// jest.mock('jquery', () => ({
//   $: { ajax() { return 5; } },
// }), { virtual: true });

jest.mock('better-jsbayes-viz', () => ({
  fromGraph: (p1, p2) => {},
  draw: () => {},
}), { virtual: true });


// Required for loading angularjs
const dom = new JSDOM('<html><head><script></script></head><body></body></html>');
// Setup jsdom
global.window = dom.window;
global.document = global.window.document;
global.Node = window.Node;
