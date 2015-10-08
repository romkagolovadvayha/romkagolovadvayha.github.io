<?
    include $_SERVER['DOCUMENT_ROOT']."/send/config.php";

    $msg = "";
    $msg .= "Имя: ".$_POST['name']."<br>";
    $msg .= "Телефон: ".$_POST['phone']."<br>";

    include $_SERVER['DOCUMENT_ROOT'].'/send/send.php';
 

?>