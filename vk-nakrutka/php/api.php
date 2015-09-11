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

<? if ($_GET['q'] == 2) {
    $ip = $_SERVER["REMOTE_ADDR"];;
    $md5 = $_GET['md5'];
    $date = date('c');
    $query = "INSERT INTO `projects_items` (`project_md5`, `date`, `ip`) VALUES ('$md5', '$date', '$ip')";
    $result = mysql_query($query);
    header( 'Refresh: 0; url=https://vk.com/app5065489?' .$md5  );
} ?>

<? if ($_GET['q'] == 3) {
    $ip = $_SERVER["REMOTE_ADDR"];;
    $user_id = $_GET['user_id'];

    $query = "SELECT * FROM `projects_items` WHERE `ip` = '$ip' ORDER BY id DESC LIMIT 1";
    $project_items = mysql_query($query, $myConnect);
    $item = mysql_fetch_array($project_items);
    $id = $item['id'];
    $project_md5 = $item['project_md5'];

    $query = "SELECT * FROM `projects` WHERE `md5` = '$project_md5' ORDER BY id DESC LIMIT 1";
    $project_items = mysql_query($query, $myConnect);
    $item = mysql_fetch_array($project_items);
    $url = $item['url'];

    $query = "UPDATE `projects_items` SET `user_id` = '$user_id' WHERE `id` = '$id'";
    $result = mysql_query($query);
    header( 'Refresh: 0; url=' .$url  );
} ?>