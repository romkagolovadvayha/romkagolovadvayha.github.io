window.onload = function () {

    $('a.page-scroll').click(function () {
        if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
            var target = $(this.hash);
            activeMenu = this.hash.slice(1);
            target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
            if (target.length) {
                $('html,body').animate({
                    scrollTop: target.offset().top - 100
                }, 900);
                return false;
            }
        }
    });

    new WOW().init();

    function close_pop_up() {
        $('.pop_up').hide();
        $('html, body').css('overflowY', 'visible')
    }

    function open_pop_up() {
        $('.pop_up').show();
        $('html, body').css('overflowY', 'hidden')
    }

    $('.pop_up .close').click(function () {
        close_pop_up();
    });

    $('.open_pop_up_1').click(function () {
        $('.pop_up h3').html('Cколько лет вы мучаетесь с варикозом?');
        $('.pop_up p').html('Может, стоит сделать что-то для своего здоровья сейчас,<br/>пока это бесплатно?');
        $('.pop_up .button_big').html('Записаться на прием !');
        open_pop_up();
    });

    $('.down_scroll').click(function () {
        $('html, body').animate({
            scrollTop: $("#block_1").offset().top-40
        }, 1000);
    });

};