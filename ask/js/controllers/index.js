/**
 * IndexCtrl
 */
'use strict';
app.controller('IndexCtrl', function ($scope) {
    $scope.like_id = 2866099;
    var url_method = "http://ca59531.tmweb.ru/";
    $scope.questionsList = [];
    $scope.question_text = "";
    $scope.type = true;

    $scope.typeQuestion = "";
    $scope.typeQuestionCallback = function (filter) {
        $scope.typeQuestion = filter;
    };

    $scope.typeCallback = function () {
        $scope.type = !$scope.type;
    };

    moment.locale('ru');
    $scope.momentDate = function (date) {
        return moment(date).startOf('second').fromNow();
    };

    VK.Widgets.Like("vk_groups", {type: "button"});
    VK.Observer.subscribe("widgets.like.liked", function () {
        $scope.setUser();
    });

    $scope.setUser = function () {
        $.ajax({
            url: 'https://api.vk.com/method/likes.getList?' +
            'type=sitepage' +
            '&page_url=' + window.location +
            '&extended=1' +
            '&owner_id=' + $scope.like_id,
            dataType: "jsonp",
            success: function (data) {
                if (data.response) {
                    var oUser = data.response.items[0];
                    oUser.text = $scope.question_text;
                    oUser.type = $scope.type ? 1 : 0;
                    oUser.date = moment().toISOString();
                    $scope.setStorageArrayObjects('questions_list', JSON.stringify(oUser));
                }
            }
        });
    };

    $scope.setStorageArrayObjects = function (key, oObject) {
        oObject = JSON.parse(oObject);
        $.ajax({
            url: url_method + 'storage.get?' +
            'key=' + key +
            '&global=1' +
            '&access_token=' + access_token,
            dataType: "jsonp",
            success: function (dataGet) {

                if (dataGet.response) {
                    var arrObjectsList = JSON.parse(dataGet.response);
                    oObject.id = arrObjectsList.length;
                    arrObjectsList[arrObjectsList.length] = oObject;
                    $.ajax({
                        url: url_method + 'storage.set?' +
                        'value=' + JSON.stringify(arrObjectsList) +
                        '&key=' + key +
                        '&global=1' +
                        '&access_token=' + access_token,
                        dataType: "jsonp",
                        success: function (dataSet) {
                            if (dataSet.response) {
                                $scope.questionsList = arrObjectsList;
                                $scope.$digest();
                            }
                        }
                    });
                }

            }
        });
    };

    $scope.clearStorage = function (key, defaultValue) {
        $.ajax({
            url: url_method + 'storage.set?' +
            'value=' + defaultValue +
            '&key=' + key +
            '&global=1' +
            '&access_token=' + access_token,
            dataType: "jsonp",
            success: function (dataSet) {
            }
        });
    };

    $scope.getQuestionsList = function () {

        $.ajax({
            url: url_method + 'storage.get?' +
            'key=questions_list' +
            '&global=1' +
            '&access_token=' + access_token,
            dataType: "jsonp",
            success: function (dataGet) {
                if (dataGet.response) {
                    $scope.questionsList = JSON.parse(dataGet.response);
                    $scope.$digest();
                }
            }
        });


    };
    $scope.getQuestionsList();

    $('.vk_groups_btn').mouseenter(function () {
        setTimeout(function () {
            if (!$('iframe').is('#vkwidget1_tt')) {
                $('.vk_groups_btn').hide();
            }
        }, 100);
    });


});