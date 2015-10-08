$(document).ready(function () {
    var window_modal = $('.window');
    var html_body = $('html, body');

    function close_pop_up() {
        window_modal.hide();
        html_body.css('overflowY', 'visible')
    }

    function open_pop_up() {
        $('.window ul').css('marginLeft', "0px");
        window_modal.show();
        html_body.css('overflowY', 'hidden')
    }

    $('.image > img').click(function () {
        var count = 0;
        var html = '';
        $(this).parent().children('ul').children('li').each(function () {
            var url_image = '<img src="' + $(this).children('img').attr('src') + '"/>';
            if (count == 1)
                html += '<li class="active">' + url_image + '</li>';
            else
                html += '<li>' + url_image + '</li>';
            count++;
        });
        var main_ul = $('.window .main ul');
        main_ul.html(html);
        open_pop_up();
    });

    window_modal.mouseup(function (e) {
        var div = $(".window .main");
        if (!div.is(e.target)
            && div.has(e.target).length === 0) {
            close_pop_up();
        }
    });

    $('.all_active').click(function () {
        $(this).parent().parent().removeClass('all_not_active');
        return false;
    });

    $('.arrow_left').click(function () {
        var active = $('.window li.active');
        var width = active.width();
        if (active.prev("li").length) {
            active.prev("li").addClass('active');
            active.removeClass('active');
            $('.window ul').css('marginLeft', "+=" + width + "px");
        }
    });

    $('.arrow_right').click(function () {
        var active = $('.window li.active');
        var width = active.width();
        if (active.next("li").length) {
            active.next("li").addClass('active');
            active.removeClass('active');
            $('.window ul').css('marginLeft', "-=" + width + "px");
        }
    });

});