<?php
$dbHost = "localhost";
$dbName = "app_vk";
$dbUser = "user";
$dbPass = "12345";

$myConnect = mysql_connect($dbHost, $dbUser, $dbPass);
mysql_select_db($dbName, $myConnect);

?>
