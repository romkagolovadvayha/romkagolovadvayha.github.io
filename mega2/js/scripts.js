//var photo_entity = $(".photo_entity");
//var photo_bg = $(".bg_black");
//$('.photo').click(function () {
//    var element = $(this);
//    photo_entity.css('backgroundImage', "url(" + element.attr('data-href') + ")");
//    destination = 200;
//    $('body, html').animate( { scrollTop: destination }, 1100 );
//    photo_entity.show('hide');
//    photo_bg.show();
//    //element.attr('data-href');
//});
//
//photo_bg.click(function () {
//    photo_entity.hide("slow");
//    photo_bg.hide();
//});

$('#auth .submit').click(function () {
    $('#auth .text').each(function (i, event) {
        var element = $(this);
        if (!element.val())
            element.parent().children('input').addClass('error_input');
        else
            element.parent().children('input').removeClass('error_input');
    });
});

$('.link_input img').click(function () {
    $(this).parent().children('input').toggle();
});

var el = $('.work');
el.each(function (i, event) {
    var element = $(this);
    element.children('img').attr("src", element.data('src'));
});

var modal_photo_concurs = $('#modal_photo_concurs');
$('.work .text').click(function () {
    var element = $(this).parent().parent();
    //destination = 200;
    //$('body, html').animate({scrollTop: destination}, 1100);
    modal_photo_concurs.show('show');
    $('html').css('overflow', 'hidden');
    modal_photo_concurs.children('.window').children('img').attr("src", element.data('src'));
    modal_photo_concurs.children('.window').children('.row').children('.title').html(element.data('title'));
    modal_photo_concurs.children('.window').children('.row').children('.text').html(element.children('.full_text').html());
    modal_photo_concurs.children('.window').children('.row').children('.name').html(element.children('.name').html() + " " + '<span>' + element.data('category') + '</span>');
    $('.close_click').show();
    return false;
});

$('#modal_photo_concurs .close').click(function () {
    modal_photo_concurs.hide('hide');
    $('html').css('overflow', 'visible');
    $('.close_click').hide();
});

$('.close_click').click(function () {
    modal_photo_concurs.hide('hide');
    $('html').css('overflow', 'visible');
    $('.close_click').hide();
});

$('.select .element_active').click(function () {
    $(this).parent().children('.element_active').hide();
    $(this).parent().children('.elements').show();
});


$('.select_filter .element_active').click(function () {
    $(this).parent().children('.elements').show();
});

$('.element').click(function () {
    var elements = $(this).parent();
    elements.children('.active').removeClass('active');
    $(this).addClass('active');
    elements.parent().children('.element_active').html($(this).html());
    elements.hide();
    elements.parent().children('.element_active').show();
});

var photo_element = $('.photo_element');
photo_element.each(function () {
    $(this).children('img').attr('src', $(this).data('src'));
});

photo_element.click(function () {
    var modal_photo = $('.modal_photo');
    modal_photo.children('.window').css('background-image', 'url(' + $(this).data('src') + ')');
    modal_photo.show('show');
    $('.modal_photo .window .window_1').show();
    $('.modal_photo .window .window_2').hide();
    return false;
});

$('.close_modal_photo').click(function () {
    var modal_photo = $('.modal_photo');
    modal_photo.hide('hide');
    return false;
});

$('.arrow_top').click(function () {
    destination = 0;
    $('body, html').animate({scrollTop: destination}, 500);
});

$('#me').click(function () {
    $('.modal_photo .window .window_1').hide();
    $('.modal_photo .window .window_2').show();
});

$('#me_no').click(function () {
    $('.modal_photo .window .window_1').show();
    $('.modal_photo .window .window_2').hide();
});