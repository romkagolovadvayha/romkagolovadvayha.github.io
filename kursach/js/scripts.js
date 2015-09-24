var app = angular.module('application', ['ngToast', 'chart.js', 'cfp.loadingBar'])
    .config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
    cfpLoadingBarProvider.latencyThreshold = 500;
}]);