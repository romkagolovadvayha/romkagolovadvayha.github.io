/**
 * OnlineMemberCtrl
 */
'use strict';
app.controller('OnlineMemberCtrl', function ($scope, ngToast, $timeout, cfpLoadingBar) {

    $scope.form_post = false;
    $scope.error_post = false;
    $scope.count_members = 1000;

    $scope.country = "Любая";
    $scope.sex = "Любой";

    $scope.price = {
        member: 3 / 100,
        sex: 2 / 100,
        country: 1 / 100
    };

    $scope.group = {
        name: null,
        members_count: null,
        photo_50: null,
        screen_name: null
    };
    $scope.groupFormActive = false;

    $scope._form_post = function () {
        cfpLoadingBar.start();
        $scope.error_post = false;
        $scope.form_post = true;
        if (!$scope.groupUrl)
            $scope.error_post = true;
        if (($scope.count_members == 0) || !$scope.count_members)
            $scope.error_post = true;

        cfpLoadingBar.complete();
            if ($scope.error_post)
                $scope.writeError('Неверно заполнены поля!');

    };

    $scope.reset = function () {
        $scope.groupFormActive = false;
    };

    $scope.start = function (response) {
        cfpLoadingBar.start();
        var url = $scope.groupUrl;
        if (url) {
            if (response && response.session) {
                if (url.indexOf("com/") >= 0)
                    url = url.split('com/')[1];
                VK.Api.call('utils.resolveScreenName', {screen_name: url, v: '5.27'}, function (data) {
                    if (data.response) {
                        if (data.response.type == 'group') {
                            $scope.getGroupsInfo(data.response.object_id);
                            //$scope.startStats(data.response.object_id);
                        } else {
                            cfpLoadingBar.complete();
                            $scope.writeError('Неверно указана ссылка');
                        }
                    }
                });
            } else {
                cfpLoadingBar.complete();
                VK.Auth.login($scope.start);
            }
        } else {
            cfpLoadingBar.complete();
            $scope.writeError('Введите ссылку');
        }
    };

    $scope.startVK = function () {
        VK.Auth.getLoginStatus($scope.start);
    };


    $scope.writeError = function (error) {
        ngToast.success(error);
        $scope.$digest();
    };


    $scope.groupID = 0;
    $scope.getGroupsInfo = function (groupID) {
        VK.Api.call('groups.getById', {group_id: groupID, fields: 'members_count', v: '5.34'}, function (data) {
            if (data.response) {
                $scope.group = data.response[0];
                $scope.groupID = groupID;
                cfpLoadingBar.complete();
                $scope.groupFormActive = true;
                $scope.$digest();
            }
        });
    };


});