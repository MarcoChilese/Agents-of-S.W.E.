// JSHint options
/* jshint ignore:start */

export class PanelCtrl {
  constructor($scope, $injector) {
    this.$injector = $injector;
    this.$scope = $scope;
    this.panel = {};
    this.events = {
      on: () => {},
    };
    this.pluginId = 'GrafanaAndBayes';
  }

  addEditorTab(title, directiveFn, index) {
  }

  $timeout() {}
}
