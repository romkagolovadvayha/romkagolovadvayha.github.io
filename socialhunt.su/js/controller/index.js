/**
 * IndexCtrl
 */
'use strict';
app.controller('IndexCtrl', function ($scope, ngToast, $timeout, cfpLoadingBar) {

    $scope.getCookie = function (name) {
        var matches = document.cookie.match(new RegExp(
            "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
        ));
        return matches ? decodeURIComponent(matches[1]) : undefined;
    };

    $scope.setCookie = function (name, value, options) {
        options = options || {};

        var expires = options.expires;

        if (typeof expires == "number" && expires) {
            var d = new Date();
            d.setTime(d.getTime() + expires * 1000000);
            expires = options.expires = d;
        }
        if (expires && expires.toUTCString) {
            options.expires = expires.toUTCString();
        }

        value = encodeURIComponent(value);

        var updatedCookie = name + "=" + value;

        for (var propName in options) {
            updatedCookie += "; " + propName;
            var propValue = options[propName];
            if (propValue !== true) {
                updatedCookie += "=" + propValue;
            }
        }

        document.cookie = updatedCookie;
    };

    $scope.bModal_ = false;
    $scope.bNext = false;

    $scope.cookies_user = {
        first_name: $scope.getCookie("first_name"),
        last_name: $scope.getCookie("last_name"),
        uid: $scope.getCookie("uid")
    };

    var name = $('#name');
    $scope.modalOpen = function () {
        if (!$scope.name && $scope.cookies_user.uid > 0) {
            $scope.name = $scope.cookies_user.first_name + " " + $scope.cookies_user.last_name;
        }
        $scope.bModal_ = true;
        $scope.bNext = false;
        setTimeout(function () {
            name.focus();
        }, 100);
    };

    $scope.modalClose = function () {
        $scope.bModal_ = false;
        $scope.name = "";
        $scope.phone = "";
    };

    $scope.writeError = function (error) {
        ngToast.success(error);
    };

    $scope.name = "";
    $scope.phone = "";
    $scope.code = "";
    $scope.name_result = "";
    $scope.phone_result = "";
    $scope.next = function () {
        if ($scope.name && $scope.phone) {
            $scope.bNext = true;
            $scope.code = "";
            $scope.name_result = $scope.name;
            $scope.phone_result = $scope.phone;
        } else {
            $scope.bNext = false;
            if (!$scope.name) {
                $scope.writeError("Введите ваше имя!");
                name.focus();
            } else {
                $scope.writeError("Введите ваш телефон!");
                $('#phone').focus();
            }
        }
    };

    $scope.nextClose = function () {
        $scope.bNext = false;
    };

    $scope.done = function () {
        if ($scope.code) {
            $scope.writeError("Неверный код!");
        } else {
            $scope.writeError("Введите код пришедший по смс!");
            $('#code').focus();
        }
    };

    /* VK SCRIPT */
    var LIKE_ID = 5028781;
    VK.init({
        apiId: LIKE_ID,
        onlyWidgets: true
    });

    var settings = {
        type: "button",
        verb: 1,
        height: 24
    };

    VK.Widgets.Like("style_1", settings);
    VK.Widgets.Like("style_2", settings);
    VK.Widgets.Like("style_3", settings);
    VK.Widgets.Like("style_4", settings);

    VK.Observer.subscribe("widgets.like.liked", function () {
        $.ajax({
            url: 'https://api.vk.com/method/likes.getList?' +
            'type=sitepage' +
            '&page_url=' + window.location +
            '&extended=1' +
            '&owner_id=' + LIKE_ID,
            dataType: "jsonp",
            success: function (data) {
                if (data.response) {
                    var user = data.response.items[0];
                    var options = {expires: 1000000};
                    $scope.cookies_user = user;
                    $scope.setCookie('first_name', user.first_name, options);
                    $scope.setCookie('last_name', user.last_name, options);
                    $scope.setCookie('uid', user.uid, options);
                    $scope.name = user.first_name + " " + user.last_name;
                    $scope.modalOpen();
                    $scope.$digest();
                }
            }
        });
    });

    VK.Auth.getLoginStatus(function (response) {
        if (response.status === 'unknown')
            $('.button_style').hide();
    });

    /* FACEBOOK */
    /*window.fbAsyncInit = function() {
        FB.init({
            appId      : '541655625974843',
            xfbml      : true,
            version    : 'v2.4'
        });
        FB.api(
            "/541655625974843/likes",
            function (response) {
                console.log(response);
                if (response && !response.error) {
                }
            }
        );
        FB.Event.subscribe('edge.create', function (href, widget) {
            alert('You just liked the page!');
        });
        FB.getLoginStatus(function(response) {
            if (response.status === 'unknown') {
                alert('pshol nah');
                $('.fb-like').hide();
            }
        });
    };*/

    /* GOOGLE PLUS ONE */
    $scope.onYtEvent = function (jsonParam) {

        console.log(jsonParam.eventType == 'subscribe');
        console.log(jsonParam);

    };

});