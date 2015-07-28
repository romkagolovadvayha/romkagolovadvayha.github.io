/**
 * IndexCtrl
 */
'use strict';
app.controller('IndexCtrl', function ($scope) {
    $scope.like_id = 4885608;
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

    $scope.setUser = function() {
        VK.Api.call('likes.getList', {
            type: 'sitepage',
            page_url: 'http://romkagolovadvayha.github.io/ask',
            extended: 1,
            owner_id: $scope.like_id
        }, function (data) {
            if (data.response) {
                var oUser = data.response.items[0];
                oUser.text = $scope.question_text;
                oUser.type = $scope.type ? 1 : 0;
                oUser.date = moment().format();
                $scope.setStorageArrayObjects('questions_list', JSON.stringify(oUser));
            }
        });
    };

    $scope.setStorageArrayObjects = function(key, oObject) {
        oObject = JSON.parse(oObject);
        VK.Api.call('storage.get', {key: key, global: 1}, function (dataGet) {
            if (dataGet.response) {
                var arrObjectsList = JSON.parse(dataGet.response);
                oObject.id = arrObjectsList.length;
                arrObjectsList[arrObjectsList.length] = oObject;
                VK.Api.call('storage.set', {
                    key: key,
                    value: JSON.stringify(arrObjectsList),
                    global: 1
                }, function (dataSet) {
                    if (dataSet.response) {
                        $scope.questionsList = arrObjectsList;
                        $scope.$digest();
                    }
                });
            }
        });
    };

    $scope.clearStorage = function(key, defaultValue) {
        VK.Api.call('storage.set', {key: key, value: defaultValue, global: 1}, function (dataGet) {

        });
    };
    //$scope.clearStorage('questions_list', '[]');

    $scope.getQuestionsList = function() {
        VK.Api.call('storage.get', {key: 'questions_list', global: 1}, function (dataGet) {
            if (dataGet.response) {
                $scope.questionsList = JSON.parse(dataGet.response);
                $scope.$digest();
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