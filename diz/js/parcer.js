
var submitForm;


/*! on DOM ready */
jQuery(document).ready( function($) {

    /* все данные, включая картинки, грузятся с домена hotdop.ru
    *
    * */

    var domain = '../hotdop.ru';

    var connectorUrl = '../hotdop.ru/selections/calix/reload.php';
    var searchUrl    = '../hotdop.ru/selections/calix/search.php';
    var markUrl      = '../hotdop.ru/selections/calix/mark-ajax.php'


    var nc = 4; /* количество верхних элементов */

    var $selectMark  = $('#selectMark');
    var $selectModel = $('#selectModel');
    var $selectYear  = $('#selectYear');
    var $selectMotor = $('#selectMotor');

    var $listMark  = $('#listMark');
    var $listModel = $('#listModel');
    var $listYear  = $('#listYear');
    var $listMotor = $('#listMotor');

    var $content = $('#contentParcer');

    var gmark, gmodel, gyear, gmotor;

    /* events */
    $('.select-wrapper input').on('focus', function(e){

        /* show list */
        $(this).parent().addClass('select-show');

    }).on('blur', function(){

        /* hide list */
        $(this).parent().removeClass('select-show');

    });

    $selectMark.on('keyup', function(){
        getRequest(markUrl, {"mark": $(this).val()}, function(data){
            $listMark.html(data);
        });
    })

    $('body').on('mousedown', '.mark-item', function(){
        qmark = $(this).attr('value');
        console.log(qmark, $(this));
        $selectMark.val(qmark);
        ajaxRequest(connectorUrl, { "mark" : qmark }, function(data){

            var listArray = data.split('~');
            $listModel.html(listArray[0]);
            $listYear.html(listArray[1]);
            $listMotor.html(listArray[2]);

            $selectModel.val('');
            lockInput($selectModel);
            $selectYear.val('');
            lockInput($selectYear);
            $selectMotor.val('');
            lockInput($selectMotor);

            unlockInput($selectModel);
        })

    });

    $('body').on('mousedown', '.model-item', function(){

        qmodel = $(this).attr('value');

        $selectModel.val(qmodel);
        ajaxRequest(connectorUrl, { "mark" : qmark, "model" : qmodel }, function(data){

            var listArray = data.split('~');
            $listYear.html(listArray[1]);
            $listMotor.html(listArray[2]);

            $selectYear.val('');
            lockInput($selectYear);
            $selectMotor.val('');
            lockInput($selectMotor);

            unlockInput($selectYear);
        })

    });

    $('body').on('mousedown', '.year-item',function(){
        qyear = $(this).attr('value');

        $selectYear.val(qyear);
        ajaxRequest(connectorUrl, { "mark" : qmark, "model" : qmodel, "year": qyear }, function(data){

            var listArray = data.split('~');
            $listMotor.html(listArray[2]);

            $selectMotor.val();
            lockInput($selectMotor);

            unlockInput($selectMotor);
        })

    });

    $('body').on('mousedown', '.motor-item', function(){
        qmotor = $(this).attr('value');
        $selectMotor.val(qmotor);
    });


    /* кнопка поиска */
    $('#findSome').click(function(e){
        ajaxRequest(searchUrl, { "mark" : qmark, "model" : qmodel, "year": qyear, "motor": qmotor}, function(data){

            var rx1 = new RegExp('/selections', 'g');
            var rx2 = new RegExp('/upload', 'g');
            data = data.replace(rx1, domain + '$&').replace(rx2, domain + '$&');
            $content.html(data);

            $('.cbuy-button').addClass('button-4').text('Заказать звонок');
        })
    });

    $('body').on('click', '.complect-type', function(){

        /* get num of elem */
        var id = $(this).attr('id').replace('ctype', '');
        var idx = parseInt(id);

        /* first hide all elements */
        $('.main-info').hide();
        $('#info1, #info2, #info3, #info4').hide();
        $('#border1, #border2, #border3, #border4').hide();
        $('.cbuy').hide();

        for (var i = idx; i <= nc; i++) {
            $('#ctype' + i).removeClass('ctype-active-right ctype-active-mid ctype-active-left');
            $('#plus' + i).hide();
        }

        /* then appears */
        if (idx == 1) {
            $(this).addClass('ctype-active-first');
        }else{
            $(this).addClass('ctype-active-right');
            $('#ctype1').addClass('ctype-active-left');
        }

        for (var j = 1; j <= idx; j++) {

            if (j <= 4) {
                $('#plus' + (j-1)).show();
            }

            if (j > 1 && j < idx) {
                $('#ctype' + j).addClass('ctype-active-mid');
            }

            $('#info' + j).show();
            $('#border' + (j-1)).show();

        }

        $('#minfo' + id).show();
        $('#cbuy'  + id).show()

    });

    $('body').on('click', '.cbuy-button', function(){
        showUserForm('5','Введите Ваши данные и мы вышлем Вам прайс на<br> e-mail');
    });

    $('#feedbackForm').on('submit', function(e) {

        e.preventDefault();
        var data = $(this).serialize();

        if ($('#exampleInputPhone').val() == ''){
            alert('Введите телефон');
            $('#exampleInputPhone').focus();
            return false;
        }

        ajaxRequest('send.php', data, function(r) {
            if (r == '1') {
                $('#feedbackModal').modal('hide');
            }else if (r == '0') {
                alert('Вы не ввели телефон');
            }
        });

        return false;
    });

    $('#feedbackSubmit').on('click', function(e){
        $('#feedbackForm').submit();
    });

    /* ajax Function */
    function ajaxRequest(url, params, callback) {
        var x = callback;
        $.post(url, params, function(data){
            x(data);
        });
    }

    function getRequest(url, params, callback) {
        var x = callback;
        $.get(url, params, function(data){
            x(data);
        });
    }

    function unlockInput($input){
        $input.prop('disabled', false).removeAttr('disabled');
    }

    function lockInput($input){
        $input.attr('disabled', 'disabled');
    }


    /* акции */

    $actionContainer = $('#actionContainer');
    ajaxRequest('action.php', {}, function(r) {
        if (r != '0') {
            $actionContainer.html(r);
        }
    });


});





