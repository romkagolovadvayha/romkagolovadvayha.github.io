<? include 'mysql.php'; ?>
<? if ($_GET['q'] == 1) { ?>

    <?
    $md5 = $_GET['md5'];
    $query = "SELECT * FROM `projects_items` WHERE `project_md5` = '$md5' ORDER BY id DESC";
    $project_items = mysql_query($query, $myConnect);

    $count = mysql_num_rows($project_items);
    $items_list = "";
    $i = 0;
    while ($item = mysql_fetch_array($project_items)) {
        $items_list .= ++$i . '. <a href="https://vk.com/id' . $item['user_id'] . '" target="_blank">id' . $item['user_id'] . '</a>';
        $items_list .= '<br/>';
        $items_list .= 'Заходил: ' . $item['date'];
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
    Количество пользователей: <b><?= $count ?></b>
    <br/>
    <br/>
    <?= $items_list ?>
    </body>
    </html>

<? } ?>