/**
 * BalanceAppCtrl
 */
'use strict';
app.controller('BalanceAppCtrl', function ($scope, ngToast, $timeout, cfpLoadingBar) {

    console.log('error0');
    var showOrderBox = function (item) {
        var params = {
            type: 'item',
            item: item
        };
        console.log('error1');
        VK.callMethod('showOrderBox', params);
        console.log('error2');
    };

});