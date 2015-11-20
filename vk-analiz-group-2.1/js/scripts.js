var app = angular.module('application', ['ngToast', 'chart.js', 'cfp.loadingBar']);

var myGroups = [];
VK.api('groups.get', {extended: 1, v: '5.40', https: 1, count: 300}, function (data) {
    if (data.response) {
        var myGroups = data.response.items;
    }
});

//VK.init({
//    apiId: 4965958
//});