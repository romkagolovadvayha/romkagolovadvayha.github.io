var groups_ids = $data$;
var arr_groups = [];

var i = 0;
while (i < groups_ids.length)
{
    arr_groups[groups_ids[i]] = API.groups.getMembers({
        "group_id": groups_ids[i],
        "v": "5.27",
        "sort": "id_asc",
        "count": "1000",
        filter: 'friends'
    }).items;
}

return arr_groups;