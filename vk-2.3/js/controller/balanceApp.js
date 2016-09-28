/**
 * BalanceAppCtrl
 */
'use strict';
app.controller('BalanceAppCtrl', function ($scope, ngToast, $timeout, cfpLoadingBar) {

    console.clear();
    $scope.showOrderBox = function (item) {
        var params = {
            type: 'item',
            item: item
        };
        VK.callMethod('showOrderBox', params);
    };

});