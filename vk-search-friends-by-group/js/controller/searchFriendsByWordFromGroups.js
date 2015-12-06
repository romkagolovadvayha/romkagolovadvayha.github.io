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

    $scope.search = function () {
        VK.api("groups.search", {q: $scope.word, count: "1000", https: "1", v: "5.40"}, function (data) {
            var groups_public = [];
            var items = data.response.items;
            for (var i = 0; i < items.length; i++) {
                if (items[i].is_closed == 0 || items[i].is_closed == 1) {
                    groups_public[groups_public.length] = items[i].id;
                }
            }
            get_friends_from_groups(groups_public.response, 0, groups_public.length);
        });
    };

    console.clear();
    var array_groups_and_items = [];
    var get_friends_from_groups = function (items, offset, count) {
        var groups = [];
        for (var i = offset, j = 0; i < offset + 25; i++, j++) {
            if (i < count) {
                groups[j] = items[i];
            }
        }
        var code = array_members_in_groups
            .replace("$groups_ids$", JSON.stringify(groups));
        console.log(code);
        VK.api("execute", {code: code, https: 1}, function (data) {
            array_groups_and_items = ArrMath.Sum(array_groups_and_items, data.response);
            if (offset + 25 < count) {
                setTimeout(function () {
                    get_friends_from_groups(items, offset + 25, count);
                }, 350);
            } else {
                console.log(array_groups_and_items);
            }
        });
    };

    $(document).bind('keydown', function () {
        if (event.keyCode == 13) {
            $scope.search();
        }
    });


});