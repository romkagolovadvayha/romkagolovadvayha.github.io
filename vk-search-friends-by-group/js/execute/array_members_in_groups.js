var members = $data$;
var offset = 1000; // это сдвиг по участникам группы
while (offset < 25000 && (offset + ' + _arrMutualMemberGroupIDs.length + ') < ' + members_count + ') // пока не получили 20000 и не прошлись по всем участникам
{
    members = members + "," + API.groups.getMembers({
        "group_id": ' + group_id + ',
        "v": "5.27",
        "sort": "id_asc",
        "count": "1000",
        "offset": (' + _arrMutualMemberGroupIDs.length + ' + offset)
    }).items; // сдвиг участников на offset + мощность массива
    offset = offset + 1000; // увеличиваем сдвиг на 1000
}
return members; // вернуть массив members