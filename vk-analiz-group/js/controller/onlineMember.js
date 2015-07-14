/**
 * OnlineMemberCtrl
 */
'use strict';
app.controller('OnlineMemberCtrl', function ($scope, ngToast, $timeout) {

    $scope.group = {
        name: null,
        members_count: null,
        photo_50: null,
        screen_name: null
    };
    $scope.groupFormActive = false;
    $scope.start = function () {
        var url = $scope.groupUrl;
        if (url) {
            if (url.indexOf("com/") >= 0)
                url = url.split('com/')[1];
            VK.Api.call('utils.resolveScreenName', {screen_name: url, v: '5.27'}, function (data) {
                if (data.response) {
                    if (data.response.type == 'group') {
                        $scope.getGroupsInfo(data.response.object_id);
                        //$scope.startStats(data.response.object_id);
                    } else {
                        $scope.writeError('Неверно указана ссылка');
                    }
                }
            });
        } else {
            $scope.writeError('Введите ссылку');
        }
    };

    $scope.writeError = function (error) {
        ngToast.success(error);
        $scope.$digest();
    };

    $scope.getGroupsInfo = function (groupID) {
        VK.Api.call('groups.getById', {group_id: groupID, fields: 'members_count', v: '5.34'}, function (data) {
            if (data.response) {
                $scope.group = data.response[0];
                $scope.getMembers20k(groupID, data.response[0].members_count);
                $scope.groupFormActive = true;
                $scope.$digest();
            }
        });
    };

    $scope.reset = function () {
        $scope.groupFormActive = false;
    };

    $scope.labels = [];
    $scope.series = ['Онлайн'];
    $scope.data = [
        []
    ];
    $scope.options = {
        animation: false
    };

    var friends = [];
    var count = 0;

    $scope.mutualFriends = function (group_id, members_count) {
        var countOnline = 0;
        for (var i = 0; i < friends.length; i++) {
            if (friends[i] == 1) {
                countOnline++;
            }
        }
        $scope.data[0].push(countOnline);
        var date = new Date();
        var time = date.getHours()+':'+date.getMinutes()+':'+date.getSeconds();
        $scope.labels.push(time);
        count = 0;
        friends = [];
        $timeout(function () {
            $scope.getMembers20k(group_id, members_count);
        }, 4000);
    };

    $scope.getMembers20k = function (group_id, members_count) {
        var code = 'var members = API.groups.getMembers({"group_id": ' + group_id + ', "v": "5.27", "sort": "id_asc", "fields": "online", "count": "1000", "offset": ' + friends.length + '}).items@.online;' // делаем первый запрос и создаем массив
            + 'var offset = 1000;' // это сдвиг по участникам группы
            + 'while (offset < 25000 && (offset + ' + friends.length + ') < ' + members_count + ')' // пока не получили 20000 и не прошлись по всем участникам
            + '{'
            + 'members = members + "," + API.groups.getMembers({"group_id": ' + group_id + ', "v": "5.27", "sort": "id_asc", "fields": "online", "count": "1000", "offset": (' + friends.length + ' + offset)}).items@.online;' // сдвиг участников на offset + мощность массива
            + 'offset = offset + 1000;' // увеличиваем сдвиг на 1000
            + '};'
            + 'return members;'; // вернуть массив members
        VK.Api.call("execute", {code: code}, function (data) {
            if (data.response) {
                friends = friends.concat(JSON.parse("[" + data.response + "]")); // запишем это в массив
                //$('.member_ids').html('Загрузка: ' + friends.length + '/' + members_count);
                if (members_count > friends.length) { // если еще не всех участников получили
                    setTimeout(function () {
                        $scope.getMembers20k(group_id, members_count);
                    }, 350); // задержка 0.35 с. после чего запустим еще раз
                } else // если конец то
                    $scope.mutualFriends(group_id, members_count);
            } else {
                alert(data.error.error_msg); // в случае ошибки выведем её
            }
        });
    };


});