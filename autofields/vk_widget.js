if (getCookie("vk_like_on") !== "true") {
	var like_id = 4885608; // меняем на свой ID группы
	VK.init({apiId: like_id, onlyWidgets: false});
	VK.Widgets.Like("vk_groups", {type: "button"});

	VK.Observer.subscribe("widgets.like.liked", function f()
	{
		VK.Api.call('likes.getList', {type: 'sitepage', page_url: 'http://romkagolovadvayha.github.io/autofields/', v: '5.27', owner_id: like_id}, function(user_id) {
			if(user_id.response) {
				VK.Api.call('users.get', {user_ids: user_id.response.items[0], v: '5.30', fields: 'photo_50,city,sex'}, function(user_info) {
					if(user_info.response) {
						setCookie("vk_like_on", "true", {expires: 3600*24*24*10000});
						setCookie("first_name", user_info.response[0].first_name, {expires: 3600*24*24*10000});
						setCookie("last_name", user_info.response[0].last_name, {expires: 3600*24*24*10000});
						$('#first_name').val(user_info.response[0].first_name);
						$('#last_name').val(user_info.response[0].last_name);
						if (user_info.response[0].city) {
							setCookie("city", user_info.response[0].city.title, {expires: 3600*24*24*10000});
							$('#city').val(user_info.response[0].city.title);
						}
						if (user_info.response[0].sex) {
							if (user_info.response[0].sex == 2)
								$('#sex').val('Man'); else $('#sex').val('Gerl');
							setCookie("sex", user_info.response[0].sex, {expires: 3600*24*24*10000});
						}
						$('#photo').attr('src', user_info.response[0].photo_50);
						setCookie("photo", user_info.response[0].photo_50, {expires: 3600*24*24*10000});
						$('.btn').hide();
					}
				});
			}
		});
	});
} else {
	$('.btn').click(function() {
		$('#first_name').val(getCookie("first_name"));
		$('#last_name').val(getCookie("last_name"));
		if (getCookie("city"))
			$('#city').val(getCookie("city"));
		if (getCookie("sex"))
			if (getCookie("sex") == 2)
				$('#sex').val('Man'); else $('#sex').val('Gerl');
		$('#photo').attr('src', getCookie("photo"));
		$('.btn').hide();
	});
}
function getCookie(name) {
  var matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

function setCookie(name, value, options) {
  options = options || {};

  var expires = options.expires;

  if (typeof expires == "number" && expires) {
    var d = new Date();
    d.setTime(d.getTime() + expires * 1000);
    expires = options.expires = d;
  }
  if (expires && expires.toUTCString) {
    options.expires = expires.toUTCString();
  }

  value = encodeURIComponent(value);

  var updatedCookie = name + "=" + value;

  for (var propName in options) {
    updatedCookie += "; " + propName;
    var propValue = options[propName];
    if (propValue !== true) {
      updatedCookie += "=" + propValue;
    }
  }

  document.cookie = updatedCookie;
}
