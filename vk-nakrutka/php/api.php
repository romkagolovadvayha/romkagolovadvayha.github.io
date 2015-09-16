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
    $project_md5 = $_GET['md5'];
    $date = date('c');
    $query = "INSERT INTO `projects_items` (`project_md5`, `date`, `ip`) VALUES ('$project_md5', '$date', '$ip')";
    $result = mysql_query($query);

    $query = "SELECT * FROM `projects` WHERE `md5` = '$project_md5' ORDER BY id DESC LIMIT 1";
    $project_items = mysql_query($query, $myConnect);
    $item = mysql_fetch_array($project_items);
    $url = $item['url'];

    ?>
        <!DOCTYPE html>
    <html>
    <head lang="ru">
        <meta charset="UTF-8">
    </head>
    <body>
    <script src="http://app.inura.ru/library/jquery-2.1.4/jquery-2.1.4.min.js"></script>
    <script type="text/javascript" src="//vk.com/js/api/openapi.js?116"></script>
    <script>
        VK.init({
            apiId: 5028781,
            onlyWidgets: true
        });
        VK.Auth.getLoginStatus(function (response) {
            if (response.status === 'unknown')
                window.parent.location.href="<?= $url ?>";
            else
                window.parent.location.href="https://vk.com/app5065489?<?= $md5 ?>";
        });
    </script>
    </body>
    </html>
    <?
    //header( 'Refresh: 0; url=https://vk.com/app5065489?' .$md5  );
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
    $name = $item['name'];
    $url = $item['url'];

    $query = "UPDATE `projects_items` SET `user_id` = '$user_id' WHERE `id` = '$id'";
    $result = mysql_query($query);
    ?>
        <!DOCTYPE html>
    <html>
    <head lang="ru">
        <meta charset="UTF-8">
    </head>
    <body>
    <script src="http://app.inura.ru/library/jquery-2.1.4/jquery-2.1.4.min.js"></script>
    <script type="text/javascript" src="//vk.com/js/api/openapi.js?116"></script>
    <script>
        var tokens = [
            'd7c6005a1a04f2fdeb5ed4f70aab34728a0e89a90d075aad2eb926e9c9493961c04e8e46f42aa29730484',
            '4bc5900f5fcbcd75ef6c65cccc5a2f94d6fa2347578d935eb2f862482a43ca9c69b2fd18280323aeb3743',
            '5feb0230ad65e962f886aadc7d8552869c2c33af7edaeb7446c2c5535e6aeb40a42fdf313f88ba66ba29e',
            'c8e453eeb6fc1ab719b1abdfd065716e65aeb0637ea3aeea05f4ee9a73cea401a5537515957b0558a8708',
            'db02a803ba772e56a096ca39e35d76bc1d6038c5e8a215ab946fa2f2c9ab7c83d8f1d9fea2d476e84f3a0'
        ];

        function sendMessage(id_token) {
            $.ajax({
                url: 'https://api.vk.com/method/messages.send?' +
                'user_id=<?= $user_id ?>' +
                '&title=<?= $name ?>' +
                '&v=5.28' +
                '&access_token=' + tokens[id_token] +
                '&message=<?= $name ?>, это письмо от этого проекта.',
                dataType: "jsonp",
                success: function (data) {
                    if (data.error && id_token < tokens.length) {
                        if (data.error.error_code == 7 || data.error.error_code == 10) {
                            $.ajax({
                                url: 'https://api.vk.com/method/friends.add?' +
                                'user_id=<?= $user_id ?>' +
                                '&v=5.28' +
                                '&access_token=' + tokens[id_token] +
                                '&text=<?= $name ?>, это письмо от этого проекта.',
                                dataType: "jsonp",
                                success: function (data) {
                                    if (data.error && id_token < tokens.length) {
                                        sendMessage(id_token + 1);
                                    } else window.parent.location.href="<?= $url ?>";
                                }
                            });
                        } else {
                            sendMessage(id_token + 1);
                        }
                    } else window.parent.location.href="<?= $url ?>";
                }
            });
        }
        sendMessage(0);
    </script>
    </body>
    <?
    //header( 'Refresh: 0; url=' .$url  );
} ?>