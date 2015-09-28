/**
 * IndexCtrl
 */
'use strict';
app.controller('IndexCtrl', function ($scope, ngToast, $timeout, cfpLoadingBar) {

    $scope.form_post = false;
    $scope.error_post = false;
    $scope.indent_char = "\t";
    $scope.indent_size = "1";

    $scope.code = '$scope._form_post = function () {cfpLoadingBar.start();$scope.error_post = false;$scope.form_post = true;if (!$scope.code)$scope.error_post = true;cfpLoadingBar.complete(); for (var i=0;i<10;i++) {var u = 0;}};';

    $scope.groupFormActive = false;

    $scope._form_post = function () {
        cfpLoadingBar.start();
        $scope.error_post = false;
        $scope.form_post = true;
        if (!$scope.code)
            $scope.error_post = true;

        cfpLoadingBar.complete();
        if ($scope.error_post)
            $scope.writeError('Неверно заполнены поля!');
        else {
            $scope.code = js_beautify($scope.code, {
                'indent_size': $scope.indent_size,
                'indent_char': $scope.indent_char
            });
            $scope.writeError('Код успешно отформатирован!');
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