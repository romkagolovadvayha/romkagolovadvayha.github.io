$(document).ready(function() {


    var $form = $('.signup-form');

    $form.ajaxForm(function() {
        alert("РњС‹ РїРµСЂРµР·РІРѕРЅРёРј РІР°Рј РІ С‚РµС‡РµРЅРёРё РґРЅСЏ!");
    });

    $("#boxed").fancybox({
        'hideOnContentClick': true
    });

    /***************** Waypoints ******************/

    $('.wp1').waypoint(function() {
        $('.wp1').addClass('animated fadeInUp');
    }, {
        offset: '75%'
    });
    $('.wp2').waypoint(function() {
        $('.wp2').addClass('animated fadeInUp');
    }, {
        offset: '75%'
    });
    $('.wp3').waypoint(function() {
        $('.wp3').addClass('animated fadeInRight');
    }, {
        offset: '75%'
    });

    /***************** Initiate Flexslider ******************/
    $('.flexslider').flexslider({
        animation: "slide"
    });

    /***************** Initiate Fancybox ******************/

    $('.single_image').fancybox({
        padding: 4,
    });

    /***************** Tooltips ******************/
    $('[data-toggle="tooltip"]').tooltip();

    /***************** Nav Transformicon ******************/

    /* When user clicks the Icon */
    $('.nav-toggle').click(function() {
        $(this).toggleClass('active');
        $('.header-nav').toggleClass('open');
        event.preventDefault();
    });
    /* When user clicks a link */
    $('.header-nav li a').click(function() {
        $('.nav-toggle').toggleClass('active');
        $('.header-nav').toggleClass('open');

    });

    /***************** Header BG Scroll ******************/

    $(function() {
        $(window).scroll(function() {
            var scroll = $(window).scrollTop();

            if (scroll >= 20) {
                $('section.navigation').addClass('fixed');
                $('header').css({
                    "border-bottom": "none",
                    "padding": "35px 0"
                });
                $('header .member-actions').css({
                    "top": "26px",
                });
                $('header .navicon').css({
                    "top": "34px",
                });
            } else {
                $('section.navigation').removeClass('fixed');
                $('header').css({
                    "border-bottom": "solid 1px rgba(255, 255, 255, 0.2)",
                    "padding": "50px 0"
                });
                $('header .member-actions').css({
                    "top": "41px",
                });
                $('header .navicon').css({
                    "top": "48px",
                });
            }
        });
    });
    /***************** Smooth Scrolling ******************/

    $(function() {

        $('a[href*=#]:not([href=#])').click(function() {
            if (location.pathname.replace(/^\//, '') === this.pathname.replace(/^\//, '') && location.hostname === this.hostname) {

                var target = $(this.hash);
                target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
                if (target.length) {
                    $('html,body').animate({
                        scrollTop: target.offset().top - 60
                    }, 500);
                    return false;
                }
            }
        });

    });


    ymaps.ready(init);

    function init () {

        var myMap = new ymaps.Map("map", {
                center: [64.548100, 40.574830],
                zoom: 16
            }, {
                searchControlProvider: 'yandex#search'
            }),

            point1 = new ymaps.Placemark([64.547604, 40.576282], {
                hintContent: 'Автовокзал, проспект Дзержинского, 2'
            }, {
                iconLayout: 'default#image',
                iconImageHref: 'img/point1.png',
                iconImageSize: [205, 51],
                iconImageOffset: [-95, -51]
            });

        point2 = new ymaps.Placemark([64.550781, 40.574314], {
            hintContent: 'ЖД Вокзал, площадь 60-летия Октября, 2'
        }, {
            iconLayout: 'default#image',
            iconImageHref: 'img/point2.png',
            iconImageSize: [205, 51],
            iconImageOffset: [-102, -51]
        });

        myMap.geoObjects
            .add(point1)
            .add(point2)
            .add(new ymaps.Placemark([64.547202, 40.573973], {
                balloonContent: 'ООО “ЗЕЛЕНЫЙ СВЕТ”'
            }, {
                iconLayout: 'default#image',
                iconImageHref: 'img/local.png',
                iconImageSize: [93, 120],
                iconImageOffset: [-45, -126]
            }))
        ;

        myMap.behaviors
               .disable(['scrollZoom', 'rightMouseButtonMagnifier']);
        myMap.options.set('scrollZoomSpeed', 0);
    }

});