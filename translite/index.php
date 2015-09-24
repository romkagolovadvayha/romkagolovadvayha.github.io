<?php
$key_api = 'trnsl.1.1.20150922T125321Z.0b8dff3cbb752384.cfb80ac8c751f250fffbc1e9adccca538e836a9c';
$text = $_GET['q'];
$lang = 'ru-en';
$url = 'https://translate.yandex.net/api/v1.5/tr.json/translate?key='.$key_api.'&text='.$text.'&lang='.$lang;
$json = file_get_contents($url);
$result = json_decode($json);
echo $result->text[0];