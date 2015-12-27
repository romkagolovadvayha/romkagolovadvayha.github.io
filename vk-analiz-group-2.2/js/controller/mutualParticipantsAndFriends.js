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
        VK.api('groups.getById', {group_id: groupID, fields: 'members_count', v: '5.37', https: 1}, function (data) {
            if (data.response) {
                data.response[0].membersListCount = 'Количество участников: ' + data.response[0].members_count;
                $scope.checkAdds(data.response[0], 'Группа уже добавлена в список');
                cfpLoadingBar.complete();
                $scope.$digest();
            }
        });
    };

    $scope.addUser = function (user_id) {
        VK.api('users.get', {user_ids: user_id, fields: 'photo_50,counters', v: '5.27', https: 1}, function (data) {
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
            VK.api('utils.resolveScreenName', {screen_name: url, v: '5.27', https: 1}, function (data) {
                if (data.response) {
                    if (data.response.type == 'group' || data.response.type == 'page') {
                        $scope.url = "";
                        $scope.addGroup(data.response.object_id);
                    } else {
                        if (data.response.type == 'user') {
                            $scope.url = "";
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
        $scope.arrMutual_ = [];
        $scope.arrUrls = newArrUrls;
        $scope.chartsFriends();
    };

    $scope.invite = function () {
        VK.callMethod('showInviteBox');
    };
    $scope.wall = function () {
        VK.api('wall.post', {
            message: 'Просмотр общих друзей и подписчиков у любых людей и сообществ! https://vk.com/app4236781',
            attachments: 'photo33610634_350256389, https://vk.com/app4236781',
            https: 1
        }, function (data) {

        });
    };

    var nextFuncMutual = function (index) {
        $scope.start_load = -1;
        if ($scope.arrUrls.length - 1 > index) {
            funcMutual(++index);
        } else {
            var users_ = [];
            $scope.arrMutual_ = _arrMutual;
            $scope.$digest();
            for (var i = 0; i < 1000; i++) {
                users_[users_.length] = _arrMutual[i];
            }
            VK.api('users.get', {user_ids: users_.join(), fields: 'photo_50', v: '5.27', https: 1}, function (data) {
                if (data.response)
                    $scope.arrMutual = data.response;
                cfpLoadingBar.complete();
                $scope.$digest();
            });
        }
    };
    // получаем участников группы, members_count - количество участников
    var getMembers20k = function (group_id, members_count, index, _arrMutualMemberGroupIDs) {
        var code = 'var members = API.groups.getMembers({"group_id": ' + group_id + ', "v": "5.27", "sort": "id_asc", "count": "1000", "offset": ' + _arrMutualMemberGroupIDs.length + '}).items;' // делаем первый запрос и создаем массив
            + 'var offset = 1000;' // это сдвиг по участникам группы
            + 'while (offset < 25000 && (offset + ' + _arrMutualMemberGroupIDs.length + ') < ' + members_count + ')' // пока не получили 20000 и не прошлись по всем участникам
            + '{'
            + 'members = members + "," + API.groups.getMembers({"group_id": ' + group_id + ', "v": "5.27", "sort": "id_asc", "count": "1000", "offset": (' + _arrMutualMemberGroupIDs.length + ' + offset)}).items;' // сдвиг участников на offset + мощность массива
            + 'offset = offset + 1000;' // увеличиваем сдвиг на 1000
            + '};'
            + 'return members;'; // вернуть массив members

        VK.api("execute", {code: code, https: 1}, function (data) {
            if (data.response) {
                if (/\d/.test(data.response))
                    _arrMutualMemberGroupIDs = _arrMutualMemberGroupIDs.concat(JSON.parse("[" + data.response + "]")); // запишем это в массив

                $scope.start_load = (_arrMutualMemberGroupIDs.length / members_count) * 100;
                //alert(_arrMutualMemberGroupIDs.length);
                //alert(members_count);
                if (members_count > _arrMutualMemberGroupIDs.length + 15) { // если еще не всех участников получили
                    setTimeout(function () {
                        getMembers20k(group_id, members_count, index, _arrMutualMemberGroupIDs);
                    }, 350); // задержка 0.35 с. после чего запустим еще раз
                } else // если конец то
                {
                    if (_arrMutual.length <= 0)
                        _arrMutual = _arrMutualMemberGroupIDs;
                    else
                        _arrMutual = ArrMath.Intersection(_arrMutualMemberGroupIDs, _arrMutual);
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
            $scope.index_name = $scope.arrUrls[index].name;
            var _arrMutualMemberGroupIDs = [];
            getMembers20k($scope.arrUrls[index].id, $scope.arrUrls[index].members_count, index, _arrMutualMemberGroupIDs);
        } else {
            // друзья пользователя
            $scope.index_name = $scope.arrUrls[index].name;
            VK.api('friends.get', {user_id: $scope.arrUrls[index].id, v: '3.0', https: 1}, function (data) {
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
    $scope.start_load = -1;
    $scope.start = function () {
        cfpLoadingBar.start();
        $scope.start_load = 0;
        $scope.index_name = 0;
        funcMutual(0);
    };

    $scope.export_excel = function () {
        $scope.wall();
        //var result = $scope.arrMutual_.join();
        var result = '<html><head><meta charset="UTF-8"></head>' +
            'Экспорт ограничен до 1000 общих участников.<br/>' +
            '<table><tr><td></td><td></td><td style="font-weight: 700">ID</td></tr>';
        for (var i = 0; i < $scope.arrMutual_.length; i++) {
            result += '<tr><td></td><td style="border: 1px solid #000;">' + (i + 1) + '</td><td style="border: 1px solid #000;">' + $scope.arrMutual_[i] + '</td></tr>';
            if (i >= 999)
                break;
        }
        result += '</table></html>';
        //window.open('data:application/vnd.ms-excel,' + encodeURIComponent(result));
        var element = document.createElement('a');
        element.setAttribute('href', 'data:application/vnd.ms-excel,' + encodeURIComponent(result));
        element.setAttribute('download', 'Общие_участники_(ограничено_не_более_1000)');
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        return false;
    };
    $scope.export_word = function () {
        $scope.wall();
        //var result = $scope.arrMutual_.join();
        var result = '<html><head><meta charset="UTF-8"></head>' +
            'Экспорт ограничен до 1000 общих участников.<br/>' +
            '<table><tr><td></td><td></td><td style="font-weight: 700">ID</td></tr>';
        for (var i = 0; i < $scope.arrMutual_.length; i++) {
            result += '<tr><td></td><td style="border: 1px solid #000;">' + (i + 1) + '</td><td style="border: 1px solid #000;">' + $scope.arrMutual_[i] + '</td></tr>';
            if (i >= 999)
                break;
        }
        result += '</table></html>';
        //window.open('data:application/msword,' + encodeURIComponent(result));
        var element = document.createElement('a');
        element.setAttribute('href', 'data:application/msword,' + encodeURIComponent(result));
        element.setAttribute('download', 'Общие_участники_(ограничено_не_более_1000)');
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        return false;
    };

    var export_format = function (arrMutual_) {
        var result = "";
        for (var i = 0; i < arrMutual_.length; i++) {
            if (i == 0)
                result += $scope.pr_ + arrMutual_[i];
            else
                result += $scope.symbol + $scope.pr_ + arrMutual_[i];
        }
        $('#export_test').html(result);
        $('#myModal').modal('show');
    };

    $scope.$watch('symbol', function () {
        if ($scope.arrMutual_ && $scope.arrMutual_.length)
            export_format($scope.arrMutual_);
    });
    $scope.$watch('pr_', function () {
        if ($scope.arrMutual_ && $scope.arrMutual_.length)
            export_format($scope.arrMutual_);
    });

    $scope.export_test = function () {
        var m = 3;
        if ($scope.balance - m >= 0) {
            if (confirm('За данную услугу будет списанно ' + m + ' монеты')) {
                setBalance($scope.userProfile.uid, m, function (balance_) {
                    $scope.setBalance($scope.balance - balance_);
                });

                export_format($scope.arrMutual_);
            }
        } else {
            error_mod_ser('Данная функция стоит ' + m + ' монеты, у вас на счету ' + $scope.balance + ' монет.');
            $('#balance2').modal('show');
        }
    };

    $(document).bind('keydown', function () {
        if (event.keyCode == 13) {
            if ($scope.url) {
                $scope.add();
            } else {
                if ($scope.arrUrls.length > 1) {
                    $scope.start();
                }
            }
        }
    });

    $scope.myGroups = [{
        name: "Веб-разработчик | CRM HTML5 CSS3 JS CMS HTML",
        photo_50: "https://pp.vk.me/c320422/v320422634/29f5/pEW-QWfW9J4.jpg",
        screen_name: "web_faq"
    }];
    $scope.focus_url = false;
    $scope.url_clear = function () {
        $scope.url = "";
        VK.api('groups.get', {extended: 1, v: '5.40', https: 1, count: 300}, function (data) {
            if (data.response) {
                myGroups = data.response.items;
                $scope.myGroups = myGroups;
                $scope.url = "";
                $scope.$digest();
            }
        });
    };

    $scope.url_clear();


});