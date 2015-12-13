/**
 * ProfileAppCtrl
 */
'use strict';
app.controller('ProfileAppCtrl', function ($scope, ngToast, $timeout, cfpLoadingBar) {

    var showOrderBox = function (item) {
        var params = {
            type: 'item',
            item: item
        };
        VK.callMethod('showOrderBox', params);
    };

});