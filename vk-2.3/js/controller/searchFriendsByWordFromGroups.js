/**
 * SearchFriendsByWordFromGroupsCtrl
 */
'use strict';
app.controller('SearchFriendsByWordFromGroupsCtrl', function ($scope, ngToast, $timeout, cfpLoadingBar) {

    $scope.word = "";
    $scope.limit = 30;
    $scope.sort = '-items.length';
    $scope.result_array = [];

    var array_members_in_groups;
    $.get('https://romkagolovadvayha.github.io/vk-search-friends-by-group/js/execute/get_array_members_in_groups.js', function () {
    }).fail(function (code) {
        array_members_in_groups = code.responseText;
        //console.clear();
    });

    $scope.search = function () {
        //console.clear();
        if ($scope.word) {
            $scope.result_array = [];
            $scope.disabled = true;
            cfpLoadingBar.start();
            VK.api("groups.search", {q: $scope.word, count: "1000", https: "1", v: "5.40"}, function (data) {
                var groups_public = [];
                var items = data.response.items;
                for (var i = 0; i < items.length; i++) {
                    if (items[i].is_closed == 0 || items[i].is_closed == 1) {
                        groups_public[groups_public.length] = items[i].id;
                    }
                }
                setTimeout(function () {
                    array_groups_and_items = [];
                    get_friends_from_groups(groups_public, 0, groups_public.length);
                }, 350);
            });
        } else {
            cfpLoadingBar.complete();
            $scope.writeError('Введите слово');
        }
    };

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

        VK.api("execute", {code: code, https: 1}, function (data) {
            array_groups_and_items = ArrMath.Sum(array_groups_and_items, JSON.parse(data.response));
            if (offset + 25 < count) {
                setTimeout(function () {
                    get_friends_from_groups(items, offset + 25, count);
                }, 350);
            } else {
                var result_array_groups = [];
                var groups_ids = [];
                var users_ids = [];
                for (var i = 0; i < array_groups_and_items.length; i++) {
                    if (array_groups_and_items[i].items.length > 0) {
                        result_array_groups[result_array_groups.length] = array_groups_and_items[i];
                        groups_ids[groups_ids.length] = array_groups_and_items[i].id;
                        users_ids = ArrMath.Sum(users_ids, array_groups_and_items[i].items);
                    }
                }

                setTimeout(function () {
                    var result_array = [];
                    VK.api("groups.getById", {group_ids: groups_ids.join(), https: "1", v: "5.40"}, function (groups) {
                        VK.api("users.get", {
                            user_ids: users_ids.join(),
                            fields: "photo_50",
                            https: "1",
                            v: "5.40"
                        }, function (users) {
                            if (groups && groups.response && groups.response.length) {
                                for (var i = 0; i < groups.response.length; i++) {
                                    var items = [];
                                    for (var j = 0; j < result_array_groups[i].items.length; j++) {
                                        for (var r = 0; r < users.response.length; r++) {
                                            if (result_array_groups[i].items[j] == users.response[r].id) {
                                                items[items.length] = users.response[r];
                                            }
                                        }
                                    }
                                    result_array[result_array.length] = {group: groups.response[i], items: items};
                                }
                            } else {
                                cfpLoadingBar.complete();
                                $scope.disabled = false;
                            }
                            cfpLoadingBar.complete();
                            $scope.disabled = false;
                            $scope.result_array = result_array;
                            //console.log(result_array);
                            $scope.$digest();
                        });
                    });
                }, 350);

            }
        });
    };

    $(document).bind('keydown', function () {
        if (event.keyCode == 13) {
            $scope.search();
        }
    });

    $scope.writeError = function (error) {
        ngToast.success(error);
        $scope.$digest();
    };

});