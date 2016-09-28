var app = angular.module('application', ['ngToast', 'chart.js', 'cfp.loadingBar']);

var myGroups = [];

var getUrlParameter = function getUrlParameter (sParam) {
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

var setBalance = function (user_id_, balance_, callback) {
    /*$.ajax({
        url: 'https://byunow.ru/VKAPI/api.php?q=3&user_id=' + user_id_ + '&balance=' + balance_,
        dataType: "jsonp",
        success: function (data) {
            callback(balance_);
        }
    });*/
    //callback(balance_);
};

var error_mod_ser = function error_mod_ser (error) {
    $('#errore').html(error);
};
