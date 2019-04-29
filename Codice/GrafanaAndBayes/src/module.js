// import $ from 'jquery';
import { loadPluginCss } from 'grafana/app/plugins/sdk';
import { GBCtrl } from './GBCtrl';
import { TresholdsCtrl } from './TresholdsCtrl';
import { TemporalPolicyCtrl } from './TemporalPolicyCtrl';
import './css/panel.base.css';
import './css/panel.dark.css';
import './css/panel.light.css';
import './css/style.css';


loadPluginCss({
  dark: './css/panel.dark.css',
  base: './css/panel.base.css',
  light: './css/panel.light.css',
  custom: './css/style.css'
});

export {
  TemporalPolicyCtrl,
  TresholdsCtrl as TresholdCtrl,
  GBCtrl as PanelCtrl,
};
