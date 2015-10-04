window.onload = function () {

    $(".city").html('г. ' + ymaps.geolocation.city);
    moment.locale('ru');
    var moment0 = moment();
    var month0 = moment0.format('MMMM');
    var day0 = moment0.format('D');
    var minute0 = moment0.format('m');

    var momentOldDay3 = moment().subtract(2, 'days');
    var month1 = momentOldDay3.format('MMMM');
    var day1 = momentOldDay3.format('D');

    var momentNewDay7 = moment().add(7, 'days');
    var month2 = momentNewDay7.format('MMMM');
    var day2 = momentNewDay7.format('D');

    $('.day1').html(day1);
    $('.day2').html(day2);
    $('.day0').html(day0);
    $('.month1').html(month1);
    $('.month2').html(month2);
    $('.month0').html(month0);

    var el_m = Math.floor(minute0 / 15);
    if (el_m == 0) $('.minute0').html('8');
    if (el_m == 1) $('.minute0').html('12');
    if (el_m == 2) $('.minute0').html('4');
    if (el_m == 3) $('.minute0').html('26');

};

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

$('.open_pop_up_2').click(function () {
    $('.pop_up h3').html('Не знаете сможете ли прийти?');
    $('.pop_up p').html('Все-равно лучше записаться сейчас, а определиться позже.<br/> Чтоб 100% забронировать себе место');
    $('.pop_up .button_big').html('Записаться на прием !');
    open_pop_up();
});

$('.open_pop_up_3').click(function () {
    $('.pop_up h3').html('Какой точный адрес центра?');
    $('.pop_up p').html('Заполните форму, чтобы получить необходимую информацию, <br/>а так же узнать, как к нему лучше подъехать');
    $('.pop_up .button_big').html('ПРОКОНСУЛЬТИРУЙТЕ !');
    open_pop_up();
});