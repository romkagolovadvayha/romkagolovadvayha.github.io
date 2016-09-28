/**
 * ProfileCtrl
 */
'use strict';
app.controller('ProfileCtrl', function ($scope, ngToast, $timeout, cfpLoadingBar) {

    $('#show-profile').on('shown.bs.tab', function (e) {
        var user_id = 1;
        $.get('https://www.kahoxa.ru/flash_frame/vkscan/date.php?id=' + user_id).success(
            function(data) {
                   console.log(data);
            }
        );
    });

});