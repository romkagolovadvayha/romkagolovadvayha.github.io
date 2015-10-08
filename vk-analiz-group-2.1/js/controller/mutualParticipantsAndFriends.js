/**
 * MutualParticipantsAndFriendsCtrl
 */
'use strict';
app.controller('MutualParticipantsAndFriendsCtrl', function ($scope, ngToast, $timeout, cfpLoadingBar) {

    $scope.labelsFriendsNames = [];
    $scope.seriesFriends = ['Друзей'];
    $scope.dataFriendsCounts = [[]];

    $scope.arrUrls = [];
    $scope.limit = 30;
    $scope.sort = '-id';
    //$scope.url = "habr";

    var _arrMutual = [];
    $scope.arrMutual = [];

    $scope.chartsFriends = function () {
        $scope.labelsFriendsNames = [];
        $scope.dataFriendsCounts = [[]];
        for (var i = 0; i < $scope.arrUrls.length; i++) {
            var object = $scope.arrUrls[i];
            if (object.counters || object.members_count) {
                $scope.labelsFriendsNames[$scope.labelsFriendsNames.length] = object.name;
                $scope.dataFriendsCounts[0][$scope.dataFriendsCounts[0].length] = object.counters && object.counters.friends ? object.counters.friends : object.members_count;
            }
        }
    };

    $scope.checkAdds = function (object, text) {
        var bError = false;
        object.id_ = $scope.arrUrls.length;
        for (var i = 0; i < $scope.arrUrls.length; i++) {
            if ($scope.arrUrls[i].screen_name == object.screen_name) {
                ngToast.create(text);
                bError = true;
                break;
            }
        }
        if (!bError) {
            $scope.arrMutual = [];
            _arrMutual = [];
            $scope.arrUrls[$scope.arrUrls.length] = object;
            $scope.chartsFriends();
        }
    };

    $scope.addGroup = function (groupID) {
        VK.api('groups.getById', {group_id: groupID, fields: 'members_count', v: '5.37'}, function (data) {
            if (data.response) {
                data.response[0].membersListCount = 'Количество участников: ' + data.response[0].members_count;
                $scope.checkAdds(data.response[0], 'Группа уже добавлена в список');
                cfpLoadingBar.complete();
                $scope.$digest();
            }
        });
    };

    $scope.addUser = function (user_id) {
        VK.api('users.get', {user_ids: user_id, fields: 'photo_50,counters', v: '5.27'}, function (data) {
            if (data.response) {
                data.response[0].membersListCount = 'Количество друзей: ' + data.response[0].counters.friends;
                data.response[0].name = data.response[0].first_name + '  ' + data.response[0].last_name;
                data.response[0].screen_name = 'id' + user_id;
                $scope.checkAdds(data.response[0], 'Пользователь уже добавлен в список');
                cfpLoadingBar.complete();
                $scope.$digest();
            }
        });
    };

    $scope.add = function () {
        cfpLoadingBar.start();
        var url = $scope.url;
        if (url) {
            if (url.indexOf("com/") >= 0)
                url = url.split('com/')[1];
            VK.api('utils.resolveScreenName', {screen_name: url, v: '5.27'}, function (data) {
                if (data.response) {
                    if (data.response.type == 'group') {
                        $scope.addGroup(data.response.object_id);
                    } else {
                        if (data.response.type == 'user') {
                            $scope.addUser(data.response.object_id);
                        } else {
                            cfpLoadingBar.complete();
                            ngToast.create('Неверно указана ссылка');
                        }
                    }
                }
            });
        } else {
            cfpLoadingBar.complete();
            $scope.writeError('Введите ссылку');
        }
    };

    $scope.deleteElFromUrls = function (screen_name) {
        var newArrUrls = [];
        for (var i = 0; i < $scope.arrUrls.length; i++) {
            if ($scope.arrUrls[i].screen_name != screen_name) {
                newArrUrls[newArrUrls.length] = $scope.arrUrls[i];
            }
        }
        _arrMutual = [];
        $scope.arrMutual = [];
        $scope.arrUrls = newArrUrls;
        $scope.chartsFriends();
    };

    $scope.invite = function () {
        VK.callMethod('showInviteBox');
    };
    $scope.wall = function () {
        VK.api('wall.post', {
            message: 'Просмотр общих друзей и подписчиков у любых людей и сообществ! https://vk.com/app4236781',
            attachments: 'photo33610634_350256389, https://vk.com/app4236781'
        }, function (data) {

        });
    };

    var nextFuncMutual = function (index) {
        if ($scope.arrUrls.length - 1 > index) {
            funcMutual(++index);
        } else {
            VK.api('users.get', {user_ids: _arrMutual.join(), fields: 'photo_50', v: '5.27'}, function (data) {
                if (data.response)
                    $scope.arrMutual = data.response;
                cfpLoadingBar.complete();
                $scope.$digest();
            });
        }
    };

    // получаем участников группы, members_count - количество участников
    var getMembers20k = function (group_id, members_count, index) {
        var code = 'var members = API.groups.getMembers({"group_id": ' + group_id + ', "v": "5.27", "sort": "id_asc", "count": "1000", "offset": ' + $scope._arrMutualMemberGroupIDs.length + '}).items;' // делаем первый запрос и создаем массив
            + 'var offset = 1000;' // это сдвиг по участникам группы
            + 'while (offset < 25000 && (offset + ' + $scope._arrMutualMemberGroupIDs.length + ') < ' + members_count + ')' // пока не получили 20000 и не прошлись по всем участникам
            + '{'
            + 'members = members + "," + API.groups.getMembers({"group_id": ' + group_id + ', "v": "5.27", "sort": "id_asc", "count": "1000", "offset": (' + $scope._arrMutualMemberGroupIDs.length + ' + offset)}).items;' // сдвиг участников на offset + мощность массива
            + 'offset = offset + 1000;' // увеличиваем сдвиг на 1000
            + '};'
            + 'return members;'; // вернуть массив members

        VK.api("execute", {code: code}, function (data) {
            if (data.response) {
                $scope._arrMutualMemberGroupID = $scope._arrMutualMemberGroupIDs.concat(JSON.parse("[" + data.response + "]")); // запишем это в массив
                if (members_count > $scope._arrMutualMemberGroupIDs.length + 15) { // если еще не всех участников получили
                    setTimeout(function () {
                        getMembers20k(group_id, members_count);
                    }, 350); // задержка 0.35 с. после чего запустим еще раз
                } else // если конец то
                {
                    if (_arrMutual.length <= 0)
                        _arrMutual = $scope._arrMutualMemberGroupIDs;
                    else
                        _arrMutual = ArrMath.Intersection($scope._arrMutualMemberGroupIDs, _arrMutual);
                    $scope.$digest();
                    nextFuncMutual(index);
                }
            } else {
                alert(data.error.error_msg); // в случае ошибки выведем её
            }
        });
    };

    var funcMutual = function (index) {
        if ($scope.arrUrls[index].members_count) {
            // подписчики группы
            $scope._arrMutualMemberGroupIDs = [];
            getMembers20k($scope.arrUrls[index].id, $scope.arrUrls[index].members_count, index);
        } else {
            // друзья пользователя
            VK.api('friends.get', {user_id: $scope.arrUrls[index].id, v: '3.0'}, function (data) {
                if (data.response) {
                    if (_arrMutual.length <= 0)
                        _arrMutual = data.response;
                    else
                        _arrMutual = ArrMath.Intersection(data.response, _arrMutual);
                    nextFuncMutual(index);
                }
            });
        }
    };

    $scope.start = function () {
        cfpLoadingBar.start();
        funcMutual(0);
    };

    $scope.export_excel = function () {
        $scope.wall();
        var result = '<html><head><meta charset="UTF-8"></head><table><tr><td></td><td></td><td style="font-weight: 700">Имя Фамилия</td><td style="font-weight: 700">ID</td></tr>';
        for (var i = 0; i < $scope.arrMutual.length; i++) {
            result += '<tr><td></td><td style="border: 1px solid #000;">' + (i + 1) + '</td><td style="border: 1px solid #000;">' + $scope.arrMutual[i].first_name + ' ' + $scope.arrMutual[i].last_name + '</td><td style="border: 1px solid #000;">' + $scope.arrMutual[i].id + '</td></tr>';
        }
        result += '</table></html>';
        window.open('data:application/vnd.ms-excel,' + encodeURIComponent(result));
        return false;
    };
    $scope.export_word = function () {
        $scope.wall();
        var result = '<html><head><meta charset="UTF-8"></head><table><tr><td></td><td></td><td style="font-weight: 700">Имя Фамилия</td><td style="font-weight: 700">ID</td></tr>';
        for (var i = 0; i < $scope.arrMutual.length; i++) {
            result += '<tr><td></td><td style="border: 1px solid #000;">' + (i + 1) + '</td><td style="border: 1px solid #000;">' + $scope.arrMutual[i].first_name + ' ' + $scope.arrMutual[i].last_name + '</td><td style="border: 1px solid #000;">' + $scope.arrMutual[i].id + '</td></tr>';
        }
        result += '</table></html>';
        window.open('data:application/msword,' + encodeURIComponent(result));
        return false;
    }

});