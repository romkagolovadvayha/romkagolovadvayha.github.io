var photo_entity = $(".photo_entity");
var photo_bg = $(".bg_black");
var modal_status = false;
$('.photo').click(function () {
    modal_status = !modal_status;
    var element = $(this);
    photo_entity.css('backgroundImage', "url(" + element.attr('data-href') + ")");

    photo_entity.show('hide');
    photo_bg.show();
    //element.attr('data-href');
});

photo_bg.click(function () {
    photo_entity.hide("slow");
    photo_bg.hide();
    modal_status = !modal_status;
});