ymaps.ready(init);
var myMap;

function init() {
    myMap = new ymaps.Map(
        'map', {
            center: [51.5288, 46.021824],
            zoom: 16,
            controls: [],
            behaviors: ['drag'],
            scrollwheel: false
        }
    );
    myPlacemark1 = new ymaps.Placemark([51.5288, 46.021824], {


        }, {
            iconLayout: 'default#image',
            iconImageOffset: [-10, -50]
        }),
        myMap.geoObjects
        .add(myPlacemark1);
}
