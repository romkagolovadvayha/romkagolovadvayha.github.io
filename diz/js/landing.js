/*

(c) 2014 Евгений Страствурт 
http://strastvurt.ru
e-mail: e-mail: info@strastvurt.ru

*/

// Здесь сделайте необходимые установки

//var mobileParallaxEnabled = false; // Параллакс для мобильников и планшетов запрещён.
// Чтобы разрешить, поставьте true, но при этом прокрутка на мобильных будет тормозить.
var parallaxEnabled = true; // Общий запрет и разрешение параллакса для всех устройств.
var scrollBarEnabled = false; // Скролл-бар включен (false - выключен). На мобильных ScrollBar не отображается
// при отключении этого скролл-бара, параллакса на стационарных компьютерах так же не будет.
var maskPhone = "+7 (999) 999-99-99"; // Маска для телефона. Если тут пустая строка ("") - то маска не используется.
//------------------------------------------------------------------------------------------------------------------
// Всё, что ниже, менять не рекомендуется.

var menuSwitchHeight = 300;
var menuVisible = false;
var logoVisible = true;
var scrollTop = 0;
var scrollStep = 40;
var scrollAbsorber = 700;
var scrollEasing = 'easeOutCubic';
var scrollCorellation; // Высота фиксированного меню наверху, определяется автоматически по #fixedMenu
var winHeight;
var parallaxDelta = 1.5;
var documentHeight;
var touchDevice = false;
var parallax = false; // не менять! 
var sliderHeight;
var scrollPossible = true; 
var fpVisible = false; // видна первая страница с мышью;
var tout = null;
var isGalleryVisible = false;

$(function(){ 
	touchDevice = isTouchDevice();
	if(!touchDevice){
		refreshPage(0);
		if($('body').hasClass('showFirstPage')) {
			$('#warper').prepend('<section class="popup page valign"><div class="inner"><img src="img/mouse.png"></div></section>');
			tout = setTimeout(function(){
				scrollOn('.popup');
				fpVisible = false;
				$('.popup').fadeOut('slow');
			},7000);
		}
		
		$('.popup').click(function(){
			clearInterval(tout);
			scrollOn('.popup');
			fpVisible = false;
			$(this).fadeOut('slow');
		});
		
		$('body').addClass('nomobile');
	} else {
		$('.popup').css('display','none');
		$('body').addClass('mobile');
		$('#scroll').remove();
	}
	$(window).resize(function() {
		resize();
	});
	$('.animated').find('.item').each(function(index, element) {
        if(index%2==0){
			$(element).addClass('even');
		} else {
			$(element).addClass('odd');
		}
    });
	// Если не тач девайс
	if(!touchDevice){
		$('section [data-style], div [data-style]').each(function(index, element) {
			$(element).attr('style',$(element).attr('data-style'))
    	});
	}
	resize(); 
});

function addHandler(object, event, handler, useCapture) {
     if (object.addEventListener) {
         object.addEventListener(event, handler, useCapture ? useCapture : false);
     } else if (object.attachEvent) {
         object.attachEvent('on' + event, handler);
     } else alert("Add handler is not supported");
}

// mouse wheel Listener
function wheel(event) {
    var delta;

	if($('#pageScrollBar').is(':visible')) {
		event = event || window.event;
		if (event.wheelDelta) {
			 delta = event.wheelDelta / 120;
			if (window.opera) delta = -delta;
		 } else if (event.detail) {
			 delta = -event.detail / 3;
		 }
		if (event.preventDefault)  event.preventDefault();
		event.returnValue = false;

		if(fpVisible){
			clearInterval(tout);
			fpVisible = false;
			$('.popup').fadeOut('fast');
		}

		if(scrollPossible){
			scrollPage(delta);
		}

		return delta;
	}
}

// scroll Listener
function onScroll() {
	if(fpVisible){
		clearInterval(tout);
		fpVisible = false;
		$('.popup').fadeOut('fast');
		$('body').stop().animate( {'scrollTop':scrollTop+'px'} );
	}
	scrollTop = $(window).scrollTop();
	refreshPage(0);
}

function isTouchDevice(){ 
    try{ 
        document.createEvent("TouchEvent"); 
        return true; 
    } catch(e) { 
        return false; 
    } 
}

function initTouchScroll(){ 
	var elt=document.getElementById('warper'); 
	var scrollStartPos=0; 

	elt.addEventListener("touchstart", function(event) { 
		scrollStartPos=event.touches[0].pageY; 
		// event.preventDefault(); 
	},false); 

	elt.addEventListener("touchmove", function(event) { 
		delta=scrollStartPos-event.touches[0].pageY;
		scrollStartPos = event.touches[0].pageY;
		$('title').html(delta);
		scrollTop += delta;
		if(scrollTop < 0) scrollTop = 0;
		if((scrollTop+winHeight) >	documentHeight){
			scrollTop = documentHeight-winHeight;
		}
		if($('#warper').is(':animated')) {
			$('#warper').stop();
		} 
		$('#warper').animate({top:-scrollTop+'px'},{duration:scrollAbsorber,easing:scrollEasing}); 
		refreshPage(1);
		event.preventDefault(); 
	},false); 
} 

function refreshScrollBar() {
	if(!scrollBarEnabled) return;
	if(!scrollPossible) return;
	var percent = 100 / (documentHeight - winHeight);
	var percents = scrollTop * percent;
	percent = (winHeight - sliderHeight) / 100;
	var sliderTop = Math.round(percents * percent);
	if($('#pageScrollSlider').is(':animated')) {
		$('#pageScrollSlider').stop();
	}
	$("#pageScrollSlider").animate({top:sliderTop+'px'},{duration:scrollAbsorber,easing:scrollEasing});
}

function refreshPage(animate) {
	// FixedMenu
	if(scrollTop < 10){
		  if(!menuVisible){
			  menuVisible = true;
			  $('#scroll').stop();
			  $('#scroll').fadeIn('slow');
		  }
	  } else {
		  if(menuVisible){
			  menuVisible = false;
			  $('#scroll').stop();
			  $('#scroll').fadeOut('slow');
		  }
	 }
	 // Выдвигающийся логотип
	 /*
	 if(scrollTop > 10){
		  if(!logoVisible){
			  logoVisible = true;
			  $('#logotype').stop();
			  $('#logotype').animate({top:'-146px'},'slow');
		  }
	  } else {
		  if(logoVisible){
			  logoVisible = false;
			  $('#logotype').stop();
			  $('#logotype').animate({top:'0'},'slow');
		  }
	 }*/
	 	
	 // ScrollParallax
	 if(parallax){
		 $('.parallax').each(function(index, element) {
			var top = $(element).position().top;
			var h = $(element).height();
			if( ((scrollTop+winHeight+100) > top) && (scrollTop < (top+h+10)) ){ 
				var distance = h * parallaxDelta - h; // Расстояние, кот. проходит внутри себя
				var delta = scrollTop + winHeight - top; // Сколько прошёл по экрану
				var step = delta / (winHeight + h);  // Сколько прошёл в процентах
				var ptop = -Math.round(distance * step);
				var el = $(element).find('.parallaxing');
				if(animate){
					el.stop();
					el.animate({bottom:ptop+'px'},{duration:scrollAbsorber,easing:scrollEasing});
				} else {
					el.css({bottom:ptop+'px'});
				}
				// Скролл-анимация внутренних элементов
				$(element).find('.scrollAnim').each(function(index, element) {
                    var range, curval;
					var tranzition = $(element).attr('data-transact');
					switch(tranzition){
						case 'left-to-right':	range = winWidth + $(element).width();
												step = range / (winHeight + h);
												curval = Math.round(delta * step) - $(element).width();
												if(animate){
													$(element).stop();
													$(element).animate({left:curval+'px'},{duration:scrollAbsorber,easing:scrollEasing});
												} else {
													$(element).css({left:curval+'px'});
												}
												break;
						case 'rotation':		range = winWidth + $(element).width();
												step = range / (winHeight + h);
												curval = (Math.round(delta * step) - $(element).width()) / 2;
												if(animate){
													$(element).stop();
													$(element).animate({rotate:(curval+'deg')},{duration:2000,easing:scrollEasing});
												} else {
													// $(element).css({rotate:(curval+'deg')});
													$(element).stop();
													$(element).animate({rotate:(curval+'deg')},{duration:2000,easing:scrollEasing});
												}
												break;
						case 'bottom-to-top':	range = $(element).parent().height() + $(element).height();
												step = range / (winHeight + h);
												curval = Math.round(delta * step) - $(element).width();
												if(animate){
													$(element).stop();
													$(element).animate({top:curval+'px'},{duration:scrollAbsorber,easing:scrollEasing});
												} else {
													$(element).css({top:curval+'px'});
												}
												break;
						case 'right-to-left':	range = winWidth + $(element).width();
												step = range / (winHeight + h);
												curval = winWidth - Math.round(delta * step);
												if(animate){
													$(element).stop();
													$(element).animate({left:curval+'px'},{duration:scrollAbsorber,easing:scrollEasing});
												} else {
													$(element).css({left:curval+'px'});
												}
												break;
						case 'left-to-right-mid':	range = winWidth;
												step = range / (winHeight + h);
												curval = Math.round(delta * step);
												if(curval > range*0.5){
													curval = range *0.5 - curval%(range*0.5);
												}
												curval -= $(element).width();
												if(animate){
													$(element).stop();
													$(element).animate({left:curval+'px'},{duration:scrollAbsorber,easing:scrollEasing});
												} else {
													$(element).css({left:curval+'px'});
												}
												break;
						case 'right-to-left-mid':	range = winWidth;
												step = range / (winHeight + h);
												curval = Math.round(delta * step);
												if(curval > range*0.5){
													curval = range * 0.5 - curval%(range*0.5);
												}
												curval = winWidth - curval;
												if(animate){
													$(element).stop();
													$(element).animate({left:curval+'px'},{duration:scrollAbsorber,easing:scrollEasing});
												} else {
													$(element).css({left:curval+'px'});
												}
												break;
						case 'opacity':	range = 100;
										step = range / (winHeight + h);
										curval = delta * step * 0.01;
										if(animate){
											$(element).stop();
											$(element).animate({opacity:curval},{duration:scrollAbsorber,easing:scrollEasing});
										} else {
											$(element).css({opacity:curval});
										}
										break;
						default: alert('Wrong animation:'+tranzition);
					} // switch
                });
				// Конец скролл-анимации внутренних элементов
			 } 
		 }); // .parallax each
		 
		 // Собственная анимация
		 $('.animated').each(function(index, element) {
			var top = $(element).position().top;
			var h = $(element).height();
			if( ((scrollTop+winHeight) > top) && (scrollTop < top+h) ){
				$(element).find('.item').each(function(ind, elem) {
                        if(!$(elem).hasClass('animate')){
							etop = $(elem).position().top + top;
							eh = $(elem).height();
							if ((scrollTop+winHeight) > (etop+eh)) {
								$(elem).addClass('animate');
							}
						}
                    }); // item each
			} else { // if parent is on the screen
				if((scrollTop+winHeight+100) < top) {
					if($(element).hasClass('animated')) {
						$(element).find('.animate').removeClass('animate');
					}
				}
			}
		 }); // .animated each
		 
		// Конец собственной анимации
		 
	 } // Конец параллакса
	 
} // refreshPage

// call from resize() Listener
function resizePage() {
	if(winHeight > 600){
		$('.page').css("height",winHeight+'px');
	}
	
	// Resize video see it: aspect ratio
	/*
	if((winHeight/winWidth) > 0.5625){ 
		$('video').removeAttr('width');
		$('video').attr('height','100%');
	} else {
		$('video').removeAttr('height');
		$('video').attr('width','100%');
	} */
	
	// var tw = winWidth > 940 ? winWidth:940;
	// var fs = Math.round(tw / 20);
	
	// Resize font (прочитать начальное значение)
	/* $('h1').css('font-size',fs+'px');
	fs = Math.round(tw / 26);
	$('h2').css('font-size',fs+'px'); */
	if(parallax){
		$('.parallax').each(function(index, element) {
			var eh = $(element).find('.parallaxCrop').height();
			var obj = $(element).find('.parallaxing');
			var h = Math.round(eh * parallaxDelta);
			obj.css('height',h+'px');
		});
	}
	documentHeight = $('#warper').height();
	if(scrollPossible){
		if(documentHeight <= winHeight){
			$('#pageScrollBar').css('display','none');
			$('#body').css({right:'0'});
			scrollPossible = false;
			scrollTop = 0;
			$('#warper').css({top:0});
			return;
		}
	} else {
		if(documentHeight > winHeight){
			$('#pageScrollBar').css('display','block');
			$("#pageScrollSlider").css({top:'0'});
			var sbw = $('#pageScrollBar').css('width');
			$('#body').css({right:sbw+'px'});
			scrollPossible = true;
		}
	}
	if(scrollPossible){
		if((scrollTop+winHeight) > documentHeight){
			scrollTop = documentHeight-winHeight;
			$('#warper').css({top:-scrollTop+'px'});
		}
	}
	if(isGalleryVisible){
		galResize();
	}
}

// resize Listener
function resize() {
	winWidth = $(window).innerWidth();
	winHeight = $(window).innerHeight();	
	resizePage();	
	refreshPage(0);
	refreshScrollBar();
}

// call from wheel Listener
function scrollPage(delta) { 
	scrollTop += scrollStep * (-delta);
	if(scrollTop < 0) scrollTop = 0;
	if((scrollTop+winHeight) >	documentHeight){
		scrollTop = documentHeight-winHeight;
	}
	if($('#warper').is(':animated')) {
		$('#warper').stop();
	}
	$('#warper').animate({top:-scrollTop+'px'},{duration:scrollAbsorber,easing:scrollEasing});
	refreshPage(1);
	refreshScrollBar();
}

function scrollOn(id, duration) {
	scrollTop = $(id).position().top - scrollCorellation;

	if(scrollTop < 0){
		scrollTop = 0;
	}
	if(scrollTop > (documentHeight - winHeight)) {
		scrollTop = documentHeight - winHeight;
	}
	if(scrollBarEnabled) {
		$('#warper').stop();
		$('#warper').animate({top:-scrollTop+'px'},{duration:duration,easing:'easeOutQuad'});
	} else {
		$('body').stop().animate( {'scrollTop':scrollTop+'px'},{duration:duration,easing:'easeOutQuad'});
		
	}
	refreshPage(0);
	refreshScrollBar();
}

function showMessage(kind) {
	var msg;
	switch(kind){
		case 'payment_success': msg = 'Спасибо, Ваш платёж принят! Следите за сообщениями<br>на e-mail!'; break;
		case 'payment_error': msg = 'При совершении платежа произошла ошибка!'; break;
		default: msg = kind;
	}
	$('#message').html('<h1>'+msg+'</h1>');
	$('#mescont').fadeIn('slow');
}

function showPayment(plan) {
	$('#pageScrollBar').fadeOut('fast');
	$('#plan').val(plan);
	$('#paymentcont').fadeIn('slow');
}

function showParamForm() {
	$('#pageScrollBar').fadeOut('fast');
	$('#paramcont').fadeIn('slow');
}

function showUserForm(kind, head) {
	$('#targetKind').val(kind);
	$('#userFormCaption').html(head);
	$('#pageScrollBar').hide('fast');
	$('#usercont').show('slow');
	yaCounter27066428.reachGoal('TARGET'+kind);
}

function closeMsg(cont, showpb) {
	$('#'+cont).fadeOut('slow');
	if(showpb){
		$('#pageScrollBar').fadeIn('fast');
	}
}

function trim(astr) {
	while(astr.charAt(astr.length-1)==' ') astr=astr.slice(0, astr.length-1);
	while(astr.charAt(0)==' ') astr=astr.slice(1);
	return astr;
}

function isValidEmail(email){
 	return (/^([a-z0-9_\-]+\.)*[a-z0-9_\-]+@([a-z0-9][a-z0-9\-]*[a-z0-9]\.)+[a-z]{2,4}$/i).test(email);
}

function sendForm(formId) {
	if(trim( $('#name').val() )=='') { alert('Введите Ваше имя!'); return 0; }
	if(trim( $('#email').val() )=='') { alert('Введите Ваш почтовый адрес!'); return 0; }
	if(!isValidEmail($('#email').val())) { alert('e-mail введён не верно!'); return 0; }
	// yaCounter24647177.reachGoal('GO_TRENING'); // SEE IT
	document.getElementById(formId).submit();
}

function sendFormAjax(formName) {
	var form = document.forms[formName];
	if(trim(form['name'].value)=='') { showMessage('Введите Ваше имя!'); return 0; }
	if(trim(form['email'].value)=='') { showMessage('Введите Ваш почтовый адрес!'); return 0; }
	if(trim(form['phone'].value)=='') { showMessage('Введите Ваш телефон!'); return 0; }
	if(!isValidEmail(form['email'].value)) { showMessage('e-mail введён не верно!'); return 0; }
	var dat = $(form).serialize();
	$.post('httpr/SendFormData.php', dat, function(text){
		$('.popupForm').fadeOut('slow');
		$('#pageScrollBar').fadeIn('fast');
		showMessage(text);
	});
}

window.onload = function() {
	touchDevice = isTouchDevice();
	parallax = false;
    if(touchDevice){
		scrollBarEnabled = false;
		if(mobileParallaxEnabled && parallaxEnabled){
			parallax = true;
			// $('body').addClass('anim-enabled');
			$('body').css('overflow','hidden');
			$('#body').css('position','fixed');
			$('#warper').css('position','absolute');
			initTouchScroll();
		} 
	} 
	if(scrollBarEnabled){
		// Установка начальной позиции, если уже крутили колесо.
		scrollTop = $(window).scrollTop();
		$('body').css('overflow','hidden');
		$('#body').css('position','fixed');
		$('#warper').css('position','absolute');
		$('#warper').css({top:-scrollTop+'px'});
		$(window).scrollTop(0);
		$('body').css('overflow','hidden');
		refreshPage(0);
		
		$('body').prepend('<div id="pageScrollBar"><div id="pageScrollSlider"></div></div>');
		var sbw = $('#pageScrollBar').css('width');
		$('#body').css('right', '12px');
		$('#pageScrollBar').css('display','block');
		
		$("#pageScrollSlider").draggable({ containment:"#pageScrollBar", drag: function( event, ui ) {
			var percent = 100 / (winHeight-sliderHeight); 
			var percents = ui.position.top * percent; 
			percent = (documentHeight - winHeight) / 100;
			scrollTop = Math.round(percents * percent);
			if(scrollTop < 0) {
				scrollTop = 0;
			}
			if(scrollTop > (documentHeight - winHeight)) {
				scrollTop = documentHeight - winHeight;
			}
			$('#warper').css({top:-scrollTop+'px'});
			refreshPage(0);
		}});
	}
	if((((!touchDevice)&&(parallaxEnabled))||(touchDevice&&mobileParallaxEnabled))&&(parallaxEnabled)) {
		parallax = true;
		$('body').addClass('anim-enabled');
		$('.parallax').each(function(index, element) {
			$(element).prepend('<div class="parallaxCrop"><div class="parallaxing"></div></div>');
			var obj = $(element).find('.parallaxing');
			var bi = $(element).css('background-image');
			obj.css('background-image',bi);
			$(element).css('background-image','none');
		});
	}
	
	if($('#fixedMenu').length){
			scrollCorellation = $('#fixedMenu').height();
	} else {
			scrollCorellation = 0;
	}
	
	if((!touchDevice)&&(scrollBarEnabled)){
		addHandler(window, 'DOMMouseScroll', wheel);
		addHandler(window, 'mousewheel', wheel);
		addHandler(document, 'mousewheel', wheel);
	
		$(window).keydown(function(e) {
	    	if(e.keyCode == '40'){
				scrollPage(-10);
			}
			if(e.keyCode == '38'){
				scrollPage(10);
			}
			if(e.keyCode == '36'){
				scrollTop = 0;
				$('#warper').animate({top:-scrollTop+'px'},{duration:500,easing:'easeOutQuad'});
				refreshPage(0);
				refreshScrollBar();
			}
			if(e.keyCode == '35'){
				scrollTop = documentHeight - winHeight;
				if(scrollTop < 0) scrollTop = 0;
				$('#warper').animate({top:-scrollTop+'px'},{duration:500,easing:'easeOutQuad'});
				refreshPage(0);
				refreshScrollBar();
			}
			if(e.keyCode == '34'){
				$('section').each(function(index, element) {
                    if($(element).position().top-2 > scrollTop+scrollCorellation){
						scrollOn(element);
						return false;
					}
                });
			}
			if(e.keyCode == '33'){
				var lastElement = null;
				$('section').each(function(index, element) {
                    if($(element).position().top+2 >= scrollTop+scrollCorellation){
						if(lastElement){
							scrollOn(lastElement);
						}
						return false;
					}
					lastElement = element;
                });
			}
		});
	}
	if((!touchDevice)&&(!scrollBarEnabled)&&(parallax)){
		$(window).scroll(onScroll);
	}
	sliderHeight = $('#pageScrollSlider').height();
	// Подгрузка данных в ифреймы из внешних источников
	/*$('iframe').each(function(index, element) {
        $(element).attr('src',$(element).attr('data-src'));
    });*/
	$('.click-loading').each(function(index, element) {
	    $(element).click(function(){
			$(this).removeAttr('click');
			$(this).html($(this).attr('data-src'));
		});
    });
	resize();
	if(maskPhone != ''){
		$(".tel").mask(maskPhone);
	}
}

var wait = setInterval(function(){
	h = $('#warper').height();
	if(documentHeight != h){
		documentHeight = h;
		clearInterval(wait);
	}
}, 500);


// FullScreen gallery

function initGallery() {
	$('#prev').click(galPrev);
	$('#next').click(galNext);
	imgCount = $('#gallery ul li').length;  // Глобальная
	if(imgCount==1){
		$('#next').css('display','none');
		$('#prev').css('display','none');
	}
	galResize();
}

function galResize() {
	if(!imgCount) return 0;	
	
	if(winHeight > winWidth){
		$('#gallery ul li img').css({width:'80%',height:'auto'});
	} else {
		$('#gallery ul li img').css({height:'80%',width:'auto'});
	}
	
	var w = winWidth; 
	var h = winHeight;
	
	var gw = w * imgCount + 50;
	$('#gallery ul').css('width',gw+'px');
	$('#gallery ul li').css('width',w+'px');
	$('#gallery ul li').css('height',h+'px');
	
	var pos = -w * curImg;
	$('#gallery').find('ul').css('left',pos+'px');
}


function galPrev() {
	if(curImg > 0) curImg--;
	if(curImg == 0) {
		$('#prev').fadeOut('slow');
	}
	if(curImg == (imgCount-2)) {
		$('#next').fadeIn('slow');
	}
	var w = $('#galCover').width();
	var pos = -w * curImg;
	$('#gallery').find('ul').animate({left:pos+'px'},{duration:800,easing:'easeInOutCubic'});
}

function galNext() {
	if(curImg < (imgCount-1)) curImg++;
	if(curImg == (imgCount-1)) {
		$('#next').fadeOut('slow');
	}
	if(curImg == 1) {
		$('#prev').fadeIn('slow');
	}
	var w = $('#galCover').width();
	var pos = -w * curImg;
	$('#gallery').find('ul').animate({left:pos+'px'},{duration:800,easing:'easeInOutCubic'});
}

function loadGallery(folder) {
	curImg = 0;
	isGalleryVisible = true;
	
	if(!$('#galCover').length){
		$('body').append('<div id="galCover"><div id="galInner"></div><img src="img/btn-close-single.png" class="buttonClose"></div>');
		$('.buttonClose').click(closeGallery);
	}
	$('#pageScrollBar').fadeOut('slow');
	
	$.get('httpr/LoadGallery.php',{folder:folder},function(text){
		$('#galInner').html(text);
		initGallery();
		$('#galCover').fadeIn(1000);
	});
}

function closeGallery() {
	isGalleryVisible = false;
	$('#galCover').fadeOut(1000);
	$('#pageScrollBar').fadeIn('slow');
}

function showSlideMenu() {
	$('#slideMenu').animate({left:'0'},{duration:800, easing:'easeInOutQuad'});
}

function hideSlideMenu() {
	$('#slideMenu').animate({left:'-410px'},{duration:800, easing:'easeInOutQuad'});
}