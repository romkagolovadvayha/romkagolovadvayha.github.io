/**
 * PrivateFriendsCtrl
 */
'use strict';
app.controller('PrivateFriendsCtrl', function ($scope, ngToast, $timeout, cfpLoadingBar) {

    $('#show-private-friends').on('shown.bs.tab', function (e) {
        $scope.start = function () {
            cfpLoadingBar.start();
            var url = $scope.userUrl;
            if (url) {
                if (url.indexOf("com/") >= 0)
                    url = url.split('com/')[1];
                VK.Api.call('utils.resolveScreenName', {screen_name: url, v: '5.27'}, function (data) {
                    if (data.response) {
                        cfpLoadingBar.complete();
                        if (data.response.type == 'user') {
                            $scope.addUser(data.response.object_id);
                        } else {
                            ngToast.create('Неверно указана ссылка');
                        }
                    }
                });
            } else {
                cfpLoadingBar.complete();
                $scope.writeError('Введите ссылку');
            }
        };

        var getFriends = function (user_id) {
            setTimeout(function () {
                // друзья пользователя
                VK.Api.call('friends.get', {user_id: user_id, v: '3.0'}, function (data) {
                    if (data.response) {
                        getFriendsFriends(data.response, 0);
                    }
                });
            }, 350); // задержка 0.35 с.
        };

        var sum_sort_arr = function (array_1, array_2)
        {
            var n = array_1.length, m = array_2.length, i = 0, k = 0, j = 0, array_3 = [];
            while ((i < n) && (j < m)) // пока не дошли до конца массива
            {
                if (array_1[i] == array_2[j])
                {
                    array_3[k] = array_1[i];
                    k++,i++,j++;
                } else {
                    if (array_1[i] < array_2[j]) {
                        array_3[k] = array_1[i];
                        k++;
                        i++; // сдвинем позицию в первом массиве
                    } else {
                        array_3[k] = array_2[j];
                        k++;
                        j++; // сдвинем позицию во втором массиве
                    }
                }
            }
            while (i < n) {
                array_3[k] = array_1[i];
                k++, i++;
            }
            while (j < m) {
                array_3[k] = array_2[j];
                k++, j++;
            }
            return array_3;
        };

        $scope.arrFriendsFriends = [];
        var getFriendsFriends = function (arrFriends, offset) {

            var arrFriendsToStep = [];
            var end = arrFriends.length < offset + 24 ? arrFriends.length : offset + 24;
            for (var i = offset; i < end; i++) {
                arrFriendsToStep[arrFriendsToStep.length] = arrFriends[i];
            }

            var code = 'var usersInfo = API.users.get({"user_ids": "' + arrFriendsToStep.join() + '", "v": "5.37"});' +
                'var arrFriendsFriends = [];' +
                'var arrFriends = [' + arrFriendsToStep.join() + '];' +
                'var i = 0;' +
                'while (i < arrFriends.length) {' +
                'if (!usersInfo[i].deactivated) {' +
                'if (arrFriendsFriends.length == 0) {' +
                'arrFriendsFriends = API.friends.get({"user_id": arrFriends[i], "v": "3.0"});' +
                '} else {' +
                'arrFriendsFriends = arrFriendsFriends + "," + API.friends.get({"user_id": arrFriends[i], "v": "3.0"});' +
                '}' +
                '}' +
                'i = i + 1;' +
                '}' +
                'return arrFriendsFriends;';

            setTimeout(function () {
                VK.Api.call("execute", {code: code}, function (data) {
                    if (data.response) {
                        if (data.response.indexOf(',') != -1) {
                            $scope.arrFriendsFriends = sum_sort_arr($scope.arrFriendsFriends, data.response.split(','));
                            $scope.$digest();
                        }
                        if (end != arrFriends.length)
                            getFriendsFriends(arrFriends, end);
                        else
                            getPrivateFriends($scope.arrFriendsFriends);
                    }
                });
            }, 350); // задержка 0.35 с.

        };

        var getPrivateFriends = function (arrFriendsFriends) {
            console.log(arrFriendsFriends);
        };

        $scope.user = {};
        $scope.userFormActive = false;
        $scope.addUser = function (user_id) {
            $scope.userFormActive = true;
            $scope.user = {};
            cfpLoadingBar.start();
            VK.Api.call('users.get', {user_ids: user_id, fields: 'photo_50,counters', v: '5.27'}, function (data) {
                if (data.response) {
                    $scope.user = data.response[0];
                    cfpLoadingBar.complete();
                    getFriends(user_id);
                }
            });
        };

        $scope.deleteUser = function () {
            $scope.userFormActive = false;
            $scope.user = {};
        };

        $scope.writeError = function (error) {
            ngToast.success(error);
            $scope.$digest();
        };

    });

});