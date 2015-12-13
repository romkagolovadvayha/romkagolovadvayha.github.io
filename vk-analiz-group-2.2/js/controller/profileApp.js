/**
 * ProfileAppCtrl
 */
'use strict';
app.controller('ProfileAppCtrl', function ($scope, ngToast, $timeout, cfpLoadingBar) {

    var getUrlParameter = function getUrlParameter(sParam) {
        var sPageURL = decodeURIComponent(window.location.search.substring(1)),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;

        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');

            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : sParameterName[1];
            }
        }
    };

    $scope.user = JSON.parse(getUrlParameter('api_result')).response[0];
    $scope.balance = 0;
    $.ajax({
        url: 'https://byunow.ru/VKAPI/api.php?q=2&user_id=' + $scope.user.uid,
        dataType: "jsonp",
        success: function (data) {
            $scope.balance = data[0].balance;
            $scope.$digest();
        }
    });

});