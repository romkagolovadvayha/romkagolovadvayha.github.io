var app = angular.module('application', ['ngToast', 'chart.js', 'cfp.loadingBar']);

$scope.myGroups = [];
VK.api('groups.get', {extended: 1, v: '5.40', https: 1}, function (data) {
    if (data.response) {
        $scope.myGroups = data.response;
    }
});

//VK.init({
//    apiId: 4965958
//});