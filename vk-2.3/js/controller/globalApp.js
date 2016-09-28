/**
 * GlobalAppCtrl
 */
'use strict';
app.controller('GlobalAppCtrl', function ($scope, ngToast, $timeout, cfpLoadingBar) {

    $scope.user = JSON.parse(getUrlParameter('api_result')).response[0];
    $scope.balance = balance;
    $.ajax({
        url: 'https://byunow.ru/VKAPI/api.php?q=2&user_id=' + $scope.user.uid,
        dataType: "jsonp",
        success: function (data) {
            $scope.balance = balance = data[0].balance;
            $scope.$digest();
        }
    });

    VK.addCallback('onOrderSuccess', function(order_id) {
        $.ajax({
            url: 'https://byunow.ru/VKAPI/api.php?q=2&user_id=' + $scope.user.uid,
            dataType: "jsonp",
            success: function (data) {
                $scope.balance = balance = data[0].balance;
                $scope.$digest();
            }
        });
    });

});