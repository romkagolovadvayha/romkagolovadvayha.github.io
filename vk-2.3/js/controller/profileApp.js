/**
 * ProfileAppCtrl
 */
'use strict';
app.controller('ProfileAppCtrl', function ($scope, ngToast, $timeout, cfpLoadingBar) {

    $scope.userProfile = JSON.parse(getUrlParameter('api_result')).response[0];
    $scope.balance = 99999;
    $scope.setBalance = function(balance){
        $scope.balance = balance;
        $scope.$digest();
    };
    /*$.ajax({
        url: 'https://byunow.ru/VKAPI/api.php?q=2&user_id=' + $scope.userProfile.uid,
        dataType: "jsonp",
        success: function (data) {
            $scope.setBalance(data[0].balance);
        }
    });*/
    VK.addCallback('onOrderSuccess', function(order_id) {
       /* $.ajax({
            url: 'https://byunow.ru/VKAPI/api.php?q=2&user_id=' + $scope.userProfile.uid,
            dataType: "jsonp",
            success: function (data) {
                $scope.setBalance(data[0].balance);
            }
        });*/
        //$scope.setBalance(10);
    });

    $scope.pr_ = 'id';
    $scope.symbol = ',';

});
