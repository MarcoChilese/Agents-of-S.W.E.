// import $ from 'jquery';
import { loadPluginCss } from 'grafana/app/plugins/sdk';
import { GBCtrl } from './GBCtrl';
import { TresholdsCtrl } from './TresholdsCtrl';
import { TemporalPolicyCtrl } from './TemporalPolicyCtrl';
import './css/panel.base.css';
import './css/panel.dark.css';


loadPluginCss({
  dark: 'plugins/G&BPlugin/GrafanaAndBayes/src/css/panel.base.css',
  light: 'plugins/G&BPlugin/GrafanaAndBayes/src/css/panel.dark.css',
});

export {
  TemporalPolicyCtrl,
  TresholdsCtrl as TresholdCtrl,
  GBCtrl as PanelCtrl,
};
