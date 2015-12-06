var groups_ids = $groups_ids$;
var arr_groups = "";

var i = 0;
while (i < groups_ids.length) {
    var items = API.groups.getMembers({
        "group_id": groups_ids[i],
        "v": "5.27",
        "count": "1000",
        filter: "friends"
    }).items;
    var j = 0;
    var items_result = "";
    while (j < items.length) {
        if (j == 0)
            items_result = items[j];
        else
            items_result = items_result + ", " + items[j];
        j = j + 1;
    }
    if (i == 0)
        arr_groups = "{\"id\": " + groups_ids[i] + ", \"items\": [" + items_result + "]}";
    else
        arr_groups = arr_groups + ", {\"id\": " + groups_ids[i] + ", \"items\": [" + items_result + "]}";
    i = i + 1;
}

return "[" + arr_groups + "]";