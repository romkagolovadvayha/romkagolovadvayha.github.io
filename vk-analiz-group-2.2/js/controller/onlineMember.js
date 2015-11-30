/**
 * OnlineMemberCtrl
 */
'use strict';
app.controller('OnlineMemberCtrl', function ($scope, ngToast, $timeout, cfpLoadingBar) {
    //cfpLoadingBar.start();
    //cfpLoadingBar.complete();

    $('#show-vk-analiz-group').on('shown.bs.tab', function (e) {
        $scope.group = {
            name: null,
            members_count: null,
            photo_50: null,
            screen_name: null
        };
        $scope.groupFormActive = false;

        $scope.start = function () {
            cfpLoadingBar.start();
            var url = $scope.groupUrl;
            if (url) {
                if (url.indexOf("com/") >= 0)
                    url = url.split('com/')[1];
                VK.api('utils.resolveScreenName', {screen_name: url, v: '5.27', https: 1}, function (data) {
                    if (data.response) {
                        if (data.response.type == 'group' || data.response.type == 'page') {
                            $scope.getGroupsInfo(data.response.object_id);
                            //$scope.startStats(data.response.object_id);
                        } else {
                            cfpLoadingBar.complete();
                            $scope.writeError('Неверно указана ссылка');
                        }
                    }
                });
            } else {
                cfpLoadingBar.complete();
                $scope.writeError('Введите ссылку');
            }
        };

        $scope.startVK = function () {
            //VK.Auth.getLoginStatus($scope.start);
            $scope.start();
        };


        $scope.writeError = function (error) {
            ngToast.success(error);
            $scope.$digest();
        };


        $scope.groupID = 0;
        $scope.getGroupsInfo = function (groupID) {
            VK.api('groups.getById', {group_id: groupID, fields: 'members_count', v: '5.37', https: 1}, function (data) {
                if (data.response) {
                    $scope.group = data.response[0];
                    $scope.groupID = groupID;
                    $scope.getMembers20k(groupID, data.response[0].members_count);
                    $scope.groupFormActive = true;
                    $scope.$digest();
                }
            });
        };

        $scope.reset = function () {
            $scope.groupFormActive = false;
            $scope.labels = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            $scope.data = [
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            ];
            $scope.dataMembersLastSeenTime = [1, 1];
            $scope.dataMembersCountry = [1, 1, 1, 1, 1, 1, 1];
            $scope.dataMembersDeactivated = [1, 1];
            $scope.labelsMobile = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            $scope.dataMobile = [
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            ];
            count = 0;
            memberOnline = [];
            memberOnlineMobile = [];
            membersLastSeenTime = [];
            membersCountry = [];
            membersDeactivated = [];
        };

        $scope.labels = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        $scope.series = ['Онлайн'];
        $scope.data = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0]];
        $scope.options = {
            animation: false
        };

        $scope.labelsMembersLastSeenTime = ["более 3 дней назад", "более 5 дней назад"];
        $scope.dataMembersLastSeenTime = [1, 1];
        $scope.labelsMembersCountry = ["Россия", "Украина", "Беларусь", "Казахстан", "Азербайджан", "Армения", "Грузия"];
        $scope.dataMembersCountry = [1, 1, 1, 1, 1, 1, 1];
        $scope.labelsMembersDeactivated = ["Забаненные", "Удаленные"];
        $scope.dataMembersDeactivated = [1, 1];
        $scope.labelsMobile = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        $scope.seriesMobile = ['Онлайн с телефона'];
        $scope.dataMobile = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        ];
        $scope.optionsMobile = {
            animation: false
        };

        $scope.colours = [
            { // grey
                fillColor: 'rgba(148,159,177,0.2)',
                strokeColor: 'rgba(148,159,177,1)',
                pointColor: 'rgba(148,159,177,1)',
                pointStrokeColor: '#fff',
                pointHighlightFill: '#fff',
                pointHighlightStroke: 'rgba(148,159,177,0.8)'
            }
        ];


        $scope.coloursMobile = [
            { // dark grey
                fillColor: 'rgba(77,83,96,0.2)',
                strokeColor: 'rgba(77,83,96,1)',
                pointColor: 'rgba(77,83,96,1)',
                pointStrokeColor: '#fff',
                pointHighlightFill: '#fff',
                pointHighlightStroke: 'rgba(77,83,96,1)'
            }
        ];

        var memberOnline = [];
        var memberOnlineMobile = [];
        var membersLastSeenTime = [];
        var membersCountry = [];
        var membersDeactivated = [];
        var count = 0;

        $scope.mutualmemberOnline = function (group_id, members_count) {
            var date = new Date();
            var time = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();

            // Онлайн
            var countOnline = 0;
            for (var i = 0; i < memberOnline.length; i++) {
                if (memberOnline[i] == 1) {
                    countOnline++;
                }
            }
            var data = $scope.data;
            var labels = $scope.labels;
            if (data[0].length >= 10) {
                for (var j = 0; j < data[0].length - 1; j++) {
                    data[0][j] = data[0][j + 1];
                    labels[j] = labels[j + 1];
                }
                data[0].length--;
                labels.length--;
            }
            data[0].push(countOnline);
            labels.push(time);

            $scope.data = data;
            $scope.labels = labels;

            // Онлайн с телефонов
            var countOnlineMobile = 0;
            for (var i = 0; i < memberOnlineMobile.length; i++) {
                if (memberOnlineMobile[i] == '1') {
                    countOnlineMobile++;
                }
            }

            if ($scope.dataMobile[0].length >= 10) {
                for (var j = 0; j < $scope.dataMobile[0].length - 1; j++) {
                    $scope.dataMobile[0][j] = $scope.dataMobile[0][j + 1];
                    $scope.labelsMobile[j] = $scope.labelsMobile[j + 1];
                }
                $scope.dataMobile[0].length--;
                $scope.labelsMobile.length--;
            }
            $scope.dataMobile[0].push(countOnlineMobile);
            $scope.labelsMobile.push(time);

            // Последний раз онлайн более
            if ($scope.dataMembersLastSeenTime[0] <= 1) {
                for (var i = 0; i < membersLastSeenTime.length; i++) {
                    if (membersLastSeenTime[i] > 0) {
                        var now = new Date();
                        var diff = new Date(membersLastSeenTime[i] * 1000 - now);
                        if (diff.getUTCDay() > 3) {
                            $scope.dataMembersLastSeenTime[0]++;
                            if (diff.getUTCDay() > 5) {
                                $scope.dataMembersLastSeenTime[1]++;
                            }
                        }
                    }
                }
            }

            // Страны
            if ($scope.dataMembersCountry[0] <= 1) {
                for (var i = 0; i < membersCountry.length; i++) {
                    if (membersCountry[i] == '1') {
                        $scope.dataMembersCountry[0]++;
                    } else if (membersCountry[i] == '2') {
                        $scope.dataMembersCountry[1]++;
                    } else if (membersCountry[i] == '3') {
                        $scope.dataMembersCountry[2]++;
                    } else if (membersCountry[i] == '4') {
                        $scope.dataMembersCountry[3]++;
                    } else if (membersCountry[i] == '5') {
                        $scope.dataMembersCountry[4]++;
                    } else if (membersCountry[i] == '6') {
                        $scope.dataMembersCountry[5]++;
                    } else if (membersCountry[i] == '7') {
                        $scope.dataMembersCountry[6]++;
                    }
                }
            }

            // Активность
            if ($scope.dataMembersDeactivated[0] <= 1) {
                if (membersDeactivated.split("banned").length) {
                    $scope.dataMembersDeactivated[0] = membersDeactivated.split("banned").length;
                }
                if (membersDeactivated.split("deleted").length) {
                    $scope.dataMembersDeactivated[1] = membersDeactivated.split("deleted").length;
                }
            }

            count = 0;
            memberOnline = [];
            memberOnlineMobile = [];
            membersLastSeenTime = [];
            membersCountry = [];
            membersDeactivated = [];
            cfpLoadingBar.complete();
            $timeout(function () {
                $scope.getMembers20k(group_id, members_count);
            }, 4000);
        };
        $scope.getMembers20k = function (group_id, members_count) {
            if ($scope.groupID == group_id) {
                var fields = 'online,online_mobile,last_seen,country';
                var code = 'var arrMembers = API.groups.getMembers({"group_id": ' + group_id + ', "v": "5.27", "sort": "id_asc", "fields": "' + fields + '", "count": "1000", "offset": ' + memberOnline.length + '}).items;'
                    + 'var membersLastSeenTime = arrMembers@.last_seen@.time;'
                    + 'var membersOnline = arrMembers@.online;'
                    + 'var membersOnlineMobile = arrMembers@.online_mobile;'
                    + 'var membersCountry = arrMembers@.country@.id;'
                    + 'var membersDeactivated = arrMembers@.deactivated;'
                    + 'var offset = 1000;' // это сдвиг по участникам группы
                    + 'while (offset < 25000 && (offset + ' + memberOnline.length + ') < ' + members_count + ')' // пока не получили 20000 и не прошлись по всем участникам
                    + '{'
                    + 'arrMembers = API.groups.getMembers({"group_id": ' + group_id + ', "v": "5.27", "sort": "id_asc", "fields": "' + fields + '", "count": "1000", "offset": (' + memberOnline.length + ' + offset)}).items;'
                    + 'membersOnline = membersOnline + "," + arrMembers@.online;' // сдвиг участников на offset + мощность массива
                    + 'membersLastSeenTime = membersLastSeenTime + "," + arrMembers@.last_seen@.time;'
                    + 'membersOnlineMobile = membersOnlineMobile + "," + arrMembers@.online_mobile;'
                    + 'membersCountry = membersCountry + "," + arrMembers@.country@.id;'
                    + 'membersDeactivated = membersDeactivated + "," + arrMembers@.deactivated;'
                    + 'offset = offset + 1000;' // увеличиваем сдвиг на 1000
                    + '};'
                    + 'return [membersOnline, membersOnlineMobile, membersLastSeenTime, membersCountry, membersDeactivated];'; // вернуть массив members
                VK.api("execute", {code: code, https: 1}, function (data) {
                    if (data.response) {
                        if ($scope.groupFormActive) {
                            memberOnline = memberOnline.concat(JSON.parse("[" + data.response[0] + "]"));
                            memberOnlineMobile += data.response[1];
                            membersLastSeenTime = membersLastSeenTime.concat(JSON.parse("[" + data.response[2].match(/\d+/g) + "]"));
                            membersCountry = membersCountry.concat(JSON.parse("[" + data.response[3].match(/\d+/g) + "]"));
                            membersDeactivated = membersDeactivated + data.response[4];

                            if (members_count > memberOnline.length) { // если еще не всех участников получили
                                setTimeout(function () {
                                    if ($scope.groupFormActive)
                                        if ($scope.groupID == group_id)
                                            $scope.getMembers20k(group_id, members_count);
                                }, 350); // задержка 0.35 с. после чего запустим еще раз
                            } else // если конец то
                            if ($scope.groupFormActive)
                                if ($scope.groupID == group_id)
                                    $scope.mutualmemberOnline(group_id, members_count);
                        }
                    } else {
                        alert(data.error.error_msg); // в случае ошибки выведем её
                    }
                });
            }
        };

        $scope.myGroups = myGroups;
        $scope.url_clear();

        $scope.$digest();

    });
    $scope.focus_url = false;
    $scope.myGroups = [{
        name: "Веб-разработчик | CRM HTML5 CSS3 JS CMS HTML",
        photo_50: "https://pp.vk.me/c320422/v320422634/29f5/pEW-QWfW9J4.jpg",
        screen_name: "web_faq"
    }];

    $scope.url_clear = function () {
        $scope.groupUrl = "";
    };

});