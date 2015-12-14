/**
 * ProfileAppCtrl
 */
'use strict';
app.controller('ProfileAppCtrl', function ($scope, ngToast, $timeout, cfpLoadingBar) {

    $scope.userProfile = JSON.parse(getUrlParameter('api_result')).response[0];
    $scope.balance = 0;
    $.ajax({
        url: 'https://byunow.ru/VKAPI/api.php?q=2&user_id=' + $scope.userProfile.uid,
        dataType: "jsonp",
        success: function (data) {
            $scope.balance = data[0].balance;
            $scope.$digest();
        }
    });

    VK.addCallback('onOrderSuccess', function(order_id) {
        $.ajax({
            url: 'https://byunow.ru/VKAPI/api.php?q=2&user_id=' + $scope.userProfile.uid,
            dataType: "jsonp",
            success: function (data) {
                $scope.balance = data[0].balance;
                $scope.$digest();
            }
        });
    });

});