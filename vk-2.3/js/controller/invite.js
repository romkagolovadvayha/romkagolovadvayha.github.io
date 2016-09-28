/**
 * InviteCtrl
 */
'use strict';
app.controller('InviteCtrl', function ($scope) {

    $scope.invite = function () {
        VK.callMethod('showInviteBox');
    };

    $scope.wall = function () {
        VK.api('wall.post', {
            message: 'Всевидящее око! Узнай по слову (Например: "Порно") все группы в которых состоят ваши друзья. https://vk.com/app3278556',
            attachments: 'photo33610634_350256389, https://vk.com/app3278556',
            https: 1
        }, function (data) {});
    };

});