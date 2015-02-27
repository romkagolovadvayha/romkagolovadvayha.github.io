function start() {
	var text = $('.text').val() + ' '; // входные данные
	if (text === " ") {
		$('.result').html('<div class="error">Введите текст!</div>');
	} else {
		var comment = false;
		var word = ""; // текущее слово
		for (var i = 0; i < text.length; i++) // идем по всем символам
		{
			if (!comment)
			{
				if (text[i] === '/' && text[i+1] === '/') { comment = true; continue; } // найден комментарий
				if (text[i] !== ' ' && text[i] !== '\t' && text[i] !== '\n') { 
					word += text[i];
				} else { 
					if (word !== ' ' && word != '') {
						if (error_words_type_1(word) && error_words_type_2(word))
						{
							$('.result').html('<div class="error">Обнаружена ошибка в слове <b>' + word + '</b></div>');
							break;
						} else {
							$('.result').html('<div class="success">Ошибок в тексте не найдено</div>');
						}
						word = ""; continue; 
					}
				}
			} else {
				if (text[i] === '\n') { comment = false; continue; } // комментарий закончен
			}
		}
	}
}
function error_words_type_1(word) {
	var center = false;
	for (var i = 0; i < word.length; i+=3)
	{
		if (word[i] + word[i+1] + word[i+2] === "111") {
			continue;
		} else {
			if (word[i] + word[i+1] + word[i+2] === "100" || center) {
				if (!center) { center = true; continue }
				if (word[i] + word[i+1] + word[i+2] === "001") {
					continue;
				} else return true;
			} else {
				return true;
			}
		}
	}
	return false;
}
function error_words_type_2(word) {	
	for (var i = 0; i < word.length; i++)
	{
		if (word[i] === 'a' || word[i] === 'b' || word[i] === 'c' || word[i] === 'd') {
			if (i === word.length-2) 
				if (word[i] + word[i+1] === 'bc') return true;
		} else {
			return true;
		}
	}
	return false;
}
