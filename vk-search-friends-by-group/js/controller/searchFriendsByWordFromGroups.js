/**
 * SearchFriendsByWordFromGroupsCtrl
 */
'use strict';
app.controller('SearchFriendsByWordFromGroupsCtrl', function ($scope, ngToast, $timeout, cfpLoadingBar) {

    //$scope.addGroup = function (groupID) {
    //    VK.api('groups.getById', {group_id: groupID, fields: 'members_count', v: '5.37', https: 1}, function (data) {
    //        if (data.response) {
    //            data.response[0].membersListCount = 'Количество участников: ' + data.response[0].members_count;
    //            $scope.checkAdds(data.response[0], 'Группа уже добавлена в список');
    //            cfpLoadingBar.complete();
    //            $scope.$digest();
    //        }
    //    });
    //};

    var array_members_in_groups;
    $.get('js/execute/array_members_in_groups.js', function () {}).fail(function(code) {
        array_members_in_groups = code.responseText
    });

    $scope.search = function () {
        VK.api('groups.search', {
            q: $scope.word,
            count: 1000,
            https: 1,
            v: '5.40'
        }, function (data) {
            var code = array_members_in_groups.replace("$data$", data);
            console.log(code);
        });
    };

    $scope.invite = function () {
        VK.callMethod('showInviteBox');
    };
    $scope.wall = function () {
        VK.api('wall.post', {
            message: 'Всевидящее око! Узнай по слову (Например: "Порно") все группы в которых состоят ваши друзья. https://vk.com/app3278556',
            attachments: 'photo33610634_350256389, https://vk.com/app3278556',
            https: 1
        }, function (data) {

        });
    };

    $(document).bind('keydown', function () {
        if (event.keyCode == 13) {
            $scope.search();
        }
    });


});