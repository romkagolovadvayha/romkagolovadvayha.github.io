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

    VK.addCallback('onOrderSuccess', function(order_id) {
        $.ajax({
            url: 'https://byunow.ru/VKAPI/api.php?q=2&user_id=' + $scope.user.uid,
            dataType: "jsonp",
            success: function (data) {
                $scope.balance = data[0].balance;
                $scope.$digest();
            }
        });
    });

});