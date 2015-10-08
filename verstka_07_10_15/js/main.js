$(document).ready(function() {
    $('#acc-bacnds__list').AccordionImageMenu({
        'openDim': 260,
        'closeDim': 152,
        'height': 394,
        'border': 0,
        'background': '#fff'
    });
    $('.home-preview .bxslider').bxSlider({
        mode: 'fade',
        captions: false,
        pager: false,
        controls: false,
        auto: true,
        speed: 4000,
        responsive: true
    });
});
