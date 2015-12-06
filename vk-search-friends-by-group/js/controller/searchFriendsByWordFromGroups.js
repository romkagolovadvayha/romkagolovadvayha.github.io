/**
 * SearchFriendsByWordFromGroupsCtrl
 */
'use strict';
app.controller('SearchFriendsByWordFromGroupsCtrl', function ($scope, ngToast, $timeout, cfpLoadingBar) {

    var array_members_in_groups;
    $.get('js/execute/get_array_members_in_groups.js', function () {}).fail(function(code) {
        array_members_in_groups = code.responseText
    });

    var array_groups_by_word;
    $.get('js/execute/get_array_groups_by_word.js', function () {}).fail(function(code) {
        array_groups_by_word = code.responseText
    });

    $scope.search = function () {
        var code = array_groups_by_word
            .replace("$word$", $scope.word);
        VK.api("execute", {code: code, https: 1}, function (data) {
            console.log(data);
            get_friends_from_groups(data.response.items, 0, data.response.items.length);
        });
    };

    var get_friends_from_groups = function (items, offset, count) {
        var groups_ids = [];
        var index = 0;
        for (var i = offset; i < offset + 25; i++) {
            if (offset < count) {
                groups_ids[index] = items[offset + i].id;
                index++;
            }
        }
        var code = array_members_in_groups
            .replace("$groups_ids$", JSON.stringify(groups_ids));
        console.log(code); //
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