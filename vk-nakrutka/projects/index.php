<? include '../php/mysql.php'; ?>
<?
$query = "SELECT * FROM `projects` ORDER BY id DESC";
$project_items = mysql_query($query, $myConnect);

$count = mysql_num_rows($project_items);
$items_list = "";
$i = 0;
while ($item = mysql_fetch_array($project_items)) {
    $items_list .= ++$i . '. <a href="/projects/edit.php?id=' . $item['id'] . '" target="_blank">' . $item['name'] . '</a>';
    $items_list .= '<br/>';
    $items_list .= 'Ссылка для отправки: http://app.inura.ru/image/' . $item['md5'] . '.jpg';
    $items_list .= '<br/>';
    $items_list .= 'Ссылка результата: http://app.inura.ru/project/' . $item['md5'] . '';
    $items_list .= '<br/>';
    $items_list .= '<br/>';
}
?>

<!DOCTYPE html>
<html>
<head lang="ru">
    <meta charset="UTF-8">
</head>
<body>
Количество проектов: <b><?= $count ?></b>
<br/>
<br/>
<?= $items_list ?>
</body>
</html>