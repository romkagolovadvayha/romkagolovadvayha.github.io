function VKR() {}

VKR.prototype.Group = function (method, paramets, callback, load) {
    if (method === 'getMembers') {
        var _arrMutual = [];
        var getMembers20k = function (group_id, members_count, _arrMutualMemberGroupIDs) {
            var code = 'var members = API.groups.getMembers({"group_id": ' + group_id + ', "v": "5.27", "sort": "id_asc", "count": "1000", "offset": ' + _arrMutualMemberGroupIDs.length + '}).items;var offset = 1000;while (offset < 25000 && (offset + ' + _arrMutualMemberGroupIDs.length + ') < ' + members_count + '){members = members + "," + API.groups.getMembers({"group_id": ' + group_id + ', "v": "5.27", "sort": "id_asc", "count": "1000", "offset": (' + _arrMutualMemberGroupIDs.length + ' + offset)}).items;offset = offset + 1000;};return members;';

            $.ajax({
                url: 'https://api.vk.com/method/execute?' +
                'code=' + encodeURIComponent(code) +
                '&https=1' +
                '&access_token=' + paramets.access_token,
                dataType: "jsonp",
                success: function (data) {
                    if (data.response) {
                        if (/\d/.test(data.response))
                            _arrMutualMemberGroupIDs = _arrMutualMemberGroupIDs.concat(JSON.parse("[" + data.response + "]")); // запишем это в массив

                        load((_arrMutualMemberGroupIDs.length / members_count) * 100);
                        if (members_count > _arrMutualMemberGroupIDs.length + 15) { // если еще не всех участников получили
                            setTimeout(function () {
                                getMembers20k(group_id, members_count, _arrMutualMemberGroupIDs);
                            }, 350); // задержка 0.35 с. после чего запустим еще раз
                        } else // если конец то
                        {
                            _arrMutual = _arrMutualMemberGroupIDs;
                            callback(_arrMutual);
                        }
                    } else {
                        callback(data.error.error_msg); // в случае ошибки выведем её
                        return 0;
                    }
                }
            });
        };
        var _arrMutualMemberGroupIDs = [];
        $.ajax({
            url: 'https://api.vk.com/method/groups.getById?' +
            'fields=members_count' +
            '&group_id=' + paramets.groupID +
            '&v=5.37' +
            '&https=1' +
            '&access_token=' + paramets.access_token,
            dataType: "jsonp",
            success: function (data) {
                if (data.response) {
                    getMembers20k(paramets.groupID, data.response[0].members_count, _arrMutualMemberGroupIDs);
                } else {
                    callback(data.error.error_msg); // в случае ошибки выведем её
                    return 0;
                }
            }
        });
    }

    if (method === 'getSearchFriendsInGroups') {
        array_sum = function (A, B) {
            var M = A.length, N = B.length, count = 0, C = [];
            C = A;
            count = M;
            var cnt = 0;
            for (var i = 0; i < N; i++) {
                var plus = false;
                for (var j = 0; j < M; j++)
                    if (C[j] == B[i]) {
                        plus = true;
                        break;
                    }
                if (plus === false) C[count++] = B[i];
            }
            return C;
        };
        $.ajax({
            url: 'https://api.vk.com/method/groups.search?' +
            'q=' + paramets.q +
            '&count=1000' +
            '&v=5.40' +
            '&https=1' +
            '&access_token=' + paramets.access_token,
            dataType: "jsonp",
            success: function (data) {
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
            }
        });

        var array_groups_and_items = [];
        var get_friends_from_groups = function (items, offset, count) {
            load(( (((offset + 25) < count) ? (offset + 25) : count) / count) * 100);
            var groups = [];
            for (var i = offset, j = 0; i < offset + 25; i++, j++) {
                if (i < count) {
                    groups[j] = items[i];
                }
            }
            var code = 'var groups_ids = ' + JSON.stringify(groups) + ';var arr_groups = "";var i = 0;while (i < groups_ids.length) {var items = API.groups.getMembers({"group_id": groups_ids[i],"v": "5.27","count": "1000", filter: "friends"}).items;var j = 0;var items_result = "";while (j < items.length) {if (j == 0) items_result = items[j]; else items_result = items_result + ", " + items[j];j = j + 1;}if (i == 0) arr_groups = "{\\\"groupID\\\": " + groups_ids[i] + ", \\\"friends\\\": [" + items_result + "]}"; else arr_groups = arr_groups + ", {\\\"groupID\\\": " + groups_ids[i] + ", \\\"friends\\\": [" + items_result + "]}";i = i + 1;} return "[" + arr_groups + "]";';

            $.ajax({
                url: 'https://api.vk.com/method/execute?' +
                'code=' + encodeURIComponent(code) +
                '&https=1' +
                '&access_token=' + paramets.access_token,
                dataType: "jsonp",
                success: function (data) {
                    array_groups_and_items = array_sum(array_groups_and_items, JSON.parse(data.response));
                    if (offset + 25 < count) {
                        setTimeout(function () {
                            get_friends_from_groups(items, offset + 25, count);
                        }, 350);
                    } else {
                        var result_array_groups = [];
                        for (var i = 0; i < array_groups_and_items.length; i++) {
                            if (array_groups_and_items[i].friends.length > 0)
                                result_array_groups[result_array_groups.length] = array_groups_and_items[i];
                        }
                        callback(result_array_groups);
                    }
                }
            });
        };
    }
};

VKR.prototype.User = function (method, paramets, callback) {
    if (method === 'getCreated') {
        $.ajax({
            url: 'https://byunow.ru/VKAPI/method/index.php?' +
            'm=getCreated' +
            '&ids=' + paramets.ids.join(),
            success: function (data) {
                data = JSON.parse(data);
                callback(data);
            }
        });
    }
};

var VKR = new VKR();

