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
                    url: '/php/add_project.php?'
                    + '&project_url=' + $scope.project_redirect_url
                   + '&project_name=' + $scope.project_name,
                    dataType: "jsonp",
                    success: function (data) {
                        console.log(data);
                        $scope.url_1 = "http://app.inura.ru/image/" + data + ".jpg";
                        $scope.url_2 = "http://app.inura.ru/project/" + data + "";
                        $scope.writeError('Проект успешно создан!');
                        $scope.$digest();
                    },
                    error: function(data) {
                        console.log(data);
                        $scope.url_1 = "http://app.inura.ru/image/" + data.responseText + ".jpg";
                        $scope.url_2 = "http://app.inura.ru/project/" + data.responseText + "";
                        $scope.writeError('Проект успешно создан!');
                        $scope.$digest();
                    }
                });

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