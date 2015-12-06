var groups_ids = $data$;
var groups_ids = [10827415, 45653506];
var arr_groups = "";

var i = 0;
while (i < groups_ids.length) {
    var items = API.groups.getMembers({
        "group_id": groups_ids[i],
        "v": "5.27",
        "sort": "id_asc",
        "count": "1000",
        filter: "friends"
    }).items;
    var j = 0;
    var items_result = "";
    while (j < items.length) {
        if (j == 0)
            items_result = items[i];
        else
            items_result = items_result + ", " + items[i];
        j = j + 1;
    }
    if (i == 0)
        arr_groups = "{id:" + groups_ids[i] + ", items:" + items + "}";
    else
        arr_groups = arr_groups + ", {id:" + groups_ids[i] + ", items:" + items_result + "}";
    i = i + 1;
}

return arr_groups;