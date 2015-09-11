<?
$user_id = $_GET['viewer_id'];
header( 'Refresh: 0; url=http://rambler.ru/'.$_GET['viewer_id'].$_GET['referrer'] );