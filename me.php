<?
$mail = "79061819271"; //e-mail или логин от контакта
$pass = iconv("cp1251", "UTF-8", "саша1234567890"); //пароль от контакта
$id_app = 4236781;

$options = array(
    CURLOPT_USERAGENT => 'Mozilla/5.0 (Windows NT 6.1; rv:30.0) Gecko/20100101 Firefox/30.0',
    CURLOPT_SSL_VERIFYPEER => 0,
    CURLOPT_AUTOREFERER => 1,
    CURLOPT_CRLF => 1,
    CURLOPT_FOLLOWLOCATION => 1,
    CURLOPT_MAXREDIRS => 5,
    CURLOPT_COOKIESESSION => 0,
    CURLOPT_COOKIEFILE => $_SERVER['SCRIPT_FILENAME'] . '.cookies.txt',
    CURLOPT_COOKIEJAR => $_SERVER['SCRIPT_FILENAME'] . '.cookies.txt',
    CURLOPT_HEADER => 0,
    CURLOPT_RETURNTRANSFER => 1
);

function vk_login($email, $pass)
{
    global $options;
    $ch = curl_init("http://m.vk.com/");
    curl_setopt_array($ch, $options);
    $sResponse = curl_exec($ch);
    if ($sResponse === false) {
        echo("CURL Error: " . curl_errno($ch) . " " . curl_error($ch));
        return false;
    }
    curl_close($ch);
    if (!strpos($sResponse, "://login.vk.com/?act=login")) {
        return true;
    }
    if (strpos($sResponse, "://login.vk.com/?act=login") == true) {
        $action = preg_replace("/.*?\<form.*?action\=['\"](.*?)['\"].*?\>.*/si", "$1", $sResponse);
        $ch = curl_init($action);
        curl_setopt_array($ch, $options);
        curl_setopt($ch, CURLOPT_REFERER, "http://m.vk.com/");
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, 'email=' . urlencode($email) . '&pass=' . urlencode($pass) . '');
        $sResponse = curl_exec($ch);
        if ($sResponse === false) {
            echo("CURL Error: " . curl_errno($ch) . " " . curl_error($ch));
            return false;
        }
        curl_close($ch);
        if (strpos($sResponse, "://login.vk.com/?act=login") == true) return false;
        return true;
    } else {
        return false;
    }
}

/* AUTH VK */
vk_login($mail, $pass);

/* Получаем HASH для вступления */
$ch = curl_init("https://vk.com/app$id_app");
curl_setopt_array($ch, $options);
$sResponse = curl_exec($ch);
$domain = preg_replace('/.*?\"domain":"(.*?)",.*/si', "$1", $sResponse);
$hash = preg_replace('/.*?\"hash":"(.*?)",.*/si', "$1", $sResponse);
$api_settings = preg_replace('/.*?\"api_settings":(.*?),.*/si', "$1", $sResponse);
curl_close($ch);print_r($api_settings);

/* Вступаем в приложение */
$ch = curl_init("https://vk.com/$domain?join=1&hash=$hash&sett=$api_settings");
curl_setopt_array($ch, $options);
$sResponse = curl_exec($ch);
curl_close($ch);


/* Получаем HASH */
$ch = curl_init("https://vk.com/app$id_app");
curl_setopt_array($ch, $options);
$sResponse = curl_exec($ch);
$hash = preg_replace('/.*?\"rate_hash":"(.*?)",.*/si', "$1", $sResponse);
curl_close($ch);


/* Ставим рейтинг */
$ch = curl_init("https://vk.com/al_apps.php");
curl_setopt_array($ch, $options);
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, 'act=rate_app&aid='.$id_app.'&al=1&hash=' . urlencode($hash) . '&rate=50');
$sResponse = curl_exec($ch);
curl_close($ch);

