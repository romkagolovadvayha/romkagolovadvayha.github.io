/**
 * OnlineMemberCtrl
 */
'use strict';
app.controller('IndexCtrl', function ($scope, ngToast, $timeout, cfpLoadingBar) {

    $scope.form_post = false;
    $scope.error_post = false;

    $scope.groupFormActive = false;

    $scope._form_post = function () {
        cfpLoadingBar.start();
        $scope.error_post = false;
        $scope.form_post = true;
        if (!$scope.project_name)
            $scope.error_post = true;
        if (!$scope.project_redirect_url)
            $scope.error_post = true;

        cfpLoadingBar.complete();
            if ($scope.error_post)
                $scope.writeError('Неверно заполнены поля!');
            else {
                $.ajax({
                    url: 'tyfy',
                    dataType: "jsonp",
                    success: function (data) {

                    }
                });
                var id = 324234;
                var md5 = MD5($scope.project_name + id);
                $scope.url_1 = "http://app.inura.ru/images/" + md5 + ".jpg";
                $scope.url_2 = "http://app.inura.ru/project/" + md5 + "";
                $scope.writeError('Проект успешно создан!');
            }
    };

    $scope.reset = function () {
        $scope.groupFormActive = false;
    };

    $scope.writeError = function (error) {
        ngToast.success(error);
        $scope.$digest();
    };


});