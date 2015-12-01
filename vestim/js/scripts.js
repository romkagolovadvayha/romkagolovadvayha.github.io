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

    $('.pop_up .clos').click(function () {
        close_pop_up();
    });

    $('.open_pop_up_1').click(function () {
        open_pop_up();
    });

    $('.down_scroll').click(function () {
        $('html, body').animate({
            scrollTop: $("#block_1").offset().top-40
        }, 1000);
    });

    $('.section_4 .podarok').click(function () {
       $('.section_4 .podaroks').toggle('show');
    });

    $('#show_rewievs').click(function () {
       $('.show_rewievs').show();
       $('#show_rewievs').hide();
    });

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

    function notifyMsg(msg, msgType) {
        msgType = msgType || 'white';
        $.notify({
            image: (msgType == 'error' || msgType == 'white')
                ? '<i class="fa fa-bell-slash-o"></i>'
                : '<i class="fa fa-bell-o"></i>',
            title: 'Заказ обратного звонка',
            text: msg
        }, {
            style: 'metro',
            className: msgType
        });
    }

    $.notify.addStyle("metro", {
        html: "<div>" +
        "<div class='image' data-notify-html='image'/>" +
        "<div class='text-wrapper'>" +
        "<div class='title' data-notify-html='title'/>" +
        "<div class='text' data-notify-html='text'/>" +
        "</div>" +
        "</div>",
        classes: {
            error: {
                "color": "#fafafa !important",
                "background-color": "#F71919",
                "border": "1px solid #FF0026"
            },
            success: {
                "background-color": "#32CD32",
                "border": "1px solid #4DB149"
            },
            info: {
                "color": "#fafafa !important",
                "background-color": "#1E90FF",
                "border": "1px solid #1E90FF"
            },
            warning: {
                "background-color": "#FAFA47",
                "border": "1px solid #EEEE45"
            },
            black: {
                "color": "#fafafa !important",
                "background-color": "#333",
                "border": "1px solid #000"
            },
            white: {
                "background-color": "#f1f1f1",
                "border": "1px solid #ddd"
            }
        }
    });

    function callbackRequest(name, phone) {
        if (name.length > 2 && phone.length > 2) {
            document.getElementById('hBtn').disabled = 'disabled';
            $.ajax({
                type: "POST",
                url: '/lead/',
                data: {
                    name: name,
                    phone: phone
                }
            }).done(function (response) {
                document.getElementById('hBtn').disabled = null;
                if (response == 1) {
                    notifyMsg('Заяка принята, ожидайте звонка.');
                    $('#modal-callback').modal('hide');
                } else {
                    notifyMsg('Не вышло, на сервере проблемы :/', 'error');
                }
            }).fail(function () {
                document.getElementById('hBtn').disabled = null;
                notifyMsg("Ошибка при отправлении :/", 'error');
            });
        } else {
            notifyMsg("Ошибочка при заполнении", 'white');
        }
    }

    $('#hBtn').click(function () {
        var phone = document.getElementById('phone').value;
        callbackRequest('dedmoroz18.ru', phone);
    });

};