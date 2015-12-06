/**
 * SearchFriendsByWordFromGroupsCtrl
 */
'use strict';
app.controller('SearchFriendsByWordFromGroupsCtrl', function ($scope, ngToast, $timeout, cfpLoadingBar) {

    $scope.word = "Порно";

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
            get_friends_from_groups(data.response, 0, data.response.length);
        });
    };

    var get_friends_from_groups = function (items, offset, count) {
        var groups = [];
        for (var i = offset, j = 0; i < offset + 25; i++, j++) {
            if (i < count) {
                groups[i] = items[i];
            }
        }
        var code = array_members_in_groups
            .replace("$groups_ids$", JSON.stringify(groups));
        console.log(code); //
    };

    $(document).bind('keydown', function () {
        if (event.keyCode == 13) {
            $scope.search();
        }
    });


});