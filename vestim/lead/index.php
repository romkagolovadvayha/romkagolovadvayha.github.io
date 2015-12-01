<?php 
require 'PHPMailer-5.2.10/PHPMailerAutoload.php';

$name    = htmlspecialchars( trim( $_POST['name'] ) );
$phone   = htmlspecialchars( trim( $_POST['phone'] ) );
// $teacher   = htmlspecialchars( trim( $_POST['teacher'] ) );
if ( strlen( $name ) < 3 || strlen( $phone ) < 3 ) {
    echo 0;
    exit;
}
$subject = 'Перезвоните мне';
$message = 'Перезвоните мне, вот мой номер: ' . $phone;
    
if (true) {
    // $redis->set('landing:hold_mails', 'yes', 30);
    $mail = new PHPMailer;
    $mail->isSMTP();
    $mail->Host = 'dedmoroz18.udm@yandex.ru';
    $mail->SMTPAuth = true;
    $mail->Username = 'dedmoroz18.udm@yandex.ru';
    $mail->Password = '12345qwe';
    $mail->SMTPSecure = 'ssl';
    $mail->Port = 465;

    $mail->From = 'dedmoroz18.udm@yandex.ru';
    $mail->FromName = $name;
    $mail->addAddress('dedmoroz18.udm@yandex.ru', 'DedMoroz Company');
    $mail->isHTML(false);

    $mail->Subject = 'Landing: ' . $subject;
    $mail->Body    =  $message;

    header('Content-Type: text/html;charset=UTF-8');

    if(!$mail->send()) {
        echo 'Спасибо. Мы не перезвоним вам, потому что у нас ошибка на сервере.';
        echo 'Mailer Error: ' . $mail->ErrorInfo;
    } else {
        echo 'Спасибо. Мы перезвоним вам в течении дня.';
    }

    // echo (!$mail->send()) ? 0 : 1;
}