var id_app = [2866099, 4195289, 4195287, 4195284, 4161477, 4161462, 4149350, 4149349, 4149336, 2394133, 3043953];
var apiID_index = Math.floor(Math.random() * (id_app.length));
VK.init({
	apiId: id_app[apiID_index]
});

var user_id_global = 0;
var user_friends =  [];

// Добавляем пользователя и получаем информацию о нем и его друзьях
addUser(250185983);

var id = [22429423];

function diff_array(array_1, array_2)
{
	var count = 0, result = [];
	for (var i = 0; i < array_1.length; i++)
	{
		var j = 0, k = 0;
		while (array_2[j] !== array_1[ i ] && j < array_2.length) 
			j++;
		while (result[k] !== array_1[ i ] && k < count) 
			k++;
		if (j == array_2.length && k == count) 
			result[count++] = array_1[ i ];
	}
	return result;
}

function addUser(user_id)
{
		VK.Api.call('users.get', {user_ids: user_id, fields: 'photo_50', v: '5.27'}, function(r) {
			if(r.response) {
				$('#info').html('<img src="' + r.response[0].photo_50 + '" alt="" class="img-responsive"/>' + r.response[0].first_name + ' ' + r.response[0].last_name + '<br/>');
				VK.Api.call('friends.get', {user_id: user_id, v: '3.0', order: 'random'}, function(r) {
					if(r.response) {
						// Получаем список друзей друзей рекурсией
						get_friends_friends(r.response, 0, user_id);
						$('#info').append('<br/>Друзей: ' + r.response.length);
					}
				});
			}
		});
}

// index - индекс текущего пользователя, items - массив друзей нашего пользователя
function get_friends_friends(items, index, user_id) {
	if (index < id.length) {
		VK.Api.call('friends.get', {user_id: id[index], v: '3.0'}, function(r) {
			if(r.response) {
				// Получаем список друзей друзей друзей и ищем там нашего пользователя
				get_friends_friends_friends(r.response, items, user_id, 0, index);
			} else get_friends_friends(items, index + 1, user_id);
		});
	} else {
		// Разность массивов - скрытые друзья
		var hidden = diff_array(user_friends, items);
		if (hidden.length > 0) {
			$('#result').append('<br/><br/>Скрытые друзья: ' + hidden.join());
			$('#result').append('<br/><br/>Скрытых друзей: ' + hidden.length);
		} else {
			$('#result').append('Скрытых друзей не найдено!');
		}
	}
}

// friend_items - список друзей друзей, items - список друзей, index_top - текущий друг, index - друг друга
function get_friends_friends_friends(friend_items, items, user_id, index, index_top) {
	$('#result').html(index + ' из ' + friend_items.length + '<br/>');
	if (friend_items.length > index) {
		if (user_friends.join().indexOf(friend_items[index]) == -1) {
			VK.Api.call('friends.get', {user_id: friend_items[index], v: '3.0'}, function(r) {
				if(r.response) {
					if (r.response.join().indexOf(user_id) > -1) {
						user_friends[user_friends.length] = friend_items[index];
						if (items.join().indexOf(friend_items[index]) == -1) 
							$('#info').append('<br/><br/>Найден скрытый друг: ' + friend_items[index]);
					}
					// Получаем список друзей друзей друзей и ищем там нашего пользователя
					setTimeout(function() { 
						get_friends_friends_friends(friend_items, items, user_id, index + 1, index_top);
					}, 400);
				} else get_friends_friends_friends(friend_items, items, user_id, index + 1, index_top);
			});
		}
	} else {
		// Переход на следующего пользователя
		get_friends_friends(items, index_top + 1, user_id);
	}
}